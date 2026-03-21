// lib/notifications/push.ts
// Web Push notifications via VAPID

import prisma from '@/lib/prisma'

const VAPID_PUBLIC  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_SUBJECT = `mailto:${process.env.EMAIL_FROM || 'noreply@naya.ng'}`

// Build VAPID Authorization header manually (no web-push lib needed)
async function buildVapidAuth(audience: string): Promise<string> {
  const header = { typ: 'JWT', alg: 'ES256' }
  const claims = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
    sub: VAPID_SUBJECT,
  }
  const enc = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url')
  const unsigned = `${enc(header)}.${enc(claims)}`

  // Import private key
  const keyData = Buffer.from(VAPID_PRIVATE, 'base64url')
  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    Buffer.from(unsigned)
  )
  const jwt = `${unsigned}.${Buffer.from(sig).toString('base64url')}`
  return `vapid t=${jwt},k=${VAPID_PUBLIC}`
}

export async function sendWebPush(userId: string, payload: {
  title: string; body: string; icon?: string; url?: string; tag?: string
}): Promise<void> {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.log('[PUSH DEV] Not configured:', payload.title)
    return
  }

  // Get all push subscriptions for user
  let subscriptions: any[] = []
  try {
    subscriptions = await (prisma as any).pushSubscription?.findMany({
      where: { userId }
    }) || []
  } catch { return }

  if (!subscriptions.length) return

  const data = JSON.stringify({
    title: payload.title,
    body:  payload.body,
    icon:  payload.icon || '/naya-logo.png',
    badge: '/naya-logo.png',
    url:   payload.url  || '/',
    tag:   payload.tag  || 'naya-notification',
    timestamp: Date.now(),
  })

  for (const sub of subscriptions) {
    try {
      const endpoint = sub.endpoint
      const audience = new URL(endpoint).origin
      const auth = await buildVapidAuth(audience)

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/octet-stream',
          'Content-Encoding': 'aes128gcm',
          'Authorization': auth,
          'TTL': '86400',
        },
        body: Buffer.from(data),
      })

      if (res.status === 410 || res.status === 404) {
        // Subscription expired — remove it
        await (prisma as any).pushSubscription?.delete({ where: { id: sub.id } }).catch(() => {})
      }
    } catch (e: any) {
      console.error('[PUSH ERROR]', e?.message)
    }
  }
}

// ── Push notification templates ───────────────────────────────
export async function pushNewEnquiry(agentUserId: string, propertyTitle: string, enquirerName: string) {
  return sendWebPush(agentUserId, {
    title: '💬 New Enquiry!',
    body:  `${enquirerName} is interested in "${propertyTitle.slice(0,50)}"`,
    url:   '/portal/dashboard',
    tag:   'new-enquiry',
  })
}

export async function pushListingApproved(userId: string, propertyTitle: string) {
  return sendWebPush(userId, {
    title: '🏠 Listing Approved!',
    body:  `"${propertyTitle.slice(0,50)}" is now live on Naya`,
    url:   '/portal/dashboard',
    tag:   'listing-approved',
  })
}

export async function pushNewMessage(userId: string, fromName: string) {
  return sendWebPush(userId, {
    title: '📨 New Message',
    body:  `${fromName} sent you a message`,
    url:   '/portal/dashboard',
    tag:   'new-message',
  })
}
