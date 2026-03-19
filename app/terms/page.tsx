import { FileText, Mail } from 'lucide-react'

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using the Naya platform — including our website (naya.ng), mobile application, and associated services (collectively, the "Platform") — you agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and any additional guidelines or policies incorporated herein.

If you do not agree to these Terms, you must not access or use the Platform.

These Terms constitute a legally binding agreement between you and Naya Real Estate Technologies Ltd, a company incorporated under the laws of the Federal Republic of Nigeria ("Naya", "we", "our", or "us").`,
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: `To use the Naya Platform, you must:

- Be at least 18 years of age
- Have the legal capacity to enter into binding contracts under Nigerian law
- Not be prohibited from using our services under any applicable law
- Provide accurate, current, and complete registration information

By using the Platform, you represent and warrant that you meet all eligibility requirements. Naya reserves the right to suspend or terminate accounts that do not meet these requirements.`,
  },
  {
    id: 'account',
    title: '3. Account Registration and Security',
    content: `**Registration:** You must create an account to access most Platform features. You agree to provide accurate and complete information during registration and to keep your account information updated.

**Security:** You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately at hello@naya.ng if you suspect any unauthorised access to your account.

**One Account Per Person:** You may only maintain one active account. Creating multiple accounts to circumvent restrictions or bans is prohibited.

**Account Termination:** You may close your account at any time by contacting us. We reserve the right to suspend or terminate accounts that violate these Terms.`,
  },
  {
    id: 'property-seekers',
    title: '4. Terms for Property Seekers',
    content: `**Free Access:** Searching listings, saving properties, and contacting agents is free for property seekers.

**Accuracy of Information:** While Naya verifies agents and reviews listings, we do not guarantee the accuracy of all listing information. You should independently verify all property details before entering into any agreement.

**Direct Transactions:** Transactions between property seekers and agents or landlords are conducted directly between those parties. Naya is not a party to any rental, sale, or lease agreement.

**No Guarantee of Availability:** Listing availability changes in real time. Naya does not guarantee that a listed property will be available when you enquire.

**Due Diligence:** We strongly encourage you to physically inspect any property before making payment and to request all relevant legal documents including Certificate of Occupancy (C of O) and Title Deeds.`,
  },
  {
    id: 'agents',
    title: '5. Terms for Agents and Landlords',
    content: `**Verification Requirement:** Agents must complete Naya's KYC verification process, including RSSPC licence verification and identity checks, before publishing listings. Failure to maintain valid credentials will result in account suspension.

**Listing Accuracy:** You warrant that all information in your listings is accurate, complete, and not misleading. You must promptly update or remove listings that are no longer available.

**Prohibited Listings:** You must not list:
- Properties you do not have authority to list or let
- Properties with disputed ownership or encumbrances not disclosed in the listing
- Properties at prices you know to be materially inaccurate
- Properties that have already been let, sold, or are no longer available

**Agent Fees:** Naya's subscription and featured listing fees are set out in our current fee schedule, which may be updated with 30 days' notice.

**Conduct:** You must respond to genuine enquiries promptly and professionally. Repeated failure to respond or deliberate misleading of property seekers may result in account suspension.`,
  },
  {
    id: 'prohibited',
    title: '6. Prohibited Conduct',
    content: `You must not use the Platform to:

- Post false, misleading, or fraudulent listings or information
- Impersonate any person or entity, or misrepresent your affiliation with any person or entity
- Collect or harvest personal data from other users without consent
- Send unsolicited commercial messages or spam to other users
- Interfere with or disrupt the Platform's technical infrastructure
- Circumvent, disable, or tamper with any security features of the Platform
- Use the Platform for any unlawful purpose or in violation of Nigerian law
- Engage in price manipulation, bid rigging, or any anti-competitive conduct
- Publish offensive, defamatory, or discriminatory content
- Reproduce, duplicate, or resell any part of the Platform without express written permission

Violation of these prohibitions may result in immediate account termination and, where appropriate, referral to law enforcement authorities.`,
  },
  {
    id: 'intellectual-property',
    title: '7. Intellectual Property',
    content: `**Naya's IP:** All content on the Platform — including the Naya name and logo, website design, software, text, graphics, and data — is owned by or licensed to Naya and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.

**Your Content:** By posting content on the Platform (listings, photos, reviews, messages), you grant Naya a non-exclusive, worldwide, royalty-free licence to use, display, and distribute that content for the purposes of operating and promoting the Platform.

**You Retain Ownership:** You retain ownership of content you create. You are responsible for ensuring you have the right to post any content, including photos and documents.`,
  },
  {
    id: 'payments',
    title: '8. Payments and Fees',
    content: `**Platform Fees:** Certain features — including featured listings, premium agent subscriptions, and boosted visibility — are subject to fees. Current fees are displayed in your dashboard and may change with 30 days' written notice.

**Payment Processing:** Payments are processed by Paystack and/or Flutterwave. By making a payment, you agree to their respective terms of service. Naya does not store full payment card details.

**Refund Policy:** Fees for completed listing periods or consumed credits are non-refundable unless the listing was rejected or removed due to an error on our part. Disputes must be raised within 14 days of the transaction.

**Taxes:** You are responsible for all applicable taxes arising from your use of the Platform.`,
  },
  {
    id: 'disclaimers',
    title: '9. Disclaimers and Limitation of Liability',
    content: `**Platform Provided "As Is":** The Platform is provided on an "as is" and "as available" basis. We do not warrant that the Platform will be uninterrupted, error-free, or free of viruses.

**No Endorsement:** Naya does not endorse any specific property, agent, landlord, or listing. Verification of agent credentials does not constitute a guarantee of agent performance or conduct.

**Third-Party Transactions:** Naya is not a party to any property transaction. We are not liable for any loss arising from transactions conducted between users outside the Platform.

**Limitation of Liability:** To the fullest extent permitted by Nigerian law, Naya's aggregate liability to you for any claim arising from use of the Platform shall not exceed the fees paid by you to Naya in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.`,
  },
  {
    id: 'dispute',
    title: '10. Dispute Resolution',
    content: `**Good Faith Resolution:** We encourage you to contact us at hello@naya.ng to resolve any disputes informally before initiating formal proceedings.

**Governing Law:** These Terms are governed by the laws of the Federal Republic of Nigeria. Any dispute arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Rivers State, Nigeria.

**Arbitration:** For commercial disputes involving amounts above ₦1,000,000, either party may refer the matter to arbitration under the Arbitration and Conciliation Act (as amended), with arbitration to be conducted in Port Harcourt.`,
  },
  {
    id: 'changes',
    title: '11. Changes to These Terms',
    content: `We may update these Terms from time to time. When we make material changes, we will:

- Post the updated Terms on this page with a revised "Last Updated" date
- Notify you by email to your registered address at least 14 days before changes take effect

Your continued use of the Platform after the effective date constitutes your acceptance of the updated Terms. If you do not agree to the changes, you must stop using the Platform and close your account.`,
  },
  {
    id: 'contact',
    title: '12. Contact',
    content: `If you have questions about these Terms, please contact us:

**Naya Real Estate Technologies Ltd**
23 Aba Road, GRA Phase 2
Port Harcourt, Rivers State, Nigeria

Email: legal@naya.ng
Phone: +234 816 811 7004`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-bg">

      {/* HERO */}
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <FileText className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Legal</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-white/40 text-base leading-relaxed mb-4">
              Last Updated: 13 March 2026 &nbsp;·&nbsp; Effective Date: 13 March 2026
            </p>
            <p className="text-white/30 text-sm leading-relaxed max-w-xl">
              Please read these Terms carefully before using Naya. They form a binding legal agreement between you and Naya Real Estate Technologies Ltd.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* SUMMARY BANNER */}
      <section className="bg-gold-50 border-y border-gold-200 py-6">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-obsidian-600 leading-relaxed">
              <strong className="text-obsidian-900">Plain English Summary:</strong> By using Naya, you agree to use the platform honestly. Agents must be properly verified. Property seekers use the platform free of charge. Naya connects buyers and agents but is not a party to any property deal. We protect your data and do not sell it. Questions? Email <a href="mailto:legal@naya.ng" className="text-gold-600 hover:underline">legal@naya.ng</a>.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section-padding bg-surface-bg">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar TOC */}
            <div className="hidden lg:block">
              <div className="sticky top-24 card p-5">
                <div className="font-mono text-xs text-obsidian-400 uppercase tracking-widest mb-4">Contents</div>
                <nav className="space-y-1">
                  {sections.map(s => (
                    <a key={s.id} href={`#${s.id}`}
                      className="block text-xs text-obsidian-500 hover:text-gold-600 py-1.5 border-l-2 border-transparent hover:border-gold-500 pl-3 transition-all">
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="card p-8 md:p-10">
                <div className="space-y-10">
                  {sections.map(s => (
                    <div key={s.id} id={s.id}>
                      <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4 pb-3 border-b border-surface-border">{s.title}</h2>
                      <div className="text-obsidian-500 text-sm leading-relaxed space-y-3">
                        {s.content.split('\n\n').map((para, i) => (
                          <p key={i} dangerouslySetInnerHTML={{
                            __html: para
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-obsidian-700">$1</strong>')
                              .replace(/^- (.+)$/gm, '<span class="block pl-4 border-l-2 border-gold-200 my-1.5">$1</span>')
                          }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact box */}
                <div className="mt-12 p-6 bg-gold-50 border border-gold-200 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-gold-600" />
                    <h3 className="font-semibold text-obsidian-900">Questions about these Terms?</h3>
                  </div>
                  <p className="text-sm text-obsidian-500 mb-4">Our legal team is available to clarify any aspect of these Terms.</p>
                  <a href="mailto:legal@naya.ng" className="btn-primary btn-sm">Email legal@naya.ng</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
