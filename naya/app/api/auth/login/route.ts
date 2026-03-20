import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, createSessionToken, attachSessionCookie, checkRateLimit } from '@/lib/api/auth'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Too many attempts. Wait 15 minutes.' }, { status: 429 })
  }

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }

  const email = body?.email?.toLowerCase()?.trim()
  const password = body?.password

  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        agentProfile: {
          select: { id: true, plan: true, badge: true, agencyName: true }
        }
      }
    })

    // Log for debugging
    console.log(`[LOGIN] Attempt for: ${email}, user found: ${!!user}, has hash: ${!!user?.passwordHash}`)

    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: 'Account deactivated. Contact support@naya.ng' }, { status: 403 })
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash)
    console.log(`[LOGIN] Password match: ${passwordMatch}`)

    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

    const sessionToken = await createSessionToken(user.id)
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id, email: user.email,
          firstName: user.firstName, lastName: user.lastName,
          accountType: user.accountType, avatarUrl: user.avatarUrl,
          agentProfile: user.agentProfile,
        }
      }
    })
    return attachSessionCookie(response, sessionToken)

  } catch (e: any) {
    console.error('[LOGIN ERROR]', e?.message)
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 })
  }
}
