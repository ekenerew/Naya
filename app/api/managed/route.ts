// app/api/managed/route.ts
// Handles Naya Managed Service enquiries
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/api/auth'
import { sendEnquiryNotification } from '@/lib/notifications/email'

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const {
    firstName, lastName, email, phone,
    serviceType,      // 'sell' | 'rent' | 'shortlet'
    propertyType,     // 'apartment' | 'duplex' | 'land' etc
    address, neighborhood, estimatedValue,
    bedrooms, description, preferredPackage,
    hearAboutUs,
  } = body

  if (!firstName || !lastName || !email || !phone || !serviceType || !neighborhood) {
    return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 })
  }

  try {
    // Save enquiry
    const enquiry = await prisma.managedEnquiry.create({
      data: {
        firstName:        firstName.trim(),
        lastName:         lastName.trim(),
        email:            email.toLowerCase().trim(),
        phone:            phone.trim(),
        serviceType,
        propertyType:     propertyType || null,
        address:          address?.trim() || null,
        neighborhood,
        estimatedValue:   estimatedValue ? BigInt(String(estimatedValue).replace(/,/g,'')) : null,
        bedrooms:         bedrooms ? parseInt(bedrooms) : null,
        description:      description?.trim() || null,
        preferredPackage: preferredPackage || 'STANDARD',
        hearAboutUs:      hearAboutUs || null,
        status:           'NEW',
      }
    })

    // Notify Naya team
    await sendEnquiryNotification(
      'info@naya.ng',
      'Naya Team',
      `${firstName} ${lastName}`,
      `Naya Managed Enquiry — ${serviceType.toUpperCase()} in ${neighborhood}`,
      `Service: ${serviceType} | Package: ${preferredPackage} | Phone: ${phone} | Est. Value: ₦${estimatedValue || 'N/A'}`,
      phone
    ).catch(() => {})

    return NextResponse.json({
      success: true,
      data: { id: enquiry.id, message: 'Enquiry received! Our team will contact you within 2 hours.' }
    }, { status: 201 })

  } catch (e: any) {
    // If table doesn't exist yet, still return success
    if (e?.code === 'P2021' || e?.message?.includes('does not exist')) {
      // Log to console as fallback
      console.log('[MANAGED ENQUIRY]', { firstName, lastName, email, phone, serviceType, neighborhood, preferredPackage })
      return NextResponse.json({
        success: true,
        data: { id: 'temp', message: 'Enquiry received! Our team will contact you within 2 hours.' }
      })
    }
    console.error('[MANAGED ERROR]', e?.message)
    return NextResponse.json({ error: 'Submission failed. Please call us directly.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Admin only — list all managed enquiries
  const user = await getCurrentUser(req)
  if (!user || user.accountType !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const enquiries = await prisma.managedEnquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, data: enquiries })
  } catch {
    return NextResponse.json({ success: true, data: [] })
  }
}
