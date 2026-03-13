'use client'
import Link from 'next/link'
import { Shield, TrendingUp, Users, Zap, ArrowRight, CheckCircle2, MapPin } from 'lucide-react'

const timeline = [
  { year: '2023', title: 'The Problem Became Personal', desc: 'Ekene Akpapunam, a chemical engineer working in Port Harcourt\'s oil & gas sector, watched friends and colleagues lose hundreds of thousands of naira to fake listings, unverified agents, and opaque rental agreements. The same story repeated itself across the city — honest people being exploited simply because there was no trusted system.' },
  { year: '2024', title: 'The Idea Takes Shape', desc: 'After years in process engineering — where precision, verification, and data integrity are non-negotiable — Ekene applied the same discipline to real estate. He began building the infrastructure for a property marketplace that would put trust at the center of every transaction.' },
  { year: '2025', title: 'Port Harcourt First', desc: 'A strategic decision: launch in Port Harcourt, not Lagos. Lower competition, a high-demand oil & gas housing market, an accessible agent community, and a city that deserves a premium property experience. Naya begins onboarding its first RSSPC-verified agents.' },
  { year: '2026', title: 'Naya Goes Live', desc: 'Nigeria\'s most sophisticated property marketplace launches publicly. Verified listings, virtual tours, RSSPC-certified agents, and real-time market data — all built to the standard Port Harcourt deserves.' },
]

const values = [
  { icon: Shield, title: 'Trust is Non-Negotiable', desc: 'Every agent on Naya is RSSPC-verified and background-checked before they can list a single property. Fake listings and ghost agents have no place on this platform.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: TrendingUp, title: 'Data Over Guesswork', desc: 'Property seekers deserve real pricing data, not inflated figures. We publish market trends, neighbourhood price histories, and demand signals so every decision is informed.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Users, title: 'People First', desc: 'Behind every search is a family looking for safety, a professional seeking stability, or an investor building a future. We never forget that this is deeply personal.', color: 'text-gold-600', bg: 'bg-gold-50' },
  { icon: Zap, title: 'Technology That Serves', desc: 'Virtual tours, smart search, instant alerts — technology should remove friction, not add it. Everything we build is designed for how Nigerians actually live and work.', color: 'text-purple-500', bg: 'bg-purple-50' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-bg">

      <section className="relative bg-obsidian-900 overflow-hidden pt-20 pb-28">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-60" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/8 blur-[120px]" />
        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Our Story</span>
            </div>
            <h1 className="font-display font-light text-white leading-tight tracking-tight mb-8">
              <span className="block text-5xl md:text-7xl">Built Because the</span>
              <span className="block text-5xl md:text-7xl gold-text">System Was Broken</span>
            </h1>
            <p className="text-white/50 text-xl font-light leading-relaxed max-w-2xl mx-auto">
              Naya was born from frustration — the frustration of watching honest Nigerians lose money, time, and dignity to a property market that protected agents over people. We decided to build something better.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="section-number">The Problem We Saw</span>
              <h2 className="section-title mb-6">Nigerian Property Seekers Deserved Better</h2>
              <div className="space-y-5 text-obsidian-500 leading-relaxed">
                <p>Nigeria property market is one of the largest on the African continent yet for decades it has operated in the shadows. Listings with no photos. Agents who vanish after collecting fees. Properties that exist only in WhatsApp forwards.</p>
                <p>In Port Harcourt, one of Nigeria most economically significant cities, the problem was especially acute. Oil workers relocating from abroad. Young professionals starting families. Diaspora returnees investing in their homeland. All navigating a market designed to exploit their lack of information.</p>
                <p className="text-obsidian-700 font-medium">We believed that access to verified information about properties, agents, and pricing was not a luxury. It was a right.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '😤', stat: '68%', label: 'of renters report paying fees to agents who provided no real service' },
                { emoji: '🏚', stat: '1 in 3', label: 'listings on unverified platforms are fake or misrepresented' },
                { emoji: '💸', stat: '₦500K+', label: 'average lost per household to fraudulent property deals annually' },
                { emoji: '📍', stat: '0', label: 'standardised property platforms in PH before Naya' },
              ].map((item, i) => (
                <div key={i} className="card p-5 text-center">
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <div className="font-display text-3xl font-medium text-gold-600 mb-2">{item.stat}</div>
                  <p className="text-xs text-obsidian-400 leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center shadow-gold-lg">
                  <span className="font-display text-7xl font-medium text-obsidian-900">EA</span>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-obsidian-800 border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-400" />
                    <span className="text-white text-sm font-medium">Port Harcourt, Nigeria</span>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 bg-gold-500 rounded-2xl px-4 py-3 shadow-gold">
                  <div className="text-obsidian-900 text-sm font-semibold">Founder and CEO</div>
                </div>
              </div>
            </div>
            <div>
              <span className="section-number text-gold-500">Meet the Founder</span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6 leading-tight">Ekene<br /><span className="gold-text">Akpapunam</span></h2>
              <div className="space-y-4 text-white/50 leading-relaxed">
                <p>Ekene is a Chemical Engineer with over a decade of experience in process control and industrial systems at Guinness Nigeria and International Breweries in Port Harcourt. He understands what it means to build systems where precision and trust are non-negotiable.</p>
                <p>That same engineering discipline — verify everything, trust the data, eliminate waste — became the founding philosophy of Naya.</p>
                <p className="text-white/70 font-medium">I watched too many good people lose money they could not afford to lose. The technology to fix this existed. Someone just needed to build it for Nigeria.</p>
                <p className="text-white/40 italic text-sm">— Ekene Akpapunam, Founder and CEO</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {['B.Sc Chemical Engineering UNIBEN', 'Process Control Specialist', 'Proptech Founder', 'Port Harcourt'].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-white/8 text-white/50 border border-white/10">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-14">
            <span className="section-number">Our Journey</span>
            <h2 className="section-title">From Frustration to Platform</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500 via-gold-300 to-transparent hidden md:block" />
              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-6 md:gap-8 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-obsidian-900 flex items-center justify-center shadow-xl z-10">
                      <span className="font-mono text-xs font-bold text-gold-400">{item.year}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-display text-xl font-medium text-obsidian-900 mb-2">{item.title}</h3>
                      <p className="text-obsidian-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-bg adire-bg">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card p-8 border-l-4 border-gold-500">
              <div className="text-3xl mb-5">🎯</div>
              <div className="font-mono text-xs text-gold-500 tracking-widest uppercase mb-3">Our Mission</div>
              <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-4">Make Nigerian Property Simple, Trustworthy, and Data-Driven</h3>
              <p className="text-obsidian-500 leading-relaxed text-sm">To give every Nigerian property seeker access to verified information, trusted agents, and transparent pricing. No more guesswork. No more exploitation.</p>
            </div>
            <div className="card p-8 border-l-4 border-obsidian-900">
              <div className="text-3xl mb-5">🌍</div>
              <div className="font-mono text-xs text-obsidian-500 tracking-widest uppercase mb-3">Our Vision</div>
              <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-4">Nigeria Leading Property Marketplace, City by City</h3>
              <p className="text-obsidian-500 leading-relaxed text-sm">Starting in Port Harcourt, expanding to Lagos, Abuja, Benin City, and Ibadan — building the property data infrastructure that Nigeria banks, developers, and millions of families will rely on for generations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">What We Stand For</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div key={i} className="card p-6">
                <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mb-5`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-3">{v.title}</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="section-number">Our Commitment</span>
              <h2 className="section-title">The Naya Standard</h2>
            </div>
            <div className="space-y-4">
              {[
                'Every agent on Naya is RSSPC-verified before listing a single property',
                'Every listing is manually reviewed for accuracy before going live',
                'Pricing data is published openly so seekers can negotiate with confidence',
                'Agent reviews are verified — only genuine tenants and buyers can leave feedback',
                'We will never take money from developers to manipulate search rankings',
                'Your personal data is protected under NDPR and never sold to third parties',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-surface-subtle rounded-2xl border border-surface-border">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-obsidian-600 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-5 leading-tight">Join the Movement<br /><span className="gold-text">to Fix Nigerian Property</span></h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto font-light">Whether you are looking for a home, listing a property, or building a career as an agent — Naya is where trust begins.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn-primary btn-lg">Find a Property</Link>
            <Link href="/portal" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">List as Agent <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

    </div>
  )
}
