// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { badRequest, tooManyRequests, serverError, validate, getClientIp } from '@/lib/api/helpers'
import { checkRateLimit } from '@/lib/api/auth'

const schema = z.object({
  phone: z.string().min(10).max(20).trim(),
})

// In-memory OTP store (use Redis in production)
export const otpStore = new Map<string, { otp: string; expires: number; phone: string }>()

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function normalizePhone(phone: string): string {
  // Convert 080x to +2348x
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 11) return '+234' + digits.slice(1)
  if (digits.startsWith('234')) return '+' + digits
  if (digits.startsWith('+234')) return phone
  return '+' + digits
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(`otp:${ip}`, 5, 10 * 60 * 1000)) {
    return tooManyRequests('Too many OTP requests. Please wait 10 minutes.')
  }

  let body: unknown
  try { body = await req.json() } catch { return badRequest('Invalid JSON') }

  const { data, error } = await validate(schema, body)
  if (error) return error

  const phone = normalizePhone(data!.phone)
  const otp = generateOTP()
  const expires = Date.now() + 5 * 60 * 1000 // 5 minutes

  // Store OTP
  const key = phone
  otpStore.set(key, { otp, expires, phone })

  // Send via Termii (Nigerian SMS provider)
  const termiiKey = process.env.TERMII_API_KEY
  if (termiiKey) {
    try {
      const smsRes = await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to:       phone,
          from:     process.env.TERMII_SENDER_ID || 'Naya',
          sms:      `Your Naya verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
          type:     'plain',
          api_key:  termiiKey,
          channel:  'generic',
        })
      })
      const smsData = await smsRes.json()
      console.log('Termii response:', smsData)
    } catch (e) {
      console.error('Termii SMS error:', e)
      // Continue — OTP is stored, just log the failure
    }
  } else {
    // Dev mode — log to console
    console.log(`[DEV] OTP for ${phone}: ${otp}`)
  }

  return NextResponse.json({
    success: true,
    data: {
      message: `Verification code sent to ${phone.slice(0, 6)}****${phone.slice(-3)}`,
      // Only expose OTP in development
      ...(process.env.NODE_ENV === 'development' && { otp }),
    }
  })
}
