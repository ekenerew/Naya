// app/api/agents/route.ts
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import {
  ok, serverError, getPagination, paginatedResponse
} from '@/lib/api/helpers'
import { VerificationStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const { page, limit, skip } = getPagination(sp)

  const where: any = { rsspcStatus: VerificationStatus.VERIFIED }

  const neighborhood = sp.get('neighborhood')
  if (neighborhood) where.neighborhoods = { has: neighborhood }

  const badge = sp.get('badge')
  if (badge) where.badge = badge.toUpperCase()

  const plan = sp.get('plan')
  if (plan) where.plan = plan.toUpperCase()

  const q = sp.get('q')
  if (q) {
    where.OR = [
      { agencyName: { contains: q, mode: 'insensitive' } },
      { user: { firstName: { contains: q, mode: 'insensitive' } } },
      { user: { lastName: { contains: q, mode: 'insensitive' } } },
    ]
  }

  const sort = sp.get('sort') || 'rating'
  const orderBy: any =
    sort === 'listings' ? { totalListings: 'desc' } :
    sort === 'sales'    ? { totalSales: 'desc' } :
    sort === 'reviews'  ? { reviewCount: 'desc' } :
    sort === 'experience' ? { yearsActive: 'desc' } :
                          { avgRating: 'desc' }

  try {
    const [agents, total] = await Promise.all([
      prisma.agentProfile.findMany({
        where, skip, take: limit, orderBy,
        include: {
          user: {
            select: {
              firstName: true, lastName: true,
              avatarUrl: true, email: true, phone: true,
            }
          }
        }
      }),
      prisma.agentProfile.count({ where })
    ])

    return ok(paginatedResponse(agents, total, page, limit))
  } catch (e) {
    console.error('GET /api/agents error:', e)
    return serverError()
  }
}
