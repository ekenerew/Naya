'use client'
import Link from 'next/link'
import {
  TrendingUp, Eye, MessageCircle, Home, Plus, Settings,
  Bell, Star, MapPin, Clock, ArrowRight, CheckCircle2,
  BarChart3, Users, Zap, Shield, AlertCircle, Calendar,
  ChevronRight, DollarSign, Award, Phone
} from 'lucide-react'

// Mock data for demo purposes
const mockAgent = {
  name: 'Samuel Okeke', agency: 'Okeke Premium Properties',
  plan: 'Pro', badge: 'Platinum', rsspc: 'RS-2024-1847',
  initials: 'SO', rating: 4.9, reviews: 84,
}

const kpis = [
  { label: 'Total Views',     value: '14,328', change: '+12%', trend: 'up', icon: Eye,         color: 'text-blue-600',   bg: 'bg-blue-50' },
  { label: 'Enquiries',       value: '487',    change: '+8%',  trend: 'up', icon: MessageCircle, color: 'text-gold-600',  bg: 'bg-gold-50' },
  { label: 'Active Listings', value: '12',     change: '+3',   trend: 'up', icon: Home,         color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Avg. Response',   value: '1.4 hrs', change: '-22%', trend: 'up', icon: Clock,        color: 'text-purple-600', bg: 'bg-purple-50' },
]

const listings = [
  { id: 1, title: '3-Bed Luxury Flat, GRA Phase 2', price: '₦6.5M/yr', views: 3241, enquiries: 87, status: 'active', featured: true, daysLive: 12 },
  { id: 2, title: '4-Bed Duplex, Woji', price: '₦5.5M/yr', views: 1876, enquiries: 54, status: 'active', featured: false, daysLive: 28 },
  { id: 3, title: '2-Bed Flat, Trans Amadi', price: '₦1.8M/yr', views: 987, enquiries: 21, status: 'active', featured: false, daysLive: 45 },
  { id: 4, title: '5-Bed Mansion, GRA Phase 2', price: '₦18M/yr', views: 4521, enquiries: 134, status: 'under_offer', featured: true, daysLive: 7 },
  { id: 5, title: 'Commercial Space, Trans Amadi', price: '₦12M/yr', views: 654, enquiries: 14, status: 'active', featured: false, daysLive: 61 },
]

const enquiries = [
  { name: 'Emeka Obi', type: 'Rent', property: '3-Bed Luxury Flat, GRA', time: '2 hrs ago', status: 'new' },
  { name: 'Sarah Johnson', type: 'Rent', property: '4-Bed Duplex, Woji', time: '5 hrs ago', status: 'responded' },
  { name: 'Dr. Chidi Nwosu', type: 'Buy', property: '5-Bed Mansion, GRA', time: '1 day ago', status: 'new' },
  { name: 'Amaka Eze', type: 'Rent', property: '2-Bed Flat, Trans Amadi', time: '2 days ago', status: 'responded' },
]

const chartData = [45, 62, 58, 71, 83, 76, 95, 89, 104, 118, 127, 134]
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

export default function DashboardPage() {
  const maxEnq = Math.max(...chartData)

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* TOP NAV */}
      <header className="bg-obsidian-900 border-b border-white/10 sticky top-0 z-40">
        <div className="page-container py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display text-xl font-light text-white">NAYA</Link>
            <div className="hidden md:flex items-center gap-1 text-xs text-white/40">
              <ChevronRight className="w-3 h-3" />
              <span>Agent Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors">
              <Bell className="w-4 h-4 text-white/60" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <Link href="/portal" className="btn-primary btn-sm gap-2">
              <Plus className="w-4 h-4" />Add Listing
            </Link>
            <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center text-sm font-bold text-obsidian-900 cursor-pointer">
              {mockAgent.initials}
            </div>
          </div>
        </div>
      </header>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Agent card */}
              <div className="card p-5 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center text-xl font-bold text-obsidian-900 mx-auto mb-3">
                  {mockAgent.initials}
                </div>
                <div className="font-display text-base font-medium text-obsidian-900">{mockAgent.name}</div>
                <div className="text-xs text-obsidian-400 mb-2">{mockAgent.agency}</div>
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  <span className="font-mono text-sm font-bold text-obsidian-900">{mockAgent.rating}</span>
                  <span className="text-xs text-obsidian-400">({mockAgent.reviews})</span>
                </div>
                <div className="flex justify-center gap-2 mb-4">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-200">💎 {mockAgent.badge}</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{mockAgent.plan}</span>
                </div>
                <div className="text-[10px] text-obsidian-400 font-mono">RSSPC: {mockAgent.rsspc}</div>
              </div>

              {/* Nav */}
              <div className="card p-3 space-y-1">
                {[
                  { icon: BarChart3, label: 'Overview', active: true, href: '/portal/dashboard' },
                  { icon: Home,       label: 'My Listings', active: false, href: '#' },
                  { icon: MessageCircle, label: 'Enquiries', active: false, href: '#', badge: '3' },
                  { icon: Users,     label: 'Clients', active: false, href: '#' },
                  { icon: TrendingUp, label: 'Analytics', active: false, href: '/market-trends' },
                  { icon: Shield,    label: 'Verification', active: false, href: '/portal/profile' },
                  { icon: Award,     label: 'Plans & Billing', active: false, href: '/portal/billing' },
                  { icon: Settings,  label: 'Settings', active: false, href: '#' },
                ].map((item, i) => (
                  <Link key={i} href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${item.active ? 'bg-obsidian-900 text-white' : 'text-obsidian-600 hover:bg-surface-subtle'}`}>
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {item.label}
                    </div>
                    {item.badge && <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
                  </Link>
                ))}
              </div>

              {/* Upgrade prompt */}
              <div className="card p-4 bg-gold-50 border-gold-200">
                <div className="text-xs font-semibold text-obsidian-900 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-gold-600" />Upgrade to Premium
                </div>
                <p className="text-xs text-obsidian-500 mb-3">Unlock unlimited listings, dedicated manager, and homepage featured spot.</p>
                <Link href="/portal/billing" className="btn-primary btn-sm w-full justify-center">Upgrade Now</Link>
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className="lg:col-span-4 space-y-5">

            {/* Welcome bar */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-medium text-obsidian-900">Good morning, {mockAgent.name.split(' ')[0]} 👋</h1>
                <p className="text-sm text-obsidian-400 mt-0.5">Here's how your listings are performing today — March 14, 2026</p>
              </div>
              <Link href="#" className="btn-primary gap-2 hidden sm:flex">
                <Plus className="w-4 h-4" />Add New Listing
              </Link>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                      <kpi.icon className={`w-4.5 h-4.5 ${kpi.color}`} />
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{kpi.change}</span>
                  </div>
                  <div className="font-display text-2xl font-medium text-obsidian-900">{kpi.value}</div>
                  <div className="text-xs text-obsidian-400 mt-0.5">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Chart + Enquiries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Enquiries chart */}
              <div className="md:col-span-2 card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-display text-lg font-medium text-obsidian-900">Enquiries Trend</h3>
                    <p className="text-xs text-obsidian-400">Apr 2025 – Mar 2026</p>
                  </div>
                  <div className="font-display text-2xl font-medium text-gold-600">487 <span className="text-sm text-obsidian-400 font-sans">this month</span></div>
                </div>
                <div className="flex items-end gap-1.5 h-32">
                  {chartData.map((val, i) => {
                    const h = (val / maxEnq) * 100
                    const isLast = i === chartData.length - 1
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-lg transition-all"
                          style={{ height: `${h}%`, backgroundColor: isLast ? '#C8A84B' : '#E8D39A' }} />
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-1.5 mt-1">
                  {months.map(m => <div key={m} className="flex-1 text-center font-mono text-[9px] text-obsidian-400">{m}</div>)}
                </div>
              </div>

              {/* Quick stats */}
              <div className="card p-5">
                <h3 className="font-display text-base font-medium text-obsidian-900 mb-4">Performance</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Avg. Enquiries/Listing', value: '40', max: 60, color: 'bg-gold-500' },
                    { label: 'Response Rate', value: '94%', max: 100, color: 'bg-emerald-500' },
                    { label: 'Listing Quality Score', value: '8.7/10', max: 100, color: 'bg-blue-500' },
                    { label: 'Profile Completeness', value: '82%', max: 100, color: 'bg-purple-500' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-obsidian-500">{s.label}</span>
                        <span className="font-mono font-bold text-obsidian-900">{s.value}</span>
                      </div>
                      <div className="h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${parseInt(s.value) || 82}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* My Listings */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-surface-border">
                <h3 className="font-display text-lg font-medium text-obsidian-900">Active Listings</h3>
                <Link href="#" className="text-xs text-gold-600 hover:text-gold-500 font-medium flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-surface-border">
                {listings.map((l, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-surface-subtle/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-obsidian-900 to-zinc-900 flex items-center justify-center text-lg flex-shrink-0">🏠</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-obsidian-900 text-sm truncate">{l.title}</span>
                        {l.featured && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold-50 text-gold-600 border border-gold-200 flex-shrink-0">Featured</span>}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${l.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {l.status === 'under_offer' ? 'Under Offer' : 'Active'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-obsidian-400">
                        <span className="font-mono font-medium text-gold-600">{l.price}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{l.enquiries}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{l.daysLive}d live</span>
                      </div>
                    </div>
                    <button className="text-xs text-gold-600 hover:text-gold-500 font-medium flex-shrink-0 hidden sm:block">Edit</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Enquiries */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-surface-border">
                <h3 className="font-display text-lg font-medium text-obsidian-900">Recent Enquiries</h3>
                <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">3 new</span>
              </div>
              <div className="divide-y divide-surface-border">
                {enquiries.map((e, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-surface-subtle/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${e.status === 'new' ? 'bg-rose-500' : 'bg-obsidian-200'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-obsidian-900 text-sm">{e.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${e.type === 'Buy' ? 'bg-blue-50 text-blue-600' : 'bg-gold-50 text-gold-600'}`}>{e.type}</span>
                        {e.status === 'new' && <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full">New</span>}
                      </div>
                      <p className="text-xs text-obsidian-500 truncate">{e.property} · {e.time}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a href="tel:+2348168117004" className="w-8 h-8 rounded-xl border border-surface-border flex items-center justify-center hover:border-gold-300 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-obsidian-500" />
                      </a>
                      <a href="https://wa.me/2348168117004" target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5 text-white" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action items */}
            <div className="card p-5">
              <h3 className="font-display text-base font-medium text-obsidian-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />Action Items
              </h3>
              <div className="space-y-2">
                {[
                  { text: 'Add photos to "Commercial Space, Trans Amadi" — listings with 5+ photos get 3x more views', href: '#', level: 'warning' },
                  { text: 'Renew your RSSPC licence — expires in 45 days', href: '/portal/profile', level: 'warning' },
                  { text: 'Respond to 3 unanswered enquiries from this week', href: '#', level: 'alert' },
                ].map((item, i) => (
                  <Link key={i} href={item.href}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all hover:border-gold-300 ${item.level === 'alert' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                    <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${item.level === 'alert' ? 'text-rose-500' : 'text-amber-500'}`} />
                    <p className="text-xs text-obsidian-700 leading-relaxed flex-1">{item.text}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-obsidian-400 flex-shrink-0 mt-0.5" />
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
