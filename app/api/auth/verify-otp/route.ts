// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { createSessionToken, attachSessionCookie, checkRateLimit } from '@/lib/api/auth'
import { badRequest, tooManyRequests, serverError, validate, getClientIp } from '@/lib/api/helpers'
import { otpStore } from '../send-otp/route'

const schema = z.object({
  phone: z.string().min(10).max(20).trim(),
  otp:   z.string().length(6),
  name:  z.string().min(2).max(100).trim().optional(), // for new users
})

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 11) return '+234' + digits.slice(1)
  if (digits.startsWith('234')) return '+' + digits
  return phone.startsWith('+') ? phone : '+' + digits
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(`verify-otp:${ip}`, 10, 10 * 60 * 1000)) {
    return tooManyRequests()
  }

  let body: unknown
  try { body = await req.json() } catch { return badRequest('Invalid JSON') }

  const { data, error } = await validate(schema, body)
  if (error) return error

  const phone = normalizePhone(data!.phone)
  const stored = otpStore.get(phone)

  // Validate OTP
  if (!stored) return badRequest('No OTP found for this number. Please request a new code.')
  if (Date.now() > stored.expires) {
    otpStore.delete(phone)
    return badRequest('OTP has expired. Please request a new code.')
  }
  if (stored.otp !== data!.otp) return badRequest('Invalid code. Please try again.')

  // OTP valid — clear it
  otpStore.delete(phone)

  try {
    // Find or create user
    let user = await prisma.user.findFirst({ where: { phone } })

    if (!user) {
      // New user — create account
      const nameParts = (data!.name || 'Naya User').split(' ')
      user = await prisma.user.create({
        data: {
          email:         `${phone.replace('+', '')}@phone.naya.ng`, // placeholder email
          phone,
          passwordHash:  '', // phone-only account
          firstName:     nameParts[0] || 'User',
          lastName:      nameParts.slice(1).join(' ') || '',
          accountType:   'SEEKER',
          phoneVerified: true,
          isActive:      true,
        }
      })
    } else {
      // Existing user — update phone verified
      await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true, lastLoginAt: new Date() }
      })
    }

    // Create session
    const sessionToken = await createSessionToken(user.id)

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id:          user.id,
          phone:       user.phone,
          firstName:   user.firstName,
          lastName:    user.lastName,
          accountType: user.accountType,
          isNewUser:   !user.lastLoginAt,
        },
        message: 'Signed in successfully'
      }
    })

    return attachSessionCookie(response, sessionToken)

  } catch (e) {
    console.error('Verify OTP error:', e)
    return serverError()
  }
}
