'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, MapPin, TrendingUp, TrendingDown, Minus,
  Shield, Zap, GraduationCap, Droplets, ArrowRight,
  SlidersHorizontal, Star, ChevronDown, ChevronUp,
  BarChart3, CheckCircle2
} from 'lucide-react'
import { neighborhoods } from '@/lib/data'
import type { Neighborhood } from '@/lib/types'

function fmt(n: number) {
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(0)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

const lgaList = [...new Set(neighborhoods.map(n => n.lga))].sort()

const budgetFilters = [
  { label: 'Under ₦500K/yr', min: 0, max: 500000 },
  { label: '₦500K – ₦1.5M/yr', min: 500000, max: 1500000 },
  { label: '₦1.5M – ₦3M/yr', min: 1500000, max: 3000000 },
  { label: 'Above ₦3M/yr', min: 3000000, max: Infinity },
]

const lifestyleFilters = [
  { value: 'all', label: 'All Lifestyles' },
  { value: 'expat', label: 'Expat & Corporate', keywords: ['expat', 'corporate', 'oil', 'nlng'] },
  { value: 'family', label: 'Families', keywords: ['family', 'school', 'quiet', 'established'] },
  { value: 'young', label: 'Young Professionals', keywords: ['young', 'emerging', 'affordable', 'university'] },
  { value: 'investor', label: 'Investors', keywords: ['growth', 'commercial', 'trade'] },
  { value: 'budget', label: 'Budget-Conscious', keywords: ['affordable', 'budget', 'value'] },
]

const sortOptions = [
  { value: 'default', label: 'Recommended' },
  { value: 'trend_desc', label: 'Fastest Growing' },
  { value: 'safety_desc', label: 'Safest First' },
  { value: 'price_asc', label: 'Most Affordable' },
  { value: 'price_desc', label: 'Most Premium' },
  { value: 'listings_desc', label: 'Most Listings' },
  { value: 'infra_desc', label: 'Best Infrastructure' },
]

function ScoreBar({ score, label, icon: Icon, color }: { score: number; label: string; icon: any; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-xs text-obsidian-500">
          <Icon className={`w-3 h-3 ${color}`} />{label}
        </div>
        <span className={`font-mono text-xs font-bold ${score >= 80 ? 'text-emerald-600' : score >= 65 ? 'text-amber-600' : 'text-rose-600'}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-surface-subtle rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 65 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function NeighborhoodCard({ n, view }: { n: Neighborhood; view: 'grid' | 'list' | 'compare' }) {
  const [expanded, setExpanded] = useState(false)

  if (view === 'list') {
    return (
      <div className="card p-5 hover:border-gold-300 transition-all group">
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${n.heroGradient} flex items-center justify-center text-3xl flex-shrink-0`}>{n.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <h3 className="font-display text-lg font-medium text-obsidian-900 group-hover:text-gold-600 transition-colors">{n.name}</h3>
                <div className="flex items-center gap-2 text-xs text-obsidian-400 mt-0.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gold-500" />{n.lga} LGA</span>
                  <span>·</span><span>{n.propertyCount} listings</span>
                  <span>·</span>
                  <span className={`flex items-center gap-1 font-mono font-bold ${n.trend === 'up' ? 'text-emerald-500' : 'text-obsidian-400'}`}>
                    {n.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {n.trend === 'up' ? '+' : ''}{n.trendPct}%
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-display text-lg font-medium text-gold-600">{fmt(n.avgRent1br)}</div>
                <div className="text-[10px] text-obsidian-400">1-bed/yr</div>
              </div>
            </div>
            <p className="text-xs text-obsidian-500 leading-relaxed mb-3 line-clamp-2">{n.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {n.highlights.map((h, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">{h}</span>)}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { score: n.safetyScore, label: 'Safety' },
                { score: n.infrastructureScore, label: 'Infra' },
                { score: n.schoolScore, label: 'Schools' },
                { score: n.floodRiskScore, label: 'Flood' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className={`font-mono text-sm font-bold ${s.score >= 80 ? 'text-emerald-600' : s.score >= 65 ? 'text-amber-600' : 'text-rose-600'}`}>{s.score}</div>
                  <div className="text-[10px] text-obsidian-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <Link href={`/neighborhoods/${n.slug}`} className="btn-primary btn-sm flex-shrink-0">
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden hover:border-gold-300 transition-all group">
      <div className={`relative h-36 bg-gradient-to-br ${n.heroGradient} flex items-center justify-center overflow-hidden`}>
        <div className="text-6xl opacity-25">{n.emoji}</div>
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-mono font-bold ${n.trend === 'up' ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'}`}>
            {n.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {n.trend === 'up' ? '+' : ''}{n.trendPct}%
          </span>
        </div>
        <div className="absolute bottom-3 left-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white/70">{n.lga}</span></div>
        <div className="absolute bottom-3 right-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white/70">{n.propertyCount} listings</span></div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-medium text-obsidian-900 mb-0.5 group-hover:text-gold-600 transition-colors">{n.name}</h3>
        <p className="text-xs text-obsidian-400 italic mb-3">{n.character}</p>
        <div className="space-y-2 mb-3">
          <ScoreBar score={n.safetyScore} label="Safety" icon={Shield} color="text-emerald-500" />
          <ScoreBar score={n.infrastructureScore} label="Infrastructure" icon={Zap} color="text-blue-500" />
          <ScoreBar score={n.schoolScore} label="Schools" icon={GraduationCap} color="text-purple-500" />
          <ScoreBar score={n.floodRiskScore} label="Flood Safety" icon={Droplets} color="text-cyan-500" />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3 py-3 border-y border-surface-border text-center">
          <div>
            <div className="font-display text-base font-medium text-gold-600">{fmt(n.avgRent1br)}</div>
            <div className="text-[10px] text-obsidian-400">1-bed/yr</div>
          </div>
          <div>
            <div className="font-display text-base font-medium text-obsidian-700">{fmt(n.avgBuyPrice)}</div>
            <div className="text-[10px] text-obsidian-400">avg buy</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {n.highlights.slice(0, 3).map((h, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">{h}</span>)}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-gold-600 hover:text-gold-500 mb-2 flex items-center gap-1">
          {expanded ? <><ChevronUp className="w-3 h-3" />Less</> : <><ChevronDown className="w-3 h-3" />More info</>}
        </button>
        {expanded && (
          <div className="mb-3 space-y-1.5 text-xs text-obsidian-500">
            <p className="leading-relaxed">{n.description}</p>
            <p><span className="font-medium text-obsidian-700">Schools: </span>{n.nearbySchools.join(', ')}</p>
            <p><span className="font-medium text-obsidian-700">Hospitals: </span>{n.nearbyHospitals.join(', ')}</p>
            <p><span className="font-medium text-obsidian-700">Landmarks: </span>{n.nearbyLandmarks.join(', ')}</p>
          </div>
        )}
        <Link href={`/neighborhoods/${n.slug}`} className="btn-primary btn-sm w-full justify-center">
          Explore {n.name} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default function NeighborhoodsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLga, setSelectedLga] = useState('all')
  const [lifestyle, setLifestyle] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState<typeof budgetFilters[0] | null>(null)
  const [sortBy, setSortBy] = useState('default')
  const [view, setView] = useState<'grid' | 'list' | 'compare'>('grid')
  const [minSafety, setMinSafety] = useState(0)

  const filtered = useMemo(() => {
    let r = neighborhoods.filter(n => {
      if (searchQuery && !n.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !n.lga.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !n.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !n.character.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (selectedLga !== 'all' && n.lga !== selectedLga) return false
      if (budgetFilter && n.avgRent1br > budgetFilter.max) return false
      if (minSafety > 0 && n.safetyScore < minSafety) return false
      if (lifestyle !== 'all') {
        const lf = lifestyleFilters.find(l => l.value === lifestyle)
        if (lf?.keywords) {
          const text = `${n.character} ${n.description}`.toLowerCase()
          if (!lf.keywords.some(kw => text.includes(kw))) return false
        }
      }
      return true
    })
    switch (sortBy) {
      case 'trend_desc': r = [...r].sort((a, b) => b.trendPct - a.trendPct); break
      case 'safety_desc': r = [...r].sort((a, b) => b.safetyScore - a.safetyScore); break
      case 'price_asc': r = [...r].sort((a, b) => a.avgRent1br - b.avgRent1br); break
      case 'price_desc': r = [...r].sort((a, b) => b.avgRent1br - a.avgRent1br); break
      case 'listings_desc': r = [...r].sort((a, b) => b.propertyCount - a.propertyCount); break
      case 'infra_desc': r = [...r].sort((a, b) => b.infrastructureScore - a.infrastructureScore); break
    }
    return r
  }, [searchQuery, selectedLga, lifestyle, budgetFilter, sortBy, minSafety])

  const activeFilters = [selectedLga !== 'all', lifestyle !== 'all', budgetFilter !== null, minSafety > 0].filter(Boolean).length
  const clearAll = () => { setSelectedLga('all'); setLifestyle('all'); setBudgetFilter(null); setMinSafety(0); setSearchQuery('') }

  const totalListings = neighborhoods.reduce((s, n) => s + n.propertyCount, 0)
  const fastestGrowing = [...neighborhoods].sort((a, b) => b.trendPct - a.trendPct)[0]
  const safest = [...neighborhoods].sort((a, b) => b.safetyScore - a.safetyScore)[0]
  const mostAffordable = [...neighborhoods].sort((a, b) => a.avgRent1br - b.avgRent1br)[0]

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* HERO */}
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/8 blur-[120px]" />
        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">{neighborhoods.length} Neighbourhoods · Port Harcourt & Rivers State</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.92] tracking-tight mb-6">
              Know Your<br /><span className="gold-text">Neighbourhood</span><br /><span className="text-white/40">Before You Move</span>
            </h1>
            <p className="text-white/40 text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Data-driven safety, infrastructure, school, and flood risk scores across every major area in Port Harcourt and Rivers State.
            </p>
            <div className="card p-2 flex gap-2 max-w-3xl mx-auto shadow-gold-lg mb-5">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0" />
                <input className="flex-1 bg-transparent text-obsidian-900 placeholder-obsidian-300 outline-none text-sm"
                  placeholder="Search neighbourhood, LGA, or lifestyle keyword..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-obsidian-300" /></button>}
              </div>
              <select className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none"
                value={selectedLga} onChange={e => setSelectedLga(e.target.value)}>
                <option value="all">All LGAs</option>
                {lgaList.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <button className="btn-primary px-6 flex-shrink-0"><Search className="w-4 h-4" />Search</button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {lifestyleFilters.map(l => (
                <button key={l.value} onClick={() => setLifestyle(l.value)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${lifestyle === l.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/50 border-white/15 hover:bg-white/15'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Neighbourhoods', value: neighborhoods.length.toString(), sub: 'PH & Rivers State' },
              { label: 'Total Listings', value: totalListings.toLocaleString(), sub: 'Across all areas' },
              { label: 'Fastest Growing', value: fastestGrowing.name, sub: `+${fastestGrowing.trendPct}% this year` },
              { label: 'Most Affordable', value: mostAffordable.name, sub: `From ${fmt(mostAffordable.avgRent1br)}/yr` },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="font-display text-xl font-light text-gold-400 mb-1">{s.value}</div>
                <div className="text-xs text-white/50 font-medium">{s.label}</div>
                <div className="text-[10px] text-white/25 mt-0.5">{s.sub}</div>
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

      {/* SCORE LEGEND */}
      <section className="py-5 bg-white border-b border-surface-border">
        <div className="page-container">
          <div className="flex flex-wrap items-center gap-6 justify-center">
            <span className="text-xs font-medium text-obsidian-500">Score Guide:</span>
            {[{r:'80–100',l:'Excellent',c:'bg-emerald-500'},{r:'65–79',l:'Good',c:'bg-amber-500'},{r:'Below 65',l:'Average',c:'bg-rose-500'}].map((g,i)=>(
              <div key={i} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${g.c}`}/><span className="text-xs text-obsidian-600"><strong>{g.r}:</strong> {g.l}</span></div>
            ))}
            <span className="text-xs text-obsidian-400">|</span>
            {[{icon:Shield,label:'Safety',color:'text-emerald-500'},{icon:Zap,label:'Infrastructure',color:'text-blue-500'},{icon:GraduationCap,label:'Schools',color:'text-purple-500'},{icon:Droplets,label:'Flood Safety',color:'text-cyan-500'}].map((s,i)=>(
              <div key={i} className="flex items-center gap-1.5"><s.icon className={`w-3.5 h-3.5 ${s.color}`}/><span className="text-xs text-obsidian-500">{s.label}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-medium text-obsidian-900 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-gold-500"/>Filters</h3>
                    {activeFilters > 0 && <button onClick={clearAll} className="text-xs text-gold-600 font-medium">Clear ({activeFilters})</button>}
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="input-label">Local Government Area</label>
                      <select className="input-field text-sm" value={selectedLga} onChange={e => setSelectedLga(e.target.value)}>
                        <option value="all">All LGAs</option>
                        {lgaList.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Lifestyle Match</label>
                      <div className="space-y-1">
                        {lifestyleFilters.map(l => (
                          <button key={l.value} onClick={() => setLifestyle(l.value)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs border transition-all ${lifestyle === l.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {l.label}{lifestyle === l.value && <CheckCircle2 className="w-3.5 h-3.5 inline ml-1"/>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Budget (1-bed rent/yr)</label>
                      <div className="space-y-1.5">
                        {budgetFilters.map((b, i) => (
                          <button key={i} onClick={() => setBudgetFilter(budgetFilter === b ? null : b)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-all ${budgetFilter === b ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {b.label}{budgetFilter === b && <CheckCircle2 className="w-3.5 h-3.5"/>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Min Safety Score: <span className="text-gold-600 font-mono">{minSafety || 'Any'}</span></label>
                      <input type="range" min={0} max={100} step={10} value={minSafety} onChange={e => setMinSafety(Number(e.target.value))} className="w-full accent-gold-500"/>
                      <div className="flex justify-between text-[10px] text-obsidian-400 mt-1"><span>0</span><span>50</span><span>100</span></div>
                    </div>
                  </div>
                </div>

                <div className="card p-5">
                  <h3 className="font-display text-base font-medium text-obsidian-900 mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-gold-500"/>Top Picks</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Safest', name: safest.name, val: `${safest.safetyScore}/100`, slug: safest.slug, color: 'text-emerald-500' },
                      { label: 'Fastest Growing', name: fastestGrowing.name, val: `+${fastestGrowing.trendPct}%`, slug: fastestGrowing.slug, color: 'text-blue-500' },
                      { label: 'Most Affordable', name: mostAffordable.name, val: fmt(mostAffordable.avgRent1br), slug: mostAffordable.slug, color: 'text-purple-500' },
                    ].map((p, i) => (
                      <Link key={i} href={`/neighborhoods/${p.slug}`} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0 hover:text-gold-600 transition-colors group">
                        <div>
                          <div className="text-[10px] text-obsidian-400 uppercase tracking-wider">{p.label}</div>
                          <div className="font-medium text-obsidian-900 text-sm group-hover:text-gold-600">{p.name}</div>
                        </div>
                        <span className={`font-mono text-xs font-bold ${p.color}`}>{p.val}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30"/>
                  <div className="relative z-10 text-center">
                    <div className="text-3xl mb-3">🧭</div>
                    <h3 className="font-display text-base font-medium text-white mb-2">Not Sure Where to Live?</h3>
                    <p className="text-white/40 text-xs leading-relaxed mb-4">Tell us your priorities and we will match you to the right neighbourhood.</p>
                    <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm w-full justify-center">Get Matched</a>
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS */}
            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-obsidian-900">{filtered.length} Neighbourhood{filtered.length !== 1 ? 's' : ''}</h2>
                  <p className="text-sm text-obsidian-400 mt-0.5">{selectedLga !== 'all' ? selectedLga : 'All areas'} · Rivers State{activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="input-field text-sm py-2" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div className="flex rounded-xl border border-surface-border overflow-hidden">
                    {[{v:'grid',icon:'⊞'},{v:'list',icon:'☰'},{v:'compare',icon:'⊟'}].map(btn => (
                      <button key={btn.v} onClick={() => setView(btn.v as any)}
                        className={`px-3 py-2 text-sm transition-colors ${view === btn.v ? 'bg-obsidian-900 text-white' : 'bg-white text-obsidian-400 hover:bg-surface-subtle'}`}>
                        {btn.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeFilters > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedLga !== 'all' && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">{selectedLga}<button onClick={() => setSelectedLga('all')}><X className="w-3 h-3 ml-1"/></button></span>}
                  {lifestyle !== 'all' && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">{lifestyleFilters.find(l=>l.value===lifestyle)?.label}<button onClick={() => setLifestyle('all')}><X className="w-3 h-3 ml-1"/></button></span>}
                  {budgetFilter && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">{budgetFilter.label}<button onClick={() => setBudgetFilter(null)}><X className="w-3 h-3 ml-1"/></button></span>}
                  {minSafety > 0 && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">Safety ≥ {minSafety}<button onClick={() => setMinSafety(0)}><X className="w-3 h-3 ml-1"/></button></span>}
                </div>
              )}

              {/* COMPARE TABLE */}
              {view === 'compare' && filtered.length > 0 && (
                <div className="card overflow-hidden">
                  <div className="p-4 border-b border-surface-border flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-gold-500"/><h3 className="font-display text-base font-medium text-obsidian-900">Side-by-Side Comparison</h3>
                    <span className="text-xs text-obsidian-400">Showing top {Math.min(filtered.length, 12)} results</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-obsidian-900">
                          <th className="text-left py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Area</th>
                          <th className="text-right py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">1-Bed/yr</th>
                          <th className="text-right py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Buy Price</th>
                          <th className="text-center py-3 px-3 font-mono text-xs text-emerald-600 uppercase tracking-wider">Safety</th>
                          <th className="text-center py-3 px-3 font-mono text-xs text-blue-600 uppercase tracking-wider">Infra</th>
                          <th className="text-center py-3 px-3 font-mono text-xs text-purple-600 uppercase tracking-wider">Schools</th>
                          <th className="text-right py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.slice(0,12).map((n, i) => (
                          <tr key={n.id} className={`border-b border-surface-border hover:bg-gold-50/30 ${i % 2 === 0 ? 'bg-surface-subtle/30' : 'bg-white'}`}>
                            <td className="py-3 px-3">
                              <Link href={`/neighborhoods/${n.slug}`} className="flex items-center gap-2 hover:text-gold-600">
                                <span className="text-lg">{n.emoji}</span>
                                <div><div className="font-medium text-obsidian-900 text-sm">{n.name}</div><div className="text-[10px] text-obsidian-400">{n.lga}</div></div>
                              </Link>
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-xs text-gold-600 font-medium">{fmt(n.avgRent1br)}</td>
                            <td className="py-3 px-3 text-right font-mono text-xs text-obsidian-600">{fmt(n.avgBuyPrice)}</td>
                            <td className="py-3 px-3 text-center"><span className={`font-mono text-xs font-bold ${n.safetyScore >= 80 ? 'text-emerald-600' : n.safetyScore >= 65 ? 'text-amber-600' : 'text-rose-600'}`}>{n.safetyScore}</span></td>
                            <td className="py-3 px-3 text-center"><span className={`font-mono text-xs font-bold ${n.infrastructureScore >= 80 ? 'text-emerald-600' : n.infrastructureScore >= 65 ? 'text-amber-600' : 'text-rose-600'}`}>{n.infrastructureScore}</span></td>
                            <td className="py-3 px-3 text-center"><span className={`font-mono text-xs font-bold ${n.schoolScore >= 80 ? 'text-emerald-600' : n.schoolScore >= 65 ? 'text-amber-600' : 'text-rose-600'}`}>{n.schoolScore}</span></td>
                            <td className="py-3 px-3 text-right"><span className={`flex items-center justify-end gap-1 font-mono text-xs font-bold ${n.trend === 'up' ? 'text-emerald-500' : 'text-obsidian-400'}`}>{n.trend === 'up' ? <TrendingUp className="w-3 h-3"/> : <Minus className="w-3 h-3"/>}{n.trend === 'up' ? '+' : ''}{n.trendPct}%</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {view !== 'compare' && (
                filtered.length > 0 ? (
                  <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-4'}>
                    {filtered.map(n => <NeighborhoodCard key={n.id} n={n} view={view} />)}
                  </div>
                ) : (
                  <div className="text-center py-20 card">
                    <div className="text-5xl mb-4">🗺</div>
                    <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No neighbourhoods found</h3>
                    <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">Try adjusting your filters.</p>
                    <button onClick={clearAll} className="btn-primary">Clear Filters</button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LGA GRID */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">By Local Government</span>
            <h2 className="section-title">Explore by LGA</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lgaList.map(lga => {
              const lgaHoods = neighborhoods.filter(n => n.lga === lga)
              const avgRent = Math.round(lgaHoods.reduce((s, n) => s + n.avgRent1br, 0) / lgaHoods.length)
              const totalProps = lgaHoods.reduce((s, n) => s + n.propertyCount, 0)
              const avgSafety = Math.round(lgaHoods.reduce((s, n) => s + n.safetyScore, 0) / lgaHoods.length)
              return (
                <div key={lga} className="card p-5 hover:border-gold-300 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg font-medium text-obsidian-900">{lga} LGA</h3>
                      <p className="text-xs text-obsidian-400">{lgaHoods.length} neighbourhood{lgaHoods.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg text-gold-600">{fmt(avgRent)}</div>
                      <div className="text-[10px] text-obsidian-400">avg 1-bed/yr</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {lgaHoods.map(n => (
                      <Link key={n.id} href={`/neighborhoods/${n.slug}`}
                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-surface-subtle text-obsidian-600 border border-surface-border hover:border-gold-300 hover:text-gold-600 transition-colors">
                        {n.emoji} {n.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-surface-border text-xs text-obsidian-400">
                    <span>{totalProps.toLocaleString()} listings</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500"/>Avg safety: {avgSafety}/100</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40"/>
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-5">Found Your Area?<br /><span className="gold-text">Start Searching</span></h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">Browse verified listings in your chosen neighbourhood — filtered, sorted, and ready to explore.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rent" className="btn-primary btn-lg">Browse Rentals <ArrowRight className="w-5 h-5"/></Link>
            <Link href="/buy" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">Browse Sales</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
