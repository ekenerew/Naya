import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const origin = sp.get('origin'), dest = sp.get('dest'), mode = sp.get('mode') || 'driving'
  if (!origin || !dest) return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  const key = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  if (!key) return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  try {
    const res  = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&mode=${mode}&key=${key}&region=ng`)
    const data = await res.json()
    if (data.status !== 'OK') return NextResponse.json({ error: 'No route found' }, { status: 404 })
    const leg = data.routes[0].legs[0]
    return NextResponse.json({ duration: leg.duration.text, distance: leg.distance.text, durationValue: leg.duration.value, distanceValue: leg.distance.value })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
