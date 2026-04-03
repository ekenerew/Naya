'use client'
export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, MapPin, ArrowRight, CheckCircle2, SlidersHorizontal,
  Building2, Home, Layers, TrendingUp, Shield, FileText, Users,
  Clock, Zap, ChevronDown, MessageCircle, Phone, Star, Calendar,
  BarChart3, Award, Hammer, Key
} from 'lucide-react'
import { newDevelopments } from '@/lib/data'
import type { Development } from '@/lib/data'

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(1)}B`
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(0)}M`
  return `₦${n.toLocaleString()}`
}

// ── Config ─────────────────────────────────────────────────────────────────────
const statusConfig = {
  off_plan:           { label: 'Off-Plan',            color: 'bg-purple-500', text: 'text-white',        dot: 'bg-purple-400' },
  under_construction: { label: 'Under Construction',  color: 'bg-amber-500',  text: 'text-obsidian-900', dot: 'bg-amber-400' },
  ready:              { label: 'Ready Now',            color: 'bg-emerald-500', text: 'text-white',       dot: 'bg-emerald-400' },
  sold_out:           { label: 'Sold Out',             color: 'bg-obsidian-400', text: 'text-white',      dot: 'bg-obsidian-300' },
}

const typeConfig = {
  residential: { label: 'Residential', icon: Home },
  mixed_use:   { label: 'Mixed-Use',   icon: Layers },
  commercial:  { label: 'Commercial',  icon: Building2 },
  estate:      { label: 'Gated Estate', icon: Home },
}

const filterStatuses = [
  { value: 'all', label: 'All Stages' },
  { value: 'off_plan', label: 'Off-Plan' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'ready', label: 'Ready Now' },
]

const filterTypes = [
  { value: 'all',         label: 'All Types' },
  { value: 'residential', label: 'Residential' },
  { value: 'estate',      label: 'Gated Estate' },
  { value: 'mixed_use',   label: 'Mixed-Use' },
  { value: 'commercial',  label: 'Commercial' },
]

const sortOptions = [
  { value: 'featured',   label: 'Featured First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'completion', label: 'Completing Soonest' },
  { value: 'popular',    label: 'Most Enquired' },
]

const investmentReasons = [
  { icon: TrendingUp, title: 'Capital Growth',       desc: 'PH off-plan prices have grown 18–24% between contract and completion over the past 3 years.', stat: '+21% avg', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: BarChart3,  title: 'Rental Yields',        desc: 'New builds in GRA and Woji consistently deliver 8–12% gross rental yields — above national average.', stat: '10% avg yield', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Award,      title: 'Developer Warranty',   desc: 'All listed developments come with structural warranties of 3–10 years and MEP system guarantees.', stat: 'Up to 10 years', color: 'text-gold-600', bg: 'bg-gold-50' },
  { icon: Shield,     title: 'Verified Developers',  desc: 'Every developer on Naya is CAC-registered, RCON-verified, and has a track record of completed projects.', stat: '100% verified', color: 'text-purple-500', bg: 'bg-purple-50' },
]

const marketInsights = [
  { label: 'Off-plan price premium at completion (GRA)',  value: '+24%',   sub: '3-yr avg 2022–2025' },
  { label: 'Active new developments in PH',                value: '23',     sub: 'Q1 2026' },
  { label: 'Avg. time from off-plan to completion',        value: '22 mo',  sub: 'PH residential' },
  { label: 'Corporate lease demand (new builds)',          value: '94%',    sub: 'occupancy within 6mo' },
]

// ── Construction Progress Bar ─────────────────────────────────────────────────
function ProgressBar({ pct, status }: { pct: number; status: string }) {
  const color = status === 'ready' ? 'bg-emerald-500' : status === 'under_construction' ? 'bg-amber-500' : 'bg-purple-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-obsidian-400">Construction Progress</span>
        <span className="font-mono text-xs font-bold text-obsidian-700">{pct}%</span>
      </div>
      <div className="h-2 bg-surface-subtle rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Development Card ──────────────────────────────────────────────────────────
function DevCard({ dev, onSelect }: { dev: Development; onSelect: (d: Development) => void }) {
  const status = statusConfig[dev.status]
  const TypeIcon = typeConfig[dev.type]?.icon || Building2
  const availPct = Math.round((dev.availableUnits / dev.totalUnits) * 100)

  const gradients: Record<string, string> = {
    residential: 'from-slate-900 via-slate-800 to-zinc-900',
    mixed_use:   'from-blue-950 via-indigo-900 to-violet-950',
    commercial:  'from-blue-950 via-blue-900 to-cyan-950',
    estate:      'from-emerald-950 via-emerald-900 to-teal-950',
  }
  const emoji: Record<string, string> = {
    residential: '🏢', mixed_use: '🏙', commercial: '🏭', estate: '🏘'
  }

  return (
    <div className="card overflow-hidden hover:border-gold-300 transition-all duration-300 group cursor-pointer"
      onClick={() => onSelect(dev)}>

      {/* Visual Header */}
      <div className={`relative h-52 bg-gradient-to-br ${gradients[dev.type]} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20 text-8xl">{emoji[dev.type]}</div>
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />

        {/* Progress overlay */}
        {dev.status === 'under_construction' && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
            <div className="h-full bg-amber-400 transition-all" style={{ width: `${dev.constructionPct}%` }} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {dev.isFeatured && <span className="badge-gold text-[10px]">⭐ Featured</span>}
          {dev.isNew && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-medium">New Launch</span>}
        </div>

        {/* Status */}
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${status.color} ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${dev.status !== 'sold_out' ? 'animate-pulse' : ''}`} />
            {status.label}
          </span>
        </div>

        {/* Developer name */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-obsidian-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
            <div className="text-[10px] text-white/40 mb-0.5 font-mono uppercase tracking-wider">Developer</div>
            <div className="text-white text-xs font-medium truncate">{dev.developer}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-xl font-medium text-obsidian-900 leading-tight group-hover:text-gold-600 transition-colors">
            {dev.name}
          </h3>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 bg-surface-subtle text-obsidian-600 border border-surface-border`}>
            <TypeIcon className="w-3 h-3" />{typeConfig[dev.type]?.label}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-obsidian-400 mb-4">
          <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0" />{dev.neighborhood}, Port Harcourt
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-surface-border text-center">
          <div>
            <div className="font-display text-lg font-medium text-gold-600">{fmt(dev.priceFrom)}</div>
            <div className="text-[10px] text-obsidian-400">Price from</div>
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-obsidian-900">{dev.availableUnits}</div>
            <div className="text-[10px] text-obsidian-400">units left</div>
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-obsidian-900">{dev.floors}</div>
            <div className="text-[10px] text-obsidian-400">floors</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-obsidian-500 leading-relaxed mb-4 line-clamp-2">{dev.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar pct={dev.constructionPct} status={dev.status} />
        </div>

        {/* Completion + Tags */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-obsidian-400">
            <Calendar className="w-3.5 h-3.5 text-gold-500" />
            {dev.completionDate}
          </div>
          <div className="flex gap-1">
            {dev.tags.slice(0, 2).map((t, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">{t}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onSelect(dev) }}
            className="flex-1 btn-primary btn-sm justify-center">
            View Development <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Development Modal ─────────────────────────────────────────────────────────
function DevModal({ dev, onClose }: { dev: Development; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'payment' | 'location'>('overview')
  const status = statusConfig[dev.status]

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm" />
      <div className="relative bg-surface-bg w-full md:max-w-4xl max-h-[95vh] md:max-h-[85vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl z-10"
        onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="relative bg-obsidian-900 px-6 pt-6 pb-4 flex-shrink-0">
          <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${status.color} ${status.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />{status.label}
                </span>
                <span className="text-xs text-white/30">{dev.developer}</span>
              </div>
              <h2 className="font-display text-3xl font-light text-white mb-1">{dev.name}</h2>
              <div className="flex items-center gap-1 text-white/40 text-sm">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />{dev.address}
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Key stats */}
          <div className="relative z-10 grid grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Price From', value: fmt(dev.priceFrom) },
              { label: 'Units Left', value: `${dev.availableUnits}/${dev.totalUnits}` },
              { label: 'Completion', value: dev.completionDate },
              { label: 'Floors', value: `${dev.floors} floors` },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white/5 rounded-xl p-2 border border-white/10">
                <div className="font-display text-base font-medium text-gold-400">{s.value}</div>
                <div className="text-[10px] text-white/30">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="relative z-10 flex gap-1 mt-4">
            {(['overview', 'units', 'payment', 'location'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all capitalize ${activeTab === tab ? 'bg-gold-500 text-obsidian-900' : 'text-white/40 hover:text-white/70'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-3">About this Development</h3>
                <p className="text-obsidian-500 text-sm leading-relaxed">{dev.longDescription}</p>
              </div>

              <div>
                <ProgressBar pct={dev.constructionPct} status={dev.status} />
              </div>

              <div>
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-3">Amenities & Facilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {dev.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-obsidian-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{a}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-3">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {dev.features.map((f, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-obsidian-900 text-white">{f}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="card p-4">
                  <div className="font-mono text-xs text-obsidian-400 uppercase tracking-wider mb-1">Warranty</div>
                  <div className="text-sm text-obsidian-700 font-medium">{dev.warranty}</div>
                </div>
                <div className="card p-4">
                  <div className="font-mono text-xs text-obsidian-400 uppercase tracking-wider mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {dev.tags.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 border border-gold-200">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* UNITS TAB */}
          {activeTab === 'units' && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-medium text-obsidian-900">Available Unit Types</h3>
              {dev.unitTypes.map((unit, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-display text-base font-medium text-obsidian-900">{unit.type}</h4>
                        {unit.available <= 3 && unit.available > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-medium">
                            Only {unit.available} left
                          </span>
                        )}
                        {unit.available === 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-obsidian-100 text-obsidian-500 border border-obsidian-200">Sold Out</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-obsidian-500">
                        {unit.beds > 0 && <span>{unit.beds} bedroom{unit.beds > 1 ? 's' : ''}</span>}
                        <span>{unit.sizeSqm} sqm</span>
                        <span className="text-emerald-600 font-medium">{unit.available} available</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl font-medium text-gold-600">{fmt(unit.priceFrom)}</div>
                      <div className="text-xs text-obsidian-400">from</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm flex-1 justify-center">
                      Express Interest
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAYMENT TAB */}
          {activeTab === 'payment' && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-medium text-obsidian-900">Payment Structure</h3>
              <div className="card p-5 bg-gold-50 border-gold-200">
                <div className="font-mono text-xs text-gold-600 uppercase tracking-wider mb-2">Payment Plan</div>
                <p className="text-obsidian-700 text-sm leading-relaxed font-medium">{dev.paymentPlan}</p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Shield, title: 'Escrow Protection', desc: 'All off-plan payments are held in an escrow account with a licensed Nigerian bank until the relevant construction milestone is reached.' },
                  { icon: FileText, title: 'Contract of Sale', desc: 'A formal Contract of Sale is signed at the point of deposit. Your rights as a buyer are fully protected under Nigerian property law.' },
                  { icon: Award, title: 'Developer Track Record', desc: 'We verify every developer\'s track record — completed projects, delivery timelines, and client references — before listing on Naya.' },
                  { icon: Key, title: 'Title on Completion', desc: 'Registered title (C-of-O or Deed of Assignment) is transferred to the buyer on final payment and handover.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 card p-4">
                    <div className="w-10 h-10 rounded-xl bg-obsidian-900 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-obsidian-900 text-sm mb-1">{item.title}</div>
                      <div className="text-xs text-obsidian-500 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOCATION TAB */}
          {activeTab === 'location' && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-medium text-obsidian-900">Location</h3>
              <div className="card p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-obsidian-900 text-sm">{dev.address}</div>
                  <div className="text-xs text-obsidian-400">{dev.neighborhood}, Port Harcourt, Rivers State</div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden h-52 bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-950 flex items-center justify-center relative">
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="text-center relative z-10">
                  <div className="text-4xl mb-2">📍</div>
                  <div className="text-white/60 text-sm">{dev.neighborhood}</div>
                  <div className="text-white/30 text-xs mt-1">Port Harcourt, Rivers State</div>
                  <a href={`https://maps.google.com?q=${encodeURIComponent(dev.address)}`} target="_blank" rel="noopener noreferrer"
                    className="btn-primary btn-sm mt-3 inline-flex">
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex-shrink-0 p-6 border-t border-surface-border bg-white flex gap-3">
          <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer" className="flex-1 btn-primary justify-center">
            <MessageCircle className="w-4 h-4" /> WhatsApp Agent
          </a>
          <a href="tel:+2348168117004" className="btn-secondary px-4">
            <Phone className="w-4 h-4" />
          </a>
          <a href="mailto:newdev@naya.ng" className="btn-secondary px-4 hidden sm:flex">
            <FileText className="w-4 h-4" /> Get Brochure
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function NewDevelopmentsPage() {
  const [searchQuery, setSearchQuery]   = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType]     = useState('all')
  const [selectedArea, setSelectedArea] = useState('all')
  const [sortBy, setSortBy]             = useState('featured')
  const [selectedDev, setSelectedDev]   = useState<Development | null>(null)

  const areas = [...new Set(newDevelopments.map(d => d.neighborhood))]

  const filtered = useMemo(() => {
    let r = newDevelopments.filter(d => {
      if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !d.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !d.developer.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (filterStatus !== 'all' && d.status !== filterStatus) return false
      if (filterType !== 'all' && d.type !== filterType) return false
      if (selectedArea !== 'all' && d.neighborhood !== selectedArea) return false
      return true
    })
    switch (sortBy) {
      case 'price_asc':  r = [...r].sort((a, b) => a.priceFrom - b.priceFrom); break
      case 'price_desc': r = [...r].sort((a, b) => b.priceFrom - a.priceFrom); break
      case 'popular':    r = [...r].sort((a, b) => b.enquiries - a.enquiries); break
      default:           r = [...r].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return r
  }, [searchQuery, filterStatus, filterType, selectedArea, sortBy])

  const activeFilters = [filterStatus !== 'all', filterType !== 'all', selectedArea !== 'all'].filter(Boolean).length

  const clearAll = () => {
    setFilterStatus('all'); setFilterType('all'); setSelectedArea('all'); setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* Modal */}
      {selectedDev && <DevModal dev={selectedDev} onClose={() => setSelectedDev(null)} />}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />

        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <Hammer className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">
                {newDevelopments.length} Active Developments · Port Harcourt
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.92] tracking-tight mb-6">
              New<br />
              <span className="gold-text">Developments</span><br />
              <span className="text-white/40">in Port Harcourt</span>
            </h1>
            <p className="text-white/40 text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Off-plan, under construction, and ready-now developments from verified Nigerian developers. Buy direct. Get the best price.
            </p>

            {/* Search */}
            <div className="card p-2 flex gap-2 max-w-3xl mx-auto shadow-gold-lg">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0" />
                <input className="flex-1 bg-transparent text-obsidian-900 placeholder-obsidian-300 outline-none text-sm"
                  placeholder="Search development name, developer, or area..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-obsidian-300" /></button>}
              </div>
              <select className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none"
                value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                <option value="all">All Areas</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <button className="btn-primary px-6 flex-shrink-0">
                <Search className="w-4 h-4" />Search
              </button>
            </div>

            {/* Status quick filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {filterStatuses.map(s => (
                <button key={s.value} onClick={() => setFilterStatus(s.value)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${filterStatus === s.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/50 border-white/15 hover:bg-white/15'}`}>
                  {s.value !== 'all' && (
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig[s.value as keyof typeof statusConfig]?.dot || 'bg-white'}`} />
                  )}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Market Insight Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {marketInsights.map((m, i) => (
              <div key={i} className="text-center bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="font-display text-3xl font-light text-gold-400 mb-1">{m.value}</div>
                <div className="text-xs text-white/40 leading-relaxed">{m.label}</div>
                <div className="text-[10px] text-white/20 mt-1">{m.sub}</div>
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

                    {/* Status */}
                    <div>
                      <label className="input-label">Construction Stage</label>
                      <div className="space-y-1.5">
                        {filterStatuses.map(s => (
                          <button key={s.value} onClick={() => setFilterStatus(s.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${filterStatus === s.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {s.value !== 'all' && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusConfig[s.value as keyof typeof statusConfig]?.dot}`} />}
                            {s.label}
                            {filterStatus === s.value && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <label className="input-label">Development Type</label>
                      <div className="space-y-1.5">
                        {filterTypes.map(t => (
                          <button key={t.value} onClick={() => setFilterType(t.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${filterType === t.value ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {t.label}
                            {filterType === t.value && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Area */}
                    <div>
                      <label className="input-label">Neighbourhood</label>
                      <select className="input-field text-sm" value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                        <option value="all">All Areas</option>
                        {areas.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Investment Calculator CTA */}
                <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10">
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="font-display text-base font-medium text-white mb-2">Off-Plan ROI Calculator</h3>
                    <p className="text-white/40 text-xs leading-relaxed mb-4">Estimate your return on investment and projected rental yield.</p>
                    <Link href="/tools/valuation" className="btn-primary btn-sm w-full justify-center">Calculate ROI</Link>
                  </div>
                </div>

                {/* Developer CTA */}
                <div className="card p-5">
                  <h3 className="font-display text-base font-medium text-obsidian-900 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gold-500" />Are You a Developer?
                  </h3>
                  <p className="text-xs text-obsidian-400 leading-relaxed mb-4">List your development on Naya and reach thousands of qualified buyers and investors.</p>
                  <a href="mailto:developers@naya.ng" className="btn-secondary btn-sm w-full justify-center">List Your Development</a>
                </div>
              </div>
            </div>

            {/* ── RESULTS ────────────────────────────────────────────────── */}
            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-obsidian-900">
                    {filtered.length} Development{filtered.length !== 1 ? 's' : ''}
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

              {/* Active Filters */}
              {activeFilters > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {filterStatus !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {filterStatuses.find(s => s.value === filterStatus)?.label}
                      <button onClick={() => setFilterStatus('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {filterType !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {filterTypes.find(t => t.value === filterType)?.label}
                      <button onClick={() => setFilterType('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedArea !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      <MapPin className="w-3 h-3" />{selectedArea}
                      <button onClick={() => setSelectedArea('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map(d => <DevCard key={d.id} dev={d} onSelect={setSelectedDev} />)}
                </div>
              ) : (
                <div className="text-center py-20 card">
                  <div className="text-5xl mb-4">🏗</div>
                  <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No developments found</h3>
                  <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">Try adjusting your filters or contact us for off-market opportunities.</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={clearAll} className="btn-primary">Clear Filters</button>
                    <a href="mailto:newdev@naya.ng" className="btn-secondary">Contact Team</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY INVEST OFF-PLAN ──────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Investment Intelligence</span>
            <h2 className="section-title">Why Buy Off-Plan in Port Harcourt</h2>
            <p className="section-desc mx-auto">Data-backed reasons why Nigeria's most informed investors are buying new developments in PH right now.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {investmentReasons.map((r, i) => (
              <div key={i} className="card p-6">
                <div className={`w-12 h-12 rounded-2xl ${r.bg} flex items-center justify-center mb-4`}>
                  <r.icon className={`w-6 h-6 ${r.color}`} />
                </div>
                <div className={`font-display text-2xl font-medium ${r.color} mb-2`}>{r.stat}</div>
                <h3 className="font-display text-base font-medium text-obsidian-900 mb-2">{r.title}</h3>
                <p className="text-xs text-obsidian-400 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUYER PROTECTION ─────────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg adire-bg">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="section-number">Buyer Protection</span>
              <h2 className="section-title">The Naya New Development Standard</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Shield, title: 'Developer Due Diligence', desc: 'Every developer is vetted — CAC registration, RCON membership, and a minimum of one completed project before listing on Naya.' },
                { icon: FileText, title: 'Title Verification', desc: 'We verify the development land title (C-of-O or Governor\'s Consent) before any listing goes live. No title, no listing.' },
                { icon: Award, title: 'Construction Monitoring', desc: 'Our team makes site visits quarterly and updates construction progress percentages so buyers always know the true status.' },
                { icon: Key, title: 'Escrow Guidance', desc: 'We strongly recommend — and can facilitate — escrow arrangements that protect your deposit until construction milestones are met.' },
                { icon: Users, title: 'Buyer Community', desc: 'Connect with other buyers in the same development through Naya\'s private buyer groups. Share updates and hold developers accountable.' },
                { icon: Clock, title: 'Completion Alerts', desc: 'Registered buyers receive automatic updates when construction milestones are reached, and alerts if completion dates shift.' },
              ].map((item, i) => (
                <div key={i} className="card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-obsidian-900 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-obsidian-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-obsidian-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-5 leading-tight">
            Register Your Interest<br />
            <span className="gold-text">Before Units Sell Out</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
            Be the first to know about new launches, price movements, and exclusive pre-launch allocations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:newdev@naya.ng" className="btn-primary btn-lg">
              Register Interest <ArrowRight className="w-5 h-5" />
            </a>
            <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer"
              className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">
              <MessageCircle className="w-5 h-5" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
