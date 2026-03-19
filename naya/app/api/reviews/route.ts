// app/api/reviews/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  ok, created, badRequest, conflict, notFound,
  serverError, validate, requireAuth
} from '@/lib/api/helpers'

const reviewSchema = z.object({
  agentId:                z.string().min(1),
  listingId:              z.string().min(1).optional(),
  rating:                 z.number().int().min(1).max(5),
  communicationRating:    z.number().int().min(1).max(5).optional(),
  professionalismRating:  z.number().int().min(1).max(5).optional(),
  valueRating:            z.number().int().min(1).max(5).optional(),
  comment:                z.string().min(20).max(1000).trim().optional(),
})

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error

  let body: unknown
  try { body = await req.json() }
  catch { return badRequest('Invalid JSON') }

  const { data, error: ve } = await validate(reviewSchema, body)
  if (ve) return ve

  try {
    // Check agent exists
    const agent = await prisma.agentProfile.findUnique({
      where: { id: data!.agentId }
    })
    if (!agent) return notFound('Agent')

    // Prevent self-review
    if (agent.userId === user!.id) {
      return badRequest('You cannot review yourself')
    }

    // Prevent duplicate review for same listing
    if (data!.listingId) {
      const existing = await prisma.review.findUnique({
        where: { reviewerId_listingId: { reviewerId: user!.id, listingId: data!.listingId } }
      })
      if (existing) return conflict('You have already reviewed this listing')
    }

    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          agentId:               data!.agentId,
          reviewerId:            user!.id,
          listingId:             data!.listingId,
          rating:                data!.rating,
          communicationRating:   data!.communicationRating,
          professionalismRating: data!.professionalismRating,
          valueRating:           data!.valueRating,
          comment:               data!.comment,
        },
        include: {
          reviewer: { select: { firstName: true, lastName: true, avatarUrl: true } }
        }
      })

      // Recalculate agent average rating
      const stats = await tx.review.aggregate({
        where: { agentId: data!.agentId, isPublished: true },
        _avg: { rating: true },
        _count: { id: true }
      })

      await tx.agentProfile.update({
        where: { id: data!.agentId },
        data: {
          avgRating:   stats._avg.rating || 0,
          reviewCount: stats._count.id,
        }
      })

      // Notify agent
      await tx.notification.create({
        data: {
          userId:  agent.userId,
          type:    'review_received',
          title:   'New Review',
          message: `${user!.firstName} ${user!.lastName} left you a ${data!.rating}-star review`,
          href:    `/agents/${agent.id}`,
        }
      })

      return newReview
    })

    return created(review)
  } catch (e) {
    console.error('POST /api/reviews error:', e)
    return serverError()
  }
}
