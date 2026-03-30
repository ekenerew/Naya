'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Shield, Lock, CheckCircle2, ArrowRight, Clock, AlertCircle,
  Banknote, Users, FileText, Eye, Sparkles, ChevronDown,
  Phone, MessageCircle, Loader2, X, Building2, CreditCard,
  RefreshCw, TrendingUp, Award
} from 'lucide-react'

const STEPS = [
  { n:'01', icon:CreditCard,   title:'Buyer Pays Into Escrow', desc:'Buyer sends rent/purchase deposit to Naya\'s secure escrow account via Paystack. Funds are held — not accessible to landlord yet.', color:'bg-blue-50', iconColor:'text-blue-600', duration:'Day 1' },
  { n:'02', icon:Eye,          title:'Property Inspection Period', desc:'Buyer/tenant has 48 hours to physically inspect the property and confirm it matches the listing. Naya provides a checklist.', color:'bg-gold-50', iconColor:'text-gold-600', duration:'48 hours' },
  { n:'03', icon:FileText,     title:'Agreement Signed',  desc:'Both parties sign a Naya-prepared tenancy or sale agreement. Naya verifies signatures and stores documents securely.', color:'bg-purple-50', iconColor:'text-purple-600', duration:'Day 2–3' },
  { n:'04', icon:CheckCircle2, title:'Funds Released to Landlord', desc:'Once buyer confirms everything is as described, Naya releases funds to the landlord/seller within 24 hours. Naya deducts its 1% fee.', color:'bg-emerald-50', iconColor:'text-emerald-600', duration:'Day 3–4' },
]

const FAQS = [
  { q:'Who holds the money?', a:'Naya Real Estate Technologies Ltd holds funds in a dedicated client escrow account at a licensed Nigerian bank. Funds are ring-fenced and cannot be used for any other purpose.' },
  { q:'What if the property is different from the listing?', a:'You raise a dispute within 48 hours. Naya\'s team investigates and mediates. If the landlord is at fault, a full refund is processed within 5 business days.' },
  { q:'What is Naya\'s escrow fee?', a:'1% of the transaction value, deducted from the funds before release to the landlord. Minimum fee: ₦5,000. Maximum: ₦50,000. Completely free for the buyer.' },
  { q:'What types of transactions are covered?', a:'Annual rent, monthly rent deposits, property purchases (sale agreements), and shortlet advance payments. Commercial leases handled separately.' },
  { q:'Is Naya Escrow legally binding?', a:'Yes. Naya operates under a service agreement that constitutes a legally binding trust arrangement under Nigerian contract law. Our agreements are prepared by qualified Nigerian lawyers.' },
  { q:'What if I change my mind before inspection?', a:'You can cancel within 2 hours of payment for a full refund. After that, the standard dispute process applies.' },
]

type FormData = { buyerName:string; buyerEmail:string; buyerPhone:string; landlordName:string; landlordPhone:string; propertyAddress:string; transactionType:string; amount:string; listingId:string }
const INIT:FormData = { buyerName:'', buyerEmail:'', buyerPhone:'', landlordName:'', landlordPhone:'', propertyAddress:'', transactionType:'annual_rent', amount:'', listingId:'' }

export default function EscrowPage() {
  const [form, setForm]       = useState<FormData>(INIT)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const set = (k:keyof FormData, v:string) => setForm(p => ({...p,[k]:v}))

  const submit = async (e:React.FormEvent) => {
    e.preventDefault()
    if (!form.buyerEmail || !form.amount || !form.propertyAddress) { setError('Please fill in all required fields'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/escrow', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); return }
      setSuccess(true)
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const fmt = (n:string) => { const num = Number(n.replace(/,/g,'')); if (num >= 1e6) return `₦${(num/1e6).toFixed(1)}M`; if (num >= 1e3) return `₦${(num/1e3).toFixed(0)}K`; return `₦${num.toLocaleString()}` }
  const fee  = form.amount ? Math.min(50000, Math.max(5000, Math.round(Number(form.amount.replace(/,/g,'')) * 0.01))) : 0

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-obsidian-900 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-25" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/6 rounded-full blur-[150px]" />
        <div className="relative z-10 page-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" />Naya Escrow — Secure Property Payments
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-5">
                Pay Rent or Buy<br />
                <span className="gold-text">Without the Fear</span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
                Naya holds your payment securely. You inspect the property first. Only when you're satisfied do we release funds to the landlord. Nigeria's first property escrow service.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                {[
                  { icon:Lock,    label:'Funds protected until you\'re satisfied' },
                  { icon:Shield,  label:'Legally binding trust arrangement' },
                  { icon:Clock,   label:'48-hour inspection window' },
                ].map((b,i) => (
                  <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                    <b.icon className="w-4 h-4 text-gold-400 flex-shrink-0" />{b.label}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#start-escrow" className="btn-primary gap-2 justify-center">Start Secure Payment <ArrowRight className="w-4 h-4" /></a>
                <a href="https://wa.me/2348168117004?text=Hi, I need help with Naya Escrow"
                  target="_blank"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all text-sm">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />WhatsApp Support
                </a>
              </div>
            </div>

            {/* Trust stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value:'₦0',     label:'Hidden fees for buyers', sub:'Completely free to use' },
                { value:'1%',     label:'Landlord fee',            sub:'Max ₦50,000 per deal' },
                { value:'48hrs',  label:'Inspection window',       sub:'Dispute within 48 hrs' },
                { value:'100%',   label:'Refund if dispute upheld',sub:'Full refund guarantee' },
              ].map((s,i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="font-display text-3xl font-medium text-gold-400 mb-1">{s.value}</p>
                  <p className="text-white/70 text-sm font-semibold">{s.label}</p>
                  <p className="text-white/30 text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FFFFFF"/></svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-number">The Process</span>
            <h2 className="section-title">How Naya Escrow Works</h2>
            <p className="text-obsidian-400 max-w-xl mx-auto mt-3">Four simple steps. Your money is protected at every stage.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s,i) => (
              <div key={i} className="relative">
                {i < STEPS.length-1 && <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-surface-border z-0 -translate-y-1/2" style={{width:'calc(100% - 2rem)', left:'calc(100% - 1rem)'}} />}
                <div className="card p-5 relative z-10 hover:shadow-lg transition-all">
                  <div className="absolute top-4 right-4 font-display text-5xl font-bold text-surface-subtle">{s.n}</div>
                  <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center mb-4`}>
                    <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                  </div>
                  <p className="text-xs font-bold text-obsidian-400 uppercase tracking-wider mb-1">{s.duration}</p>
                  <h3 className="font-semibold text-obsidian-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-obsidian-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <section id="start-escrow" className="py-16 bg-surface-bg">
        <div className="page-container max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-number">Get Started</span>
            <h2 className="section-title">Initiate Escrow Payment</h2>
            <p className="text-obsidian-400 mt-3 text-sm">Fill in the details. Our team will contact you within 2 hours to complete setup.</p>
          </div>

          {success ? (
            <div className="card p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <Shield className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="font-display text-3xl font-medium text-obsidian-900 mb-3">Escrow Request Received!</h3>
              <p className="text-obsidian-500 mb-2">We'll contact <strong>{form.buyerEmail}</strong> within 2 hours with payment instructions.</p>
              <p className="text-obsidian-400 text-sm mb-6">Our team will verify both parties and set up the escrow account for your transaction.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setSuccess(false); setForm(INIT) }} className="btn-secondary">New Request</button>
                <a href="https://wa.me/2348168117004" target="_blank" className="btn-primary gap-2">
                  <MessageCircle className="w-4 h-4" />Follow Up on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="card p-6 md:p-8">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl mb-4">
                  <AlertCircle className="w-4 h-4 text-rose-500" /><p className="text-sm text-rose-700">{error}</p>
                  <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4 text-rose-400" /></button>
                </div>
              )}
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <h3 className="font-semibold text-obsidian-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-gold-600" />Your Details (Buyer/Tenant)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className="input-field text-sm" placeholder="Full name *" value={form.buyerName} onChange={e => set('buyerName',e.target.value)} required />
                    <input type="email" className="input-field text-sm" placeholder="Email address *" value={form.buyerEmail} onChange={e => set('buyerEmail',e.target.value)} required />
                    <div className="relative md:col-span-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🇳🇬</span>
                      <input className="input-field pl-8 text-sm" placeholder="Phone number *" value={form.buyerPhone} onChange={e => set('buyerPhone',e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-obsidian-900 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-gold-600" />Landlord/Seller Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className="input-field text-sm" placeholder="Landlord/seller name" value={form.landlordName} onChange={e => set('landlordName',e.target.value)} />
                    <input className="input-field text-sm" placeholder="Landlord phone" value={form.landlordPhone} onChange={e => set('landlordPhone',e.target.value)} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-obsidian-900 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-gold-600" />Transaction Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select className="input-field text-sm" value={form.transactionType} onChange={e => set('transactionType',e.target.value)}>
                      <option value="annual_rent">Annual Rent</option>
                      <option value="monthly_rent">Monthly Rent</option>
                      <option value="property_purchase">Property Purchase</option>
                      <option value="shortlet">Shortlet Payment</option>
                      <option value="deposit">Security Deposit</option>
                    </select>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 text-sm">₦</span>
                      <input className="input-field pl-7 text-sm font-mono" placeholder="Amount *"
                        value={form.amount} onChange={e => set('amount',e.target.value)} required />
                    </div>
                    <input className="input-field text-sm md:col-span-2" placeholder="Property address *"
                      value={form.propertyAddress} onChange={e => set('propertyAddress',e.target.value)} required />
                  </div>
                </div>

                {/* Fee preview */}
                {form.amount && Number(form.amount.replace(/,/g,'')) > 0 && (
                  <div className="p-4 bg-obsidian-900 rounded-2xl">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-white/40 text-xs">Transaction Amount</p>
                        <p className="font-display text-lg font-medium text-white">{fmt(form.amount)}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Naya Fee (1%)</p>
                        <p className="font-display text-lg font-medium text-gold-400">₦{fee.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Landlord Receives</p>
                        <p className="font-display text-lg font-medium text-emerald-400">{fmt(String(Number(form.amount.replace(/,/g,'')) - fee))}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    By submitting, you agree to Naya's Escrow Terms. Funds are held in a ring-fenced client account.
                    You have <strong>48 hours</strong> after property access to raise a dispute.
                  </p>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2 py-4 text-base disabled:opacity-70">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing...</> : <><Shield className="w-5 h-5" />Initiate Secure Escrow</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-white">
        <div className="page-container max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Common Questions</h2>
          </div>
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

      {/* Bottom CTA */}
      <section className="py-12 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
        <div className="relative z-10 page-container text-center">
          <Shield className="w-10 h-10 text-gold-500 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-light text-white mb-3">Never get scammed again</h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto text-sm">Join thousands of Nigerian property seekers using Naya Escrow for safe, secure transactions.</p>
          <a href="#start-escrow" className="btn-primary gap-2 inline-flex">Start Secure Payment <ArrowRight className="w-4 h-4" /></a>
        </div>
      </section>
    </div>
  )
}
