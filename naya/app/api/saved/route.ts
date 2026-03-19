// app/api/saved/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  ok, created, noContent, badRequest, notFound,
  serverError, validate, requireAuth
} from '@/lib/api/helpers'

// ── GET /api/saved ────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error

  try {
    const saved = await prisma.savedListing.findMany({
      where: { userId: user!.id },
      orderBy: { savedAt: 'desc' },
      include: {
        listing: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            agent: {
              select: {
                badge: true,
                user: { select: { firstName: true, lastName: true } }
              }
            }
          }
        }
      }
    })

    return ok(saved)
  } catch (e) {
    console.error('GET /api/saved error:', e)
    return serverError()
  }
}

// ── POST /api/saved — save or unsave ─────────────────────────
const toggleSchema = z.object({
  listingId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error

  let body: unknown
  try { body = await req.json() }
  catch { return badRequest('Invalid JSON') }

  const { data, error: ve } = await validate(toggleSchema, body)
  if (ve) return ve

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: data!.listingId }
    })
    if (!listing) return notFound('Listing')

    const existing = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId: user!.id, listingId: data!.listingId } }
    })

    if (existing) {
      // Unsave
      await prisma.$transaction([
        prisma.savedListing.delete({
          where: { userId_listingId: { userId: user!.id, listingId: data!.listingId } }
        }),
        prisma.listing.update({
          where: { id: data!.listingId },
          data: { savedCount: { decrement: 1 } }
        })
      ])
      return ok({ saved: false, message: 'Removed from saved listings' })
    } else {
      // Save
      await prisma.$transaction([
        prisma.savedListing.create({
          data: { userId: user!.id, listingId: data!.listingId }
        }),
        prisma.listing.update({
          where: { id: data!.listingId },
          data: { savedCount: { increment: 1 } }
        })
      ])
      return created({ saved: true, message: 'Listing saved' })
    }
  } catch (e) {
    console.error('POST /api/saved error:', e)
    return serverError()
  }
}
