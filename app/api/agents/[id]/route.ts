// app/api/agents/[id]/route.ts
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { ok, notFound, serverError } from '@/lib/api/helpers'
import { ListingStatus } from '@prisma/client'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await prisma.agentProfile.findFirst({
      where: {
        OR: [
          { id: params.id },
          { user: { email: params.id } }
        ]
      },
      include: {
        user: {
          select: {
            firstName: true, lastName: true,
            avatarUrl: true, phone: true, email: true,
            createdAt: true,
          }
        },
        listings: {
          where: { status: ListingStatus.ACTIVE },
          take: 6,
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
          include: {
            images: { where: { isPrimary: true }, take: 1 }
          }
        },
        reviewsReceived: {
          where: { isPublished: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: {
              select: { firstName: true, lastName: true, avatarUrl: true }
            }
          }
        }
      }
    })

    if (!agent) return notFound('Agent')

    return ok(agent)
  } catch (e) {
    console.error('GET /api/agents/[id] error:', e)
    return serverError()
  }
}
