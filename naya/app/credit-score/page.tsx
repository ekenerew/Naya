'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Star, Shield, TrendingUp, Users, Award, CheckCircle2,
  Clock, Home, MessageCircle, ArrowRight, Sparkles,
  ChevronDown, AlertCircle, Loader2, X, BadgeCheck,
  FileText, Banknote, Calendar, ThumbsUp, ThumbsDown
} from 'lucide-react'

// ── Score ring ─────────────────────────────────────────────────
function ScoreRing({ score, label, size = 'lg' }: { score: number; label: string; size?: 'sm'|'md'|'lg' }) {
  const r = size === 'lg' ? 54 : size === 'md' ? 40 : 28
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 850) * circ
  const color = score >= 750 ? '#10b981' : score >= 650 ? '#C8A84B' : score >= 550 ? '#f59e0b' : score >= 450 ? '#f97316' : '#ef4444'
  const grade = score >= 750 ? 'Excellent' : score >= 650 ? 'Good' : score >= 550 ? 'Fair' : score >= 450 ? 'Poor' : 'Very Poor'
  const dim = r * 2 + 16
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg viewBox={`0 0 ${dim} ${dim}`} className="w-full h-full -rotate-90">
          <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke="#E8E3D8" strokeWidth={size==='lg'?10:7} />
          <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke={color} strokeWidth={size==='lg'?10:7}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition:'stroke-dashoffset 1.5s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold" style={{ fontSize: size==='lg'?'2rem':size==='md'?'1.5rem':'1rem', color }}>{score}</span>
          {size !== 'sm' && <span className="text-[10px] text-obsidian-400">/850</span>}
        </div>
      </div>
      <p className="text-sm font-bold mt-2" style={{ color }}>{grade}</p>
      {label && <p className="text-xs text-obsidian-400">{label}</p>}
    </div>
  )
}

const SCORE_FACTORS = [
  { label:'Payment History',    weight:35, icon:Calendar,  desc:'On-time rent payments, no bounced cheques' },
  { label:'Tenancy Duration',   weight:25, icon:Clock,     desc:'Length and consistency of tenancy records' },
  { label:'Landlord Reviews',   weight:20, icon:Star,      desc:'Verified ratings from previous landlords' },
  { label:'References',         weight:12, icon:Users,     desc:'Character references from agents and employers' },
  { label:'Identity Verified',  weight:8,  icon:Shield,    desc:'BVN, NIN, government ID verification' },
]

const TIERS = [
  { range:'750–850', label:'Excellent',  color:'bg-emerald-500',  text:'text-emerald-700', bg:'bg-emerald-50 border-emerald-200', perks:['Priority access to all listings','Waived security deposit option','Fast-track applications','Landlord VIP notification'] },
  { range:'650–749', label:'Good',       color:'bg-gold-500',     text:'text-gold-700',    bg:'bg-gold-50 border-gold-200',       perks:['Access to premium listings','Reduced processing time','Trusted tenant badge','Negotiation leverage'] },
  { range:'550–649', label:'Fair',       color:'bg-amber-400',    text:'text-amber-700',   bg:'bg-amber-50 border-amber-200',     perks:['Standard listing access','Visible score badge','Improve in 90 days'] },
  { range:'Below 550',label:'Needs Work',color:'bg-rose-400',     text:'text-rose-700',    bg:'bg-rose-50 border-rose-200',       perks:['Score improvement plan','Tips to build history','Re-check every 90 days'] },
]

const FAQS = [
  { q:'Who can build a Naya Credit Score?', a:'Any tenant who has rented at least one property in Nigeria. You need one verified landlord review to start building your score.' },
  { q:'Does it affect my credit history with banks?', a:'No. Naya Credit Score is entirely separate from CBN credit bureau scores. It is a property-specific reputation score only.' },
  { q:'What if a landlord gives me an unfair review?', a:'You can dispute any review within 14 days. Naya\'s team investigates and can remove reviews that violate our fairness policy.' },
  { q:'How long does it take to build a good score?', a:'With 2–3 verified tenancies and consistent on-time payments, most tenants reach a Good (650+) score within 12–18 months.' },
  { q:'Can landlords see my score?', a:'Only if you choose to share it. When you apply for a property, you can opt to share your score with the landlord as a trust signal.' },
  { q:'Is it free?', a:'Building and viewing your Naya Credit Score is completely free. Landlord verification costs ₦2,000 per verification to prevent fake reviews.' },
]

type TabType = 'tenant'|'landlord'
export default function CreditScorePage() {
  const [tab, setTab]         = useState<TabType>('tenant')
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [email, setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  // Demo score
  const demoScore = 718

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-obsidian-900 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-25" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/8 rounded-full blur-[120px]" />
        <div className="relative z-10 page-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-sm font-semibold mb-6">
                <Star className="w-4 h-4" />Naya Credit Score — Nigeria's First Tenant Score
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-5">
                Your Rental<br />
                <span className="gold-text">Reputation Matters</span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
                Build a verifiable tenant profile. Show landlords you're trustworthy.
                Get priority access to premium listings and waived deposits.
                Nigeria's first property-specific credit score.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#get-started" className="btn-primary gap-2 justify-center">Check Your Score <ArrowRight className="w-4 h-4" /></a>
                <Link href="/agents" className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all text-sm">
                  I'm a Landlord
                </Link>
              </div>
            </div>

            {/* Score demo */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gold-500/10 rounded-full blur-[60px]" />
                <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Sample Profile</p>
                  <ScoreRing score={demoScore} label="Naya Credit Score" size="lg" />
                  <div className="mt-6 space-y-2">
                    {[
                      { label:'Payment History', val:'100% on time', icon:'✅' },
                      { label:'Tenancies Verified', val:'3 verified', icon:'🏠' },
                      { label:'Landlord Rating', val:'4.8 / 5.0', icon:'⭐' },
                    ].map((s,i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl">
                        <span className="text-white/60 text-xs">{s.icon} {s.label}</span>
                        <span className="text-white text-xs font-bold">{s.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 px-4 py-2.5 bg-gold-500/15 border border-gold-500/25 rounded-xl">
                    <p className="text-gold-400 text-xs font-bold">✦ TRUSTED TENANT — PRIORITY ACCESS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FFFFFF"/></svg>
        </div>
      </section>

      {/* ── HOW SCORE IS CALCULATED ── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Score Breakdown</span>
            <h2 className="section-title">How Your Score is Calculated</h2>
            <p className="text-obsidian-400 max-w-xl mx-auto mt-3">Five factors, each weighted by importance. All data is verifiable and disputable.</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {SCORE_FACTORS.map((f,i) => (
              <div key={i} className="card p-5 flex items-center gap-5 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gold-50 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-6 h-6 text-gold-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-semibold text-obsidian-900">{f.label}</h3>
                    <span className="text-lg font-display font-bold text-gold-600">{f.weight}%</span>
                  </div>
                  <p className="text-sm text-obsidian-500 mb-2">{f.desc}</p>
                  <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full" style={{ width:`${f.weight * 2.86}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORE TIERS ── */}
      <section className="py-16 bg-surface-bg">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">Score Tiers</span>
            <h2 className="section-title">What Each Score Unlocks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((tier,i) => (
              <div key={i} className={`card overflow-hidden ${i===1?'ring-2 ring-gold-400 shadow-gold':''}`}>
                <div className={`h-2 ${tier.color}`} />
                <div className="p-5">
                  {i===1 && <div className="flex justify-center mb-3"><span className="px-3 py-1 bg-gold-500 text-obsidian-900 text-[10px] font-black rounded-full">MOST SOUGHT AFTER</span></div>}
                  <p className="text-xs text-obsidian-400 font-mono mb-1">{tier.range}</p>
                  <h3 className={`text-xl font-display font-semibold mb-4 ${tier.text}`}>{tier.label}</h3>
                  <ul className="space-y-2">
                    {tier.perks.map((p,j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-obsidian-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABS: TENANT vs LANDLORD ── */}
      <section className="py-16 bg-white">
        <div className="page-container max-w-3xl mx-auto">
          <div className="flex gap-1 p-1 bg-surface-subtle rounded-2xl w-fit mx-auto mb-10">
            {(['tenant','landlord'] as TabType[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${tab===t?'bg-white text-obsidian-900 shadow':'text-obsidian-500 hover:text-obsidian-700'}`}>
                {t === 'tenant' ? '🏠 I\'m a Tenant' : '🏗 I\'m a Landlord'}
              </button>
            ))}
          </div>

          {tab === 'tenant' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { step:'01', icon:Shield,    title:'Verify Your Identity', desc:'Submit your NIN, BVN, and government ID. One-time verification. Free.', action:'Start verification' },
                { step:'02', icon:Home,      title:'Add Past Tenancies', desc:'Enter your previous addresses. We contact landlords for verification. Takes 48–72 hours.', action:'Add tenancy history' },
                { step:'03', icon:Star,      title:'Build Your Score', desc:'Every on-time payment, positive review and verified reference adds to your score automatically.', action:'View score' },
              ].map((s,i) => (
                <div key={i} className="card p-5 text-center hover:shadow-lg transition-all">
                  <div className="relative w-12 h-12 mx-auto mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                      <s.icon className="w-6 h-6 text-gold-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-obsidian-900 flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">{s.step}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-obsidian-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-obsidian-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { step:'01', icon:Users,     title:'Search a Tenant',    desc:'Enter any tenant\'s email or phone. If they\'ve consented to sharing, you\'ll see their Naya Score instantly.', },
                { step:'02', icon:Star,      title:'Review After Tenancy', desc:'When a tenancy ends, rate your tenant on payment history, property care and behaviour. Takes 2 minutes.', },
                { step:'03', icon:BadgeCheck,title:'Attract Better Tenants', desc:'List your property with "Verified Tenants Preferred" badge. Score holders apply faster and pay on time.', },
              ].map((s,i) => (
                <div key={i} className="card p-5 text-center hover:shadow-lg transition-all">
                  <div className="relative w-12 h-12 mx-auto mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <s.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-obsidian-900 flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">{s.step}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-obsidian-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-obsidian-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── GET STARTED ── */}
      <section id="get-started" className="py-16 bg-surface-bg">
        <div className="page-container max-w-lg mx-auto text-center">
          <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h2 className="section-title mb-3">Join the Waitlist</h2>
          <p className="text-obsidian-400 text-sm mb-6">Naya Credit Score launches Q3 2026. Be the first to build your profile and claim early adopter benefits.</p>
          {submitted ? (
            <div className="card p-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold text-obsidian-900 mb-2">You're on the list!</h3>
              <p className="text-obsidian-400 text-sm">We'll notify <strong>{email}</strong> as soon as Naya Credit Score launches.</p>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="card p-6">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field text-sm mb-3" />
              <button type="submit" className="btn-primary w-full justify-center gap-2">
                <Star className="w-4 h-4" />Join Early Access Waitlist
              </button>
              <p className="text-xs text-obsidian-400 mt-2">No spam. Launch notification only.</p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-white">
        <div className="page-container max-w-2xl mx-auto">
          <h2 className="section-title text-center mb-10">Common Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f,i) => (
              <div key={i} className="card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq===i?null:i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-semibold text-obsidian-900 text-sm">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-obsidian-400 flex-shrink-0 transition-transform ${openFaq===i?'rotate-180':''}`} />
                </button>
                {openFaq===i && <div className="px-5 pb-4 border-t border-surface-border pt-3"><p className="text-sm text-obsidian-600 leading-relaxed">{f.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
