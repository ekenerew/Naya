import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/api/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })
  // Placeholder — full implementation in Q3 2026
  return NextResponse.json({ success: true, data: { status: 'coming_soon', message: 'Naya Credit Score launches Q3 2026. You are on the list.' } })
}

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid' }, { status: 400 }) }
  const { email } = body
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
  // Save to waitlist
  console.log('[CREDIT SCORE WAITLIST]', email)
  return NextResponse.json({ success: true, data: { message: 'Added to waitlist! We\'ll notify you at launch.' } })
}
