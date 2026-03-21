'use client'
import { useState, useRef } from 'react'
import {
  Home, MapPin, Bed, Bath, Maximize, TrendingUp, Bot,
  Loader2, CheckCircle2, ChevronDown, ArrowRight, Sparkles,
  BarChart3, Shield, FileText, RefreshCw, Building2,
  Zap, Star, AlertCircle, DollarSign, Clock, Users
} from 'lucide-react'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────────────
interface ValuationForm {
  propertyType: string
  listingType: string
  neighborhood: string
  lga: string
  bedrooms: string
  bathrooms: string
  sizeSqm: string
  condition: string
  floor: string
  titleType: string
  amenities: string[]
  yearBuilt: string
  additionalContext: string
}

interface ValuationResult {
  estimatedValue: string
  valueRange: string
  rentalYield: string
  monthlyRent: string
  yearlyRent: string
  confidence: string
  pricePerSqm: string
  marketPosition: string
  keyFactors: string[]
  investmentRating: string
  comparables: { address: string; price: string; size: string; date: string }[]
  recommendations: string[]
  outlook: string
  disclaimer: string
}

// ── Config ─────────────────────────────────────────────────────────────────────
const neighborhoods = [
  'GRA Phase 1', 'GRA Phase 2', 'Old GRA', 'Trans Amadi', 'Rumuola',
  'Woji', 'Eleme', 'D-Line', 'Diobu (Mile 1–3)', 'Borokiri',
  'Rumuigbo', 'Rumuokoro', 'Choba', 'Rumueme', 'Peter Odili Road',
  'Stadium Road', 'Oyigbo', 'Okrika', 'Bonny Island', 'Alakahia', 'Rumuibekwe',
]

const propertyTypes = [
  { value: 'apartment', label: 'Apartment / Flat' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'mansion', label: 'Mansion / Villa' },
  { value: 'terrace', label: 'Terrace House' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'studio', label: 'Studio Apartment' },
  { value: 'self_contained', label: 'Self Contained' },
  { value: 'room_parlour', label: 'Room & Parlour' },
  { value: 'single_room', label: 'Single Room' },
  { value: 'commercial', label: 'Office / Commercial' },
  { value: 'land', label: 'Land / Plot' },
]

const titleTypes = [
  { value: 'cof_o', label: 'Certificate of Occupancy (C of O)' },
  { value: 'governors_consent', label: "Governor's Consent" },
  { value: 'deed_of_assignment', label: 'Deed of Assignment' },
  { value: 'survey_plan', label: 'Survey Plan Only' },
  { value: 'gazette', label: 'Gazette' },
  { value: 'family_land', label: 'Family Land (No Formal Title)' },
  { value: 'unknown', label: 'Unknown / Not Sure' },
]

const amenitiesList = [
  'Generator', 'Borehole', 'Swimming Pool', 'Gym', 'CCTV',
  '24-hr Security', 'Parking', 'Elevator / Lift', 'Smart Home',
  'Solar Power', 'BQ (Boys Quarters)', 'Garden', 'Serviced',
  'Air Conditioning', 'Furnished', 'Waterfront', 'Gated Estate',
]

const conditionOptions = [
  { value: 'new', label: 'Brand New / Off-Plan' },
  { value: 'excellent', label: 'Excellent (5 yrs old or less)' },
  { value: 'good', label: 'Good (5–15 yrs, well maintained)' },
  { value: 'fair', label: 'Fair (needs minor work)' },
  { value: 'poor', label: 'Poor (needs major renovation)' },
]

// ── AI Valuation Prompt ────────────────────────────────────────────────────────
function buildValuationPrompt(form: ValuationForm): string {
  return `You are Naya AI — a specialist property valuation engine for Port Harcourt, Rivers State, Nigeria. You have deep knowledge of real estate pricing across all PH neighbourhoods.

PROPERTY TO VALUE:
- Type: ${form.propertyType}
- Listing Type: ${form.listingType} (sale or rent)
- Neighbourhood: ${form.neighborhood}, ${form.lga} LGA
- Bedrooms: ${form.bedrooms || 'Not specified'}
- Bathrooms: ${form.bathrooms || 'Not specified'}
- Size: ${form.sizeSqm ? form.sizeSqm + ' sqm' : 'Not specified'}
- Condition: ${form.condition}
- Floor: ${form.floor || 'Ground floor'}
- Title Type: ${form.titleType}
- Amenities: ${form.amenities.length > 0 ? form.amenities.join(', ') : 'Standard'}
- Year Built: ${form.yearBuilt || 'Unknown'}
- Additional context: ${form.additionalContext || 'None'}

PORT HARCOURT MARKET REFERENCE DATA (Q1 2026):
- GRA Phase 2: avg buy ₦180M, 1-bed rent ₦1.8M/yr, growth +8.2%
- Old GRA: avg buy ₦150M, 1-bed rent ₦1.5M/yr, growth +2.1%
- Woji: avg buy ₦120M, 1-bed rent ₦1.2M/yr, growth +18.7%
- Trans Amadi: avg buy ₦85M, 1-bed rent ₦900K/yr, growth +12.5%
- Rumuola: avg buy ₦55M, 1-bed rent ₦600K/yr, growth +15.3%
- Eleme: avg buy ₦65M, 1-bed rent ₦700K/yr, growth +3.4%
- Bonny Island: avg buy ₦95M, 1-bed rent ₦1.2M/yr, growth +22.4%
- Choba: avg buy ₦32M, 1-bed rent ₦380K/yr, growth +13.2%
- Peter Odili Road: avg buy ₦210M, 1-bed rent ₦2M/yr, growth +14.2%
- D-Line: avg buy ₦28M, 1-bed rent ₦350K/yr

TITLE ADJUSTMENTS:
- C of O: full market value (no discount)
- Governor's Consent: -3 to -5%
- Deed of Assignment: -5 to -8%
- Survey Plan Only: -15 to -20%
- Family Land: -25 to -35% + high risk premium
- Unknown: treat as Deed of Assignment conservatively

CONDITION ADJUSTMENTS:
- Brand New: +10 to +15% premium
- Excellent: market value
- Good: -5 to -8%
- Fair: -15 to -20%
- Poor: -30 to -40%

AMENITY PREMIUMS (cumulative):
- Swimming Pool: +8-12%
- Gym: +3-5%
- Smart Home: +5-8%
- Solar Power: +3-5%
- 24-hr Security in gated estate: +5-8%
- Furnished: +15-25% for rent, +5% for sale
- Generator: +3-5% in areas with poor power

Please provide a comprehensive valuation in the following JSON format ONLY. No preamble. No markdown. Just valid JSON:

{
  "estimatedValue": "₦XXM (for sale) or ₦XXXK/yr (for rent)",
  "valueRange": "₦XXM – ₦XXM or ₦XXXK – ₦XXXK/yr",
  "rentalYield": "X.X% gross annual yield",
  "monthlyRent": "₦XXX,XXX/month estimated",
  "yearlyRent": "₦X.XM/year estimated",
  "confidence": "High / Medium / Low",
  "pricePerSqm": "₦XXX,XXX per sqm",
  "marketPosition": "Below market / At market / Above market / Premium segment",
  "keyFactors": ["Factor 1 affecting value", "Factor 2", "Factor 3", "Factor 4", "Factor 5"],
  "investmentRating": "Excellent / Good / Fair / Poor",
  "comparables": [
    {"address": "Similar property nearby", "price": "₦XXM", "size": "XXX sqm", "date": "Recent sale"},
    {"address": "Another comparable", "price": "₦XXM", "size": "XXX sqm", "date": "Recent sale"},
    {"address": "Third comparable", "price": "₦XXM", "size": "XXX sqm", "date": "Recent sale"}
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "outlook": "Short paragraph on price outlook for this property type and area in 2026",
  "disclaimer": "This is an AI-generated estimate based on market data and is not a certified RICS or NIESV valuation."
}`
}

// ── Progress Steps ─────────────────────────────────────────────────────────────
const steps = [
  { id: 1, label: 'Property Details' },
  { id: 2, label: 'Location & Title' },
  { id: 3, label: 'Condition & Amenities' },
  { id: 4, label: 'Your Valuation' },
]

// ── Rating color helper ────────────────────────────────────────────────────────
function ratingColor(r: string) {
  if (r === 'Excellent') return 'text-emerald-600 bg-emerald-50 border-emerald-200'
  if (r === 'Good') return 'text-blue-600 bg-blue-50 border-blue-200'
  if (r === 'Fair') return 'text-amber-600 bg-amber-50 border-amber-200'
  return 'text-rose-600 bg-rose-50 border-rose-200'
}

function confidenceColor(c: string) {
  if (c === 'High') return 'text-emerald-600'
  if (c === 'Medium') return 'text-amber-600'
  return 'text-rose-600'
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ValuationPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValuationResult | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState<ValuationForm>({
    propertyType: '',
    listingType: 'sale',
    neighborhood: '',
    lga: '',
    bedrooms: '',
    bathrooms: '',
    sizeSqm: '',
    condition: 'good',
    floor: '',
    titleType: '',
    amenities: [],
    yearBuilt: '',
    additionalContext: '',
  })

  const update = (field: keyof ValuationForm, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const toggleAmenity = (a: string) =>
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a]
    }))

  const canProceed = () => {
    if (step === 1) return form.propertyType && form.listingType
    if (step === 2) return form.neighborhood && form.titleType
    if (step === 3) return form.condition
    return false
  }

  const runValuation = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: buildValuationPrompt(form) }],
        })
      })
      const data = await response.json()
      const text = data.content || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed: ValuationResult = JSON.parse(clean)
      setResult(parsed)
      setStep(4)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 200)
    } catch (e) {
      setError('Valuation failed. Please check your inputs and try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStep(1)
    setResult(null)
    setError('')
    setForm({
      propertyType: '', listingType: 'sale', neighborhood: '', lga: '',
      bedrooms: '', bathrooms: '', sizeSqm: '', condition: 'good',
      floor: '', titleType: '', amenities: [], yearBuilt: '', additionalContext: '',
    })
  }

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <Bot className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">AI-Powered · Port Harcourt Property Valuation</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.92] tracking-tight mb-6">
              What Is Your<br />
              <span className="gold-text">Property Worth?</span>
            </h1>
            <p className="text-white/40 text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Get an instant AI-powered valuation for any property in Port Harcourt — including estimated sale price, rental value, yield analysis, and investment rating.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/30 text-sm">
              {[
                { icon: Bot, label: 'Powered by Claude AI' },
                { icon: BarChart3, label: 'Live PH market data' },
                { icon: Clock, label: 'Results in 30 seconds' },
                { icon: Shield, label: 'Free & confidential' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-gold-500" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* ── MAIN FORM ────────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">

            {/* Progress Steps */}
            {step < 4 && (
              <div className="flex items-center gap-0 mb-10">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2 transition-all ${
                        step > s.id ? 'bg-emerald-500 border-emerald-500 text-white' :
                        step === s.id ? 'bg-obsidian-900 border-obsidian-900 text-white' :
                        'bg-white border-surface-border text-obsidian-300'
                      }`}>
                        {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                      </div>
                      <div className={`text-xs mt-2 font-medium ${step === s.id ? 'text-obsidian-900' : 'text-obsidian-400'}`}>{s.label}</div>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-3 mb-5 ${step > s.id ? 'bg-emerald-500' : 'bg-surface-border'}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 1: Property Details ─────────────────────────────── */}
            {step === 1 && (
              <div className="card p-8">
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-2">Property Details</h2>
                <p className="text-obsidian-400 text-sm mb-8">Tell us about the property you want to value.</p>

                {/* Listing Type */}
                <div className="mb-6">
                  <label className="input-label">I want to value this property for</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'sale', label: '🏠 Sale Value', sub: 'How much can I sell for?' },
                      { value: 'rent', label: '🔑 Rental Value', sub: 'How much rent can I charge?' },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => update('listingType', opt.value)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${form.listingType === opt.value ? 'border-gold-500 bg-gold-50' : 'border-surface-border bg-white hover:border-gold-300'}`}>
                        <div className="font-semibold text-obsidian-900 text-sm mb-1">{opt.label}</div>
                        <div className="text-xs text-obsidian-400">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="input-label">Property Type *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {propertyTypes.map(pt => (
                      <button key={pt.value} onClick={() => update('propertyType', pt.value)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-left ${form.propertyType === pt.value ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-600 border-surface-border hover:border-gold-300'}`}>
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bedrooms, Bathrooms, Size */}
                {!['land', 'single_room', 'room_parlour', 'commercial'].includes(form.propertyType) && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="input-label">Bedrooms</label>
                      <select className="input-field text-sm" value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)}>
                        <option value="">Select</option>
                        {['Studio', '1', '2', '3', '4', '5', '6+'].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Bathrooms</label>
                      <select className="input-field text-sm" value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)}>
                        <option value="">Select</option>
                        {['1', '2', '3', '4', '5', '6+'].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Size (sqm)</label>
                      <input type="number" className="input-field text-sm" placeholder="e.g. 150"
                        value={form.sizeSqm} onChange={e => update('sizeSqm', e.target.value)} />
                    </div>
                  </div>
                )}

                {/* Year Built */}
                <div className="mb-6">
                  <label className="input-label">Year Built (approx.)</label>
                  <input type="number" className="input-field text-sm max-w-xs" placeholder="e.g. 2020"
                    value={form.yearBuilt} onChange={e => update('yearBuilt', e.target.value)} />
                </div>

                <button onClick={() => canProceed() && setStep(2)}
                  disabled={!canProceed()}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue to Location <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── STEP 2: Location & Title ─────────────────────────────── */}
            {step === 2 && (
              <div className="card p-8">
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-2">Location & Title</h2>
                <p className="text-obsidian-400 text-sm mb-8">Location and title type are the two biggest drivers of property value in Nigeria.</p>

                {/* Neighbourhood */}
                <div className="mb-6">
                  <label className="input-label">Neighbourhood *</label>
                  <select className="input-field text-sm" value={form.neighborhood} onChange={e => update('neighborhood', e.target.value)}>
                    <option value="">Select neighbourhood</option>
                    {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Floor */}
                <div className="mb-6">
                  <label className="input-label">Floor / Level</label>
                  <select className="input-field text-sm max-w-xs" value={form.floor} onChange={e => update('floor', e.target.value)}>
                    <option value="">Ground Floor / Standalone</option>
                    {['1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', 'Higher Floor', 'Penthouse / Top Floor'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Title Type */}
                <div className="mb-6">
                  <label className="input-label">Title Type *</label>
                  <p className="text-xs text-obsidian-400 mb-3">Title type significantly affects value. C of O commands the highest premium.</p>
                  <div className="space-y-2">
                    {titleTypes.map(t => (
                      <button key={t.value} onClick={() => update('titleType', t.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all ${form.titleType === t.value ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-600 border-surface-border hover:border-gold-300'}`}>
                        <span className="font-medium">{t.label}</span>
                        {form.titleType === t.value && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                  <button onClick={() => canProceed() && setStep(3)}
                    disabled={!canProceed()}
                    className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    Continue to Condition <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Condition & Amenities ────────────────────────── */}
            {step === 3 && (
              <div className="card p-8">
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-2">Condition & Amenities</h2>
                <p className="text-obsidian-400 text-sm mb-8">These factors directly impact the final valuation figure.</p>

                {/* Condition */}
                <div className="mb-6">
                  <label className="input-label">Property Condition *</label>
                  <div className="space-y-2">
                    {conditionOptions.map(c => (
                      <button key={c.value} onClick={() => update('condition', c.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all ${form.condition === c.value ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-600 border-surface-border hover:border-gold-300'}`}>
                        <span className="font-medium">{c.label}</span>
                        {form.condition === c.value && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <label className="input-label">Amenities (select all that apply)</label>
                  <p className="text-xs text-obsidian-400 mb-3">Premium amenities add value — especially pool, smart home, and security.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {amenitiesList.map(a => (
                      <button key={a} onClick={() => toggleAmenity(a)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${form.amenities.includes(a) ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-600 border-surface-border hover:border-gold-300'}`}>
                        {form.amenities.includes(a) && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Context */}
                <div className="mb-8">
                  <label className="input-label">Any additional details? (optional)</label>
                  <textarea className="input-field resize-none h-24 text-sm"
                    placeholder="e.g. Recently renovated kitchen, corner plot, waterfront view, in a gated estate, close to NLNG, etc."
                    value={form.additionalContext} onChange={e => update('additionalContext', e.target.value)} />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary">← Back</button>
                  <button onClick={runValuation} disabled={loading}
                    className="btn-primary flex-1 justify-center gap-2 disabled:opacity-50">
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Analysing property...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" />Get AI Valuation</>
                    )}
                  </button>
                </div>

                {loading && (
                  <div className="mt-6 p-4 bg-gold-50 border border-gold-200 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Bot className="w-5 h-5 text-gold-600 animate-pulse" />
                      <span className="font-medium text-obsidian-900 text-sm">Naya AI is analysing your property...</span>
                    </div>
                    <div className="space-y-2">
                      {['Comparing with recent PH transactions', 'Applying neighbourhood price data', 'Calculating title and condition adjustments', 'Estimating rental yield and ROI', 'Generating investment rating'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-obsidian-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-700">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Results ──────────────────────────────────────── */}
            {step === 4 && result && (
              <div ref={resultRef} className="space-y-5">

                {/* Valuation Header */}
                <div className="card p-8 bg-obsidian-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-obsidian-900" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Naya AI Valuation Report</div>
                        <div className="text-white/40 text-xs">{form.propertyType} · {form.neighborhood} · {new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">
                          {form.listingType === 'sale' ? 'Estimated Sale Value' : 'Estimated Rental Value'}
                        </div>
                        <div className="font-display text-5xl md:text-6xl font-light text-gold-400 mb-2">{result.estimatedValue}</div>
                        <div className="text-white/40 text-sm mb-4">Range: {result.valueRange}</div>
                        {result.pricePerSqm && form.sizeSqm && (
                          <div className="text-white/30 text-xs font-mono">{result.pricePerSqm}</div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div className="text-white/30 text-xs mb-1">Confidence Level</div>
                          <div className={`font-display text-xl font-medium ${confidenceColor(result.confidence)}`}>{result.confidence}</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div className="text-white/30 text-xs mb-1">Investment Rating</div>
                          <div className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border ${ratingColor(result.investmentRating)}`}>
                            <Star className="w-3.5 h-3.5" />{result.investmentRating}
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div className="text-white/30 text-xs mb-1">Market Position</div>
                          <div className="text-white text-sm font-medium">{result.marketPosition}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental metrics (if sale valuation) */}
                {form.listingType === 'sale' && result.yearlyRent && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card p-5 text-center">
                      <div className="font-mono text-xs text-obsidian-400 uppercase tracking-wider mb-2">Estimated Annual Rent</div>
                      <div className="font-display text-2xl font-medium text-gold-600">{result.yearlyRent}</div>
                    </div>
                    <div className="card p-5 text-center">
                      <div className="font-mono text-xs text-obsidian-400 uppercase tracking-wider mb-2">Monthly Rent Estimate</div>
                      <div className="font-display text-2xl font-medium text-obsidian-900">{result.monthlyRent}</div>
                    </div>
                    <div className="card p-5 text-center">
                      <div className="font-mono text-xs text-obsidian-400 uppercase tracking-wider mb-2">Estimated Gross Yield</div>
                      <div className="font-display text-2xl font-medium text-emerald-600">{result.rentalYield}</div>
                    </div>
                  </div>
                )}

                {/* Key Value Factors */}
                <div className="card p-6">
                  <h3 className="font-display text-xl font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gold-500" />Key Value Factors
                  </h3>
                  <div className="space-y-3">
                    {result.keyFactors?.map((factor, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-surface-subtle rounded-xl border border-surface-border">
                        <div className="w-6 h-6 rounded-full bg-obsidian-900 text-white text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                        <p className="text-sm text-obsidian-600 leading-relaxed">{factor}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparables */}
                {result.comparables?.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-display text-xl font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                      <Home className="w-5 h-5 text-gold-500" />Comparable Properties
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-obsidian-900">
                            <th className="text-left py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Property</th>
                            <th className="text-right py-3 px-3 font-mono text-xs text-gold-600 uppercase tracking-wider">Price</th>
                            <th className="text-right py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Size</th>
                            <th className="text-right py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.comparables.map((c, i) => (
                            <tr key={i} className={`border-b border-surface-border ${i % 2 === 0 ? 'bg-surface-subtle/30' : 'bg-white'}`}>
                              <td className="py-3 px-3 text-obsidian-700 font-medium text-sm">{c.address}</td>
                              <td className="py-3 px-3 text-right font-mono text-sm text-gold-600 font-bold">{c.price}</td>
                              <td className="py-3 px-3 text-right font-mono text-xs text-obsidian-500">{c.size}</td>
                              <td className="py-3 px-3 text-right font-mono text-xs text-obsidian-400">{c.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Recommendations + Outlook */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="card p-6">
                    <h3 className="font-display text-xl font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold-500" />AI Recommendations
                    </h3>
                    <div className="space-y-3">
                      {result.recommendations?.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-obsidian-600 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card p-6">
                    <h3 className="font-display text-xl font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gold-500" />2026 Outlook
                    </h3>
                    <p className="text-sm text-obsidian-600 leading-relaxed">{result.outlook}</p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="card p-5 bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-900 text-sm mb-1">Important Disclaimer</div>
                      <p className="text-xs text-amber-700 leading-relaxed">{result.disclaimer} For a certified valuation for mortgage, legal, or insurance purposes, engage a registered member of the Nigerian Institution of Estate Surveyors and Valuers (NIESV).</p>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button onClick={reset} className="card p-4 flex items-center gap-3 hover:border-gold-300 transition-colors">
                    <RefreshCw className="w-5 h-5 text-gold-500" />
                    <div className="text-left">
                      <div className="font-semibold text-obsidian-900 text-sm">Value Another Property</div>
                      <div className="text-xs text-obsidian-400">Start a new valuation</div>
                    </div>
                  </button>
                  <Link href="/contact" className="card p-4 flex items-center gap-3 hover:border-gold-300 transition-colors">
                    <Users className="w-5 h-5 text-gold-500" />
                    <div className="text-left">
                      <div className="font-semibold text-obsidian-900 text-sm">Speak to an Agent</div>
                      <div className="text-xs text-obsidian-400">Get a professional assessment</div>
                    </div>
                  </Link>
                  <Link href="/new-developments" className="card p-4 flex items-center gap-3 hover:border-gold-300 transition-colors">
                    <Building2 className="w-5 h-5 text-gold-500" />
                    <div className="text-left">
                      <div className="font-semibold text-obsidian-900 text-sm">Compare New Builds</div>
                      <div className="text-xs text-obsidian-400">See what new developments cost</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      {step < 4 && (
        <section className="section-padding bg-white">
          <div className="page-container">
            <div className="text-center mb-10">
              <span className="section-number">How It Works</span>
              <h2 className="section-title">AI Valuation in 3 Steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { step: '01', icon: FileText, title: 'Enter Property Details', desc: 'Tell us the type, size, bedrooms, condition, and title type of your property. Takes under 2 minutes.', color: 'text-gold-600', bg: 'bg-gold-50' },
                { step: '02', icon: Bot, title: 'AI Analyses the Market', desc: 'Claude AI cross-references your property against real PH transaction data, neighbourhood trends, and market conditions.', color: 'text-blue-600', bg: 'bg-blue-50' },
                { step: '03', icon: BarChart3, title: 'Get Your Full Report', desc: 'Receive an estimated value, rental yield, comparables, investment rating, and personalised recommendations.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map((item, i) => (
                <div key={i} className="card p-6 text-center">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <div className="font-mono text-xs text-obsidian-300 mb-2">{item.step}</div>
                  <h3 className="font-display text-lg font-medium text-obsidian-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-obsidian-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* What affects value */}
            <div className="max-w-3xl mx-auto mt-12 card p-6">
              <h3 className="font-display text-xl font-medium text-obsidian-900 mb-5">What Our AI Considers</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  '📍 Neighbourhood & LGA', '📐 Plot / Floor size',
                  '🏛 Title type (C of O vs Deed)', '🔨 Property condition',
                  '🛁 Number of bedrooms & bathrooms', '⚡ Amenities (pool, generator, etc.)',
                  '📈 12-month price trend for the area', '🏗 Year built & recent renovation',
                  '🛢 Proximity to oil & gas employers', '🎓 School catchment area',
                  '🌊 Flood risk & topography', '🔑 Rental demand in the area',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-obsidian-600 p-2 bg-surface-subtle rounded-xl border border-surface-border">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-white font-light mb-4">
            Need a Certified Valuation?
          </h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            For mortgage applications, legal disputes, or insurance purposes, you need a certified NIESV valuation. Our agents can connect you with registered estate surveyors in Port Harcourt.
          </p>
          <Link href="/contact" className="btn-primary btn-lg">
            Request Certified Valuation <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  )
}
