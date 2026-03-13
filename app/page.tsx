'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, ArrowRight, TrendingUp, Shield, Zap, Star, Play } from 'lucide-react'
import PropertyCard from '@/components/property/PropertyCard'
import AgentCard from '@/components/agent/AgentCard'
import { agents, neighborhoods, blogPosts, getFeaturedProperties, formatPrice } from '@/lib/data'

const tabs = ['Buy', 'Rent', 'Shortlet', 'Commercial']

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('Rent')
  const [searchQuery, setSearchQuery] = useState('')
  const featured = getFeaturedProperties().slice(0, 6)
  const featuredAgents = agents.slice(0, 4)
  const featuredPosts = blogPosts.filter(p => p.featured).slice(0, 3)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const type = activeTab.toLowerCase()
    const q = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''
    window.location.href = `/${type}?${q}`
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen bg-obsidian-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-100" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gold-500/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] pointer-events-none" />
        <div className="page-container relative z-10 py-24 md:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Port Harcourt&apos;s #1 Property Platform</span>
            </div>
            <h1 className="font-display font-light leading-[0.92] tracking-tight mb-6">
              <span className="block text-white text-5xl md:text-7xl lg:text-8xl">Find Your</span>
              <span className="block text-5xl md:text-7xl lg:text-8xl">
                <span className="gold-text">Perfect Home</span>
              </span>
              <span className="block text-white text-5xl md:text-7xl lg:text-8xl">in Port Harcourt</span>
            </h1>
            <p className="text-lg md:text-xl text-white/40 font-light mb-10 max-w-xl">
              Verified listings. Trusted agents. Virtual tours. The most complete property experience in Rivers State.
            </p>
            <div className="bg-white/5 backdrop-blur-md border border-white/12 rounded-3xl p-5 md:p-6 max-w-3xl">
              <div className="flex items-center gap-1 mb-5">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab===tab ? 'bg-gold-500 text-obsidian-900 shadow-gold' : 'text-white/50 hover:text-white hover:bg-white/8'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 bg-white/8 border border-white/12 rounded-2xl px-4 py-3">
                  <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Neighbourhood, address, or property type…"
                    className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none" />
                </div>
                <button type="submit" className="btn-primary whitespace-nowrap">
                  <Search className="w-4 h-4" />Search Properties
                </button>
              </form>
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-xs text-white/25 font-mono">Popular:</span>
                {['GRA Phase 2', 'Woji', '3 Bedrooms', 'Shortlet'].map(q => (
                  <Link key={q} href={`/search?q=${encodeURIComponent(q)}`}
                    className="text-xs text-white/40 hover:text-gold-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 transition-all hover:border-gold-500/30">{q}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-gold-500 to-transparent" />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-obsidian-900 border-t border-white/8">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
            {[{v:'2,847',l:'Active Listings',i:'🏠'},{v:'156',l:'Verified Agents',i:'🛡'},{v:'6',l:'Neighborhoods',i:'📍'},{v:'98%',l:'Satisfaction Rate',i:'⭐'}].map(s => (
              <div key={s.l} className="py-8 px-6 text-center">
                <div className="text-2xl mb-2">{s.i}</div>
                <div className="font-display text-3xl md:text-4xl font-light text-white mb-1">{s.v}</div>
                <div className="text-xs text-white/35 font-mono tracking-wider uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div><span className="section-number">Featured Properties</span><h2 className="section-title">Hand-Picked in Port Harcourt</h2></div>
            <Link href="/search" className="hidden md:flex items-center gap-2 text-sm text-gold-600 font-medium hover:text-gold-500">View all <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* VIRTUAL TOUR CTA */}
      <section className="relative py-20 bg-obsidian-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-900 via-obsidian-900/95 to-transparent" />
        <div className="page-container relative z-10">
          <div className="max-w-xl">
            <span className="section-number text-gold-500">Virtual Tours</span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
              Explore Properties<br /><em className="text-gold-400 not-italic">from Anywhere</em>
            </h2>
            <p className="text-white/40 text-lg font-light mb-8 leading-relaxed">360° virtual tours let you walk through every room before you enquire.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/search?virtualTour=true" className="btn-primary btn-lg"><Play className="w-5 h-5"/>Browse Tour Properties</Link>
              <Link href="/about" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">Learn More</Link>
            </div>
          </div>
        </div>
        <div className="absolute right-10 top-10 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
      </section>

      {/* NEIGHBORHOODS */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div><span className="section-number">Neighborhoods</span><h2 className="section-title">Explore Port Harcourt</h2></div>
            <Link href="/neighborhoods" className="hidden md:flex items-center gap-2 text-sm text-gold-600 font-medium hover:text-gold-500">All areas <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {neighborhoods.map(n => (
              <Link key={n.id} href={`/neighborhoods/${n.slug}`} className="group block rounded-3xl overflow-hidden border border-surface-border hover:border-gold-300 shadow-card hover:shadow-xl-soft transition-all duration-300 hover:-translate-y-1">
                <div className={`h-36 bg-gradient-to-br ${n.heroGradient} flex items-center justify-center relative overflow-hidden`}>
                  <span className="text-5xl opacity-25 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">{n.emoji}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div><div className="font-display text-xl text-white font-medium">{n.name}</div><div className="text-xs text-white/60">{n.lga}</div></div>
                    <div className={`flex items-center gap-1 text-xs font-mono ${n.trend==='up'?'text-emerald-300':n.trend==='down'?'text-red-300':'text-white/50'}`}>
                      <TrendingUp className="w-3 h-3"/>{n.trend==='up'?'+':n.trend==='down'?'-':''}{n.trendPct}%
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div><div className="text-xs text-obsidian-400 font-mono mb-0.5">Avg Rent (3BR)</div><div className="font-mono font-semibold text-gold-600">{formatPrice(n.avgRent3br)}/yr</div></div>
                    <div className="text-right"><div className="text-xs text-obsidian-400 font-mono mb-0.5">Properties</div><div className="font-mono font-semibold text-obsidian-700">{n.propertyCount}</div></div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {n.highlights.slice(0,3).map(h => <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">{h}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding bg-surface-bg adire-bg">
        <div className="page-container">
          <div className="text-center mb-12"><span className="section-number">How It Works</span><h2 className="section-title">Find Your Home in 3 Steps</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[{n:'01',i:'🔍',t:'Search & Filter',d:'Filter by neighbourhood, price, type. Browse on map or list view.'},{n:'02',i:'🎬',t:'Virtual Tour',d:'Take a 360° virtual tour from your device. See every room before you enquire.'},{n:'03',i:'🤝',t:'Connect & Move In',d:'Contact a verified agent, schedule a viewing, and secure your dream property.'}].map(s => (
              <div key={s.n} className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-obsidian-900 mb-6 mx-auto">
                  <span className="text-3xl">{s.i}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center font-mono text-[10px] font-semibold text-obsidian-900">{s.n}</span>
                </div>
                <h3 className="font-display text-xl font-medium text-obsidian-900 mb-3">{s.t}</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP AGENTS */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div><span className="section-number">Top Agents</span><h2 className="section-title">RSSPC-Verified Professionals</h2></div>
            <Link href="/agents" className="hidden md:flex items-center gap-2 text-sm text-gold-600 font-medium hover:text-gold-500">All agents <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredAgents.map(a => <AgentCard key={a.id} agent={a} />)}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 bg-surface-bg">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{Icon:Shield,t:'RSSPC Verified',d:'Every agent is verified by the Rivers State Signage & Publicity Commission.',c:'text-emerald-500'},{Icon:Zap,t:'Instant Alerts',d:'Get notified the moment a property matching your criteria is listed.',c:'text-blue-500'},{Icon:Star,t:'Reviewed & Rated',d:'Read genuine client reviews on every agent, verified by our team.',c:'text-gold-500'}].map(({Icon,t,d,c}) => (
              <div key={t} className="card p-6">
                <Icon className={`w-8 h-8 ${c} mb-4`}/>
                <h3 className="font-display text-xl font-medium text-obsidian-900 mb-2">{t}</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div><span className="section-number">Insights</span><h2 className="section-title">PH Property Intelligence</h2></div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-sm text-gold-600 font-medium hover:text-gold-500">All articles <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group card overflow-hidden block">
                <div className="h-40 bg-gradient-to-br from-obsidian-800 to-obsidian-900 flex items-center justify-center">
                  <span className="text-5xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300">{post.emoji}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-gold text-[10px]">{post.category}</span>
                    <span className="text-xs text-obsidian-400 font-mono">{post.readTime} min read</span>
                  </div>
                  <h3 className="font-display text-lg font-medium text-obsidian-900 group-hover:text-gold-700 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-sm text-obsidian-400 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="page-container relative z-10 text-center">
          <span className="section-number text-gold-500 block text-center">For Agents</span>
          <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-4">Grow Your Business<br/><span className="gold-text">with Naya</span></h2>
          <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto font-light">Join 156+ verified agents listing on Naya. Reach thousands of qualified buyers and tenants every month.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/portal" className="btn-primary btn-lg">Start Listing Today</Link>
            <Link href="/agents" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">View Plans</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
