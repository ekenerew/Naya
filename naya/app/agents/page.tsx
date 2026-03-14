'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Star, MapPin, Shield, MessageCircle, Phone, X, TrendingUp, ArrowRight, SlidersHorizontal, CheckCircle2 } from 'lucide-react'
import { agents } from '@/lib/data'
import type { Agent } from '@/lib/types'

const badgeConfig: Record<string, { label: string; icon: string; color: string }> = {
  platinum:  { label: 'Platinum',  icon: '💎', color: 'text-gold-700 bg-gold-50 border-gold-300' },
  top_agent: { label: 'Top Agent', icon: '🏆', color: 'text-amber-700 bg-amber-50 border-amber-300' },
  verified:  { label: 'Verified',  icon: '✓',  color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
  none:      { label: '', icon: '', color: '' },
}
const areaList = ['All Areas', 'GRA Phase 2', 'Old GRA', 'Trans Amadi', 'Rumuola', 'Woji', 'Eleme', 'Bonny Island']
const sortOptions = [{ value: 'rating', label: 'Highest Rated' }, { value: 'reviews', label: 'Most Reviewed' }, { value: 'listings', label: 'Most Listings' }, { value: 'experience', label: 'Most Experienced' }]
const avatarGradients = ['from-gold-500 to-gold-300', 'from-emerald-500 to-teal-400', 'from-violet-500 to-purple-400', 'from-rose-500 to-pink-400', 'from-blue-500 to-cyan-400', 'from-amber-500 to-orange-400']

function Stars({ r }: { r: number }) {
  return <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} className={`w-3.5 h-3.5 ${i<Math.floor(r)?'fill-gold-400 text-gold-400':'text-obsidian-200'}`}/>)}</div>
}

function AgentCard({ agent }: { agent: Agent }) {
  const badge = badgeConfig[agent.badge]
  const g = avatarGradients[agent.id.charCodeAt(1) % avatarGradients.length]
  return (
    <div className="card overflow-hidden hover:border-gold-300 transition-all group">
      <div className="relative h-20 bg-gradient-to-br from-obsidian-900 to-zinc-900">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20"/>
        {badge.label && <div className="absolute top-3 right-3"><span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${badge.color}`}>{badge.icon} {badge.label}</span></div>}
        {agent.isVerified && <div className="absolute top-3 left-3"><span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><Shield className="w-2.5 h-2.5"/>RSSPC Verified</span></div>}
      </div>
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center text-xl font-display font-medium text-obsidian-900 border-2 border-white shadow-lg`}>{agent.initials}</div>
          <div className="flex gap-2 mt-2">
            <a href={`tel:${agent.phone}`} className="w-8 h-8 rounded-xl border border-surface-border flex items-center justify-center hover:border-gold-300 transition-colors"><Phone className="w-3.5 h-3.5 text-obsidian-500"/></a>
            <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors"><MessageCircle className="w-3.5 h-3.5 text-white"/></a>
          </div>
        </div>
        <Link href={`/agents/${agent.username}`}><h3 className="font-display text-lg font-medium text-obsidian-900 group-hover:text-gold-600 transition-colors leading-tight">{agent.name}</h3></Link>
        <p className="text-xs text-obsidian-400 mb-3">{agent.agencyName}</p>
        <div className="flex items-center gap-2 mb-4"><Stars r={agent.rating}/><span className="font-mono text-sm font-bold text-obsidian-900">{agent.rating}</span><span className="text-xs text-obsidian-400">({agent.reviewCount})</span></div>
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-surface-border mb-4 text-center">
          <div><div className="font-mono text-base font-bold text-gold-600">{agent.totalListings}</div><div className="text-[10px] text-obsidian-400">Listings</div></div>
          <div><div className="font-mono text-base font-bold text-obsidian-900">{agent.totalSales}</div><div className="text-[10px] text-obsidian-400">Sold</div></div>
          <div><div className="font-mono text-base font-bold text-obsidian-900">{agent.yearsActive}yr</div><div className="text-[10px] text-obsidian-400">Active</div></div>
        </div>
        <div className="flex items-start gap-1.5 mb-3">
          <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0 mt-0.5"/>
          <div className="flex flex-wrap gap-1">{agent.neighborhoods.slice(0,3).map(n=><span key={n} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">{n}</span>)}</div>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">{agent.specializations.slice(0,3).map(s=><span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-obsidian-900/5 text-obsidian-600 border border-obsidian-900/10">{s}</span>)}</div>
        <Link href={`/agents/${agent.username}`} className="btn-primary w-full justify-center btn-sm">View Profile <ArrowRight className="w-3.5 h-3.5"/></Link>
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const [q, setQ] = useState('')
  const [area, setArea] = useState('All Areas')
  const [badge, setBadge] = useState('All')
  const [sortBy, setSortBy] = useState('rating')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filtered = useMemo(() => {
    let r = agents.filter(a => {
      if (q && !a.name.toLowerCase().includes(q.toLowerCase()) && !a.agencyName.toLowerCase().includes(q.toLowerCase())) return false
      if (area !== 'All Areas' && !a.neighborhoods.includes(area)) return false
      if (badge === 'Platinum' && a.badge !== 'platinum') return false
      if (badge === 'Top Agent' && a.badge !== 'top_agent') return false
      if (badge === 'Verified' && !a.isVerified) return false
      if (verifiedOnly && !a.isVerified) return false
      return true
    })
    if (sortBy === 'reviews') r = [...r].sort((a,b) => b.reviewCount - a.reviewCount)
    else if (sortBy === 'listings') r = [...r].sort((a,b) => b.totalListings - a.totalListings)
    else if (sortBy === 'experience') r = [...r].sort((a,b) => b.yearsActive - a.yearsActive)
    else r = [...r].sort((a,b) => b.rating - a.rating)
    return r
  }, [q, area, badge, sortBy, verifiedOnly])

  const clearAll = () => { setQ(''); setArea('All Areas'); setBadge('All'); setVerifiedOnly(false) }
  const activeFilters = [q, area !== 'All Areas', badge !== 'All', verifiedOnly].filter(Boolean).length

  return (
    <div className="min-h-screen bg-surface-bg">
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40"/>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[120px]"/>
        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <Shield className="w-3.5 h-3.5 text-gold-400"/>
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">{agents.length} RSSPC-Verified Agents · Port Harcourt</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-5">Find a Trusted<br/><span className="gold-text">Property Agent</span></h1>
            <p className="text-white/40 text-lg font-light max-w-xl mx-auto mb-8">Every agent on Naya is RSSPC-certified, identity-verified, and reviewed by real clients.</p>
            <div className="card p-2 flex gap-2 max-w-2xl mx-auto shadow-gold-lg">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0"/>
                <input className="flex-1 bg-transparent text-obsidian-900 placeholder-obsidian-300 outline-none text-sm" placeholder="Search by name or agency..." value={q} onChange={e => setQ(e.target.value)}/>
                {q && <button onClick={() => setQ('')}><X className="w-4 h-4 text-obsidian-300"/></button>}
              </div>
              <select className="hidden md:block bg-surface-subtle border border-surface-border rounded-xl px-4 py-2 text-sm text-obsidian-600 outline-none" value={area} onChange={e => setArea(e.target.value)}>
                {areaList.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <button className="btn-primary px-5 flex-shrink-0">Search</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: agents.length.toString(), label: 'Active Agents' },
              { value: `${agents.reduce((s,a) => s+a.totalListings, 0)}+`, label: 'Total Listings' },
              { value: `${agents.reduce((s,a) => s+a.totalSales, 0)}+`, label: 'Properties Sold' },
              { value: `${(agents.reduce((s,a) => s+a.rating, 0)/agents.length).toFixed(1)}★`, label: 'Avg Rating' },
            ].map((s,i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="font-display text-2xl font-light text-gold-400">{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/></svg></div>
      </section>

      <section className="section-padding">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-medium text-obsidian-900 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-gold-500"/>Filters</h3>
                    {activeFilters > 0 && <button onClick={clearAll} className="text-xs text-gold-600 font-medium">Clear ({activeFilters})</button>}
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="input-label">Area</label>
                      <select className="input-field text-sm" value={area} onChange={e => setArea(e.target.value)}>{areaList.map(a => <option key={a} value={a}>{a}</option>)}</select>
                    </div>
                    <div>
                      <label className="input-label">Badge Level</label>
                      <div className="space-y-1.5">
                        {[{v:'All',l:'All Agents'},{v:'Platinum',l:'💎 Platinum'},{v:'Top Agent',l:'🏆 Top Agent'},{v:'Verified',l:'✓ Verified'}].map(b => (
                          <button key={b.v} onClick={() => setBadge(b.v)} className={`w-full text-left px-3 py-2 rounded-xl text-xs border transition-all ${badge === b.v ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-600 border-surface-border hover:border-gold-300'}`}>{b.l}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                      <span className="text-sm text-obsidian-600">RSSPC Only</span>
                      <div onClick={() => setVerifiedOnly(!verifiedOnly)} className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${verifiedOnly ? 'bg-gold-500' : 'bg-obsidian-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-1'}`}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30"/>
                  <div className="relative z-10 text-center">
                    <div className="text-3xl mb-3">🏠</div>
                    <h3 className="font-display text-base font-medium text-white mb-2">Are You an Agent?</h3>
                    <p className="text-white/40 text-xs mb-4">Join Naya and connect with thousands of property seekers.</p>
                    <Link href="/portal" className="btn-primary btn-sm w-full justify-center">Join as Agent</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-obsidian-900">{filtered.length} Agents Available</h2>
                  <p className="text-sm text-obsidian-400 mt-0.5">{area !== 'All Areas' ? area : 'All areas'} · Port Harcourt</p>
                </div>
                <select className="input-field text-sm py-2 max-w-44" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{filtered.map(a => <AgentCard key={a.id} agent={a}/>)}</div>
              ) : (
                <div className="text-center py-20 card"><div className="text-5xl mb-4">🔍</div><h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No agents found</h3><button onClick={clearAll} className="btn-primary">Clear Filters</button></div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40"/>
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-3xl text-white font-light mb-4">Can't Find the Right Agent?</h2>
          <p className="text-white/40 mb-6 max-w-md mx-auto text-sm">Tell us what you need and we'll match you with the best agent for your requirements.</p>
          <Link href="/contact" className="btn-primary btn-lg">Get Agent Matched <ArrowRight className="w-5 h-5"/></Link>
        </div>
      </section>
    </div>
  )
}
