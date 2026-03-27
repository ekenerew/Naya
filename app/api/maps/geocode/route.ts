import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')
  if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 })
  const key = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  if (!key) return NextResponse.json({ lat: 4.8156, lng: 7.0498, approximate: true })
  try {
    const res  = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Port Harcourt, Nigeria')}&key=${key}`)
    const data = await res.json()
    if (data.status !== 'OK') return NextResponse.json({ lat: 4.8156, lng: 7.0498, approximate: true })
    const loc = data.results[0].geometry.location
    return NextResponse.json({ lat: loc.lat, lng: loc.lng, approximate: false, formatted: data.results[0].formatted_address })
  } catch {
    return NextResponse.json({ lat: 4.8156, lng: 7.0498, approximate: true })
  }
}
