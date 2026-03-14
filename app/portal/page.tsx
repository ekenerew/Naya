'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2, ArrowRight, Shield, TrendingUp, Users, Star,
  Upload, MapPin, Home, DollarSign, Camera, FileText,
  Zap, Award, MessageCircle, ChevronRight, Sparkles, Building2
} from 'lucide-react'

const steps = [
  { n: '01', title: 'Create Your Account', desc: 'Register with your name, phone, email, and agency details. Takes 2 minutes.' },
  { n: '02', title: 'Submit Your RSSPC Licence', desc: 'Upload your RSSPC licence number and ID. Our team verifies within 24 hours.' },
  { n: '03', title: 'List Your First Property', desc: 'Add photos, set your price, write a description, and choose your amenities.' },
  { n: '04', title: 'Start Getting Enquiries', desc: 'Your listing goes live and qualified buyers and renters start reaching out.' },
]

const benefits = [
  { icon: Users,     title: '7,200+ Monthly Enquiries', desc: 'Access to one of PH\'s largest pools of verified property seekers — renters, buyers, and investors.',     color: 'text-gold-600',    bg: 'bg-gold-50' },
  { icon: Shield,    title: 'Credibility Badge',         desc: 'Your RSSPC verification is displayed on every listing and your profile, building instant trust.',        color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: TrendingUp,title: 'Market Data Dashboard',    desc: 'See how your listings perform vs market, track enquiries, and optimise pricing with live data.',         color: 'text-blue-600',    bg: 'bg-blue-50' },
  { icon: Zap,       title: 'Instant Lead Alerts',      desc: 'Get WhatsApp and email notifications the moment a qualified buyer or renter enquires on your listing.',    color: 'text-purple-600',  bg: 'bg-purple-50' },
  { icon: Camera,    title: 'Virtual Tour Support',     desc: 'We help you create 360° virtual tours for premium listings — dramatically increasing enquiry rates.',       color: 'text-rose-600',    bg: 'bg-rose-50' },
  { icon: Award,     title: 'Featured Listing Boost',   desc: 'Featured listings get 4x more views. Our data shows featured properties let 60% faster.',                  color: 'text-amber-600',   bg: 'bg-amber-50' },
]

const plans = [
  {
    name: 'Starter', price: 'Free', period: '', popular: false, color: 'border-surface-border',
    desc: 'Perfect for agents just getting started on Naya.',
    features: ['3 active listings', 'Basic agent profile', 'RSSPC verification badge', 'WhatsApp enquiry routing', 'Standard search placement'],
    cta: 'Get Started Free', ctaStyle: 'btn-secondary',
  },
  {
    name: 'Pro', price: '₦25,000', period: '/month', popular: true, color: 'border-gold-500',
    desc: 'For serious agents who want maximum visibility and leads.',
    features: ['25 active listings', 'Premium agent profile', 'Featured listing placement', 'Priority search ranking', 'Analytics dashboard', 'WhatsApp + SMS alerts', 'Virtual tour support', 'Monthly market report'],
    cta: 'Start Pro Trial', ctaStyle: 'btn-primary',
  },
  {
    name: 'Premium', price: '₦65,000', period: '/month', popular: false, color: 'border-obsidian-900',
    desc: 'For agencies and top-performing agents with large portfolios.',
    features: ['Unlimited listings', 'Platinum agent badge', 'Homepage featured spot', 'Dedicated account manager', 'Bulk CSV upload', 'Priority support (2hr response)', 'Branded agency page', 'Investor analytics', 'Lead scoring & CRM'],
    cta: 'Go Premium', ctaStyle: 'btn-dark',
  },
]

const stats = [
  { value: '156+', label: 'Active agents on Naya' },
  { value: '2,847', label: 'Live listings' },
  { value: '7,200', label: 'Monthly enquiries' },
  { value: '28 days', label: 'Avg. time to let' },
]

const testimonials = [
  { name: 'Samuel Okeke', agency: 'Okeke Premium Properties', rating: 5, text: 'Since joining Naya Pro, my monthly enquiries tripled. The verified badge alone has completely changed how clients perceive my agency. Best investment I\'ve made in 12 years.', area: 'GRA Phase 2' },
  { name: 'Ngozi Eze', agency: 'Pearl Properties PH', rating: 5, text: 'The analytics dashboard shows me exactly which listings are underperforming so I can adjust pricing. I\'ve never had this level of data before. Revenue is up 40% this year.', area: 'Woji' },
]

export default function PortalPage() {
  const [activeTab, setActiveTab] = useState<'agent' | 'landlord'>('agent')

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* HERO */}
      <section className="relative bg-obsidian-900 overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gold-500/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />

        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Agent & Landlord Portal</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-[0.92] tracking-tight mb-6">
                List Properties.<br />
                <span className="gold-text">Build Trust.</span><br />
                <span className="text-white/40">Close Deals.</span>
              </h1>
              <p className="text-white/40 text-lg font-light leading-relaxed mb-8 max-w-md">
                Join 156+ RSSPC-verified agents reaching 7,200+ qualified buyers and renters every month on Naya.
              </p>

              {/* Who are you */}
              <div className="flex gap-3 mb-8">
                <button onClick={() => setActiveTab('agent')}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium border-2 transition-all ${activeTab === 'agent' ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/60 border-white/15 hover:bg-white/15'}`}>
                  🏢 I am an Agent
                </button>
                <button onClick={() => setActiveTab('landlord')}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium border-2 transition-all ${activeTab === 'landlord' ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-white/8 text-white/60 border-white/15 hover:bg-white/15'}`}>
                  🏠 I am a Landlord
                </button>
              </div>

              <div className="space-y-3 mb-8">
                {(activeTab === 'agent' ? [
                  'List up to 25 properties (Pro) or unlimited (Premium)',
                  'Display your RSSPC licence number on every listing',
                  'Get enquiries directly on WhatsApp and email',
                  'Track performance with a live analytics dashboard',
                ] : [
                  'List your property without needing an agent',
                  'Receive enquiries directly from verified seekers',
                  'We verify your ID and property title before going live',
                  'Pay only for featured or promoted listings',
                ]).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/60 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link href="/login" className="btn-primary btn-lg flex-1 justify-center">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/portal/billing" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg px-5">
                  View Plans
                </Link>
              </div>
            </div>

            {/* Stats panel */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                    <div className="font-display text-3xl font-light text-gold-400 mb-1">{s.value}</div>
                    <div className="text-xs text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Testimonial preview */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({length:5}).map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400"/>)}
                </div>
                <p className="text-white/50 text-sm leading-relaxed italic mb-3">"{testimonials[0].text.substring(0, 100)}..."</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold text-obsidian-900">SO</div>
                  <div>
                    <div className="text-white text-xs font-medium">{testimonials[0].name}</div>
                    <div className="text-white/30 text-[10px]">{testimonials[0].agency}</div>
                  </div>
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

      {/* HOW IT WORKS */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Simple Process</span>
            <h2 className="section-title">Live on Naya in 24 Hours</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="card p-5 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-obsidian-900 flex items-center justify-center mb-4">
                    <span className="font-mono text-sm font-bold text-gold-400">{s.n}</span>
                  </div>
                  <h3 className="font-display text-base font-medium text-obsidian-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-obsidian-500 leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 z-10">
                    <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
                      <ChevronRight className="w-3.5 h-3.5 text-obsidian-900" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Why Naya</span>
            <h2 className="section-title">Built for Serious Agents</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <div key={i} className="card p-6">
                <div className={`w-12 h-12 rounded-2xl ${b.bg} flex items-center justify-center mb-4`}>
                  <b.icon className={`w-6 h-6 ${b.color}`} />
                </div>
                <h3 className="font-display text-lg font-medium text-obsidian-900 mb-2">{b.title}</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Pricing</span>
            <h2 className="section-title">Simple, Transparent Plans</h2>
            <p className="section-desc mx-auto">Start free. Upgrade when you're ready. No lock-in contracts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`card p-6 relative ${plan.popular ? 'border-2 border-gold-500 shadow-gold' : `border border-${plan.color}`}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-obsidian-900 text-xs font-bold px-4 py-1 rounded-full">
                    ⭐ Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <div className="font-mono text-xs text-obsidian-400 uppercase tracking-widest mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-medium text-obsidian-900">{plan.price}</span>
                    <span className="text-obsidian-400 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-obsidian-500 mt-2">{plan.desc}</p>
                </div>
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-obsidian-600">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/portal/billing" className={`${plan.ctaStyle} w-full justify-center`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-obsidian-400 mt-6">
            All plans include RSSPC verification badge and WhatsApp enquiry routing. <Link href="/portal/billing" className="text-gold-600 hover:underline">See full comparison →</Link>
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <span className="section-number">Agent Stories</span>
            <h2 className="section-title">What Our Agents Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({length:t.rating}).map((_,j) => <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400"/>)}
                </div>
                <p className="text-obsidian-500 text-sm leading-relaxed italic mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center text-sm font-bold text-obsidian-900">
                    {t.name.charAt(0)}{t.name.split(' ')[1]?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-obsidian-900 text-sm">{t.name}</div>
                    <div className="text-xs text-obsidian-400">{t.agency} · {t.area}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-5">
            Ready to Grow Your<br /><span className="gold-text">Property Business?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">Join Nigeria's most trusted property marketplace and start connecting with verified buyers and renters today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-primary btn-lg">Create Free Account <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/portal/billing" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">View All Plans</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
