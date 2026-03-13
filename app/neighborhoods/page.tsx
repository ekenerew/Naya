import Link from 'next/link'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { neighborhoods, formatPrice } from '@/lib/data'

export const metadata = { title: 'Neighborhoods — Port Harcourt Property Guide' }

export default function NeighborhoodsPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="bg-obsidian-900 py-16">
        <div className="page-container text-center">
          <span className="section-number text-gold-500">Neighborhood Guides</span>
          <h1 className="font-display text-4xl md:text-5xl text-white font-light mb-4">Explore <span className="gold-text">Port Harcourt</span></h1>
          <p className="text-white/40 text-lg font-light max-w-xl mx-auto">Deep-dive guides on every major PH neighborhood — safety scores, pricing, schools, and more.</p>
        </div>
      </div>
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map(n => (
            <Link key={n.id} href={`/neighborhoods/${n.slug}`} className="group block rounded-3xl overflow-hidden border border-surface-border hover:border-gold-300 shadow-card hover:shadow-xl-soft transition-all duration-300 hover:-translate-y-1 bg-white">
              <div className={`h-48 bg-gradient-to-br ${n.heroGradient} flex items-center justify-center relative overflow-hidden`}>
                <span className="text-6xl opacity-20 group-hover:opacity-35 group-hover:scale-110 transition-all duration-500">{n.emoji}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="font-display text-2xl text-white font-medium">{n.name}</div>
                  <div className="text-white/60 text-sm">{n.lga} · {n.propertyCount} properties</div>
                </div>
                <div className={`absolute top-4 right-4 flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full ${n.trend==='up'?'bg-emerald-500/20 text-emerald-300':'bg-white/10 text-white/60'}`}>
                  <TrendingUp className="w-3 h-3"/>{n.trend==='up'?'+':''}{n.trendPct}% YoY
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-obsidian-500 line-clamp-2 mb-4">{n.description.substring(0,120)}…</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div><div className="text-xs text-obsidian-400 font-mono">Avg Rent (1BR)</div><div className="font-mono font-semibold text-gold-600 text-sm">{formatPrice(n.avgRent1br)}/yr</div></div>
                  <div><div className="text-xs text-obsidian-400 font-mono">Avg Sale</div><div className="font-mono font-semibold text-gold-600 text-sm">{formatPrice(n.avgBuyPrice)}</div></div>
                </div>
                <div className="grid grid-cols-4 gap-1 mb-4">
                  {[{l:'Safety',v:n.safetyScore},{l:'Infra',v:n.infrastructureScore},{l:'Schools',v:n.schoolScore},{l:'Flood',v:100-n.floodRiskScore}].map(s=>(
                    <div key={s.l} className="text-center p-2 bg-surface-subtle rounded-lg">
                      <div className={`font-mono text-sm font-bold ${s.v>=80?'text-emerald-600':s.v>=60?'text-amber-600':'text-red-600'}`}>{s.v}</div>
                      <div className="text-[10px] text-obsidian-400">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gold-600 font-medium group-hover:text-gold-500">
                  View neighborhood guide <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
