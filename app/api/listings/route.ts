import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/api/auth'

// ── GET /api/listings ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const page  = Math.max(1, parseInt(sp.get('page') || '1'))
  const limit = Math.min(50, parseInt(sp.get('limit') || '12'))
  const skip  = (page - 1) * limit

  try {
    const where: any = { status: 'ACTIVE' }
    if (sp.get('type'))         where.listingType   = sp.get('type')!.toUpperCase()
    if (sp.get('propertyType')) where.propertyType  = sp.get('propertyType')!.toUpperCase()
    if (sp.get('neighborhood')) where.neighborhood  = { contains: sp.get('neighborhood'), mode: 'insensitive' }
    if (sp.get('minBeds'))      where.bedrooms       = { gte: parseInt(sp.get('minBeds')!) }
    if (sp.get('minPrice') || sp.get('maxPrice')) {
      where.price = {}
      if (sp.get('minPrice')) where.price.gte = BigInt(sp.get('minPrice')!)
      if (sp.get('maxPrice')) where.price.lte = BigInt(sp.get('maxPrice')!)
    }
    if (sp.get('q')) {
      where.OR = [
        { title:        { contains: sp.get('q'), mode: 'insensitive' } },
        { neighborhood: { contains: sp.get('q'), mode: 'insensitive' } },
        { address:      { contains: sp.get('q'), mode: 'insensitive' } },
      ]
    }

    const sort = sp.get('sort') || 'featured'
    const orderBy: any[] =
      sort === 'price_asc'  ? [{ price: 'asc' }] :
      sort === 'price_desc' ? [{ price: 'desc' }] :
      sort === 'newest'     ? [{ createdAt: 'desc' }] :
      [{ isFeatured: 'desc' }, { createdAt: 'desc' }]

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where, skip, take: limit, orderBy,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          agent: {
            select: {
              id: true, badge: true, agencyName: true,
              user: { select: { firstName: true, lastName: true, avatarUrl: true } }
            }
          }
        }
      }),
      prisma.listing.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: { listings, total, page, pages: Math.ceil(total / limit) }
    })
  } catch (e: any) {
    console.error('[GET listings]', e?.message)
    return NextResponse.json({ success: false, error: 'Failed to fetch listings' }, { status: 500 })
  }
}

// ── POST /api/listings ────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Auth check
  const user = await getCurrentUser(req)
  if (!user) {
    return NextResponse.json({ success: false, error: 'Please sign in to list a property' }, { status: 401 })
  }
  if (!['AGENT','LANDLORD','ADMIN'].includes(user.accountType)) {
    return NextResponse.json({ success: false, error: 'You need an agent or landlord account to list properties' }, { status: 403 })
  }

  // Get or create agent profile
  let agent = await prisma.agentProfile.findUnique({ where: { userId: user.id } })
  if (!agent) {
    agent = await prisma.agentProfile.create({ data: { userId: user.id } })
  }

  // Plan limits
  const limits: Record<string,number> = { STARTER: 3, PRO: 25, PREMIUM: 999 }
  const max = limits[agent.plan] || 3
  if (agent.activeListings >= max) {
    return NextResponse.json({
      success: false,
      error: `Your ${agent.plan} plan allows ${max} active listings. Upgrade to list more.`
    }, { status: 403 })
  }

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }

  // Validate required fields
  const { title, description, propertyType, listingType, price, pricePeriod, address, neighborhood, lga } = body
  if (!title || !description || !propertyType || !listingType || !price || !address || !neighborhood) {
    return NextResponse.json({ success: false, error: 'Please fill in all required fields' }, { status: 400 })
  }

  // Generate unique slug
  const rand = Math.random().toString(36).substring(2, 10)
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}-${rand}`

  try {
    const listing = await prisma.listing.create({
      data: {
        slug,
        agentId:          agent.id,
        title:            title.trim(),
        description:      description.trim(),
        propertyType:     propertyType.toUpperCase(),
        listingType:      listingType.toUpperCase(),
        price:            BigInt(Math.round(Number(String(price).replace(/,/g,'')))),
        pricePeriod:      (pricePeriod || 'YEARLY').toUpperCase(),
        priceNegotiable:  body.priceNegotiable || false,
        bedrooms:         parseInt(body.bedrooms) || 0,
        bathrooms:        parseInt(body.bathrooms) || 0,
        toilets:          parseInt(body.toilets) || 0,
        sizeSqm:          body.sizeSqm ? parseFloat(body.sizeSqm) : null,
        yearBuilt:        body.yearBuilt ? parseInt(body.yearBuilt) : null,
        parkingSpaces:    parseInt(body.parkingSpaces) || 0,
        furnishingStatus: body.furnishingStatus || null,
        address:          address.trim(),
        neighborhood:     neighborhood.trim(),
        lga:              (lga || 'Port Harcourt').trim(),
        state:            'Rivers',
        amenities:        Array.isArray(body.amenities) ? body.amenities : [],
        features:         Array.isArray(body.features)  ? body.features  : [],
        virtualTour:      body.virtualTour || false,
        status:           'PENDING_REVIEW',
        isNew:            true,
      }
    })

    // Update agent stats
    await prisma.agentProfile.update({
      where: { id: agent.id },
      data: { totalListings: { increment: 1 } }
    })

    // Save image URLs if provided
    const imageUrls: string[] = Array.isArray(body.imageUrls) ? body.imageUrls : []
    if (imageUrls.length > 0) {
      await prisma.listingImage.createMany({
        data: imageUrls.map((url: string, i: number) => ({
          listingId:  listing.id,
          url,
          isPrimary:  i === 0,
          sortOrder:  i,
        }))
      })
    }

    console.log(`[LISTING CREATED] ${listing.id} by agent ${agent.id}, photos: ${imageUrls.length}`)

    return NextResponse.json({
      success: true,
      data: { listingId: listing.id, slug: listing.slug, message: 'Listing submitted for review. Goes live within 24 hours.' }
    }, { status: 201 })

  } catch (e: any) {
    console.error('[CREATE LISTING ERROR]', e?.message, e?.code)
    if (e?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'A listing with this title already exists. Please use a slightly different title.' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'Failed to create listing: ' + (e?.message || 'Unknown error') }, { status: 500 })
  }
}
