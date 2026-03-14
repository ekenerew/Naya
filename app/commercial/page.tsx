'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, MapPin, SlidersHorizontal, ArrowRight, CheckCircle2,
  Building2, Warehouse, Store, Hotel, Trees, Zap, Wifi, Car,
  Shield, Phone, MessageCircle, TrendingUp, BarChart3, Users,
  FileText, Clock, ChevronDown, ChevronUp, Star
} from 'lucide-react'
import { properties, commercialListings, neighborhoods } from '@/lib/data'
import type { Property } from '@/lib/types'

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(1)}B`
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

function fmtPeriod(p: string) {
  const map: Record<string, string> = { yearly: '/yr', monthly: '/mo', total: '', per_night: '/night' }
  return map[p] || ''
}

// ── Config ─────────────────────────────────────────────────────────────────────
const commercialTypes = [
  { value: 'all',         label: 'All Commercial',      icon: Building2,  desc: 'All types' },
  { value: 'office',      label: 'Office Space',        icon: Building2,  desc: 'Grade A, serviced, open-plan' },
  { value: 'retail',      label: 'Retail & Shops',      icon: Store,      desc: 'Shops, plazas, showrooms' },
  { value: 'warehouse',   label: 'Warehouse & Industrial', icon: Warehouse, desc: 'Storage, logistics, manufacturing' },
  { value: 'hospitality', label: 'Hotels & Events',     icon: Hotel,      desc: 'Hotels, guesthouses, event centres' },
  { value: 'land',        label: 'Commercial Land',     icon: Trees,      desc: 'Industrial & commercial plots' },
  { value: 'specialist',  label: 'Specialist',          icon: Building2,  desc: 'Medical, banking, filling stations' },
]

const listingTypes = [
  { value: 'all',   label: 'Lease & Sale' },
  { value: 'lease', label: 'Lease Only' },
  { value: 'sale',  label: 'Sale Only' },
]

const sizeRanges = [
  { label: 'Under 200 sqm',      min: 0,    max: 200 },
  { label: '200 – 500 sqm',      min: 200,  max: 500 },
  { label: '500 – 1,500 sqm',    min: 500,  max: 1500 },
  { label: '1,500 – 5,000 sqm',  min: 1500, max: 5000 },
  { label: 'Above 5,000 sqm',    min: 5000, max: Infinity },
]

const sortOptions = [
  { value: 'featured',   label: 'Featured First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'size_desc',  label: 'Largest First' },
  { value: 'newest',     label: 'Newest Listed' },
  { value: 'popular',    label: 'Most Enquired' },
]

const marketStats = [
  { label: 'Grade A Office (GRA)', value: '₦23K/sqm/yr', change: '+11%', trend: 'up', sub: 'Q1 2026' },
  { label: 'Industrial Warehouse', value: '₦9K/sqm/yr',  change: '+8%',  trend: 'up', sub: 'Trans Amadi' },
  { label: 'Retail (Prime)',        value: '₦41K/sqm/yr', change: '+14%', trend: 'up', sub: 'GRA & Old GRA' },
  { label: 'Avg. Lease Duration',   value: '3.2 years',   change: '+0.4', trend: 'up', sub: 'vs 2025 avg' },
]

const sectors = [
  { emoji: '🛢',  label: 'Oil & Gas',        desc: 'Shell, Agip, Chevron, SPDC, NNPC-related supply chain offices' },
  { emoji: '🏦',  label: 'Banking & Finance', desc: 'Branch space, ATM kiosks, microfinance and insurance offices' },
  { emoji: '🏥',  label: 'Healthcare',        desc: 'Clinics, diagnostic centres, pharmacy, and specialist practices' },
  { emoji: '🛒',  label: 'Retail & FMCG',    desc: 'Supermarkets, pharmacies, fashion, electronics, and food chains' },
  { emoji: '🏭',  label: 'Logistics',         desc: 'Warehouses, distribution hubs, cold storage, and last-mile depots' },
  { emoji: '💻',  label: 'Technology',        desc: 'Tech startups, fintech, call centres, and co-working operators' },
]

const faqs = [
  { q: 'What is included in a commercial lease on Naya?', a: 'All listings clearly state the lease terms including rent, service charge, lease duration, break clauses, and what is included (air conditioning, generator, parking). Every listing is verified before going live.' },
  { q: 'How are commercial properties verified?', a: 'Our commercial team verifies title documents (C-of-O or leasehold title), the landlord\'s authority to lease, building approvals, and the accuracy of the advertised specifications before a listing is published.' },
  { q: 'Can I negotiate the lease terms?', a: 'Yes. Naya connects you directly with the agent or landlord. Most lease terms — rent, service charge, fit-out contributions, and break clauses — are negotiable. We encourage formal heads of terms before signing.' },
  { q: 'What documents should I request before signing?', a: 'Request the Certificate of Occupancy (C-of-O) or Deed of Assignment, building approval, fire safety certificate, and the landlord\'s evidence of title. Our legal team can guide you through the process.' },
  { q: 'Does Naya offer tenant representation?', a: 'Yes — for transactions above ₦10M annually, our commercial team can act as your tenant representative at no additional cost. Contact commercial@naya.ng to discuss your requirements.' },
]

// ── Type matcher ───────────────────────────────────────────────────────────────
function matchType(p: Property, type: string): boolean {
  if (type === 'all') return true
  const title = p.title.toLowerCase()
  const features = p.features.join(' ').toLowerCase()
  const desc = p.description.toLowerCase()
  if (type === 'office') return features.includes('office') || title.includes('office') || title.includes('suite') || features.includes('grade a')
  if (type === 'retail') return title.includes('retail') || title.includes('shop') || title.includes('plaza') || features.includes('shop')
  if (type === 'warehouse') return title.includes('warehouse') || title.includes('industrial') || features.includes('loading bay')
  if (type === 'hospitality') return title.includes('hotel') || title.includes('event') || title.includes('boutique')
  if (type === 'land') return p.propertyType === 'land'
  if (type === 'specialist') return title.includes('clinic') || title.includes('bank') || title.includes('petrol') || title.includes('filling') || title.includes('medical')
  return true
}

// ── Commercial Card ────────────────────────────────────────────────────────────
function CommercialCard({ p }: { p: Property }) {
  const [expanded, setExpanded] = useState(false)
  const isLease = p.listingType === 'lease'
  const isSale = p.listingType === 'sale'

  const typeIcon = p.propertyType === 'land' ? '🌿' :
    p.title.toLowerCase().includes('warehouse') ? '🏭' :
    p.title.toLowerCase().includes('hotel') ? '🏨' :
    p.title.toLowerCase().includes('event') ? '🎪' :
    p.title.toLowerCase().includes('retail') || p.title.toLowerCase().includes('shop') ? '🏪' :
    p.title.toLowerCase().includes('clinic') || p.title.toLowerCase().includes('medical') ? '🏥' :
    p.title.toLowerCase().includes('filling') || p.title.toLowerCase().includes('petrol') ? '⛽' :
    p.title.toLowerCase().includes('bank') ? '🏦' : '🏢'

  const gradients: Record<string, string> = {
    land: 'from-green-950 to-lime-950',
    commercial: 'from-blue-950 to-cyan-950',
  }
  const gradient = gradients[p.propertyType] || 'from-slate-900 to-zinc-900'

  return (
    <div className="card overflow-hidden hover:border-gold-300 transition-all group">
      {/* Image / Visual */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="text-6xl opacity-25">{typeIcon}</div>
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {p.isFeatured && <span className="badge-gold text-[10px]">⭐ Featured</span>}
          {p.isNew && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-medium">New</span>}
          {p.isVerified && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm font-medium">✓ Verified</span>}
          {p.virtualTour && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/80 text-white font-medium">360° Tour</span>}
        </div>

        {/* Listing type */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${isLease ? 'bg-blue-500/80 text-white' : 'bg-gold-500 text-obsidian-900'}`}>
            {isLease ? 'For Lease' : 'For Sale'}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="bg-obsidian-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gold-500/20">
            <div className="font-display text-lg font-medium text-gold-400">{fmt(p.price)}</div>
            <div className="text-[10px] text-white/50">{fmtPeriod(p.pricePeriod) || 'total'}</div>
          </div>
          <div className="bg-obsidian-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
            <div className="font-mono text-sm font-bold text-white">{p.sizeSqm.toLocaleString()}</div>
            <div className="text-[10px] text-white/50">sqm</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <Link href={`/properties/${p.slug}`}>
          <h3 className="font-display text-lg font-medium text-obsidian-900 leading-snug mb-1 group-hover:text-gold-600 transition-colors">{p.title}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-obsidian-400 mb-3">
          <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0" />{p.address}
        </div>

        {/* Key specs */}
        <div className="grid grid-cols-3 gap-2 mb-3 py-3 border-y border-surface-border text-center">
          <div>
            <div className="font-mono text-sm font-bold text-obsidian-900">{p.sizeSqm.toLocaleString()}</div>
            <div className="text-[10px] text-obsidian-400">sqm</div>
          </div>
          <div>
            <div className="font-mono text-sm font-bold text-obsidian-900">{p.parkingSpaces}</div>
            <div className="text-[10px] text-obsidian-400">parking</div>
          </div>
          <div>
            <div className="font-mono text-sm font-bold text-obsidian-900">{p.yearBuilt || 'N/A'}</div>
            <div className="text-[10px] text-obsidian-400">built</div>
          </div>
        </div>

        {/* Description toggle */}
        <div className={`text-xs text-obsidian-500 leading-relaxed mb-3 ${expanded ? '' : 'line-clamp-2'}`}>
          {p.description}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-gold-600 hover:text-gold-500 mb-3 flex items-center gap-1">
          {expanded ? <><ChevronUp className="w-3 h-3" />Less</> : <><ChevronDown className="w-3 h-3" />Read more</>}
        </button>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.features.slice(0, 4).map((f, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-obsidian-900/5 text-obsidian-600 border border-obsidian-900/10 font-medium">{f}</span>
          ))}
          {p.features.length > 4 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-400">+{p.features.length - 4} more</span>}
        </div>

        {/* CTA row */}
        <div className="flex gap-2 pt-3 border-t border-surface-border">
          <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer"
            className="flex-1 btn-dark btn-sm justify-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />WhatsApp
          </a>
          <a href="tel:+2348168117004" className="w-9 h-9 rounded-xl border border-surface-border flex items-center justify-center hover:border-gold-300 transition-colors">
            <Phone className="w-3.5 h-3.5 text-obsidian-500" />
          </a>
          <Link href={`/properties/${p.slug}`} className="btn-primary btn-sm flex-1 justify-center">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── FAQ Item ───────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-subtle transition-colors">
        <span className="font-medium text-obsidian-900 text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gold-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-surface-border pt-4">
          <p className="text-sm text-obsidian-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CommercialPage() {
  const [searchQuery, setSearchQuery]     = useState('')
  const [activeType, setActiveType]       = useState('all')
  const [listingType, setListingType]     = useState('all')
  const [selectedArea, setSelectedArea]   = useState('all')
  const [sizeRange, setSizeRange]         = useState<typeof sizeRanges[0] | null>(null)
  const [sortBy, setSortBy]               = useState('featured')
  const [verifiedOnly, setVerifiedOnly]   = useState(false)
  const [virtualTourOnly, setVirtualTourOnly] = useState(false)

  const allCommercial: Property[] = [
    ...properties.filter(p => p.listingType === 'lease' || (p.listingType === 'sale' && p.propertyType === 'commercial')),
    ...commercialListings,
  ]

  const filtered = useMemo(() => {
    let r = allCommercial.filter(p => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.address.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (!matchType(p, activeType)) return false
      if (listingType !== 'all' && p.listingType !== listingType) return false
      if (selectedArea !== 'all' && p.neighborhood !== selectedArea) return false
      if (sizeRange && (p.sizeSqm < sizeRange.min || p.sizeSqm > sizeRange.max)) return false
      if (verifiedOnly && !p.isVerified) return false
      if (virtualTourOnly && !p.virtualTour) return false
      return true
    })
    switch (sortBy) {
      case 'price_asc':  r = [...r].sort((a, b) => a.price - b.price); break
      case 'price_desc': r = [...r].sort((a, b) => b.price - a.price); break
      case 'size_desc':  r = [...r].sort((a, b) => b.sizeSqm - a.sizeSqm); break
      case 'newest':     r = [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'popular':    r = [...r].sort((a, b) => b.enquiries - a.enquiries); break
      default:           r = [...r].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return r
  }, [searchQuery, activeType, listingType, selectedArea, sizeRange, sortBy, verifiedOnly, virtualTourOnly])

  const activeFilters = [activeType !== 'all', listingType !== 'all', selectedArea !== 'all', sizeRange !== null, verifiedOnly, virtualTourOnly].filter(Boolean).length

  const clearAll = () => {
    setActiveType('all'); setListingType('all'); setSelectedArea('all')
    setSizeRange(null); setVerifiedOnly(false); setVirtualTourOnly(false); setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gold-500/8 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />

        <div className="page-container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Commercial Real Estate · Port Harcourt</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.92] tracking-tight mb-6">
                Premium<br />
                <span className="gold-text">Commercial</span><br />
                Space
              </h1>
              <p className="text-white/40 text-xl font-light leading-relaxed max-w-xl">
                Grade A offices, industrial warehouses, retail plazas, and specialist facilities — all verified and ready for occupation.
              </p>
            </div>

            {/* Search */}
            <div className="card p-2 flex gap-2 max-w-3xl shadow-gold-lg mb-6">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0" />
                <input className="flex-1 bg-transparent text-obsidian-900 placeholder-obsidian-300 outline-none text-sm"
                  placeholder="Search office, warehouse, retail, area..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-obsidian-300" /></button>}
              </div>
              <select className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none"
                value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                <option value="all">All Areas</option>
                {neighborhoods.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
              </select>
              <select className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none"
                value={listingType} onChange={e => setListingType(e.target.value)}>
                {listingTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <button className="btn-primary px-6 flex-shrink-0">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>

            {/* Type Pills */}
            <div className="flex flex-wrap gap-2">
              {commercialTypes.map(t => (
                <button key={t.value} onClick={() => setActiveType(t.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all ${activeType === t.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/50 border-white/15 hover:bg-white/15'}`}>
                  <t.icon className="w-3.5 h-3.5" />{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* ── MARKET INDICATORS ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-surface-border">
        <div className="page-container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {marketStats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="font-mono text-xs text-obsidian-400 mb-0.5">{s.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-medium text-obsidian-900">{s.value}</span>
                    <span className="text-xs font-mono font-bold text-emerald-500">{s.change}</span>
                  </div>
                  <div className="text-[10px] text-obsidian-300">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTOR TABS ──────────────────────────────────────────────────── */}
      <section className="py-10 bg-surface-bg border-b border-surface-border">
        <div className="page-container">
          <div className="text-center mb-6">
            <span className="section-number">By Sector</span>
            <h2 className="font-display text-2xl font-medium text-obsidian-900">Who Uses Our Commercial Listings</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {sectors.map((s, i) => (
              <div key={i} className="card p-4 text-center hover:border-gold-200 transition-colors">
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="font-semibold text-obsidian-900 text-xs mb-1">{s.label}</div>
                <div className="text-[10px] text-obsidian-400 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
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
                      <SlidersHorizontal className="w-4 h-4 text-gold-500" />Filters
                    </h3>
                    {activeFilters > 0 && (
                      <button onClick={clearAll} className="text-xs text-gold-600 font-medium">Clear ({activeFilters})</button>
                    )}
                  </div>

                  <div className="space-y-5">
                    {/* Lease / Sale */}
                    <div>
                      <label className="input-label">Transaction Type</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {listingTypes.map(t => (
                          <button key={t.value} onClick={() => setListingType(t.value)}
                            className={`py-2 rounded-xl text-xs font-medium border transition-all ${listingType === t.value ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-500 border-surface-border'}`}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className="input-label">Property Type</label>
                      <div className="space-y-1">
                        {commercialTypes.map(t => (
                          <button key={t.value} onClick={() => setActiveType(t.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${activeType === t.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="flex-1 text-left">{t.label}</span>
                            {activeType === t.value && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Area */}
                    <div>
                      <label className="input-label">Location</label>
                      <select className="input-field text-sm" value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                        <option value="all">All Areas</option>
                        {neighborhoods.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
                      </select>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="input-label">Size (sqm)</label>
                      <div className="space-y-1.5">
                        {sizeRanges.map((r, i) => (
                          <button key={i} onClick={() => setSizeRange(sizeRange === r ? null : r)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-all ${sizeRange === r ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {r.label} {sizeRange === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3 pt-3 border-t border-surface-border">
                      {[
                        { label: 'Verified Listings Only', val: verifiedOnly, set: setVerifiedOnly },
                        { label: 'Virtual Tour Available', val: virtualTourOnly, set: setVirtualTourOnly },
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

                {/* Tenant Rep */}
                <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10">
                    <div className="text-2xl mb-3">🤝</div>
                    <h3 className="font-display text-base font-medium text-white mb-2">Free Tenant Representation</h3>
                    <p className="text-white/40 text-xs leading-relaxed mb-4">For leases above ₦10M/yr, our commercial team represents your interests at no cost to you.</p>
                    <a href="mailto:commercial@naya.ng" className="btn-primary btn-sm w-full justify-center">Contact Commercial Team</a>
                  </div>
                </div>

                {/* Market Report CTA */}
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-5 h-5 text-gold-500" />
                    <h3 className="font-display text-base font-medium text-obsidian-900">PH Commercial Report</h3>
                  </div>
                  <p className="text-xs text-obsidian-400 mb-4 leading-relaxed">Q1 2026 office, retail, and industrial market data for Port Harcourt.</p>
                  <Link href="/market-trends" className="btn-secondary btn-sm w-full justify-center">
                    <FileText className="w-3.5 h-3.5" />View Report
                  </Link>
                </div>
              </div>
            </div>

            {/* ── RESULTS ────────────────────────────────────────────────── */}
            <div className="lg:col-span-3">

              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-obsidian-900">
                    {filtered.length} Commercial {filtered.length === 1 ? 'Property' : 'Properties'}
                  </h2>
                  <p className="text-sm text-obsidian-400 mt-0.5">
                    {selectedArea !== 'all' ? selectedArea : 'All areas'} · Port Harcourt
                    {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`}
                  </p>
                </div>
                <select className="input-field text-sm py-2" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Active Filter Pills */}
              {activeFilters > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {activeType !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {commercialTypes.find(t => t.value === activeType)?.label}
                      <button onClick={() => setActiveType('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {listingType !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-700">
                      {listingType === 'lease' ? 'For Lease' : 'For Sale'}
                      <button onClick={() => setListingType('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedArea !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      <MapPin className="w-3 h-3" />{selectedArea}
                      <button onClick={() => setSelectedArea('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {sizeRange && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {sizeRange.label} <button onClick={() => setSizeRange(null)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}

              {/* Grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map(p => <CommercialCard key={p.id} p={p} />)}
                </div>
              ) : (
                <div className="text-center py-20 card">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No listings found</h3>
                  <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">Adjust your filters or contact our commercial team for off-market options.</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={clearAll} className="btn-primary">Clear Filters</button>
                    <a href="mailto:commercial@naya.ng" className="btn-secondary">Contact Team</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Market Intelligence</span>
            <h2 className="section-title">Commercial Rental Rates by Zone</h2>
            <p className="section-desc mx-auto">Average annual lease rates per sqm across Port Harcourt commercial zones. Updated Q1 2026.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-obsidian-900">
                  <th className="text-left py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Property Type</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">GRA Phase 2</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Old GRA</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Trans Amadi</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Woji / Rumuola</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-emerald-600 uppercase tracking-wider">YoY Change</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Grade A Office',          gra: '₦20K–28K', oldgra: '₦16K–22K', ta: '₦12K–18K', woji: '₦10K–15K', change: '+11%' },
                  { type: 'Grade B Office',           gra: '₦12K–18K', oldgra: '₦10K–15K', ta: '₦8K–12K',  woji: '₦6K–10K',  change: '+7%' },
                  { type: 'Serviced Office (per desk)',gra: '₦150K–250K/mo', oldgra: '₦120K–200K/mo', ta: '₦80K–150K/mo', woji: '₦60K–100K/mo', change: '+9%' },
                  { type: 'Retail (Prime)',            gra: '₦35K–50K', oldgra: '₦28K–42K', ta: '₦18K–28K', woji: '₦12K–20K', change: '+14%' },
                  { type: 'Retail (Secondary)',        gra: '₦18K–28K', oldgra: '₦14K–22K', ta: '₦10K–16K', woji: '₦7K–12K',  change: '+8%' },
                  { type: 'Industrial Warehouse',      gra: 'N/A',      oldgra: 'N/A',       ta: '₦7K–12K',  woji: '₦5K–9K',   change: '+8%' },
                  { type: 'Commercial Land (per sqm)', gra: '₦120K+',   oldgra: '₦90K+',     ta: '₦55K–80K', woji: '₦35K–55K', change: '+18%' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-surface-border ${i % 2 === 0 ? 'bg-surface-subtle/50' : 'bg-white'}`}>
                    <td className="py-3 px-4 font-medium text-obsidian-900">{row.type}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-gold-600 font-medium">{row.gra}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-obsidian-600">{row.oldgra}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-obsidian-600">{row.ta}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-obsidian-600">{row.woji}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold text-emerald-500">{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-obsidian-400 mt-4 text-center">All rates are annual (₦/sqm/year) unless stated otherwise. Serviced office rates are monthly per desk. Based on verified transactions.</p>
        </div>
      </section>

      {/* ── WHY NAYA COMMERCIAL ──────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg adire-bg">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Our Commercial Edge</span>
            <h2 className="section-title">Why Corporates Choose Naya</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: 'Title Verified',        desc: 'Every commercial listing has verified C-of-O or leasehold title before going live.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: Users, title: 'Tenant Representation', desc: 'Our agents represent tenants in negotiations for leases above ₦10M annually — at no cost.', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: FileText, title: 'Legal Guidance',      desc: 'We guide you through heads of terms, lease agreements, and title verification step by step.', color: 'text-gold-600', bg: 'bg-gold-50' },
              { icon: Clock, title: 'Fast Transactions',      desc: 'Most commercial enquiries receive a response within 2 hours. We move at your pace.', color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map((v, i) => (
              <div key={i} className="card p-6">
                <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-2">{v.title}</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="section-number">Questions</span>
              <h2 className="section-title">Commercial FAQs</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div>
              <span className="section-number text-gold-500">Get Expert Help</span>
              <h2 className="font-display text-4xl font-light text-white mb-4 leading-tight">
                Speak to Our<br /><span className="gold-text">Commercial Team</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-6">
                Our commercial specialists know Port Harcourt's business districts inside out. Tell us your requirements and we will find the right space — even off-market.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Grade A office search across all GRA zones',
                  'Industrial and warehouse acquisitions',
                  'Retail site identification and acquisition',
                  'Investment property and yield analysis',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:commercial@naya.ng" className="btn-primary btn-lg">
                  Email commercial@naya.ng
                </a>
                <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '13+', label: 'Commercial listings available' },
                { value: '₦380M', label: 'Largest commercial asset listed' },
                { value: '2 hrs', label: 'Average enquiry response time' },
                { value: '100%', label: 'Listings with verified titles' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-display text-3xl font-light text-gold-400 mb-1">{s.value}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
