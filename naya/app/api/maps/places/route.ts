import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const lat = sp.get('lat'), lng = sp.get('lng'), type = sp.get('type') || 'school'
  if (!lat || !lng) return NextResponse.json({ places: [] })
  const key = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  if (!key) return NextResponse.json({ places: [] })
  try {
    const res  = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${type}&key=${key}`)
    const data = await res.json()
    return NextResponse.json({ places: (data.results||[]).slice(0,5).map((p: any) => ({ name:p.name, rating:p.rating, vicinity:p.vicinity, lat:p.geometry.location.lat, lng:p.geometry.location.lng, type })) })
  } catch { return NextResponse.json({ places: [] }) }
}
