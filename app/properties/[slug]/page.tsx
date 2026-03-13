'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MapPin, BedDouble, Bath, Maximize2, Eye, Heart, Share2, CheckCircle2, Phone, MessageCircle, ChevronLeft, ChevronRight, X, Play, RotateCcw, ZoomIn, Star, Calendar, ShieldCheck, Building2, Banknote, TrendingUp } from 'lucide-react'
import { properties, agents, neighborhoods, getPropertyBySlug, getAgentById, getPropertyGradient, getPriceLabel, propertyTypeEmojis, formatPrice, getPropertiesByNeighborhood } from '@/lib/data'
import PropertyCard from '@/components/property/PropertyCard'
import clsx from 'clsx'

export default function PropertyDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const property = getPropertyBySlug(slug)

  const [activeImg, setActiveImg] = useState(0)
  const [saved, setSaved] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const [tourAngle, setTourAngle] = useState(0)
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', email: '', message: '', type: 'general' })
  const [submitted, setSubmitted] = useState(false)
  const [loanAmount, setLoanAmount] = useState('')
  const [tenor, setTenor] = useState('15')
  const [rate, setRate] = useState('18')

  if (!property) return <NotFound />

  const agent = getAgentById(property.agentId)
  const hood = neighborhoods.find(n => n.name === property.neighborhood)
  const similar = getPropertiesByNeighborhood(property.neighborhood).filter(p => p.id !== property.id).slice(0, 4)
  const gradient = getPropertyGradient(property.propertyType)
  const emoji = propertyTypeEmojis[property.propertyType] || '🏠'
  const priceLabel = getPriceLabel(property)

  const monthly = loanAmount && tenor && rate
    ? (parseInt(loanAmount) * (parseFloat(rate)/100/12)) / (1 - Math.pow(1 + parseFloat(rate)/100/12, -parseInt(tenor)*12))
    : 0

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const imgCount = property.images.length || 3

  return (
    <div className="bg-surface-bg min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-surface-border">
        <div className="page-container py-3">
          <nav className="flex items-center gap-2 text-xs text-obsidian-400 flex-wrap">
            <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
            <span className="text-obsidian-200">›</span>
            <Link href="/search" className="hover:text-gold-600 transition-colors">Properties</Link>
            <span className="text-obsidian-200">›</span>
            <Link href={`/neighborhoods/${hood?.slug || '#'}`} className="hover:text-gold-600 transition-colors">{property.neighborhood}</Link>
            <span className="text-obsidian-200">›</span>
            <span className="text-obsidian-600 truncate max-w-[200px]">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="page-container py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* LEFT — Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <div className={`relative h-64 sm:h-80 md:h-96 bg-gradient-to-br ${gradient}`}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[80px] opacity-20">{emoji}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Nav arrows */}
                <button onClick={() => setActiveImg(i => Math.max(0, i-1))} disabled={activeImg===0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 disabled:opacity-30 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setActiveImg(i => Math.min(imgCount-1, i+1))} disabled={activeImg>=imgCount-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 disabled:opacity-30 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Photo counter */}
                <div className="absolute bottom-3 left-3 bg-black/50 text-white font-mono text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                  {activeImg+1}/{imgCount} photos
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  {property.isFeatured && <span className="badge badge-gold text-[10px]">⭐ Featured</span>}
                  {property.isNew && <span className="badge badge-new text-[10px]">New</span>}
                  {property.virtualTour && <span className="badge badge-dark text-[10px]">360° Tour</span>}
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => setSaved(!saved)}
                    className={clsx('w-9 h-9 rounded-full flex items-center justify-center border transition-all', saved ? 'bg-gold-500 border-gold-500 text-obsidian-900' : 'bg-black/40 border-white/20 text-white hover:bg-gold-500/80')}>
                    <Heart className={clsx('w-4 h-4', saved && 'fill-current')} />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Virtual Tour Button */}
                {property.virtualTour && (
                  <button onClick={() => setTourOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 bg-gold-500/90 text-obsidian-900 rounded-xl text-xs font-semibold hover:bg-gold-400 transition-all backdrop-blur-sm">
                    <Play className="w-3.5 h-3.5" />
                    Virtual Tour
                  </button>
                )}
              </div>

              {/* Thumb Strip */}
              <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar bg-surface-subtle">
                {Array.from({length: imgCount}).map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={clsx('w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl border-2 transition-all', gradient, activeImg===i ? 'border-gold-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-75')}>
                    <span className="opacity-40">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Price */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-medium text-obsidian-900 leading-tight mb-2">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-sm text-obsidian-400">
                    <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    {property.address}, {property.neighborhood}, {property.lga}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-2xl md:text-3xl font-bold text-gold-600">{priceLabel}</div>
                  {property.pricePeriod === 'yearly' && <div className="text-xs text-obsidian-400 font-mono">{formatPrice(property.price/12)}/month</div>}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-surface-border my-4">
                {[
                  {i: '🛏', v: property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'N/A', l: 'Bedrooms'},
                  {i: '🚿', v: `${property.bathrooms} Baths`, l: 'Bathrooms'},
                  {i: '📐', v: `${property.sizeSqm} m²`, l: 'Floor Area'},
                  {i: '🚗', v: `${property.parkingSpaces} Spaces`, l: 'Parking'},
                ].map(s => (
                  <div key={s.l} className="text-center p-3 bg-surface-subtle rounded-xl">
                    <div className="text-xl mb-1">{s.i}</div>
                    <div className="font-mono text-sm font-semibold text-obsidian-800">{s.v}</div>
                    <div className="text-xs text-obsidian-400">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                {property.isVerified && <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full"><CheckCircle2 className="w-3 h-3"/>Verified Listing</span>}
                <span className="text-xs text-obsidian-500 bg-surface-subtle border border-surface-border px-3 py-1 rounded-full">Built {property.yearBuilt}</span>
                <span className="text-xs text-obsidian-500 bg-surface-subtle border border-surface-border px-3 py-1 rounded-full capitalize">{property.propertyType}</span>
                {property.floorLevel && <span className="text-xs text-obsidian-500 bg-surface-subtle border border-surface-border px-3 py-1 rounded-full">Floor {property.floorLevel}/{property.totalFloors}</span>}
                <span className="text-xs text-obsidian-500 bg-surface-subtle border border-surface-border px-3 py-1 rounded-full"><Eye className="w-3 h-3 inline mr-1"/>{property.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-medium text-obsidian-900 mb-4">About This Property</h2>
              <p className="text-obsidian-600 leading-relaxed text-sm">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-medium text-obsidian-900 mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {property.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-obsidian-600 bg-surface-subtle px-3 py-2 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
              {property.features.length > 0 && (
                <>
                  <h3 className="font-body text-sm font-semibold text-obsidian-700 mb-2 mt-4">Special Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map(f => (
                      <span key={f} className="text-xs text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full">{f}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Neighborhood */}
            {hood && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-medium text-obsidian-900">About {hood.name}</h2>
                  <Link href={`/neighborhoods/${hood.slug}`} className="text-xs text-gold-600 hover:text-gold-500 font-medium">Full guide →</Link>
                </div>
                <p className="text-sm text-obsidian-500 leading-relaxed mb-5">{hood.description.substring(0, 200)}…</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {l:'Safety', v: hood.safetyScore, c: hood.safetyScore >= 80 ? 'text-emerald-600' : hood.safetyScore >= 60 ? 'text-amber-600' : 'text-red-600'},
                    {l:'Infrastructure', v: hood.infrastructureScore, c: 'text-blue-600'},
                    {l:'Schools', v: hood.schoolScore, c: 'text-purple-600'},
                    {l:'Flood Risk', v: 100 - hood.floodRiskScore, c: hood.floodRiskScore >= 70 ? 'text-emerald-600' : 'text-amber-600'},
                  ].map(s => (
                    <div key={s.l} className="text-center p-3 bg-surface-subtle rounded-xl">
                      <div className={`font-mono text-lg font-bold ${s.c}`}>{s.v}</div>
                      <div className="text-xs text-obsidian-400 mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mortgage Calculator */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-medium text-obsidian-900 mb-4 flex items-center gap-2"><Banknote className="w-5 h-5 text-gold-500"/>Mortgage Calculator</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="input-label">Loan Amount (₦)</label>
                  <input type="number" className="input-field" placeholder={property.price.toString()} value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Interest Rate (%)</label>
                  <input type="number" className="input-field" value={rate} onChange={e => setRate(e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Tenor (years)</label>
                  <select className="input-field" value={tenor} onChange={e => setTenor(e.target.value)}>
                    {[5,10,15,20,25,30].map(y => <option key={y} value={y}>{y} years</option>)}
                  </select>
                </div>
              </div>
              {monthly > 0 && (
                <div className="bg-gold-50 border border-gold-200 rounded-2xl p-4">
                  <div className="text-xs text-gold-700 font-mono uppercase tracking-widest mb-1">Estimated Monthly Payment</div>
                  <div className="font-display text-3xl font-medium text-gold-700">{formatPrice(monthly)}</div>
                  <p className="text-xs text-gold-600 mt-1">Based on {rate}% interest, {tenor} year term</p>
                </div>
              )}
              <Link href="/tools/mortgage-calculator" className="mt-4 btn-secondary btn-sm inline-flex">Full Calculator & Pre-Approval</Link>
            </div>

            {/* Similar Properties */}
            {similar.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-5">Similar in {property.neighborhood}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similar.map(p => <PropertyCard key={p.id} property={p} compact />)}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-4">

              {/* Enquiry Form */}
              <div className="card p-5">
                {submitted ? (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="font-display text-xl font-medium text-obsidian-900 mb-2">Enquiry Sent!</h3>
                    <p className="text-sm text-obsidian-400">The agent will contact you within 2 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="btn-secondary btn-sm mt-4">Send Another</button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-lg font-medium text-obsidian-900 mb-1">Request a Viewing</h3>
                    <p className="text-xs text-obsidian-400 mb-4">Agent responds within 2 hours</p>
                    <form onSubmit={handleEnquiry} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {[{l:'Enquiry Type',f:'select',n:'type',opts:['General Enquiry','Schedule Visit','Mortgage Enquiry','Make an Offer']},].map(() => (
                          <div key="type" className="col-span-2">
                            <label className="input-label">Enquiry Type</label>
                            <select className="input-field" value={enquiryForm.type} onChange={e => setEnquiryForm({...enquiryForm, type: e.target.value})}>
                              {['General Enquiry','Schedule a Visit','Mortgage Enquiry','Make an Offer'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                      <input required className="input-field" placeholder="Your full name" value={enquiryForm.name} onChange={e => setEnquiryForm({...enquiryForm, name: e.target.value})} />
                      <input required className="input-field" placeholder="+234 xxx xxxx" value={enquiryForm.phone} onChange={e => setEnquiryForm({...enquiryForm, phone: e.target.value})} />
                      <input type="email" className="input-field" placeholder="Email (optional)" value={enquiryForm.email} onChange={e => setEnquiryForm({...enquiryForm, email: e.target.value})} />
                      <textarea className="input-field resize-none h-20" placeholder="Any specific questions or requirements?" value={enquiryForm.message} onChange={e => setEnquiryForm({...enquiryForm, message: e.target.value})} />
                      <button type="submit" className="btn-primary w-full justify-center">Send Enquiry</button>
                    </form>
                  </>
                )}
              </div>

              {/* Agent Card */}
              {agent && (
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center font-display text-lg font-medium text-obsidian-900">
                      {agent.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-obsidian-900">{agent.name}</div>
                      <div className="text-xs text-obsidian-400 truncate">{agent.agencyName}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({length: 5}).map((_,i) => <Star key={i} className={clsx('w-2.5 h-2.5', i<Math.floor(agent.rating)?'fill-gold-400 text-gold-400':'text-obsidian-200')}/>)}
                        <span className="font-mono text-[10px] text-obsidian-400 ml-1">{agent.rating}</span>
                      </div>
                    </div>
                    {agent.isVerified && <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gold-50 border border-gold-200 rounded-xl mb-4 text-xs text-gold-700">
                    <span>🏛</span>
                    <div><div className="font-semibold">RSSPC Verified</div><div className="text-gold-600 font-mono">{agent.rsspcNumber}</div></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    {[{v:agent.totalListings,l:'Listings'},{v:agent.totalSales,l:'Sold'},{v:agent.yearsActive+'yr',l:'Active'}].map(s => (
                      <div key={s.l} className="bg-surface-subtle rounded-xl p-2">
                        <div className="font-mono text-sm font-semibold text-gold-600">{s.v}</div>
                        <div className="text-[10px] text-obsidian-400">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <a href={`tel:${agent.phone}`} className="btn-dark w-full justify-center btn-sm"><Phone className="w-3.5 h-3.5"/>Call Agent</a>
                    <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center btn-sm"><MessageCircle className="w-3.5 h-3.5"/>WhatsApp</a>
                    <Link href={`/agents/${agent.username}`} className="btn-ghost w-full justify-center btn-sm text-xs">View Profile</Link>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="card p-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-surface-subtle rounded-xl">
                    <div className="font-mono text-lg font-semibold text-obsidian-800">{property.views.toLocaleString()}</div>
                    <div className="text-xs text-obsidian-400">Views</div>
                  </div>
                  <div className="p-3 bg-surface-subtle rounded-xl">
                    <div className="font-mono text-lg font-semibold text-obsidian-800">{property.enquiries}</div>
                    <div className="text-xs text-obsidian-400">Enquiries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Tour Modal */}
      {tourOpen && (
        <div className="fixed inset-0 z-[400] bg-black flex items-center justify-center">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button onClick={() => setTourAngle(a => a - 30)} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setTourOpen(false)} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-full tour-container overflow-hidden" onMouseMove={e => { if (e.buttons === 1) setTourAngle(a => a + e.movementX * 0.3) }}>
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative`}
              style={{transform: `perspective(1000px) rotateY(${tourAngle % 360}deg)`, transformStyle: 'preserve-3d', transition: 'none'}}>
              <div className="text-center text-white/40">
                <div className="text-[120px] opacity-20">{emoji}</div>
                <p className="text-lg font-light mt-4">360° Virtual Tour</p>
                <p className="text-sm mt-2 opacity-60">Drag to rotate · Pinch to zoom</p>
              </div>
              {/* Hotspot indicators */}
              {['Living Room', 'Master Bedroom', 'Kitchen', 'Garden'].map((r, i) => (
                <div key={r} className="absolute w-8 h-8 rounded-full bg-gold-500/80 border-2 border-white flex items-center justify-center cursor-pointer hover:scale-125 transition-transform animate-pulse"
                  style={{top: `${30 + i*15}%`, left: `${20 + i*15}%`}}>
                  <span className="text-obsidian-900 font-bold text-xs">{i+1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {['Living Room', 'Master Bed', 'Kitchen', 'Garden'].map((r, i) => (
              <button key={r} className="px-3 py-2 rounded-full bg-white/10 text-white text-xs hover:bg-gold-500/80 transition-all border border-white/20">{r}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg">
      <div className="text-center">
        <div className="text-6xl mb-4">🏚</div>
        <h1 className="font-display text-3xl font-medium text-obsidian-900 mb-2">Property Not Found</h1>
        <p className="text-obsidian-400 mb-6">This listing may have been removed or the URL is incorrect.</p>
        <Link href="/search" className="btn-primary">Browse All Properties</Link>
      </div>
    </div>
  )
}
