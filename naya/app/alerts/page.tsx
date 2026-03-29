'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bell, CheckCircle2, MapPin, Home, TrendingUp, Sparkles, ArrowRight, Loader2, X } from 'lucide-react'

const AREAS = ['GRA Phase 2','Old GRA','Woji','Trans Amadi','Rumuola','Eleme','Peter Odili Road','Stadium Road','Bonny Island','Choba','D-Line']

export default function AlertsPage() {
  const [form, setForm]       = useState({ email:'', name:'', neighborhood:'', listingType:'', minBeds:'', maxPrice:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email) { setError('Email is required'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/alerts', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); return }
      setSuccess(true)
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      <section className="relative bg-obsidian-900 overflow-hidden py-16">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-25" />
        <div className="relative z-10 page-container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-sm font-semibold mb-5">
            <Bell className="w-4 h-4" />Smart Property Alerts
          </div>
          <h1 className="font-display text-5xl font-light text-white mb-4">
            Never Miss the<br /><span className="gold-text">Perfect Property</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Set your criteria once. Get notified instantly by email when a matching property is listed on Naya.
          </p>
        </div>
      </section>

      <div className="page-container py-12">
        <div className="max-w-2xl mx-auto">
          {success ? (
            <div className="card p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="font-display text-3xl font-medium text-obsidian-900 mb-3">Alert Set!</h2>
              <p className="text-obsidian-500 mb-6">We'll email <strong>{form.email}</strong> the moment a matching property is listed on Naya.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setSuccess(false); setForm({ email:'', name:'', neighborhood:'', listingType:'', minBeds:'', maxPrice:'' }) }}
                  className="btn-secondary gap-2">Set Another Alert</button>
                <Link href="/search" className="btn-primary gap-2">Browse Now <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          ) : (
            <div className="card p-6 md:p-8">
              <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Create Your Alert</h2>
              <p className="text-obsidian-400 text-sm mb-6">Fill in your ideal property criteria. Leave fields blank to match all.</p>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl mb-4">
                  <X className="w-4 h-4 text-rose-500" />
                  <p className="text-sm text-rose-700">{error}</p>
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Your Email *</label>
                    <input type="email" required className="input-field text-sm" placeholder="you@email.com"
                      value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div>
                    <label className="input-label">Your Name</label>
                    <input className="input-field text-sm" placeholder="Optional"
                      value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="input-label">Neighbourhood</label>
                    <select className="input-field text-sm" value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)}>
                      <option value="">Any area</option>
                      {AREAS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Listing Type</label>
                    <select className="input-field text-sm" value={form.listingType} onChange={e => set('listingType', e.target.value)}>
                      <option value="">Any type</option>
                      <option value="RENT">Rent</option>
                      <option value="SALE">Buy/Sale</option>
                      <option value="SHORTLET">Shortlet</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Min Bedrooms</label>
                    <select className="input-field text-sm" value={form.minBeds} onChange={e => set('minBeds', e.target.value)}>
                      <option value="">Any</option>
                      {['1','2','3','4','5'].map(n => <option key={n} value={n}>{n}+</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Max Price (₦)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 text-sm">₦</span>
                      <input className="input-field pl-7 text-sm font-mono" placeholder="5,000,000"
                        value={form.maxPrice} onChange={e => set('maxPrice', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gold-50 border border-gold-200 rounded-2xl flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-obsidian-700">
                    You'll receive an email the moment a new listing matching your criteria goes live on Naya.
                    We'll never spam you — only genuine matching properties.
                  </p>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2 disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Setting alert...</> : <><Bell className="w-4 h-4" />Create My Alert</>}
                </button>
              </form>
            </div>
          )}

          {/* How it works */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon:'🎯', title:'Set criteria', desc:'Area, type, beds, max price' },
              { icon:'🔔', title:'We watch', desc:'24/7 monitoring of new listings' },
              { icon:'📧', title:'You get notified', desc:'Instant email when matched' },
            ].map((s, i) => (
              <div key={i} className="card p-4 text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="font-semibold text-obsidian-900 text-sm">{s.title}</p>
                <p className="text-xs text-obsidian-400 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
