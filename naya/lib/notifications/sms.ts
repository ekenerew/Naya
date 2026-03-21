// lib/notifications/sms.ts
// SMS notifications via Termii (Nigeria)

const TERMII_KEY = process.env.TERMII_API_KEY
const SENDER_ID  = process.env.TERMII_SENDER_ID || 'N-Alert'

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 11) return '234' + digits.slice(1)
  if (digits.startsWith('234')) return digits
  if (digits.startsWith('+')) return digits.slice(1)
  return digits
}

async function sendSMS(phone: string, message: string): Promise<boolean> {
  const to = normalizePhone(phone)
  if (!TERMII_KEY) {
    console.log(`[SMS DEV] To: ${to} | Message: ${message}`)
    return true
  }
  try {
    const res = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to, from: SENDER_ID, sms: message,
        type: 'plain', api_key: TERMII_KEY, channel: 'dnd',
      }),
    })
    const data = await res.json()
    if (!res.ok || data.message?.toLowerCase().includes('error')) {
      // Try generic channel as fallback
      const res2 = await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to, from: SENDER_ID, sms: message,
          type: 'plain', api_key: TERMII_KEY, channel: 'generic',
        }),
      })
      const data2 = await res2.json()
      console.log('[SMS FALLBACK]', data2)
      return res2.ok
    }
    console.log(`[SMS SENT] ${to}`)
    return true
  } catch (e: any) {
    console.error('[SMS ERROR]', e?.message)
    return false
  }
}

// ── SMS templates ─────────────────────────────────────────────
export async function sendEnquirySMS(phone: string, agentName: string, propertyTitle: string, enquirerName: string) {
  const msg = `Naya Alert: New enquiry on "${propertyTitle.slice(0, 40)}" from ${enquirerName}. Login to respond: naya-fawn.vercel.app/portal/dashboard`
  return sendSMS(phone, msg)
}

export async function sendOTPSMS(phone: string, otp: string) {
  const msg = `Your Naya verification code is: ${otp}. Valid for 5 minutes. Do not share this code. - Naya Real Estate`
  return sendSMS(phone, msg)
}

export async function sendListingApprovedSMS(phone: string, propertyTitle: string) {
  const msg = `Naya: Your listing "${propertyTitle.slice(0, 50)}" is now LIVE! Buyers can see it. View: naya-fawn.vercel.app`
  return sendSMS(phone, msg)
}

export async function sendWelcomeSMS(phone: string, firstName: string) {
  const msg = `Welcome to Naya, ${firstName}! Nigeria's #1 property marketplace in Port Harcourt. Start exploring: naya-fawn.vercel.app`
  return sendSMS(phone, msg)
}
