import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/api/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['AGENT','LANDLORD','ADMIN'].includes(user.accountType)) {
    return NextResponse.json({ error: 'Agent account required' }, { status: 403 })
  }

  try {
    let agent = await prisma.agentProfile.findUnique({ where: { userId: user.id } })

    // Auto-create agent profile if missing
    if (!agent) {
      agent = await prisma.agentProfile.create({
        data: { userId: user.id }
      })
    }

    const [listings, enquiries, totalListings, activeListings, pendingListings, totalEnquiries, newEnquiries] = await Promise.all([
      prisma.listing.findMany({
        where: { agentId: agent.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { images: { where: { isPrimary: true }, take: 1 } }
      }),
      prisma.enquiry.findMany({
        where: { agentId: agent.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          listing: { select: { title: true, neighborhood: true } },
          fromUser: { select: { firstName: true, lastName: true, phone: true, email: true } }
        }
      }),
      prisma.listing.count({ where: { agentId: agent.id } }),
      prisma.listing.count({ where: { agentId: agent.id, status: 'ACTIVE' } }),
      prisma.listing.count({ where: { agentId: agent.id, status: 'PENDING_REVIEW' } }),
      prisma.enquiry.count({ where: { agentId: agent.id } }),
      prisma.enquiry.count({ where: { agentId: agent.id, status: 'NEW' } }),
    ])

    const totalViews = listings.reduce((sum, l) => sum + l.views, 0)

    return NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, avatarUrl: user.avatarUrl, accountType: user.accountType },
        agent: { id: agent.id, agencyName: agent.agencyName, plan: agent.plan, badge: agent.badge, rsspcNumber: agent.rsspcNumber, rsspcStatus: agent.rsspcStatus, avgRating: agent.avgRating, reviewCount: agent.reviewCount },
        stats: { totalListings, activeListings, pendingListings, totalEnquiries, newEnquiries, totalViews },
        listings,
        enquiries,
      }
    })
  } catch (e: any) {
    console.error('[DASHBOARD]', e?.message)
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
