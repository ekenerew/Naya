import { Shield, Mail } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Legal</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-4">Privacy Policy</h1>
            <p className="text-white/40 text-base mb-4">Last Updated: 13 March 2026</p>
            <p className="text-white/30 text-sm max-w-xl">This Privacy Policy explains how Naya Real Estate Technologies Ltd collects, uses, stores, and protects your personal data in compliance with the Nigeria Data Protection Act (NDPA) 2023.</p>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="page-container">
          <div className="max-w-3xl mx-auto card p-8 space-y-8">
            {[
              { title: '1. Information We Collect', body: 'We collect information you provide during registration (name, email, phone), property listing details, identity verification documents for agents, payment transaction data, and usage data generated automatically as you use the platform.' },
              { title: '2. How We Use Your Information', body: 'We use your data to provide our services, verify agent identities, process payments, send service communications, improve the platform, detect fraud, and comply with Nigerian law including the NDPA 2023 and NDPR.' },
              { title: '3. Legal Basis for Processing', body: 'We process your data based on contractual necessity, legitimate interests, legal obligations, and where required, your explicit consent. You may withdraw consent at any time.' },
              { title: '4. How We Share Your Information', body: 'We do not sell your personal data. We share data only with payment processors (Paystack, Flutterwave), cloud infrastructure providers, and regulatory authorities where required by law.' },
              { title: '5. Your Rights', body: 'Under the NDPA 2023 you have the right to access, correct, delete, restrict, and port your data. You may also object to processing. Contact privacy@naya.ng to exercise any right. You may also complain to the Nigeria Data Protection Commission (NDPC).' },
              { title: '6. Data Retention', body: 'Active account data is retained for the duration of your account. After closure, core data is retained for 7 years for legal compliance. Marketing data is deleted upon consent withdrawal.' },
              { title: '7. Data Security', body: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We maintain strict access controls, conduct regular security audits, and will notify affected users within 72 hours of any confirmed data breach.' },
              { title: '8. Cookies', body: 'We use essential, analytics, and preference cookies to operate and improve the platform. Marketing cookies are only used with your consent. You can manage cookie preferences through your browser settings.' },
              { title: '9. Children\'s Privacy', body: 'Naya is not directed at individuals under 18. We do not knowingly collect data from minors. Contact privacy@naya.ng if you believe we have done so.' },
              { title: '10. Changes to This Policy', body: 'We will notify you by email at least 14 days before any material changes take effect. Continued use of the platform constitutes acceptance.' },
              { title: '11. Contact', body: 'Data Protection Officer, Naya Real Estate Technologies Ltd, 23 Aba Road, GRA Phase 2, Port Harcourt, Rivers State. Email: privacy@naya.ng | Phone: +234 816 811 7004' },
            ].map((s, i) => (
              <div key={i}>
                <h2 className="font-display text-xl font-medium text-obsidian-900 mb-3 pb-2 border-b border-surface-border">{s.title}</h2>
                <p className="text-obsidian-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
            <div className="p-6 bg-gold-50 border border-gold-200 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-gold-600" />
                <h3 className="font-semibold text-obsidian-900">Questions about this policy?</h3>
              </div>
              <a href="mailto:privacy@naya.ng" className="btn-primary btn-sm">Email privacy@naya.ng</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
