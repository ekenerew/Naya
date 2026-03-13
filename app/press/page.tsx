import Link from 'next/link'
import { Download, Mail, ArrowRight, ExternalLink } from 'lucide-react'

const pressReleases = [
  {
    date: 'March 2026',
    title: 'Naya Launches Nigeria\'s First Fully Verified Property Marketplace in Port Harcourt',
    summary: 'Naya Real Estate Technologies Ltd officially launches its platform in Port Harcourt, bringing KYC-verified agents, transparent pricing, and virtual property tours to Rivers State.',
    tag: 'Launch',
  },
  {
    date: 'January 2026',
    title: 'Naya Announces ₦70 Million Seed Round to Tackle Nigeria\'s Property Fraud Crisis',
    summary: 'The Port Harcourt-based proptech startup is raising its first institutional round to build out verification infrastructure and expand to three new cities by 2027.',
    tag: 'Funding',
  },
  {
    date: 'November 2025',
    title: 'Naya Partners with RSSPC to Establish Nigeria\'s First Agent Verification Standard',
    summary: 'Naya and the Rivers State Real Estate Practitioners Council partner to create a digital verification system for licensed agents operating in Port Harcourt.',
    tag: 'Partnership',
  },
]

const facts = [
  { label: 'Founded', value: '2025' },
  { label: 'HQ', value: 'Port Harcourt, Nigeria' },
  { label: 'Founder', value: 'Ekene Akpapunam' },
  { label: 'Seed Round', value: '₦70,000,000' },
  { label: 'Launch City', value: 'Port Harcourt' },
  { label: 'Category', value: 'PropTech / Marketplace' },
]

const coverage = [
  { outlet: 'TechCabal', headline: 'Nigerian Startup Naya is Taking on Property Fraud One Verified Listing at a Time', date: 'March 2026' },
  { outlet: 'BusinessDay Nigeria', headline: 'Port Harcourt Startup Brings Transparency to Nigeria\'s Opaque Property Market', date: 'March 2026' },
  { outlet: 'Techpoint Africa', headline: 'Meet Naya, the Proptech Platform Giving Nigerian Renters a Fair Deal', date: 'February 2026' },
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-surface-bg">

      {/* HERO */}
      <section className="relative bg-obsidian-900 overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Newsroom</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-5">
            Naya in the<br />
            <span className="gold-text">Press</span>
          </h1>
          <p className="text-white/40 text-lg font-light max-w-xl mx-auto leading-relaxed mb-8">
            Press releases, media assets, and company information for journalists and media organisations.
          </p>
          <a href="mailto:press@naya.ng" className="btn-primary btn-lg">
            <Mail className="w-5 h-5" /> Contact Press Team
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* PRESS KIT + CONTACT */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">

            {/* Press Kit Download */}
            <div className="lg:col-span-2 card p-8 bg-obsidian-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
              <div className="relative z-10">
                <div className="text-4xl mb-4">📦</div>
                <h2 className="font-display text-3xl font-light text-white mb-3">Download the Press Kit</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Includes the Naya logo suite (SVG, PNG, dark and light variants), founder headshot, product screenshots, brand colour codes, and boilerplate company description.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="mailto:press@naya.ng?subject=Press Kit Request" className="btn-primary">
                    <Download className="w-4 h-4" /> Request Press Kit
                  </a>
                  <a href="mailto:press@naya.ng" className="btn-ghost border-white/20 text-white/60 hover:text-white">
                    Email Press Team
                  </a>
                </div>
              </div>
            </div>

            {/* Press Contact */}
            <div className="card p-6">
              <h3 className="font-display text-lg font-medium text-obsidian-900 mb-4">Press Contact</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-mono text-xs text-obsidian-400 uppercase tracking-widest mb-1">Media Enquiries</div>
                  <a href="mailto:press@naya.ng" className="text-gold-600 font-medium text-sm hover:text-gold-500 transition-colors">press@naya.ng</a>
                </div>
                <div>
                  <div className="font-mono text-xs text-obsidian-400 uppercase tracking-widest mb-1">Response Time</div>
                  <p className="text-sm text-obsidian-600">Within 4 hours on business days</p>
                </div>
                <div>
                  <div className="font-mono text-xs text-obsidian-400 uppercase tracking-widest mb-1">Urgent Line</div>
                  <a href="tel:+2348168117004" className="text-sm text-obsidian-600 hover:text-gold-600 transition-colors">+234 816 811 7004</a>
                </div>
                <div className="pt-2 border-t border-surface-border">
                  <div className="font-mono text-xs text-obsidian-400 uppercase tracking-widest mb-1">Founder Available For</div>
                  <p className="text-xs text-obsidian-500 leading-relaxed">Interviews, podcast appearances, panel discussions on Nigerian PropTech, housing market, and startup ecosystem.</p>
                </div>
              </div>
            </div>
          </div>

          {/* COMPANY FACTS */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-6">Company at a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {facts.map((f, i) => (
                <div key={i} className="card p-4 text-center">
                  <div className="font-mono text-xs text-obsidian-400 uppercase tracking-widest mb-2">{f.label}</div>
                  <div className="font-display text-base font-medium text-obsidian-900">{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BOILERPLATE */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">About Naya — Approved Boilerplate</h2>
            <div className="card p-6 bg-surface-subtle border-l-4 border-gold-500">
              <p className="text-obsidian-600 leading-relaxed text-sm italic">
                "Naya Real Estate Technologies Ltd is Nigeria's most trusted property marketplace, headquartered in Port Harcourt, Rivers State. Founded in 2025 by chemical engineer and process specialist Ekene Akpapunam, Naya was built to eliminate fake listings, ghost agents, and pricing opacity from the Nigerian property market. The platform features KYC-verified agents, RSSPC certification checks, transparent market data, and virtual property tours — all designed to protect property seekers and elevate the professionalism of legitimate agents. Naya launched publicly in Port Harcourt in 2026 and is expanding to Lagos and Abuja by 2027."
              </p>
              <p className="text-xs text-obsidian-400 mt-3">Please use this boilerplate in full. Edits require prior approval from press@naya.ng.</p>
            </div>
          </div>

          {/* PRESS RELEASES */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-6">Press Releases</h2>
            <div className="space-y-4">
              {pressReleases.map((pr, i) => (
                <div key={i} className="card p-6 hover:border-gold-200 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-200 font-medium">{pr.tag}</span>
                        <span className="font-mono text-xs text-obsidian-400">{pr.date}</span>
                      </div>
                      <h3 className="font-display text-lg font-medium text-obsidian-900 mb-2">{pr.title}</h3>
                      <p className="text-sm text-obsidian-500 leading-relaxed">{pr.summary}</p>
                    </div>
                    <a href="mailto:press@naya.ng" className="text-gold-500 hover:text-gold-600 flex-shrink-0 mt-1">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MEDIA COVERAGE */}
          <div>
            <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-6">Media Coverage</h2>
            <div className="space-y-3">
              {coverage.map((c, i) => (
                <div key={i} className="card p-5 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs font-bold text-obsidian-900 bg-surface-subtle px-2 py-0.5 rounded">{c.outlet}</span>
                      <span className="font-mono text-xs text-obsidian-400">{c.date}</span>
                    </div>
                    <p className="text-sm text-obsidian-600">{c.headline}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-obsidian-300 flex-shrink-0" />
                </div>
              ))}
            </div>
            <p className="text-xs text-obsidian-400 mt-4 text-center">Coverage links will be added as articles are published.</p>
          </div>
        </div>
      </section>

    </div>
  )
}
