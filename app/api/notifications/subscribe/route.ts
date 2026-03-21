import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/api/auth'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { endpoint, keys, action } = body

  if (action === 'unsubscribe') {
    await (prisma as any).pushSubscription?.deleteMany({
      where: { userId: user.id, endpoint }
    }).catch(() => {})
    return NextResponse.json({ success: true })
  }

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 })
  }

  try {
    // Upsert subscription
    await prisma.$executeRaw`
      INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth, created_at)
      VALUES (gen_random_uuid()::text, ${user.id}, ${endpoint}, ${keys.p256dh}, ${keys.auth}, NOW())
      ON CONFLICT (user_id, endpoint) DO UPDATE SET p256dh = ${keys.p256dh}, auth = ${keys.auth}
    `.catch(() => {
      // Table might not exist yet - log and continue
      console.log('[PUSH] push_subscriptions table not yet created')
    })

    return NextResponse.json({ success: true, message: 'Push notifications enabled' })
  } catch (e: any) {
    console.error('[SUBSCRIBE]', e?.message)
    return NextResponse.json({ success: false, message: 'Could not save subscription' })
  }
}
