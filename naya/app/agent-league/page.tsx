'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Award, Star, TrendingUp, Shield, MessageCircle, Trophy, Medal, Zap, RefreshCw, ChevronRight, Crown } from 'lucide-react'

type Agent = {
  id: string; rank: number; previousRank?: number
  agencyName?: string; plan: string; badge: string
  rsspcNumber?: string; rsspcStatus: string
  avgRating: number; reviewCount: number
  totalListings: number; activeListings: number
  totalSales: number; yearsActive: number
  responseRatePct: number; whatsapp?: string
  user: { firstName: string; lastName: string; avatarUrl?: string; phone?: string }
  score: number
}

const BADGE_CONFIG: Record<string,{ label:string; bg:string; text:string; icon:any }> = {
  PLATINUM:  { label:'Platinum',  bg:'bg-gold-100',    text:'text-gold-700',    icon:Crown },
  TOP_AGENT: { label:'Top Agent', bg:'bg-blue-100',    text:'text-blue-700',    icon:Trophy },
  VERIFIED:  { label:'Verified',  bg:'bg-emerald-100', text:'text-emerald-700', icon:Shield },
  NONE:      { label:'Member',    bg:'bg-obsidian-100',text:'text-obsidian-600', icon:Star },
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg"><Crown className="w-5 h-5 text-white" /></div>
  if (rank === 2) return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow"><Medal className="w-5 h-5 text-white" /></div>
  if (rank === 3) return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow"><Medal className="w-5 h-5 text-white" /></div>
  return <div className="w-10 h-10 rounded-full bg-surface-subtle border-2 border-surface-border flex items-center justify-center font-bold text-obsidian-600 text-sm">#{rank}</div>
}

function AgentRow({ agent, featured }: { agent: Agent; featured?: boolean }) {
  const badge = BADGE_CONFIG[agent.badge] || BADGE_CONFIG.NONE
  const initials = `${agent.user.firstName[0]}${agent.user.lastName[0]}`.toUpperCase()
  const whatsappUrl = agent.whatsapp ? `https://wa.me/${agent.whatsapp.replace(/\D/g,'')}` : null

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md ${featured ? 'bg-gradient-to-r from-gold-50 to-white border-2 border-gold-200' : 'bg-white border border-surface-border hover:border-obsidian-200'}`}>
      <RankBadge rank={agent.rank} />

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {agent.user.avatarUrl
          ? <img src={agent.user.avatarUrl} className="w-12 h-12 rounded-2xl object-cover" alt="" />
          : <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-obsidian-900">{initials}</div>
        }
        {agent.rsspcStatus === 'VERIFIED' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
            <Shield className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-obsidian-900 text-sm">{agent.user.firstName} {agent.user.lastName}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>{badge.label}</span>
          {featured && <span className="px-2 py-0.5 bg-gold-500 text-obsidian-900 text-[10px] font-bold rounded-full">👑 #1 THIS MONTH</span>}
        </div>
        {agent.agencyName && <p className="text-xs text-obsidian-400 truncate">{agent.agencyName}</p>}
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {agent.reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
              <span className="text-xs font-semibold text-obsidian-700">{agent.avgRating.toFixed(1)}</span>
              <span className="text-xs text-obsidian-400">({agent.reviewCount})</span>
            </div>
          )}
          <span className="text-xs text-obsidian-400">{agent.activeListings} listings</span>
          {agent.responseRatePct > 0 && <span className="text-xs text-emerald-600 font-medium">{agent.responseRatePct}% response rate</span>}
        </div>
      </div>

      {/* Score */}
      <div className="text-center flex-shrink-0 hidden md:block">
        <div className="text-2xl font-display font-bold text-obsidian-900">{agent.score}</div>
        <div className="text-[10px] text-obsidian-400 font-mono">SCORE</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank"
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-semibold transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />Chat
          </a>
        )}
        <Link href={`/agents/${agent.id}`}
          className="flex items-center gap-1 px-3 py-1.5 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-xl text-xs font-semibold transition-colors">
          View<ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default function AgentLeaguePage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'month'|'quarter'|'alltime'>('month')
  const [category, setCategory] = useState<'all'|'residential'|'commercial'|'shortlet'>('all')
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchAgents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/agents?sort=rating&limit=20`)
      const json = await res.json()
      const raw = json.data?.data || []

      // Calculate league score
      const scored: Agent[] = raw.map((a: any, i: number) => ({
        ...a,
        rank: i + 1,
        score: Math.round(
          (a.avgRating || 0) * 20 +
          (a.reviewCount || 0) * 2 +
          (a.activeListings || 0) * 5 +
          (a.totalSales || 0) * 10 +
          (a.responseRatePct || 0) * 0.5 +
          (a.rsspcStatus === 'VERIFIED' ? 30 : 0) +
          (a.badge === 'PLATINUM' ? 20 : a.badge === 'TOP_AGENT' ? 10 : 0)
        )
      })).sort((a: Agent, b: Agent) => b.score - a.score)
        .map((a: Agent, i: number) => ({ ...a, rank: i + 1 }))

      setAgents(scored)
      setLastUpdated(new Date().toLocaleDateString('en-NG', { day:'numeric', month:'long', year:'numeric' }))
    } catch { setAgents([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAgents() }, [fetchAgents])

  const topAgent = agents[0]

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero */}
      <section className="bg-obsidian-900 relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-[100px]" />
        <div className="page-container relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-sm font-semibold mb-6">
              <Trophy className="w-4 h-4" />Naya Agent League — Port Harcourt
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
              The Best Agents in<br /><span className="gold-text">Port Harcourt</span>
            </h1>
            <p className="text-white/50 mb-6">Live rankings updated monthly. Ranked by rating, deals closed, response rate, and RSSPC verification status.</p>
            <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
              <Zap className="w-3.5 h-3.5 text-gold-400" />
              Last updated: {lastUpdated || 'Today'}
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 podium */}
      {!loading && agents.length >= 3 && (
        <section className="bg-gradient-to-b from-obsidian-900 to-surface-bg py-8">
          <div className="page-container">
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {/* 2nd */}
              <div className="flex flex-col items-center pt-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-3">
                  {agents[1]?.user.firstName[0]}{agents[1]?.user.lastName[0]}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <p className="text-xs font-semibold text-obsidian-700 text-center">{agents[1]?.user.firstName}</p>
                <p className="text-[10px] text-obsidian-400">{agents[1]?.score} pts</p>
                <div className="h-16 w-full bg-gray-200 rounded-t-xl mt-2" />
              </div>
              {/* 1st */}
              <div className="flex flex-col items-center">
                <Crown className="w-6 h-6 text-gold-500 mb-2" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl mb-3">
                  {agents[0]?.user.firstName[0]}{agents[0]?.user.lastName[0]}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-2">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-bold text-obsidian-900 text-center">{agents[0]?.user.firstName}</p>
                <p className="text-xs text-gold-600 font-semibold">{agents[0]?.score} pts</p>
                <div className="h-24 w-full bg-gradient-to-t from-gold-300 to-gold-500 rounded-t-xl mt-2" />
              </div>
              {/* 3rd */}
              <div className="flex flex-col items-center pt-12">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xl font-bold text-white shadow mb-3">
                  {agents[2]?.user.firstName[0]}{agents[2]?.user.lastName[0]}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <p className="text-xs font-semibold text-obsidian-700 text-center">{agents[2]?.user.firstName}</p>
                <p className="text-[10px] text-obsidian-400">{agents[2]?.score} pts</p>
                <div className="h-10 w-full bg-amber-200 rounded-t-xl mt-2" />
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="page-container py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 p-1 bg-surface-subtle rounded-2xl">
            {(['month','quarter','alltime'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${period===p?'bg-white text-obsidian-900 shadow':'text-obsidian-500'}`}>
                {p === 'alltime' ? 'All Time' : p === 'quarter' ? 'This Quarter' : 'This Month'}
              </button>
            ))}
          </div>
          <button onClick={fetchAgents} className="flex items-center gap-2 text-sm text-obsidian-400 hover:text-obsidian-700 transition-colors">
            <RefreshCw className="w-4 h-4" />Refresh rankings
          </button>
        </div>

        {/* How scoring works */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gold-600" />
            <p className="text-sm font-semibold text-obsidian-900">How the League Score is Calculated</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label:'Client Rating', pts:'×20 pts', icon:'⭐' },
              { label:'Reviews',       pts:'×2 pts',  icon:'💬' },
              { label:'Active Listings',pts:'×5 pts', icon:'🏠' },
              { label:'Deals Closed',  pts:'×10 pts', icon:'🤝' },
              { label:'RSSPC Verified',pts:'+30 pts', icon:'🛡' },
            ].map((s,i) => (
              <div key={i} className="text-center p-2 bg-surface-subtle rounded-xl">
                <div className="text-xl mb-1">{s.icon}</div>
                <p className="text-[10px] font-semibold text-obsidian-700">{s.label}</p>
                <p className="text-[10px] text-gold-600 font-bold">{s.pts}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rankings list */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({length:5}).map((_,i) => (
              <div key={i} className="h-20 bg-surface-subtle rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-obsidian-200 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-2">League Starting Soon</h3>
            <p className="text-obsidian-400 text-sm mb-6">Be one of the first verified agents to join the Naya Agent League.</p>
            <Link href="/register" className="btn-primary gap-2 inline-flex">
              Join as Agent <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map((agent, i) => (
              <AgentRow key={agent.id} agent={agent} featured={i===0} />
            ))}
          </div>
        )}

        {/* Join CTA */}
        <div className="mt-12 bg-obsidian-900 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
          <div className="relative z-10">
            <Award className="w-12 h-12 text-gold-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-light text-white mb-3">Want to appear on this list?</h2>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              Complete RSSPC verification, build your listings, and collect reviews. The league updates every month.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/register" className="btn-primary gap-2">Join as Agent</Link>
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
