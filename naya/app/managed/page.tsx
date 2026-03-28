'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Shield, Star, CheckCircle2, ArrowRight, Phone,
  Mail, MapPin, Home, TrendingUp, Camera, FileText,
  Users, Clock, Award, Sparkles, ChevronDown,
  Loader2, AlertCircle, X, MessageCircle, Building2,
  BadgeCheck, Banknote, Eye, Calendar, Handshake,
  CircleDollarSign, HelpCircle, Plus
} from 'lucide-react'

// ── Pricing packages ───────────────────────────────────────────
const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    badge: null,
    price: '₦50,000',
    priceNote: 'one-time listing fee',
    commission: '5% on completion',
    color: 'border-surface-border',
    headerBg: 'bg-surface-subtle',
    ideal: 'Landlords renting 1–2 properties',
    features: [
      'Professional property photography',
      'Listed on Naya with featured placement',
      'Tenant screening & verification',
      'Lease agreement preparation',
      'Up to 3 months market exposure',
      'WhatsApp enquiry management',
    ],
    notIncluded: [
      'Legal & title document review',
      'Property valuation report',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    badge: 'MOST POPULAR',
    price: '₦100,000',
    priceNote: 'one-time listing fee',
    commission: '5% on completion',
    color: 'border-gold-400',
    headerBg: 'bg-gradient-to-br from-gold-500 to-gold-400',
    ideal: 'Landlords, homeowners & developers',
    features: [
      'Everything in Starter',
      'Professional HDR photography + video',
      '360° virtual tour creation',
      'Property valuation report (Naya Score™)',
      'Legal document review & title check',
      'Shortlisting & interview of tenants/buyers',
      'Negotiation & deal management',
      '6 months market exposure',
      'Dedicated Naya account manager',
    ],
    notIncluded: [],
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'BEST VALUE',
    price: '₦200,000',
    priceNote: 'all-inclusive',
    commission: '3% on completion',
    color: 'border-obsidian-900',
    headerBg: 'bg-obsidian-900',
    ideal: 'Developers, estates & commercial owners',
    features: [
      'Everything in Standard',
      'Diaspora & corporate marketing campaign',
      'Listing on PropertyPro & NigeriaPropertyCentre',
      'Social media promotion (Instagram, LinkedIn)',
      'Open house coordination',
      'Full legal representation (CAC, survey)',
      'Escrow payment coordination',
      '12 months market exposure',
      'Monthly performance reports',
      'After-sale/rent support for 3 months',
    ],
    notIncluded: [],
  },
]

const PROCESS_STEPS = [
  {
    step: '01',
    icon: Phone,
    title: 'Submit Your Request',
    desc: 'Fill out the form below or call us. Tell us about your property, your target price, and your preferred timeline.',
    duration: '5 minutes',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    step: '02',
    icon: Eye,
    title: 'Property Assessment',
    desc: 'Our team visits your property, conducts a Naya Score™ valuation, and recommends the best listing strategy.',
    duration: 'Within 48 hours',
    color: 'text-gold-600',
    bg: 'bg-gold-50',
  },
  {
    step: '03',
    icon: Camera,
    title: 'Professional Photography',
    desc: 'We shoot HDR photos, create a walkthrough video and optional 360° virtual tour — making your property irresistible.',
    duration: '1–2 days',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'We Market It',
    desc: 'Your listing goes live on Naya with Featured placement, plus partner platforms and our targeted WhatsApp broadcast to 10,000+ buyers and renters.',
    duration: 'Goes live in 24 hrs',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    step: '05',
    icon: Users,
    title: 'We Handle Enquiries',
    desc: 'Naya filters all enquiries, screens serious prospects, and presents you only qualified leads. No time-wasters.',
    duration: 'Ongoing',
    color: 'text-obsidian-600',
    bg: 'bg-obsidian-50',
  },
  {
    step: '06',
    icon: Handshake,
    title: 'Deal Closed — You Collect',
    desc: 'We negotiate on your behalf, prepare agreements, coordinate payment and hand over keys. You receive your money minus our agreed fee.',
    duration: 'On completion',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
]

const FAQS = [
  {
    q: 'How is Naya Managed different from listing on Naya myself?',
    a: 'With Naya Managed, you hand everything over to us. We handle photography, marketing, enquiries, negotiations and paperwork. You simply wait for a deal to close and collect your money. Perfect if you\'re busy, live abroad, or just don\'t want the hassle.',
  },
  {
    q: 'What properties can be listed under Naya Managed?',
    a: 'Any property in Port Harcourt and Rivers State — residential (apartments, duplexes, houses), commercial (offices, shops, warehouses), land, and shortlets. We can also handle new development sales for developers.',
  },
  {
    q: 'What if my property doesn\'t sell or rent within the listing period?',
    a: 'We will re-evaluate the strategy — pricing, photography, or marketing approach — at no extra charge. For Standard and Premium clients, we extend the listing period and escalate to our diaspora and corporate networks.',
  },
  {
    q: 'Do I still pay the listing fee if the property doesn\'t sell?',
    a: 'Yes — the listing fee covers our work (photography, valuation, marketing). The commission is only payable on successful completion of a deal.',
  },
  {
    q: 'How do I receive my money?',
    a: 'For sales: buyer pays into an escrow account, we deduct our fee, and transfer the balance to you. For rentals: tenant pays advance rent directly or via Naya, we deduct our commission and remit the rest within 24 hours.',
  },
  {
    q: 'Can I use Naya Managed for a shortlet property?',
    a: 'Yes. For shortlets, we handle the listing, photography, guest screening, calendar management and reviews. Our shortlet management fee is 15% of each booking — no upfront listing fee.',
  },
  {
    q: 'Is Naya RSSPC registered?',
    a: 'Yes. Naya Real Estate Technologies Ltd operates under verified RSSPC-registered agents. All our transactions comply with Rivers State real estate regulations and Nigerian property law.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Engr. Chukwuemeka Obi',
    title: 'Lagos-based landlord, property in Woji',
    text: 'I live in Lagos and had a 4-bedroom duplex sitting empty in Woji for 8 months. Naya managed everything — photos, tenants, agreement — while I was in Lagos. Signed in 3 weeks.',
    rating: 5,
    service: 'Rental Management',
  },
  {
    name: 'Mrs. Adaeze Nwosu',
    title: 'Property developer, GRA Phase 2',
    text: 'Sold 3 units of my new development through Naya Premium. The diaspora marketing brought buyers I never would have reached. Professional from start to finish.',
    rating: 5,
    service: 'Sale Management',
  },
  {
    name: 'Dr. Tobenna Eze',
    title: 'Shortlet property owner, Old GRA',
    text: 'I work offshore 3 weeks a month. Naya manages my shortlet — guests, cleaning, reviews. My occupancy went from 40% to 85% in 2 months.',
    rating: 5,
    service: 'Shortlet Management',
  },
]

// ── Form ───────────────────────────────────────────────────────
type FormData = {
  firstName: string; lastName: string; email: string; phone: string
  serviceType: string; propertyType: string; neighborhood: string
  address: string; estimatedValue: string; bedrooms: string
  description: string; preferredPackage: string; hearAboutUs: string
}

const INIT_FORM: FormData = {
  firstName:'', lastName:'', email:'', phone:'',
  serviceType:'rent', propertyType:'', neighborhood:'',
  address:'', estimatedValue:'', bedrooms:'',
  description:'', preferredPackage:'standard', hearAboutUs:'',
}

export default function ManagedPage() {
  const [form, setForm]       = useState<FormData>(INIT_FORM)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activePackage, setActivePackage] = useState('standard')

  const set = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.neighborhood) {
      setError('Please fill in all required fields'); return
    }
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/managed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, preferredPackage: activePackage }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Submission failed'); return }
      setSuccess(true)
    } catch { setError('Network error. Please call us directly at +234 816 811 7004.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-25" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gold-500/6 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gold-500/4 blur-[100px]" />

        <div className="relative z-10 page-container py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />Naya Managed — Hassle-Free Property Services
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-tight mb-6">
              We Sell or Rent<br />
              <span className="gold-text">Your Property.</span><br />
              <span className="text-white/60">You Relax.</span>
            </h1>

            <p className="text-white/50 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Don't have time to deal with agents, tenants, or paperwork?
              Naya's professional team handles everything — photography, marketing,
              tenant screening, negotiation and legal — for a transparent flat fee plus commission.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#get-started"
                className="btn-primary px-8 py-4 text-base gap-2 justify-center">
                Get Started Today <ArrowRight className="w-5 h-5" />
              </a>
              <a href="tel:+2348168117004"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all">
                <Phone className="w-5 h-5" />Call: +234 816 811 7004
              </a>
            </div>

            {/* Trust stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { value: '48 hrs', label: 'Average to go live' },
                { value: '94%', label: 'Success rate' },
                { value: '₦0', label: 'Hidden fees' },
                { value: '10K+', label: 'Buyer network' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="font-display text-2xl font-medium text-gold-400">{s.value}</p>
                  <p className="text-white/40 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Who This Is For</span>
            <h2 className="section-title">Naya Managed Is Perfect For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon:'✈️', title:'Diaspora Property Owners', desc:'You own property in Port Harcourt but live abroad. You need a trusted team to manage everything — viewings, tenants, payments — without you flying in.' },
              { icon:'💼', title:'Busy Professionals', desc:'You work in oil & gas, government, or business and simply don\'t have time to chase tenants, show properties, or deal with legal paperwork.' },
              { icon:'🏗', title:'Developers & Investors', desc:'You have multiple units or a new development to sell. You want maximum exposure and professional sales management without building your own team.' },
              { icon:'👴', title:'Inherited Property Owners', desc:'You\'ve inherited property and don\'t know where to start. Naya handles everything from valuation to final sale, end-to-end.' },
              { icon:'🏠', title:'First-Time Landlords', desc:'This is your first rental property. You don\'t know the legal requirements, tenant screening, or standard market rates. Naya guides and handles it all.' },
              { icon:'🛋', title:'Shortlet Hosts', desc:'You want to earn from your property as a shortlet but don\'t want to manage guest bookings, check-ins, and reviews yourself.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-surface-border hover:border-gold-300 hover:shadow-md transition-all group">
                <span className="text-4xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-obsidian-900 mb-1.5 group-hover:text-gold-600 transition-colors">{item.title}</h3>
                  <p className="text-sm text-obsidian-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-16 bg-surface-bg">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">The Process</span>
            <h2 className="section-title">How Naya Managed Works</h2>
            <p className="text-obsidian-400 max-w-xl mx-auto mt-3">From submission to deal close — we handle every step professionally.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROCESS_STEPS.map((s, i) => (
              <div key={i} className="card p-6 relative overflow-hidden group hover:shadow-lg transition-all">
                <div className="absolute top-4 right-4 font-display text-5xl font-bold text-surface-border group-hover:text-gold-100 transition-colors">
                  {s.step}
                </div>
                <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <h3 className="font-semibold text-obsidian-900 mb-2">{s.title}</h3>
                <p className="text-sm text-obsidian-500 leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-obsidian-300" />
                  <span className="text-xs text-obsidian-400 font-medium">{s.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Transparent Pricing</span>
            <h2 className="section-title">Simple, Fair, No Surprises</h2>
            <p className="text-obsidian-400 max-w-xl mx-auto mt-3">
              Flat listing fee + commission only on successful deal. No hidden charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PACKAGES.map(pkg => (
              <div key={pkg.id}
                className={`relative rounded-3xl border-2 overflow-hidden transition-all hover:shadow-xl ${pkg.color} ${activePackage === pkg.id ? 'scale-105 shadow-xl' : ''}`}
                onClick={() => setActivePackage(pkg.id)}>

                {/* Popular badge */}
                {pkg.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${pkg.id === 'standard' ? 'bg-gold-500 text-obsidian-900' : 'bg-obsidian-900 text-white'}`}>
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className={`p-6 ${pkg.headerBg}`}>
                  <h3 className={`font-display text-2xl font-medium mb-1 ${pkg.id === 'premium' ? 'text-white' : pkg.id === 'standard' ? 'text-obsidian-900' : 'text-obsidian-900'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-xs mb-4 ${pkg.id === 'premium' ? 'text-white/60' : 'text-obsidian-500'}`}>
                    {pkg.ideal}
                  </p>
                  <div>
                    <span className={`font-display text-4xl font-bold ${pkg.id === 'premium' ? 'text-white' : pkg.id === 'standard' ? 'text-obsidian-900' : 'text-obsidian-900'}`}>
                      {pkg.price}
                    </span>
                    <span className={`text-xs ml-2 ${pkg.id === 'premium' ? 'text-white/50' : 'text-obsidian-400'}`}>
                      {pkg.priceNote}
                    </span>
                  </div>
                  <div className={`mt-1 text-xs font-semibold ${pkg.id === 'premium' ? 'text-gold-300' : 'text-gold-600'}`}>
                    + {pkg.commission}
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 bg-white">
                  <ul className="space-y-2.5">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-obsidian-700">{f}</span>
                      </li>
                    ))}
                    {pkg.notIncluded.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 opacity-40">
                        <X className="w-4 h-4 text-obsidian-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-obsidian-500 line-through">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => { setActivePackage(pkg.id); document.getElementById('get-started')?.scrollIntoView({ behavior:'smooth' }) }}
                    className={`w-full mt-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
                      activePackage === pkg.id
                        ? 'bg-obsidian-900 text-white'
                        : 'bg-surface-subtle text-obsidian-700 hover:bg-obsidian-100'
                    }`}>
                    {activePackage === pkg.id ? '✓ Selected' : `Choose ${pkg.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Shortlet note */}
          <div className="mt-8 max-w-2xl mx-auto p-5 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <p className="text-sm text-blue-700">
              <strong>Shortlet Management</strong> — No upfront fee. We manage your shortlet property for
              <strong> 15% of each booking revenue</strong>. Guest screening, check-in, reviews and calendar management included.
              <button onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior:'smooth' })}
                className="underline ml-1 font-semibold hover:text-blue-900">Get started →</button>
            </p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-16 bg-surface-bg">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Client Stories</span>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <blockquote className="text-obsidian-700 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </blockquote>
                <div className="border-t border-surface-border pt-4">
                  <p className="font-semibold text-obsidian-900 text-sm">{t.name}</p>
                  <p className="text-xs text-obsidian-400 mt-0.5">{t.title}</p>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-gold-50 border border-gold-200 text-gold-700 text-[10px] font-bold rounded-full">
                    {t.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────────── */}
      <section id="get-started" className="py-16 bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="section-number">Get Started</span>
              <h2 className="section-title">Tell Us About Your Property</h2>
              <p className="text-obsidian-400 mt-3 text-sm">
                Our team will call you within <strong>2 business hours</strong> to discuss next steps.
              </p>
            </div>

            {success ? (
              <div className="card p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="font-display text-3xl font-medium text-obsidian-900 mb-3">Request Received!</h3>
                <p className="text-obsidian-500 mb-2">Thank you, <strong>{form.firstName}</strong>. We've received your request.</p>
                <p className="text-obsidian-400 text-sm mb-6">Our team will call you on <strong>{form.phone}</strong> within 2 business hours to discuss your property and next steps.</p>
                <div className="flex items-center justify-center gap-3 p-4 bg-gold-50 border border-gold-200 rounded-2xl mb-6">
                  <Phone className="w-5 h-5 text-gold-600" />
                  <div className="text-left">
                    <p className="text-xs text-obsidian-500">Need urgent assistance?</p>
                    <a href="tel:+2348168117004" className="font-bold text-obsidian-900 hover:text-gold-600 transition-colors">+234 816 811 7004</a>
                  </div>
                </div>
                <Link href="/" className="btn-secondary gap-2 inline-flex">Back to Naya</Link>
              </div>
            ) : (
              <div className="card p-6 md:p-8">
                {error && (
                  <div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-5">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-700">{error}</p>
                    <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4 text-rose-400" /></button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Package selector */}
                  <div>
                    <label className="input-label">Choose Your Package *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {PACKAGES.map(pkg => (
                        <button key={pkg.id} type="button" onClick={() => setActivePackage(pkg.id)}
                          className={`p-3 rounded-2xl border-2 text-left transition-all ${
                            activePackage === pkg.id
                              ? 'border-obsidian-900 bg-obsidian-900 text-white'
                              : 'border-surface-border hover:border-obsidian-300'
                          }`}>
                          <p className={`font-bold text-sm ${activePackage === pkg.id ? 'text-white' : 'text-obsidian-900'}`}>{pkg.name}</p>
                          <p className={`text-xs mt-0.5 ${activePackage === pkg.id ? 'text-gold-300' : 'text-gold-600'}`}>{pkg.price}</p>
                          {pkg.badge && <p className={`text-[9px] mt-1 font-bold ${activePackage === pkg.id ? 'text-gold-300' : 'text-obsidian-400'}`}>{pkg.badge}</p>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact info */}
                  <div>
                    <label className="input-label">Your Details *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input className="input-field text-sm" placeholder="First name *" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
                      <input className="input-field text-sm" placeholder="Last name *" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
                      <input type="email" className="input-field text-sm" placeholder="Email address *" value={form.email} onChange={e => set('email', e.target.value)} required />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 text-sm">🇳🇬</span>
                        <input type="tel" className="input-field pl-8 text-sm" placeholder="Phone number *" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                      </div>
                    </div>
                  </div>

                  {/* Service type */}
                  <div>
                    <label className="input-label">What do you need? *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { val:'sell',     label:'Sell Property',    icon:'🏡' },
                        { val:'rent',     label:'Find Tenants',     icon:'🔑' },
                        { val:'shortlet', label:'Shortlet Manage',  icon:'🛋' },
                      ].map(s => (
                        <button key={s.val} type="button" onClick={() => set('serviceType', s.val)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                            form.serviceType === s.val
                              ? 'border-gold-500 bg-gold-50'
                              : 'border-surface-border hover:border-gold-300'
                          }`}>
                          <span className="text-2xl">{s.icon}</span>
                          <span className={`text-xs font-bold ${form.serviceType === s.val ? 'text-gold-700' : 'text-obsidian-700'}`}>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Property details */}
                  <div>
                    <label className="input-label">Property Details</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select className="input-field text-sm" value={form.propertyType} onChange={e => set('propertyType', e.target.value)}>
                        <option value="">Property type</option>
                        {['Apartment/Flat','Duplex','Bungalow','Mansion','Terrace','Penthouse','Studio','Self-contained','Room & Parlour','Land','Commercial','Shortlet apartment'].map(t => <option key={t}>{t}</option>)}
                      </select>
                      <select className="input-field text-sm" value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)}>
                        <option value="">Select neighbourhood *</option>
                        {['GRA Phase 2','Old GRA','GRA Phase 1','Woji','Trans Amadi','Rumuola','Eleme','D-Line','Diobu','Stadium Road','Peter Odili Road','Rumuokoro','Choba','Bonny Island','Oyigbo'].map(n => <option key={n}>{n}</option>)}
                      </select>
                      <input className="input-field text-sm md:col-span-2" placeholder="Property address (optional)" value={form.address} onChange={e => set('address', e.target.value)} />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 text-sm">₦</span>
                        <input className="input-field pl-7 text-sm font-mono" placeholder="Estimated value / asking price" value={form.estimatedValue} onChange={e => set('estimatedValue', e.target.value)} />
                      </div>
                      <select className="input-field text-sm" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)}>
                        <option value="">Number of bedrooms</option>
                        {['Studio/1 room','1','2','3','4','5','6+','N/A (land/commercial)'].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="input-label">Tell Us More (optional)</label>
                    <textarea className="input-field resize-none h-24 text-sm"
                      placeholder="Describe your property, any special features, your timeline, or specific requirements..."
                      value={form.description} onChange={e => set('description', e.target.value)} />
                  </div>

                  {/* How did you hear */}
                  <div>
                    <label className="input-label">How did you hear about us?</label>
                    <select className="input-field text-sm" value={form.hearAboutUs} onChange={e => set('hearAboutUs', e.target.value)}>
                      <option value="">Select...</option>
                      {['Google Search','WhatsApp','Instagram','Facebook','Referred by a friend','Existing Naya user','Newspaper/Radio','Other'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center gap-2 py-4 text-base disabled:opacity-70">
                    {loading
                      ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
                      : <><Sparkles className="w-5 h-5" />Submit Request — We'll Call You</>
                    }
                  </button>

                  <p className="text-center text-xs text-obsidian-400">
                    By submitting, you agree to Naya's <Link href="/terms" className="text-gold-600 hover:underline">Terms</Link> and <Link href="/privacy" className="text-gold-600 hover:underline">Privacy Policy</Link>.
                    We will never share your details with third parties.
                  </p>
                </form>
              </div>
            )}

            {/* Contact alternatives */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Phone,   label:'Call Us',      value:'+234 816 811 7004',       href:'tel:+2348168117004' },
                { icon: Mail,    label:'Email Us',     value:'managed@naya.ng',          href:'mailto:managed@naya.ng' },
                { icon: MessageCircle, label:'WhatsApp', value:'Chat with our team',    href:'https://wa.me/2348168117004?text=Hi Naya, I want to enquire about Naya Managed' },
              ].map((c, i) => (
                <a key={i} href={c.href} target={i === 2 ? '_blank' : undefined}
                  className="flex items-center gap-3 p-4 border border-surface-border rounded-2xl hover:border-gold-300 hover:bg-gold-50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-surface-subtle group-hover:bg-gold-100 flex items-center justify-center transition-colors flex-shrink-0">
                    <c.icon className="w-5 h-5 text-obsidian-600 group-hover:text-gold-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-obsidian-400">{c.label}</p>
                    <p className="text-sm font-semibold text-obsidian-900">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-16 bg-surface-bg">
        <div className="page-container max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-number">FAQs</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-semibold text-obsidian-900 text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-obsidian-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 border-t border-surface-border">
                    <p className="text-sm text-obsidian-600 leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────── */}
      <section className="py-16 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
        <div className="relative z-10 page-container text-center">
          <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-5" />
          <h2 className="font-display text-4xl font-light text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Join hundreds of property owners across Rivers State who trust Naya to manage their property professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#get-started" className="btn-primary px-8 py-3.5 gap-2 justify-center">
              Submit Your Property <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://wa.me/2348168117004?text=Hi Naya, I want to learn about Naya Managed"
              target="_blank"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all">
              <MessageCircle className="w-5 h-5 text-emerald-400" />WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
