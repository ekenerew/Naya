// app/api/discover/search/route.ts
// Google Custom Search API + Naya DB listings combined

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function serialize(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'bigint') return Number(obj)
  if (Array.isArray(obj)) return obj.map(serialize)
  if (typeof obj === 'object') {
    const out: any = {}
    for (const k of Object.keys(obj)) out[k] = serialize(obj[k])
    return out
  }
  return obj
}

export async function GET(req: NextRequest) {
  const sp    = req.nextUrl.searchParams
  const q     = sp.get('q')     || ''
  const type  = sp.get('type')  || ''
  const area  = sp.get('area')  || ''
  const page  = parseInt(sp.get('page') || '1')

  const results: any[] = []

  // 1. Search Naya's own DB first
  try {
    const where: any = { status: 'ACTIVE' }
    if (type)  where.listingType  = type.toUpperCase()
    if (area)  where.neighborhood = { contains: area, mode: 'insensitive' }
    if (q) where.OR = [
      { title:        { contains: q, mode: 'insensitive' } },
      { description:  { contains: q, mode: 'insensitive' } },
      { neighborhood: { contains: q, mode: 'insensitive' } },
    ]

    const nayaListings = await prisma.listing.findMany({
      where, take: 8, orderBy: { isFeatured: 'desc' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        agent: { select: { badge: true, rsspcStatus: true, user: { select: { firstName: true, lastName: true } } } }
      }
    })

    nayaListings.forEach(l => results.push({
      id:          l.id,
      type:        'naya',
      verified:    true,
      title:       l.title,
      description: l.description?.slice(0,200),
      price:       Number(l.price),
      pricePeriod: l.pricePeriod,
      bedrooms:    l.bedrooms,
      neighborhood:l.neighborhood,
      listingType: l.listingType,
      image:       l.images[0]?.url || null,
      url:         `/properties/${l.id}`,
      source:      'Naya',
      agentBadge:  l.agent?.badge,
      rsspcStatus: l.agent?.rsspcStatus,
      featured:    l.isFeatured,
    }))
  } catch (e: any) {
    console.error('[DISCOVER DB]', e?.message)
  }

  // 2. Google Custom Search for external listings
  const googleKey = process.env.GOOGLE_CUSTOM_SEARCH_KEY
  const googleCx  = process.env.GOOGLE_CUSTOM_SEARCH_CX

  if (googleKey && googleCx && q) {
    try {
      const query = [
        q,
        area ? area : 'Port Harcourt',
        type ? type.toLowerCase() : '',
        'property Nigeria',
      ].filter(Boolean).join(' ')

      const googleRes = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleCx}&q=${encodeURIComponent(query)}&num=8&start=${(page-1)*8+1}`,
        { next: { revalidate: 3600 } }
      )
      const googleData = await googleRes.json()

      if (googleData.items) {
        googleData.items.forEach((item: any) => {
          const pagemap = item.pagemap || {}
          const og = pagemap.metatags?.[0] || {}

          results.push({
            id:          `google_${Buffer.from(item.link).toString('base64').slice(0,12)}`,
            type:        'external',
            verified:    false,
            title:       item.title?.replace(/ \|.*$/, '').replace(/ -.*$/, '').trim(),
            description: item.snippet,
            price:       null,
            image:       pagemap.cse_image?.[0]?.src || pagemap.cse_thumbnail?.[0]?.src || null,
            url:         item.link,
            source:      new URL(item.link).hostname.replace('www.',''),
            listingType: type?.toUpperCase() || 'RENT',
          })
        })
      }
    } catch (e: any) {
      console.error('[GOOGLE SEARCH]', e?.message)
    }
  }

  // 3. Fallback curated results if no Google key
  if (!process.env.GOOGLE_CUSTOM_SEARCH_KEY && q) {
    const fallback = [
      { source:'PropertyPro', domain:'propertypro.ng' },
      { source:'Nigeria Property Centre', domain:'nigeriapropertycentre.com' },
      { source:'Jiji', domain:'jiji.ng' },
      { source:'ToLet', domain:'tolet.com.ng' },
      { source:'Private Property', domain:'privateproperty.com.ng' },
    ]
    fallback.forEach(f => results.push({
      id:          `fallback_${f.domain}`,
      type:        'external_link',
      verified:    false,
      title:       `Search "${q}" on ${f.source}`,
      description: `Find properties matching your search on ${f.source} — Nigeria's property marketplace`,
      image:       null,
      url:         `https://${f.domain}/search?q=${encodeURIComponent(q + ' Port Harcourt')}`,
      source:      f.source,
      listingType: type?.toUpperCase() || 'RENT',
    }))
  }

  // Sort: Naya verified first, then external
  results.sort((a, b) => {
    if (a.type === 'naya' && b.type !== 'naya') return -1
    if (a.type !== 'naya' && b.type === 'naya') return 1
    return 0
  })

  return NextResponse.json(serialize({
    success: true,
    data: {
      results,
      total: results.length,
      query: q,
      hasGoogleKey: !!process.env.GOOGLE_CUSTOM_SEARCH_KEY,
    }
  }))
}
