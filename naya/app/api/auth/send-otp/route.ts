import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/api/auth'

// Shared OTP store
export const otpStore = new Map<string, { otp: string; expires: number }>()

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 11) return '+234' + digits.slice(1)
  if (digits.startsWith('234') && !phone.startsWith('+')) return '+' + digits
  return phone.startsWith('+') ? phone : '+234' + digits
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(`otp:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Too many requests. Wait 10 minutes.' }, { status: 429 })
  }

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }

  if (!body?.phone) {
    return NextResponse.json({ success: false, error: 'Phone number required' }, { status: 400 })
  }

  const phone = normalizePhone(body.phone)
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 })

  console.log(`[OTP] Phone: ${phone} | Code: ${otp}`)

  // Try Termii SMS
  const termiiKey = process.env.TERMII_API_KEY
  let smsSent = false
  if (termiiKey) {
    try {
      const r = await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          from: process.env.TERMII_SENDER_ID || 'N-Alert',
          sms: `Your Naya verification code is ${otp}. Valid for 5 minutes. Do not share.`,
          type: 'plain',
          api_key: termiiKey,
          channel: 'dnd',
        })
      })
      const result = await r.json()
      smsSent = r.ok
      console.log('[TERMII]', result)
    } catch (e) {
      console.error('[TERMII ERROR]', e)
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      message: smsSent ? `Code sent to ${phone}` : `Code generated for ${phone}`,
      // Always return OTP until SMS is configured — remove in production
      otp,
      smsSent,
    }
  })
}
