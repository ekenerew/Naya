import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  verifyPassword, createSessionToken,
  attachSessionCookie, checkRateLimit
} from '@/lib/api/auth'
import {
  badRequest, unauthorized, serverError,
  tooManyRequests, forbidden, validate,
  auditLog, getClientIp
} from '@/lib/api/helpers'
import { AuditAction } from '@prisma/client'

const loginSchema = z.object({
  email:    z.string().email().toLowerCase().trim(),
  password: z.string().min(1).max(128),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return tooManyRequests('Too many login attempts. Please wait 15 minutes.')
  }

  let body: unknown
  try { body = await req.json() } catch { return badRequest('Invalid JSON body') }

  const { data, error } = await validate(loginSchema, body)
  if (error) return error

  try {
    const user = await prisma.user.findUnique({
      where: { email: data!.email },
      include: {
        agentProfile: {
          select: { id: true, plan: true, badge: true, rsspcStatus: true, agencyName: true, activeListings: true, avgRating: true }
        }
      }
    })

    const dummyHash = '$2a$12$dummyhashtopreventtimingattacksoninvalidemailaddresses00'
    const passwordMatch = user
      ? await verifyPassword(data!.password, user.passwordHash)
      : (await verifyPassword(data!.password, dummyHash), false)

    if (!user || !passwordMatch) {
      await auditLog(AuditAction.LOGIN, null, { email: data!.email, reason: 'invalid_credentials' }, req, false)
      return unauthorized('Invalid email or password')
    }
    if (!user.isActive)  return forbidden('Your account has been deactivated. Contact support@naya.ng')
    if (user.isBanned)   return forbidden('Your account has been suspended. Contact support@naya.ng')

    const sessionToken = await createSessionToken(user.id)
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
    await auditLog(AuditAction.LOGIN, user.id, { email: user.email }, req)

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id, email: user.email,
          firstName: user.firstName, lastName: user.lastName,
          accountType: user.accountType, avatarUrl: user.avatarUrl,
          emailVerified: user.emailVerified, agentProfile: user.agentProfile,
        }
      }
    })

    return attachSessionCookie(response, sessionToken)

  } catch (e) {
    console.error('Login error:', e)
    return serverError()
  }
}
