'use client'
import { useState, useEffect, useRef } from 'react'
import { Droplets, AlertTriangle, CheckCircle2, Info, MapPin, Layers } from 'lucide-react'
import { NEIGHBOURHOODS, FLOOD_RISK_INFO } from '@/lib/neighbourhoods-data'

type FloodRisk = 'Very Low'|'Low'|'Medium'|'High'|'Very High'

// Port Harcourt flood zone polygons (approximate bounding boxes per neighbourhood)
const FLOOD_ZONES = [
  { name:'GRA Phase 2',      risk:'Low'      as FloodRisk, lat:4.8234, lng:7.0312, r:0.012 },
  { name:'Old GRA',          risk:'Low'      as FloodRisk, lat:4.8189, lng:7.0198, r:0.010 },
  { name:'Woji',             risk:'Medium'   as FloodRisk, lat:4.8456, lng:7.0678, r:0.015 },
  { name:'Trans Amadi',      risk:'Medium'   as FloodRisk, lat:4.8312, lng:7.0534, r:0.018 },
  { name:'Rumuola',          risk:'Low'      as FloodRisk, lat:4.8089, lng:7.0423, r:0.013 },
  { name:'Eleme',            risk:'Medium'   as FloodRisk, lat:4.8567, lng:7.1234, r:0.020 },
  { name:'Peter Odili Road', risk:'Low'      as FloodRisk, lat:4.8345, lng:7.0456, r:0.012 },
  { name:'Stadium Road',     risk:'Low'      as FloodRisk, lat:4.8123, lng:7.0389, r:0.011 },
  { name:'Bonny Island',     risk:'High'     as FloodRisk, lat:4.4423, lng:7.1534, r:0.025 },
  { name:'Choba',            risk:'Low'      as FloodRisk, lat:4.8934, lng:7.0123, r:0.015 },
  { name:'D-Line',           risk:'Low'      as FloodRisk, lat:4.8023, lng:7.0312, r:0.010 },
  { name:'Diobu',            risk:'High'     as FloodRisk, lat:4.7934, lng:7.0167, r:0.013 },
  { name:'Borokiri',         risk:'Very High'as FloodRisk, lat:4.7712, lng:7.0145, r:0.012 },
  { name:'Rumuokoro',        risk:'Medium'   as FloodRisk, lat:4.8623, lng:7.0534, r:0.014 },
  { name:'Rumueme',          risk:'Medium'   as FloodRisk, lat:4.8534, lng:7.0312, r:0.013 },
]

const RISK_COLORS: Record<FloodRisk,{ fill:string; stroke:string; label:string; emoji:string }> = {
  'Very Low': { fill:'rgba(16,185,129,0.15)', stroke:'#10b981', label:'Very Low Risk', emoji:'✅' },
  'Low':      { fill:'rgba(59,130,246,0.15)', stroke:'#3b82f6', label:'Low Risk',      emoji:'🟢' },
  'Medium':   { fill:'rgba(245,158,11,0.20)', stroke:'#f59e0b', label:'Medium Risk',   emoji:'⚠️' },
  'High':     { fill:'rgba(249,115,22,0.25)', stroke:'#f97316', label:'High Risk',     emoji:'🔶' },
  'Very High':{ fill:'rgba(239,68,68,0.30)',  stroke:'#ef4444', label:'Very High Risk', emoji:'🚨' },
}

declare global { interface Window { google: any; __floodMapCb: () => void } }

type Props = { lat?: number; lng?: number; compact?: boolean; showLegend?: boolean }

export default function FloodRiskMap({ lat, lng, compact = false, showLegend = true }: Props) {
  const mapRef  = useRef<HTMLDivElement>(null)
  const mapInst = useRef<any>(null)
  const [loaded, setLoaded]       = useState(false)
  const [selected, setSelected]   = useState<typeof FLOOD_ZONES[0]|null>(null)
  const [activeLayer, setActiveLayer] = useState<FloodRisk|'all'>('all')

  useEffect(() => {
    if ((window as any).google?.maps) { setLoaded(true); return }
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!key) return
    window.__floodMapCb = () => setLoaded(true)
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=__floodMapCb`
    s.async = true; s.defer = true
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (!loaded || !mapRef.current) return
    const google = (window as any).google
    const centre = { lat: lat||4.8156, lng: lng||7.0498 }

    const map = new google.maps.Map(mapRef.current, {
      center: centre, zoom: lat ? 15 : 12,
      mapTypeId: 'roadmap',
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
      styles: [{ featureType:'poi', elementType:'labels', stylers:[{ visibility:'off' }] }],
    })
    mapInst.current = map

    // Draw flood zones as circles
    FLOOD_ZONES.forEach(zone => {
      if (activeLayer !== 'all' && zone.risk !== activeLayer) return
      const colors = RISK_COLORS[zone.risk]
      const circle = new google.maps.Circle({
        map,
        center: { lat: zone.lat, lng: zone.lng },
        radius: zone.r * 111000,
        fillColor: colors.fill,
        fillOpacity: 1,
        strokeColor: colors.stroke,
        strokeOpacity: 0.8,
        strokeWeight: 2,
      })

      const label = new google.maps.Marker({
        position: { lat: zone.lat, lng: zone.lng },
        map,
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
        label: { text: `${colors.emoji} ${zone.name}`, color: '#0A0A0B', fontWeight:'600', fontSize:'10px', fontFamily:'Outfit' },
      })

      circle.addListener('click', () => setSelected(zone))
      label.addListener('click', () => setSelected(zone))
    })

    // Show property pin if lat/lng provided
    if (lat && lng) {
      new google.maps.Marker({
        position: { lat, lng }, map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12, fillColor:'#C8A84B', fillOpacity:1,
          strokeColor:'#0A0A0B', strokeWeight:3,
        },
        zIndex: 999,
      })
    }
  }, [loaded, lat, lng, activeLayer])

  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

  if (!mapKey) return (
    <div className="card overflow-hidden">
      <div className="p-4 bg-obsidian-900 flex items-center gap-3">
        <Droplets className="w-5 h-5 text-blue-400" />
        <div>
          <p className="text-white font-semibold text-sm">Flood Risk by Neighbourhood</p>
          <p className="text-white/40 text-xs">Port Harcourt · Updated rainy season 2025</p>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {FLOOD_ZONES.map((z,i) => {
          const c = RISK_COLORS[z.risk]
          return (
            <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-obsidian-400" />
                <span className="text-sm text-obsidian-700">{z.name}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border`}
                style={{ borderColor:c.stroke, color:c.stroke, background:c.fill }}>
                {c.emoji} {z.risk}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className={`card overflow-hidden ${compact?'':'shadow-xl'}`}>
      {/* Header */}
      <div className="p-4 bg-obsidian-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Droplets className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-white font-semibold text-sm">Flood Risk Map</p>
            <p className="text-white/40 text-xs">Port Harcourt · Rainy Season 2025</p>
          </div>
        </div>
        {/* Layer filter */}
        <select value={activeLayer} onChange={e => setActiveLayer(e.target.value as any)}
          className="text-xs bg-white/10 border border-white/20 text-white rounded-xl px-2 py-1 outline-none">
          <option value="all">All zones</option>
          {(['Very Low','Low','Medium','High','Very High'] as FloodRisk[]).map(r => (
            <option key={r} value={r}>{r} Risk</option>
          ))}
        </select>
      </div>

      {/* Map */}
      <div className="relative" style={{ height: compact?280:400 }}>
        {!loaded && (
          <div className="absolute inset-0 bg-surface-subtle flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-obsidian-500">Loading flood risk map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />

        {/* Selected zone popup */}
        {selected && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-64">
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-surface-border">
              <button onClick={() => setSelected(null)} className="absolute top-2 right-2 text-obsidian-300 hover:text-obsidian-700">
                <span className="text-lg">×</span>
              </button>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background:RISK_COLORS[selected.risk].fill }}>
                  {RISK_COLORS[selected.risk].emoji}
                </div>
                <div>
                  <p className="font-semibold text-obsidian-900 text-sm">{selected.name}</p>
                  <p className="text-xs font-bold mt-0.5" style={{ color:RISK_COLORS[selected.risk].stroke }}>
                    {RISK_COLORS[selected.risk].label}
                  </p>
                  <p className="text-xs text-obsidian-400 mt-1 leading-relaxed">
                    {NEIGHBOURHOODS.find(n => n.name === selected.name)?.floodNotes || `${selected.risk} flood risk area.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="p-3 bg-surface-subtle border-t border-surface-border">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {Object.entries(RISK_COLORS).map(([risk, c]) => (
              <div key={risk} className="flex items-center gap-1 text-[10px] font-semibold"
                style={{ color:c.stroke }}>
                <div className="w-3 h-3 rounded-full" style={{ background:c.stroke }} />
                {risk}
              </div>
            ))}
          </div>
          <p className="text-[9px] text-obsidian-400 text-center mt-1">Click any zone for details. Based on REMA and 2025 rainy season data.</p>
        </div>
      )}
    </div>
  )
}
