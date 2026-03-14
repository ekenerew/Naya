'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, ArrowRight, Clock, User, TrendingUp,
  BookOpen, Shield, DollarSign, MapPin, Home, Star,
  ChevronRight, Sparkles, Filter, Eye, MessageCircle
} from 'lucide-react'
import { blogPosts } from '@/lib/data'
import type { BlogPost } from '@/lib/types'

// ── Config ─────────────────────────────────────────────────────────────────────
const categories = [
  { value: 'all',          label: 'All Articles',   icon: BookOpen,   color: 'text-obsidian-600',  bg: 'bg-obsidian-50',  count: 0 },
  { value: 'Area Guide',   label: 'Area Guides',    icon: MapPin,     color: 'text-emerald-600',   bg: 'bg-emerald-50',   count: 0 },
  { value: 'Investment',   label: 'Investment',     icon: TrendingUp, color: 'text-gold-600',      bg: 'bg-gold-50',      count: 0 },
  { value: 'Legal Guide',  label: 'Legal Guides',   icon: Shield,     color: 'text-blue-600',      bg: 'bg-blue-50',      count: 0 },
  { value: 'Buyer Guide',  label: 'Buyer Guides',   icon: Home,       color: 'text-purple-600',    bg: 'bg-purple-50',    count: 0 },
  { value: 'Finance',      label: 'Finance',        icon: DollarSign, color: 'text-rose-600',      bg: 'bg-rose-50',      count: 0 },
  { value: 'Market Report',label: 'Market Reports', icon: TrendingUp, color: 'text-cyan-600',      bg: 'bg-cyan-50',      count: 0 },
  { value: 'Expat Guide',  label: 'Expat Guides',   icon: Star,       color: 'text-amber-600',     bg: 'bg-amber-50',     count: 0 },
]

// Populate counts
categories.forEach(cat => {
  cat.count = cat.value === 'all'
    ? blogPosts.length
    : blogPosts.filter(p => p.category === cat.value).length
})

const categoryColorMap: Record<string, string> = {
  'Area Guide':    'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Investment':    'text-gold-700 bg-gold-50 border-gold-200',
  'Legal Guide':   'text-blue-700 bg-blue-50 border-blue-200',
  'Buyer Guide':   'text-purple-700 bg-purple-50 border-purple-200',
  'Finance':       'text-rose-700 bg-rose-50 border-rose-200',
  'Market Report': 'text-cyan-700 bg-cyan-50 border-cyan-200',
  'Expat Guide':   'text-amber-700 bg-amber-50 border-amber-200',
}

const sortOptions = [
  { value: 'newest',  label: 'Newest First' },
  { value: 'oldest',  label: 'Oldest First' },
  { value: 'longest', label: 'Longest Read' },
  { value: 'shortest', label: 'Quickest Read' },
]

const guides = [
  {
    title: 'First-Time Buyer\'s Roadmap',
    desc: 'A complete step-by-step guide from budget to keys for buying your first property in Port Harcourt.',
    steps: ['Set your budget', 'Get pre-approved', 'Choose your area', 'Find a verified agent', 'Make an offer', 'Due diligence', 'Sign the deed'],
    emoji: '🏠', color: 'border-gold-500', link: '/blog/first-time-buyer-guide-port-harcourt',
  },
  {
    title: 'Property Due Diligence',
    desc: 'The 10-point checklist every Nigerian buyer must complete before signing anything or paying any money.',
    steps: ['Verify title at Lands Registry', 'Commission a survey', 'Check building approvals', 'Inspect for encumbrances', 'Verify seller\'s identity', 'Review all documents', 'Engage a property lawyer'],
    emoji: '📋', color: 'border-blue-500', link: '/blog/property-due-diligence-checklist-nigeria',
  },
  {
    title: 'Land Title Explained',
    desc: 'The difference between C of O, Deed of Assignment, and Governor\'s Consent — and why it matters for your money.',
    steps: ['C of O — strongest title', 'Governor\'s Consent — state-backed', 'Deed of Assignment — common in estates', 'Survey Plan — boundaries only', 'Family Land — high risk'],
    emoji: '📜', color: 'border-emerald-500', link: '/blog/understanding-land-titles-nigeria-coo-vs-doa',
  },
  {
    title: 'Diaspora Buyer\'s Checklist',
    desc: 'How to safely buy property in Nigeria from the UK, US, Canada, or anywhere in the diaspora.',
    steps: ['Appoint a trusted local agent', 'Grant Power of Attorney', 'Open a domiciliary account', 'Use escrow for payments', 'Verify all documents remotely', 'Arrange property management'],
    emoji: '🌍', color: 'border-purple-500', link: '/blog/diaspora-buying-property-nigeria-guide',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date('2026-03-14')
  const days = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

// ── Blog Card Components ──────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: BlogPost }) {
  const catColor = categoryColorMap[post.category] || 'text-obsidian-600 bg-obsidian-50 border-obsidian-200'
  return (
    <Link href={`/blog/${post.slug}`}
      className="card overflow-hidden hover:border-gold-300 transition-all group block">
      {/* Visual banner */}
      <div className="relative h-52 bg-gradient-to-br from-obsidian-900 via-obsidian-800 to-zinc-900 flex items-center justify-center overflow-hidden">
        <div className="text-8xl opacity-20">{post.emoji}</div>
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
        <div className="absolute top-4 left-4">
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-gold-500 text-obsidian-900 font-bold">⭐ Featured</span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${catColor}`}>{post.category}</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 text-white/50 text-xs">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} min read</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
            <span>{timeAgo(post.publishedAt)}</span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-medium text-obsidian-900 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-obsidian-500 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-1.5 text-gold-600 font-medium text-sm group-hover:gap-2.5 transition-all">
          Read article <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}

function ArticleCard({ post }: { post: BlogPost }) {
  const catColor = categoryColorMap[post.category] || 'text-obsidian-600 bg-obsidian-50 border-obsidian-200'
  return (
    <Link href={`/blog/${post.slug}`}
      className="card p-5 hover:border-gold-300 transition-all group flex gap-4 items-start">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-obsidian-900 to-zinc-900 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
        {post.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${catColor}`}>{post.category}</span>
          <span className="text-[10px] text-obsidian-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{post.readTime} min</span>
          <span className="text-[10px] text-obsidian-400">{timeAgo(post.publishedAt)}</span>
        </div>
        <h3 className="font-display text-base font-medium text-obsidian-900 leading-snug mb-1.5 group-hover:text-gold-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-xs text-obsidian-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-obsidian-300 group-hover:text-gold-500 flex-shrink-0 mt-1 transition-colors" />
    </Link>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [searchQuery, setSearchQuery]     = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy]               = useState('newest')
  const [showGuides, setShowGuides]       = useState(false)

  const filtered = useMemo(() => {
    let r = blogPosts.filter(p => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.category.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeCategory !== 'all' && p.category !== activeCategory) return false
      return true
    })
    switch (sortBy) {
      case 'oldest':   r = [...r].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()); break
      case 'longest':  r = [...r].sort((a, b) => b.readTime - a.readTime); break
      case 'shortest': r = [...r].sort((a, b) => a.readTime - b.readTime); break
      default:         r = [...r].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    }
    return r
  }, [searchQuery, activeCategory, sortBy])

  const featuredPosts = blogPosts.filter(p => p.featured)
  const activeFilters = [searchQuery, activeCategory !== 'all'].filter(Boolean).length

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/8 blur-[120px]" />

        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">
                {blogPosts.length} Articles & Guides · Port Harcourt Property
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.92] tracking-tight mb-6">
              Property<br />
              <span className="gold-text">Knowledge</span><br />
              <span className="text-white/40">That Protects You</span>
            </h1>
            <p className="text-white/40 text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Guides, market reports, legal explainers, and investment intelligence — everything you need to navigate the Port Harcourt property market with confidence.
            </p>

            {/* Search */}
            <div className="card p-2 flex gap-2 max-w-2xl mx-auto shadow-gold-lg">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0" />
                <input className="flex-1 bg-transparent text-obsidian-900 placeholder-obsidian-300 outline-none text-sm"
                  placeholder="Search articles, guides, legal tips..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-obsidian-300" /></button>}
              </div>
              <button className="btn-primary px-6 flex-shrink-0">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </div>

          {/* Category quick filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.filter(c => c.count > 0).map(cat => (
              <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all ${activeCategory === cat.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/50 border-white/15 hover:bg-white/15'}`}>
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeCategory === cat.value ? 'bg-obsidian-900/20' : 'bg-white/10'}`}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* ── FEATURED ARTICLES ────────────────────────────────────────────── */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="section-padding bg-surface-bg">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="section-number">Editor's Pick</span>
                <h2 className="font-display text-3xl font-medium text-obsidian-900">Featured Articles</h2>
              </div>
              <button onClick={() => setActiveCategory('all')} className="text-sm text-gold-600 hover:text-gold-500 flex items-center gap-1 font-medium">
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              {featuredPosts.slice(0, 3).map(p => <FeaturedCard key={p.id} post={p} />)}
            </div>
            {featuredPosts.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featuredPosts.slice(3).map(p => <FeaturedCard key={p.id} post={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── QUICK GUIDES ─────────────────────────────────────────────────── */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="section-padding bg-white">
          <div className="page-container">
            <div className="text-center mb-10">
              <span className="section-number">Step-by-Step</span>
              <h2 className="section-title">Property Guides</h2>
              <p className="section-desc mx-auto">Practical, structured guides for the most important decisions in Nigerian property.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {guides.map((guide, i) => (
                <div key={i} className={`card p-6 border-l-4 ${guide.color} hover:border-l-4 hover:border-opacity-100 transition-all group`}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="text-4xl">{guide.emoji}</div>
                    <div>
                      <h3 className="font-display text-xl font-medium text-obsidian-900 group-hover:text-gold-600 transition-colors">{guide.title}</h3>
                      <p className="text-sm text-obsidian-500 leading-relaxed mt-1">{guide.desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-5">
                    {guide.steps.map((step, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-obsidian-900 text-white text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0">{j + 1}</div>
                        <span className="text-xs text-obsidian-600">{step}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={guide.link} className="flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-500 transition-colors group-hover:gap-2.5">
                    Read full guide <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ALL ARTICLES ─────────────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ── SIDEBAR ────────────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">

                {/* Category Filter */}
                <div className="card p-5">
                  <h3 className="font-display text-base font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gold-500" />Browse by Topic
                  </h3>
                  <div className="space-y-1">
                    {categories.filter(c => c.count > 0).map(cat => (
                      <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${activeCategory === cat.value ? 'bg-gold-500 text-obsidian-900' : 'hover:bg-surface-subtle text-obsidian-600'}`}>
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                            <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                          </div>
                          <span className="font-medium">{cat.label}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${activeCategory === cat.value ? 'bg-obsidian-900/15' : 'bg-surface-subtle text-obsidian-400'}`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="card p-5">
                  <h3 className="font-display text-base font-medium text-obsidian-900 mb-3">Sort By</h3>
                  <select className="input-field text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Reading Stats */}
                <div className="card p-5">
                  <h3 className="font-display text-base font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold-500" />Reading Stats
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Total articles', value: blogPosts.length.toString() },
                      { label: 'Avg. read time', value: `${Math.round(blogPosts.reduce((s, p) => s + p.readTime, 0) / blogPosts.length)} min` },
                      { label: 'Topics covered', value: (new Set(blogPosts.map(p => p.category)).size).toString() },
                      { label: 'Latest post', value: timeAgo(blogPosts.sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0].publishedAt) },
                    ].map((s, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-surface-border last:border-0">
                        <span className="text-xs text-obsidian-500">{s.label}</span>
                        <span className="font-mono text-xs font-bold text-obsidian-900">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10">
                    <div className="text-3xl mb-3">📬</div>
                    <h3 className="font-display text-base font-medium text-white mb-2">Weekly Market Digest</h3>
                    <p className="text-white/40 text-xs leading-relaxed mb-4">Get the latest PH property news, price data, and investment insights every Monday.</p>
                    <input className="input-field text-sm mb-2 bg-white/10 border-white/20 text-white placeholder-white/30" placeholder="your@email.com" />
                    <button className="btn-primary btn-sm w-full justify-center">
                      <Sparkles className="w-3.5 h-3.5" />Subscribe Free
                    </button>
                    <p className="text-[10px] text-white/20 mt-2 text-center">No spam. Unsubscribe anytime.</p>
                  </div>
                </div>

                {/* Expert consultation */}
                <div className="card p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-obsidian-900 text-sm mb-1">Have a Question?</h3>
                      <p className="text-xs text-obsidian-500 leading-relaxed mb-3">Our property experts answer reader questions every week.</p>
                      <a href="mailto:editorial@naya.ng" className="text-xs text-gold-600 font-medium hover:text-gold-500 transition-colors flex items-center gap-1">
                        Ask our team <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ARTICLE LIST ───────────────────────────────────────────── */}
            <div className="lg:col-span-3">

              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-obsidian-900">
                    {activeCategory === 'all' ? 'All Articles' : categories.find(c => c.value === activeCategory)?.label}
                    {' '}
                    <span className="text-obsidian-400 font-light">({filtered.length})</span>
                  </h2>
                  {searchQuery && (
                    <p className="text-sm text-obsidian-400 mt-0.5">Results for "<span className="text-obsidian-700">{searchQuery}</span>"</p>
                  )}
                </div>
                {activeFilters > 0 && (
                  <button onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
                    className="flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-500 font-medium">
                    <X className="w-3.5 h-3.5" />Clear filters
                  </button>
                )}
              </div>

              {/* Articles */}
              {filtered.length > 0 ? (
                <div className="space-y-3">
                  {filtered.map(post => <ArticleCard key={post.id} post={post} />)}
                </div>
              ) : (
                <div className="text-center py-20 card">
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No articles found</h3>
                  <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">Try a different search term or browse by category.</p>
                  <button onClick={() => { setSearchQuery(''); setActiveCategory('all') }} className="btn-primary">
                    View All Articles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ──────────────────────────────────────────────── */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="section-padding bg-white">
          <div className="page-container">
            <div className="text-center mb-10">
              <span className="section-number">Browse Topics</span>
              <h2 className="section-title">Everything You Need to Know</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.filter(c => c.value !== 'all' && c.count > 0).map(cat => (
                <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                  className="card p-5 text-center hover:border-gold-300 transition-all group">
                  <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <cat.icon className={`w-7 h-7 ${cat.color}`} />
                  </div>
                  <div className="font-display text-base font-medium text-obsidian-900 mb-1 group-hover:text-gold-600 transition-colors">{cat.label}</div>
                  <div className="font-mono text-xs text-obsidian-400">{cat.count} article{cat.count !== 1 ? 's' : ''}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-5">
            Ready to Put Your<br />
            <span className="gold-text">Knowledge Into Action?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">Browse verified properties, check neighbourhood data, or get an instant AI valuation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn-primary btn-lg">
              Search Properties <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/tools/valuation" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">
              Value My Property
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
