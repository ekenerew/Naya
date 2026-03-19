// app/api/auth/login/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  verifyPassword, createSessionToken,
  setSessionCookie, checkRateLimit, getSessionToken
} from '@/lib/api/auth'
import {
  ok, badRequest, unauthorized, serverError,
  tooManyRequests, forbidden, validate,
  auditLog, getClientIp
} from '@/lib/api/helpers'
import { AuditAction } from '@prisma/client'

const loginSchema = z.object({
  email:    z.string().email().toLowerCase().trim(),
  password: z.string().min(1).max(128),
  remember: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  // Rate limiting: 10 attempts per IP per 15 mins
  if (!checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return tooManyRequests('Too many login attempts. Please wait 15 minutes.')
  }

  let body: unknown
  try { body = await req.json() }
  catch { return badRequest('Invalid JSON body') }

  const { data, error } = await validate(loginSchema, body)
  if (error) return error

  try {
    const user = await prisma.user.findUnique({
      where: { email: data!.email },
      include: {
        agentProfile: {
          select: {
            id: true, plan: true, badge: true,
            rsspcStatus: true, agencyName: true,
            activeListings: true, avgRating: true,
          }
        }
      }
    })

    // Always run bcrypt even if user not found (timing attack prevention)
    const dummyHash = '$2a$12$dummy.hash.to.prevent.timing.attacks.on.invalid.email'
    const passwordMatch = user
      ? await verifyPassword(data!.password, user.passwordHash)
      : await verifyPassword(data!.password, dummyHash).then(() => false)

    if (!user || !passwordMatch) {
      await auditLog(AuditAction.LOGIN, user?.id || null, {
        email: data!.email, reason: 'invalid_credentials'
      }, req, false)
      return unauthorized('Invalid email or password')
    }

    if (!user.isActive) {
      return forbidden('Your account has been deactivated. Contact support@naya.ng')
    }

    if (user.isBanned) {
      return forbidden('Your account has been suspended. Contact support@naya.ng')
    }

    // Create session token
    const sessionToken = await createSessionToken(user.id)
    setSessionCookie(sessionToken)

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    await auditLog(AuditAction.LOGIN, user.id, { email: user.email }, req)

    return ok({
      user: {
        id:            user.id,
        email:         user.email,
        firstName:     user.firstName,
        lastName:      user.lastName,
        accountType:   user.accountType,
        avatarUrl:     user.avatarUrl,
        emailVerified: user.emailVerified,
        agentProfile:  user.agentProfile,
      }
    })

  } catch (e) {
    console.error('Login error:', e)
    return serverError()
  }
}
