// app/api/discover/fetch-listing/route.ts
// Fetches Open Graph metadata from any property URL
// Legal equivalent of how WhatsApp/Twitter generate link previews

import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_DOMAINS = [
  'propertypro.ng', 'nigeriapropertycentre.com', 'jiji.ng',
  'tolet.com.ng', 'propertyfinderng.com', 'africahousing.com',
  'privateproperty.com.ng', 'lamudi.com.ng', 'realtypointng.com',
  'nigeria.realestate', 'nairalist.com', 'facebook.com', 'twitter.com',
]

function extractPrice(text: string): string | null {
  const patterns = [
    /₦[\d,]+(?:\.\d+)?(?:\s*(?:million|m|k|thousand))?/gi,
    /NGN\s*[\d,]+/gi,
    /[\d,]+(?:\.\d+)?\s*(?:million|m)\s*(?:naira)?/gi,
  ]
  for (const p of patterns) {
    const match = text.match(p)
    if (match) return match[0].trim()
  }
  return null
}

function extractBedrooms(text: string): number | null {
  const m = text.match(/(\d+)\s*(?:bed(?:room)?s?|BR)/i)
  return m ? parseInt(m[1]) : null
}

function extractLocation(text: string): string | null {
  const phAreas = ['GRA','Woji','Trans Amadi','Rumuola','Eleme','Rumuokoro','Choba','D-Line','Diobu','Borokiri','Rumueme','Stadium','Peter Odili','Bonny','Oyigbo','Port Harcourt','Rivers State']
  for (const area of phAreas) {
    if (text.toLowerCase().includes(area.toLowerCase())) return area
  }
  return null
}

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { url } = body
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  // Validate URL
  let parsed: URL
  try { parsed = new URL(url) }
  catch { return NextResponse.json({ error: 'Invalid URL. Please paste a valid property link.' }, { status: 400 }) }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return NextResponse.json({ error: 'URL must start with http or https' }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NayaBot/1.0; +https://naya-fawn.vercel.app)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-NG,en;q=0.9',
      },
    })
    clearTimeout(timeout)

    const html = await res.text()

    // Extract Open Graph & meta tags
    const get = (pattern: RegExp) => {
      const m = html.match(pattern)
      return m ? m[1].replace(/&amp;/g,'&').replace(/&quot;/g,'"').trim() : null
    }

    const title = get(/property="og:title"\s+content="([^"]+)"/)
      || get(/name="twitter:title"\s+content="([^"]+)"/)
      || get(/<title[^>]*>([^<]+)<\/title>/i)
      || 'Property Listing'

    const description = get(/property="og:description"\s+content="([^"]+)"/)
      || get(/name="description"\s+content="([^"]+)"/)
      || get(/name="twitter:description"\s+content="([^"]+)"/)
      || ''

    const image = get(/property="og:image"\s+content="([^"]+)"/)
      || get(/name="twitter:image"\s+content="([^"]+)"/)
      || null

    const siteName = get(/property="og:site_name"\s+content="([^"]+)"/)
      || parsed.hostname.replace('www.','')

    // Extract property-specific data from title + description
    const fullText = `${title} ${description}`
    const price    = extractPrice(fullText)
    const bedrooms = extractBedrooms(fullText)
    const location = extractLocation(fullText)

    // Determine listing type
    const lower = fullText.toLowerCase()
    const listingType = lower.includes('sale') || lower.includes('for sale') ? 'SALE'
      : lower.includes('shortlet') || lower.includes('short let') ? 'SHORTLET'
      : lower.includes('rent') || lower.includes('for rent') || lower.includes('let') ? 'RENT'
      : 'RENT'

    return NextResponse.json({
      success: true,
      data: {
        url,
        title:       title.slice(0, 120),
        description: description.slice(0, 500),
        image,
        siteName,
        price,
        bedrooms,
        location,
        listingType,
        domain:      parsed.hostname.replace('www.',''),
        fetchedAt:   new Date().toISOString(),
        verified:    false,
      }
    })
  } catch (e: any) {
    if (e.name === 'AbortError') {
      return NextResponse.json({ error: 'The website took too long to respond. Try a different link.' }, { status: 408 })
    }
    console.error('[FETCH LISTING]', e?.message)
    return NextResponse.json({ error: 'Could not fetch listing. The website may block external requests.' }, { status: 422 })
  }
}
