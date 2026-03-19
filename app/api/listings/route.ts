// app/api/listings/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { requireAgent } from '@/lib/api/auth'
import {
  ok, created, badRequest, forbidden, serverError,
  validate, auditLog, getPagination, paginatedResponse,
  generateSlug, getClientIp
} from '@/lib/api/helpers'
import { AuditAction, ListingStatus, ListingType, PropertyType } from '@prisma/client'

// ── GET /api/listings ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const { page, limit, skip } = getPagination(sp)

  try {
    const where: any = { status: ListingStatus.ACTIVE }

    // Filters
    const listingType = sp.get('type')
    if (listingType) where.listingType = listingType.toUpperCase()

    const propertyType = sp.get('propertyType')
    if (propertyType) where.propertyType = propertyType.toUpperCase()

    const neighborhood = sp.get('neighborhood')
    if (neighborhood) where.neighborhood = { contains: neighborhood, mode: 'insensitive' }

    const minPrice = sp.get('minPrice')
    const maxPrice = sp.get('maxPrice')
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = BigInt(minPrice)
      if (maxPrice) where.price.lte = BigInt(maxPrice)
    }

    const minBeds = sp.get('minBeds')
    if (minBeds) where.bedrooms = { gte: parseInt(minBeds) }

    const featured = sp.get('featured')
    if (featured === 'true') where.isFeatured = true

    const verified = sp.get('verified')
    if (verified === 'true') where.isVerified = true

    const q = sp.get('q')
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { neighborhood: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
      ]
    }

    // Sort
    const sortBy = sp.get('sort') || 'featured'
    const orderBy: any[] = []
    if (sortBy === 'price_asc') orderBy.push({ price: 'asc' })
    else if (sortBy === 'price_desc') orderBy.push({ price: 'desc' })
    else if (sortBy === 'newest') orderBy.push({ createdAt: 'desc' })
    else if (sortBy === 'popular') orderBy.push({ views: 'desc' })
    else {
      orderBy.push({ isFeatured: 'desc' })
      orderBy.push({ isPremium: 'desc' })
      orderBy.push({ createdAt: 'desc' })
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where, skip, take: limit, orderBy,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          agent: {
            select: {
              id: true, agencyName: true, badge: true,
              rsspcStatus: true, avgRating: true, reviewCount: true,
              user: { select: { firstName: true, lastName: true, avatarUrl: true } }
            }
          }
        }
      }),
      prisma.listing.count({ where })
    ])

    // Increment view counts asynchronously (fire-and-forget)
    const ids = listings.map(l => l.id)
    if (ids.length > 0) {
      prisma.listing.updateMany({
        where: { id: { in: ids } },
        data: { views: { increment: 1 } }
      }).catch(() => {})
    }

    return ok(paginatedResponse(listings, total, page, limit))
  } catch (e) {
    console.error('GET /api/listings error:', e)
    return serverError()
  }
}

// ── POST /api/listings ────────────────────────────────────────
const createListingSchema = z.object({
  title:         z.string().min(10).max(200).trim(),
  description:   z.string().min(50).max(5000).trim(),
  propertyType:  z.nativeEnum(PropertyType),
  listingType:   z.nativeEnum(ListingType),
  price:         z.number().positive().int(),
  pricePeriod:   z.enum(['MONTHLY', 'YEARLY', 'TOTAL', 'PER_NIGHT']),
  bedrooms:      z.number().int().min(0).max(20).default(0),
  bathrooms:     z.number().int().min(0).max(20).default(0),
  toilets:       z.number().int().min(0).max(20).default(0),
  sizeSqm:       z.number().positive().optional(),
  address:       z.string().min(5).max(200).trim(),
  neighborhood:  z.string().min(2).max(100).trim(),
  lga:           z.string().min(2).max(100).trim(),
  state:         z.string().default('Rivers'),
  latitude:      z.number().optional(),
  longitude:     z.number().optional(),
  amenities:     z.array(z.string()).default([]),
  features:      z.array(z.string()).default([]),
  yearBuilt:     z.number().int().min(1900).max(2030).optional(),
  parkingSpaces: z.number().int().min(0).max(50).default(0),
  virtualTour:   z.boolean().default(false),
  priceNegotiable: z.boolean().default(false),
  titleType:     z.string().optional(),
  landUse:       z.string().optional(),
})

export async function POST(req: NextRequest) {
  const { agent, error } = await requireAgent(req)
  if (error) return error

  // Check plan limits
  const planLimits = { STARTER: 3, PRO: 25, PREMIUM: Infinity }
  const maxListings = planLimits[agent!.plan] || 3
  if (agent!.activeListings >= maxListings) {
    return forbidden(
      `Your ${agent!.plan} plan allows a maximum of ${maxListings} active listings. ` +
      `Upgrade to list more properties.`
    )
  }

  let body: unknown
  try { body = await req.json() }
  catch { return badRequest('Invalid JSON') }

  const { data, error: validationError } = await validate(createListingSchema, body)
  if (validationError) return validationError

  try {
    const id = Math.random().toString(36).substring(2, 10)
    const slug = generateSlug(data!.title, id)

    const listing = await prisma.listing.create({
      data: {
        slug,
        agentId:      agent!.id,
        title:        data!.title,
        description:  data!.description,
        propertyType: data!.propertyType,
        listingType:  data!.listingType,
        price:        BigInt(data!.price),
        pricePeriod:  data!.pricePeriod as any,
        bedrooms:     data!.bedrooms,
        bathrooms:    data!.bathrooms,
        toilets:      data!.toilets,
        sizeSqm:      data!.sizeSqm,
        address:      data!.address,
        neighborhood: data!.neighborhood,
        lga:          data!.lga,
        state:        data!.state,
        latitude:     data!.latitude,
        longitude:    data!.longitude,
        amenities:    data!.amenities,
        features:     data!.features,
        yearBuilt:    data!.yearBuilt,
        parkingSpaces:data!.parkingSpaces,
        virtualTour:  data!.virtualTour,
        priceNegotiable: data!.priceNegotiable,
        titleType:    data!.titleType as any,
        landUse:      data!.landUse as any,
        status:       ListingStatus.PENDING_REVIEW,
      },
      include: { images: true }
    })

    // Update agent active listing count
    await prisma.agentProfile.update({
      where: { id: agent!.id },
      data: { totalListings: { increment: 1 } }
    })

    await auditLog(AuditAction.LISTING_CREATED, agent!.userId, {
      listingId: listing.id, title: listing.title
    }, req)

    return created({
      listing,
      message: 'Listing submitted for review. It will go live within 24 hours.'
    })
  } catch (e) {
    console.error('POST /api/listings error:', e)
    return serverError()
  }
}
