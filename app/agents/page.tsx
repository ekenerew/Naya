'use client'
import { useState } from 'react'
import { Search, Star, MapPin, ShieldCheck, MessageCircle, Phone, Filter } from 'lucide-react'
import Link from 'next/link'
import { agents } from '@/lib/data'
import clsx from 'clsx'

const plans = ['All', 'Platinum', 'Top Agent', 'Verified']
const areas = ['All Areas', 'GRA Phase 2', 'Old GRA', 'Trans Amadi', 'Rumuola', 'Woji', 'Eleme']
const avatarColors = ['from-gold-500 to-gold-300', 'from-emerald-500 to-teal-400', 'from-violet-500 to-purple-400', 'from-rose-500 to-pink-400', 'from-blue-500 to-cyan-400', 'from-amber-500 to-yellow-400']

export default function AgentsPage() {
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('All Areas')
  const [badge, setBadge] = useState('All')

  const filtered = agents.filter(a => {
    const matchQ = !query || a.name.toLowerCase().includes(query.toLowerCase()) || a.agencyName.toLowerCase().includes(query.toLowerCase())
    const matchA = area === 'All Areas' || a.neighborhoods.includes(area)
    const matchB = badge === 'All' || (badge === 'Platinum' && a.badge === 'platinum') || (badge === 'Top Agent' && a.badge === 'top_agent') || (badge === 'Verified' && a.isVerified)
    return matchQ && matchA && matchB
  })

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Header */}
      <div className="bg-obsidian-900 py-16">
        <div className="page-container text-center">
          <span className="section-number text-gold-500">Agent Directory</span>
          <h1 className="font-display text-4xl md:text-5xl text-white font-light mb-4">
            Find a <span className="gold-text">Verified Agent</span>
          </h1>
          <p className="text-white/40 text-lg font-light max-w-xl mx-auto">
            Every agent on Naya is RSSPC certified and background-checked. Find the right expert for your Port Harcourt property journey.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-surface-border sticky top-16 md:top-[68px] z-40">
        <div className="page-container py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-surface-subtle border border-surface-border rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search agents or agencies…"
                className="flex-1 bg-transparent text-obsidian-800 text-sm placeholder:text-obsidian-300 outline-none" />
            </div>
            <select value={area} onChange={e => setArea(e.target.value)} className="input-field w-auto">
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div className="flex gap-1">
              {plans.map(p => (
                <button key={p} onClick={() => setBadge(p)}
                  className={clsx('px-4 py-2 rounded-xl text-xs font-medium transition-all flex-shrink-0', badge===p ? 'bg-gold-500 text-obsidian-900' : 'bg-surface-subtle text-obsidian-500 hover:text-obsidian-800 border border-surface-border')}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <p className="text-sm text-obsidian-500 mb-6"><span className="font-semibold text-obsidian-800">{filtered.length}</span> agents found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((agent, idx) => {
            const colorIdx = agent.id.charCodeAt(1) % avatarColors.length
            return (
              <div key={agent.id} className="card p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColors[colorIdx]} flex items-center justify-center font-display text-2xl font-medium text-obsidian-900 flex-shrink-0`}>
                    {agent.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-obsidian-900 truncate">{agent.name}</h3>
                      {agent.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-obsidian-400 truncate">{agent.agencyName}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({length:5}).map((_,i) => <Star key={i} className={clsx('w-3 h-3', i<Math.floor(agent.rating)?'fill-gold-400 text-gold-400':'text-obsidian-200')}/>)}
                      </div>
                      <span className="font-mono text-xs text-obsidian-400">{agent.rating} ({agent.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Badge */}
                {agent.badge !== 'none' && (
                  <div className="mb-4">
                    <span className={clsx('badge', agent.badge === 'platinum' ? 'badge-gold' : agent.badge === 'top_agent' ? 'badge-gold' : 'badge-verify')}>
                      {agent.badge === 'platinum' ? '💎 Platinum Agent' : agent.badge === 'top_agent' ? '🏆 Top Agent' : '✓ Verified Agent'}
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  {[{v:agent.totalListings,l:'Listings'},{v:agent.totalSales,l:'Sales'},{v:agent.yearsActive+'yr',l:'Experience'}].map(s => (
                    <div key={s.l} className="bg-surface-subtle rounded-xl py-2">
                      <div className="font-mono text-sm font-semibold text-gold-600">{s.v}</div>
                      <div className="text-[10px] text-obsidian-400">{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Areas */}
                <div className="flex items-center gap-1.5 text-xs text-obsidian-400 mb-4">
                  <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0" />
                  {agent.neighborhoods.slice(0,2).join(' · ')}
                </div>

                {/* Specializations */}
                <div className="flex gap-1 flex-wrap mb-4">
                  {agent.specializations.slice(0,2).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">{s}</span>
                  ))}
                </div>

                {/* RSSPC */}
                <div className="flex items-center gap-2 p-2 bg-gold-50 border border-gold-100 rounded-lg mb-4 text-xs">
                  <span>🏛</span><span className="text-gold-700 font-mono">{agent.rsspcNumber}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/agents/${agent.username}`} className="btn-ghost btn-sm flex-1 justify-center text-xs">View Profile</Link>
                  <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm flex-1 justify-center">
                    <MessageCircle className="w-3.5 h-3.5"/>WhatsApp
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Become Agent CTA */}
      <section className="py-16 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-3xl text-white font-light mb-3">Are You a Property Agent in Port Harcourt?</h2>
          <p className="text-white/40 mb-6 max-w-xl mx-auto">Get RSSPC-verified on Naya and reach thousands of property seekers every month.</p>
          <Link href="/portal" className="btn-primary btn-lg">Join as Agent</Link>
        </div>
      </section>
    </div>
  )
}
