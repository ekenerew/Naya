'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Home, MapPin, DollarSign, CheckCircle2, AlertCircle,
  Loader2, ArrowRight, ChevronRight, Plus, X, Sparkles
} from 'lucide-react'

const propertyTypes = [
  'APARTMENT','DUPLEX','BUNGALOW','MANSION','TERRACE','PENTHOUSE',
  'STUDIO','SELF_CONTAINED','ROOM_PARLOUR','LAND','COMMERCIAL','SHORTLET',
]
const listingTypes = ['RENT','SALE','SHORTLET','LEASE']
const pricePeriods: Record<string,string[]> = {
  RENT: ['YEARLY','MONTHLY'],
  SALE: ['TOTAL'],
  SHORTLET: ['PER_NIGHT'],
  LEASE: ['YEARLY','MONTHLY'],
}
const neighborhoodList = [
  'GRA Phase 1','GRA Phase 2','Old GRA','Trans Amadi','Rumuola','Woji',
  'Eleme','D-Line','Diobu','Rumuigbo','Rumuokoro','Choba','Rumueme',
  'Peter Odili Road','Stadium Road','Bonny Island','Oyigbo','Okrika','Alakahia',
]
const amenityOptions = [
  'Generator','Borehole','Swimming Pool','Gym','CCTV','24-hr Security',
  'Parking','Elevator','Smart Home','Solar Power','BQ','Garden',
  'Serviced','Air Conditioning','Furnished','Waterfront','Gated Estate',
]

const steps = [
  { n: 1, label: 'Basic Info' },
  { n: 2, label: 'Location' },
  { n: 3, label: 'Details & Price' },
  { n: 4, label: 'Features' },
]

export default function ListPropertyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '', description: '',
    propertyType: '', listingType: '',
    price: '', pricePeriod: 'YEARLY', priceNegotiable: false,
    bedrooms: '', bathrooms: '', toilets: '', sizeSqm: '', yearBuilt: '',
    parkingSpaces: '0', furnishingStatus: '',
    address: '', neighborhood: '', lga: 'Port Harcourt',
    amenities: [] as string[],
    features: [] as string[],
    virtualTour: false,
  })

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const toggleAmenity = (a: string) => set('amenities',
    form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a])

  const canNext = () => {
    if (step === 1) return form.title.length >= 10 && form.description.length >= 50 && form.propertyType && form.listingType
    if (step === 2) return form.address.length >= 5 && form.neighborhood
    if (step === 3) return form.price && Number(form.price.replace(/,/g,'')) > 0
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:           form.title,
          description:     form.description,
          propertyType:    form.propertyType,
          listingType:     form.listingType,
          price:           Number(form.price.replace(/,/g,'')),
          pricePeriod:     form.pricePeriod,
          priceNegotiable: form.priceNegotiable,
          bedrooms:        Number(form.bedrooms) || 0,
          bathrooms:       Number(form.bathrooms) || 0,
          toilets:         Number(form.toilets) || 0,
          sizeSqm:         form.sizeSqm ? Number(form.sizeSqm) : undefined,
          yearBuilt:       form.yearBuilt ? Number(form.yearBuilt) : undefined,
          parkingSpaces:   Number(form.parkingSpaces) || 0,
          furnishingStatus:form.furnishingStatus || undefined,
          address:         form.address,
          neighborhood:    form.neighborhood,
          lga:             form.lga,
          amenities:       form.amenities,
          features:        form.features,
          virtualTour:     form.virtualTour,
        }),
      })
      const data = await res.json()
      if (res.status === 401) { router.push('/login'); return }
      if (!res.ok) { 
        setError(data.error || data.message || 'Failed to submit listing. Please try again.')
        console.error('Listing error:', data)
        return 
      }
      setSuccess(true)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="font-display text-3xl font-medium text-obsidian-900 mb-3">Listing Submitted!</h2>
        <p className="text-obsidian-500 text-sm mb-2">Your property has been submitted for review.</p>
        <p className="text-obsidian-400 text-sm mb-8">Our team will review and publish it within <strong>24 hours</strong>. You'll receive a notification once it goes live.</p>
        <div className="space-y-3">
          <Link href="/portal/dashboard" className="btn-primary w-full justify-center">Go to Dashboard <ArrowRight className="w-4 h-4" /></Link>
          <button onClick={() => { setSuccess(false); setStep(1); setForm({ title:'',description:'',propertyType:'',listingType:'',price:'',pricePeriod:'YEARLY',priceNegotiable:false,bedrooms:'',bathrooms:'',toilets:'',sizeSqm:'',yearBuilt:'',parkingSpaces:'0',furnishingStatus:'',address:'',neighborhood:'',lga:'Port Harcourt',amenities:[],features:[],virtualTour:false }) }}
            className="btn-secondary w-full justify-center">List Another Property</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Top nav */}
      <header className="bg-obsidian-900 border-b border-white/10 sticky top-0 z-40">
        <div className="page-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display text-xl font-light text-white">NAYA</Link>
            <div className="hidden md:flex items-center gap-1 text-xs text-white/40">
              <ChevronRight className="w-3 h-3" />
              <span>List a Property</span>
            </div>
          </div>
          <Link href="/portal/dashboard" className="text-white/50 hover:text-white text-sm transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="page-container py-10">
        <div className="max-w-2xl mx-auto">

          {/* Progress */}
          <div className="flex items-center gap-0 mb-10">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2 transition-all ${step > s.n ? 'bg-emerald-500 border-emerald-500 text-white' : step === s.n ? 'bg-obsidian-900 border-obsidian-900 text-white' : 'bg-white border-surface-border text-obsidian-300'}`}>
                    {step > s.n ? <CheckCircle2 className="w-5 h-5" /> : s.n}
                  </div>
                  <div className={`text-xs mt-2 font-medium ${step === s.n ? 'text-obsidian-900' : 'text-obsidian-400'}`}>{s.label}</div>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 mb-5 ${step > s.n ? 'bg-emerald-500' : 'bg-surface-border'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl mb-6">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700 flex-1">{error}</p>
              <button onClick={() => setError('')}><X className="w-4 h-4 text-rose-400" /></button>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="card p-8 space-y-5">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Basic Information</h2>
                <p className="text-obsidian-400 text-sm">Tell buyers exactly what you're listing.</p>
              </div>

              <div>
                <label className="input-label">Listing Type *</label>
                <div className="grid grid-cols-4 gap-2">
                  {listingTypes.map(t => (
                    <button key={t} onClick={() => { set('listingType', t); set('pricePeriod', pricePeriods[t][0]) }}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${form.listingType === t ? 'bg-obsidian-900 text-white border-obsidian-900' : 'bg-surface-subtle text-obsidian-600 border-surface-border hover:border-gold-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label">Property Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {propertyTypes.map(t => (
                    <button key={t} onClick={() => set('propertyType', t)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-left ${form.propertyType === t ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-600 border-surface-border hover:border-gold-300'}`}>
                      {t.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label">Property Title * <span className="text-obsidian-400 font-normal normal-case">(min 10 characters)</span></label>
                <input className="input-field text-sm" placeholder="e.g. 3-Bedroom Luxury Apartment, GRA Phase 2"
                  value={form.title} onChange={e => set('title', e.target.value)} />
                <div className="text-xs text-obsidian-400 mt-1">{form.title.length}/200 characters</div>
              </div>

              <div>
                <label className="input-label">Description * <span className="text-obsidian-400 font-normal normal-case">(min 50 characters)</span></label>
                <textarea className="input-field resize-none h-32 text-sm"
                  placeholder="Describe the property in detail — finishes, key features, what makes it special..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
                <div className="text-xs text-obsidian-400 mt-1">{form.description.length}/5000 characters</div>
              </div>

              <button onClick={() => canNext() && setStep(2)} disabled={!canNext()}
                className="btn-primary w-full justify-center disabled:opacity-50">
                Continue to Location <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="card p-8 space-y-5">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Location</h2>
                <p className="text-obsidian-400 text-sm">Where is the property located?</p>
              </div>

              <div>
                <label className="input-label">Neighbourhood *</label>
                <select className="input-field text-sm" value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)}>
                  <option value="">Select neighbourhood</option>
                  {neighborhoodList.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div>
                <label className="input-label">LGA *</label>
                <select className="input-field text-sm" value={form.lga} onChange={e => set('lga', e.target.value)}>
                  {['Port Harcourt','Obio-Akpor','Eleme','Bonny','Oyigbo','Okrika','Ikwerre'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="input-label">Full Address *</label>
                <input className="input-field text-sm" placeholder="e.g. Plot 47, Aba Road, GRA Phase 2"
                  value={form.address} onChange={e => set('address', e.target.value)} />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary px-5">← Back</button>
                <button onClick={() => canNext() && setStep(3)} disabled={!canNext()}
                  className="btn-primary flex-1 justify-center disabled:opacity-50">
                  Continue to Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="card p-8 space-y-5">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Details & Price</h2>
                <p className="text-obsidian-400 text-sm">Specs and pricing information.</p>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Price (₦) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 font-mono text-sm">₦</span>
                    <input type="text" className="input-field pl-7 text-sm font-mono" placeholder="e.g. 3,500,000"
                      value={form.price} onChange={e => set('price', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Price Period</label>
                  <select className="input-field text-sm" value={form.pricePeriod} onChange={e => set('pricePeriod', e.target.value)}>
                    {(pricePeriods[form.listingType] || ['TOTAL']).map(p => <option key={p} value={p}>{p.replace('_',' ')}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => set('priceNegotiable', !form.priceNegotiable)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${form.priceNegotiable ? 'bg-gold-500 border-gold-500' : 'border-obsidian-300'}`}>
                  {form.priceNegotiable && <CheckCircle2 className="w-3 h-3 text-obsidian-900" />}
                </button>
                <span className="text-sm text-obsidian-600 cursor-pointer" onClick={() => set('priceNegotiable', !form.priceNegotiable)}>Price is negotiable</span>
              </div>

              {/* Rooms */}
              {!['LAND','COMMERCIAL'].includes(form.propertyType) && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Bedrooms', key: 'bedrooms' },
                    { label: 'Bathrooms', key: 'bathrooms' },
                    { label: 'Toilets', key: 'toilets' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="input-label">{f.label}</label>
                      <select className="input-field text-sm" value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)}>
                        {['0','1','2','3','4','5','6+'].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Size (sqm)</label>
                  <input type="number" className="input-field text-sm" placeholder="e.g. 150"
                    value={form.sizeSqm} onChange={e => set('sizeSqm', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Year Built</label>
                  <input type="number" className="input-field text-sm" placeholder="e.g. 2020"
                    value={form.yearBuilt} onChange={e => set('yearBuilt', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="input-label">Furnishing</label>
                <select className="input-field text-sm" value={form.furnishingStatus} onChange={e => set('furnishingStatus', e.target.value)}>
                  <option value="">Not specified</option>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="partly">Partly Furnished</option>
                  <option value="fully">Fully Furnished</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary px-5">← Back</button>
                <button onClick={() => canNext() && setStep(4)} disabled={!canNext()}
                  className="btn-primary flex-1 justify-center disabled:opacity-50">
                  Continue to Features <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="card p-8 space-y-5">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-1">Features & Amenities</h2>
                <p className="text-obsidian-400 text-sm">Select everything available at this property.</p>
              </div>

              <div>
                <label className="input-label">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenityOptions.map(a => (
                    <button key={a} onClick={() => toggleAmenity(a)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${form.amenities.includes(a) ? 'bg-gold-500 text-obsidian-900 border-gold-500' : 'bg-surface-subtle text-obsidian-600 border-surface-border hover:border-gold-300'}`}>
                      {form.amenities.includes(a) && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Virtual tour toggle */}
              <div className="flex items-center justify-between p-4 bg-gold-50 border border-gold-200 rounded-xl">
                <div>
                  <div className="font-semibold text-obsidian-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-600" />Virtual Tour Available
                  </div>
                  <p className="text-xs text-obsidian-500 mt-0.5">Listings with virtual tours get 4x more enquiries</p>
                </div>
                <div onClick={() => set('virtualTour', !form.virtualTour)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${form.virtualTour ? 'bg-gold-500' : 'bg-obsidian-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.virtualTour ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-surface-subtle border border-surface-border rounded-xl">
                <div className="font-semibold text-obsidian-900 text-sm mb-3">Listing Summary</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-obsidian-600">
                  <div><span className="text-obsidian-400">Type:</span> {form.propertyType.replace(/_/g,' ')}</div>
                  <div><span className="text-obsidian-400">For:</span> {form.listingType}</div>
                  <div><span className="text-obsidian-400">Price:</span> ₦{Number(form.price.replace(/,/g,'')).toLocaleString()}/{form.pricePeriod.replace('_',' ')}</div>
                  <div><span className="text-obsidian-400">Area:</span> {form.neighborhood}</div>
                  {form.bedrooms && <div><span className="text-obsidian-400">Beds:</span> {form.bedrooms}</div>}
                  <div><span className="text-obsidian-400">Amenities:</span> {form.amenities.length} selected</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-700">Your listing will be reviewed by our team within <strong>24 hours</strong> before going live. Make sure all details are accurate.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="btn-secondary px-5">← Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="btn-primary flex-1 justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : <><CheckCircle2 className="w-4 h-4" />Submit Listing</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
