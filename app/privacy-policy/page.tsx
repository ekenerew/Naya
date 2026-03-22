'use client'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <section className="bg-obsidian-900 py-16">
        <div className="page-container text-center">
          <h1 className="font-display text-4xl font-light text-white mb-4">Privacy Policy</h1>
          <p className="text-white/50">Last updated: March 2026</p>
        </div>
      </section>
      <div className="page-container py-12 max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">1. Information We Collect</h2>
        <p className="text-obsidian-600 mb-6">We collect information you provide directly (name, email, phone, property listings), information collected automatically (device info, IP address, usage data), and verification documents for agent registration.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">2. How We Use Your Information</h2>
        <p className="text-obsidian-600 mb-6">We use your information to provide and improve our services, verify agent credentials with RSSPC, facilitate property enquiries, send notifications about listings and enquiries, and comply with legal obligations.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">3. Data Sharing</h2>
        <p className="text-obsidian-600 mb-6">We share your contact information with agents/landlords only when you submit an enquiry. We do not sell your personal data to third parties. Verification documents are only accessed by our verification team.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">4. Data Security</h2>
        <p className="text-obsidian-600 mb-6">All data is encrypted in transit (TLS) and at rest. We use Supabase (ISO 27001 certified) for data storage. Passwords are hashed using bcrypt with 12 salt rounds.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">5. Your Rights (NDPA 2023)</h2>
        <p className="text-obsidian-600 mb-6">Under the Nigeria Data Protection Act 2023, you have the right to access your personal data, correct inaccurate data, request deletion of your data, and withdraw consent at any time.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">6. Cookies</h2>
        <p className="text-obsidian-600 mb-6">We use essential cookies for authentication sessions only. We do not use tracking or advertising cookies.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">7. Contact</h2>
        <p className="text-obsidian-600 mb-6">For privacy concerns, contact our Data Protection Officer at <a href="mailto:privacy@naya.ng" className="text-gold-600 hover:underline">privacy@naya.ng</a></p>
      </div>
    </div>
  )
}
