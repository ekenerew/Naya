import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, createSessionToken, attachSessionCookie, checkRateLimit } from '@/lib/api/auth'
import { notifyWelcome } from '@/lib/notifications'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Too many requests.' }, { status: 429 })
  }

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }

  const { firstName, lastName, email, phone, password, accountType, agencyName, rsspcNumber, marketingConsent } = body

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ success: false, error: 'Please fill in all required fields' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()

  try {
    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 409 })
    }

    // Hash password directly with bcrypt
    const passwordHash = await bcrypt.hash(password, 12)
    console.log(`[REGISTER] Creating user: ${normalizedEmail}, hash length: ${passwordHash.length}`)

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email:            normalizedEmail,
          phone:            phone || null,
          passwordHash,
          accountType:      accountType || 'SEEKER',
          firstName:        firstName.trim(),
          lastName:         lastName.trim(),
          marketingConsent: marketingConsent || false,
          isActive:         true,
        }
      })

      if (['AGENT', 'LANDLORD'].includes(accountType)) {
        await tx.agentProfile.create({
          data: {
            userId:      newUser.id,
            agencyName:  agencyName || null,
            rsspcNumber: rsspcNumber || null,
          }
        })
      }

      return newUser
    })

    console.log(`[REGISTER] User created: ${user.id}`)
    // Send welcome email + SMS
    notifyWelcome({
      email: user.email, phone: user.phone || undefined,
      firstName: user.firstName, accountType: data.accountType,
    }).catch(() => {})

    const sessionToken = await createSessionToken(user.id)
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id, email: user.email,
          firstName: user.firstName, lastName: user.lastName,
          accountType: user.accountType,
        },
        message: 'Account created successfully!'
      }
    }, { status: 201 })

    return attachSessionCookie(response, sessionToken)

  } catch (e: any) {
    console.error('[REGISTER ERROR]', e?.message, e?.code)
    if (e?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'Registration failed: ' + (e?.message || 'Unknown error') }, { status: 500 })
  }
}
