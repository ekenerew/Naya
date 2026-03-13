'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, ShieldCheck, Phone, MessageCircle, Mail, Calendar, Award, CheckCircle2, ArrowLeft } from 'lucide-react'
import { agents, properties, formatPrice } from '@/lib/data'
import PropertyCard from '@/components/property/PropertyCard'
import clsx from 'clsx'

const avatarColors = ['from-gold-500 to-gold-300', 'from-emerald-500 to-teal-400', 'from-violet-500 to-purple-400', 'from-rose-500 to-pink-400', 'from-blue-500 to-cyan-400', 'from-amber-500 to-yellow-400']

const mockReviews = [
  { name: 'Chukwuemeka A.', rating: 5, date: 'Feb 2026', text: 'Samuel was incredible — found us our dream duplex in GRA Phase 2 within 2 weeks. Very professional and honest.' },
  { name: 'Jennifer O.', rating: 5, date: 'Jan 2026', text: 'Best agent experience I\'ve had in PH. Clear communication, RSSPC verified, and got us a great deal on our shortlet.' },
  { name: 'David M.', rating: 4, date: 'Dec 2025', text: 'Very knowledgeable about the GRA area. Helped us negotiate a good price on the apartment. Highly recommend.' },
]

export default function AgentProfilePage() {
  const params = useParams()
  const username = params.username as string
  const agent = agents.find(a => a.username === username)

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="font-display text-3xl font-medium text-obsidian-900 mb-4">Agent Not Found</h1>
          <Link href="/agents" className="btn-primary">Back to Agents</Link>
        </div>
      </div>
    )
  }

  const colorIdx = agent.id.charCodeAt(1) % avatarColors.length
  const agentProps = properties.filter(p => p.agentId === agent.id)

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Back */}
      <div className="bg-white border-b border-surface-border">
        <div className="page-container py-3">
          <Link href="/agents" className="flex items-center gap-2 text-sm text-obsidian-400 hover:text-obsidian-700 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />Back to Agents
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${avatarColors[colorIdx]} flex items-center justify-center font-display text-4xl font-medium text-obsidian-900 flex-shrink-0 shadow-gold`}>
              {agent.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="font-display text-3xl text-white font-medium">{agent.name}</h1>
                {agent.isVerified && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                {agent.badge !== 'none' && (
                  <span className={clsx('badge', agent.badge==='platinum'?'badge-gold':'badge-verify')}>
                    {agent.badge==='platinum'?'💎 Platinum':agent.badge==='top_agent'?'🏆 Top Agent':'✓ Verified'}
                  </span>
                )}
              </div>
              <p className="text-white/50 mb-3">{agent.agencyName}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({length:5}).map((_,i) => <Star key={i} className={clsx('w-4 h-4', i<Math.floor(agent.rating)?'fill-gold-400 text-gold-400':'text-white/20')}/>)}
                  <span className="text-white/60 text-sm ml-1">{agent.rating} ({agent.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <MapPin className="w-4 h-4 text-gold-400" />{agent.neighborhoods.join(' · ')}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <a href={`tel:${agent.phone}`} className="btn-dark whitespace-nowrap justify-center"><Phone className="w-4 h-4"/>Call {agent.name.split(' ')[0]}</a>
              <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn-primary whitespace-nowrap justify-center"><MessageCircle className="w-4 h-4"/>WhatsApp</a>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-medium text-obsidian-900 mb-3">About {agent.name.split(' ')[0]}</h2>
              <p className="text-obsidian-600 leading-relaxed text-sm">{agent.bio}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {[{v:agent.totalListings,l:'Active Listings'},{v:agent.totalSales,l:'Properties Sold'},{v:agent.totalRentals,l:'Rentals Done'},{v:agent.yearsActive+' yrs',l:'Experience'}].map(s => (
                  <div key={s.l} className="text-center p-3 bg-surface-subtle rounded-xl">
                    <div className="font-mono text-xl font-bold text-gold-600">{s.v}</div>
                    <div className="text-xs text-obsidian-400 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-medium text-obsidian-900 mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {agent.specializations.map(s => (
                  <span key={s} className="badge badge-gold">{s}</span>
                ))}
              </div>
            </div>

            {/* Listings */}
            <div>
              <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-5">{agent.name.split(' ')[0]}&apos;s Listings</h2>
              {agentProps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agentProps.map(p => <PropertyCard key={p.id} property={p} />)}
                </div>
              ) : (
                <div className="card p-10 text-center">
                  <div className="text-4xl mb-3">🏠</div>
                  <p className="text-obsidian-400">No active listings at this time</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-medium text-obsidian-900 mb-5">Client Reviews</h2>
              <div className="space-y-4">
                {mockReviews.map((r, i) => (
                  <div key={i} className="p-4 bg-surface-subtle rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-obsidian-900 font-semibold text-xs">{r.name[0]}</div>
                        <div>
                          <div className="font-semibold text-sm text-obsidian-800">{r.name}</div>
                          <div className="text-xs text-obsidian-400 font-mono">{r.date}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">{Array.from({length:5}).map((_,j) => <Star key={j} className={clsx('w-3.5 h-3.5', j<r.rating?'fill-gold-400 text-gold-400':'text-obsidian-200')}/>)}</div>
                    </div>
                    <p className="text-sm text-obsidian-600">&ldquo;{r.text}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact */}
            <div className="card p-5">
              <h3 className="font-display text-lg font-medium text-obsidian-900 mb-4">Contact {agent.name.split(' ')[0]}</h3>
              <div className="space-y-3">
                <a href={`tel:${agent.phone}`} className="flex items-center gap-3 p-3 bg-surface-subtle rounded-xl text-sm text-obsidian-700 hover:bg-gold-50 transition-colors">
                  <Phone className="w-4 h-4 text-gold-500" />{agent.phone}
                </a>
                <a href={`mailto:${agent.email}`} className="flex items-center gap-3 p-3 bg-surface-subtle rounded-xl text-sm text-obsidian-700 hover:bg-gold-50 transition-colors">
                  <Mail className="w-4 h-4 text-gold-500" />{agent.email}
                </a>
              </div>
              <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center mt-4">
                <MessageCircle className="w-4 h-4" />Send WhatsApp
              </a>
            </div>

            {/* Credentials */}
            <div className="card p-5">
              <h3 className="font-display text-lg font-medium text-obsidian-900 mb-4">Credentials</h3>
              <div className="space-y-3">
                {[
                  {l:'RSSPC License', v: agent.rsspcNumber, verified: true},
                  {l:'CAC Number', v: agent.cacNumber, verified: true},
                  {l:'Member since', v: new Date(agent.joinedDate).getFullYear().toString(), verified: false},
                ].map(c => (
                  <div key={c.l} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                    <div className="text-xs text-obsidian-400">{c.l}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-obsidian-700">{c.v}</span>
                      {c.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="card p-5">
              <h3 className="font-body text-sm font-semibold text-obsidian-700 mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {agent.languages.map(l => <span key={l} className="badge badge-gold">{l}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
