'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, Star, MapPin, Wifi, Zap, Wind, Tv, Car, Shield,
  ChevronLeft, ChevronRight, MessageCircle, Phone, ArrowRight,
  Users, Clock, CheckCircle2, Coffee, Waves, Dumbbell, ChefHat,
  SlidersHorizontal, Calendar, TrendingUp
} from 'lucide-react'
import { properties, shortletListings, neighborhoods } from '@/lib/data'
import type { Property } from '@/lib/types'

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

// ── Config ─────────────────────────────────────────────────────────────────────
const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-3.5 h-3.5" />,
  'WiFi 100Mbps': <Wifi className="w-3.5 h-3.5" />,
  'WiFi 200Mbps': <Wifi className="w-3.5 h-3.5" />,
  'Generator': <Zap className="w-3.5 h-3.5" />,
  'Air Conditioning': <Wind className="w-3.5 h-3.5" />,
  'Smart TV': <Tv className="w-3.5 h-3.5" />,
  'Parking': <Car className="w-3.5 h-3.5" />,
  '24-hr Security': <Shield className="w-3.5 h-3.5" />,
  'Pool Access': <Waves className="w-3.5 h-3.5" />,
  'Private Pool': <Waves className="w-3.5 h-3.5" />,
  'Gym': <Dumbbell className="w-3.5 h-3.5" />,
  'Chef Service': <ChefHat className="w-3.5 h-3.5" />,
}

const categories = [
  { value: 'all',       label: 'All Shortlets',    emoji: '🏠' },
  { value: 'studio',    label: 'Studio',           emoji: '✨' },
  { value: 'one_bed',   label: '1 Bedroom',        emoji: '🛏' },
  { value: 'two_bed',   label: '2 Bedrooms',       emoji: '🛏' },
  { value: 'three_bed', label: '3 Bedrooms',       emoji: '🛏' },
  { value: 'four_plus', label: '4+ Bedrooms',      emoji: '🏡' },
  { value: 'luxury',    label: 'Luxury & Villas',  emoji: '👑' },
  { value: 'corporate', label: 'Corporate',        emoji: '💼' },
  { value: 'family',    label: 'Family Stays',     emoji: '👨‍👩‍👧' },
]

const priceFilters = [
  { label: 'Under ₦30K/night',      min: 0,      max: 30000 },
  { label: '₦30K – ₦75K/night',    min: 30000,  max: 75000 },
  { label: '₦75K – ₦150K/night',   min: 75000,  max: 150000 },
  { label: 'Above ₦150K/night',     min: 150000, max: Infinity },
]

const sortOptions = [
  { value: 'featured',   label: 'Featured First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'newest',     label: 'Newest' },
]

const experiences = [
  { emoji: '💼', title: 'Business & Corporate', desc: 'High-speed WiFi, printing, video conferencing, and proximity to Trans Amadi and GRA business districts.', tag: 'corporate' },
  { emoji: '👑', title: 'Luxury & Villas',       desc: 'Private pools, butler service, panoramic views, and bespoke furnishings for the most discerning guests.', tag: 'luxury' },
  { emoji: '👨‍👩‍👧', title: 'Family Escapes',     desc: 'Spacious homes with children\'s play areas, BBQ terraces, multiple bedrooms, and full kitchens.', tag: 'family' },
  { emoji: '🛢',  title: 'Oil & Gas Rotational', desc: 'Close to NLNG, SPDC, and Agip. Airport transfers, concierge, and flexible minimum stays.', tag: 'corporate' },
  { emoji: '✈️', title: 'Diaspora Returnees',    desc: 'Feel at home. Nigerian cookware, fast WiFi, familiar neighbourhoods, and a local host experience.', tag: 'all' },
  { emoji: '🌿', title: 'Extended Stays',        desc: 'Weekly and monthly discounts. Fully equipped kitchens, laundry, and a home-away-from-home setup.', tag: 'all' },
]

const testimonials = [
  { name: 'Dr. Emeka Okonkwo', role: 'Consultant Surgeon, Lagos', rating: 5, text: 'I stay in Port Harcourt monthly for surgical rounds. Naya shortlets have completely replaced hotels for me — more space, better value, and the hosts are outstanding.', neighborhood: 'GRA Phase 2' },
  { name: 'Sarah Adeyemi', role: 'Shell Nigeria, Aberdeen Expat', rating: 5, text: 'I have used 3 different Naya shortlets across my rotations. The verification system gives me confidence that what I see is exactly what I get.', neighborhood: 'Trans Amadi' },
  { name: 'Chukwuemeka Eze', role: 'Diaspora Returnee, Houston', rating: 5, text: 'Visiting family in PH but needed my own space. The Heritage Villa in Old GRA was extraordinary — felt like a 5-star hotel but completely private.', neighborhood: 'Old GRA' },
]

// ── Category matcher ───────────────────────────────────────────────────────────
function matchCategory(p: Property, cat: string): boolean {
  if (cat === 'all') return true
  if (cat === 'studio') return p.propertyType === 'studio' || (p.bedrooms === 1 && p.sizeSqm < 60)
  if (cat === 'one_bed') return p.bedrooms === 1
  if (cat === 'two_bed') return p.bedrooms === 2
  if (cat === 'three_bed') return p.bedrooms === 3
  if (cat === 'four_plus') return p.bedrooms >= 4
  if (cat === 'luxury') return p.price >= 100000 || ['penthouse', 'mansion'].includes(p.propertyType)
  if (cat === 'corporate') return p.features.some(f => ['Work Desk', 'Video Conferencing', 'Printer', 'Concierge', 'Dedicated Concierge'].includes(f))
  if (cat === 'family') return p.bedrooms >= 3 || p.features.some(f => f.toLowerCase().includes('family') || f.toLowerCase().includes('children'))
  return true
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < n ? 'fill-gold-400 text-gold-400' : 'text-obsidian-200'}`} />
      ))}
        {/* ── WHY NAYA SHORTLETS ── */}
        <section className="mt-20 mb-8">
          <div className="text-center mb-12">
            <span className="section-number">Why Choose Naya</span>
            <h2 className="section-title">The Smarter Way to Book</h2>
            <p className="section-desc mx-auto mt-4">Verified properties, transparent pricing, instant booking enquiries.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon:'🛡', title:'RSSPC Verified Hosts', desc:'Every agent and landlord is verified against the official RSSPC register. Your safety is our priority.' },
              { icon:'💬', title:'Direct WhatsApp Contact', desc:'No middlemen. Contact hosts directly via WhatsApp for instant responses and custom arrangements.' },
              { icon:'🔐', title:'Secure & Transparent', desc:'Clear pricing with no hidden fees. Full property details, real photos, and honest agent reviews.' },
            ].map((f,i) => (
              <div key={i} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-obsidian-900 mb-2">{f.title}</h3>
                <p className="text-sm text-obsidian-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LIST YOUR PROPERTY CTA ── */}
        <section className="mt-8 mb-8">
          <div className="bg-gradient-to-r from-obsidian-900 to-obsidian-800 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-light text-white mb-2">Have a property to list?</h3>
              <p className="text-white/50 text-sm">Join hosts earning from their properties on Naya.</p>
            </div>
            <a href="/portal/list" className="btn-primary gap-2 whitespace-nowrap flex-shrink-0">
              List Your Shortlet
            </a>
          </div>
        </section>

    </div>
  )
}

// ── Shortlet Card ─────────────────────────────────────────────────────────────
function ShortletCard({ p, featured = false }: { p: Property; featured?: boolean }) {
  const nightlyPrice = p.pricePeriod === 'per_night' ? p.price : Math.round(p.price / 365)
  const gradients: Record<string, string> = {
    penthouse: 'from-violet-950 via-purple-900 to-indigo-950',
    mansion: 'from-amber-950 via-amber-900 to-stone-950',
    apartment: 'from-slate-900 via-slate-800 to-zinc-900',
    duplex: 'from-emerald-950 via-emerald-900 to-teal-950',
    studio: 'from-fuchsia-950 via-purple-900 to-violet-950',
    self_contained: 'from-teal-950 via-teal-900 to-cyan-950',
    three_bedroom_flat: 'from-indigo-950 via-blue-900 to-blue-950',
  }
  const gradient = gradients[p.propertyType] || 'from-slate-900 to-zinc-900'
  const emoji = { penthouse: '🌆', mansion: '🏰', apartment: '🏢', duplex: '🏡', studio: '✨', self_contained: '🔑', three_bedroom_flat: '🏠' }[p.propertyType] || '🛎'

  // Fake star rating based on price
  const stars = p.price >= 150000 ? 5 : p.price >= 75000 ? 5 : p.price >= 40000 ? 4 : 4

  return (
    <div className={`card overflow-hidden group hover:border-gold-300 transition-all duration-300 ${featured ? 'ring-2 ring-gold-500/30' : ''}`}>
      {/* Image */}
      <div className={`relative bg-gradient-to-br ${gradient} overflow-hidden`} style={{ height: featured ? '220px' : '180px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-30">{emoji}</span>
        </div>
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {p.isFeatured && <span className="badge-gold text-[10px]">⭐ Featured</span>}
          {p.isNew && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-medium">New</span>}
          {p.virtualTour && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/80 text-white font-medium backdrop-blur-sm">360° Tour</span>}
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-obsidian-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gold-500/30">
            <div className="font-display text-lg font-medium text-gold-400">{fmt(nightlyPrice)}</div>
            <div className="text-[10px] text-white/50 text-center">per night</div>
          </div>
        </div>

        {/* Star rating */}
        <div className="absolute bottom-3 left-3">
          <Stars n={stars} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <Link href={`/properties/${p.slug}`}>
          <h3 className="font-display text-base font-medium text-obsidian-900 leading-snug mb-1 group-hover:text-gold-600 transition-colors line-clamp-1">{p.title}</h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-obsidian-400 mb-3">
          <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0" />
          {p.neighborhood}, Port Harcourt
        </div>

        {/* Specs row */}
        <div className="flex gap-3 mb-3 text-xs text-obsidian-500">
          {p.bedrooms > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.bedrooms} bed{p.bedrooms > 1 ? 's' : ''}</span>}
          {p.bathrooms > 0 && <span>{p.bathrooms} bath{p.bathrooms > 1 ? 's' : ''}</span>}
          <span>{p.sizeSqm} sqm</span>
        </div>

        {/* Top amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.amenities.slice(0, 4).map((a, i) => (
            <span key={i} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">
              {amenityIcons[a] || null}{a}
            </span>
          ))}
          {p.amenities.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-obsidian-400">+{p.amenities.length - 4}</span>
          )}
        </div>

        {/* Min stay + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-border">
          <div className="flex items-center gap-1 text-xs text-obsidian-400">
            <Clock className="w-3 h-3" /> Min. 1 night
          </div>
          <div className="flex gap-2">
            <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors">
              <MessageCircle className="w-4 h-4 text-white" />
            </a>
            <Link href={`/properties/${p.slug}`} className="btn-primary btn-sm px-3">
              Book <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
        {/* ── WHY NAYA SHORTLETS ── */}
        <section className="mt-20 mb-8">
          <div className="text-center mb-12">
            <span className="section-number">Why Choose Naya</span>
            <h2 className="section-title">The Smarter Way to Book</h2>
            <p className="section-desc mx-auto mt-4">Verified properties, transparent pricing, instant booking enquiries.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon:'🛡', title:'RSSPC Verified Hosts', desc:'Every agent and landlord is verified against the official RSSPC register. Your safety is our priority.' },
              { icon:'💬', title:'Direct WhatsApp Contact', desc:'No middlemen. Contact hosts directly via WhatsApp for instant responses and custom arrangements.' },
              { icon:'🔐', title:'Secure & Transparent', desc:'Clear pricing with no hidden fees. Full property details, real photos, and honest agent reviews.' },
            ].map((f,i) => (
              <div key={i} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-obsidian-900 mb-2">{f.title}</h3>
                <p className="text-sm text-obsidian-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LIST YOUR PROPERTY CTA ── */}
        <section className="mt-8 mb-8">
          <div className="bg-gradient-to-r from-obsidian-900 to-obsidian-800 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-light text-white mb-2">Have a property to list?</h3>
              <p className="text-white/50 text-sm">Join hosts earning from their properties on Naya.</p>
            </div>
            <a href="/portal/list" className="btn-primary gap-2 whitespace-nowrap flex-shrink-0">
              List Your Shortlet
            </a>
          </div>
        </section>

    </div>
  )
}

// ── Testimonial Card ──────────────────────────────────────────────────────────
function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="card p-6">
      <Stars n={t.rating} />
      <p className="text-obsidian-500 text-sm leading-relaxed my-4 italic">"{t.text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center flex-shrink-0">
          <span className="font-display text-sm font-medium text-obsidian-900">{t.name.charAt(0)}</span>
        </div>
        <div>
          <div className="font-semibold text-obsidian-900 text-sm">{t.name}</div>
          <div className="text-xs text-obsidian-400">{t.role}</div>
          <div className="flex items-center gap-1 text-xs text-gold-500 mt-0.5">
            <MapPin className="w-2.5 h-2.5" />{t.neighborhood}
          </div>
        </div>
      </div>
        {/* ── WHY NAYA SHORTLETS ── */}
        <section className="mt-20 mb-8">
          <div className="text-center mb-12">
            <span className="section-number">Why Choose Naya</span>
            <h2 className="section-title">The Smarter Way to Book</h2>
            <p className="section-desc mx-auto mt-4">Verified properties, transparent pricing, instant booking enquiries.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon:'🛡', title:'RSSPC Verified Hosts', desc:'Every agent and landlord is verified against the official RSSPC register. Your safety is our priority.' },
              { icon:'💬', title:'Direct WhatsApp Contact', desc:'No middlemen. Contact hosts directly via WhatsApp for instant responses and custom arrangements.' },
              { icon:'🔐', title:'Secure & Transparent', desc:'Clear pricing with no hidden fees. Full property details, real photos, and honest agent reviews.' },
            ].map((f,i) => (
              <div key={i} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-obsidian-900 mb-2">{f.title}</h3>
                <p className="text-sm text-obsidian-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LIST YOUR PROPERTY CTA ── */}
        <section className="mt-8 mb-8">
          <div className="bg-gradient-to-r from-obsidian-900 to-obsidian-800 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-light text-white mb-2">Have a property to list?</h3>
              <p className="text-white/50 text-sm">Join hosts earning from their properties on Naya.</p>
            </div>
            <a href="/portal/list" className="btn-primary gap-2 whitespace-nowrap flex-shrink-0">
              List Your Shortlet
            </a>
          </div>
        </section>

    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ShortletPage() {
  const [searchQuery, setSearchQuery]   = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedArea, setSelectedArea] = useState('all')
  const [priceFilter, setPriceFilter]   = useState<typeof priceFilters[0] | null>(null)
  const [minBeds, setMinBeds]           = useState(0)
  const [sortBy, setSortBy]             = useState('featured')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [poolOnly, setPoolOnly]         = useState(false)
  const [heroSlide, setHeroSlide]       = useState(0)

  const allShortlets: Property[] = [
    ...properties.filter(p => p.listingType === 'shortlet'),
    ...shortletListings,
  ]

  const featured = allShortlets.filter(p => p.isFeatured)

  const filtered = useMemo(() => {
    let r = allShortlets.filter(p => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (!matchCategory(p, activeCategory)) return false
      if (selectedArea !== 'all' && p.neighborhood !== selectedArea) return false
      if (priceFilter) {
        const nightly = p.pricePeriod === 'per_night' ? p.price : Math.round(p.price / 365)
        if (nightly < priceFilter.min || nightly > priceFilter.max) return false
      }
      if (minBeds > 0 && p.bedrooms < minBeds) return false
      if (verifiedOnly && !p.isVerified) return false
      if (poolOnly && !p.amenities.some(a => a.toLowerCase().includes('pool'))) return false
      return true
    })
    switch (sortBy) {
      case 'price_asc':  r = [...r].sort((a, b) => a.price - b.price); break
      case 'price_desc': r = [...r].sort((a, b) => b.price - a.price); break
      case 'popular':    r = [...r].sort((a, b) => b.views - a.views); break
      case 'newest':     r = [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      default:           r = [...r].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return r
  }, [searchQuery, activeCategory, selectedArea, priceFilter, minBeds, sortBy, verifiedOnly, poolOnly])

  const activeFilters = [activeCategory !== 'all', selectedArea !== 'all', priceFilter !== null, minBeds > 0, verifiedOnly, poolOnly].filter(Boolean).length

  const clearAll = () => {
    setActiveCategory('all'); setSelectedArea('all'); setPriceFilter(null)
    setMinBeds(0); setVerifiedOnly(false); setPoolOnly(false); setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gold-500/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px]" />

        <div className="page-container relative z-10 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                  <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Shortlets · Port Harcourt</span>
                </div>
                <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-[0.95] tracking-tight mb-6">
                  Hotel Quality.<br />
                  <span className="gold-text">Home Comfort.</span><br />
                  <span className="text-white/50">Your Price.</span>
                </h1>
                <p className="text-white/40 text-lg font-light leading-relaxed mb-8 max-w-md">
                  Fully furnished, verified shortlet apartments across Port Harcourt. From solo studio stays to luxury villa retreats.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-gold">
                    <Search className="w-5 h-5 text-obsidian-300 flex-shrink-0" />
                    <input className="flex-1 bg-transparent text-obsidian-900 placeholder-obsidian-300 outline-none text-sm"
                      placeholder="Search shortlets..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <button className="btn-primary px-6">Search</button>
                </div>
                <div className="flex items-center gap-6 text-white/40 text-sm">
                  {[`${allShortlets.length} Properties`, 'Verified Hosts', 'Instant Booking'].map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-gold-500" />{item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured property preview cards */}
              <div className="hidden lg:block relative">
                <div className="space-y-3">
                  {featured.slice(0, 3).map((p, i) => {
                    const nightlyPrice = p.pricePeriod === 'per_night' ? p.price : Math.round(p.price / 365)
                    return (
                      <div key={p.id} className={`flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transition-all ${i === 0 ? 'border-gold-500/30 bg-gold-500/5' : ''}`}>
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center text-2xl flex-shrink-0">
                          {['🏰', '🌆', '🏡'][i]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">{p.title}</div>
                          <div className="text-white/40 text-xs">{p.neighborhood} · {p.bedrooms} bed{p.bedrooms > 1 ? 's' : ''}</div>
                          <Stars n={5} />
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-display text-lg text-gold-400">{fmt(nightlyPrice)}</div>
                          <div className="text-white/30 text-xs">/night</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center shadow-gold">
                  <ArrowRight className="w-4 h-4 text-obsidian-900" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────── */}
      <section className="bg-surface-bg border-b border-surface-border">
        <div className="page-container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: 'All Hosts Verified', sub: 'RSSPC + ID checked', color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { icon: CheckCircle2, label: 'What You See = What You Get', sub: 'Photos are real, listings are live', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: Clock, label: 'Instant Confirmation', sub: 'Book via WhatsApp in minutes', color: 'text-gold-600', bg: 'bg-gold-50' },
              { icon: TrendingUp, label: 'Best Price Guarantee', sub: 'No hidden fees. Transparent pricing', color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-obsidian-900">{item.label}</div>
                  <div className="text-[10px] text-obsidian-400">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE CATEGORIES ────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Find Your Stay</span>
            <h2 className="section-title">Curated for Every Guest</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {experiences.map((e, i) => (
              <button key={i} onClick={() => setActiveCategory(e.tag)}
                className="card p-4 text-center hover:border-gold-300 transition-all group">
                <div className="text-3xl mb-2">{e.emoji}</div>
                <div className="font-semibold text-obsidian-900 text-xs mb-1">{e.title}</div>
                <div className="text-[10px] text-obsidian-400 leading-relaxed hidden md:block">{e.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN LISTINGS ────────────────────────────────────────────────── */}
      <section className="pb-20 bg-surface-bg">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ── SIDEBAR ────────────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">

                {/* Filters */}
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-medium text-obsidian-900 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-gold-500" />Filters
                    </h3>
                    {activeFilters > 0 && (
                      <button onClick={clearAll} className="text-xs text-gold-600 font-medium">Clear ({activeFilters})</button>
                    )}
                  </div>

                  <div className="space-y-5">
                    {/* Category */}
                    <div>
                      <label className="input-label">Stay Type</label>
                      <div className="space-y-1">
                        {categories.map(c => (
                          <button key={c.value} onClick={() => setActiveCategory(c.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all ${activeCategory === c.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            <span>{c.emoji}</span>{c.label}
                            {activeCategory === c.value && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Area */}
                    <div>
                      <label className="input-label">Neighbourhood</label>
                      <select className="input-field text-sm" value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
                        <option value="all">All Areas</option>
                        {neighborhoods.map(n => <option key={n.id} value={n.name}>{n.name}</option>)}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="input-label">Nightly Budget</label>
                      <div className="space-y-1.5">
                        {priceFilters.map((r, i) => (
                          <button key={i} onClick={() => setPriceFilter(priceFilter === r ? null : r)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-all ${priceFilter === r ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}>
                            {r.label} {priceFilter === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="input-label">Bedrooms</label>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(n => (
                          <button key={n} onClick={() => setMinBeds(n)}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium border ${minBeds === n ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-500 border-surface-border'}`}>
                            {n === 0 ? 'Any' : `${n}+`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3 pt-3 border-t border-surface-border">
                      {[
                        { label: 'Verified Hosts Only', val: verifiedOnly, set: setVerifiedOnly },
                        { label: 'Pool Available', val: poolOnly, set: setPoolOnly },
                      ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm text-obsidian-600">{t.label}</span>
                          <div onClick={() => t.set(!t.val)} className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${t.val ? 'bg-gold-500' : 'bg-obsidian-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${t.val ? 'translate-x-5' : 'translate-x-1'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Guide */}
                <div className="card p-5">
                  <h3 className="font-display text-base font-medium text-obsidian-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-500" /> How to Book
                  </h3>
                  <div className="space-y-3">
                    {[
                      { step: '1', text: 'Browse and pick your shortlet' },
                      { step: '2', text: 'Tap WhatsApp to contact the host' },
                      { step: '3', text: 'Confirm your dates and price' },
                      { step: '4', text: 'Pay via Paystack or bank transfer' },
                      { step: '5', text: 'Receive check-in details' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-obsidian-900 text-white text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">{s.step}</div>
                        <span className="text-xs text-obsidian-500">{s.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Host CTA */}
                <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10 text-center">
                    <div className="text-3xl mb-3">🏠</div>
                    <h3 className="font-display text-base font-medium text-white mb-2">Host Your Property</h3>
                    <p className="text-white/40 text-xs mb-4">Earn ₦1M+ per month listing your shortlet on Naya.</p>
                    <Link href="/portal" className="btn-primary btn-sm w-full justify-center">Start Hosting</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RESULTS ────────────────────────────────────────────────── */}
            <div className="lg:col-span-3">

              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-medium text-obsidian-900">
                    {filtered.length} Shortlet{filtered.length !== 1 ? 's' : ''} Available
                  </h2>
                  <p className="text-sm text-obsidian-400 mt-0.5">
                    {selectedArea !== 'all' ? selectedArea : 'All areas'} · Port Harcourt
                  </p>
                </div>
                <select className="input-field text-sm py-2" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Active Filters */}
              {activeFilters > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {activeCategory !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {categories.find(c => c.value === activeCategory)?.label}
                      <button onClick={() => setActiveCategory('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedArea !== 'all' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      <MapPin className="w-3 h-3" />{selectedArea}
                      <button onClick={() => setSelectedArea('all')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {priceFilter && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs text-gold-700">
                      {priceFilter.label} <button onClick={() => setPriceFilter(null)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {poolOnly && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-700">
                      <Waves className="w-3 h-3" /> Pool <button onClick={() => setPoolOnly(false)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}

              {/* Grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map(p => <ShortletCard key={p.id} p={p} featured={p.isFeatured} />)}
                </div>
              ) : (
                <div className="text-center py-20 card">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-3">No shortlets found</h3>
                  <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">Adjust your filters or search a different area.</p>
                  <button onClick={clearAll} className="btn-primary">Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICE GUIDE ─────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Pricing Intelligence</span>
            <h2 className="section-title">Average Nightly Rates by Area</h2>
            <p className="section-desc mx-auto">Based on verified Naya shortlet listings. Updated March 2026.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { area: 'GRA Phase 2',  budget: '₦35K–50K',  midrange: '₦50K–120K', luxury: '₦120K–350K+', tag: 'Most Premium', color: 'border-gold-500' },
              { area: 'Woji',         budget: '₦20K–40K',  midrange: '₦40K–90K',  luxury: '₦90K–200K',  tag: 'Best Value Luxury', color: 'border-emerald-500' },
              { area: 'Old GRA',      budget: '₦30K–55K',  midrange: '₦55K–130K', luxury: '₦130K–250K+', tag: 'Heritage & Character', color: 'border-amber-500' },
              { area: 'Trans Amadi',  budget: '₦25K–45K',  midrange: '₦45K–80K',  luxury: '₦80K–150K',  tag: 'Corporate Stays', color: 'border-blue-500' },
              { area: 'Rumuola',      budget: '₦15K–28K',  midrange: '₦28K–50K',  luxury: '₦50K–90K',   tag: 'Budget-Friendly', color: 'border-purple-500' },
              { area: 'Eleme',        budget: '₦30K–50K',  midrange: '₦50K–80K',  luxury: '₦80K–120K',  tag: 'Oil & Gas Zone', color: 'border-rose-500' },
            ].map((r, i) => (
              <div key={i} className={`card p-5 border-l-4 ${r.color}`}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-lg font-medium text-obsidian-900">{r.area}</h3>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-surface-subtle text-obsidian-500 border border-surface-border">{r.tag}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-surface-border">
                    <span className="text-xs text-obsidian-400">Budget</span>
                    <span className="font-mono text-xs text-obsidian-700">{r.budget}/night</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-surface-border">
                    <span className="text-xs text-obsidian-400">Mid-Range</span>
                    <span className="font-mono text-xs text-obsidian-700">{r.midrange}/night</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-xs text-obsidian-400">Luxury</span>
                    <span className="font-mono text-xs font-bold text-gold-600">{r.luxury}/night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg adire-bg">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Guest Reviews</span>
            <h2 className="section-title">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </div>
        </div>
      </section>

      {/* ── HOST CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div>
              <span className="section-number text-gold-500">For Property Owners</span>
              <h2 className="font-display text-4xl font-light text-white mb-4 leading-tight">
                Turn Your Property Into<br /><span className="gold-text">₦1M+ Per Month</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-6">
                List your furnished apartment as a Naya shortlet. We handle the verification, visibility, and guest trust — you handle check-ins and enjoy the income.
              </p>
              <div className="space-y-2 mb-8">
                {['Free to list your property', 'We market to oil & gas professionals', 'Verification builds guest trust', 'Transparent pricing, no hidden cuts'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
              <Link href="/portal" className="btn-primary btn-lg">Start Hosting on Naya <ArrowRight className="w-5 h-5" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '₦45K', label: 'Avg. nightly rate (1-bed GRA)' },
                { value: '₦1.2M', label: 'Avg. monthly host earnings' },
                { value: '94%', label: 'Occupancy rate (verified hosts)' },
                { value: '4.9★', label: 'Average guest rating' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-display text-3xl font-light text-gold-400 mb-1">{s.value}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-surface-bg">
        <div className="page-container text-center">
          <h2 className="font-display text-3xl font-medium text-obsidian-900 mb-3">Need Help Choosing?</h2>
          <p className="text-obsidian-400 mb-6 max-w-md mx-auto text-sm">Tell us your dates, budget, and purpose of stay — our team will recommend the perfect shortlet within 30 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
            <a href="tel:+2348168117004" className="btn-secondary">
              <Phone className="w-4 h-4" /> Call Us
            </a>
          </div>
        </div>
      </section>

    </div>
  )
