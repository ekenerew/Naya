import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { createSessionToken, attachSessionCookie, checkRateLimit } from '@/lib/api/auth'
import { getClientIp } from '@/lib/api/helpers'
import { otpStore } from '../send-otp/route'

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 11) return '+234' + digits.slice(1)
  if (digits.startsWith('234')) return '+' + digits
  return phone.startsWith('+') ? phone : '+' + digits
}

const schema = z.object({
  phone: z.string().min(10).max(20),
  otp:   z.string().length(6),
  name:  z.string().min(2).max(100).optional(),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(`verify-otp:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Too many attempts.' }, { status: 429 })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
  }

  const phone = normalizePhone(result.data.phone)
  const stored = otpStore.get(phone)

  if (!stored) {
    return NextResponse.json({ success: false, error: 'No code found. Please request a new one.' }, { status: 400 })
  }
  if (Date.now() > stored.expires) {
    otpStore.delete(phone)
    return NextResponse.json({ success: false, error: 'Code expired. Please request a new one.' }, { status: 400 })
  }
  if (stored.otp !== result.data.otp) {
    return NextResponse.json({ success: false, error: 'Invalid code. Please try again.' }, { status: 400 })
  }

  otpStore.delete(phone)

  try {
    let user = await prisma.user.findFirst({ where: { phone } })

    if (!user) {
      const nameParts = (result.data.name || 'Naya User').split(' ')
      user = await prisma.user.create({
        data: {
          email:         `${phone.replace(/\+/g, '')}@phone.naya.ng`,
          phone,
          passwordHash:  '',
          firstName:     nameParts[0] || 'User',
          lastName:      nameParts.slice(1).join(' ') || '',
          accountType:   'SEEKER',
          phoneVerified: true,
          isActive:      true,
        }
      })
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true, lastLoginAt: new Date() }
      })
    }

    const sessionToken = await createSessionToken(user.id)
    const response = NextResponse.json({
      success: true,
      data: { user: { id: user.id, phone: user.phone, firstName: user.firstName, accountType: user.accountType } }
    })
    return attachSessionCookie(response, sessionToken)

  } catch (e: any) {
    console.error('Verify OTP error:', e?.message)
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 })
  }
}
