'use client'
import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin, Zap, Droplets, Shield, Star, TrendingUp,
  Home, School, ShoppingBag, Wifi, ChevronRight,
  ArrowLeft, Clock, Users, Building2, AlertTriangle,
  CheckCircle2, XCircle, Search, Bell, ArrowRight
} from 'lucide-react'
import NEIGHBOURHOODS, { ELECTRICITY_BAND_INFO, FLOOD_RISK_INFO } from '@/lib/neighbourhoods-data'

const fmt = (n: number) => n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n}`

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 36; const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#10b981' : score >= 70 ? '#C8A84B' : score >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#E8E3D8" strokeWidth="7" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[9px] text-obsidian-400">/100</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-obsidian-600 mt-1">{label}</p>
    </div>
  )
}

function InfraBar({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  const color = value >= 8 ? 'bg-emerald-500' : value >= 6 ? 'bg-gold-500' : value >= 4 ? 'bg-amber-400' : 'bg-rose-400'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-obsidian-400" />
          <span className="text-sm text-obsidian-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-obsidian-900">{value}/10</span>
      </div>
      <div className="h-2 bg-surface-border rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  )
}

export default function NeighbourhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const n = NEIGHBOURHOODS.find(x => x.slug === slug)
  const [alertEmail, setAlertEmail] = useState('')
  const [alertSet, setAlertSet]     = useState(false)
  const [listings, setListings]     = useState<any[]>([])

  useEffect(() => {
    if (!n) return
    fetch(`/api/listings?neighborhood=${encodeURIComponent(n.name)}&limit=6`)
      .then(r => r.json())
      .then(d => setListings(d.data?.listings || []))
      .catch(() => {})
  }, [n])

  if (!n) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-display text-2xl text-obsidian-900 mb-2">Area not found</h2>
        <Link href="/neighborhoods" className="btn-primary gap-2 inline-flex mt-4">
          <ArrowLeft className="w-4 h-4" />Back to Neighbourhoods
        </Link>
      </div>
    </div>
  )

  const bandInfo  = ELECTRICITY_BAND_INFO[n.electricityBand]
  const floodInfo = FLOOD_RISK_INFO[n.floodRisk]

  const handleAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!alertEmail) return
    setAlertSet(true)
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero */}
      <section className="relative bg-obsidian-900 overflow-hidden py-14">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-25" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/8 rounded-full blur-[100px]" />
        <div className="relative z-10 page-container">
          <Link href="/neighborhoods" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />All Neighbourhoods
          </Link>
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <p className="text-gold-400/70 text-sm font-medium mb-1">{n.lga} · Port Harcourt</p>
              <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-3">{n.name}</h1>
              <p className="text-white/50 text-base max-w-xl leading-relaxed mb-5">{n.description}</p>
              <div className="flex flex-wrap gap-2">
                {n.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 border border-white/15 text-white/70 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* Score ring */}
            <div className="flex-shrink-0">
              <ScoreRing score={n.areaScore} label="Naya Area Score" />
            </div>
          </div>
        </div>
      </section>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── ELECTRICITY SECTION ─────────────────── */}
            <div className="card overflow-hidden">
              <div className={`px-5 py-4 border-b ${bandInfo.bg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${bandInfo.color}`} />
                    <h2 className={`font-semibold ${bandInfo.color}`}>Electricity Supply</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${bandInfo.bg} ${bandInfo.color}`}>
                    {bandInfo.emoji} {bandInfo.label}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  {/* Hours per day visual */}
                  <div className="md:col-span-1">
                    <div className="text-center p-4 bg-surface-subtle rounded-2xl">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#E8E3D8" strokeWidth="8" />
                          <circle cx="50" cy="50" r="40" fill="none"
                            stroke={n.electricityBand === 'A' ? '#10b981' : n.electricityBand === 'B' ? '#3b82f6' : n.electricityBand === 'C' ? '#f59e0b' : n.electricityBand === 'D' ? '#f97316' : '#ef4444'}
                            strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={`${(n.electricityHoursPerDay / 24) * 251.2} 251.2`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-display text-2xl font-bold text-obsidian-900">{n.electricityHoursPerDay}</span>
                          <span className="text-[9px] text-obsidian-400">hrs/day</span>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-obsidian-700">Average Supply</p>
                      <p className="text-[10px] text-obsidian-400">{24 - n.electricityHoursPerDay}h outage/day</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <p className="text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-1">Provider</p>
                      <p className="text-sm text-obsidian-900 font-medium">{n.electricityProvider}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-1">What This Means</p>
                      <p className="text-sm text-obsidian-600 leading-relaxed">{bandInfo.description}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-1">Local Notes</p>
                      <p className="text-sm text-obsidian-600 leading-relaxed">{n.electricityNotes}</p>
                    </div>
                  </div>
                </div>

                {/* Band comparison */}
                <div className="p-4 bg-surface-subtle rounded-2xl">
                  <p className="text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-3">DISCO Band Scale</p>
                  <div className="flex items-center gap-1">
                    {(['A','B','C','D','E'] as const).map(band => {
                      const bi = ELECTRICITY_BAND_INFO[band]
                      const isActive = band === n.electricityBand
                      return (
                        <div key={band} className={`flex-1 py-2 rounded-xl text-center text-xs font-black border transition-all ${isActive ? `${bi.bg} ${bi.color} scale-105 shadow` : 'bg-white text-obsidian-300 border-surface-border'}`}>
                          {band}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-emerald-600 font-medium">Best supply</span>
                    <span className="text-[10px] text-rose-500 font-medium">Worst supply</span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`mt-4 p-4 rounded-2xl border ${n.electricityBand <= 'B' ? 'bg-emerald-50 border-emerald-200' : n.electricityBand === 'C' ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}`}>
                  <div className="flex items-start gap-2">
                    {n.electricityBand <= 'B'
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      : <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    }
                    <p className={`text-xs leading-relaxed ${n.electricityBand <= 'B' ? 'text-emerald-700' : n.electricityBand === 'C' ? 'text-amber-700' : 'text-rose-700'}`}>
                      {n.electricityBand <= 'B'
                        ? `Good news — ${n.name} has above-average PHED supply for Port Harcourt. Inverter/solar backup still recommended for 100% uptime.`
                        : n.electricityBand === 'C'
                          ? `${n.name} has typical Band C supply. Budget for a 3–5KVA inverter or generator. Monthly fuel cost: ~₦15,000–₦30,000.`
                          : `${n.name} has poor grid supply. A robust solar/inverter system or petrol/diesel generator is essential. Factor ₦30,000–₦60,000/month into your budget.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── FLOOD RISK ──────────────────────────── */}
            <div className="card overflow-hidden">
              <div className={`px-5 py-4 border-b ${floodInfo.bg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className={`w-5 h-5 ${floodInfo.color}`} />
                    <h2 className={`font-semibold ${floodInfo.color}`}>Flood Risk Assessment</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${floodInfo.bg} ${floodInfo.color}`}>
                    {floodInfo.emoji} {n.floodRisk} Risk
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-obsidian-600 leading-relaxed mb-4">{n.floodNotes}</p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Naya Tip:</strong> Always visit a property during or immediately after heavy rain before signing any agreement.
                    Ask neighbours about flooding history. Check if the property is elevated from road level.
                    {n.floodRisk === 'High' || n.floodRisk === 'Very High'
                      ? ' In this area, flood insurance is strongly recommended.'
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* ── PRICE DATA ──────────────────────────── */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-obsidian-900">Market Prices</h2>
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className={`w-4 h-4 ${n.priceChange12m > 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                  <span className={`font-semibold ${n.priceChange12m > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {n.priceChange12m > 0 ? '+' : ''}{n.priceChange12m}% this year
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                {/* Rent */}
                <div>
                  <p className="text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-3">Annual Rent</p>
                  <div className="space-y-2">
                    {[
                      { label:'Studio',       val:n.avgRentPerYear.studio },
                      { label:'1 Bedroom',    val:n.avgRentPerYear.oneBed },
                      { label:'2 Bedrooms',   val:n.avgRentPerYear.twoBed },
                      { label:'3 Bedrooms',   val:n.avgRentPerYear.threeBed },
                      { label:'4 Bedrooms',   val:n.avgRentPerYear.fourBed },
                    ].filter(r => r.val > 0).map((r, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                        <span className="text-sm text-obsidian-600">{r.label}</span>
                        <span className="font-semibold text-obsidian-900">{fmt(r.val)}<span className="text-obsidian-400 font-normal text-xs">/yr</span></span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Sale */}
                <div>
                  <p className="text-xs font-bold text-obsidian-500 uppercase tracking-wider mb-3">Sale Prices</p>
                  <div className="space-y-2">
                    {[
                      { label:'1 Bedroom',    val:n.avgSalePrice.oneBed },
                      { label:'2 Bedrooms',   val:n.avgSalePrice.twoBed },
                      { label:'3 Bedrooms',   val:n.avgSalePrice.threeBed },
                      { label:'4 Bedrooms',   val:n.avgSalePrice.fourBed },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                        <span className="text-sm text-obsidian-600">{r.label}</span>
                        <span className="font-semibold text-obsidian-900">{fmt(r.val)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-obsidian-600">Avg. per sqm</span>
                      <span className="font-semibold text-gold-600">{fmt(n.avgPricePerSqm)}/m²</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── INFRASTRUCTURE ──────────────────────── */}
            <div className="card p-5">
              <h2 className="font-semibold text-obsidian-900 mb-5">Infrastructure Scores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfraBar label="Road Quality"   value={n.roadQuality}   icon={Home} />
                <InfraBar label="Security"       value={n.security}      icon={Shield} />
                <InfraBar label="Schools"        value={n.schools}       icon={School} />
                <InfraBar label="Healthcare"     value={n.healthcare}    icon={Home} />
                <InfraBar label="Shopping"       value={n.shopping}      icon={ShoppingBag} />
              </div>
              <div className="mt-4 p-3 bg-surface-subtle rounded-xl">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  <p className="text-sm text-obsidian-700"><span className="font-semibold">Internet speed:</span> {n.internetSpeed}</p>
                </div>
              </div>
            </div>

            {/* ── CURRENT LISTINGS ────────────────────── */}
            {listings.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-obsidian-900">Live Listings in {n.name}</h2>
                  <Link href={`/search?area=${encodeURIComponent(n.name)}`}
                    className="text-xs text-gold-600 hover:text-gold-500 font-semibold flex items-center gap-1">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listings.slice(0,4).map((l: any) => (
                    <Link key={l.id} href={`/properties/${l.id}`}
                      className="flex items-center gap-3 p-3 bg-surface-subtle rounded-xl hover:bg-surface-border transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-obsidian-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {l.images?.[0]?.url
                          ? <img src={l.images[0].url} alt="" className="w-full h-full object-cover" />
                          : <Home className="w-5 h-5 text-obsidian-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-obsidian-900 line-clamp-1">{l.title}</p>
                        <p className="text-xs text-gold-600 font-bold mt-0.5">
                          ₦{Number(l.price) >= 1e6 ? `${(Number(l.price)/1e6).toFixed(1)}M` : `${(Number(l.price)/1000).toFixed(0)}K`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ─────────────────────────────── */}
          <div className="space-y-5">
            {/* Quick stats */}
            <div className="card p-5">
              <h3 className="font-semibold text-obsidian-900 mb-4">Area At a Glance</h3>
              <div className="space-y-3">
                {[
                  { label:'Population', value:n.population, icon:'👥' },
                  { label:'Dominant Sector', value:n.dominantOccupation.split(',')[0], icon:'💼' },
                  { label:'Expat Community', value:n.expatsPresent ? 'Yes — active' : 'Minimal', icon:'🌍' },
                  { label:'Corporate Presence', value:n.corporatePresent ? 'Yes — significant' : 'Limited', icon:'🏢' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="text-[10px] text-obsidian-400 uppercase tracking-wider">{s.label}</p>
                      <p className="text-sm font-semibold text-obsidian-900">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Landmarks */}
            <div className="card p-5">
              <h3 className="font-semibold text-obsidian-900 mb-3">Key Landmarks</h3>
              <div className="space-y-2">
                {n.landmarks.map((lm, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-obsidian-600">
                    <MapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />{lm}
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby areas */}
            <div className="card p-5">
              <h3 className="font-semibold text-obsidian-900 mb-3">Nearby Areas</h3>
              <div className="flex flex-wrap gap-2">
                {n.nearbyAreas.map((area, i) => {
                  const nearby = NEIGHBOURHOODS.find(x => x.name === area)
                  return nearby ? (
                    <Link key={i} href={`/neighborhoods/${nearby.slug}`}
                      className="px-3 py-1.5 border border-surface-border rounded-xl text-xs text-obsidian-600 hover:border-gold-400 hover:text-gold-600 transition-all">
                      {area}
                    </Link>
                  ) : (
                    <span key={i} className="px-3 py-1.5 border border-surface-border rounded-xl text-xs text-obsidian-500">{area}</span>
                  )
                })}
              </div>
            </div>

            {/* ── PROPERTY ALERT ──────────────────────── */}
            <div className="card p-5 border-2 border-gold-200 bg-gold-50/30">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-gold-600" />
                <h3 className="font-semibold text-obsidian-900">Price Alert for {n.name}</h3>
              </div>
              <p className="text-xs text-obsidian-500 mb-4">
                Get notified when new properties match your criteria in {n.name}.
              </p>
              {alertSet ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-sm font-semibold">Alert set! We'll notify you.</p>
                </div>
              ) : (
                <form onSubmit={handleAlert} className="space-y-2">
                  <input type="email" required value={alertEmail} onChange={e => setAlertEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field text-sm" />
                  <Link href={`/search?area=${encodeURIComponent(n.name)}`}
                    className="block w-full text-center py-2.5 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-xl text-xs font-semibold transition-colors">
                    Browse {n.name} Listings →
                  </Link>
                </form>
              )}
            </div>

            {/* CTA */}
            <div className="card p-5 bg-obsidian-900 border-0">
              <h3 className="font-semibold text-white mb-2">Have a property here?</h3>
              <p className="text-white/50 text-xs mb-4">List it on Naya and reach buyers and renters searching {n.name}.</p>
              <Link href="/portal/list" className="btn-primary w-full justify-center text-xs">
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
