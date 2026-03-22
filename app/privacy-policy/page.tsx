'use client'
import { Shield, Mail } from 'lucide-react'

const sections = [
  { id:'collect', title:'1. Information We Collect', content:`We collect: information you provide (name, email, phone, listings), automatic data (device info, IP address, usage), and verification documents for agent registration.` },
  { id:'use', title:'2. How We Use Your Data', content:`We use your data to provide our services, verify agent credentials with RSSPC, facilitate property enquiries, send notifications, and comply with Nigerian law.` },
  { id:'sharing', title:'3. Data Sharing', content:`Your contact details are shared with agents only when you submit an enquiry. We never sell personal data. Verification documents are only accessed by our verification team.` },
  { id:'security', title:'4. Data Security', content:`All data is encrypted in transit (TLS 1.3) and at rest. Passwords are hashed with bcrypt (12 rounds). We use Supabase (ISO 27001 certified) for storage.` },
  { id:'rights', title:'5. Your Rights (NDPA 2023)', content:`Under Nigeria's Data Protection Act 2023 you have the right to: access your data, correct inaccuracies, request deletion, and withdraw consent at any time. Contact privacy@naya.ng to exercise these rights.` },
  { id:'cookies', title:'6. Cookies', content:`We use only essential session cookies for authentication. We do not use tracking, advertising, or third-party analytics cookies.` },
  { id:'retention', title:'7. Data Retention', content:`We retain your data while your account is active. On account deletion, personal data is removed within 30 days except where required by Nigerian law.` },
  { id:'contact', title:'8. Contact', content:`Data Protection Officer: privacy@naya.ng\nNaya Real Estate Technologies Ltd, Port Harcourt, Rivers State, Nigeria.` },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-6">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-xs text-emerald-400 tracking-widest uppercase">Privacy</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-4">Privacy Policy</h1>
            <p className="text-white/40 text-base mb-4">Last Updated: March 2026</p>
            <p className="text-white/30 text-sm max-w-xl">We take your privacy seriously. This policy explains how Naya collects, uses, and protects your personal data in accordance with the Nigeria Data Protection Act 2023.</p>
          </div>
        </div>
      </section>
      <section className="bg-emerald-50 border-y border-emerald-200 py-5">
        <div className="page-container max-w-3xl mx-auto">
          <p className="text-sm text-obsidian-600"><strong>In plain English:</strong> We only collect what we need. We never sell your data. You can delete your account anytime. Questions? <a href="mailto:privacy@naya.ng" className="text-emerald-600">privacy@naya.ng</a></p>
        </div>
      </section>
      <section className="section-padding">
        <div className="page-container max-w-3xl mx-auto">
          <div className="card p-8 space-y-8">
            {sections.map(s => (
              <div key={s.id} id={s.id}>
                <h2 className="font-display text-xl font-medium text-obsidian-900 mb-3 pb-2 border-b border-surface-border">{s.title}</h2>
                <p className="text-obsidian-500 text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-obsidian-900 mb-1">Privacy questions?</p>
                <a href="mailto:privacy@naya.ng" className="text-sm text-emerald-600 hover:underline">privacy@naya.ng</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
