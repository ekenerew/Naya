// app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  hashPassword, validatePasswordStrength,
  createSessionToken, setSessionCookie,
  createEmailVerificationToken, checkRateLimit
} from '@/lib/api/auth'
import {
  ok, badRequest, conflict, serverError,
  tooManyRequests, validate, auditLog, getClientIp
} from '@/lib/api/helpers'
import { AuditAction } from '@prisma/client'

const registerSchema = z.object({
  firstName:       z.string().min(1).max(50).trim(),
  lastName:        z.string().min(1).max(50).trim(),
  email:           z.string().email().toLowerCase().trim(),
  phone:           z.string().min(10).max(20).trim().optional(),
  password:        z.string().min(8).max(128),
  accountType:     z.enum(['SEEKER', 'AGENT', 'LANDLORD']).default('SEEKER'),
  agencyName:      z.string().max(100).trim().optional(),
  rsspcNumber:     z.string().max(30).trim().optional(),
  marketingConsent:z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  // Rate limiting: 5 registrations per IP per 15 mins
  if (!checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000)) {
    return tooManyRequests()
  }

  let body: unknown
  try { body = await req.json() }
  catch { return badRequest('Invalid JSON body') }

  const { data, error } = await validate(registerSchema, body)
  if (error) return error

  // Password strength check
  const pwCheck = validatePasswordStrength(data!.password)
  if (!pwCheck.valid) {
    return badRequest('Password too weak', { password: pwCheck.errors })
  }

  // Check for existing account
  const existing = await prisma.user.findFirst({
    where: { email: data!.email }
  })
  if (existing) {
    await auditLog(AuditAction.REGISTER, null, { email: data!.email, reason: 'email_taken' }, req, false)
    return conflict('An account with this email already exists')
  }

  try {
    const passwordHash = await hashPassword(data!.password)

    // Create user + agent profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email:           data!.email,
          phone:           data!.phone,
          passwordHash,
          accountType:     data!.accountType,
          firstName:       data!.firstName,
          lastName:        data!.lastName,
          marketingConsent:data!.marketingConsent,
        }
      })

      // Create agent profile for agents and landlords
      if (['AGENT', 'LANDLORD'].includes(data!.accountType)) {
        await tx.agentProfile.create({
          data: {
            userId:    newUser.id,
            agencyName:data!.agencyName,
            rsspcNumber:data!.rsspcNumber || null,
          }
        })
      }

      return newUser
    })

    // Create email verification token
    const verifyToken = await createEmailVerificationToken(user.id, user.email)

    // TODO: Send verification email via Resend/Brevo
    // await sendVerificationEmail(user.email, user.firstName, verifyToken)
    console.log(`[DEV] Verify token for ${user.email}: ${verifyToken}`)

    // Create session
    const sessionToken = await createSessionToken(user.id)
    setSessionCookie(sessionToken)

    await auditLog(AuditAction.REGISTER, user.id, {
      accountType: data!.accountType, email: user.email
    }, req)

    return ok({
      user: {
        id:          user.id,
        email:       user.email,
        firstName:   user.firstName,
        lastName:    user.lastName,
        accountType: user.accountType,
        emailVerified: false,
      },
      message: 'Account created. Please verify your email.'
    }, 201)

  } catch (e) {
    console.error('Register error:', e)
    return serverError()
  }
}
