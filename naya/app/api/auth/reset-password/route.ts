// app/api/auth/reset-password/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  validatePasswordResetToken, hashPassword,
  hashToken, validatePasswordStrength,
  createSessionToken, setSessionCookie
} from '@/lib/api/auth'
import {
  ok, badRequest, serverError, validate, auditLog
} from '@/lib/api/helpers'
import { AuditAction } from '@prisma/client'

const schema = z.object({
  token:    z.string().min(64).max(64),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() }
  catch { return badRequest('Invalid JSON') }

  const { data, error } = await validate(schema, body)
  if (error) return error

  // Validate password strength
  const pwCheck = validatePasswordStrength(data!.password)
  if (!pwCheck.valid) {
    return badRequest('Password too weak', { password: pwCheck.errors })
  }

  // Validate token
  const { valid, error: tokenError, record } = await validatePasswordResetToken(data!.token)
  if (!valid || !record) {
    return badRequest(tokenError || 'Invalid or expired reset link')
  }

  try {
    const newHash = await hashPassword(data!.password)

    await prisma.$transaction([
      // Update password
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash: newHash }
      }),
      // Mark token as used
      prisma.passwordResetToken.update({
        where: { tokenHash: hashToken(data!.token) },
        data: { usedAt: new Date() }
      }),
      // Invalidate ALL other sessions (security)
      prisma.session.updateMany({
        where: { userId: record.userId },
        data: { isValid: false }
      }),
    ])

    // Create fresh session
    const sessionToken = await createSessionToken(record.userId)
    setSessionCookie(sessionToken)

    await auditLog(AuditAction.PASSWORD_RESET, record.userId, {}, req)

    return ok({ message: 'Password updated successfully. You are now signed in.' })
  } catch (e) {
    console.error('Reset password error:', e)
    return serverError()
  }
}
