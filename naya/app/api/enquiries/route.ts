// app/api/enquiries/route.ts
import { notifyNewEnquiry } from '@/lib/notifications'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getCurrentUser, checkRateLimit } from '@/lib/api/auth'
import {
  ok, created, badRequest, notFound, serverError,
  tooManyRequests, validate, getClientIp, getPagination,
  paginatedResponse, requireAuth
} from '@/lib/api/helpers'
import { EnquiryType, ListingStatus } from '@prisma/client'

// ── POST /api/enquiries ───────────────────────────────────────
const createEnquirySchema = z.object({
  listingId:    z.string().min(1),
  message:      z.string().min(10).max(2000).trim(),
  enquiryType:  z.nativeEnum(EnquiryType).default(EnquiryType.GENERAL),
  moveInDate:   z.string().datetime().optional(),
  viewingDate:  z.string().datetime().optional(),
  budget:       z.number().positive().int().optional(),
  // Guest fields (when not logged in)
  guestName:    z.string().min(2).max(100).trim().optional(),
  guestEmail:   z.string().email().optional(),
  guestPhone:   z.string().min(10).max(20).optional(),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  // Rate limit: 10 enquiries per IP per hour
  if (!checkRateLimit(`enquiry:${ip}`, 10, 60 * 60 * 1000)) {
    return tooManyRequests()
  }

  const user = await getCurrentUser(req)

  let body: unknown
  try { body = await req.json() }
  catch { return badRequest('Invalid JSON') }

  const { data, error } = await validate(createEnquirySchema, body)
  if (error) return error

  // Guest must provide name + email or phone
  if (!user && !data!.guestEmail && !data!.guestPhone) {
    return badRequest('Please provide your email or phone number.')
  }

  try {
    // Get listing with agent
    const listing = await prisma.listing.findUnique({
      where: { id: data!.listingId },
      include: { agent: { include: { user: true } } }
    })

    if (!listing) return notFound('Listing')
    if (listing.status !== ListingStatus.ACTIVE) {
      return badRequest('This listing is no longer available for enquiries.')
    }

    // Prevent duplicate enquiries from same user on same listing
    if (user) {
      const existing = await prisma.enquiry.findFirst({
        where: {
          listingId: listing.id,
          fromUserId: user.id,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      })
      if (existing) {
        return badRequest('You have already sent an enquiry for this listing in the last 24 hours.')
      }
    }

    const enquiry = await prisma.$transaction(async (tx) => {
      // Create enquiry
      const newEnquiry = await tx.enquiry.create({
        data: {
          listingId:   listing.id,
          fromUserId:  user?.id,
          agentId:     listing.agentId,
          guestName:   data!.guestName,
          guestEmail:  data!.guestEmail,
          guestPhone:  data!.guestPhone,
          message:     data!.message,
          enquiryType: data!.enquiryType,
          moveInDate:  data!.moveInDate ? new Date(data!.moveInDate) : undefined,
          viewingDate: data!.viewingDate ? new Date(data!.viewingDate) : undefined,
          budget:      data!.budget ? BigInt(data!.budget) : undefined,
          ipAddress:   ip,
          userAgent:   req.headers.get('user-agent') || undefined,
        }
      })

      // Increment listing enquiry count
      await tx.listing.update({
        where: { id: listing.id },
        data: { enquiryCount: { increment: 1 } }
      })

      // Create notification for agent
      await tx.notification.create({
        data: {
          userId:  listing.agent.userId,
          type:    'new_enquiry',
          title:   'New Enquiry',
          message: `${user ? `${user.firstName} ${user.lastName}` : data!.guestName || 'Someone'} enquired about "${listing.title}"`,
          href:    `/portal/dashboard`,
        }
      })

      return newEnquiry
    })

    // Fire all notifications (email + SMS + push) 
    notifyNewEnquiry({
      agentUserId:  listing.agent.userId,
      agentEmail:   listing.agent.user.email,
      agentPhone:   listing.agent.user.phone || undefined,
      agentName:    `${listing.agent.user.firstName} ${listing.agent.user.lastName}`,
      enquirerName: user ? `${user.firstName} ${user.lastName}` : data!.guestName || 'A visitor',
      enquirerPhone:user?.phone || data!.guestPhone || undefined,
      propertyTitle:listing.title,
      message:      data!.message,
    }).catch(e => console.error('[NOTIFY]', e))

    // TODO: Send WhatsApp/email notification to agent
    // await sendEnquiryNotification(listing.agent, enquiry, listing)

    return created({
      enquiryId: enquiry.id,
      message:   'Enquiry sent successfully. The agent will respond shortly.'
    })
  } catch (e) {
    console.error('POST /api/enquiries error:', e)
    return serverError()
  }
}

// ── GET /api/enquiries — agent's inbox ────────────────────────
export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error

  const sp = req.nextUrl.searchParams
  const { page, limit, skip } = getPagination(sp)

  try {
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: user!.id }
    })
    if (!agentProfile) return badRequest('Agent profile not found')

    const status = sp.get('status')
    const where: any = { agentId: agentProfile.id }
    if (status) where.status = status.toUpperCase()

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: { select: { id: true, title: true, price: true, neighborhood: true } },
          fromUser: { select: { firstName: true, lastName: true, email: true, phone: true } },
          messages: { orderBy: { createdAt: 'asc' }, take: 1 }
        }
      }),
      prisma.enquiry.count({ where })
    ])

    return ok(paginatedResponse(enquiries, total, page, limit))
  } catch (e) {
    console.error('GET /api/enquiries error:', e)
    return serverError()
  }
}
