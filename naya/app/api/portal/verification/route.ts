import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/api/auth'

// GET — fetch current verification status
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    let agent = await prisma.agentProfile.findUnique({
      where: { userId: user.id },
      include: { verificationDocs: { orderBy: { createdAt: 'desc' } } }
    })
    if (!agent) {
      agent = await prisma.agentProfile.create({
        data: { userId: user.id },
        include: { verificationDocs: true }
      }) as any
    }

    return NextResponse.json({
      success: true,
      data: {
        agentId:      agent!.id,
        agencyName:   agent!.agencyName,
        rsspcNumber:  agent!.rsspcNumber,
        rsspcStatus:  agent!.rsspcStatus,
        rsspcVerifiedAt: agent!.rsspcVerifiedAt,
        rsspcExpiresAt:  agent!.rsspcExpiresAt,
        idVerified:   agent!.idVerified,
        cacVerified:  agent!.cacVerified,
        plan:         agent!.plan,
        badge:        agent!.badge,
        docs:         (agent as any).verificationDocs || [],
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}

// POST — submit verification details
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { rsspcNumber, agencyName, cacNumber, whatsapp, bio, yearsActive } = body

  if (!rsspcNumber || rsspcNumber.trim().length < 5) {
    return NextResponse.json({ error: 'Valid RSSPC licence number is required' }, { status: 400 })
  }

  try {
    // Check if RSSPC number is already used by another agent
    const existing = await prisma.agentProfile.findFirst({
      where: { rsspcNumber: rsspcNumber.trim(), userId: { not: user.id } }
    })
    if (existing) {
      return NextResponse.json({
        error: 'This RSSPC number is already registered to another agent. If this is incorrect, contact support@naya.ng'
      }, { status: 409 })
    }

    const agent = await prisma.agentProfile.upsert({
      where: { userId: user.id },
      create: {
        userId:      user.id,
        rsspcNumber: rsspcNumber.trim().toUpperCase(),
        agencyName:  agencyName?.trim() || null,
        cacNumber:   cacNumber?.trim() || null,
        whatsapp:    whatsapp?.trim() || null,
        bio:         bio?.trim() || null,
        yearsActive: yearsActive ? parseInt(yearsActive) : 0,
        rsspcStatus: 'SUBMITTED',
      },
      update: {
        rsspcNumber: rsspcNumber.trim().toUpperCase(),
        agencyName:  agencyName?.trim() || undefined,
        cacNumber:   cacNumber?.trim() || undefined,
        whatsapp:    whatsapp?.trim() || undefined,
        bio:         bio?.trim() || undefined,
        yearsActive: yearsActive ? parseInt(yearsActive) : undefined,
        rsspcStatus: 'SUBMITTED',
      }
    })

    // Notify admin via audit log
    await prisma.auditLog.create({
      data: {
        userId:   user.id,
        action:   'PROFILE_UPDATED',
        metadata: { type: 'rsspc_submission', rsspcNumber: rsspcNumber.trim(), agencyName },
        success:  true,
      }
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Verification submitted. Our team will review within 24–48 hours.', status: 'SUBMITTED' }
    })
  } catch (e: any) {
    console.error('[VERIFICATION]', e?.message)
    return NextResponse.json({ error: e?.message || 'Submission failed' }, { status: 500 })
  }
}
