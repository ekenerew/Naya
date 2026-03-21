'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, Star, MapPin, Shield, Award, CheckCircle2,
  Phone, MessageCircle, Filter, X, Loader2, Users,
  ChevronRight, ArrowRight, Plus, RefreshCw, Building2
} from 'lucide-react'

type Agent = {
  id: string; agencyName?: string; plan: string; badge: string
  rsspcNumber?: string; rsspcStatus: string; avgRating: number
  reviewCount: number; totalListings: number; activeListings: number
  totalSales: number; yearsActive: number; responseRatePct: number
  neighborhoods: string[]; specializations: string[]; whatsapp?: string
  user: { firstName: string; lastName: string; avatarUrl?: string; email: string; phone?: string }
}

const badgeConfig: Record<string,{ label:string; color:string; bg:string }> = {
  PLATINUM:  { label:'Platinum',  color:'text-gold-700',    bg:'bg-gold-100 border-gold-200' },
  TOP_AGENT: { label:'Top Agent', color:'text-blue-700',    bg:'bg-blue-100 border-blue-200' },
  VERIFIED:  { label:'Verified',  color:'text-emerald-700', bg:'bg-emerald-100 border-emerald-200' },
  NONE:      { label:'Agent',     color:'text-obsidian-600', bg:'bg-obsidian-100 border-obsidian-200' },
}

function AgentCard({ agent }: { agent: Agent }) {
  const badge = badgeConfig[agent.badge] || badgeConfig.NONE
  const initials = `${agent.user.firstName[0]}${agent.user.lastName[0]}`.toUpperCase()
  const whatsappUrl = agent.whatsapp ? `https://wa.me/${agent.whatsapp.replace(/\D/g,'')}` : null

  return (
    <div className="card p-5 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {agent.user.avatarUrl
            ? <img src={agent.user.avatarUrl} alt={agent.user.firstName} className="w-16 h-16 rounded-2xl object-cover" />
            : <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-obsidian-900 text-xl font-bold">{initials}</div>
          }
          {agent.rsspcStatus === 'VERIFIED' && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-obsidian-900 group-hover:text-gold-600 transition-colors">
                {agent.user.firstName} {agent.user.lastName}
              </h3>
              {agent.agencyName && (
                <p className="text-xs text-obsidian-400 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />{agent.agencyName}
                </p>
              )}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex-shrink-0 ${badge.bg} ${badge.color}`}>
              {badge.label}
            </span>
          </div>

          {/* Rating */}
          {agent.reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i<=Math.round(agent.avgRating)?'fill-gold-500 text-gold-500':'text-obsidian-200'}`} />
                ))}
              </div>
              <span className="text-xs font-semibold text-obsidian-900">{agent.avgRating.toFixed(1)}</span>
              <span className="text-xs text-obsidian-400">({agent.reviewCount} reviews)</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 py-3 border-y border-surface-border mb-4">
        {[
          { label:'Listings', value: agent.activeListings || agent.totalListings },
          { label:'Sales',    value: agent.totalSales },
          { label:'Years',    value: agent.yearsActive || '—' },
        ].map((s,i) => (
          <div key={i} className="text-center">
            <p className="font-display text-lg font-medium text-obsidian-900">{s.value}</p>
            <p className="text-[10px] text-obsidian-400 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Areas */}
      {agent.neighborhoods?.length > 0 && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          <MapPin className="w-3 h-3 text-obsidian-400 flex-shrink-0" />
          {agent.neighborhoods.slice(0,3).map((n,i) => (
            <span key={i} className="text-xs text-obsidian-500">{n}{i < Math.min(2, agent.neighborhoods.length-1) ? ',' : ''}</span>
          ))}
          {agent.neighborhoods.length > 3 && <span className="text-xs text-obsidian-400">+{agent.neighborhoods.length-3} more</span>}
        </div>
      )}

      {/* RSSPC */}
      {agent.rsspcStatus === 'VERIFIED' && agent.rsspcNumber && (
        <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
          <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs text-emerald-700 font-medium">RSSPC {agent.rsspcNumber}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/agents/${agent.id}`} className="flex-1 btn-secondary justify-center btn-sm gap-1">
          View Profile <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        {whatsappUrl ? (
          <a href={whatsappUrl} target="_blank"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-semibold transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />WhatsApp
          </a>
        ) : agent.user.phone ? (
          <a href={`tel:${agent.user.phone}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-xl text-xs font-semibold transition-colors">
            <Phone className="w-3.5 h-3.5" />Call
          </a>
        ) : null}
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [badge, setBadge] = useState('')
  const [sort, setSort] = useState('rating')

  const fetchAgents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ sort, limit: '24' })
      if (search) params.set('q', search)
      if (badge) params.set('badge', badge)
      const res = await fetch(`/api/agents?${params}`)
      const json = await res.json()
      setAgents(json.data?.data || [])
      setTotal(json.data?.pagination?.total || 0)
    } catch { setAgents([]) }
    finally { setLoading(false) }
  }, [search, badge, sort])

  useEffect(() => { fetchAgents() }, [fetchAgents])

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero */}
      <section className="bg-obsidian-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
        <div className="page-container relative z-10 text-center">
          <span className="section-number">Find Your Agent</span>
          <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
            RSSPC-Verified Agents<br /><span className="gold-text">You Can Trust</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Every agent on Naya is verified against the official Rivers State Real Estate Practitioners Council register.
          </p>
        </div>
      </section>

      <div className="page-container py-8">
        {/* Search & filter bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
            <input className="input-field pl-10 text-sm" placeholder="Search agents or agencies..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field text-sm md:w-40" value={badge} onChange={e => setBadge(e.target.value)}>
            <option value="">All Badges</option>
            <option value="PLATINUM">Platinum</option>
            <option value="TOP_AGENT">Top Agent</option>
            <option value="VERIFIED">Verified</option>
          </select>
          <select className="input-field text-sm md:w-44" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="rating">Highest Rated</option>
            <option value="listings">Most Listings</option>
            <option value="sales">Most Sales</option>
            <option value="experience">Most Experienced</option>
          </select>
          <button onClick={fetchAgents} className="btn-secondary gap-2 flex-shrink-0">
            <RefreshCw className="w-4 h-4" />Refresh
          </button>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-obsidian-500 text-sm mb-6">
            {total > 0 ? `${total} verified agent${total>1?'s':''} in Port Harcourt` : 'No agents found'}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-subtle" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-subtle rounded w-3/4" />
                    <div className="h-3 bg-surface-subtle rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-surface-subtle rounded-xl mb-4" />
                <div className="h-9 bg-surface-subtle rounded-xl" />
              </div>
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-surface-subtle flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-obsidian-300" />
            </div>
            <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No agents yet</h3>
            <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">
              Be the first verified agent on Naya in Port Harcourt.
            </p>
            <Link href="/register" className="btn-primary gap-2 inline-flex">
              <Plus className="w-4 h-4" />Join as an Agent
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        )}

        {/* Join CTA */}
        <div className="mt-16 bg-obsidian-900 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
          <div className="relative z-10">
            <Award className="w-12 h-12 text-gold-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-light text-white mb-3">Are you an RSSPC agent?</h2>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              Join Naya, get verified, and start reaching thousands of buyers and renters in Port Harcourt every month.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/register" className="btn-primary gap-2">Join as Agent <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/portal/profile" className="btn-ghost text-white/70 border-white/20 gap-2">
                <Shield className="w-4 h-4" />Get Verified
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
