export const dynamic = 'force-dynamic';

'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, MapPin, SlidersHorizontal, ArrowRight, CheckCircle2,
  Trees, Building2, Layers, TrendingUp, Shield, FileText, Award,
  MessageCircle, Phone, ChevronDown, ChevronUp, BarChart3,
  Maximize, Compass, Zap, Droplets, Navigation, AlertCircle, Star
} from 'lucide-react'
import { landListings, neighborhoods } from '@/lib/data'
import type { LandListing } from '@/lib/data'

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(1)}B`
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(0)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}
function fmtSqm(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(2)} ha`
  return `${n.toLocaleString()} sqm`
}

// ── Config ─────────────────────────────────────────────────────────────────────
const titleConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  cof_o:             { label: 'Certificate of Occupancy', color: 'text-emerald-700', bg: 'bg-emerald-50',  icon: '🏛' },
  deed_of_assignment:{ label: 'Deed of Assignment',       color: 'text-blue-700',    bg: 'bg-blue-50',    icon: '📜' },
  governors_consent: { label: "Governor's Consent",       color: 'text-gold-700',    bg: 'bg-gold-50',    icon: '⚖️' },
  survey_plan:       { label: 'Survey Plan Only',          color: 'text-amber-700',   bg: 'bg-amber-50',   icon: '📐' },
  gazette:           { label: 'Gazette Title',             color: 'text-purple-700',  bg: 'bg-purple-50',  icon: '📋' },
  family_land:       { label: 'Family Land',               color: 'text-rose-700',    bg: 'bg-rose-50',    icon: '👨‍👩‍👧' },
}

const landUseConfig: Record<string, { label: string; emoji: string; gradient: string }> = {
  residential:  { label: 'Residential',  emoji: '🏡', gradient: 'from-emerald-950 to-teal-950' },
  commercial:   { label: 'Commercial',   emoji: '🏢', gradient: 'from-blue-950 to-cyan-950' },
  industrial:   { label: 'Industrial',   emoji: '🏭', gradient: 'from-slate-900 to-zinc-900' },
  agricultural: { label: 'Agricultural', emoji: '🌾', gradient: 'from-green-950 to-lime-950' },
  mixed_use:    { label: 'Mixed-Use',    emoji: '🏙', gradient: 'from-violet-950 to-indigo-950' },
  institutional:{ label: 'Institutional',emoji: '🏛', gradient: 'from-amber-950 to-orange-950' },
}

const topographyConfig: Record<string, { label: string; icon: string }> = {
  flat:          { label: 'Flat Terrain',    icon: '⬜' },
  gentle_slope:  { label: 'Gentle Slope',    icon: '📐' },
  elevated:      { label: 'Elevated',        icon: '⛰' },
  waterfront:    { label: 'Waterfront',      icon: '🌊' },
  corner_plot:   { label: 'Corner Plot',     icon: '📍' },
}

const filterLandUse = [
  { value: 'all',          label: 'All Land Types', icon: Trees },
  { value: 'residential',  label: 'Residential',    icon: Trees },
  { value: 'commercial',   label: 'Commercial',     icon: Building2 },
  { value: 'industrial',   label: 'Industrial',     icon: Building2 },
  { value: 'mixed_use',    label: 'Mixed-Use',      icon: Layers },
  { value: 'agricultural', label: 'Agricultural',   icon: Trees },
]

const filterTitle = [
  { value: 'all',              label: 'Any Title' },
  { value: 'cof_o',            label: 'C of O' },
  { value: 'deed_of_assignment', label: 'Deed of Assignment' },
  { value: 'governors_consent', label: "Gov's Consent" },
  { value: 'gazette',          label: 'Gazette' },
]

const sizeRanges = [
  { label: 'Under 400 sqm',       min: 0,     max: 400 },
  { label: '400 – 800 sqm',       min: 400,   max: 800 },
  { label: '800 – 2,000 sqm',     min: 800,   max: 2000 },
  { label: '2,000 – 10,000 sqm',  min: 2000,  max: 10000 },
  { label: 'Above 10,000 sqm',    min: 10000, max: Infinity },
]

const priceRanges = [
  { label: 'Under ₦30M',      min: 0,          max: 30000000 },
  { label: '₦30M – ₦100M',   min: 30000000,   max: 100000000 },
  { label: '₦100M – ₦300M',  min: 100000000,  max: 300000000 },
  { label: 'Above ₦300M',    min: 300000000,  max: Infinity },
]

const sortOptions = [
  { value: 'featured',       label: 'Featured First' },
  { value: 'price_asc',      label: 'Price: Low to High' },
  { value: 'price_desc',     label: 'Price: High to Low' },
  { value: 'size_asc',       label: 'Size: Smallest First' },
  { value: 'size_desc',      label: 'Size: Largest First' },
  { value: 'price_sqm_asc',  label: '₦/sqm: Cheapest First' },
  { value: 'newest',         label: 'Newest Listed' },
  { value: 'popular',        label: 'Most Enquired' },
]

const marketStats = [
  { label: 'Avg ₦/sqm — GRA Phase 2', value: '₦400K', change: '+22%', sub: 'vs 2024' },
  { label: 'Avg ₦/sqm — Woji',        value: '₦138K', change: '+19%', sub: 'fastest growth' },
  { label: 'Avg ₦/sqm — Rumuola',     value: '₦82K',  change: '+16%', sub: 'best value' },
  { label: 'Avg days to sell',         value: '28 days', change: '-22%', sub: 'high demand' },
]

const titleStrength = [
  { title: 'C of O',            score: 5, desc: 'Strongest title. Registered with the State. Full ownership rights.' },
  { title: "Governor's Consent", score: 4, desc: 'Strong title. State-backed consent for land transactions.' },
  { title: 'Deed of Assignment', score: 3, desc: 'Good title. Legally transfers ownership. Common in estates.' },
  { title: 'Gazette',            score: 3, desc: 'Recognised for agricultural and institutional land.' },
  { title: 'Survey Plan Only',   score: 2, desc: 'Confirms boundaries only. Upgrade to C of O recommended.' },
  { title: 'Family Land',        score: 1, desc: 'Requires due diligence. Family disputes possible. Seek legal advice.' },
]

const dueDiligenceSteps = [
  { step: '01', title: 'Verify the Title',         desc: 'Request original title documents and confirm authenticity at the Lands Registry in Port Harcourt.' },
  { step: '02', title: 'Survey Confirmation',       desc: 'Engage a registered surveyor to confirm plot boundaries against the survey plan.' },
  { step: '03', title: 'Search at Lands Registry',  desc: 'Conduct an official search at the Rivers State Lands Registry to confirm no encumbrances, liens, or government acquisition.' },
  { step: '04', title: 'Physical Inspection',       desc: 'Visit the site. Confirm access, topography, drainage, and that the physical plot matches the survey plan.' },
  { step: '05', title: 'Check Zoning & Approvals',  desc: 'Verify permitted land use and building approvals with the Port Harcourt Urban Development Board (PHUDEB).' },
  { step: '06', title: 'Engage a Property Lawyer',  desc: 'Appoint a qualified property lawyer to review all documents before signing any contract or making any payment.' },
]

// ── Land Card ─────────────────────────────────────────────────────────────────
function LandCard({ land }: { land: LandListing }) {
  const [expanded, setExpanded] = useState(false)
  const use = landUseConfig[land.landUse]
  const title = titleConfig[land.titleType]
  const topo = topographyConfig[land.topography]

  return (
    <div className="card overflow-hidden hover:border-gold-300 transition-all group">
      {/* Visual */}
      <div className={`relative h-44 bg-gradient-to-br ${use.gradient} flex items-center justify-center overflow-hidden`}>
        <div className="text-7xl opacity-20">{use.emoji}</div>
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-25" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {land.isFeatured && <span className="badge-gold text-[10px]">⭐ Featured</span>}
          {land.isNew && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-medium">New</span>}
          {land.status === 'under_offer' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-medium">Under Offer</span>}
        </div>

        {/* Title type badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${title.bg} ${title.color} border border-current/20`}>
            {title.icon} {title.label}
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="bg-obsidian-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gold-500/20">
            <div className="font-display text-lg font-medium text-gold-400">{fmt(land.priceTotal)}</div>
            <div className="text-[10px] text-white/40">{fmt(land.pricePerSqm)}/sqm</div>
          </div>
          <div className="bg-obsidian-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10 text-center">
            <div className="font-mono text-base font-bold text-white">{fmtSqm(land.sizeSqm)}</div>
            <div className="text-[10px] text-white/40">plot size</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-base font-medium text-obsidian-900 leading-snug group-hover:text-gold-600 transition-colors">
            {land.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-obsidian-400 mb-3">
          <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0" />{land.address}
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 py-3 border-y border-surface-border text-center">
          <div>
            <div className="font-mono text-sm font-bold text-obsidian-900">{land.sizeSqm.toLocaleString()}</div>
            <div className="text-[10px] text-obsidian-400">sqm</div>
          </div>
          <div>
            <div className="font-mono text-sm font-bold text-obsidian-900">{fmt(land.pricePerSqm)}</div>
            <div className="text-[10px] text-obsidian-400">per sqm</div>
          </div>
          <div>
            <div className="text-sm font-bold text-obsidian-900">{topo.icon} {topo.label.split(' ')[0]}</div>
            <div className="text-[10px] text-obsidian-400">topography</div>
          </div>
        </div>

        {/* Land use + Zoning */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-subtle text-obsidian-600 border border-surface-border">
            {use.emoji} {use.label}
          </span>
          {land.priceNegotiable && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Negotiable
            </span>
          )}
        </div>

        {/* Description */}
        <div className={`text-xs text-obsidian-500 leading-relaxed mb-2 ${expanded ? '' : 'line-clamp-2'}`}>
          {land.description}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-gold-600 hover:text-gold-500 mb-3 flex items-center gap-1">
          {expanded ? <><ChevronUp className="w-3 h-3" />Less</> : <><ChevronDown className="w-3 h-3" />More details</>}
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="mb-4 space-y-3">
            {land.zoningNotes && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />Zoning Notes
                </div>
                <p className="text-xs text-amber-600 leading-relaxed">{land.zoningNotes}</p>
              </div>
            )}
            <div>
              <div className="text-xs font-medium text-obsidian-600 mb-1.5">Access</div>
              <p className="text-xs text-obsidian-500 leading-relaxed">{land.access}</p>
            </div>
            <div>
              <div className="text-xs font-medium text-obsidian-600 mb-1.5">Utilities Available</div>
              <div className="flex flex-wrap gap-1">
                {land.utilities.map((u, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{u}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-obsidian-600 mb-1.5">Nearby</div>
              <div className="space-y-1">
                {land.nearbyLandmarks.map((l, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-obsidian-500">
                    <Navigation className="w-3 h-3 text-gold-500 flex-shrink-0" />{l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {land.features.slice(0, 3).map((f, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-obsidian-900/5 text-obsidian-600 border border-obsidian-900/10">{f}</span>
          ))}
          {land.features.length > 3 && <span className="text-[10px] text-obsidian-400">+{land.features.length - 3} more</span>}
        </div>

        {/* CTA */}
        <div className="flex gap-2 pt-3 border-t border-surface-border">
          <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer"
            className="flex-1 btn-primary btn-sm justify-center">
            <MessageCircle className="w-3.5 h-3.5" />Enquire
          </a>
          <a href="tel:+2348168117004"
            className="w-9 h-9 rounded-xl border border-surface-border flex items-center justify-center hover:border-gold-300 transition-colors">
            <Phone className="w-3.5 h-3.5 text-obsidian-500" />
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LandPage() {
  const [searchQuery, setSearchQuery]   = useState('')
  const [activeLandUse, setActiveLandUse] = useState('all')
  const [activeTitle, setActiveTitle]   = useState('all')
  const [selectedArea, setSelectedArea] = useState('all')
  const [sizeRange, setSizeRange]       = useState<typeof sizeRanges[0] | null>(null)
  const [priceRange, setPriceRange]     = useState<typeof priceRanges[0] | null>(null)
  const [sortBy, setSortBy]             = useState('featured')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [negotiableOnly, setNegotiableOnly] = useState(false)

  const allAreas = [...new Set(landListings.map(l => l.neighborhood))]

  const filtered = useMemo(() => {
    let r = landListings.filter(l => {
      if (l.status === 'sold') return false
      if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !l.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !l.address.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeLandUse !== 'all' && l.landUse !== activeLandUse) return false
      if (activeTitle !== 'all' && l.titleType !== activeTitle) return false
      if (selectedArea !== 'all' && l.neighborhood !== selectedArea) return false
      if (sizeRange && (l.sizeSqm < sizeRange.min || l.sizeSqm > sizeRange.max)) return false
      if (priceRange && (l.priceTotal < priceRange.min || l.priceTotal > priceRange.max)) return false
      if (verifiedOnly && !l.isVerified) return false
      if (negotiableOnly && !l.priceNegotiable) return false
      return true
    })
    switch (sortBy) {
      case 'price_asc':     r = [...r].sort((a, b) => a.priceTotal - b.priceTotal); break
      case 'price_desc':    r = [...r].sort((a, b) => b.priceTotal - a.priceTotal); break
      case 'size_asc':      r = [...r].sort((a, b) => a.sizeSqm - b.sizeSqm); break
      case 'size_desc':     r = [...r].sort((a, b) => b.sizeSqm - a.sizeSqm); break
      case 'price_sqm_asc': r = [...r].sort((a, b) => a.pricePerSqm - b.pricePerSqm); break
      case 'newest':        r = [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'popular':       r = [...r].sort((a, b) => b.enquiries - a.enquiries); break
      default:              r = [...r].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return r
  }, [searchQuery, activeLandUse, activeTitle, selectedArea, sizeRange, priceRange, sortBy, verifiedOnly, negotiableOnly])

  const activeFilters = [activeLandUse !== 'all', activeTitle !== 'all', selectedArea !== 'all', sizeRange !== null, priceRange !== null, verifiedOnly, negotiableOnly].filter(Boolean).length

  const clearAll = () => {
    setActiveLandUse('all'); setActiveTitle('all'); setSelectedArea('all')
    setSizeRange(null); setPriceRange(null); setVerifiedOnly(false); setNegotiableOnly(false); setSearchQuery('')
  }

  // Price per sqm comparison data
  const priceComparison = [
    { area: 'GRA Phase 2', residential: 400000, commercial: 650000, trend: '+22%' },
    { area: 'Old GRA',     residential: 380000, commercial: 580000, trend: '+15%' },
    { area: 'Woji',        residential: 138000, commercial: 210000, trend: '+19%' },
    { area: 'Trans Amadi', residential: 95000,  commercial: 180000, trend: '+12%' },
    { area: 'Rumuola',     residential: 82000,  commercial: 130000, trend: '+16%' },
    { area: 'Eleme',       residential: 70000,  commercial: 105000, trend: '+8%' },
  ]
  const maxPrice = Math.max(...priceComparison.map(p => p.commercial))

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gold-500/8 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />

        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <Trees className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">
                {landListings.filter(l => l.status === 'active').length} Plots Available · Port Harcourt & Rivers State
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.92] tracking-tight mb-6">
              Land &<br />
              <span className="gold-text">Plots</span><br />
              <span className="text-white/40">for Sale</span>
            </h1>
            <p className="text-white/40 text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Verified residential, commercial, and industrial land across Port Harcourt and Rivers State. Every listing title-checked before it goes live.
            </p>

            {/* Search */}
            <div className="card p-2 flex gap-2 max-w-3xl mx-auto shadow-gold-lg mb-5">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0" />
                <input className="flex-1 bg-transparent text-obsidian-900 placeholder-obsidian-300 outline-none text-sm"
                  placeholder="Search area, estate name, or plot description..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-obsidian-300" /></button>}
              </div>
              <select className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none"
                value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                <option value="all">All Areas</option>
                {allAreas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <button className="btn-primary px-6 flex-shrink-0">
                <Search className="w-4 h-4" />Search
              </button>
            </div>

            {/* Land Use Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {filterLandUse.map(u => (
                <button key={u.value} onClick={() => setActiveLandUse(u.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all ${activeLandUse === u.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/50 border-white/15 hover:bg-white/15'}`}>
                  <u.icon className="w-3.5 h-3.5" />{u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {marketStats.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="font-display text-2xl font-light text-gold-400 mb-1">{s.value}</div>
                <div className="text-xs text-white/40 leading-relaxed">{s.label}</div>
                <div className="text-xs text-emerald-400 font-mono font-bold mt-1">{s.change} {s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* ── TITLE STRENGTH GUIDE ─────────────────────────────────────────── */}
      <section className="py-8 bg-white border-b border-surface-border">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-gold-500" />
            <h2 className="font-display text-lg font-medium text-obsidian-900">Title Strength Guide</h2>
            <span className="text-xs text-obsidian-400">Always check your title before buying land in Nigeria</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {titleStrength.map((t, i) => (
              <div key={i} className="card p-3 text-center">
                <div className="flex justify-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className={`w-3 h-3 rounded-full ${j < t.score ? 'bg-gold-500' : 'bg-obsidian-100'}`} />
                  ))}
                </div>
                <div className="font-semibold text-obsidian-900 text-xs mb-1">{t.title}</div>
                <p className="text-[10px] text-obsidian-400 leading-relaxed">{t.desc}</p>
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

                    {/* Land Use */}
                    <div>
                      <label className="input-label">Land Use</label>
                      <div className="space-y-1">
                        {filterLandUse.map(u => (
                          <button key={u.value} onClick={() => setActiveLandUse(u.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${activeLandUse === u.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            <u.icon className="w-3.5 h-3.5 flex-shrink-0" />{u.label}
                            {activeLandUse === u.value && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title Type */}
                    <div>
                      <label className="input-label">Title Type</label>
                      <div className="space-y-1">
                        {filterTitle.map(t => (
                          <button key={t.value} onClick={() => setActiveTitle(t.value)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs border transition-all ${activeTitle === t.value ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {t.value !== 'all' && titleConfig[t.value] ? `${titleConfig[t.value].icon} ` : ''}{t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Area */}
                    <div>
                      <label className="input-label">Area</label>
                      <select className="input-field text-sm" value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                        <option value="all">All Areas</option>
                        {allAreas.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="input-label">Price Range</label>
                      <div className="space-y-1.5">
                        {priceRanges.map((r, i) => (
                          <button key={i} onClick={() => setPriceRange(priceRange === r ? null : r)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-all ${priceRange === r ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {r.label} {priceRange === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Plot Size */}
                    <div>
                      <label className="input-label">Plot Size</label>
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
                        { label: 'Price Negotiable', val: negotiableOnly, set: setNegotiableOnly },
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

                {/* Price Comparison Widget */}
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-gold-500" />
                    <h3 className="font-display text-base font-medium text-obsidian-900">₦/sqm by Area</h3>
                  </div>
                  <div className="space-y-3">
                    {priceComparison.map((p, i) => {
                      const resPct = (p.residential / maxPrice) * 100
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-obsidian-600 font-medium">{p.area}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs text-obsidian-900">{fmt(p.residential)}</span>
                              <span className="text-[10px] text-emerald-500 font-mono font-bold">{p.trend}</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
                              style={{ width: `${resPct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-[10px] text-obsidian-400 mt-3">Residential land. Updated Q1 2026.</p>
                </div>

                {/* Land Finder CTA */}
                <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10 text-center">
                    <div className="text-3xl mb-3">🔍</div>
                    <h3 className="font-display text-base font-medium text-white mb-2">Can't Find the Right Plot?</h3>
                    <p className="text-white/40 text-xs leading-relaxed mb-4">Tell us your requirements and our land specialists will source off-market plots for you.</p>
                    <a href="mailto:land@naya.ng" className="btn-primary btn-sm w-full justify-center">land@naya.ng</a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RESULTS ────────────────────────────────────────────────── */}
            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-obsidian-900">
                    {filtered.length} Plot{filtered.length !== 1 ? 's' : ''} Available
                  </h2>
                  <p className="text-sm text-obsidian-400 mt-0.5">
                    {selectedArea !== 'all' ? selectedArea : 'All areas'} · Rivers State
                    {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`}
                  </p>
                </div>
                <select className="input-field text-sm py-2" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Active Filters */}
              {activeFilters > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {activeLandUse !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {filterLandUse.find(u => u.value === activeLandUse)?.label}
                      <button onClick={() => setActiveLandUse('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {activeTitle !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {filterTitle.find(t => t.value === activeTitle)?.label}
                      <button onClick={() => setActiveTitle('all')}><X className="w-3 h-3" /></button>
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
                  {sizeRange && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {sizeRange.label} <button onClick={() => setSizeRange(null)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map(l => <LandCard key={l.id} land={l} />)}
                </div>
              ) : (
                <div className="text-center py-20 card">
                  <div className="text-5xl mb-4">🌿</div>
                  <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No plots found</h3>
                  <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">Try adjusting your filters or contact our land team for off-market options.</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={clearAll} className="btn-primary">Clear Filters</button>
                    <a href="mailto:land@naya.ng" className="btn-secondary">Contact Land Team</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICE COMPARISON TABLE ───────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Market Intelligence</span>
            <h2 className="section-title">Land Price Comparison — Rivers State</h2>
            <p className="section-desc mx-auto">Average prices per square metre by land use type and location. Updated Q1 2026.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-obsidian-900">
                  <th className="text-left py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Area</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Residential</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Commercial</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Industrial</th>
                  <th className="text-right py-3 px-4 font-mono text-xs text-emerald-600 uppercase tracking-wider">YoY Growth</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { area: 'GRA Phase 2', res: '₦350K–450K', com: '₦550K–750K', ind: 'N/A',          yoy: '+22%' },
                  { area: 'Old GRA',     res: '₦320K–420K', com: '₦500K–650K', ind: 'N/A',          yoy: '+15%' },
                  { area: 'Woji',        res: '₦120K–160K', com: '₦180K–250K', ind: 'N/A',          yoy: '+19%' },
                  { area: 'Trans Amadi', res: '₦80K–110K',  com: '₦150K–200K', ind: '₦65K–95K',     yoy: '+12%' },
                  { area: 'Rumuola',     res: '₦70K–100K',  com: '₦120K–160K', ind: 'N/A',          yoy: '+16%' },
                  { area: 'Eleme',       res: '₦60K–85K',   com: '₦90K–130K',  ind: '₦45K–70K',     yoy: '+8%' },
                  { area: 'Bonny Island',res: '₦130K–180K', com: '₦200K–300K', ind: '₦100K–160K',   yoy: '+24%' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-surface-border ${i % 2 === 0 ? 'bg-surface-subtle/50' : 'bg-white'}`}>
                    <td className="py-3 px-4 font-medium text-obsidian-900">{row.area}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-obsidian-600">{row.res}/sqm</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-gold-600 font-medium">{row.com}/sqm</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-obsidian-500">{row.ind !== 'N/A' ? `${row.ind}/sqm` : '—'}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold text-emerald-500">{row.yoy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-obsidian-400 mt-4 text-center">Prices are indicative ₦/sqm based on verified Naya transactions. Actual prices vary by title type, topography, and access.</p>
        </div>
      </section>

      {/* ── DUE DILIGENCE GUIDE ──────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg adire-bg">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Buyer Protection</span>
            <h2 className="section-title">Land Due Diligence — 6 Essential Steps</h2>
            <p className="section-desc mx-auto">Before you pay for any land in Nigeria, follow these steps. No exceptions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {dueDiligenceSteps.map((s, i) => (
              <div key={i} className="card p-5 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-obsidian-900 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-sm font-bold text-gold-400">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-medium text-obsidian-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-obsidian-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto mt-8 card p-5 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-900 text-sm mb-1">⚠️ Important Warning</div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Never pay for land based on verbal agreements, WhatsApp messages, or informal introductions alone. Always engage a qualified Nigerian property lawyer to verify title and prepare the contract. Naya verifies listings, but due diligence remains your responsibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div>
              <span className="section-number text-gold-500">Land Specialists</span>
              <h2 className="font-display text-4xl font-light text-white mb-4 leading-tight">
                Speak to Our<br /><span className="gold-text">Land Team</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-6">
                Our land specialists have deep knowledge of Port Harcourt's land registry, pricing, and off-market plots. Whether you are buying your first plot or assembling a development site, we can help.
              </p>
              <div className="space-y-2 mb-8">
                {[
                  'Title verification and Lands Registry searches',
                  'Off-market plot sourcing across PH and Rivers State',
                  'Surveyor and property lawyer referrals',
                  'Investment analysis — growth potential and rental yield',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="mailto:land@naya.ng" className="btn-primary btn-lg">
                  Email land@naya.ng <ArrowRight className="w-5 h-5" />
                </a>
                <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer"
                  className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '10+', label: 'Verified plots available' },
                { value: '+22%', label: 'Avg GRA land growth (2024–2026)' },
                { value: '100%', label: 'Listings with title verified' },
                { value: '28 days', label: 'Avg days to sell (PH premium land)' },
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
