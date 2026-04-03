export const dynamic = 'force-dynamic';

'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, MapPin, Star, Heart, Wifi, Zap, Wind, Tv, Car,
  Shield, Waves, Dumbbell, Coffee, ChefHat, Users, Calendar,
  SlidersHorizontal, Grid3X3, List, ArrowRight, Plus, Minus,
  RefreshCw, Eye, X, CheckCircle2, Loader2, Home, Building2,
  Hotel, Sparkles, Umbrella, Briefcase, TreePine, Crown,
  ChevronLeft, ChevronRight, Filter, Clock
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────
type Listing = {
  id: string
  title: string
  description: string
  propertyType: string
  price: number
  pricePeriod: string
  bedrooms: number
  bathrooms: number
  sizeSqm?: number
  neighborhood: string
  address: string
  amenities: string[]
  furnishingStatus?: string
  virtualTour: boolean
  isFeatured: boolean
  isVerified?: boolean
  views: number
  images: Array<{ url: string; isPrimary: boolean }>
  agent?: {
    id: string
    badge: string
    agencyName?: string
    avgRating: number
    reviewCount: number
    rsspcStatus: string
    user: { firstName: string; lastName: string; avatarUrl?: string }
  }
}

// ── Config ─────────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, any> = {
  'WiFi': Wifi, 'WiFi 100Mbps': Wifi, 'WiFi 200Mbps': Wifi,
  'Generator': Zap, 'Air Conditioning': Wind, 'Smart TV': Tv,
  'Parking': Car, '24-hr Security': Shield, 'Pool Access': Waves,
  'Swimming Pool': Waves, 'Private Pool': Waves, 'Gym': Dumbbell,
  'Breakfast': Coffee, 'Chef Service': ChefHat,
}

const CATEGORIES = [
  { key: 'all',        label: 'All Stays',       Icon: Home,      desc: 'All shortlet properties' },
  { key: 'private',    label: 'Private Homes',    Icon: Home,      desc: 'Entire homes & apartments' },
  { key: 'serviced',   label: 'Service Apts',     Icon: Building2, desc: 'Hotel-style serviced apartments' },
  { key: 'hotel',      label: 'Hotels & Suites',  Icon: Hotel,     desc: 'Hotels, suites & guesthouses' },
  { key: 'luxury',     label: 'Luxury & Villas',  Icon: Crown,     desc: 'Premium luxury stays' },
  { key: 'corporate',  label: 'Corporate Stays',  Icon: Briefcase, desc: 'Business-ready apartments' },
  { key: 'waterfront', label: 'Waterfront',       Icon: Umbrella,  desc: 'Waterfront & riverside' },
  { key: 'family',     label: 'Family Stays',     Icon: Users,     desc: 'Spacious family homes' },
]

const NEIGHBORHOODS = [
  'All Areas', 'GRA Phase 2', 'Old GRA', 'GRA Phase 1',
  'Woji', 'Trans Amadi', 'Rumuola', 'Peter Odili Road',
  'Eleme', 'D-Line', 'Stadium Road', 'Bonny Island',
]

const AMENITY_FILTERS = [
  'WiFi', 'Generator', 'Air Conditioning', 'Swimming Pool',
  'Gym', 'Parking', '24-hr Security', 'Smart TV', 'Breakfast', 'Chef Service',
]

// ── Helpers ────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` :
  n >= 1_000 ? `₦${(n / 1_000).toFixed(0)}K` : `₦${n.toLocaleString()}`

// ── Image Carousel ─────────────────────────────────────────────
function ImageCarousel({ images, title, isFeatured, isVerified, virtualTour }: {
  images: Array<{ url: string }>
  title: string; isFeatured: boolean; isVerified?: boolean; virtualTour: boolean
}) {
  const [idx, setIdx] = useState(0)
  const [saved, setSaved] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const hasImages = images.length > 0 && !imgErr

  const gradients = [
    'from-slate-800 to-slate-900',
    'from-stone-800 to-stone-900',
    'from-zinc-800 to-zinc-900',
    'from-neutral-800 to-neutral-900',
  ]
  const grad = gradients[title.charCodeAt(0)  0radients.length]

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl group">
      {hasImages ? (
        <img
          src={images[idx]?.url}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgErr(true)}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
          <Home className="w-12 h-12 text-white/20" />
        </div>
      )}

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.preventDefault(); setIdx(i => Math.max(0, i - 1)) }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${idx === 0 ? 'invisible' : ''}`}>
            <ChevronLeft className="w-4 h-4 text-obsidian-900" />
          </button>
          <button
            onClick={e => { e.preventDefault(); setIdx(i => Math.min(images.length - 1, i + 1)) }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${idx === images.length - 1 ? 'invisible' : ''}`}>
            <ChevronRight className="w-4 h-4 text-obsidian-900" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 5).map((_, i) => (
              <div key={i} className={`rounded-full bg-white transition-all ${i === idx ? 'w-3 h-1.5' : 'w-1.5 h-1.5 opacity-60'}`} />
            ))}
          </div>
        </>
      )}

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        {isFeatured && (
          <span className="px-2.5 py-1 bg-gold-500 text-obsidian-900 text-[10px] font-black rounded-full shadow">
            ✦ FEATURED
          </span>
        )}
        {isVerified && (
          <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow">
            ✓ VERIFIED
          </span>
        )}
        {virtualTour && (
          <span className="px-2.5 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-full shadow">
            360° TOUR
          </span>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={e => { e.preventDefault(); setSaved(p => !p) }}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center transition-transform hover:scale-110">
        <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-rose-500 text-rose-500' : 'text-obsidian-500'}`} />
      </button>

      {/* View count */}
      {/* Views */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur rounded-full text-white text-[10px]">
        <Eye className="w-3 h-3" />
        {/* show formatted */}
      </div>
    </div>
  )
}

// ── Listing Card ───────────────────────────────────────────────
function ShortletCard({ listing, view }: { listing: Listing; view: 'grid' | 'list' }) {
  const rating  = listing.agent?.avgRating || 0
  const reviews = listing.agent?.reviewCount || 0
  const amenityIcons = listing.amenities.slice(0, 4).map(a => ({ label: a, Icon: AMENITY_ICONS[a] })).filter(a => a.Icon)

  if (view === 'list') {
    return (
      <Link href={`/properties/${listing.id}`}
        className="card flex overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="relative w-56 flex-shrink-0">
          {listing.images[0]?.url ? (
            <img src={listing.images[0].url} alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <Home className="w-8 h-8 text-white/20" />
            </div>
          )}
          {listing.isFeatured && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-gold-500 text-obsidian-900 text-[9px] font-black rounded-full">✦ FEATURED</span>
          )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <p className="text-xs text-obsidian-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{listing.neighborhood}, Port Harcourt
              </p>
              {reviews > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 fill-obsidian-900 text-obsidian-900" />
                  <span className="text-xs font-bold text-obsidian-900">{rating.toFixed(1)}</span>
                  <span className="text-xs text-obsidian-400">({reviews})</span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-obsidian-900 line-clamp-1 group-hover:text-gold-600 transition-colors mb-1">
              {listing.title}
            </h3>
            <p className="text-xs text-obsidian-400 line-clamp-2 mb-3">{listing.description}</p>
            <div className="flex flex-wrap gap-2">
              {amenityIcons.map((a, i) => (
                <span key={i} className="flex items-center gap-1 text-[10px] text-obsidian-500 bg-surface-subtle px-2 py-1 rounded-lg">
                  <a.Icon className="w-3 h-3" />{a.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border">
            <div>
              <span className="font-display text-xl font-semibold text-obsidian-900">{fmt(listing.price)}</span>
              <span className="text-obsidian-400 text-sm"> / night</span>
            </div>
            <span className="px-3 py-1.5 bg-obsidian-900 text-white rounded-xl text-xs font-semibold">
              View →
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/properties/${listing.id}`} className="block group cursor-pointer">
      <ImageCarousel
        images={listing.images}
        title={listing.title}
        isFeatured={listing.isFeatured}
        isVerified={listing.isVerified}
        virtualTour={listing.virtualTour}
      />
      <div className="pt-3 pb-1">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-obsidian-400 flex items-center gap-1 mb-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{listing.neighborhood}</span>
            </p>
            <h3 className="text-sm font-semibold text-obsidian-900 line-clamp-1 group-hover:text-gold-600 transition-colors">
              {listing.title}
            </h3>
          </div>
          {reviews > 0 && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-obsidian-900 text-obsidian-900" />
              <span className="text-xs font-bold text-obsidian-900">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Meta row */}
        <p className="text-xs text-obsidian-400 mb-2">
          {[
            listing.bedrooms > 0 && `${listing.bedrooms} bed${listing.bedrooms > 1 ? 's' : ''}`,
            listing.bathrooms > 0 && `${listing.bathrooms} bath${listing.bathrooms > 1 ? 's' : ''}`,
            listing.furnishingStatus && listing.furnishingStatus.toLowerCase(),
          ].filter(Boolean).join(' · ')}
        </p>

        {/* Key amenities */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          {amenityIcons.slice(0, 3).map((a, i) => (
            <span key={i} className="flex items-center gap-1 text-[10px] text-obsidian-500">
              <a.Icon className="w-3 h-3" />{a.label}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-obsidian-900">
            <span className="font-semibold font-display text-base">{fmt(listing.price)}</span>
            <span className="text-obsidian-400"> / night</span>
          </p>
          {reviews > 0 && <p className="text-[10px] text-obsidian-400">{reviews} review{reviews > 1 ? 's' : ''}</p>}
        </div>
      </div>
    </Link>
  )
}

// ── Empty State ────────────────────────────────────────────────
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="col-span-full py-24 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-3xl bg-surface-subtle flex items-center justify-center mb-5">
        <Search className="w-10 h-10 text-obsidian-200" />
      </div>
      <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-2">No shortlets found</h3>
      <p className="text-obsidian-400 text-sm mb-6 max-w-sm">
        No shortlet listings yet in Port Harcourt. Be the first to list your property.
      </p>
      <div className="flex gap-3">
        <button onClick={onReset} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" />Clear filters
        </button>
        <Link href="/portal/list" className="btn-primary gap-2">
          <Plus className="w-4 h-4" />List Your Property
        </Link>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function ShortletPage() {
  const [listings, setListings]   = useState<Listing[]>([])
  const [loading, setLoading]     = useState(true)
  const [total, setTotal]         = useState(0)
  const [view, setView]           = useState<'grid' | 'list'>('grid')
  const [category, setCategory]   = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage]           = useState(1)

  // Filters
  const [search, setSearch]           = useState('')
  const [area, setArea]               = useState('All Areas')
  const [minBeds, setMinBeds]         = useState(0)
  const [sortBy, setSortBy]           = useState('featured')
  const [checkIn, setCheckIn]         = useState('')
  const [checkOut, setCheckOut]       = useState('')
  const [guests, setGuests]           = useState(1)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : null

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ type: 'SHORTLET', sort: sortBy, page: page.toString(), limit: '24' })
      if (area !== 'All Areas') params.set('neighborhood', area)
      if (minBeds > 0) params.set('minBeds', minBeds.toString())
      if (search) params.set('q', search)
      const res  = await fetch(`/api/listings?${params}`)
      const data = await res.json()
      setListings(data.data?.listings || [])
      setTotal(data.data?.total || 0)
    } catch {
      setListings([]); setTotal(0)
    } finally { setLoading(false) }
  }, [area, minBeds, search, sortBy, page])

  useEffect(() => { fetchListings() }, [fetchListings])

  const toggleAmenity = (a: string) =>
    setSelectedAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a])

  const resetFilters = () => {
    setCategory('all'); setSearch(''); setArea('All Areas')
    setMinBeds(0); setSelectedAmenities([]); setSortBy('featured')
    setCheckIn(''); setCheckOut(''); setGuests(1); setPage(1)
  }

  // Client-side category + amenity filter
  const filtered = listings.filter(l => {
    if (selectedAmenities.length > 0 && !selectedAmenities.every(a => l.amenities.includes(a))) return false
    if (category !== 'all') {
      if (category === 'luxury'    && !l.isFeatured && !['PENTHOUSE','MANSION'].includes(l.propertyType)) return false
      if (category === 'serviced'  && !l.propertyType.includes('SHORTLET')) return false
      if (category === 'hotel'     && !['HOTEL','SUITE','STUDIO'].includes(l.propertyType)) return false
    }
    return true
  })

  const activeFilters = [
    area !== 'All Areas', minBeds > 0, selectedAmenities.length > 0, category !== 'all', checkIn
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian-900/80" />

        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gold-500/6 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gold-500/4 blur-[80px] pointer-events-none" />

        <div className="relative z-10 page-container pt-16 pb-12">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Shortlets & Serviced Stays in Port Harcourt
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-4">
              Your Perfect<br />
              <span className="gold-text">Home Away From Home</span>
            </h1>
            <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
              Private residences, serviced apartments, hotels and luxury villas.
              Book by the night, week, or month — no long-term commitment.
            </p>

            {/* ── Airbnb-style search bar ── */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Location */}
                <div className="flex items-center gap-3 px-5 py-4 flex-1 border-b md:border-b-0 md:border-r border-surface-border">
                  <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <p className="text-[10px] font-bold text-obsidian-500 uppercase tracking-wider">Where</p>
                    <select
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      className="w-full text-sm font-semibold text-obsidian-900 bg-transparent outline-none cursor-pointer">
                      {NEIGHBORHOODS.map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {/* Check in */}
                <div className="flex items-center gap-3 px-5 py-4 border-b md:border-b-0 md:border-r border-surface-border">
                  <Calendar className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-obsidian-500 uppercase tracking-wider">Check In</p>
                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                      className="text-sm font-semibold text-obsidian-900 bg-transparent outline-none cursor-pointer" />
                  </div>
                </div>

                {/* Check out */}
                <div className="flex items-center gap-3 px-5 py-4 border-b md:border-b-0 md:border-r border-surface-border">
                  <Calendar className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-obsidian-500 uppercase tracking-wider">Check Out</p>
                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                      className="text-sm font-semibold text-obsidian-900 bg-transparent outline-none cursor-pointer" />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex items-center gap-3 px-5 py-4 border-b md:border-b-0 md:border-r border-surface-border">
                  <Users className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-obsidian-500 uppercase tracking-wider">Guests</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))}
                        className="w-6 h-6 rounded-full border border-obsidian-200 flex items-center justify-center hover:border-gold-400 transition-colors">
                        <Minus className="w-3 h-3 text-obsidian-600" />
                      </button>
                      <span className="text-sm font-bold text-obsidian-900 w-5 text-center">{guests}</span>
                      <button type="button" onClick={() => setGuests(g => g + 1)}
                        className="w-6 h-6 rounded-full border border-obsidian-200 flex items-center justify-center hover:border-gold-400 transition-colors">
                        <Plus className="w-3 h-3 text-obsidian-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search button */}
                <button onClick={fetchListings}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-obsidian-900 font-bold text-sm transition-all">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>

              {/* Nights calculation */}
              {nights && (
                <div className="px-5 py-2 bg-gold-50 border-t border-gold-100 text-xs text-gold-700 font-medium text-center">
                  📅 {nights} night{nights > 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROPERTY TYPE CARDS ───────────────────────────────────── */}
      <section className="bg-surface-bg py-10 border-b border-surface-border">
        <div className="page-container">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">
              Choose Your Type of Stay
            </h2>
            <p className="text-obsidian-400 text-sm">Private homes, serviced apartments, hotels and more</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all group ${
                  category === cat.key
                    ? 'border-obsidian-900 bg-obsidian-900 text-white shadow-lg scale-105'
                    : 'border-surface-border bg-white text-obsidian-500 hover:border-obsidian-300 hover:text-obsidian-900'
                }`}>
                <cat.Icon className={`w-6 h-6 ${category === cat.key ? 'text-gold-400' : 'text-obsidian-400 group-hover:text-obsidian-600'}`} />
                <span className="text-xs font-semibold leading-tight text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOST TYPES BANNER ────────────────────────────────────────── */}
      <section className="bg-white py-8 border-b border-surface-border">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '🏠',
                title: 'Private Homeowners',
                desc: 'Rent your home, apartment or spare room. Set your own price and availability. Earn from your property when you're away.',
                cta: 'List Your Home',
                color: 'from-gold-50 to-yellow-50',
                border: 'border-gold-200',
              },
              {
                icon: '🏢',
                title: 'Serviced Apartment Operators',
                desc: 'List your fully-serviced units with housekeeping and concierge. Reach corporate clients and long-stay guests.',
                cta: 'List Your Apartments',
                color: 'from-blue-50 to-indigo-50',
                border: 'border-blue-200',
              },
              {
                icon: '🏨',
                title: 'Hotels & Guesthouses',
                desc: 'Expand your bookings beyond your own website. Reach thousands of guests searching in Port Harcourt monthly.',
                cta: 'List Your Hotel',
                color: 'from-emerald-50 to-teal-50',
                border: 'border-emerald-200',
              },
            ].map((type, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br ${type.color} border ${type.border}`}>
                <span className="text-4xl flex-shrink-0">{type.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-obsidian-900 mb-1">{type.title}</h3>
                  <p className="text-xs text-obsidian-500 leading-relaxed mb-3">{type.desc}</p>
                  <Link href="/portal/list"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-obsidian-700 hover:text-gold-600 transition-colors">
                    {type.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ───────────────────────────────────────────────── */}
      <div className="sticky top-[68px] bg-white border-b border-surface-border z-30 shadow-sm">
        <div className="page-container py-3">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {/* Filter button */}
            <button
              onClick={() => setShowFilters(p => !p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all flex-shrink-0 ${
                showFilters ? 'border-obsidian-900 bg-obsidian-900 text-white' : 'border-surface-border text-obsidian-700 hover:border-obsidian-400'
              }`}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold-500 text-obsidian-900 text-[10px] font-black flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="py-2.5 pl-3 pr-8 rounded-xl border border-surface-border text-sm font-medium text-obsidian-700 outline-none bg-white flex-shrink-0">
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>

            {/* Bed filters */}
            {[0, 1, 2, 3, 4].map(n => (
              <button key={n} onClick={() => setMinBeds(n)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all flex-shrink-0 ${
                  minBeds === n
                    ? 'border-obsidian-900 bg-obsidian-900 text-white'
                    : 'border-surface-border text-obsidian-600 hover:border-obsidian-400'
                }`}>
                {n === 0 ? 'Any beds' : `${n}+ bed${n > 1 ? 's' : ''}`}
              </button>
            ))}

            {/* View toggle */}
            <div className="ml-auto flex items-center border border-surface-border rounded-xl overflow-hidden flex-shrink-0">
              <button onClick={() => setView('grid')}
                className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-obsidian-900 text-white' : 'text-obsidian-400 hover:text-obsidian-700'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')}
                className={`p-2.5 transition-colors ${view === 'list' ? 'bg-obsidian-900 text-white' : 'text-obsidian-400 hover:text-obsidian-700'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded filter panel */}
        {showFilters && (
          <div className="border-t border-surface-border bg-surface-subtle">
            <div className="page-container py-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
                <div>
                  <label className="input-label">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search by name, area..."
                      className="input-field pl-9 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Neighbourhood</label>
                  <select value={area} onChange={e => setArea(e.target.value)}
                    className="input-field text-sm">
                    {NEIGHBORHOODS.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Sort By</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="input-field text-sm">
                    <option value="featured">Featured First</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="input-label mb-2.5">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_FILTERS.map(a => {
                    const Icon = AMENITY_ICONS[a]
                    const active = selectedAmenities.includes(a)
                    return (
                      <button key={a} onClick={() => toggleAmenity(a)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          active
                            ? 'border-obsidian-900 bg-obsidian-900 text-white'
                            : 'border-surface-border bg-white text-obsidian-600 hover:border-obsidian-400'
                        }`}>
                        {Icon && <Icon className="w-3.5 h-3.5" />}{a}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={resetFilters} className="btn-secondary btn-sm gap-2">
                  <X className="w-3.5 h-3.5" />Clear All
                </button>
                <button onClick={() => { fetchListings(); setShowFilters(false) }} className="btn-primary btn-sm gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />Apply
                </button>
                {total > 0 && <p className="text-sm text-obsidian-500">{total} properties</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── LISTINGS ─────────────────────────────────────────────────── */}
      <div className="page-container py-8">

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          {loading ? (
            <div className="h-5 w-52 bg-surface-subtle rounded animate-pulse" />
          ) : (
            <p className="text-obsidian-700 font-medium">
              {total > 0
                ? <>{total} shortlet{total > 1 ? 's' : ''} in Port Harcourt{area !== 'All Areas' && ` · ${area}`}</>
                : 'No properties found'
              }
            </p>
          )}
          <button onClick={fetchListings} disabled={loading}
            className="flex items-center gap-1.5 text-sm text-obsidian-400 hover:text-obsidian-700 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />Refresh
          </button>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className={view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
          }>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-2xl bg-surface-subtle mb-3" />
                <div className="h-3 bg-surface-subtle rounded w-2/3 mb-2" />
                <div className="h-4 bg-surface-subtle rounded w-full mb-2" />
                <div className="h-3 bg-surface-subtle rounded w-1/2 mb-2" />
                <div className="h-5 bg-surface-subtle rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && filtered.length === 0 && <EmptyState onReset={resetFilters} />}

        {!loading && filtered.length > 0 && (
          <>
            <div className={view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'
            }>
              {filtered.map(l => (
                <ShortletCard key={l.id} listing={l} view={view} />
              ))}
            </div>

            {/* Pagination */}
            {total > 24 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-secondary px-5 gap-2 disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4" />Previous
                </button>
                <span className="text-sm text-obsidian-500 px-4">
                  Page {page} of {Math.ceil(total / 24)}
                </span>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 24)}
                  className="btn-secondary px-5 gap-2 disabled:opacity-40">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── WHY NAYA SHORTLETS ─────────────────────────────── */}
        <section className="mt-20 mb-8">
          <div className="text-center mb-10">
            <span className="section-number">Why Choose Naya Shortlets</span>
            <h2 className="section-title">The Smarter Way to Book</h2>
            <p className="text-obsidian-400 max-w-xl mx-auto mt-3 text-sm">
              Verified properties, transparent pricing, direct contact with hosts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '🛡', title: 'RSSPC Verified Hosts', desc: 'Every professional agent and operator is verified against the official RSSPC register for your safety and peace of mind.' },
              { icon: '💬', title: 'Direct Contact', desc: 'No middlemen. Contact hosts directly via WhatsApp or phone for instant responses, custom arrangements and negotiation.' },
              { icon: '🔐', title: 'Transparent & Secure', desc: 'Clear pricing, no hidden fees. Real photos, full property details, and honest reviews from previous guests.' },
            ].map((f, i) => (
              <div key={i} className="card p-6 text-center hover:shadow-lg transition-all group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="font-semibold text-obsidian-900 mb-2">{f.title}</h3>
                <p className="text-sm text-obsidian-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOST CTA ───────────────────────────────────────── */}
        <section className="mt-8">
          <div className="relative bg-obsidian-900 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-gold-500" />
                  <span className="text-gold-400 text-sm font-semibold">List on Naya</span>
                </div>
                <h2 className="font-display text-3xl font-light text-white mb-3">
                  Have a property to rent out?
                </h2>
                <p className="text-white/50 text-sm max-w-lg">
                  Whether you're a homeowner, serviced apartment operator, or hotel — list on Naya and reach thousands of guests monthly in Port Harcourt.
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <Link href="/portal/list" className="btn-primary gap-2 whitespace-nowrap justify-center">
                  <Plus className="w-4 h-4" />List Your Property
                </Link>
                <Link href="/register" className="btn-ghost text-white/70 border-white/20 gap-2 justify-center">
                  Create Agent Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}