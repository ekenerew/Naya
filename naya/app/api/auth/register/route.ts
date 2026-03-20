import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  hashPassword, validatePasswordStrength,
  createSessionToken, attachSessionCookie, checkRateLimit
} from '@/lib/api/auth'
import { AuditAction } from '@prisma/client'

function ok(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}
function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

const schema = z.object({
  firstName:        z.string().min(1).max(50).trim(),
  lastName:         z.string().min(1).max(50).trim(),
  email:            z.string().email().toLowerCase().trim(),
  phone:            z.string().min(10).max(20).optional(),
  password:         z.string().min(8).max(128),
  accountType:      z.enum(['SEEKER','AGENT','LANDLORD']).default('SEEKER'),
  agencyName:       z.string().max(100).optional(),
  rsspcNumber:      z.string().max(30).optional(),
  marketingConsent: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000)) {
      return err('Too many requests. Please wait and try again.', 429)
    }

    // Parse body
    let body: unknown
    try { body = await req.json() }
    catch { return err('Invalid request body') }

    // Validate
    const result = schema.safeParse(body)
    if (!result.success) {
      const msg = result.error.errors[0]?.message || 'Validation failed'
      return err(msg)
    }
    const data = result.data

    // Check password strength
    const pwCheck = validatePasswordStrength(data.password)
    if (!pwCheck.valid) {
      return err(pwCheck.errors[0] || 'Password is too weak')
    }

    // Check if email exists
    const existing = await prisma.user.findFirst({ where: { email: data.email } })
    if (existing) return err('An account with this email already exists', 409)

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email:            data.email,
          phone:            data.phone || null,
          passwordHash,
          accountType:      data.accountType,
          firstName:        data.firstName,
          lastName:         data.lastName,
          marketingConsent: data.marketingConsent,
          isActive:         true,
        }
      })

      if (['AGENT','LANDLORD'].includes(data.accountType)) {
        await tx.agentProfile.create({
          data: {
            userId:      newUser.id,
            agencyName:  data.agencyName || null,
            rsspcNumber: data.rsspcNumber || null,
          }
        })
      }

      // Log registration
      await tx.auditLog.create({
        data: {
          userId:    newUser.id,
          action:    AuditAction.REGISTER,
          ipAddress: ip,
          metadata:  { accountType: data.accountType },
          success:   true,
        }
      })

      return newUser
    })

    // Create session token
    const sessionToken = await createSessionToken(user.id)

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id:          user.id,
          email:       user.email,
          firstName:   user.firstName,
          lastName:    user.lastName,
          accountType: user.accountType,
        },
        message: 'Account created successfully!'
      }
    }, { status: 201 })

    return attachSessionCookie(response, sessionToken)

  } catch (e: any) {
    console.error('REGISTER ERROR:', e?.message || e)
    console.error('REGISTER STACK:', e?.stack)

    // Specific Prisma errors
    if (e?.code === 'P2002') {
      return err('An account with this email already exists', 409)
    }
    if (e?.message?.includes('prisma') || e?.message?.includes('database')) {
      return err('Database connection error. Please try again.', 500)
    }

    return err('Registration failed. Please try again.', 500)
  }
}
