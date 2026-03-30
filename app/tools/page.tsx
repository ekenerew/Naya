'use client'
import Link from 'next/link'
import {
  Shield, Star, Ruler, Droplets, MessageCircle,
  ArrowRight, Lock, TrendingUp, Sparkles, Users,
  CheckCircle2, Zap
} from 'lucide-react'

const TOOLS = [
  {
    id:'escrow',
    icon: Shield,
    emoji:'🔐',
    color:'from-emerald-500 to-emerald-600',
    tag:'LIVE',
    tagColor:'bg-emerald-500',
    title:'Naya Escrow',
    subtitle:'Secure Property Payments',
    desc:'Pay rent or buy property safely. We hold your funds until you inspect and approve. Nigeria\'s first property escrow — completely free for buyers.',
    features:['48-hour inspection window','Full refund if property misrepresented','1% fee to landlord only','Legally binding agreement'],
    href:'/escrow',
    cta:'Start Secure Payment',
  },
  {
    id:'credit-score',
    icon: Star,
    emoji:'⭐',
    color:'from-gold-500 to-gold-600',
    tag:'Q3 2026',
    tagColor:'bg-gold-500',
    title:'Naya Credit Score',
    subtitle:'Tenant Reputation System',
    desc:'Build a verifiable rental history. Trusted tenants get priority access to premium listings, waived deposits, and faster approvals from landlords.',
    features:['Scores 0–850 based on payment history','Priority access to premium listings','Waived security deposit option','Share score with landlords'],
    href:'/credit-score',
    cta:'Join Waitlist',
  },
  {
    id:'whatsapp',
    icon: MessageCircle,
    emoji:'💬',
    color:'from-emerald-600 to-green-600',
    tag:'LIVE',
    tagColor:'bg-emerald-500',
    title:'WhatsApp Booking',
    subtitle:'Instant Viewing Requests',
    desc:'Book property viewings in one tap. A pre-formatted WhatsApp message with your details, preferred time and property info is sent directly to the agent.',
    features:['No forms to fill','Pre-formatted message','Direct agent contact','Works on any property listing'],
    href:'/search',
    cta:'Browse Properties',
  },
  {
    id:'flood-map',
    icon: Droplets,
    emoji:'🌊',
    color:'from-blue-500 to-blue-600',
    tag:'LIVE',
    tagColor:'bg-blue-500',
    title:'Flood Risk Map',
    subtitle:'Port Harcourt Flood Zones',
    desc:'Interactive map showing flood risk levels for every neighbourhood in Port Harcourt. Based on REMA data and rainy season observations. Updated annually.',
    features:['5-tier risk classification','All PH neighbourhoods covered','Click for area details','Visible on every listing'],
    href:'/neighborhoods',
    cta:'View Flood Map',
  },
  {
    id:'ar-measure',
    icon: Ruler,
    emoji:'📐',
    color:'from-purple-500 to-purple-600',
    tag:'BETA',
    tagColor:'bg-purple-500',
    title:'AR Measurement',
    subtitle:'Measure Rooms With Your Camera',
    desc:'Point your phone camera at any room. Tap two points to measure the distance instantly. No tape measure needed — perfect for checking furniture fits.',
    features:['Works on any phone camera','Calibration for accuracy','Multiple measurements at once','Share results via WhatsApp'],
    href:null,
    cta:'Launch AR Camera',
    isAR: true,
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero */}
      <section className="relative bg-obsidian-900 overflow-hidden py-16">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-25" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/8 rounded-full blur-[100px]" />
        <div className="relative z-10 page-container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-sm font-semibold mb-5">
            <Sparkles className="w-4 h-4" />Naya Property Tools — Tier 2
          </div>
          <h1 className="font-display text-5xl font-light text-white mb-4">
            Tools That Make<br /><span className="gold-text">Property Easier</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From secure payments to AR room measurement — tools built specifically for Nigerian property seekers, tenants, landlords and investors.
          </p>
        </div>
      </section>

      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map(tool => (
            <div key={tool.id} className="card overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Card header */}
              <div className={`p-6 bg-gradient-to-br ${tool.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{tool.emoji}</div>
                    <span className={`px-3 py-1 ${tool.tagColor} text-white text-[10px] font-black rounded-full`}>
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-medium text-white mb-1">{tool.title}</h3>
                  <p className="text-white/70 text-sm font-medium">{tool.subtitle}</p>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6">
                <p className="text-sm text-obsidian-600 leading-relaxed mb-5">{tool.desc}</p>
                <ul className="space-y-2 mb-6">
                  {tool.features.map((f,i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-obsidian-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                {tool.href ? (
                  <Link href={tool.href}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-2xl font-semibold text-sm transition-all group-hover:gap-3">
                    {tool.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link href="/properties" className="flex items-center justify-center gap-2 w-full py-3 bg-obsidian-900 hover:bg-obsidian-800 text-white rounded-2xl font-semibold text-sm transition-all">
                    {tool.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon teaser */}
        <div className="mt-12 p-8 bg-obsidian-900 rounded-3xl relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
          <div className="relative z-10">
            <Sparkles className="w-10 h-10 text-gold-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-light text-white mb-3">More Tools Coming</h2>
            <p className="text-white/50 text-sm max-w-lg mx-auto mb-6">
              Tier 3 features in development: Naya Mortgage Connect, Corporate Relocation Portal, Live Property Tours, Investment Calculator, and the Naya Property Index.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Mortgage Connect','Relocation Portal','Live Tours','Investment Calculator','Property Index','Multilingual'].map((f,i) => (
                <span key={i} className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-white/50 text-xs font-medium">
                  🔜 {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
