// app/api/listings/[id]/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/api/auth'
import {
  ok, noContent, badRequest, unauthorized, forbidden,
  notFound, serverError, validate, auditLog
} from '@/lib/api/helpers'
import { AuditAction, ListingStatus } from '@prisma/client'

// ── GET /api/listings/[id] ────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }]
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        agent: {
          include: {
            user: {
              select: {
                firstName: true, lastName: true,
                avatarUrl: true, phone: true, email: true,
              }
            }
          }
        }
      }
    })

    if (!listing) return notFound('Listing')

    // Increment view count async
    prisma.listing.update({
      where: { id: listing.id },
      data: { views: { increment: 1 } }
    }).catch(() => {})

    return ok(listing)
  } catch (e) {
    console.error('GET /api/listings/[id] error:', e)
    return serverError()
  }
}

// ── PATCH /api/listings/[id] ──────────────────────────────────
const updateSchema = z.object({
  title:         z.string().min(10).max(200).trim().optional(),
  description:   z.string().min(50).max(5000).trim().optional(),
  price:         z.number().positive().int().optional(),
  pricePeriod:   z.enum(['MONTHLY', 'YEARLY', 'TOTAL', 'PER_NIGHT']).optional(),
  bedrooms:      z.number().int().min(0).max(20).optional(),
  bathrooms:     z.number().int().min(0).max(20).optional(),
  sizeSqm:       z.number().positive().optional(),
  address:       z.string().min(5).max(200).trim().optional(),
  amenities:     z.array(z.string()).optional(),
  features:      z.array(z.string()).optional(),
  status:        z.nativeEnum(ListingStatus).optional(),
  priceNegotiable: z.boolean().optional(),
  virtualTour:   z.boolean().optional(),
  availableFrom: z.string().datetime().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser(req)
  if (!user) return unauthorized()

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { agent: true }
  })
  if (!listing) return notFound('Listing')

  // Only the listing owner or admin can update
  const isOwner = listing.agent.userId === user.id
  const isAdmin = user.accountType === 'ADMIN'
  if (!isOwner && !isAdmin) return forbidden()

  let body: unknown
  try { body = await req.json() }
  catch { return badRequest('Invalid JSON') }

  const { data, error } = await validate(updateSchema, body)
  if (error) return error

  try {
    const updateData: any = { ...data }
    if (data!.price) updateData.price = BigInt(data!.price)
    if (data!.availableFrom) updateData.availableFrom = new Date(data!.availableFrom)

    // Re-review if content changed
    const contentChanged = data!.title || data!.description || data!.price || data!.address
    if (contentChanged && listing.status === ListingStatus.ACTIVE) {
      updateData.status = ListingStatus.PENDING_REVIEW
      updateData.isVerified = false
    }

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: updateData,
      include: { images: { orderBy: { sortOrder: 'asc' } } }
    })

    await auditLog(AuditAction.LISTING_UPDATED, user.id, {
      listingId: listing.id, changes: Object.keys(data!)
    }, req)

    return ok(updated)
  } catch (e) {
    console.error('PATCH /api/listings/[id] error:', e)
    return serverError()
  }
}

// ── DELETE /api/listings/[id] ─────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser(req)
  if (!user) return unauthorized()

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { agent: true }
  })
  if (!listing) return notFound('Listing')

  const isOwner = listing.agent.userId === user.id
  const isAdmin = user.accountType === 'ADMIN'
  if (!isOwner && !isAdmin) return forbidden()

  try {
    // Soft delete — unpublish instead of destroy
    await prisma.listing.update({
      where: { id: params.id },
      data: { status: ListingStatus.UNPUBLISHED }
    })

    // Decrement active listing count
    if (listing.status === ListingStatus.ACTIVE) {
      await prisma.agentProfile.update({
        where: { id: listing.agentId },
        data: {
          activeListings: { decrement: 1 }
        }
      })
    }

    await auditLog(AuditAction.LISTING_DELETED, user.id, {
      listingId: listing.id, title: listing.title
    }, req)

    return noContent()
  } catch (e) {
    console.error('DELETE /api/listings/[id] error:', e)
    return serverError()
  }
}
