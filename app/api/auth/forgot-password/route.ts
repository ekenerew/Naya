// app/api/auth/forgot-password/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  createPasswordResetToken, checkRateLimit
} from '@/lib/api/auth'
import {
  ok, badRequest, tooManyRequests,
  serverError, validate, getClientIp
} from '@/lib/api/helpers'

const schema = z.object({
  email: z.string().email().toLowerCase().trim()
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  // Rate limit: 3 requests per email per hour
  if (!checkRateLimit(`forgot-pw:${ip}`, 3, 60 * 60 * 1000)) {
    return tooManyRequests()
  }

  let body: unknown
  try { body = await req.json() }
  catch { return badRequest('Invalid JSON') }

  const { data, error } = await validate(schema, body)
  if (error) return error

  try {
    const user = await prisma.user.findUnique({
      where: { email: data!.email }
    })

    // Always return same response (prevents email enumeration)
    if (user && user.isActive) {
      const rawToken = await createPasswordResetToken(user.id, ip)

      // TODO: Send email via Resend/Brevo
      // await sendPasswordResetEmail(user.email, user.firstName, rawToken)
      console.log(`[DEV] Reset token for ${user.email}: ${rawToken}`)
    }

    return ok({
      message: 'If an account with that email exists, a password reset link has been sent.'
    })
  } catch (e) {
    console.error('Forgot password error:', e)
    return serverError()
  }
}
