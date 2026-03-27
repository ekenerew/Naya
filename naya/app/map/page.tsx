'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, X, SlidersHorizontal, Home, MapPin,
  ChevronRight, Star, Loader2, List, Map as MapIcon,
  Heart, Eye, Building2, Globe
} from 'lucide-react'

type Listing = {
  id: string; title: string; price: number; pricePeriod: string
  bedrooms: number; bathrooms: number; neighborhood: string
  address: string; listingType: string; propertyType: string
  images: Array<{ url: string }>; isFeatured: boolean
  agent?: { badge: string; rsspcStatus: string }
  lat?: number; lng?: number
}

const fmt = (n: number) => n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n.toLocaleString()}`

const PH_CENTRE = { lat: 4.8156, lng: 7.0498 }

// Approximate coords for PH neighbourhoods
const AREA_COORDS: Record<string, {lat:number;lng:number}> = {
  'GRA Phase 2':     { lat: 4.8234, lng: 7.0312 },
  'Old GRA':         { lat: 4.8189, lng: 7.0198 },
  'GRA Phase 1':     { lat: 4.8201, lng: 7.0267 },
  'Woji':            { lat: 4.8456, lng: 7.0678 },
  'Trans Amadi':     { lat: 4.8312, lng: 7.0534 },
  'Rumuola':         { lat: 4.8089, lng: 7.0423 },
  'Eleme':           { lat: 4.8567, lng: 7.1234 },
  'D-Line':          { lat: 4.8023, lng: 7.0312 },
  'Diobu':           { lat: 4.7934, lng: 7.0167 },
  'Rumuokoro':       { lat: 4.8623, lng: 7.0534 },
  'Choba':           { lat: 4.8934, lng: 7.0123 },
  'Stadium Road':    { lat: 4.8123, lng: 7.0389 },
  'Peter Odili Road':{ lat: 4.8345, lng: 7.0456 },
  'Bonny Island':    { lat: 4.4423, lng: 7.1534 },
}

declare global { interface Window { google: any; __mapPageCb: () => void } }

export default function MapSearchPage() {
  const mapRef    = useRef<HTMLDivElement>(null)
  const mapInst   = useRef<any>(null)
  const markers   = useRef<any[]>([])
  const infoWin   = useRef<any>(null)

  const [mapLoaded, setMapLoaded]     = useState(false)
  const [listings, setListings]       = useState<Listing[]>([])
  const [filtered, setFiltered]       = useState<Listing[]>([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState<Listing | null>(null)
  const [view, setView]               = useState<'map'|'split'>('split')
  const [query, setQuery]             = useState('')
  const [typeFilter, setTypeFilter]   = useState('')
  const [bedsFilter, setBedsFilter]   = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Load Maps
  useEffect(() => {
    if ((window as any).google?.maps) { setMapLoaded(true); return }
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!key) return
    window.__mapPageCb = () => setMapLoaded(true)
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=__mapPageCb`
    s.async = true; s.defer = true
    document.head.appendChild(s)
  }, [])

  // Fetch listings
  useEffect(() => {
    fetch('/api/listings?limit=50&sort=featured')
      .then(r => r.json())
      .then(d => {
        const items = (d.data?.listings || []).map((l: any) => ({
          ...l,
          price: Number(l.price),
          ...(AREA_COORDS[l.neighborhood] || PH_CENTRE),
          lat: (AREA_COORDS[l.neighborhood]?.lat || PH_CENTRE.lat) + (Math.random()-0.5)*0.008,
          lng: (AREA_COORDS[l.neighborhood]?.lng || PH_CENTRE.lng) + (Math.random()-0.5)*0.008,
        }))
        setListings(items)
        setFiltered(items)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Filter
  useEffect(() => {
    let f = listings
    if (query)      f = f.filter(l => l.title.toLowerCase().includes(query.toLowerCase()) || l.neighborhood.toLowerCase().includes(query.toLowerCase()))
    if (typeFilter) f = f.filter(l => l.listingType === typeFilter)
    if (bedsFilter) f = f.filter(l => l.bedrooms >= bedsFilter)
    setFiltered(f)
  }, [query, typeFilter, bedsFilter, listings])

  // Init map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    const google = (window as any).google
    const map = new google.maps.Map(mapRef.current, {
      center:    PH_CENTRE,
      zoom:      13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        { featureType:'poi', elementType:'labels', stylers:[{ visibility:'off' }] },
        { featureType:'transit', stylers:[{ visibility:'simplified' }] },
      ],
    })
    mapInst.current = map
    infoWin.current = new google.maps.InfoWindow()
  }, [mapLoaded])

  // Place markers
  useEffect(() => {
    if (!mapLoaded || !mapInst.current) return
    const google = (window as any).google

    // Clear old markers
    markers.current.forEach(m => m.setMap(null))
    markers.current = []

    filtered.forEach(l => {
      const isSelected = selected?.id === l.id
      const marker = new google.maps.Marker({
        position:  { lat: l.lat!, lng: l.lng! },
        map:        mapInst.current,
        title:      l.title,
        zIndex:     isSelected ? 999 : l.isFeatured ? 100 : 1,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="32" viewBox="0 0 72 32">
              <rect x="0" y="0" width="72" height="28" rx="14" fill="${isSelected ? '#0A0A0B' : l.isFeatured ? '#C8A84B' : '#1A1A1A'}" />
              <text x="36" y="19" text-anchor="middle" font-family="Outfit,sans-serif" font-size="12" font-weight="700" fill="${isSelected || !l.isFeatured ? '#FFFFFF' : '#0A0A0B'}">${fmt(l.price)}</text>
              <polygon points="32,28 36,34 40,28" fill="${isSelected ? '#0A0A0B' : l.isFeatured ? '#C8A84B' : '#1A1A1A'}"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(72, 34),
          anchor:     new google.maps.Point(36, 34),
        }
      })

      marker.addListener('click', () => {
        setSelected(l)
        infoWin.current?.close()
        infoWin.current = new google.maps.InfoWindow({
          content: `
            <div style="font-family:Outfit,sans-serif;max-width:220px;padding:4px">
              ${l.images?.[0]?.url ? `<img src="${l.images[0].url}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px" />` : ''}
              <p style="font-weight:700;font-size:13px;color:#0A0A0B;margin:0 0 3px;line-height:1.3">${l.title}</p>
              <p style="font-size:11px;color:#6B6B6B;margin:0 0 5px">📍 ${l.neighborhood}</p>
              <p style="font-size:15px;font-weight:700;color:#C8A84B;margin:0 0 8px">${fmt(l.price)}</p>
              <a href="/properties/${l.id}" style="display:block;text-align:center;padding:6px;background:#0A0A0B;color:#fff;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none">View Property →</a>
            </div>
          `
        })
        infoWin.current.open(mapInst.current, marker)
      })

      markers.current.push(marker)
    })
  }, [mapLoaded, filtered, selected])

  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* ── Top bar ─────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-surface-border z-20">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="font-display text-xl font-light text-obsidian-900 hidden md:block">NAYA</Link>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search neighbourhood, property type..."
              className="w-full pl-9 pr-4 py-2.5 bg-surface-subtle border border-surface-border rounded-xl text-sm text-obsidian-900 outline-none focus:border-gold-400 placeholder:text-obsidian-300" />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-400"><X className="w-4 h-4" /></button>}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="py-2 pl-3 pr-8 bg-surface-subtle border border-surface-border rounded-xl text-sm text-obsidian-700 outline-none hidden md:block">
              <option value="">All Types</option>
              <option value="RENT">Rent</option>
              <option value="SALE">Buy</option>
              <option value="SHORTLET">Shortlet</option>
            </select>
            <select value={bedsFilter} onChange={e => setBedsFilter(Number(e.target.value))}
              className="py-2 pl-3 pr-8 bg-surface-subtle border border-surface-border rounded-xl text-sm text-obsidian-700 outline-none hidden md:block">
              <option value={0}>Any beds</option>
              <option value={1}>1+ beds</option>
              <option value={2}>2+ beds</option>
              <option value={3}>3+ beds</option>
              <option value={4}>4+ beds</option>
            </select>

            {/* View toggle */}
            <div className="flex items-center border border-surface-border rounded-xl overflow-hidden">
              <button onClick={() => setView('split')} className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all ${view==='split'?'bg-obsidian-900 text-white':'text-obsidian-500 hover:bg-surface-subtle'}`}>
                <List className="w-3.5 h-3.5" /><span className="hidden md:inline">Split</span>
              </button>
              <button onClick={() => setView('map')} className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all ${view==='map'?'bg-obsidian-900 text-white':'text-obsidian-500 hover:bg-surface-subtle'}`}>
                <MapIcon className="w-3.5 h-3.5" /><span className="hidden md:inline">Map</span>
              </button>
            </div>
          </div>

          {/* Count */}
          <div className="text-sm text-obsidian-500 whitespace-nowrap hidden lg:block">
            {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Listings panel */}
        {view === 'split' && (
          <div className="w-full md:w-96 flex-shrink-0 overflow-y-auto border-r border-surface-border bg-white">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Home className="w-12 h-12 text-obsidian-200 mx-auto mb-3" />
                <p className="text-obsidian-500 text-sm">No listings match your search</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {filtered.map(l => (
                  <button key={l.id} onClick={() => {
                    setSelected(l)
                    // Pan map to listing
                    if (mapInst.current && l.lat && l.lng) {
                      mapInst.current.panTo({ lat: l.lat, lng: l.lng })
                      mapInst.current.setZoom(16)
                    }
                  }}
                    className={`w-full flex gap-3 p-4 text-left hover:bg-surface-subtle transition-colors ${selected?.id === l.id ? 'bg-gold-50 border-l-4 border-gold-500' : ''}`}>
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-subtle">
                      {l.images?.[0]?.url
                        ? <img src={l.images[0].url} alt={l.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Home className="w-6 h-6 text-obsidian-200" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <p className="font-semibold text-obsidian-900 text-sm leading-tight line-clamp-2">{l.title}</p>
                        {l.isFeatured && <span className="px-1.5 py-0.5 bg-gold-500 text-obsidian-900 text-[9px] font-bold rounded flex-shrink-0">★</span>}
                      </div>
                      <p className="text-xs text-obsidian-400 flex items-center gap-1 mb-1.5">
                        <MapPin className="w-3 h-3" />{l.neighborhood}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-display text-base font-semibold text-obsidian-900">
                          {fmt(l.price)}<span className="text-obsidian-400 text-xs font-normal">{l.pricePeriod==='YEARLY'?'/yr':l.pricePeriod==='MONTHLY'?'/mo':''}</span>
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-obsidian-400">
                          {l.bedrooms > 0 && <span>{l.bedrooms}bd</span>}
                          {l.bathrooms > 0 && <span>{l.bathrooms}ba</span>}
                        </div>
                      </div>
                      {l.agent?.rsspcStatus === 'VERIFIED' && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center"><span style={{fontSize:7,color:'#fff',fontWeight:900}}>✓</span></div>
                          <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          {!mapKey ? (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-subtle">
              <div className="text-center max-w-sm p-8">
                <Globe className="w-16 h-16 text-obsidian-200 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-2">Map view coming soon</h3>
                <p className="text-obsidian-500 text-sm mb-4">Add NEXT_PUBLIC_GOOGLE_MAPS_KEY to enable the interactive property map.</p>
                <Link href="/search" className="btn-primary gap-2 inline-flex"><List className="w-4 h-4" />Browse Listings</Link>
              </div>
            </div>
          ) : (
            <>
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-subtle z-10">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-gold-500 mx-auto mb-3" />
                    <p className="text-obsidian-500 text-sm">Loading Port Harcourt map...</p>
                  </div>
                </div>
              )}
              <div ref={mapRef} className="w-full h-full" />

              {/* Legend */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="bg-white rounded-xl shadow-lg p-3">
                  <p className="text-[10px] font-bold text-obsidian-500 uppercase tracking-wider mb-2">Legend</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 rounded bg-gold-500" />
                      <span className="text-xs text-obsidian-600">Featured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 rounded bg-obsidian-900" />
                      <span className="text-xs text-obsidian-600">Standard</span>
                    </div>
                  </div>
                </div>

                {/* Count badge */}
                <div className="bg-white rounded-xl shadow-lg px-3 py-2 text-center">
                  <p className="font-display text-xl font-medium text-obsidian-900">{filtered.length}</p>
                  <p className="text-[10px] text-obsidian-400">Properties</p>
                </div>
              </div>

              {/* Selected listing card */}
              {selected && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-4">
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-surface-border">
                    <div className="flex gap-0">
                      <div className="w-28 flex-shrink-0">
                        {selected.images?.[0]?.url
                          ? <img src={selected.images[0].url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-surface-subtle flex items-center justify-center"><Home className="w-6 h-6 text-obsidian-200" /></div>
                        }
                      </div>
                      <div className="flex-1 p-3">
                        <div className="flex justify-between">
                          <p className="font-semibold text-obsidian-900 text-sm line-clamp-1">{selected.title}</p>
                          <button onClick={() => setSelected(null)} className="text-obsidian-300 hover:text-obsidian-700 flex-shrink-0 ml-2"><X className="w-4 h-4" /></button>
                        </div>
                        <p className="text-xs text-obsidian-400 mb-1">📍 {selected.neighborhood}</p>
                        <p className="font-display text-lg font-semibold text-gold-600 mb-2">{fmt(selected.price)}</p>
                        <Link href={`/properties/${selected.id}`}
                          className="flex items-center justify-center gap-1 py-1.5 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-xl text-xs font-semibold transition-colors">
                          View Property <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
