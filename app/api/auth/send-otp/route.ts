import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/api/auth'
import { getClientIp } from '@/lib/api/helpers'

// In-memory OTP store (works on Vercel serverless with short TTL)
const otpStore = new Map<string, { otp: string; expires: number }>()
export { otpStore }

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 11) return '+234' + digits.slice(1)
  if (digits.startsWith('234')) return '+' + digits
  return phone.startsWith('+') ? phone : '+' + digits
}

const schema = z.object({
  phone: z.string().min(10).max(20),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(`otp:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Too many requests. Wait 10 minutes.' }, { status: 429 })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ success: false, error: 'Invalid phone number' }, { status: 400 })
  }

  const phone = normalizePhone(result.data.phone)
  const otp = generateOTP()
  const expires = Date.now() + 5 * 60 * 1000 // 5 minutes

  otpStore.set(phone, { otp, expires })

  // Try Termii SMS if configured
  const termiiKey = process.env.TERMII_API_KEY
  if (termiiKey) {
    try {
      await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          from: process.env.TERMII_SENDER_ID || 'Naya',
          sms: `Your Naya code is: ${otp}. Valid 5 mins. Do not share.`,
          type: 'plain',
          api_key: termiiKey,
          channel: 'generic',
        })
      })
    } catch (e) {
      console.error('SMS failed:', e)
    }
  }

  // Always log OTP so you can test
  console.log(`[NAYA OTP] Phone: ${phone} | Code: ${otp}`)

  return NextResponse.json({
    success: true,
    data: {
      message: `Verification code sent`,
      // Show code directly in response for testing (remove in production)
      debug_otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    }
  })
}
