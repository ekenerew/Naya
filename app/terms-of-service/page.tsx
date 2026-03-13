import { FileText, Mail } from 'lucide-react'

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
            <p className="text-white/40 text-base mb-4">Last Updated: 13 March 2026</p>
            <p className="text-white/30 text-sm max-w-xl">Please read these Terms carefully. They form a binding legal agreement between you and Naya Real Estate Technologies Ltd.</p>
          </div>
        </div>
      </section>
      <section className="bg-gold-50 border-y border-gold-200 py-6">
        <div className="page-container">
          <p className="text-sm text-obsidian-600 max-w-3xl mx-auto"><strong className="text-obsidian-900">Plain English Summary:</strong> By using Naya, you agree to use the platform honestly. Agents must be verified. Property seekers use the platform free. Naya connects users but is not party to any deal. We protect your data and never sell it. Questions? Email <a href="mailto:legal@naya.ng" className="text-gold-600">legal@naya.ng</a>.</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="page-container">
          <div className="max-w-3xl mx-auto card p-8 space-y-8">
            {[
              { title: '1. Acceptance of Terms', body: 'By accessing or using the Naya platform you agree to be bound by these Terms, our Privacy Policy, and applicable Nigerian law. If you do not agree, you must not use the platform.' },
              { title: '2. Eligibility', body: 'You must be at least 18 years old, have legal capacity to enter contracts under Nigerian law, and provide accurate registration information.' },
              { title: '3. Account Security', body: 'You are responsible for maintaining confidentiality of your account credentials and all activity under your account. Notify us immediately at hello@naya.ng if you suspect unauthorised access.' },
              { title: '4. Terms for Property Seekers', body: 'Searching and contacting agents is free. Naya is not a party to any rental or sale agreement. You should independently verify all property details and physically inspect properties before making any payment.' },
              { title: '5. Terms for Agents and Landlords', body: 'Agents must complete RSSPC verification before listing. All listing information must be accurate and kept up to date. You must not list properties you have no authority to list or that are no longer available.' },
              { title: '6. Prohibited Conduct', body: 'You must not post false or fraudulent listings, impersonate others, harvest user data, send spam, interfere with platform infrastructure, or use the platform for any unlawful purpose under Nigerian law.' },
              { title: '7. Intellectual Property', body: 'All Naya branding, design, and content is owned by Naya. By posting content you grant Naya a licence to display it on the platform. You retain ownership of your own content.' },
              { title: '8. Payments and Fees', body: 'Featured listings and premium subscriptions are subject to fees displayed in your dashboard. Payments are processed by Paystack and Flutterwave. Fees for completed listing periods are non-refundable.' },
              { title: '9. Disclaimers', body: 'The platform is provided as is. Agent verification does not guarantee agent conduct. Naya is not liable for losses arising from user-to-user transactions. Our maximum liability is limited to fees paid by you in the preceding 12 months.' },
              { title: '10. Governing Law', body: 'These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes are subject to the jurisdiction of the courts of Rivers State. Commercial disputes above ₦1,000,000 may be referred to arbitration in Port Harcourt.' },
              { title: '11. Changes to These Terms', body: 'We will notify you by email at least 14 days before material changes take effect. Continued use of the platform constitutes acceptance of updated Terms.' },
              { title: '12. Contact', body: 'Naya Real Estate Technologies Ltd, 23 Aba Road, GRA Phase 2, Port Harcourt, Rivers State. Email: legal@naya.ng | Phone: +234 816 811 7004' },
            ].map((s, i) => (
              <div key={i}>
                <h2 className="font-display text-xl font-medium text-obsidian-900 mb-3 pb-2 border-b border-surface-border">{s.title}</h2>
                <p className="text-obsidian-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
            <div className="p-6 bg-gold-50 border border-gold-200 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-gold-600" />
                <h3 className="font-semibold text-obsidian-900">Questions about these Terms?</h3>
              </div>
              <a href="mailto:legal@naya.ng" className="btn-primary btn-sm">Email legal@naya.ng</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
