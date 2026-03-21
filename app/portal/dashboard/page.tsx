'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, Eye, MessageCircle, Home, Plus, Bell,
  Star, MapPin, Clock, ArrowRight, CheckCircle2, BarChart3,
  Shield, AlertCircle, ChevronRight, Award, Phone, Mail,
  LogOut, Settings, Loader2, Building2, RefreshCw, X,
  FileText, Users, Zap, Lock
} from 'lucide-react'

type DashboardData = {
  user: { id:string; firstName:string; lastName:string; email:string; phone?:string; avatarUrl?:string; accountType:string }
  agent: { id:string; agencyName?:string; plan:string; badge:string; rsspcNumber?:string; rsspcStatus:string; avgRating:number; reviewCount:number }
  stats: { totalListings:number; activeListings:number; pendingListings:number; totalEnquiries:number; newEnquiries:number; totalViews:number }
  listings: any[]
  enquiries: any[]
}

const planLimits: Record<string,number> = { STARTER: 3, PRO: 25, PREMIUM: 999 }
const badgeColors: Record<string,string> = {
  PLATINUM:  'bg-gold-100 text-gold-700 border-gold-200',
  TOP_AGENT: 'bg-blue-100 text-blue-700 border-blue-200',
  VERIFIED:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  NONE:      'bg-obsidian-100 text-obsidian-600 border-obsidian-200',
}
const statusColors: Record<string,string> = {
  ACTIVE:         'bg-emerald-100 text-emerald-700',
  PENDING_REVIEW: 'bg-amber-100 text-amber-700',
  DRAFT:          'bg-obsidian-100 text-obsidian-600',
  UNPUBLISHED:    'bg-rose-100 text-rose-600',
  RENTED:         'bg-blue-100 text-blue-700',
  SOLD:           'bg-purple-100 text-purple-700',
}

function formatPrice(price: any): string {
  const n = typeof price === 'bigint' ? Number(price) : Number(price)
  if (n >= 1_000_000) return `₦${(n/1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `₦${(n/1_000).toFixed(0)}K`
  return `₦${n}`
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs/24)}d ago`
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [tab, setTab]         = useState<'overview'|'listings'|'enquiries'>('overview')

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/portal/dashboard')
      if (res.status === 401) { router.push('/login'); return }
      if (res.status === 403) { router.push('/'); return }
      const json = await res.json()
      if (!json.success) { setError(json.error); return }
      setData(json.data)
    } catch {
      setError('Failed to load dashboard. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDashboard() }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-gold-500 mx-auto mb-4" />
        <p className="text-obsidian-500">Loading your dashboard...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="card p-8 max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-2">Dashboard Error</h2>
        <p className="text-obsidian-500 text-sm mb-6">{error}</p>
        <button onClick={fetchDashboard} className="btn-primary w-full justify-center">
          <RefreshCw className="w-4 h-4" />Try Again
        </button>
      </div>
    </div>
  )

  if (!data) return null

  const { user, agent, stats, listings, enquiries } = data
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const isNewAgent = stats.totalListings === 0
  const maxListings = planLimits[agent.plan] || 3
  const listingUsage = Math.min((stats.activeListings / maxListings) * 100, 100)
  const isLandlord = user.accountType === 'LANDLORD'

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* HEADER */}
      <header className="bg-obsidian-900 border-b border-white/10 sticky top-0 z-40">
        <div className="page-container py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display text-xl font-light text-white">NAYA</Link>
            <span className="hidden md:flex items-center gap-1 text-xs text-white/40">
              <ChevronRight className="w-3 h-3" />
              {isLandlord ? 'Landlord' : 'Agent'} Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* New enquiries badge */}
            {stats.newEnquiries > 0 && (
              <button onClick={() => setTab('enquiries')} className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium">
                <Bell className="w-3.5 h-3.5" />
                {stats.newEnquiries} new
              </button>
            )}
            <Link href="/portal/list" className="btn-primary btn-sm gap-1.5">
              <Plus className="w-4 h-4" />List Property
            </Link>
            {/* User pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/10">
              {user.avatarUrl
                ? <img src={user.avatarUrl} className="w-7 h-7 rounded-full object-cover" />
                : <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-obsidian-900 text-xs font-bold">{initials}</div>
              }
              <span className="hidden md:block text-sm text-white font-medium">{user.firstName}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center justify-center w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="page-container py-6">

        {/* WELCOME BANNER FOR NEW AGENTS */}
        {isNewAgent && (
          <div className="bg-obsidian-900 rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-medium mb-4">
                    <Zap className="w-3 h-3" />Welcome to Naya
                  </div>
                  <h1 className="font-display text-3xl font-light text-white mb-2">
                    Welcome, {user.firstName}! 👋
                  </h1>
                  <p className="text-white/50 text-sm mb-6 max-w-lg">
                    Your {isLandlord ? 'landlord' : 'agent'} account is ready. Start by listing your first property — it only takes 5 minutes and goes live within 24 hours.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/portal/list" className="btn-primary gap-2">
                      <Plus className="w-4 h-4" />List Your First Property
                    </Link>
                    {!agent.rsspcNumber && !isLandlord && (
                      <Link href="/portal/profile" className="btn-ghost text-white/70 border-white/20 gap-2">
                        <Shield className="w-4 h-4" />Get RSSPC Verified
                      </Link>
                    )}
                  </div>
                </div>
                <div className="hidden md:block text-6xl">🏠</div>
              </div>

              {/* Setup checklist */}
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { done: true,  icon: CheckCircle2, label: 'Account Created',     action: null },
                  { done: !!agent.agencyName, icon: Building2, label: 'Agency Name Added', action: '/portal/profile' },
                  { done: !!agent.rsspcNumber || isLandlord, icon: Shield, label: isLandlord ? 'Profile Complete' : 'RSSPC Verified', action: '/portal/profile' },
                ].map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${step.done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                    <step.icon className={`w-5 h-5 flex-shrink-0 ${step.done ? 'text-emerald-400' : 'text-white/30'}`} />
                    <span className={`text-sm ${step.done ? 'text-emerald-300' : 'text-white/50'}`}>{step.label}</span>
                    {!step.done && step.action && (
                      <Link href={step.action} className="ml-auto text-xs text-gold-400 hover:text-gold-300 whitespace-nowrap">Do it →</Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RETURNING AGENT HEADER */}
        {!isNewAgent && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-medium text-obsidian-900">
                Good day, {user.firstName}
              </h1>
              <p className="text-obsidian-500 text-sm mt-0.5">
                {agent.agencyName || 'Your Dashboard'} · {stats.newEnquiries > 0 ? <span className="text-rose-500 font-medium">{stats.newEnquiries} new enquiries</span> : 'All caught up'}
              </p>
            </div>
            <button onClick={fetchDashboard} className="flex items-center gap-2 text-sm text-obsidian-400 hover:text-obsidian-700 transition-colors">
              <RefreshCw className="w-4 h-4" />Refresh
            </button>
          </div>
        )}

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Views',     value: stats.totalViews.toLocaleString(), icon: Eye,           color: 'text-blue-600',    bg: 'bg-blue-50' },
            { label: 'Enquiries',       value: stats.totalEnquiries.toString(),    icon: MessageCircle, color: 'text-gold-600',    bg: 'bg-gold-50' },
            { label: 'Active Listings', value: stats.activeListings.toString(),    icon: Home,          color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending Review',  value: stats.pendingListings.toString(),   icon: Clock,         color: 'text-purple-600',  bg: 'bg-purple-50' },
          ].map((kpi, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-4.5 h-4.5 ${kpi.color}`} />
                </div>
              </div>
              <div className="font-display text-2xl font-medium text-obsidian-900">{kpi.value}</div>
              <div className="text-xs text-obsidian-400 mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* TABS */}
            <div className="flex items-center gap-1 p-1 bg-surface-subtle rounded-2xl w-fit">
              {(['overview','listings','enquiries'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white text-obsidian-900 shadow-sm' : 'text-obsidian-500 hover:text-obsidian-700'}`}>
                  {t}
                  {t === 'enquiries' && stats.newEnquiries > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full">{stats.newEnquiries}</span>
                  )}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {tab === 'overview' && (
              <div className="space-y-4">
                {isNewAgent ? (
                  <div className="card p-8 text-center border-2 border-dashed border-surface-border">
                    <div className="w-16 h-16 rounded-2xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-gold-600" />
                    </div>
                    <h3 className="font-display text-xl font-medium text-obsidian-900 mb-2">List Your First Property</h3>
                    <p className="text-obsidian-400 text-sm mb-6 max-w-sm mx-auto">
                      Properties on Naya get seen by thousands of buyers and renters in Port Harcourt every month.
                    </p>
                    <Link href="/portal/list" className="btn-primary gap-2 inline-flex">
                      <Plus className="w-4 h-4" />Start Listing Now
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="card p-5">
                      <h3 className="font-semibold text-obsidian-900 mb-4">Recent Listings</h3>
                      <div className="space-y-3">
                        {listings.slice(0, 3).map((l: any) => (
                          <div key={l.id} className="flex items-center gap-3 p-3 bg-surface-subtle rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-obsidian-100 flex items-center justify-center flex-shrink-0">
                              <Home className="w-5 h-5 text-obsidian-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-obsidian-900 truncate">{l.title}</p>
                              <p className="text-xs text-obsidian-400">{l.neighborhood} · {formatPrice(l.price)}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[l.status] || 'bg-obsidian-100 text-obsidian-600'}`}>
                              {l.status?.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Link href="#" onClick={() => setTab('listings')} className="flex items-center gap-1 text-sm text-gold-600 hover:text-gold-500 mt-4 font-medium">
                        View all listings <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="card p-5">
                      <h3 className="font-semibold text-obsidian-900 mb-4">Recent Enquiries</h3>
                      <div className="space-y-3">
                        {enquiries.slice(0, 3).map((e: any) => (
                          <div key={e.id} className="flex items-start gap-3 p-3 bg-surface-subtle rounded-xl">
                            <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gold-700">
                              {e.fromUser ? `${e.fromUser.firstName[0]}${e.fromUser.lastName[0]}` : e.guestName?.[0] || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-obsidian-900">
                                {e.fromUser ? `${e.fromUser.firstName} ${e.fromUser.lastName}` : e.guestName || 'Guest'}
                              </p>
                              <p className="text-xs text-obsidian-400 truncate">{e.listing?.title}</p>
                              <p className="text-xs text-obsidian-300">{timeAgo(e.createdAt)}</p>
                            </div>
                            {e.status === 'NEW' && <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />}
                          </div>
                        ))}
                      </div>
                      <Link href="#" onClick={() => setTab('enquiries')} className="flex items-center gap-1 text-sm text-gold-600 hover:text-gold-500 mt-4 font-medium">
                        View all enquiries <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* LISTINGS TAB */}
            {tab === 'listings' && (
              <div className="card overflow-hidden">
                <div className="p-5 border-b border-surface-border flex items-center justify-between">
                  <h3 className="font-semibold text-obsidian-900">My Listings ({stats.totalListings})</h3>
                  <Link href="/portal/list" className="btn-primary btn-sm gap-1">
                    <Plus className="w-3.5 h-3.5" />New Listing
                  </Link>
                </div>
                {listings.length === 0 ? (
                  <div className="p-12 text-center">
                    <Home className="w-12 h-12 text-obsidian-200 mx-auto mb-3" />
                    <p className="text-obsidian-500 text-sm mb-4">No listings yet</p>
                    <Link href="/portal/list" className="btn-primary gap-2 inline-flex">
                      <Plus className="w-4 h-4" />List Your First Property
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-border">
                    {listings.map((l: any) => (
                      <div key={l.id} className="p-4 flex items-center gap-4 hover:bg-surface-subtle transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-obsidian-100 flex items-center justify-center flex-shrink-0">
                          <Home className="w-6 h-6 text-obsidian-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-obsidian-900 text-sm truncate">{l.title}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-obsidian-400">{l.neighborhood}</span>
                            <span className="text-xs font-semibold text-obsidian-700">{formatPrice(l.price)}</span>
                            <span className="text-xs text-obsidian-400 flex items-center gap-1">
                              <Eye className="w-3 h-3" />{l.views}
                            </span>
                            <span className="text-xs text-obsidian-400 flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />{l.enquiryCount}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${statusColors[l.status] || 'bg-obsidian-100 text-obsidian-600'}`}>
                          {l.status?.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ENQUIRIES TAB */}
            {tab === 'enquiries' && (
              <div className="card overflow-hidden">
                <div className="p-5 border-b border-surface-border">
                  <h3 className="font-semibold text-obsidian-900">Enquiries ({stats.totalEnquiries})</h3>
                </div>
                {enquiries.length === 0 ? (
                  <div className="p-12 text-center">
                    <MessageCircle className="w-12 h-12 text-obsidian-200 mx-auto mb-3" />
                    <p className="text-obsidian-500 text-sm">No enquiries yet. List a property to start receiving them.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-border">
                    {enquiries.map((e: any) => (
                      <div key={e.id} className={`p-4 ${e.status === 'NEW' ? 'bg-gold-50/50' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold-700">
                            {e.fromUser ? `${e.fromUser.firstName[0]}${e.fromUser.lastName[0]}` : '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-obsidian-900 text-sm">
                                {e.fromUser ? `${e.fromUser.firstName} ${e.fromUser.lastName}` : e.guestName || 'Guest Enquiry'}
                              </p>
                              {e.status === 'NEW' && (
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">NEW</span>
                              )}
                              <span className="text-xs text-obsidian-400 ml-auto">{timeAgo(e.createdAt)}</span>
                            </div>
                            <p className="text-xs text-gold-600 font-medium mb-1">{e.listing?.title}</p>
                            <p className="text-sm text-obsidian-600 bg-surface-subtle rounded-lg p-2">{e.message}</p>
                            {/* Contact info */}
                            <div className="flex items-center gap-4 mt-2">
                              {(e.fromUser?.phone || e.guestPhone) && (
                                <a href={`tel:${e.fromUser?.phone || e.guestPhone}`}
                                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-500 font-medium">
                                  <Phone className="w-3.5 h-3.5" />
                                  {e.fromUser?.phone || e.guestPhone}
                                </a>
                              )}
                              {(e.fromUser?.email || e.guestEmail) && (
                                <a href={`mailto:${e.fromUser?.email || e.guestEmail}`}
                                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500 font-medium">
                                  <Mail className="w-3.5 h-3.5" />Reply by Email
                                </a>
                              )}
                              <a href={`https://wa.me/${(e.fromUser?.phone || e.guestPhone || '').replace(/\D/g,'')}`}
                                target="_blank" className="flex items-center gap-1 text-xs text-emerald-600 font-medium ml-auto">
                                💬 WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">

            {/* Profile card */}
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                {user.avatarUrl
                  ? <img src={user.avatarUrl} className="w-14 h-14 rounded-2xl object-cover" />
                  : <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center text-obsidian-900 text-xl font-bold">{initials}</div>
                }
                <div>
                  <p className="font-semibold text-obsidian-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-obsidian-400">{agent.agencyName || (isLandlord ? 'Property Owner' : 'Independent Agent')}</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${badgeColors[agent.badge] || badgeColors.NONE}`}>
                    <Award className="w-2.5 h-2.5" />
                    {agent.badge === 'NONE' ? agent.plan : agent.badge.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-obsidian-600">
                  <Mail className="w-4 h-4 text-obsidian-400" />{user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-obsidian-600">
                    <Phone className="w-4 h-4 text-obsidian-400" />{user.phone}
                  </div>
                )}
              </div>

              {/* RSSPC status */}
              {!isLandlord && (
                <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${agent.rsspcStatus === 'VERIFIED' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                  <Shield className={`w-4 h-4 flex-shrink-0 ${agent.rsspcStatus === 'VERIFIED' ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <div>
                    <p className={`text-xs font-semibold ${agent.rsspcStatus === 'VERIFIED' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      RSSPC {agent.rsspcStatus === 'VERIFIED' ? 'Verified' : 'Not Verified'}
                    </p>
                    {agent.rsspcStatus !== 'VERIFIED' && (
                      <Link href="/portal/profile" className="text-xs text-amber-600 hover:underline">Get verified →</Link>
                    )}
                  </div>
                </div>
              )}

              <Link href="/portal/profile" className="btn-secondary w-full justify-center mt-4 gap-2 text-sm">
                <Settings className="w-4 h-4" />Edit Profile
              </Link>
            </div>

            {/* Plan card */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-obsidian-900 text-sm">Plan: {agent.plan}</h3>
                <Link href="/portal/billing" className="text-xs text-gold-600 hover:text-gold-500 font-medium">Upgrade →</Link>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-obsidian-500 mb-1">
                  <span>Listings used</span>
                  <span>{stats.activeListings} / {maxListings === 999 ? '∞' : maxListings}</span>
                </div>
                <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${listingUsage >= 90 ? 'bg-rose-500' : listingUsage >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${maxListings === 999 ? 5 : listingUsage}%` }} />
                </div>
              </div>
              {agent.plan === 'STARTER' && (
                <p className="text-xs text-obsidian-400">
                  Upgrade to <strong>Pro (₦25K/mo)</strong> for 25 listings and priority placement.
                </p>
              )}
            </div>

            {/* Quick actions */}
            <div className="card p-5">
              <h3 className="font-semibold text-obsidian-900 text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'List a Property',      href: '/portal/list',    icon: Plus },
                  { label: 'RSSPC Verification',   href: '/portal/profile', icon: Shield, hide: isLandlord },
                  { label: 'Upgrade Plan',         href: '/portal/billing', icon: Zap },
                  { label: 'View Public Profile',  href: `/agents/${agent.id}`, icon: Users },
                  { label: 'Browse Properties',    href: '/search',         icon: Home },
                ].filter(a => !a.hide).map((action, i) => (
                  <Link key={i} href={action.href}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-subtle transition-colors text-sm text-obsidian-700">
                    <action.icon className="w-4 h-4 text-obsidian-400" />
                    {action.label}
                    <ChevronRight className="w-4 h-4 text-obsidian-300 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
