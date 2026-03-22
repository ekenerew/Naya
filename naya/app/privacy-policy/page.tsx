import Link from 'next/link'
import { Shield, Mail } from 'lucide-react'

const sections = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us and information generated through your use of our platform.

**Information You Provide:**
- Account registration details: full name, email address, phone number, and password
- Profile information: profile photo, professional credentials, and biographical information
- Property listing information: property address, photos, videos, price, and description
- Communications: messages sent through our platform between users and agents
- Identity verification documents: government-issued ID, RSSPC licence number, CAC registration documents (for agents only)
- Payment information: transaction details processed through our payment partners (Paystack / Flutterwave). We do not store full card details.
- Support communications: information you provide when contacting our support team

**Information Collected Automatically:**
- Usage data: pages visited, features used, search queries, and time spent on the platform
- Device information: IP address, browser type, operating system, and device identifiers
- Location data: approximate location inferred from IP address; precise location only with your explicit consent
- Cookies and similar tracking technologies as described in our Cookie Policy`,
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

- **Provide our services:** Enable property searches, listing creation, agent-seeker communication, and account management
- **Verify identities:** Conduct KYC (Know Your Customer) checks on agents to protect property seekers
- **Process transactions:** Facilitate payments for featured listings and premium subscriptions
- **Communicate with you:** Send service notifications, booking confirmations, and responses to your enquiries
- **Improve our platform:** Analyse usage patterns to enhance features and user experience
- **Ensure platform integrity:** Detect and prevent fraud, fake listings, and policy violations
- **Legal compliance:** Meet our obligations under Nigerian law including the Nigeria Data Protection Act (NDPA) 2023 and the Nigeria Data Protection Regulation (NDPR)
- **Marketing:** Send you relevant property alerts and platform updates, where you have consented to receive them`,
  },
  {
    id: 'legal-basis',
    title: '3. Legal Basis for Processing',
    content: `Under the Nigeria Data Protection Act 2023 and applicable law, we process your personal data on the following legal bases:

- **Contractual necessity:** To perform our agreement with you as a registered user or agent
- **Legitimate interests:** To improve our services, prevent fraud, and protect our platform and users
- **Legal obligation:** To comply with applicable Nigerian laws and regulatory requirements
- **Consent:** For marketing communications, cookies, and location tracking — you may withdraw consent at any time
- **Vital interests:** Where necessary to protect the safety of users on our platform`,
  },
  {
    id: 'sharing',
    title: '4. How We Share Your Information',
    content: `We do not sell your personal data. We share your information only in the following circumstances:

**With Other Users:**
- Agent profile information (name, photo, contact details, credentials, ratings) is visible to property seekers on the platform
- Property listing details are visible to all users of the platform

**With Service Providers:**
- Payment processors (Paystack, Flutterwave) to facilitate transactions
- Cloud infrastructure providers (AWS) for data storage and platform operations
- Communication services for email and SMS notifications
- Analytics providers for platform usage analysis

All third-party service providers are contractually bound to process data only as instructed by Naya and in compliance with applicable data protection law.

**With Authorities:**
We may disclose information where required by law, court order, or regulatory authority, or where necessary to protect the rights and safety of our users.

**Business Transfers:**
In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity, subject to the same privacy protections.`,
  },
  {
    id: 'your-rights',
    title: '5. Your Rights',
    content: `Under the Nigeria Data Protection Act 2023, you have the following rights regarding your personal data:

- **Right of Access:** Request a copy of the personal data we hold about you
- **Right to Rectification:** Request correction of inaccurate or incomplete data
- **Right to Erasure:** Request deletion of your personal data, subject to legal retention obligations
- **Right to Restrict Processing:** Request that we limit how we use your data in certain circumstances
- **Right to Data Portability:** Receive your data in a structured, machine-readable format
- **Right to Object:** Object to processing based on legitimate interests, including direct marketing
- **Right to Withdraw Consent:** Where processing is based on consent, withdraw it at any time without affecting prior processing

To exercise any of these rights, contact us at **privacy@naya.ng**. We will respond within 30 days. You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC).`,
  },
  {
    id: 'data-retention',
    title: '6. Data Retention',
    content: `We retain your personal data for as long as necessary to provide our services and comply with legal obligations:

- **Active accounts:** Data is retained for the duration of your account
- **Closed accounts:** Core account data is retained for 7 years after account closure to comply with Nigerian financial and tax regulations
- **Agent verification documents:** Retained for 5 years after the agent relationship ends
- **Communications:** Messages between users are retained for 3 years
- **Transaction records:** Payment records are retained for 7 years as required by law
- **Marketing data:** Retained until you withdraw consent or request deletion

Data that is no longer required is securely deleted or anonymised.`,
  },
  {
    id: 'security',
    title: '7. Data Security',
    content: `We implement appropriate technical and organisational measures to protect your personal data:

- **Encryption:** All data is encrypted in transit (TLS 1.3) and at rest (AES-256)
- **Access controls:** Strict role-based access controls limit who can access personal data internally
- **Payment security:** Card data is tokenised by our payment partners; we never store full card numbers
- **Regular audits:** We conduct regular security audits and vulnerability assessments
- **Incident response:** We maintain a data breach response plan and will notify affected users and the NDPC within 72 hours of a confirmed breach

While we take these precautions, no internet transmission is 100% secure. We encourage you to use a strong password and protect your account credentials.`,
  },
  {
    id: 'cookies',
    title: '8. Cookies',
    content: `We use cookies and similar technologies to operate and improve our platform. Types of cookies we use:

- **Essential cookies:** Required for the platform to function (session management, security)
- **Analytics cookies:** Help us understand how users interact with the platform (Google Analytics)
- **Preference cookies:** Remember your settings and preferences
- **Marketing cookies:** Used to deliver relevant property alerts (only with your consent)

You can manage cookie preferences through your browser settings. Note that disabling essential cookies may affect platform functionality.`,
  },
  {
    id: 'children',
    title: '9. Children\'s Privacy',
    content: `Naya is not directed at individuals under 18 years of age. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected data from a minor, please contact us at privacy@naya.ng and we will delete the information promptly.`,
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy periodically to reflect changes in our practices or applicable law. When we make material changes, we will:

- Post the updated policy on this page with a revised "Last Updated" date
- Send a notification to your registered email address
- Display a prominent notice on our platform

Your continued use of Naya after the effective date of changes constitutes acceptance of the updated policy.`,
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    content: `For questions, complaints, or requests regarding your personal data:

**Data Protection Officer**
Naya Real Estate Technologies Ltd
23 Aba Road, GRA Phase 2
Port Harcourt, Rivers State, Nigeria

Email: privacy@naya.ng
Phone: +234 816 811 7004

You also have the right to file a complaint with the Nigeria Data Protection Commission (NDPC) at ndpc.gov.ng.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-bg">

      {/* HERO */}
      <section className="relative bg-obsidian-900 overflow-hidden py-20">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-40" />
        <div className="page-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 mb-6">
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-xs text-gold-400 tracking-widest uppercase">Legal</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/40 text-base leading-relaxed mb-4">
              Last Updated: 13 March 2026 &nbsp;·&nbsp; Effective Date: 13 March 2026
            </p>
            <p className="text-white/30 text-sm leading-relaxed max-w-xl">
              This Privacy Policy explains how Naya Real Estate Technologies Ltd collects, uses, stores, and protects your personal data in compliance with the Nigeria Data Protection Act (NDPA) 2023.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 15C1200 50 960 0 720 15C480 30 240 0 0 15L0 50Z" fill="#FAFAF8"/>
          </svg>
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
                <div className="prose-naya space-y-10">
                  {sections.map(s => (
                    <div key={s.id} id={s.id}>
                      <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4 pb-3 border-b border-surface-border">{s.title}</h2>
                      <div className="text-obsidian-500 text-sm leading-relaxed space-y-3">
                        {s.content.split('\n\n').map((para, i) => (
                          <p key={i} dangerouslySetInnerHTML={{
                            __html: para
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-obsidian-700">$1</strong>')
                              .replace(/^- (.+)$/gm, '<span class="block pl-4 border-l-2 border-gold-200 my-1">$1</span>')
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
                    <h3 className="font-semibold text-obsidian-900">Questions about this policy?</h3>
                  </div>
                  <p className="text-sm text-obsidian-500 mb-4">Our Data Protection Officer is available to help.</p>
                  <a href="mailto:privacy@naya.ng" className="btn-primary btn-sm">Email privacy@naya.ng</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
