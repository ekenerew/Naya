'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import {
  TrendingUp, TrendingDown, Minus, Bot, Send, Loader2,
  BarChart3, MapPin, Home, Building2, ArrowRight,
  RefreshCw, Sparkles, MessageSquare, X, ChevronDown,
  Activity, DollarSign, Users, Eye
} from 'lucide-react'
import { marketStats, neighborhoods } from '@/lib/data'

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(1)}B`
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

function pct(a: number, b: number) {
  return (((a - b) / b) * 100).toFixed(1)
}

// ── Market context for AI ──────────────────────────────────────────────────────
const MARKET_CONTEXT = `
You are Naya AI — a specialist property market analyst for Port Harcourt, Rivers State, Nigeria, embedded in the Naya Real Estate platform.

CURRENT MARKET DATA (Q1 2026):
- Average rent (1-bed, PH): ₦2.65M/yr (up 26% YoY)
- Average sale price: ₦188M (up 30% YoY)
- Active listings: 2,847
- Monthly enquiries: 7,200
- Days on market (avg): 28 days

NEIGHBOURHOOD PRICE DATA:
- GRA Phase 2: 1-bed ₦1.8M/yr, avg buy ₦180M, trend +8.2%
- Woji: 1-bed ₦1.2M/yr, avg buy ₦120M, trend +18.7% (fastest growing)
- Old GRA: 1-bed ₦1.5M/yr, avg buy ₦150M, trend +2.1%
- Trans Amadi: 1-bed ₦900K/yr, avg buy ₦85M, trend +12.5%
- Rumuola: 1-bed ₦600K/yr, avg buy ₦55M, trend +15.3%
- Eleme: 1-bed ₦700K/yr, avg buy ₦65M, trend +3.4%
- Bonny Island: 1-bed ₦1.2M/yr, avg buy ₦95M, trend +22.4% (highest)
- Choba: 1-bed ₦380K/yr (most affordable, near UniPort)

MARKET DRIVERS:
- Oil & gas sector expansion (NLNG Train 7, SPDC activity)
- Diaspora returnee investment surge
- Shortage of Grade A residential supply in GRA
- Growing young professional class in Woji/Rumuola corridor
- Obio-Akpor LGA growth driving suburban expansion

PLATFORM DATA:
- Naya is a verified property marketplace for Port Harcourt
- All agents are RSSPC-certified
- All listings are manually reviewed before going live

INSTRUCTIONS:
- Answer questions about the Port Harcourt property market concisely and confidently
- Use specific data from above when relevant
- Give investment advice based on data (but always note you are not a licensed financial advisor)
- Recommend specific neighbourhoods when asked about where to live or invest
- Be direct and data-driven — no fluff
- Format key numbers in Naira (₦)
- Keep responses under 200 words unless a detailed analysis is explicitly requested
- If asked about properties outside Rivers State, note that Naya currently covers PH/Rivers State only
`

const SUGGESTED_QUESTIONS = [
  'Which neighbourhood has the best rental yield right now?',
  'Is it better to buy or rent in Port Harcourt in 2026?',
  'Where should I invest ₦50M in PH property?',
  'How has Woji performed compared to GRA in 2025?',
  'What are the best areas for expat housing in PH?',
  'Is the PH property market a good investment vs Lagos?',
  'What\'s driving property prices up in 2026?',
  'What\'s the typical rental yield in GRA Phase 2?',
]

// ── Mini chart bars ────────────────────────────────────────────────────────────
function MiniChart({ data, color, height = 48 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className={`flex-1 rounded-sm ${color} transition-all`}
          style={{ height: `${((v - min) / range) * 80 + 20}%`, opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.6 }} />
      ))}
    </div>
  )
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-surface-subtle rounded-2xl rounded-tl-sm w-fit">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full bg-obsidian-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, change, trend, sub, icon: Icon, color, bg }: any) {
  return (
    <div className="card p-5 hover:border-gold-200 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-obsidian-50 text-obsidian-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <div className="font-display text-2xl font-medium text-obsidian-900 mb-1">{value}</div>
      <div className="text-xs font-medium text-obsidian-600">{label}</div>
      <div className="text-[10px] text-obsidian-400 mt-0.5">{sub}</div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MarketTrendsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "I'm **Naya AI** — your Port Harcourt property market analyst. I have real-time data on rents, sale prices, neighbourhood trends, and investment intelligence across PH and Rivers State.\n\nAsk me anything about the market — where to buy, where to rent, which areas are growing, or what your budget can get you.",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [activeChart, setActiveChart] = useState<'rent' | 'sale' | 'listings' | 'enquiries'>('rent')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const latest = marketStats[marketStats.length - 1]
  const prev = marketStats[0]
  const prevMonth = marketStats[marketStats.length - 2]

  // Chart data
  const chartData = useMemo(() => ({
    rent: marketStats.map(m => m.avgRent),
    sale: marketStats.map(m => m.avgSale),
    listings: marketStats.map(m => m.listings),
    enquiries: marketStats.map(m => m.enquiries),
  }), [])

  const chartConfig = {
    rent:      { label: 'Avg. Rent (1-bed)', value: fmt(latest.avgRent), change: `+${pct(latest.avgRent, prev.avgRent)}%`, color: 'bg-gold-500' },
    sale:      { label: 'Avg. Sale Price',   value: fmt(latest.avgSale), change: `+${pct(latest.avgSale, prev.avgSale)}%`, color: 'bg-blue-500' },
    listings:  { label: 'Active Listings',   value: latest.listings.toLocaleString(), change: `+${pct(latest.listings, prev.listings)}%`, color: 'bg-emerald-500' },
    enquiries: { label: 'Monthly Enquiries', value: latest.enquiries.toLocaleString(), change: `+${pct(latest.enquiries, prev.enquiries)}%`, color: 'bg-purple-500' },
  }

  // Neighbourhood heatmap data
  const hoodData = neighborhoods.slice(0, 12).map(n => ({
    name: n.name, trend: n.trendPct, rent: n.avgRent1br, buy: n.avgBuyPrice,
    listings: n.propertyCount, emoji: n.emoji,
    yieldEst: Number(((n.avgRent1br / n.avgBuyPrice) * 100).toFixed(1))
  })).sort((a, b) => b.trend - a.trend)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: userText, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    if (!chatOpen) setChatOpen(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: MARKET_CONTEXT,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userText }
          ],
        })
      })
      const data = await response.json()
      const reply = data.content?.[0]?.text || 'I could not generate a response. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  const renderMessageContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />

        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
                <Activity className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Live Market Intelligence · Q1 2026</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-[0.92] tracking-tight mb-5">
                PH Property<br />
                <span className="gold-text">Market</span><br />
                <span className="text-white/40">at a Glance</span>
              </h1>
              <p className="text-white/40 text-lg font-light leading-relaxed mb-8 max-w-md">
                Real-time data, neighbourhood intelligence, and AI-powered analysis for Port Harcourt's property market.
              </p>
              <button onClick={() => { setChatOpen(true); setTimeout(() => inputRef.current?.focus(), 100) }}
                className="btn-primary btn-lg gap-3">
                <Bot className="w-5 h-5" />
                <span>Ask Naya AI</span>
                <Sparkles className="w-4 h-4 opacity-70" />
              </button>
            </div>

            {/* Live ticker */}
            <div className="space-y-3">
              {[
                { label: 'Avg. Sale Price', value: fmt(latest.avgSale), change: `+${pct(latest.avgSale, prevMonth.avgSale)}%`, color: 'text-gold-400' },
                { label: 'Avg. 1-Bed Rent', value: `${fmt(latest.avgRent)}/yr`, change: `+${pct(latest.avgRent, prevMonth.avgRent)}%`, color: 'text-emerald-400' },
                { label: 'Active Listings', value: latest.listings.toLocaleString(), change: `+${pct(latest.listings, prevMonth.listings)}%`, color: 'text-blue-400' },
                { label: 'Monthly Enquiries', value: latest.enquiries.toLocaleString(), change: `+${pct(latest.enquiries, prevMonth.enquiries)}%`, color: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                  <div>
                    <div className="text-xs text-white/30 mb-1 font-mono uppercase tracking-wider">{item.label}</div>
                    <div className={`font-display text-2xl font-light ${item.color}`}>{item.value}</div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-3 py-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-xs text-emerald-400 font-bold">{item.change} MoM</span>
                  </div>
                </div>
              ))}
              <div className="text-center text-xs text-white/20 font-mono pt-1">Last updated: March 2026 · Data from verified Naya listings</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* ── KPI GRID ─────────────────────────────────────────────────────── */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <KpiCard label="Avg. Rent (1-bed/yr)" value={fmt(latest.avgRent)} change={`+${pct(latest.avgRent, prev.avgRent)}%`} trend="up" sub="vs Apr 2025" icon={Home} color="text-gold-600" bg="bg-gold-50" />
            <KpiCard label="Avg. Sale Price" value={fmt(latest.avgSale)} change={`+${pct(latest.avgSale, prev.avgSale)}%`} trend="up" sub="vs Apr 2025" icon={DollarSign} color="text-blue-600" bg="bg-blue-50" />
            <KpiCard label="Active Listings" value={latest.listings.toLocaleString()} change={`+${pct(latest.listings, prev.listings)}%`} trend="up" sub="Mar 2026" icon={Building2} color="text-emerald-600" bg="bg-emerald-50" />
            <KpiCard label="Monthly Enquiries" value={latest.enquiries.toLocaleString()} change={`+${pct(latest.enquiries, prev.enquiries)}%`} trend="up" sub="Mar 2026" icon={Users} color="text-purple-600" bg="bg-purple-50" />
          </div>

          {/* ── CHART SECTION ──────────────────────────────────────────── */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900">12-Month Trend</h2>
                <p className="text-sm text-obsidian-400">Apr 2025 → Mar 2026 · Port Harcourt</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(chartConfig) as typeof activeChart[]).map(key => (
                  <button key={key} onClick={() => setActiveChart(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${activeChart === key ? `${chartConfig[key].color.replace('bg-', 'bg-')} text-white border-transparent` : 'bg-surface-subtle text-obsidian-500 border-surface-border hover:border-gold-300'}`}
                    style={activeChart === key ? { backgroundColor: key === 'rent' ? '#C8A84B' : key === 'sale' ? '#3b82f6' : key === 'listings' ? '#10b981' : '#a855f7' } : {}}>
                    {chartConfig[key].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart visualization */}
            <div className="relative">
              {/* Y-axis labels */}
              <div className="flex items-stretch gap-4">
                <div className="flex flex-col justify-between text-right w-16 flex-shrink-0 py-2">
                  {[100, 75, 50, 25, 0].map(pct => (
                    <span key={pct} className="font-mono text-[10px] text-obsidian-300">
                      {activeChart === 'rent' ? fmt(Math.round(prev.avgRent + (latest.avgRent - prev.avgRent) * (pct / 100))) :
                       activeChart === 'sale' ? fmt(Math.round(prev.avgSale + (latest.avgSale - prev.avgSale) * (pct / 100))) :
                       activeChart === 'listings' ? Math.round(prev.listings + (latest.listings - prev.listings) * (pct / 100)).toLocaleString() :
                       Math.round(prev.enquiries + (latest.enquiries - prev.enquiries) * (pct / 100)).toLocaleString()}
                    </span>
                  ))}
                </div>

                {/* Bars */}
                <div className="flex-1">
                  <div className="flex items-end gap-1.5 h-48 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[0,1,2,3,4].map(i => <div key={i} className="w-full border-t border-surface-border border-dashed" />)}
                    </div>
                    {chartData[activeChart].map((val, i) => {
                      const data = chartData[activeChart]
                      const min = Math.min(...data), max = Math.max(...data)
                      const heightPct = ((val - min) / (max - min)) * 75 + 20
                      const isLatest = i === data.length - 1
                      const barColor = activeChart === 'rent' ? (isLatest ? '#C8A84B' : '#E8D39A') :
                                       activeChart === 'sale' ? (isLatest ? '#3b82f6' : '#93c5fd') :
                                       activeChart === 'listings' ? (isLatest ? '#10b981' : '#6ee7b7') :
                                       (isLatest ? '#a855f7' : '#d8b4fe')
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                          {isLatest && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-obsidian-900 text-white text-[10px] px-2 py-1 rounded-lg font-mono whitespace-nowrap z-10">
                              {activeChart === 'rent' || activeChart === 'sale' ? fmt(val) : val.toLocaleString()}
                            </div>
                          )}
                          <div className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                            style={{ height: `${heightPct}%`, backgroundColor: barColor }} />
                        </div>
                      )
                    })}
                  </div>
                  {/* X-axis labels */}
                  <div className="flex gap-1.5 mt-2">
                    {marketStats.map((m, i) => (
                      <div key={i} className="flex-1 text-center font-mono text-[9px] text-obsidian-400 truncate">{m.month}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-5 pt-5 border-t border-surface-border flex flex-wrap gap-6">
                <div>
                  <div className="text-xs text-obsidian-400 mb-1">Apr 2025</div>
                  <div className="font-display text-lg font-medium text-obsidian-600">
                    {activeChart === 'rent' ? fmt(prev.avgRent) : activeChart === 'sale' ? fmt(prev.avgSale) : activeChart === 'listings' ? prev.listings.toLocaleString() : prev.enquiries.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center text-obsidian-200 text-2xl">→</div>
                <div>
                  <div className="text-xs text-obsidian-400 mb-1">Mar 2026</div>
                  <div className="font-display text-lg font-medium text-gold-600">
                    {activeChart === 'rent' ? fmt(latest.avgRent) : activeChart === 'sale' ? fmt(latest.avgSale) : activeChart === 'listings' ? latest.listings.toLocaleString() : latest.enquiries.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-obsidian-400 mb-1">12-Month Change</div>
                  <div className="font-display text-lg font-medium text-emerald-600">
                    +{pct(
                      activeChart === 'rent' ? latest.avgRent : activeChart === 'sale' ? latest.avgSale : activeChart === 'listings' ? latest.listings : latest.enquiries,
                      activeChart === 'rent' ? prev.avgRent : activeChart === 'sale' ? prev.avgSale : activeChart === 'listings' ? prev.listings : prev.enquiries
                    )}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── NEIGHBOURHOOD HEATMAP ──────────────────────────────────── */}
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-medium text-obsidian-900">Neighbourhood Heat Map</h2>
                <p className="text-sm text-obsidian-400">Price growth, rental yield, and demand — sorted by fastest growing</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-obsidian-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"/><span>High growth</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"/><span>Stable</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-obsidian-300"/><span>Low</span></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-obsidian-900">
                    <th className="text-left py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Neighbourhood</th>
                    <th className="text-right py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">1-Bed Rent/yr</th>
                    <th className="text-right py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Avg Buy</th>
                    <th className="text-right py-3 px-3 font-mono text-xs text-gold-600 uppercase tracking-wider">Est. Yield</th>
                    <th className="text-center py-3 px-3 font-mono text-xs text-obsidian-400 uppercase tracking-wider">Listings</th>
                    <th className="text-right py-3 px-3 font-mono text-xs text-emerald-600 uppercase tracking-wider">12M Growth</th>
                    <th className="py-3 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {hoodData.map((h, i) => {
                    const growthColor = h.trend >= 15 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : h.trend >= 8 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-obsidian-500 bg-obsidian-50 border-obsidian-200'
                    const yieldColor = h.yieldEst >= 5 ? 'text-emerald-600' : h.yieldEst >= 3 ? 'text-amber-600' : 'text-rose-500'
                    const barWidth = (h.trend / 25) * 100
                    return (
                      <tr key={h.name} className={`border-b border-surface-border hover:bg-gold-50/20 transition-colors ${i % 2 === 0 ? 'bg-surface-subtle/20' : 'bg-white'}`}>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{h.emoji}</span>
                            <div>
                              <div className="font-medium text-obsidian-900 text-sm">{h.name}</div>
                              {/* Mini trend bar */}
                              <div className="w-20 h-1 bg-surface-subtle rounded-full mt-1 overflow-hidden">
                                <div className={`h-full rounded-full ${h.trend >= 15 ? 'bg-emerald-500' : h.trend >= 8 ? 'bg-amber-500' : 'bg-obsidian-300'}`}
                                  style={{ width: `${barWidth}%` }} />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-xs text-obsidian-700">{fmt(h.rent)}</td>
                        <td className="py-3 px-3 text-right font-mono text-xs text-obsidian-600">{fmt(h.buy)}</td>
                        <td className={`py-3 px-3 text-right font-mono text-sm font-bold ${yieldColor}`}>{h.yieldEst}%</td>
                        <td className="py-3 px-3 text-center font-mono text-xs text-obsidian-600">{h.listings}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-mono font-bold ${growthColor}`}>
                            <TrendingUp className="w-3 h-3" />+{h.trend}%
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <a href={`/neighborhoods/${h.name.toLowerCase().replace(/ /g, '-')}`}
                            className="text-xs text-gold-600 hover:text-gold-500 font-medium whitespace-nowrap">
                            View →
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── INSIGHT CARDS ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              {
                title: 'Best Rental Yield', area: 'Rumuola', value: '~1.5%', detail: 'Gross yield based on avg rent vs buy price. Higher than GRA despite lower absolute price.',
                tip: 'Best for: First-time investors with ₦50–100M budget.', color: 'border-gold-500', icon: '📈'
              },
              {
                title: 'Fastest Capital Growth', area: 'Bonny Island', value: '+22.4%', detail: 'Highest 12-month price appreciation driven by NLNG Train 7 expansion and limited housing stock.',
                tip: 'Best for: Long-term buy-and-hold investors.', color: 'border-emerald-500', icon: '🚀'
              },
              {
                title: 'Strongest Corporate Demand', area: 'GRA Phase 2', value: '94% occ.', detail: 'Occupancy rate for new builds in GRA. Oil majors consistently take units within 30 days of completion.',
                tip: 'Best for: Developers targeting expat housing.', color: 'border-blue-500', icon: '🏛'
              },
            ].map((item, i) => (
              <div key={i} className={`card p-5 border-l-4 ${item.color}`}>
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="font-mono text-xs text-obsidian-400 uppercase tracking-wider mb-1">{item.title}</div>
                <div className="font-display text-xl font-medium text-obsidian-900 mb-1">{item.area}</div>
                <div className="font-display text-2xl font-medium text-gold-600 mb-3">{item.value}</div>
                <p className="text-xs text-obsidian-500 leading-relaxed mb-3">{item.detail}</p>
                <div className="text-xs text-gold-600 font-medium">{item.tip}</div>
              </div>
            ))}
          </div>

          {/* ── AI ANALYST SECTION ─────────────────────────────────────── */}
          <div className="card overflow-hidden border-gold-200">
            {/* AI Header */}
            <div className="bg-obsidian-900 relative overflow-hidden px-6 py-5">
              <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gold-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-obsidian-900" />
                  </div>
                  <div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      Naya AI Market Analyst
                      <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Online
                      </span>
                    </div>
                    <div className="text-white/40 text-xs">Powered by Claude · Real-time PH market data</div>
                  </div>
                </div>
                <button onClick={() => setChatOpen(!chatOpen)}
                  className="text-white/50 hover:text-white transition-colors text-xs flex items-center gap-1">
                  {chatOpen ? 'Collapse' : 'Expand'} <ChevronDown className={`w-4 h-4 transition-transform ${chatOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Suggested questions */}
            {!chatOpen && (
              <div className="p-5 border-b border-surface-border">
                <div className="text-xs text-obsidian-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                  Suggested questions — click to ask instantly
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                    <button key={i} onClick={() => { setChatOpen(true); sendMessage(q) }}
                      className="text-xs px-3 py-2 rounded-xl bg-surface-subtle text-obsidian-600 border border-surface-border hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50 transition-all text-left">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat window */}
            {chatOpen && (
              <div>
                {/* All suggested questions */}
                <div className="p-4 border-b border-surface-border bg-surface-subtle/50">
                  <div className="text-xs text-obsidian-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-gold-500" />Quick questions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <button key={i} onClick={() => sendMessage(q)}
                        className="text-[10px] px-2.5 py-1.5 rounded-full bg-white text-obsidian-600 border border-surface-border hover:border-gold-400 hover:text-gold-600 transition-all">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-5 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-xl bg-gold-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3.5 h-3.5 text-obsidian-900" />
                        </div>
                      )}
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-obsidian-900 text-white rounded-tr-sm'
                          : 'bg-surface-subtle text-obsidian-700 rounded-tl-sm border border-surface-border'
                      }`} dangerouslySetInnerHTML={{ __html: renderMessageContent(msg.content) }} />
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-xl bg-obsidian-200 flex items-center justify-center flex-shrink-0 mt-1">
                          <Users className="w-3.5 h-3.5 text-obsidian-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-gold-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5 text-obsidian-900" />
                      </div>
                      <TypingDots />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-surface-border bg-white">
                  <div className="flex gap-3">
                    <input ref={inputRef}
                      className="flex-1 input-field text-sm"
                      placeholder="Ask about prices, yields, neighbourhoods, or investment strategy..."
                      value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      disabled={loading} />
                    <button onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="btn-primary px-4 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Sparkles className="w-3 h-3 text-gold-500" />
                    <span className="text-[10px] text-obsidian-400">Powered by Claude AI · Trained on PH market data · Not financial advice</span>
                    <button onClick={() => setMessages([messages[0]])} className="ml-auto text-[10px] text-obsidian-400 hover:text-gold-600 flex items-center gap-1 transition-colors">
                      <RefreshCw className="w-3 h-3" />Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed input bar */}
            {!chatOpen && (
              <div className="p-4">
                <div className="flex gap-3">
                  <input className="flex-1 input-field text-sm"
                    placeholder="Ask Naya AI about the Port Harcourt property market..."
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { setChatOpen(true); sendMessage() } }}
                    onFocus={() => setChatOpen(true)} />
                  <button onClick={() => { setChatOpen(true); sendMessage() }}
                    disabled={!input.trim()}
                    className="btn-primary px-4 flex-shrink-0 disabled:opacity-50">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── QUARTERLY REPORT ─────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="section-number">Q1 2026 Analysis</span>
              <h2 className="section-title mb-5">Market Commentary</h2>
              <div className="space-y-4 text-obsidian-500 text-sm leading-relaxed">
                <p>Port Harcourt's property market entered 2026 with significant momentum. Average sale prices reached ₦188M in March — a 30% increase year-on-year — while rental yields have remained attractive at 8–12% across premium neighbourhoods.</p>
                <p>The Woji-Rumuola growth corridor continues to outperform the broader market, with Woji recording +18.7% appreciation and Rumuola at +15.3%. This is being driven by a combination of infrastructure improvements, new gated estate development, and strong demand from the growing professional class.</p>
                <p>Bonny Island posted the highest growth rate at +22.4%, reflecting surging demand linked to the NLNG Train 7 expansion and a severe shortage of corporate housing stock for international personnel.</p>
                <p className="font-medium text-obsidian-700">The key constraint on the market remains supply — particularly in GRA Phase 2 and Old GRA, where new residential development is almost impossible due to land scarcity and planning constraints.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="card p-5 bg-obsidian-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
                <div className="relative z-10">
                  <div className="font-mono text-xs text-gold-500 uppercase tracking-widest mb-3">Naya AI Forecast · Q2 2026</div>
                  <p className="text-white/60 text-sm leading-relaxed italic">
                    "Based on current trajectory, average rents in Port Harcourt are likely to reach ₦2.8M–₦3M/yr for 1-bedroom apartments by Q3 2026. Woji is projected to cross ₦1.5M/yr for 1-beds. The GRA supply constraint will keep prices elevated. Investors should focus on Rumuola and Choba for best yield-to-cost ratios, and Bonny Island for maximum capital appreciation."
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Bot className="w-4 h-4 text-gold-400" />
                    <span className="text-xs text-gold-400 font-medium">Naya AI · March 2026</span>
                  </div>
                </div>
              </div>
              {[
                { label: 'Outlook for Rents', value: 'Bullish', sub: '+12–15% expected in 2026', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '📈' },
                { label: 'Outlook for Sale Prices', value: 'Bullish', sub: 'GRA supply constraints persist', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '🏠' },
                { label: 'Liquidity (Days on Market)', value: '28 days avg', sub: 'Improving — was 41 days in 2024', color: 'text-blue-600', bg: 'bg-blue-50', icon: '⚡' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-4 card p-4 ${item.bg} border-0`}>
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs text-obsidian-400 uppercase tracking-wider">{item.label}</div>
                    <div className={`font-display text-lg font-medium ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-obsidian-500">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-obsidian-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-5">
            Data-Driven Decisions<br /><span className="gold-text">Start Here</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">Whether you are buying, renting, or investing — Naya gives you the data and intelligence to make the right move.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => { setChatOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="btn-primary btn-lg gap-2">
              <Bot className="w-5 h-5" />Ask Naya AI
            </button>
            <a href="/neighborhoods" className="btn-ghost border-white/20 text-white/60 hover:text-white btn-lg">
              Explore Neighbourhoods <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
