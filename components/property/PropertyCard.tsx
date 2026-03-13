'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin, BedDouble, Bath, Maximize2, Eye, CheckCircle2, Zap } from 'lucide-react'
import { Property, getPropertyGradient, getPriceLabel, propertyTypeEmojis } from '@/lib/data'
import clsx from 'clsx'

interface PropertyCardProps {
  property: Property
  className?: string
  compact?: boolean
}

export default function PropertyCard({ property, className, compact = false }: PropertyCardProps) {
  const [saved, setSaved] = useState(false)
  const gradient = getPropertyGradient(property.propertyType)
  const emoji = propertyTypeEmojis[property.propertyType] || '🏠'
  const priceLabel = getPriceLabel(property)

  return (
    <Link href={`/properties/${property.slug}`} className={clsx('property-card block group', className)}>
      {/* Image Area */}
      <div className={clsx('relative overflow-hidden', compact ? 'h-44' : 'h-52 md:h-56')}>
        <div className={clsx('w-full h-full bg-gradient-to-br flex items-center justify-center', gradient)}>
          <span className="text-5xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">{emoji}</span>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="font-mono text-base font-semibold text-white drop-shadow-lg">
            {priceLabel}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {property.isFeatured && <span className="badge badge-gold text-[10px] py-0.5">⭐ Featured</span>}
          {property.isNew && <span className="badge badge-new text-[10px] py-0.5">New</span>}
          {property.virtualTour && <span className="badge badge-dark text-[10px] py-0.5">360°</span>}
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => { e.preventDefault(); setSaved(!saved) }}
          className={clsx(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border',
            saved
              ? 'bg-gold-500 border-gold-500 text-obsidian-900'
              : 'bg-black/30 border-white/20 text-white backdrop-blur-sm hover:bg-gold-500/80 hover:border-gold-500'
          )}
          aria-label="Save property"
        >
          <Heart className={clsx('w-3.5 h-3.5', saved && 'fill-current')} />
        </button>

        {/* Status overlay */}
        {property.status !== 'active' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="font-display text-2xl text-white/80 font-light uppercase tracking-widest">
              {property.status === 'rented' ? 'Rented' : 'Sold'}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={clsx('p-4', compact ? 'p-3' : 'p-4')}>
        {/* Title */}
        <h3 className={clsx(
          'font-display font-medium text-obsidian-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-gold-700 transition-colors',
          compact ? 'text-base' : 'text-lg'
        )}>
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-obsidian-400 text-xs mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0 text-gold-500" />
          <span className="truncate">{property.neighborhood}, {property.lga}</span>
        </div>

        {/* Separator */}
        <div className="border-t border-surface-border mb-3" />

        {/* Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1 text-xs text-obsidian-400">
              <BedDouble className="w-3.5 h-3.5 text-gold-500" />
              {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1 text-xs text-obsidian-400">
              <Bath className="w-3.5 h-3.5 text-gold-500" />
              {property.bathrooms} Bath
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-obsidian-400">
            <Maximize2 className="w-3.5 h-3.5 text-gold-500" />
            {property.sizeSqm.toLocaleString()} m²
          </span>
          {property.isVerified && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 ml-auto">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Enquiry activity */}
        {!compact && property.enquiries > 10 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-obsidian-300">
            <Zap className="w-3 h-3 text-gold-400" />
            <span>{property.enquiries} enquiries this week</span>
          </div>
        )}
      </div>
    </Link>
  )
}
