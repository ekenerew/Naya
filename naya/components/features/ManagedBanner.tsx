'use client'
import Link from 'next/link'
import { ArrowRight, Sparkles, Phone } from 'lucide-react'

export default function ManagedBanner() {
  return (
    <section className="relative bg-obsidian-900 overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-grid-gold bg-grid opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/6 rounded-full blur-[80px]" />
      <div className="relative z-10 page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-sm font-semibold mb-5">
              <Sparkles className="w-4 h-4" />NEW — Naya Managed Service
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
              Don't Want to List<br /><span className="gold-text">It Yourself?</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-6 max-w-lg">
              Hand your property over to Naya's professional team. We handle photography, marketing, tenant screening, negotiations and legal paperwork — you simply collect your money.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/managed" className="btn-primary gap-2 justify-center">
                Learn More & Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+2348168117004"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all text-sm">
                <Phone className="w-4 h-4" />Call Us Now
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon:'📸', title:'Professional Photography', desc:'HDR photos + 360° virtual tour' },
              { icon:'📣', title:'Full Marketing', desc:'Naya, social media & partner platforms' },
              { icon:'🔍', title:'Tenant Screening', desc:'Vetted, qualified prospects only' },
              { icon:'⚖️', title:'Legal & Paperwork', desc:'Agreements, C of O checks, escrow' },
              { icon:'💰', title:'Transparent Fees', desc:'From ₦50K + 5% on completion' },
              { icon:'🌍', title:'Diaspora Friendly', desc:'We manage it while you\'re abroad' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 transition-colors">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6">
          {['✅ RSSPC Registered Agents','📋 Legal Document Handling','⏱ Live Within 48 Hours','🔒 No Hidden Fees','🌍 Diaspora & Corporate Network'].map((item, i) => (
            <span key={i} className="text-white/40 text-xs font-medium">{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
