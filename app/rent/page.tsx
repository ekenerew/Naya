export const dynamic = 'force-dynamic';

'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, TrendingUp, Minus, X, ArrowRight, CheckCircle2, Map, LayoutGrid, List, Phone, MessageCircle, Star, Shield } from 'lucide-react'
import { properties, rentalListings, neighborhoods } from '@/lib/data'
import type { Property } from '@/lib/types'

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

// ── Config ─────────────────────────────────────────────────────────────────────
const rentalCategories = [
  { value: 'all',               label: 'All Types',            emoji: '🏠', group: 'all' },
  { value: 'single_room',       label: 'Single Room',          emoji: '🚪', group: 'rooms' },
  { value: 'two_rooms',         label: 'Two Rooms',            emoji: '🚪', group: 'rooms' },
  { value: 'room_parlour',      label: 'Room & Parlour',       emoji: '🛋', group: 'rooms' },
  { value: 'self_contained',    label: 'Self Contained',       emoji: '🔑', group: 'rooms' },
  { value: 'bedsitter',         label: 'Bedsitter',            emoji: '🛏', group: 'rooms' },
  { value: 'mini_flat',         label: 'Mini Flat',            emoji: '🏠', group: 'flats' },
  { value: 'studio',            label: 'Studio Apartment',     emoji: '✨', group: 'flats' },
  { value: 'one_bedroom_flat',  label: '1-Bedroom Flat',       emoji: '🏠', group: 'flats' },
  { value: 'two_bedroom_flat',  label: '2-Bedroom Flat',       emoji: '🏠', group: 'flats' },
  { value: 'three_bedroom_flat',label: '3-Bedroom Flat',       emoji: '🏠', group: 'flats' },
  { value: 'four_bedroom_flat', label: '4-Bedroom Flat',       emoji: '🏠', group: 'flats' },
  { value: 'apartment',         label: 'Apartment',            emoji: '🏢', group: 'flats' },
  { value: 'three_room_duplex', label: '3-Room Duplex',        emoji: '🏡', group: 'houses' },
  { value: 'duplex',            label: '4-5 Bed Duplex',       emoji: '🏡', group: 'houses' },
  { value: 'bungalow',          label: 'Bungalow',             emoji: '🏡', group: 'houses' },
  { value: 'terrace',           label: 'Terrace House',        emoji: '🏘', group: 'houses' },
  { value: 'mansion',           label: 'Mansion / Villa',      emoji: '🏰', group: 'houses' },
  { value: 'store',             label: 'Store / Warehouse',    emoji: '🏭', group: 'commercial' },
  { value: 'commercial',        label: 'Office / Commercial',  emoji: '🏢', group: 'commercial' },
]

const categoryGroups = [
  { key: 'all',        label: 'All' },
  { key: 'rooms',      label: 'Rooms' },
  { key: 'flats',      label: 'Flats & Apts' },
  { key: 'houses',     label: 'Houses' },
  { key: 'commercial', label: 'Commercial' },
]

const priceRanges = [
  { label: 'Under ₦500K/yr', min: 0, max: 500000 },
  { label: '₦500K – ₦1M/yr', min: 500000, max: 1000000 },
  { label: '₦1M – ₦3M/yr', min: 1000000, max: 3000000 },
  { label: '₦3M – ₦8M/yr', min: 3000000, max: 8000000 },
  { label: 'Above ₦8M/yr', min: 8000000, max: Infinity },
]

const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Listed' },
  { value: 'popular', label: 'Most Viewed' },
]

const mapPins = [
  { neighborhood: 'GRA Phase 2', x: 68, y: 35, count: 12, avgPrice: '₦8.5M/yr', color: 'bg-gold-500' },
  { neighborhood: 'Old GRA',     x: 58, y: 42, count: 8,  avgPrice: '₦6.2M/yr', color: 'bg-gold-400' },
  { neighborhood: 'Woji',        x: 74, y: 52, count: 18, avgPrice: '₦2.8M/yr', color: 'bg-emerald-500' },
  { neighborhood: 'Trans Amadi', x: 52, y: 55, count: 22, avgPrice: '₦1.9M/yr', color: 'bg-blue-500' },
  { neighborhood: 'Rumuola',     x: 42, y: 62, count: 31, avgPrice: '₦850K/yr', color: 'bg-purple-500' },
  { neighborhood: 'Eleme',       x: 82, y: 72, count: 14, avgPrice: '₦3.1M/yr', color: 'bg-rose-500' },
]

const rentStats = [
  { label: 'Avg. 1-Bed (GRA)', value: '₦3.5M', change: '+9%', trend: 'up' },
  { label: 'Avg. 2-Bed (Woji)', value: '₦1.9M', change: '+14%', trend: 'up' },
  { label: 'Avg. Room (Rumuola)', value: '₦380K', change: '+6%', trend: 'up' },
  { label: 'Avg. Days to Let', value: '21 days', change: '-18%', trend: 'up' },
]

// ── Property Card ─────────────────────────────────────────────────────────────
function RentCard({ p }: { p: Property }) {
  const cat = rentalCategories.find(c => c.value === p.propertyType)
  const gradients: Record<string, string> = {
    mansion: 'from-amber-950 to-stone-950', apartment: 'from-slate-900 to-zinc-900',
    duplex: 'from-emerald-950 to-teal-950', single_room: 'from-blue-950 to-indigo-950',
    two_rooms: 'from-violet-950 to-purple-950', room_parlour: 'from-rose-950 to-pink-950',
    self_contained: 'from-teal-950 to-cyan-950', bedsitter: 'from-amber-950 to-orange-950',
    one_bedroom_flat: 'from-emerald-950 to-green-950', two_bedroom_flat: 'from-blue-950 to-cyan-950',
    three_bedroom_flat: 'from-indigo-950 to-blue-950', four_bedroom_flat: 'from-purple-950 to-indigo-950',
    three_room_duplex: 'from-green-950 to-teal-950', bungalow: 'from-orange-950 to-amber-950',
    mini_flat: 'from-sky-950 to-blue-950', studio: 'from-fuchsia-950 to-purple-950',
    store: 'from-gray-950 to-slate-950', commercial: 'from-zinc-950 to-gray-950',
  }
  const gradient = gradients[p.propertyType] || 'from-slate-900 to-zinc-900'

  return (
    <div className="card overflow-hidden hover:border-gold-200 transition-all group">
      {/* Image */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="text-5xl opacity-40">{cat?.emoji || '🏠'}</div>
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {p.isFeatured && <span className="badge-gold text-[10px]">⭐ Featured</span>}
          {p.isNew && <span className="badge text-[10px] bg-emerald-500 text-white border-emerald-500">New</span>}
          {p.isVerified && <span className="badge text-[10px] bg-white/20 text-white border-white/30">✓ Verified</span>}
          {p.virtualTour && <span className="badge text-[10px] bg-blue-500/80 text-white border-blue-400">360°</span>}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-black/50 text-white/80 backdrop-blur-sm">
            {cat?.label || p.propertyType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-base font-medium text-obsidian-900 leading-tight group-hover:text-gold-600 transition-colors">
            <Link href={`/properties/${p.slug}`}>{p.title}</Link>
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-obsidian-400 mb-3">
          <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0" />
          <span>{p.address}, {p.neighborhood}</span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-3 py-3 border-y border-surface-border">
          {p.bedrooms > 0 && (
            <div className="text-center">
              <div className="font-mono text-sm font-bold text-obsidian-900">{p.bedrooms}</div>
              <div className="text-[10px] text-obsidian-400">Beds</div>
            </div>
          )}
          {p.bathrooms > 0 && (
            <div className="text-center">
              <div className="font-mono text-sm font-bold text-obsidian-900">{p.bathrooms}</div>
              <div className="text-[10px] text-obsidian-400">Baths</div>
            </div>
          )}
          <div className="text-center">
            <div className="font-mono text-sm font-bold text-obsidian-900">{p.sizeSqm}</div>
            <div className="text-[10px] text-obsidian-400">sqm</div>
          </div>
        </div>

        {/* Top amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {p.amenities.slice(0, 3).map(a => (
            <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">{a}</span>
          ))}
          {p.amenities.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-400">+{p.amenities.length - 3}</span>}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-xl font-medium text-gold-600">{fmt(p.price)}</div>
            <div className="text-[10px] text-obsidian-400">per year</div>
          </div>
          <div className="flex gap-2">
            <a href={`https://wa.me/2348168117004`} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors">
              <MessageCircle className="w-4 h-4 text-white" />
            </a>
            <Link href={`/properties/${p.slug}`} className="btn-primary btn-sm px-3">
              View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Map Component ─────────────────────────────────────────────────────────────
function MapView({ onSelectArea }: { onSelectArea: (area: string) => void }) {
  const [hoveredPin, setHoveredPin] = useState<number | null>(null)

  return (
    <div className="card overflow-hidden">
      <div className="relative h-[520px] bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-950">
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Road lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <line x1="0%" y1="48%" x2="100%" y2="48%" stroke="#C8A84B" strokeWidth="2" />
          <line x1="0%" y1="62%" x2="100%" y2="62%" stroke="white" strokeWidth="1" />
          <line x1="55%" y1="0%" x2="55%" y2="100%" stroke="#C8A84B" strokeWidth="2" />
          <line x1="72%" y1="0%" x2="72%" y2="100%" stroke="white" strokeWidth="1" />
          <line x1="38%" y1="0%" x2="38%" y2="100%" stroke="white" strokeWidth="1" />
        </svg>

        {/* Street labels */}
        <div className="absolute top-[46%] left-4 text-[10px] text-white/30 font-mono">Aba Road</div>
        <div className="absolute top-[60%] left-4 text-[10px] text-white/30 font-mono">Rumuola Road</div>
        <div className="absolute top-4 left-[52%] text-[10px] text-white/30 font-mono rotate-90 origin-left">Peter Odili Rd</div>

        {/* Map pins */}
        {mapPins.map((pin, i) => (
          <div key={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            onMouseEnter={() => setHoveredPin(i)}
            onMouseLeave={() => setHoveredPin(null)}
            onClick={() => onSelectArea(pin.neighborhood)}>

            {/* Pulse ring */}
            <div className={`absolute inset-0 rounded-full ${pin.color} opacity-30 animate-ping scale-150`} />

            {/* Pin */}
            <div className={`relative w-10 h-10 rounded-full ${pin.color} flex items-center justify-center shadow-lg border-2 border-white hover:scale-125 transition-transform`}>
              <span className="font-mono text-xs font-bold text-white">{pin.count}</span>
            </div>

            {/* Tooltip */}
            {hoveredPin === i && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-obsidian-900 text-white rounded-xl p-3 shadow-xl w-44 z-20 border border-white/10">
                <div className="font-display text-sm font-medium mb-1">{pin.neighborhood}</div>
                <div className="text-xs text-white/50">{pin.count} rentals available</div>
                <div className="text-xs text-gold-400 font-mono mt-1">Avg: {pin.avgPrice}</div>
                <button className="text-xs text-gold-400 underline mt-1 block">View all →</button>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-obsidian-900 rotate-45 border-r border-b border-white/10" />
              </div>
            )}
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-obsidian-900/80 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="text-xs text-white/50 mb-2 font-mono uppercase tracking-widest">Legend</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gold-500" /><span className="text-xs text-white/60">GRA Areas</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-white/60">Mid-Range</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-xs text-white/60">Commercial</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500" /><span className="text-xs text-white/60">Budget-Friendly</span></div>
          </div>
        </div>

        {/* Scale */}
        <div className="absolute bottom-4 right-4 bg-obsidian-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
          <div className="text-xs text-white/40 font-mono">Port Harcourt, Rivers State</div>
        </div>

        {/* Title overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-obsidian-900/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gold-500/30">
          <div className="text-xs text-gold-400 font-mono tracking-widest uppercase text-center">Tap a pin to filter by area</div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function RentPage() {
  const [searchQuery, setSearchQuery]   = useState('')
  const [activeGroup, setActiveGroup]   = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedArea, setSelectedArea] = useState('all')
  const [priceRange, setPriceRange]     = useState<typeof priceRanges[0] | null>(null)
  const [minBeds, setMinBeds]           = useState(0)
  const [sortBy, setSortBy]             = useState('featured')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [furnishedOnly, setFurnishedOnly] = useState(false)
  const [viewMode, setViewMode]         = useState<'grid' | 'map'>('grid')

  // Combine existing rent properties with extended rental listings
  const allRentals: Property[] = [
    ...properties.filter(p => p.listingType === 'rent'),
    ...rentalListings,
  ]

  const filtered = useMemo(() => {
    let r = allRentals.filter(p => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.address.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (selectedType !== 'all' && p.propertyType !== selectedType) return false
      if (selectedArea !== 'all' && p.neighborhood !== selectedArea) return false
      if (priceRange && (p.price < priceRange.min || p.price > priceRange.max)) return false
      if (minBeds > 0 && p.bedrooms < minBeds) return false
      if (verifiedOnly && !p.isVerified) return false
      if (furnishedOnly && !p.features.some(f => f.toLowerCase().includes('furnished'))) return false
      // Group filter
      if (activeGroup !== 'all') {
        const cat = rentalCategories.find(c => c.value === p.propertyType)
        if (cat && cat.group !== activeGroup) return false
      }
      return true
    })
    switch (sortBy) {
      case 'price_asc':  r = [...r].sort((a, b) => a.price - b.price); break
      case 'price_desc': r = [...r].sort((a, b) => b.price - a.price); break
      case 'newest':     r = [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'popular':    r = [...r].sort((a, b) => b.views - a.views); break
      default:           r = [...r].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return r
  }, [searchQuery, selectedType, selectedArea, priceRange, minBeds, sortBy, verifiedOnly, furnishedOnly, activeGroup])

  const activeFilters = [selectedType !== 'all', selectedArea !== 'all', priceRange !== null, minBeds > 0, verifiedOnly, furnishedOnly].filter(Boolean).length

  const clearAll = () => {
    setSelectedType('all'); setSelectedArea('all'); setPriceRange(null)
    setMinBeds(0); setVerifiedOnly(false); setFurnishedOnly(false); setSearchQuery(''); setActiveGroup('all')
  }

  const handleMapSelect = (area: string) => {
    setSelectedArea(area); setViewMode('grid')
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden py-14">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[120px]" />
        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">
                {allRentals.length} Rental Properties · Port Harcourt
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-light text-white leading-tight mb-4">
              Find the Right<br />
              <span className="gold-text">Place to Rent</span>
            </h1>
            <p className="text-white/40 text-lg font-light mb-8">
              Single rooms to luxury duplexes. Every listing is verified. Every agent is certified.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="card p-2 flex gap-2 shadow-gold-lg mb-3">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0" />
                <input className="flex-1 bg-transparent text-obsidian-900 placeholder-obsidian-300 outline-none text-sm"
                  placeholder="Search area, street, or property type..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-obsidian-300" /></button>}
              </div>
              <select className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none"
                value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                <option value="all">All Areas</option>
                {neighborhoods.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
              </select>
              <select className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none"
                value={priceRange ? priceRanges.indexOf(priceRange) : ''}
                onChange={e => setPriceRange(e.target.value !== '' ? priceRanges[+e.target.value] : null)}>
                <option value="">Any Budget</option>
                {priceRanges.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
              </select>
              <button className="btn-primary px-6 flex-shrink-0">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>

            {/* Category Group Tabs */}
            <div className="flex gap-2 flex-wrap justify-center mb-2">
              {categoryGroups.map(g => (
                <button key={g.key} onClick={() => { setActiveGroup(g.key); setSelectedType('all') }}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${activeGroup === g.key ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/50 border-white/15 hover:bg-white/15'}`}>
                  {g.label}
                </button>
              ))}
            </div>

            {/* Category Type Pills */}
            <div className="flex gap-2 flex-wrap justify-center">
              {rentalCategories.filter(c => activeGroup === 'all' ? true : c.group === activeGroup || c.group === 'all').slice(0, 10).map(c => (
                <button key={c.value} onClick={() => setSelectedType(c.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedType === c.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/50 border-white/15 hover:bg-white/15'}`}>
                  <span>{c.emoji}</span>{c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARKET STATS ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-surface-border">
        <div className="page-container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rentStats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="font-mono text-xs text-obsidian-400 mb-0.5">{s.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-medium text-obsidian-900">{s.value}</span>
                    <span className="text-xs font-mono font-bold text-emerald-500">{s.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ── SIDEBAR ────────────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">

                {/* Filters */}
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-medium text-obsidian-900 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-gold-500" /> Filters
                    </h3>
                    {activeFilters > 0 && (
                      <button onClick={clearAll} className="text-xs text-gold-600 font-medium">Clear ({activeFilters})</button>
                    )}
                  </div>
                  <div className="space-y-5">

                    {/* Area */}
                    <div>
                      <label className="input-label">Neighbourhood</label>
                      <select className="input-field text-sm" value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                        <option value="all">All Areas</option>
                        {neighborhoods.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
                      </select>
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className="input-label">Property Type</label>
                      <div className="space-y-1">
                        {rentalCategories.filter(c => c.value !== 'all').map(c => (
                          <button key={c.value} onClick={() => setSelectedType(c.value === selectedType ? 'all' : c.value)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-all ${selectedType === c.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            <span className="flex items-center gap-2"><span>{c.emoji}</span>{c.label}</span>
                            {selectedType === c.value && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="input-label">Annual Budget</label>
                      <div className="space-y-1.5">
                        {priceRanges.map((r, i) => (
                          <button key={i} onClick={() => setPriceRange(priceRange === r ? null : r)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-all ${priceRange === r ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {r.label} {priceRange === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="input-label">Min. Bedrooms</label>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setMinBeds(n)}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium border ${minBeds === n ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-500 border-surface-border'}`}>
                            {n === 0 ? 'Any' : `${n}+`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3 pt-3 border-t border-surface-border">
                      {[
                        { label: 'Verified Listings Only', val: verifiedOnly, set: setVerifiedOnly },
                        { label: 'Furnished Only', val: furnishedOnly, set: setFurnishedOnly },
                      ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm text-obsidian-600">{t.label}</span>
                          <div onClick={() => t.set(!t.val)} className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${t.val ? 'bg-gold-500' : 'bg-obsidian-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${t.val ? 'translate-x-5' : 'translate-x-1'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Renter's Guide */}
                <div className="card p-5">
                  <h3 className="font-display text-base font-medium text-obsidian-900 mb-3">Renter's Checklist</h3>
                  <div className="space-y-2">
                    {['Verify agent RSSPC licence', 'Inspect property in person', 'Request tenancy agreement', 'Check C of O or title deed', 'Confirm utility meters', 'Get receipt for all payments'].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-obsidian-500">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent CTA */}
                <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10 text-center">
                    <div className="text-3xl mb-3">🤝</div>
                    <h3 className="font-display text-base font-medium text-white mb-2">Need Help Finding a Rental?</h3>
                    <p className="text-white/40 text-xs mb-4">Our agents know every street in PH.</p>
                    <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm w-full justify-center">
                      <MessageCircle className="w-4 h-4" /> Chat with Agent
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RESULTS ────────────────────────────────────────────────── */}
            <div className="lg:col-span-3">

              {/* Header + View Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-obsidian-900">
                    {filtered.length} Rental{filtered.length !== 1 ? 's' : ''} Available
                  </h2>
                  <p className="text-sm text-obsidian-400 mt-0.5">
                    {selectedArea !== 'all' ? selectedArea : 'All areas'} · Port Harcourt
                    {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="input-field text-sm py-2" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div className="flex rounded-xl border border-surface-border overflow-hidden">
                    <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-obsidian-900 text-white' : 'bg-white text-obsidian-400'}`}>
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('map')} className={`p-2.5 ${viewMode === 'map' ? 'bg-obsidian-900 text-white' : 'bg-white text-obsidian-400'}`}>
                      <Map className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Pills */}
              {activeFilters > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedType !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {rentalCategories.find(c => c.value === selectedType)?.label}
                      <button onClick={() => setSelectedType('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedArea !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      <MapPin className="w-3 h-3" />{selectedArea}
                      <button onClick={() => setSelectedArea('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {priceRange && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {priceRange.label} <button onClick={() => setPriceRange(null)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {verifiedOnly && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
                      <Shield className="w-3 h-3" /> Verified Only <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}

              {/* MAP VIEW */}
              {viewMode === 'map' && (
                <div className="mb-6">
                  <MapView onSelectArea={handleMapSelect} />
                  <p className="text-xs text-obsidian-400 mt-3 text-center">Tap a pin to filter properties by neighbourhood. Numbers show available rentals.</p>
                </div>
              )}

              {/* GRID VIEW */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map(p => <RentCard key={p.id} p={p} />)}
                </div>
              ) : (
                <div className="text-center py-20 card">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No rentals found</h3>
                  <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">Try adjusting your filters or broadening your search.</p>
                  <button onClick={clearAll} className="btn-primary">Clear All Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICE GUIDE ─────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Rental Price Guide</span>
            <h2 className="section-title">What to Expect to Pay in Port Harcourt</h2>
            <p className="section-desc mx-auto">Average annual rents across all property categories. Updated March 2026.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-obsidian-900">
                  <th className="text-left py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Property Type</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Rumuola</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Woji</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Trans Amadi</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">GRA Phase 2</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Single Room',      rumuola: '₦150K–250K',  woji: '₦250K–400K',  transAmadi: '₦200K–350K',  gra: '₦400K–600K' },
                  { type: 'Room & Parlour',   rumuola: '₦400K–600K',  woji: '₦600K–900K',  transAmadi: '₦450K–700K',  gra: '₦800K–1.2M' },
                  { type: 'Self Contained',   rumuola: '₦500K–800K',  woji: '₦600K–1M',    transAmadi: '₦550K–900K',  gra: '₦1M–2M' },
                  { type: '1-Bedroom Flat',   rumuola: '₦800K–1.2M',  woji: '₦1.2M–2M',   transAmadi: '₦900K–1.5M',  gra: '₦2M–4M' },
                  { type: '2-Bedroom Flat',   rumuola: '₦1.2M–2M',    woji: '₦1.8M–3M',   transAmadi: '₦1.5M–2.5M',  gra: '₦3.5M–7M' },
                  { type: '3-Bedroom Flat',   rumuola: '₦2M–3.5M',    woji: '₦3M–5M',     transAmadi: '₦2.5M–4M',    gra: '₦5M–10M' },
                  { type: '4-Bed Duplex',     rumuola: '₦3.5M–6M',    woji: '₦5M–9M',     transAmadi: '₦4M–7M',      gra: '₦10M–18M' },
                  { type: 'Bungalow (3-bed)', rumuola: '₦2.5M–4M',    woji: '₦3.5M–6M',   transAmadi: '₦3M–5M',      gra: '₦6M–12M' },
                  { type: 'Store/Warehouse',  rumuola: '₦800K–1.5M',  woji: '₦1M–2M',     transAmadi: '₦1.5M–3M',    gra: '₦2M–4M' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-surface-border ${i % 2 === 0 ? 'bg-surface-subtle/50' : 'bg-white'}`}>
                    <td className="py-3 px-4 font-medium text-obsidian-900">{row.type}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-obsidian-600">{row.rumuola}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-obsidian-600">{row.woji}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-obsidian-600">{row.transAmadi}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-gold-600 font-medium">{row.gra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-obsidian-400 mt-4 text-center">Prices are indicative annual rents based on verified Naya listings. Actual prices may vary based on furnishing, floor level, and estate facilities.</p>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-5">
            Can't Find What<br /><span className="gold-text">You're Looking For?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">Tell us exactly what you need and our agents will find it for you — no stress, no fees from you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
              <MessageCircle className="w-5 h-5" /> WhatsApp an Agent
            </a>
            <Link href="/contact" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">
              Submit a Request <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
