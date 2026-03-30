import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid' }, { status: 400 }) }
  const { listingId, visitorName, visitorPhone, preferredDay, preferredTime, agentPhone } = body
  if (!listingId) return NextResponse.json({ error: 'listingId required' }, { status: 400 })
  try {
    await prisma.viewingRequest.create({
      data: { listingId, visitorName: visitorName||null, visitorPhone: visitorPhone||null, preferredDay: preferredDay||null, preferredTime: preferredTime||null, status:'PENDING' }
    })
  } catch { /* table may not exist yet — log only */ console.log('[VIEWING REQUEST]', body) }
  const number = (agentPhone||'2348168117004').replace(/\D/g,'')
  const waUrl  = `https://wa.me/${number}`
  return NextResponse.json({ success: true, data: { whatsappUrl: waUrl, message: 'Viewing request ready' } })
}
