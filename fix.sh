#!/bin/bash
set -e
cd ~/naya

echo "=== Creating terms-of-service page ==="
mkdir -p app/terms-of-service
cat > app/terms-of-service/page.tsx << 'EOF'
'use client'
import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <section className="bg-obsidian-900 py-16">
        <div className="page-container text-center">
          <h1 className="font-display text-4xl font-light text-white mb-4">Terms of Service</h1>
          <p className="text-white/50">Last updated: March 2026</p>
        </div>
      </section>
      <div className="page-container py-12 max-w-3xl mx-auto prose prose-obsidian">
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">1. Acceptance of Terms</h2>
        <p className="text-obsidian-600 mb-6">By accessing or using Naya Real Estate Technologies Ltd ("Naya", "we", "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">2. Use of the Platform</h2>
        <p className="text-obsidian-600 mb-6">Naya is a property marketplace connecting property seekers with verified agents and landlords in Port Harcourt, Nigeria. You agree to use the platform only for lawful purposes and in accordance with these terms.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">3. Agent Verification</h2>
        <p className="text-obsidian-600 mb-6">Agents on Naya are verified against the Rivers State Real Estate Practitioners Council (RSSPC) register. However, Naya does not guarantee the accuracy of agent-provided information. Users are advised to conduct their own due diligence.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">4. Listing Accuracy</h2>
        <p className="text-obsidian-600 mb-6">Agents and landlords are solely responsible for the accuracy of their listings. Naya reserves the right to remove any listing that violates our policies or contains false information.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">5. Privacy</h2>
        <p className="text-obsidian-600 mb-6">Your use of Naya is also governed by our <Link href="/privacy-policy" className="text-gold-600 hover:underline">Privacy Policy</Link>, which is incorporated into these terms by reference.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">6. Limitation of Liability</h2>
        <p className="text-obsidian-600 mb-6">Naya is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform. We do not participate in actual property transactions.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">7. Data Protection</h2>
        <p className="text-obsidian-600 mb-6">Naya complies with the Nigeria Data Protection Act 2023 (NDPA). All personal data is processed lawfully and securely.</p>
        <h2 className="font-display text-2xl font-medium text-obsidian-900 mb-4">8. Contact</h2>
        <p className="text-obsidian-600 mb-6">For questions about these terms, contact us at <a href="mailto:legal@naya.ng" className="text-gold-600 hover:underline">legal@naya.ng</a></p>
      </div>
    </div>
  )
}
EOF

echo "=== Creating privacy-policy page ==="
mkdir -p app/privacy-policy
cat > app/privacy-policy/page.tsx << 'EOF'
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
EOF

echo "=== Fixing Navbar logo ==="
sed -i 's|width={90} height={45} className="h-10 w-auto|width={160} height={64} className="h-14 w-auto|g' components/layout/Navbar.tsx
sed -i 's|width={140} height={56} className="h-12 w-auto|width={160} height={64} className="h-14 w-auto|g' components/layout/Navbar.tsx

echo "=== Verifying ==="
echo "Terms lines: $(wc -l < app/terms-of-service/page.tsx)"
echo "Privacy lines: $(wc -l < app/privacy-policy/page.tsx)"
grep "naya-logo" components/layout/Navbar.tsx

echo "=== Pushing to GitHub ==="
git add app/terms-of-service/page.tsx app/privacy-policy/page.tsx components/layout/Navbar.tsx
git commit -m "Fix: terms-of-service, privacy-policy pages, larger logo"
git push origin main

echo "=== DONE — now redeploy on Vercel ==="
