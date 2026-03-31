'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Heart, MapPin, Bed, Bath, Maximize2, CheckCircle2,
  Star, MessageCircle, Eye, Zap
} from 'lucide-react'

type Listing = {
  id: string; title: string; price: number; pricePeriod?: string
  bedrooms: number; bathrooms: number; sizeSqm?: number
  neighborhood: string; listingType: string; propertyType?: string
  isFeatured: boolean; isVerified?: boolean; virtualTour?: boolean
  images: Array<{ url: string }>
  agent?: { avgRating: number; reviewCount: number; rsspcStatus: string; user: { firstName: string; phone?: string } }
}

const fmt = (n: number) => n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n.toLocaleString()}`
const periodLabel: Record<string,string> = { YEARLY:'/yr', MONTHLY:'/mo', PER_NIGHT:'/night' }

export default function MobilePropertyCard({ listing }: { listing: Listing }) {
  const [saved, setSaved]   = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const agentPhone = listing.agent?.user?.phone?.replace(/\D/g,'') || '2348168117004'
  const waMsg      = encodeURIComponent(`Hi! I'm interested in: ${listing.title} — naya-fawn.vercel.app/properties/${listing.id}`)
  const waUrl      = `https://wa.me/${agentPhone}?text=${waMsg}`

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden border border-surface-border shadow-sm active:scale-[0.98] transition-transform">
      {/* Image */}
      <Link href={`/properties/${listing.id}`} className="block relative" style={{ aspectRatio:'4/3' }}>
        {listing.images[0]?.url && !imgErr ? (
          <img
            src={listing.images[0].url}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-obsidian-800 to-obsidian-900 flex items-center justify-center">
            <Maximize2 className="w-8 h-8 text-white/20" />
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {listing.isFeatured && (
            <span className="px-2 py-0.5 bg-gold-500 text-obsidian-900 text-[9px] font-black rounded-full shadow">
              ✦ FEATURED
            </span>
          )}
          {listing.agent?.rsspcStatus === 'VERIFIED' && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full shadow">
              <CheckCircle2 className="w-2.5 h-2.5" />VERIFIED
            </span>
          )}
          {listing.virtualTour && (
            <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded-full shadow">360°</span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={e => { e.preventDefault(); setSaved(p => !p) }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center active:scale-90 transition-transform"
        >
          <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-rose-500 text-rose-500' : 'text-obsidian-500'}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-3.5">
        {/* Location */}
        <div className="flex items-center gap-1 text-obsidian-400 text-xs mb-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{listing.neighborhood}, Port Harcourt</span>
        </div>

        {/* Title */}
        <Link href={`/properties/${listing.id}`}>
          <h3 className="font-semibold text-obsidian-900 text-sm leading-tight line-clamp-2 mb-2">
            {listing.title}
          </h3>
        </Link>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-obsidian-500 mb-3">
          {listing.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />{listing.bedrooms}
            </div>
          )}
          {listing.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />{listing.bathrooms}
            </div>
          )}
          {listing.sizeSqm && (
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3" />{listing.sizeSqm}m²
            </div>
          )}
          <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            listing.listingType === 'RENT' ? 'bg-blue-50 text-blue-600' :
            listing.listingType === 'SALE' ? 'bg-emerald-50 text-emerald-600' :
            listing.listingType === 'SHORTLET' ? 'bg-purple-50 text-purple-600' :
            'bg-surface-subtle text-obsidian-500'
          }`}>
            {listing.listingType?.toLowerCase()}
          </span>
        </div>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-display text-lg font-semibold text-obsidian-900">{fmt(listing.price)}</span>
            {listing.pricePeriod && periodLabel[listing.pricePeriod] && (
              <span className="text-obsidian-400 text-xs">{periodLabel[listing.pricePeriod]}</span>
            )}
          </div>

          {/* WhatsApp CTA */}
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-colors active:scale-95 shadow-sm flex-shrink-0">
            <MessageCircle className="w-3.5 h-3.5" />Chat
          </a>
        </div>

        {/* Rating */}
        {listing.agent && listing.agent.reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-surface-border">
            <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
            <span className="text-xs font-semibold text-obsidian-700">{listing.agent.avgRating.toFixed(1)}</span>
            <span className="text-xs text-obsidian-400">({listing.agent.reviewCount} reviews)</span>
            <span className="ml-auto text-xs text-obsidian-400">{listing.agent.user.firstName}</span>
          </div>
        )}
      </div>
    </div>
  )
}
