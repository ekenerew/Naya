'use client'
import { FileText, Mail } from 'lucide-react'

const sections = [
  { id:'acceptance', title:'1. Acceptance of Terms', content:`By accessing or using the Naya platform you agree to be bound by these Terms of Service. These Terms constitute a legally binding agreement between you and Naya Real Estate Technologies Ltd ("Naya").` },
  { id:'eligibility', title:'2. Eligibility', content:`To use Naya you must be at least 18 years old, have legal capacity to enter contracts under Nigerian law, and provide accurate registration information.` },
  { id:'seekers', title:'3. Property Seekers', content:`Searching listings, saving properties, and contacting agents is free. Transactions between seekers and agents are conducted directly between those parties. Naya is not party to any rental, sale, or lease agreement. Always inspect properties before payment.` },
  { id:'agents', title:'4. Agents and Landlords', content:`Agents must complete RSSPC verification before publishing listings. All listing information must be accurate. You must not list properties you have no authority to list, or properties already let or sold.` },
  { id:'prohibited', title:'5. Prohibited Conduct', content:`You must not post false listings, impersonate any person, send spam, interfere with platform infrastructure, or use the platform for unlawful purposes.` },
  { id:'ip', title:'6. Intellectual Property', content:`All Naya branding, design, and software is owned by Naya Real Estate Technologies Ltd. By posting content you grant Naya a licence to display it on the platform.` },
  { id:'liability', title:'7. Limitation of Liability', content:`The platform is provided "as is". Naya is not liable for losses from transactions between users. Our liability is limited to fees paid by you in the preceding 12 months.` },
  { id:'law', title:'8. Governing Law', content:`These Terms are governed by the laws of Nigeria. Disputes are subject to the courts of Rivers State, Port Harcourt.` },
  { id:'contact', title:'9. Contact', content:`Questions? Email legal@naya.ng or write to: Naya Real Estate Technologies Ltd, Port Harcourt, Rivers State, Nigeria.` },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <FileText className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Legal</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-4">Terms of Service</h1>
            <p className="text-white/40 text-base mb-4">Last Updated: March 2026</p>
            <p className="text-white/30 text-sm max-w-xl">Please read these Terms carefully. They form a binding legal agreement between you and Naya Real Estate Technologies Ltd.</p>
          </div>
        </div>
      </section>
      <section className="bg-gold-50 border-y border-gold-200 py-5">
        <div className="page-container max-w-3xl mx-auto">
          <p className="text-sm text-obsidian-600"><strong>Plain English:</strong> Use Naya honestly. Agents must be verified. Property seekers use it free. Naya connects parties but is not in any deal. We protect your data. Questions? <a href="mailto:legal@naya.ng" className="text-gold-600">legal@naya.ng</a></p>
        </div>
      </section>
      <section className="section-padding">
        <div className="page-container max-w-3xl mx-auto">
          <div className="card p-8 space-y-8">
            {sections.map(s => (
              <div key={s.id} id={s.id}>
                <h2 className="font-display text-xl font-medium text-obsidian-900 mb-3 pb-2 border-b border-surface-border">{s.title}</h2>
                <p className="text-obsidian-500 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
            <div className="p-5 bg-gold-50 border border-gold-200 rounded-2xl flex items-start gap-3">
              <Mail className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-obsidian-900 mb-1">Questions about these Terms?</p>
                <a href="mailto:legal@naya.ng" className="text-sm text-gold-600 hover:underline">legal@naya.ng</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
