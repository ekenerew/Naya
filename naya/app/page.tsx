'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, ArrowRight, MapPin, Shield, Star, TrendingUp,
  Home, Building2, TreePine, Bed, Bath, Heart,
  CheckCircle2, Sparkles, Zap, Users, Award,
  ChevronRight, Eye, MessageCircle, Play
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
type Listing = {
  id: string; title: string; price: number; pricePeriod: string
  bedrooms: number; bathrooms: number; neighborhood: string
  listingType: string; isFeatured: boolean
  images: Array<{ url: string }>
  agent?: { avgRating: number; reviewCount: number; rsspcStatus: string }
}

type Agent = {
  id: string; agencyName?: string; badge: string; avgRating: number
  reviewCount: number; activeListings: number; rsspcStatus: string
  user: { firstName: string; lastName: string; avatarUrl?: string }
}

type Stats = { listings: number; agents: number; areas: number; users: number }

const fmt = (n: number) => n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n.toLocaleString()}`

const LISTING_TYPES = [
  { tab:'Rent',       type:'RENT',     icon:Home,      href:'/rent' },
  { tab:'Buy',        type:'SALE',     icon:Home,      href:'/buy' },
  { tab:'Shortlet',   type:'SHORTLET', icon:Building2, href:'/shortlet' },
  { tab:'Commercial', type:'LEASE',    icon:Building2, href:'/commercial' },
  { tab:'Land',       type:'LAND',     icon:TreePine,  href:'/land' },
]

const PH_AREAS = [
  { name:'GRA Phase 2', emoji:'👑', tag:'Premium',   desc:'PH\'s most prestigious address' },
  { name:'Woji',        emoji:'🌆', tag:'Growing',   desc:'Fast-growing, great value' },
  { name:'Trans Amadi', emoji:'🏭', tag:'Commercial',desc:'Business & industrial hub' },
  { name:'Old GRA',     emoji:'🏛', tag:'Established',desc:'Historic prestige area' },
  { name:'Eleme',       emoji:'⚡', tag:'Oil & Gas',  desc:'NLNG, refinery workers' },
  { name:'Peter Odili', emoji:'💎', tag:'Luxury',    desc:'Luxury corridor, fast growing' },
]

// ── Property Card ─────────────────────────────────────────────
function PropertyCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const periodLabel: Record<string,string> = { YEARLY:'/yr', MONTHLY:'/mo', PER_NIGHT:'/night', TOTAL:'' }

  return (
    <div className="card group overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link href={`/properties/${listing.id}`} className="block relative" style={{ aspectRatio:'4/3' }}>
        {listing.images[0]?.url && !imgErr ? (
          <img src={listing.images[0].url} alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-obsidian-800 to-obsidian-900 flex items-center justify-center">
            <Home className="w-10 h-10 text-white/20" />
          </div>
        )}
        {listing.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-gold-500 text-obsidian-900 text-[10px] font-black rounded-full">✦ FEATURED</span>
          </div>
        )}
        <button onClick={e => { e.preventDefault(); setSaved(p => !p) }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-110 transition-transform">
          <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : 'text-obsidian-500'}`} />
        </button>
        {listing.agent?.rsspcStatus === 'VERIFIED' && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-emerald-500 rounded-full text-white text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />VERIFIED
          </div>
        )}
      </Link>
      <div className="p-4">
        <p className="text-xs text-obsidian-400 flex items-center gap-1 mb-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />{listing.neighborhood}, Port Harcourt
        </p>
        <Link href={`/properties/${listing.id}`}>
          <h3 className="font-semibold text-obsidian-900 text-sm line-clamp-2 mb-2 group-hover:text-gold-600 transition-colors">
            {listing.title}
          </h3>
        </Link>
        <div className="flex items-center gap-3 text-xs text-obsidian-400 mb-3">
          {listing.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{listing.bedrooms}</span>}
          {listing.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{listing.bathrooms}</span>}
          <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold ${listing.listingType === 'RENT' ? 'bg-blue-50 text-blue-600' : listing.listingType === 'SALE' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
            {listing.listingType?.toLowerCase()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-xl font-semibold text-obsidian-900">{fmt(listing.price)}</span>
            {periodLabel[listing.pricePeriod] && <span className="text-obsidian-400 text-sm">{periodLabel[listing.pricePeriod]}</span>}
          </div>
          <Link href={`/properties/${listing.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-xl text-xs font-semibold transition-colors">
            <Eye className="w-3.5 h-3.5" />View
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Agent Card ────────────────────────────────────────────────
function AgentCard({ agent }: { agent: Agent }) {
  const initials = `${agent.user.firstName[0]}${agent.user.lastName[0]}`.toUpperCase()
  const badgeColors: Record<string,string> = {
    PLATINUM: 'bg-gold-100 text-gold-700', TOP_AGENT: 'bg-blue-100 text-blue-700',
    VERIFIED: 'bg-emerald-100 text-emerald-700', NONE: 'bg-obsidian-100 text-obsidian-600'
  }
  return (
    <Link href={`/agents/${agent.id}`}
      className="card p-5 flex items-start gap-4 hover:shadow-lg transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-obsidian-900 text-lg flex-shrink-0 relative">
        {agent.user.avatarUrl
          ? <img src={agent.user.avatarUrl} className="w-full h-full rounded-2xl object-cover" alt="" />
          : initials
        }
        {agent.rsspcStatus === 'VERIFIED' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-[8px] font-black">✓</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-obsidian-900 group-hover:text-gold-600 transition-colors">
          {agent.user.firstName} {agent.user.lastName}
        </p>
        {agent.agencyName && <p className="text-xs text-obsidian-400 truncate">{agent.agencyName}</p>}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {agent.badge !== 'NONE' && (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${badgeColors[agent.badge]}`}>
              {agent.badge.replace('_',' ')}
            </span>
          )}
          {agent.reviewCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-obsidian-600">
              <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
              {agent.avgRating.toFixed(1)} ({agent.reviewCount})
            </span>
          )}
          {agent.activeListings > 0 && (
            <span className="text-xs text-obsidian-400">{agent.activeListings} listings</span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-obsidian-300 group-hover:text-gold-500 transition-colors flex-shrink-0 mt-1" />
    </Link>
  )
}

// ── Empty state ───────────────────────────────────────────────
function ListingsEmptyState() {
  return (
    <div className="col-span-full py-16 text-center">
      <div className="w-20 h-20 rounded-3xl bg-surface-subtle flex items-center justify-center mx-auto mb-5">
        <Home className="w-10 h-10 text-obsidian-200" />
      </div>
      <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-2">
        No listings yet in Port Harcourt
      </h3>
      <p className="text-obsidian-400 text-sm mb-6 max-w-md mx-auto">
        Be one of the first verified agents to list properties on Naya and reach thousands of buyers and renters.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link href="/register?type=AGENT" className="btn-primary gap-2 inline-flex">
          <Building2 className="w-4 h-4" />List as an Agent
        </Link>
        <Link href="/managed" className="btn-secondary gap-2 inline-flex">
          <Sparkles className="w-4 h-4" />Use Naya Managed
        </Link>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function HomePage() {
  const [activeTab, setActiveTab]   = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [listings, setListings]     = useState<Listing[]>([])
  const [agents, setAgents]         = useState<Agent[]>([])
  const [stats, setStats]           = useState<Stats>({ listings:0, agents:0, areas:10, users:0 })
  const [loadingListings, setLoadingListings] = useState(true)
  const [loadingAgents, setLoadingAgents]     = useState(true)

  // Fetch featured listings
  useEffect(() => {
    fetch('/api/listings?status=ACTIVE&sort=featured&limit=6')
      .then(r => r.json())
      .then(d => {
        setListings(d.data?.listings || [])
        setStats(s => ({ ...s, listings: d.data?.total || 0 }))
      })
      .catch(() => {})
      .finally(() => setLoadingListings(false))
  }, [])

  // Fetch top agents
  useEffect(() => {
    fetch('/api/agents?sort=rating&limit=4&status=VERIFIED')
      .then(r => r.json())
      .then(d => {
        setAgents(d.data?.data || [])
        setStats(s => ({ ...s, agents: d.data?.total || 0 }))
      })
      .catch(() => {})
      .finally(() => setLoadingAgents(false))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const type = LISTING_TYPES[activeTab]
    const q    = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''
    window.location.href = `${type.href}?${q}`
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] md:min-h-screen bg-obsidian-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-100" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gold-500/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gold-500/4 blur-[100px] pointer-events-none" />

        <div className="relative z-10 page-container py-20 md:py-28 w-full">
          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />Port Harcourt · Rivers State, Nigeria
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-tight mb-6">
              Find Property in<br />
              <span className="gold-text">Port Harcourt</span>
            </h1>

            <p className="text-white/50 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Verified listings. Trusted agents. Smart tools. Nigeria's most advanced property platform.
            </p>

            {/* Search box */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
              {/* Tabs */}
              <div className="flex border-b border-surface-border overflow-x-auto no-scrollbar">
                {LISTING_TYPES.map((t, i) => (
                  <button key={i} onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                      activeTab === i ? 'border-obsidian-900 text-obsidian-900' : 'border-transparent text-obsidian-400 hover:text-obsidian-700'
                    }`}>
                    <t.icon className="w-3.5 h-3.5" />{t.tab}
                  </button>
                ))}
              </div>
              {/* Input */}
              <form onSubmit={handleSearch} className="flex items-center gap-3 p-3">
                <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0 ml-2" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={`Search for ${LISTING_TYPES[activeTab].tab.toLowerCase()} in Port Harcourt...`}
                  className="flex-1 text-sm text-obsidian-900 placeholder:text-obsidian-300 outline-none bg-transparent py-2"
                />
                <button type="submit" className="btn-primary btn-sm gap-2 whitespace-nowrap">
                  <Search className="w-4 h-4" />Search
                </button>
              </form>
            </div>

            {/* Quick area pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['GRA Phase 2','Woji','Trans Amadi','Old GRA','Peter Odili Road','Eleme'].map(area => (
                <Link key={area}
                  href={`/search?area=${encodeURIComponent(area)}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-white/70 hover:text-white text-xs font-medium transition-all">
                  <MapPin className="w-3 h-3" />{area}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </section>

      {/* ── LIVE STATS ────────────────────────────────────────── */}
      <section className="py-10 bg-white border-b border-surface-border">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { value: stats.listings > 0 ? stats.listings : '—', label:'Active Listings',   sub:'Port Harcourt', icon:Home },
              { value: stats.agents > 0   ? stats.agents   : '—', label:'Verified Agents',   sub:'RSSPC registered', icon:Shield },
              { value: stats.areas,                                 label:'Neighbourhoods',    sub:'Covered', icon:MapPin },
              { value: '24/7',                                      label:'AI Property Chat',  sub:'Always available', icon:Sparkles },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-3xl font-medium text-obsidian-900 mb-1">{s.value}</p>
                <p className="text-sm font-semibold text-obsidian-700">{s.label}</p>
                <p className="text-xs text-obsidian-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ─────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="section-number">Properties</span>
              <h2 className="section-title">
                {listings.length > 0 ? 'Featured Properties' : 'Properties Coming Soon'}
              </h2>
            </div>
            <Link href="/search" className="hidden md:flex items-center gap-2 text-sm font-semibold text-gold-600 hover:text-gold-500">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingListings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-surface-subtle" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-surface-subtle rounded w-2/3" />
                    <div className="h-4 bg-surface-subtle rounded w-full" />
                    <div className="h-5 bg-surface-subtle rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map(l => <PropertyCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1">
              <ListingsEmptyState />
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link href="/search" className="btn-secondary gap-2 inline-flex">
              Browse all listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── AREAS ─────────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Neighbourhoods</span>
            <h2 className="section-title">Explore by Area</h2>
            <p className="text-obsidian-400 max-w-xl mx-auto mt-3 text-sm">
              Electricity bands, flood risk, average prices and infrastructure scores for every area in Port Harcourt.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PH_AREAS.map((area, i) => (
              <Link key={i} href={`/neighborhoods/${area.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="card p-5 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-3">{area.emoji}</div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-obsidian-900 group-hover:text-gold-600 transition-colors text-sm">{area.name}</h3>
                  <span className="px-2 py-0.5 bg-obsidian-50 text-obsidian-500 text-[9px] font-semibold rounded-full">{area.tag}</span>
                </div>
                <p className="text-xs text-obsidian-400">{area.desc}</p>
                <div className="flex items-center gap-1 text-gold-600 text-xs font-semibold mt-3 group-hover:gap-2 transition-all">
                  View profile <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/neighborhoods" className="btn-secondary gap-2 inline-flex">
              All Neighbourhoods <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TOP AGENTS ────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="section-number">Agents</span>
              <h2 className="section-title">
                {agents.length > 0 ? 'Top Verified Agents' : 'Become a Verified Agent'}
              </h2>
            </div>
            {agents.length > 0 && (
              <Link href="/agents" className="hidden md:flex items-center gap-2 text-sm font-semibold text-gold-600 hover:text-gold-500">
                All agents <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {loadingAgents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-5 flex gap-4 animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-surface-subtle flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-subtle rounded w-1/2" />
                    <div className="h-3 bg-surface-subtle rounded w-3/4" />
                    <div className="h-3 bg-surface-subtle rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map(a => <AgentCard key={a.id} agent={a} />)}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <Award className="w-16 h-16 text-obsidian-200 mx-auto mb-4" />
              <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-2">No agents yet</h3>
              <p className="text-obsidian-400 text-sm mb-6 max-w-md mx-auto">
                Be one of Port Harcourt's first verified agents on Naya. Get your RSSPC badge and start listing today.
              </p>
              <Link href="/register" className="btn-primary gap-2 inline-flex">
                Join as an Agent <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── NAYA MANAGED BANNER ───────────────────────────────── */}
      <section className="section-padding bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/8 rounded-full blur-[100px]" />
        <div className="relative z-10 page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-sm font-semibold mb-5">
                <Sparkles className="w-4 h-4" />NEW — Naya Managed Service
              </div>
              <h2 className="font-display text-4xl font-light text-white mb-4 leading-tight">
                Don't Want to List<br /><span className="gold-text">It Yourself?</span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed mb-6 max-w-lg">
                Hand your property over to Naya's professional team. We handle photography, marketing, tenant screening, negotiations and legal — you collect your money.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/managed" className="btn-primary gap-2 justify-center">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="tel:+2348168117004"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all text-sm">
                  📞 Call Us Now
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon:'📸', title:'Professional Photos', desc:'HDR + 360° tour' },
                { icon:'📣', title:'Full Marketing',      desc:'Naya + social media' },
                { icon:'🔍', title:'Tenant Screening',    desc:'Qualified leads only' },
                { icon:'💰', title:'From ₦50K',           desc:'+ 5% on completion' },
              ].map((f,i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{f.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Platform</span>
            <h2 className="section-title">Why Choose Naya</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon:Shield,    emoji:'🛡', title:'RSSPC-Verified Agents Only',  desc:'Every professional agent is verified against the Rivers State RSSPC register. No unregistered operators.' },
              { icon:Zap,       emoji:'🔐', title:'Secure Escrow Payments',      desc:'Pay rent safely through Naya\'s escrow. Your money is protected until you inspect and approve the property.' },
              { icon:Sparkles,  emoji:'🤖', title:'AI Property Intelligence',    desc:'24/7 AI assistant knows every area, price, and flood risk in Port Harcourt. Ask anything, get instant answers.' },
            ].map((f,i) => (
              <div key={i} className="card p-6 text-center hover:shadow-lg transition-all group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.emoji}</div>
                <h3 className="font-semibold text-obsidian-900 mb-2">{f.title}</h3>
                <p className="text-sm text-obsidian-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="section-padding bg-white border-t border-surface-border">
        <div className="page-container max-w-2xl mx-auto text-center">
          <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-5" />
          <h2 className="section-title mb-3">Ready to get started?</h2>
          <p className="text-obsidian-400 mb-8 text-sm leading-relaxed max-w-lg mx-auto">
            Join Port Harcourt's fastest-growing property platform. Find your next home, list your property, or grow your agency.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search" className="btn-primary gap-2 justify-center">
              <Home className="w-4 h-4" />Find a Property
            </Link>
            <Link href="/register" className="btn-secondary gap-2 justify-center">
              <Building2 className="w-4 h-4" />List Your Property
            </Link>
            <Link href="/managed" className="btn-ghost gap-2 justify-center">
              <Sparkles className="w-4 h-4" />Naya Managed
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
