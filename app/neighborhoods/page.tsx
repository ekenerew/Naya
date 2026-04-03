'use client'
export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin, Zap, Droplets, Shield, Search, Star,
  TrendingUp, Home, School, ShoppingBag, Building2,
  ChevronRight, Filter, ArrowUpRight, Wifi, AlertTriangle
} from 'lucide-react'
import NEIGHBOURHOODS, { ELECTRICITY_BAND_INFO, FLOOD_RISK_INFO } from '@/lib/neighbourhoods-data'

const fmt = (n: number) => n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n}`

function ScoreBar({ value, max = 10, color = 'bg-gold-500' }: { value: number; max?: number; color?: string }) {
  return (
    <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${(value/max)*100}%` }} />
    </div>
  )
}

function NeighbourhoodCard({ n }: { n: typeof NEIGHBOURHOODS[0] }) {
  const bandInfo  = ELECTRICITY_BAND_INFO[n.electricityBand]
  const floodInfo = FLOOD_RISK_INFO[n.floodRisk]

  return (
    <Link href={`/neighborhoods/${n.slug}`}
      className="card overflow-hidden hover:shadow-xl transition-all duration-300 group block">
      {/* Header */}
      <div className="bg-obsidian-900 p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-display text-xl font-medium text-white group-hover:text-gold-400 transition-colors">{n.name}</h3>
              <p className="text-white/40 text-xs">{n.lga} LGA</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-gold-500 flex items-center justify-center">
                <span className="font-display text-lg font-bold text-gold-400">{n.areaScore}</span>
              </div>
              <p className="text-white/30 text-[9px] mt-1">SCORE</p>
            </div>
          </div>

          {/* Key badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {/* Electricity band */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold ${bandInfo.bg} ${bandInfo.color}`}>
              <Zap className="w-3 h-3" />{bandInfo.label} · {n.electricityHoursPerDay}h/day
            </div>
            {/* Flood risk */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold ${floodInfo.bg} ${floodInfo.color}`}>
              <Droplets className="w-3 h-3" />Flood: {n.floodRisk}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs text-obsidian-500 line-clamp-2 mb-4">{n.description}</p>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-surface-subtle rounded-xl">
            <p className="text-[10px] text-obsidian-400 uppercase tracking-wider font-semibold mb-1">3-Bed Rent/yr</p>
            <p className="font-display text-base font-semibold text-obsidian-900">{fmt(n.avgRentPerYear.threeBed)}</p>
          </div>
          <div className="p-3 bg-surface-subtle rounded-xl">
            <p className="text-[10px] text-obsidian-400 uppercase tracking-wider font-semibold mb-1">3-Bed Sale</p>
            <p className="font-display text-base font-semibold text-obsidian-900">{fmt(n.avgSalePrice.threeBed)}</p>
          </div>
        </div>

        {/* Price trend */}
        <div className="flex items-center gap-1.5 mb-4">
          <TrendingUp className={`w-4 h-4 ${n.priceChange12m > 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
          <span className={`text-xs font-semibold ${n.priceChange12m > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {n.priceChange12m > 0 ? '+' : ''}{n.priceChange12m}% in 12 months
          </span>
        </div>

        {/* Infrastructure bars */}
        <div className="space-y-2.5 mb-4">
          {[
            { label:'Security',    value:n.security },
            { label:'Roads',       value:n.roadQuality },
            { label:'Schools',     value:n.schools },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] text-obsidian-500 mb-1">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value}/10</span>
              </div>
              <ScoreBar value={item.value} />
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {n.tags.slice(0,3).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 bg-obsidian-50 text-obsidian-600 text-[10px] font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* View link */}
        <div className="flex items-center gap-1 text-gold-600 text-xs font-semibold mt-4 group-hover:gap-2 transition-all">
          View full profile <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  )
}

export default function NeighbourhoodsPage() {
  const [search, setSearch] = useState('')
  const [bandFilter, setBandFilter] = useState('')
  const [floodFilter, setFloodFilter] = useState('')
  const [sortBy, setSortBy] = useState('score')

  const filtered = useMemo(() => {
    let list = [...NEIGHBOURHOODS]
    if (search) list = list.filter(n => n.name.toLowerCase().includes(search.toLowerCase()) || n.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    if (bandFilter) list = list.filter(n => n.electricityBand === bandFilter)
    if (floodFilter) list = list.filter(n => n.floodRisk === floodFilter)
    if (sortBy === 'score')      list.sort((a,b) => b.areaScore - a.areaScore)
    if (sortBy === 'price_asc')  list.sort((a,b) => a.avgRentPerYear.threeBed - b.avgRentPerYear.threeBed)
    if (sortBy === 'price_desc') list.sort((a,b) => b.avgRentPerYear.threeBed - a.avgRentPerYear.threeBed)
    if (sortBy === 'growth')     list.sort((a,b) => b.priceChange12m - a.priceChange12m)
    return list
  }, [search, bandFilter, floodFilter, sortBy])

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero */}
      <section className="relative bg-obsidian-900 overflow-hidden py-16">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-25" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/8 rounded-full blur-[120px]" />
        <div className="relative z-10 page-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-sm font-semibold mb-5">
              <MapPin className="w-4 h-4" />Port Harcourt Neighbourhood Intelligence
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-4 leading-tight">
              Find Your Perfect<br /><span className="gold-text">Neighbourhood</span>
            </h1>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Deep intelligence on every area — prices, electricity bands, flood risk, security, schools and infrastructure. Updated monthly.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-obsidian-300" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search GRA, Woji, Eleme..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-obsidian-900 text-sm outline-none shadow-xl placeholder:text-obsidian-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Electricity band explainer */}
      <section className="bg-white border-b border-surface-border py-5">
        <div className="page-container">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-gold-600" />
            <p className="text-sm font-bold text-obsidian-900">Nigeria DISCO Electricity Bands (PHED)</p>
            <span className="text-xs text-obsidian-400">— What your band means for daily life</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ELECTRICITY_BAND_INFO).map(([band, info]) => (
              <div key={band} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${info.bg} ${info.color}`}>
                <span className="font-black">{info.emoji} {info.label}</span>
                <span className="opacity-70 hidden md:inline">— {info.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="page-container py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select value={bandFilter} onChange={e => setBandFilter(e.target.value)}
            className="input-field text-sm py-2 w-auto">
            <option value="">All Electricity Bands</option>
            {['A','B','C','D','E'].map(b => <option key={b} value={b}>Band {b}</option>)}
          </select>
          <select value={floodFilter} onChange={e => setFloodFilter(e.target.value)}
            className="input-field text-sm py-2 w-auto">
            <option value="">All Flood Risks</option>
            {['Very Low','Low','Medium','High','Very High'].map(f => <option key={f} value={f}>{f} Risk</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="input-field text-sm py-2 w-auto">
            <option value="score">By Naya Score</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="growth">Fastest Growing</option>
          </select>
          <span className="text-sm text-obsidian-400 ml-auto">{filtered.length} areas</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(n => <NeighbourhoodCard key={n.slug} n={n} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-obsidian-400">No neighbourhoods match your search.</p>
            <button onClick={() => { setSearch(''); setBandFilter(''); setFloodFilter('') }}
              className="btn-secondary mt-4">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
