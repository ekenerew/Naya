import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import NEIGHBOURHOODS from '@/lib/neighbourhoods-data'

function serialize(obj: any): any {
  if (typeof obj === 'bigint') return Number(obj)
  if (Array.isArray(obj)) return obj.map(serialize)
  if (obj && typeof obj === 'object') { const o: any = {}; for (const k of Object.keys(obj)) o[k] = serialize(obj[k]); return o }
  return obj
}

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const { neighborhood, listingType, bedrooms, price } = body
  if (!neighborhood || !price) return NextResponse.json({ error: 'neighborhood and price required' }, { status: 400 })

  const askingPrice = Number(String(price).replace(/,/g,''))
  const areaData = NEIGHBOURHOODS.find(n => n.name.toLowerCase() === neighborhood.toLowerCase() || n.slug === neighborhood.toLowerCase().replace(/\s+/g,'-'))

  // Get comparable listings from DB
  let comparables: any[] = []
  try {
    comparables = await prisma.listing.findMany({
      where: { neighborhood: { contains: neighborhood, mode:'insensitive' }, listingType: listingType?.toUpperCase() || 'RENT', status:'ACTIVE', bedrooms: bedrooms ? parseInt(bedrooms) : undefined },
      take: 10, select: { price:true, bedrooms:true, title:true, id:true }
    })
  } catch {}

  // Get market data from neighbourhood data
  let marketMin = 0, marketMax = 0, marketAvg = 0, verdict = 'fair', percentageDiff = 0

  if (areaData) {
    const beds = parseInt(bedrooms) || 3
    const type = (listingType || 'rent').toLowerCase()
    if (type === 'rent') {
      const rentData = areaData.avgRentPerYear
      marketAvg = beds <= 1 ? rentData.oneBed : beds === 2 ? rentData.twoBed : beds === 3 ? rentData.threeBed : rentData.fourBed
      marketMin = marketAvg * 0.8; marketMax = marketAvg * 1.3
    } else {
      const saleData = areaData.avgSalePrice
      marketAvg = beds <= 1 ? saleData.oneBed : beds === 2 ? saleData.twoBed : beds === 3 ? saleData.threeBed : saleData.fourBed
      marketMin = marketAvg * 0.8; marketMax = marketAvg * 1.3
    }
    percentageDiff = marketAvg > 0 ? Math.round(((askingPrice - marketAvg) / marketAvg) * 100) : 0
    verdict = percentageDiff <= -15 ? 'great_deal' : percentageDiff <= 5 ? 'fair' : percentageDiff <= 20 ? 'slightly_high' : 'overpriced'
  }

  const fmt = (n: number) => n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n.toLocaleString()}`
  const verdictConfig = {
    great_deal:    { label:'Great Deal!',      color:'emerald', emoji:'🎉', message:`This price is ${Math.abs(percentageDiff)}% below market rate for ${bedrooms}-bed in ${neighborhood}. Excellent value.` },
    fair:          { label:'Fair Price',       color:'blue',    emoji:'✅', message:`This is in line with market rates for ${bedrooms}-bed properties in ${neighborhood}.` },
    slightly_high: { label:'Slightly Above',   color:'amber',   emoji:'⚠️', message:`This is ${percentageDiff}% above the market average. There may be room to negotiate.` },
    overpriced:    { label:'Above Market',     color:'rose',    emoji:'🔴', message:`This is ${percentageDiff}% above market rate. We recommend negotiating down or comparing other listings.` },
  }
  const vc = verdictConfig[verdict as keyof typeof verdictConfig]

  return NextResponse.json(serialize({
    success: true,
    data: {
      verdict, askingPrice, marketAvg: Math.round(marketAvg),
      marketMin: Math.round(marketMin), marketMax: Math.round(marketMax),
      percentageDiff, label: vc.label, emoji: vc.emoji, message: vc.message,
      color: vc.color,
      marketAvgFormatted: fmt(marketAvg), marketRangeFormatted: `${fmt(marketMin)} – ${fmt(marketMax)}`,
      comparablesCount: comparables.length,
      neighborhood, listingType: listingType || 'rent', bedrooms: bedrooms || 3,
    }
  }))
}
