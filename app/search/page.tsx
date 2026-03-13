'use client'
import { useState, useMemo } from 'react'
import { SlidersHorizontal, Map, Grid3X3, List, ChevronDown, X, Search, MapPin } from 'lucide-react'
import PropertyCard from '@/components/property/PropertyCard'
import { properties } from '@/lib/data'
import { Property } from '@/lib/types'
import clsx from 'clsx'

const listingTypes = ['All', 'Sale', 'Rent', 'Shortlet', 'Commercial']
const propertyTypes = ['Apartment', 'Duplex', 'Terrace', 'Bungalow', 'Mansion', 'Penthouse', 'Land', 'Commercial']
const neighborhoods = ['GRA Phase 2', 'Old GRA', 'Trans Amadi', 'Rumuola', 'Woji', 'Eleme']
const bedroomOpts = ['Any', '1', '2', '3', '4', '5+']

type ViewMode = 'grid' | 'list' | 'map'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [listingType, setListingType] = useState('All')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [bedrooms, setBedrooms] = useState('Any')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [virtualTourOnly, setVirtualTourOnly] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('Relevant')

  const filtered = useMemo(() => {
    let res = [...properties]
    if (query) res = res.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.neighborhood.toLowerCase().includes(query.toLowerCase()))
    if (listingType !== 'All') {
      const typeMap: Record<string, string> = { Sale: 'sale', Rent: 'rent', Shortlet: 'shortlet', Commercial: 'lease' }
      res = res.filter(p => p.listingType === typeMap[listingType])
    }
    if (selectedNeighborhood !== 'All') res = res.filter(p => p.neighborhood === selectedNeighborhood)
    if (selectedType !== 'All') res = res.filter(p => p.propertyType === selectedType.toLowerCase())
    if (bedrooms !== 'Any') res = res.filter(p => bedrooms === '5+' ? p.bedrooms >= 5 : p.bedrooms === parseInt(bedrooms))
    if (verifiedOnly) res = res.filter(p => p.isVerified)
    if (virtualTourOnly) res = res.filter(p => p.virtualTour)
    if (priceMin) res = res.filter(p => p.price >= parseInt(priceMin))
    if (priceMax) res = res.filter(p => p.price <= parseInt(priceMax))
    if (sortBy === 'Price (Low)') res.sort((a,b) => a.price - b.price)
    if (sortBy === 'Price (High)') res.sort((a,b) => b.price - a.price)
    if (sortBy === 'Newest') res.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (sortBy === 'Most Viewed') res.sort((a,b) => b.views - a.views)
    return res
  }, [query, listingType, selectedNeighborhood, selectedType, bedrooms, verifiedOnly, virtualTourOnly, priceMin, priceMax, sortBy])

  const activeFilters = [
    listingType !== 'All' && listingType,
    selectedNeighborhood !== 'All' && selectedNeighborhood,
    selectedType !== 'All' && selectedType,
    bedrooms !== 'Any' && `${bedrooms} Beds`,
    verifiedOnly && 'Verified',
    virtualTourOnly && '360° Tour',
  ].filter(Boolean) as string[]

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Search Header */}
      <div className="bg-obsidian-900 border-b border-white/8 sticky top-16 md:top-[68px] z-50">
        <div className="page-container py-3">
          {/* Search bar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 flex items-center gap-3 bg-white/8 border border-white/12 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search neighbourhoods, addresses, property types…"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none" />
              {query && <button onClick={() => setQuery('')}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={clsx('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all', showFilters ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'text-white/60 border-white/15 hover:text-white hover:border-white/30')}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFilters.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-obsidian-900 text-gold-400 text-xs">{activeFilters.length}</span>}
            </button>
          </div>

          {/* Listing type tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {listingTypes.map(t => (
              <button key={t} onClick={() => setListingType(t)}
                className={clsx('flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all', listingType===t ? 'bg-gold-500 text-obsidian-900' : 'text-white/50 hover:text-white bg-white/5')}>
                {t}
              </button>
            ))}
            <div className="ml-auto flex-shrink-0 flex items-center gap-2">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-white/8 border border-white/12 text-white/60 text-xs rounded-lg px-3 py-1.5 outline-none hover:text-white cursor-pointer">
                {['Relevant', 'Newest', 'Price (Low)', 'Price (High)', 'Most Viewed'].map(s => <option key={s} value={s} className="bg-obsidian-900">{s}</option>)}
              </select>
              <div className="flex items-center gap-1">
                {([['grid', Grid3X3], ['list', List], ['map', Map]] as [ViewMode, React.ElementType][]).map(([mode, Icon]) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={clsx('p-1.5 rounded-lg transition-all', viewMode===mode ? 'bg-gold-500/20 text-gold-400' : 'text-white/30 hover:text-white')}>
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-white/8 bg-obsidian-900">
            <div className="page-container py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Neighborhood</div>
                  <select value={selectedNeighborhood} onChange={e => setSelectedNeighborhood(e.target.value)}
                    className="w-full bg-white/8 border border-white/12 text-white/70 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
                    <option className="bg-obsidian-900" value="All">All Areas</option>
                    {neighborhoods.map(n => <option key={n} className="bg-obsidian-900" value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Property Type</div>
                  <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                    className="w-full bg-white/8 border border-white/12 text-white/70 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
                    <option className="bg-obsidian-900" value="All">Any Type</option>
                    {propertyTypes.map(t => <option key={t} className="bg-obsidian-900" value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Bedrooms</div>
                  <div className="flex gap-1">
                    {bedroomOpts.map(b => (
                      <button key={b} onClick={() => setBedrooms(b)}
                        className={clsx('flex-1 py-2 rounded-lg text-xs font-mono transition-all', bedrooms===b ? 'bg-gold-500 text-obsidian-900' : 'bg-white/8 text-white/50 hover:text-white')}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Min Price (₦)</div>
                  <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="0"
                    className="w-full bg-white/8 border border-white/12 text-white/70 text-xs rounded-lg px-3 py-2 outline-none placeholder:text-white/20" />
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Max Price (₦)</div>
                  <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Any"
                    className="w-full bg-white/8 border border-white/12 text-white/70 text-xs rounded-lg px-3 py-2 outline-none placeholder:text-white/20" />
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => setVerifiedOnly(!verifiedOnly)}
                      className={clsx('w-8 h-4 rounded-full transition-all relative', verifiedOnly ? 'bg-gold-500' : 'bg-white/20')}>
                      <div className={clsx('absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all', verifiedOnly ? 'left-4.5' : 'left-0.5')} />
                    </div>
                    <span className="text-xs text-white/50">Verified only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => setVirtualTourOnly(!virtualTourOnly)}
                      className={clsx('w-8 h-4 rounded-full transition-all relative', virtualTourOnly ? 'bg-gold-500' : 'bg-white/20')}>
                      <div className={clsx('absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all', virtualTourOnly ? 'left-4.5' : 'left-0.5')} />
                    </div>
                    <span className="text-xs text-white/50">360° Tour</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="bg-white border-b border-surface-border py-2">
          <div className="page-container flex items-center gap-2 flex-wrap">
            <span className="text-xs text-obsidian-400 font-mono">Active:</span>
            {activeFilters.map(f => (
              <span key={f} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-200 text-xs font-medium">
                {f}
              </span>
            ))}
            <button onClick={() => { setListingType('All'); setSelectedNeighborhood('All'); setSelectedType('All'); setBedrooms('Any'); setVerifiedOnly(false); setVirtualTourOnly(false); setPriceMin(''); setPriceMax('') }}
              className="text-xs text-obsidian-400 hover:text-obsidian-700 underline ml-2">Clear all</button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="page-container py-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-obsidian-500">
            <span className="font-semibold text-obsidian-800">{filtered.length}</span> properties found
            {selectedNeighborhood !== 'All' && <span> in <span className="text-gold-600">{selectedNeighborhood}</span></span>}
          </p>
        </div>

        {viewMode === 'map' ? (
          <MapView properties={filtered} />
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {filtered.length === 0 ? <EmptyState /> : filtered.map(p => <PropertyListRow key={p.id} property={p} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.length === 0 ? <EmptyState /> : filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>

      {/* Save Search CTA */}
      <div className="sticky bottom-0 bg-obsidian-900/95 backdrop-blur-md border-t border-white/8 py-3 z-40">
        <div className="page-container flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-medium text-sm">🔔 Save this search</p>
            <p className="text-white/40 text-xs">Get alerts for new properties matching these filters</p>
          </div>
          <button className="btn-primary btn-sm flex-shrink-0">Enable Alerts</button>
        </div>
      </div>
    </div>
  )
}

function MapView({ properties }: { properties: Property[] }) {
  return (
    <div className="relative h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 border border-surface-border">
      {/* Fake map grid */}
      <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺</div>
          <p className="text-white/60 text-sm font-body">Interactive map requires Mapbox API key</p>
          <p className="text-white/30 text-xs mt-1">Configure NEXT_PUBLIC_MAPBOX_TOKEN in .env.local</p>
        </div>
      </div>
      {/* Simulated property pins */}
      {properties.slice(0, 8).map((p, i) => (
        <div key={p.id} className="absolute" style={{ top: `${20 + (i * 8) % 60}%`, left: `${15 + (i * 11) % 70}%` }}>
          <div className="relative">
            <div className="bg-gold-500 text-obsidian-900 font-mono font-bold text-xs px-2.5 py-1 rounded-full shadow-gold whitespace-nowrap">
              {p.price >= 1000000 ? `₦${(p.price/1000000).toFixed(1)}M` : `₦${(p.price/1000).toFixed(0)}K`}
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0" style={{borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #C8A84B'}} />
          </div>
        </div>
      ))}
    </div>
  )
}

function PropertyListRow({ property }: { property: Property }) {
  const { getPropertyGradient, getPriceLabel, propertyTypeEmojis } = require('@/lib/data')
  const gradient = getPropertyGradient(property.propertyType)
  const emoji = propertyTypeEmojis[property.propertyType] || '🏠'
  return (
    <a href={`/properties/${property.slug}`} className="flex gap-4 bg-white border border-surface-border rounded-2xl overflow-hidden hover:border-gold-200 hover:shadow-lg-soft transition-all duration-300 group">
      <div className={`w-32 md:w-48 flex-shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-4xl opacity-30">{emoji}</span>
      </div>
      <div className="flex-1 py-4 pr-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg font-medium text-obsidian-900 group-hover:text-gold-700 transition-colors line-clamp-1">{property.title}</h3>
          <span className="font-mono font-semibold text-gold-600 text-sm whitespace-nowrap">{getPriceLabel(property)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-obsidian-400 mb-3">
          <MapPin className="w-3 h-3 text-gold-500" />{property.neighborhood}, {property.lga}
        </div>
        <p className="text-xs text-obsidian-400 line-clamp-2 mb-3">{property.description}</p>
        <div className="flex items-center gap-3 text-xs text-obsidian-500">
          {property.bedrooms > 0 && <span>🛏 {property.bedrooms} Beds</span>}
          {property.bathrooms > 0 && <span>🚿 {property.bathrooms} Bath</span>}
          <span>📐 {property.sizeSqm} m²</span>
          {property.virtualTour && <span className="text-gold-500">360° Tour</span>}
          {property.isVerified && <span className="text-emerald-600">✓ Verified</span>}
        </div>
      </div>
    </a>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full text-center py-20">
      <div className="text-6xl mb-4">🏚</div>
      <h3 className="font-display text-2xl font-medium text-obsidian-700 mb-2">No properties found</h3>
      <p className="text-obsidian-400 text-sm">Try adjusting your filters or searching a different area</p>
    </div>
  )
}
