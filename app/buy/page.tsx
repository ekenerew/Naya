'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Maximize, TrendingUp, TrendingDown, Minus, ChevronDown, X, ArrowRight, CheckCircle2, BarChart3, Home, Building, TreePine, Layers } from 'lucide-react'
import { properties, neighborhoods } from '@/lib/data'
import PropertyCard from '@/components/property/PropertyCard'

// ── Market Data ────────────────────────────────────────────────────────────────
const marketIndicators = [
  { label: 'Avg. Sale Price (GRA)', value: '₦320M', change: '+8.2%', trend: 'up', sub: 'vs last quarter' },
  { label: 'Avg. Sale Price (Woji)', value: '₦185M', change: '+18.7%', trend: 'up', sub: 'highest growth' },
  { label: 'Avg. Sale Price (Rumuola)', value: '₦65M', change: '+15.3%', trend: 'up', sub: 'best value' },
  { label: 'Days on Market (Avg)', value: '34 days', change: '-12%', trend: 'up', sub: 'faster than 2025' },
]

const priceRanges = [
  { label: 'Under ₦50M', min: 0, max: 50000000 },
  { label: '₦50M – ₦100M', min: 50000000, max: 100000000 },
  { label: '₦100M – ₦200M', min: 100000000, max: 200000000 },
  { label: '₦200M – ₦500M', min: 200000000, max: 500000000 },
  { label: 'Above ₦500M', min: 500000000, max: Infinity },
]

const propertyTypes = [
  { value: 'all', label: 'All Types', icon: Home },
  { value: 'apartment', label: 'Apartment', icon: Building },
  { value: 'duplex', label: 'Duplex', icon: Layers },
  { value: 'mansion', label: 'Mansion', icon: Home },
  { value: 'terrace', label: 'Terrace', icon: Layers },
  { value: 'penthouse', label: 'Penthouse', icon: Building },
  { value: 'land', label: 'Land', icon: TreePine },
]

const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Viewed' },
]

const neighborhoodPrices = [
  { name: 'GRA Phase 2', avg: 280000000, min: 150000000, max: 850000000, trend: 'up', pct: 8.2, demand: 'Very High' },
  { name: 'Old GRA', avg: 190000000, min: 120000000, max: 600000000, trend: 'stable', pct: 2.1, demand: 'High' },
  { name: 'Woji', avg: 165000000, min: 65000000, max: 650000000, trend: 'up', pct: 18.7, demand: 'Very High' },
  { name: 'Trans Amadi', avg: 95000000, min: 45000000, max: 280000000, trend: 'up', pct: 12.5, demand: 'High' },
  { name: 'Rumuola', avg: 62000000, min: 30000000, max: 180000000, trend: 'up', pct: 15.3, demand: 'High' },
  { name: 'Eleme', avg: 58000000, min: 25000000, max: 150000000, trend: 'stable', pct: 3.4, demand: 'Moderate' },
]

function formatPrice(n: number) {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(1)}B`
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(0)}M`
  return `₦${n.toLocaleString()}`
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function BuyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState<typeof priceRanges[0] | null>(null)
  const [minBeds, setMinBeds] = useState(0)
  const [minBaths, setMinBaths] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [virtualTourOnly, setVirtualTourOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Sale properties only
  const saleProperties = properties.filter(p => p.listingType === 'sale')

  const filtered = useMemo(() => {
    let result = saleProperties.filter(p => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.address.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (selectedType !== 'all' && p.propertyType !== selectedType) return false
      if (selectedNeighborhood !== 'all' && p.neighborhood !== selectedNeighborhood) return false
      if (selectedPriceRange && (p.price < selectedPriceRange.min || p.price > selectedPriceRange.max)) return false
      if (minBeds > 0 && p.bedrooms < minBeds) return false
      if (minBaths > 0 && p.bathrooms < minBaths) return false
      if (verifiedOnly && !p.isVerified) return false
      if (virtualTourOnly && !p.virtualTour) return false
      return true
    })

    switch (sortBy) {
      case 'price_asc': result = [...result].sort((a, b) => a.price - b.price); break
      case 'price_desc': result = [...result].sort((a, b) => b.price - a.price); break
      case 'newest': result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'popular': result = [...result].sort((a, b) => b.views - a.views); break
      default: result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return result
  }, [searchQuery, selectedType, selectedNeighborhood, selectedPriceRange, minBeds, minBaths, sortBy, verifiedOnly, virtualTourOnly])

  const activeFiltersCount = [
    selectedType !== 'all', selectedNeighborhood !== 'all', selectedPriceRange !== null,
    minBeds > 0, minBaths > 0, verifiedOnly, virtualTourOnly
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedType('all'); setSelectedNeighborhood('all'); setSelectedPriceRange(null)
    setMinBeds(0); setMinBaths(0); setVerifiedOnly(false); setVirtualTourOnly(false); setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO SEARCH ──────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden py-14">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[120px]" />
        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">
                {saleProperties.length} Properties For Sale · Port Harcourt
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-light text-white leading-tight mb-4">
              Find Your Perfect<br />
              <span className="gold-text">Property to Buy</span>
            </h1>
            <p className="text-white/40 text-lg font-light mb-8">
              Every listing is verified. Every agent is RSSPC-certified. Every price is real.
            </p>
          </div>

          {/* Main Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="card p-2 flex gap-2 shadow-gold-lg">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0" />
                <input
                  className="flex-1 bg-transparent text-obsidian-900 placeholder-obsidian-300 outline-none text-sm"
                  placeholder="Search by neighbourhood, address, or property type..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-4 h-4 text-obsidian-300 hover:text-obsidian-600" />
                  </button>
                )}
              </div>
              <select
                className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none"
                value={selectedNeighborhood}
                onChange={e => setSelectedNeighborhood(e.target.value)}
              >
                <option value="all">All Areas</option>
                {neighborhoods.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
              </select>
              <select
                className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none"
                value={selectedPriceRange ? priceRanges.indexOf(selectedPriceRange) : ''}
                onChange={e => setSelectedPriceRange(e.target.value !== '' ? priceRanges[+e.target.value] : null)}
              >
                <option value="">Any Price</option>
                {priceRanges.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
              </select>
              <button className="btn-primary px-6 flex-shrink-0">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>

            {/* Quick Type Filters */}
            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              {propertyTypes.map(t => (
                <button key={t.value} onClick={() => setSelectedType(t.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedType === t.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/50 border-white/15 hover:bg-white/15'}`}>
                  <t.icon className="w-3 h-3" />{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARKET INDICATORS ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-surface-border">
        <div className="page-container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketIndicators.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.trend === 'up' ? 'bg-emerald-50' : 'bg-obsidian-50'}`}>
                  {m.trend === 'up' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <Minus className="w-5 h-5 text-obsidian-400" />}
                </div>
                <div>
                  <div className="font-mono text-xs text-obsidian-400 mb-0.5">{m.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-medium text-obsidian-900">{m.value}</span>
                    <span className={`text-xs font-mono font-bold ${m.trend === 'up' ? 'text-emerald-500' : 'text-obsidian-400'}`}>{m.change}</span>
                  </div>
                  <div className="text-xs text-obsidian-300">{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ── SIDEBAR ──────────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">

                {/* Filter Panel */}
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-medium text-obsidian-900 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-gold-500" /> Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <button onClick={clearFilters} className="text-xs text-gold-600 hover:text-gold-500 font-medium">
                        Clear all ({activeFiltersCount})
                      </button>
                    )}
                  </div>

                  <div className="space-y-5">
                    {/* Neighbourhood */}
                    <div>
                      <label className="input-label">Neighbourhood</label>
                      <select className="input-field text-sm" value={selectedNeighborhood} onChange={e => setSelectedNeighborhood(e.target.value)}>
                        <option value="all">All Neighbourhoods</option>
                        {neighborhoods.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="input-label">Price Range</label>
                      <div className="space-y-1.5">
                        {priceRanges.map((r, i) => (
                          <button key={i} onClick={() => setSelectedPriceRange(selectedPriceRange === r ? null : r)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-all ${selectedPriceRange === r ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            <span>{r.label}</span>
                            {selectedPriceRange === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className="input-label">Property Type</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {propertyTypes.map(t => (
                          <button key={t.value} onClick={() => setSelectedType(t.value)}
                            className={`px-2 py-2 rounded-xl text-xs font-medium border transition-all ${selectedType === t.value ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="input-label">Min. Bedrooms</label>
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setMinBeds(n)}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${minBeds === n ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-500 border-surface-border'}`}>
                            {n === 0 ? 'Any' : `${n}+`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <label className="input-label">Min. Bathrooms</label>
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3, 4].map(n => (
                          <button key={n} onClick={() => setMinBaths(n)}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${minBaths === n ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-500 border-surface-border'}`}>
                            {n === 0 ? 'Any' : `${n}+`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3 pt-2 border-t border-surface-border">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-obsidian-600">Verified Only</span>
                        <div onClick={() => setVerifiedOnly(!verifiedOnly)}
                          className={`w-10 h-6 rounded-full transition-colors relative ${verifiedOnly ? 'bg-gold-500' : 'bg-obsidian-200'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-1'}`} />
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-obsidian-600">Virtual Tour</span>
                        <div onClick={() => setVirtualTourOnly(!virtualTourOnly)}
                          className={`w-10 h-6 rounded-full transition-colors relative ${virtualTourOnly ? 'bg-gold-500' : 'bg-obsidian-200'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${virtualTourOnly ? 'translate-x-5' : 'translate-x-1'}`} />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Price Comparison Widget */}
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-gold-500" />
                    <h3 className="font-display text-base font-medium text-obsidian-900">Price by Area</h3>
                  </div>
                  <div className="space-y-3">
                    {neighborhoodPrices.map((n, i) => {
                      const maxAvg = Math.max(...neighborhoodPrices.map(x => x.avg))
                      const pct = (n.avg / maxAvg) * 100
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-obsidian-600 font-medium">{n.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs text-obsidian-900">{formatPrice(n.avg)}</span>
                              <span className={`text-xs font-mono font-bold ${n.trend === 'up' ? 'text-emerald-500' : 'text-obsidian-400'}`}>
                                {n.trend === 'up' ? '+' : ''}{n.pct}%
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }} />
                          </div>
                          <div className="text-xs text-obsidian-300 mt-0.5">{n.min === 0 ? '' : `${formatPrice(n.min)} – ${formatPrice(n.max)}`}</div>
                        </div>
                      )
                    })}
                  </div>
                  <Link href="/market-trends" className="flex items-center gap-1 text-xs text-gold-600 hover:text-gold-500 mt-4 font-medium">
                    Full Market Report <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Mortgage Calculator CTA */}
                <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10">
                    <div className="text-2xl mb-3">🏦</div>
                    <h3 className="font-display text-base font-medium text-white mb-2">Mortgage Calculator</h3>
                    <p className="text-white/40 text-xs leading-relaxed mb-4">Estimate your monthly payments based on NHF rates and local bank products.</p>
                    <Link href="/tools/mortgage-calculator" className="btn-primary btn-sm w-full justify-center">
                      Calculate Now
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* ── RESULTS ──────────────────────────────────────────────── */}
            <div className="lg:col-span-3">

              {/* Results Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-obsidian-900">
                    {filtered.length} {filtered.length === 1 ? 'Property' : 'Properties'} For Sale
                  </h2>
                  <p className="text-sm text-obsidian-400 mt-0.5">
                    {selectedNeighborhood !== 'all' ? selectedNeighborhood : 'All areas'} · Port Harcourt
                    {activeFiltersCount > 0 && ` · ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="input-field text-sm py-2 pr-8" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Active Filter Pills */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedType !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {selectedType} <button onClick={() => setSelectedType('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedNeighborhood !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {selectedNeighborhood} <button onClick={() => setSelectedNeighborhood('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedPriceRange && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {selectedPriceRange.label} <button onClick={() => setSelectedPriceRange(null)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {minBeds > 0 && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {minBeds}+ beds <button onClick={() => setMinBeds(0)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {verifiedOnly && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
                      Verified Only <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {virtualTourOnly && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-700">
                      Virtual Tour <button onClick={() => setVirtualTourOnly(false)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}

              {/* Property Grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map(p => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 card">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No properties found</h3>
                  <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">Try adjusting your filters or broadening your search area.</p>
                  <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEIGHBOURHOOD PRICE COMPARISON ────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Market Intelligence</span>
            <h2 className="section-title">Price Comparison by Neighbourhood</h2>
            <p className="section-desc mx-auto">Real pricing data from verified listings across Port Harcourt. Updated monthly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {neighborhoodPrices.map((n, i) => (
              <div key={i} className="card p-5 hover:border-gold-200 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-lg font-medium text-obsidian-900">{n.name}</h3>
                    <div className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${n.demand === 'Very High' ? 'text-rose-500' : n.demand === 'High' ? 'text-amber-500' : 'text-obsidian-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${n.demand === 'Very High' ? 'bg-rose-500' : n.demand === 'High' ? 'bg-amber-500' : 'bg-obsidian-300'}`} />
                      {n.demand} Demand
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-mono font-bold ${n.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-obsidian-50 text-obsidian-500'}`}>
                    {n.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {n.trend === 'up' ? '+' : ''}{n.pct}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-obsidian-400">Average Price</span>
                    <span className="font-display text-xl font-medium text-gold-600">{formatPrice(n.avg)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-surface-border">
                    <span className="text-xs text-obsidian-400">Min – Max</span>
                    <span className="font-mono text-xs text-obsidian-600">{formatPrice(n.min)} – {formatPrice(n.max)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNeighborhood(n.name)}
                  className="btn-secondary btn-sm w-full justify-center mt-3">
                  View Properties <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUYER GUIDE CTA ───────────────────────────────────────────── */}
      <section className="py-16 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { emoji: '🔍', title: 'Search Verified Listings', desc: 'Every property on Naya is reviewed before going live. No fake listings, no ghost agents.' },
              { emoji: '🤝', title: 'Connect with Certified Agents', desc: 'All agents are RSSPC-verified and background-checked. You deal only with professionals.' },
              { emoji: '📋', title: 'Get Legal Guidance', desc: 'We guide you on C of O verification, title checks, and safe payment structures.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-5">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-display text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/contact" className="btn-primary btn-lg">
              Speak to a Property Expert <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
