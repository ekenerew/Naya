'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2, X, ArrowRight, Star, Shield, Zap,
  Users, Award, BarChart3, MessageCircle, TrendingUp,
  Building2, Clock, ChevronDown
} from 'lucide-react'

const plans = [
  {
    id: 'starter', name: 'Starter', price: { monthly: 0, yearly: 0 }, badge: null, popular: false,
    desc: 'Perfect for agents just joining Naya and building their first listings.',
    color: 'border-surface-border', headerBg: 'from-obsidian-800 to-zinc-900',
    features: [
      { text: '3 active listings',                    included: true },
      { text: 'Basic agent profile page',             included: true },
      { text: 'RSSPC verification badge',             included: true },
      { text: 'WhatsApp enquiry routing',             included: true },
      { text: 'Standard search placement',            included: true },
      { text: 'Analytics dashboard',                  included: false },
      { text: 'Featured listing placement',           included: false },
      { text: 'Virtual tour support',                 included: false },
      { text: 'Priority search ranking',              included: false },
      { text: 'Bulk CSV upload',                      included: false },
      { text: 'Dedicated account manager',            included: false },
      { text: 'Branded agency page',                  included: false },
    ],
    cta: 'Get Started Free', ctaVariant: 'btn-secondary',
  },
  {
    id: 'pro', name: 'Pro', price: { monthly: 25000, yearly: 240000 }, badge: '⭐ Most Popular', popular: true,
    desc: 'For serious agents who want maximum visibility and a steady flow of qualified leads.',
    color: 'border-gold-500', headerBg: 'from-obsidian-900 to-zinc-900',
    features: [
      { text: '25 active listings',                   included: true },
      { text: 'Premium agent profile page',           included: true },
      { text: 'RSSPC + CAC verification badges',      included: true },
      { text: 'WhatsApp + email alerts',              included: true },
      { text: 'Priority search ranking',              included: true },
      { text: 'Analytics dashboard',                  included: true },
      { text: 'Featured listing placement',           included: true },
      { text: 'Virtual tour support',                 included: true },
      { text: 'Monthly market report',                included: true },
      { text: 'Bulk CSV upload',                      included: false },
      { text: 'Dedicated account manager',            included: false },
      { text: 'Branded agency page',                  included: false },
    ],
    cta: 'Start Pro — Free 14-Day Trial', ctaVariant: 'btn-primary',
  },
  {
    id: 'premium', name: 'Premium', price: { monthly: 65000, yearly: 624000 }, badge: '💎 Agency Plan', popular: false,
    desc: 'For agencies and high-volume agents managing large property portfolios.',
    color: 'border-obsidian-900', headerBg: 'from-slate-900 to-obsidian-900',
    features: [
      { text: 'Unlimited active listings',            included: true },
      { text: 'Platinum agency profile & badge',      included: true },
      { text: 'All verification badges',              included: true },
      { text: 'WhatsApp + SMS + email alerts',        included: true },
      { text: 'Homepage featured spot',               included: true },
      { text: 'Full analytics & investor dashboard',  included: true },
      { text: 'Priority featured placement',          included: true },
      { text: 'Professional virtual tour creation',   included: true },
      { text: 'Weekly market intelligence report',    included: true },
      { text: 'Bulk CSV upload (1,000 listings/mo)',  included: true },
      { text: 'Dedicated account manager',            included: true },
      { text: 'Branded agency page',                  included: true },
    ],
    cta: 'Go Premium', ctaVariant: 'btn-dark',
  },
]

const comparisonRows = [
  { feature: 'Active Listings',          starter: '3', pro: '25', premium: 'Unlimited' },
  { feature: 'Search Placement',         starter: 'Standard', pro: 'Priority', premium: 'Homepage Featured' },
  { feature: 'Analytics',                starter: '—', pro: 'Basic', premium: 'Full + Investor' },
  { feature: 'Featured Listings',        starter: '—', pro: '✓', premium: 'Priority' },
  { feature: 'Virtual Tours',            starter: '—', pro: '✓', premium: 'Professional' },
  { feature: 'Bulk CSV Upload',          starter: '—', pro: '—', premium: '1,000/mo' },
  { feature: 'Dedicated Manager',        starter: '—', pro: '—', premium: '✓' },
  { feature: 'Agency Branded Page',      starter: '—', pro: '—', premium: '✓' },
  { feature: 'Market Reports',           starter: '—', pro: 'Monthly', premium: 'Weekly' },
  { feature: 'RSSPC Badge',              starter: '✓', pro: '✓', premium: '✓' },
  { feature: 'WhatsApp Alerts',          starter: '✓', pro: '✓ + Email', premium: '✓ + SMS + Email' },
  { feature: 'Support Response',         starter: 'Email 48hr', pro: 'Email 12hr', premium: 'Priority 2hr' },
]

const faqs = [
  { q: 'Is there a free trial?', a: 'Yes — Pro comes with a 14-day free trial, no card required. You can cancel anytime before the trial ends and you will not be charged.' },
  { q: 'Can I change plans at any time?', a: 'Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades take effect at the end of your billing period.' },
  { q: 'How does the annual billing discount work?', a: 'Annual billing saves you 2 months — you pay for 10 months and get 12. The discount is applied automatically when you select annual billing at checkout.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major cards, bank transfer, and USSD via Paystack. Monthly and annual direct debit is available for Premium plan subscribers.' },
  { q: 'What happens to my listings if I downgrade?', a: 'If you downgrade below your current listing count, your oldest listings are automatically unpublished (not deleted) until you are within the plan limit. You can re-publish at any time.' },
  { q: 'Do I need to be RSSPC-verified to list?', a: 'You can create an account and start the listing wizard on any plan. However, listings only go live on our public platform once RSSPC verification is complete.' },
]

export default function BillingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const fmt = (n: number) => n === 0 ? 'Free' : `₦${n.toLocaleString()}`

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* HERO */}
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/8 blur-[120px]" />
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
            <Award className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Agent Pricing Plans</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-5">
            Simple Pricing.<br /><span className="gold-text">No Surprises.</span>
          </h1>
          <p className="text-white/40 text-lg font-light max-w-xl mx-auto mb-10">
            Start free. Upgrade when you're ready. All plans include RSSPC verification and WhatsApp enquiry routing.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-2xl p-1.5 border border-white/15">
            <button onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-white text-obsidian-900' : 'text-white/60 hover:text-white'}`}>
              Monthly
            </button>
            <button onClick={() => setBilling('yearly')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-white text-obsidian-900' : 'text-white/60 hover:text-white'}`}>
              Annual
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">Save 2 months</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* PLANS */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12">
            {plans.map((plan) => {
              const price = billing === 'yearly' ? plan.price.yearly : plan.price.monthly
              const periodLabel = plan.price.monthly === 0 ? '' : billing === 'yearly' ? '/year' : '/month'

              return (
                <div key={plan.id} className={`card overflow-hidden relative ${plan.popular ? 'border-2 border-gold-500 shadow-gold' : `border border-${plan.color}`}`}>
                  {plan.badge && (
                    <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full ${plan.popular ? 'bg-gold-500 text-obsidian-900' : 'bg-obsidian-900 text-white'}`}>
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan header */}
                  <div className={`bg-gradient-to-br ${plan.headerBg} p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
                    <div className="relative z-10">
                      <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">{plan.name}</div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="font-display text-4xl font-light text-white">{fmt(price)}</span>
                        <span className="text-white/40 text-sm">{periodLabel}</span>
                      </div>
                      {billing === 'yearly' && price > 0 && (
                        <div className="text-emerald-400 text-xs font-medium">
                          ₦{Math.round(price / 12).toLocaleString()}/mo billed annually
                        </div>
                      )}
                      <p className="text-white/40 text-xs leading-relaxed mt-3">{plan.desc}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <div className="space-y-2.5 mb-6">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          {f.included
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            : <X className="w-4 h-4 text-obsidian-200 flex-shrink-0 mt-0.5" />
                          }
                          <span className={`text-xs ${f.included ? 'text-obsidian-700' : 'text-obsidian-300'}`}>{f.text}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/login" className={`${plan.ctaVariant} w-full justify-center`}>{plan.cta}</Link>
                    {plan.id === 'pro' && (
                      <p className="text-center text-xs text-obsidian-400 mt-2">14-day free trial · No card required</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* COMPARISON TABLE */}
          <div className="max-w-5xl mx-auto card overflow-hidden mb-12">
            <div className="p-6 border-b border-surface-border">
              <h2 className="font-display text-2xl font-medium text-obsidian-900">Full Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-subtle">
                    <th className="text-left py-3 px-5 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Feature</th>
                    <th className="text-center py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Starter</th>
                    <th className="text-center py-3 px-4 font-mono text-xs text-gold-600 uppercase tracking-wider bg-gold-50/50">Pro</th>
                    <th className="text-center py-3 px-4 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className={`border-b border-surface-border ${i % 2 === 0 ? 'bg-surface-subtle/30' : 'bg-white'}`}>
                      <td className="py-3 px-5 text-obsidian-700 font-medium text-sm">{row.feature}</td>
                      <td className="py-3 px-4 text-center text-xs text-obsidian-500 font-mono">{row.starter}</td>
                      <td className="py-3 px-4 text-center text-xs font-mono font-bold text-gold-700 bg-gold-50/30">{row.pro}</td>
                      <td className="py-3 px-4 text-center text-xs font-mono text-obsidian-700">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TRUST SIGNALS */}
          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Shield, label: 'Secure Payments', sub: 'via Paystack', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Clock, label: 'Cancel Anytime', sub: 'No lock-in contract', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: MessageCircle, label: '2hr Support', sub: 'Premium plan', color: 'text-gold-600', bg: 'bg-gold-50' },
              { icon: TrendingUp, label: '4x More Leads', sub: 'Verified agents', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <div key={i} className="card p-4 text-center">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-2`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="font-semibold text-obsidian-900 text-xs">{item.label}</div>
                <div className="text-[10px] text-obsidian-400">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="section-number">Questions</span>
              <h2 className="section-title">Pricing FAQs</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="card overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-subtle transition-colors">
                    <span className="font-medium text-obsidian-900 text-sm pr-4">{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gold-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t border-surface-border">
                      <p className="text-sm text-obsidian-500 leading-relaxed pt-4">{f.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-4xl text-white font-light mb-5">
            Ready to Get Started?<br /><span className="gold-text">Your first listing is free.</span>
          </h2>
          <p className="text-white/40 mb-10 max-w-md mx-auto">Join 156+ RSSPC-verified agents already growing their business on Naya.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-primary btn-lg">Start Free Account <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/contact" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">Talk to Sales</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
