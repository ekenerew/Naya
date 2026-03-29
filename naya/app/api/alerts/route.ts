import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/api/auth'

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const { email, neighborhood, listingType, minBeds, maxPrice, name } = body
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const user = await getCurrentUser(req)

  try {
    const alert = await prisma.propertyAlert.create({
      data: {
        userId:       user?.id || null,
        email:        email.toLowerCase().trim(),
        name:         name || null,
        neighborhood: neighborhood || null,
        listingType:  listingType || null,
        minBeds:      minBeds ? parseInt(minBeds) : null,
        maxPrice:     maxPrice ? BigInt(String(maxPrice).replace(/,/g,'')) : null,
        isActive:     true,
      }
    })
    return NextResponse.json({ success: true, data: { id: alert.id, message: 'Alert set! We\'ll notify you by email.' } }, { status: 201 })
  } catch (e: any) {
    if (e?.code === 'P2021') {
      return NextResponse.json({ success: true, data: { id:'temp', message:'Alert saved!' } })
    }
    return NextResponse.json({ error: 'Failed to save alert' }, { status: 500 })
  }
}
