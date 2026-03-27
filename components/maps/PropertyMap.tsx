'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Map, Satellite, Eye, Navigation, School, Hospital,
  ShoppingBag, Fuel, Building2, X, Loader2, Car,
  PersonStanding, Clock, MapPin, Star, ChevronDown,
  Maximize2, StreetView, Globe, Coffee
} from 'lucide-react'

type Props = {
  address: string
  neighborhood: string
  title: string
  price?: number
  listingType?: string
  compact?: boolean
}

type Place = { name: string; rating?: number; vicinity: string; lat: number; lng: number; type: string }

const POI_CATEGORIES = [
  { type: 'school',      label: 'Schools',    icon: '🏫', color: '#3b82f6' },
  { type: 'hospital',    label: 'Hospitals',  icon: '🏥', color: '#ef4444' },
  { type: 'supermarket', label: 'Shopping',   icon: '🛒', color: '#8b5cf6' },
  { type: 'gas_station', label: 'Fuel',       icon: '⛽', color: '#f59e0b' },
  { type: 'bank',        label: 'Banks',      icon: '🏦', color: '#10b981' },
  { type: 'restaurant',  label: 'Dining',     icon: '🍽', color: '#f97316' },
]

const PH_LANDMARKS = [
  { name: 'Shell IA',        address: 'Shell Industrial Area, Port Harcourt' },
  { name: 'NLNG Bonny',      address: 'Bonny Island, Rivers State' },
  { name: 'Port Harcourt Airport', address: 'Port Harcourt International Airport' },
  { name: 'GRA Shopping Mall', address: 'GRA Phase 2, Port Harcourt' },
  { name: 'University of PH', address: 'University of Port Harcourt, Choba' },
  { name: 'PH City Centre',  address: 'Port Harcourt City Centre' },
]

declare global {
  interface Window { google: any; __nayaMapCb: () => void }
}

function fmt(n: number) {
  if (n >= 1e6) return `₦${(n/1e6).toFixed(1)}M`
  if (n >= 1e3) return `₦${(n/1e3).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

export default function PropertyMap({ address, neighborhood, title, price, listingType, compact = false }: Props) {
  const mapRef        = useRef<HTMLDivElement>(null)
  const svRef         = useRef<HTMLDivElement>(null)
  const mapInstance   = useRef<any>(null)
  const svInstance    = useRef<any>(null)
  const markerRef     = useRef<any>(null)
  const poiMarkers    = useRef<any[]>([])

  const [mapLoaded, setMapLoaded]       = useState(false)
  const [coords, setCoords]             = useState<{ lat: number; lng: number } | null>(null)
  const [mapType, setMapType]           = useState<'roadmap'|'satellite'|'hybrid'>('roadmap')
  const [streetViewOpen, setStreetViewOpen] = useState(false)
  const [fullscreen, setFullscreen]     = useState(false)
  const [activePoiType, setActivePoiType] = useState<string | null>(null)
  const [places, setPlaces]             = useState<Place[]>([])
  const [loadingPOI, setLoadingPOI]     = useState(false)
  const [commuteDestination, setCommute] = useState('')
  const [commuteMode, setCommuteMode]   = useState<'driving'|'walking'>('driving')
  const [commuteResult, setCommuteResult] = useState<any>(null)
  const [loadingCommute, setLoadingCommute] = useState(false)
  const [tab, setTab]                   = useState<'map'|'streetview'|'commute'|'nearby'>('map')
  const [approximate, setApproximate]   = useState(false)

  // Load Google Maps script
  const loadMaps = useCallback(() => {
    if ((window as any).google?.maps) { setMapLoaded(true); return }
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!key) return
    if (document.querySelector('#naya-maps-script')) {
      const check = setInterval(() => {
        if ((window as any).google?.maps) { setMapLoaded(true); clearInterval(check) }
      }, 100)
      return
    }
    window.__nayaMapCb = () => setMapLoaded(true)
    const s = document.createElement('script')
    s.id  = 'naya-maps-script'
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry&callback=__nayaMapCb`
    s.async = true; s.defer = true
    document.head.appendChild(s)
  }, [])

  useEffect(() => { loadMaps() }, [loadMaps])

  // Geocode address
  useEffect(() => {
    if (!mapLoaded) return
    fetch(`/api/maps/geocode?address=${encodeURIComponent(address + ' ' + neighborhood)}`)
      .then(r => r.json())
      .then(d => { setCoords({ lat: d.lat, lng: d.lng }); setApproximate(d.approximate || false) })
      .catch(() => setCoords({ lat: 4.8156, lng: 7.0498 }))
  }, [mapLoaded, address, neighborhood])

  // Init map
  useEffect(() => {
    if (!mapLoaded || !coords || !mapRef.current) return
    const google = (window as any).google
    const map = new google.maps.Map(mapRef.current, {
      center:    coords,
      zoom:      approximate ? 14 : 17,
      mapTypeId: mapType,
      disableDefaultUI: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: [
        { featureType:'poi', elementType:'labels', stylers:[{ visibility:'off' }] },
        { featureType:'transit', stylers:[{ visibility:'off' }] },
      ],
    })
    mapInstance.current = map

    // Custom marker
    const marker = new google.maps.Marker({
      position: coords,
      map,
      title,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: '#C8A84B',
        fillOpacity: 1,
        strokeColor: '#0A0A0B',
        strokeWeight: 3,
      }
    })
    markerRef.current = marker

    // Info window
    const priceStr = price ? fmt(price) : ''
    const iw = new google.maps.InfoWindow({
      content: `
        <div style="font-family:Outfit,sans-serif;padding:4px;min-width:200px">
          <p style="font-weight:700;color:#0A0A0B;margin:0 0 4px;font-size:14px">${title}</p>
          <p style="color:#6B6B6B;margin:0 0 4px;font-size:12px">📍 ${neighborhood}, Port Harcourt</p>
          ${priceStr ? `<p style="color:#C8A84B;font-weight:700;font-size:16px;margin:0">${priceStr}${listingType==='RENT'?'/yr':''}</p>` : ''}
          ${approximate ? `<p style="color:#f59e0b;font-size:10px;margin:4px 0 0">Approximate location</p>` : ''}
        </div>
      `
    })
    marker.addListener('click', () => iw.open(map, marker))
    setTimeout(() => iw.open(map, marker), 500)
  }, [mapLoaded, coords, approximate])

  // Change map type
  useEffect(() => {
    if (mapInstance.current) mapInstance.current.setMapTypeId(mapType)
  }, [mapType])

  // Street View
  useEffect(() => {
    if (!mapLoaded || !coords || !svRef.current || !streetViewOpen) return
    const google = (window as any).google
    svInstance.current = new google.maps.StreetViewPanorama(svRef.current, {
      position: coords,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      addressControl: true,
      fullscreenControl: false,
    })
  }, [mapLoaded, coords, streetViewOpen])

  // Load POI
  const loadPOI = async (type: string) => {
    if (!coords) return
    if (activePoiType === type) {
      setActivePoiType(null)
      setPlaces([])
      poiMarkers.current.forEach(m => m.setMap(null))
      poiMarkers.current = []
      return
    }
    setActivePoiType(type)
    setLoadingPOI(true)
    try {
      const res  = await fetch(`/api/maps/places?lat=${coords.lat}&lng=${coords.lng}&type=${type}`)
      const data = await res.json()
      setPlaces(data.places || [])

      // Add markers
      poiMarkers.current.forEach(m => m.setMap(null))
      poiMarkers.current = []
      const google = (window as any).google
      const cat = POI_CATEGORIES.find(c => c.type === type)
      data.places?.forEach((p: Place) => {
        const m = new google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map:      mapInstance.current,
          title:    p.name,
          label:    { text: cat?.icon || '📍', fontSize: '18px' },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor:   cat?.color || '#3b82f6',
            fillOpacity: 0.9,
            strokeColor: '#fff',
            strokeWeight: 2,
          }
        })
        poiMarkers.current.push(m)
      })
    } catch {}
    setLoadingPOI(false)
  }

  // Commute calculator
  const calcCommute = async () => {
    if (!commuteDestination || !coords) return
    setLoadingCommute(true); setCommuteResult(null)
    try {
      const origin = `${coords.lat},${coords.lng}`
      const res  = await fetch(`/api/maps/directions?origin=${encodeURIComponent(origin)}&dest=${encodeURIComponent(commuteDestination + ', Port Harcourt, Nigeria')}&mode=${commuteMode}`)
      const data = await res.json()
      setCommuteResult(data)
    } catch {}
    setLoadingCommute(false)
  }

  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

  if (!mapKey) return (
    <div className="rounded-2xl border-2 border-dashed border-surface-border p-8 text-center">
      <MapPin className="w-10 h-10 text-obsidian-200 mx-auto mb-3" />
      <p className="font-semibold text-obsidian-700 mb-1">Map not configured</p>
      <p className="text-sm text-obsidian-400">Add NEXT_PUBLIC_GOOGLE_MAPS_KEY to Vercel environment variables.</p>
    </div>
  )

  return (
    <div className={`rounded-2xl overflow-hidden border border-surface-border ${fullscreen ? 'fixed inset-0 z-[500] rounded-none border-0' : ''}`}
      style={{ background: '#fff' }}>

      {/* ── Tab Bar ─────────────────────────────────── */}
      <div className="flex items-center gap-0 border-b border-surface-border bg-white">
        {[
          { id:'map',        label:'Map',         emoji:'🗺' },
          { id:'streetview', label:'Street View',  emoji:'👁' },
          { id:'nearby',     label:'Nearby',       emoji:'📍' },
          { id:'commute',    label:'Commute',      emoji:'🚗' },
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id as any); if (t.id === 'streetview') setStreetViewOpen(true) }}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              tab === t.id ? 'border-gold-500 text-obsidian-900' : 'border-transparent text-obsidian-400 hover:text-obsidian-700'
            }`}>
            <span>{t.emoji}</span>
            <span className="hidden md:inline">{t.label}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 px-3">
          {tab === 'map' && (
            <>
              <button onClick={() => setMapType('roadmap')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${mapType==='roadmap'?'bg-obsidian-900 text-white':'text-obsidian-500 hover:bg-surface-subtle'}`}>
                Map
              </button>
              <button onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${mapType==='satellite'?'bg-obsidian-900 text-white':'text-obsidian-500 hover:bg-surface-subtle'}`}>
                Satellite
              </button>
              <button onClick={() => setMapType('hybrid')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${mapType==='hybrid'?'bg-obsidian-900 text-white':'text-obsidian-500 hover:bg-surface-subtle'}`}>
                Hybrid
              </button>
            </>
          )}
          <button onClick={() => setFullscreen(p => !p)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-obsidian-400 hover:text-obsidian-700 hover:bg-surface-subtle transition-all ml-1">
            {fullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── MAP TAB ─────────────────────────────────── */}
      {tab === 'map' && (
        <div className="relative" style={{ height: compact ? 320 : fullscreen ? 'calc(100vh - 140px)' : 460 }}>
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-subtle z-10">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-2" />
                <p className="text-sm text-obsidian-500">Loading map...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />

          {/* Approximate warning */}
          {approximate && mapLoaded && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-full text-xs font-semibold shadow-lg">
                <MapPin className="w-3.5 h-3.5" />Approximate location shown
              </div>
            </div>
          )}

          {/* POI Quick access */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {POI_CATEGORIES.slice(0,4).map(cat => (
              <button key={cat.type} onClick={() => loadPOI(cat.type)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold shadow-lg transition-all ${
                  activePoiType === cat.type
                    ? 'bg-obsidian-900 text-white'
                    : 'bg-white text-obsidian-700 hover:bg-surface-subtle'
                }`}>
                <span>{cat.icon}</span>
                <span className="hidden md:inline">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Open in Google Maps */}
          {coords && (
            <a href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
              target="_blank" rel="noopener noreferrer"
              className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-2 bg-white shadow-lg rounded-full text-xs font-semibold text-obsidian-700 hover:bg-surface-subtle transition-all">
              <Globe className="w-3.5 h-3.5 text-blue-600" />Open in Maps
            </a>
          )}
        </div>
      )}

      {/* ── STREET VIEW TAB ─────────────────────────── */}
      {tab === 'streetview' && (
        <div style={{ height: compact ? 320 : fullscreen ? 'calc(100vh - 140px)' : 460 }} className="relative">
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-subtle">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
            </div>
          )}
          <div ref={svRef} className="w-full h-full" />
          {coords && (
            <a href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coords.lat},${coords.lng}`}
              target="_blank" rel="noopener noreferrer"
              className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-2 bg-white shadow-lg rounded-full text-xs font-semibold text-obsidian-700 hover:bg-surface-subtle">
              <Globe className="w-3.5 h-3.5 text-blue-600" />Open in Street View
            </a>
          )}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="px-3 py-2 bg-black/60 backdrop-blur rounded-full text-white text-xs">
              👁 Drag to look around · Scroll to zoom
            </div>
          </div>
        </div>
      )}

      {/* ── NEARBY TAB ──────────────────────────────── */}
      {tab === 'nearby' && (
        <div className="p-5">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
            {POI_CATEGORIES.map(cat => (
              <button key={cat.type} onClick={() => { setTab('map'); setTimeout(() => loadPOI(cat.type), 100) }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-surface-border hover:border-gold-300 hover:bg-gold-50 transition-all group">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-obsidian-600 group-hover:text-obsidian-900">{cat.label}</span>
              </button>
            ))}
          </div>

          {loadingPOI && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
            </div>
          )}

          {places.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-3">
                {POI_CATEGORIES.find(c => c.type === activePoiType)?.label} nearby
              </p>
              {places.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-surface-subtle rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 text-lg shadow-sm">
                    {POI_CATEGORIES.find(c => c.type === activePoiType)?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-obsidian-900 text-sm">{p.name}</p>
                    <p className="text-xs text-obsidian-400 truncate">{p.vicinity}</p>
                  </div>
                  {p.rating && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                      <span className="text-xs font-semibold text-obsidian-700">{p.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loadingPOI && places.length === 0 && (
            <div className="text-center py-8">
              <p className="text-obsidian-400 text-sm">Select a category above to find nearby places.</p>
            </div>
          )}
        </div>
      )}

      {/* ── COMMUTE TAB ─────────────────────────────── */}
      {tab === 'commute' && (
        <div className="p-5">
          <h3 className="font-semibold text-obsidian-900 mb-1">Commute Calculator</h3>
          <p className="text-xs text-obsidian-400 mb-4">How far is this property from your workplace?</p>

          {/* Quick destinations */}
          <div className="mb-4">
            <p className="text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-2">Common Destinations</p>
            <div className="flex flex-wrap gap-2">
              {PH_LANDMARKS.map((l, i) => (
                <button key={i} onClick={() => setCommute(l.address)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    commuteDestination === l.address
                      ? 'border-gold-500 bg-gold-50 text-gold-700'
                      : 'border-surface-border text-obsidian-600 hover:border-gold-300'
                  }`}>
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom destination */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="input-label">Or enter any address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
                <input
                  value={commuteDestination}
                  onChange={e => setCommute(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && calcCommute()}
                  placeholder="Shell Industrial Area, Rumuola..."
                  className="input-field pl-9 text-sm" />
              </div>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2">
              {[
                { mode:'driving' as const,  label:'Driving', emoji:'🚗' },
                { mode:'walking' as const,  label:'Walking', emoji:'🚶' },
              ].map(m => (
                <button key={m.mode} onClick={() => setCommuteMode(m.mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all flex-1 justify-center ${
                    commuteMode === m.mode
                      ? 'border-obsidian-900 bg-obsidian-900 text-white'
                      : 'border-surface-border text-obsidian-600 hover:border-obsidian-400'
                  }`}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            <button onClick={calcCommute} disabled={!commuteDestination || loadingCommute}
              className="btn-primary w-full justify-center gap-2 disabled:opacity-50">
              {loadingCommute
                ? <><Loader2 className="w-4 h-4 animate-spin" />Calculating...</>
                : <>Calculate Commute Time</>
              }
            </button>
          </div>

          {/* Result */}
          {commuteResult && !commuteResult.error && (
            <div className="p-5 bg-obsidian-900 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl">{commuteMode === 'driving' ? '🚗' : '🚶'}</span>
                <div>
                  <p className="font-display text-4xl font-light text-white">{commuteResult.duration}</p>
                  <p className="text-white/50 text-sm">{commuteResult.distance} · {commuteMode}</p>
                </div>
              </div>
              <p className="text-white/40 text-xs">
                From {neighborhood} to {PH_LANDMARKS.find(l => l.address === commuteDestination)?.name || commuteDestination.split(',')[0]}
              </p>
              <a href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(address + ' ' + neighborhood + ' Port Harcourt')}&destination=${encodeURIComponent(commuteDestination)}&travelmode=${commuteMode}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs font-semibold transition-all">
                <Globe className="w-3.5 h-3.5" />Open Route in Google Maps
              </a>
            </div>
          )}

          {commuteResult?.error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="text-sm text-rose-700">Could not calculate route. Try a different destination.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
