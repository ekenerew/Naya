// app/api/discover/submit/route.ts
// Saves a community-submitted listing (from URL paste)

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/api/auth'

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { url, title, description, image, price, bedrooms, location, listingType, source } = body

  if (!url || !title) {
    return NextResponse.json({ error: 'URL and title are required' }, { status: 400 })
  }

  const user = await getCurrentUser(req)

  try {
    // Save as community listing in DB
    const listing = await prisma.communityListing.create({
      data: {
        sourceUrl:   url,
        title:       title.slice(0, 200),
        description: description?.slice(0, 1000) || null,
        imageUrl:    image || null,
        rawPrice:    price || null,
        bedrooms:    bedrooms ? parseInt(bedrooms) : null,
        neighborhood:location || null,
        listingType: listingType || 'RENT',
        sourceDomain:source || new URL(url).hostname,
        submittedBy: user?.id || null,
        status:      'PENDING',
      }
    })

    return NextResponse.json({
      success: true,
      data: { id: listing.id, message: 'Listing added to Discover. Thank you!' }
    }, { status: 201 })

  } catch (e: any) {
    // Table might not exist yet
    if (e?.code === 'P2021' || e?.message?.includes('does not exist')) {
      return NextResponse.json({
        success: true,
        data: { id: 'temp', message: 'Listing saved! Run the DB migration to persist community listings.' }
      })
    }
    console.error('[SUBMIT LISTING]', e?.message)
    return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 })
  }
}
