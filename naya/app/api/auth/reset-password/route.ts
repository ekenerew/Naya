import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  validatePasswordResetToken, hashPassword,
  hashToken, validatePasswordStrength,
  createSessionToken, attachSessionCookie
} from '@/lib/api/auth'
import { ok, badRequest, serverError, validate, auditLog } from '@/lib/api/helpers'
import { AuditAction } from '@prisma/client'

const schema = z.object({
  token:    z.string().length(64),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return badRequest('Invalid JSON') }
  const { data, error } = await validate(schema, body)
  if (error) return error

  const pwCheck = validatePasswordStrength(data!.password)
  if (!pwCheck.valid) return badRequest('Password too weak', { password: pwCheck.errors })

  const { valid, error: tokenError, record } = await validatePasswordResetToken(data!.token)
  if (!valid || !record) return badRequest(tokenError || 'Invalid or expired reset link')

  try {
    const newHash = await hashPassword(data!.password)
    await prisma.$transaction([
      prisma.user.update({ where: { id: record.userId }, data: { passwordHash: newHash } }),
      prisma.passwordResetToken.update({ where: { tokenHash: hashToken(data!.token) }, data: { usedAt: new Date() } }),
      prisma.session.updateMany({ where: { userId: record.userId }, data: { isValid: false } }),
    ])
    const sessionToken = await createSessionToken(record.userId)
    await auditLog(AuditAction.PASSWORD_RESET, record.userId, {}, req)

    const response = NextResponse.json({ success: true, data: { message: 'Password updated successfully.' } })
    return attachSessionCookie(response, sessionToken)
  } catch (e) {
    console.error('Reset password error:', e)
    return serverError()
  }
}
