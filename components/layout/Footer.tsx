import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react'

const footerLinks = {
  'Find Property': [
    { label: 'Buy', href: '/buy' },
    { label: 'Rent', href: '/rent' },
    { label: 'Shortlet', href: '/shortlet' },
    { label: 'Commercial', href: '/commercial' },
    { label: 'New Developments', href: '/new-developments' },
    { label: 'Land & Plots', href: '/land' },
  ],
  'Explore': [
    { label: 'Neighborhoods', href: '/neighborhoods' },
    { label: 'Market Trends', href: '/market-trends' },
    { label: 'Blog & Guides', href: '/blog' },
    { label: 'Mortgage Calculator', href: '/tools/mortgage-calculator' },
    { label: 'Property Valuation', href: '/tools/valuation' },
  ],
  'For Agents': [
    { label: 'Agent Directory', href: '/agents' },
    { label: 'List a Property', href: '/portal' },
    { label: 'Agent Dashboard', href: '/portal/dashboard' },
    { label: 'RSSPC Verification', href: '/portal/profile' },
    { label: 'Pricing Plans', href: '/portal/billing' },
  ],
  'Company': [
    { label: 'About Naya', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-obsidian-900 adire-bg">
      {/* Main Footer */}
      <div className="page-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/naya-logo.png"
                alt="Naya Real Estate"
                width={120}
                height={60}
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              Nigeria&apos;s premium property marketplace. Find, verify, and secure your perfect home in Port Harcourt with Naya.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                23 Aba Road, GRA Phase 2, Port Harcourt, Rivers State
              </div>
              <a href="tel:+2348168117004" className="flex items-center gap-3 text-white/40 hover:text-gold-400 text-sm transition-colors">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                +234 816 811 7004
              </a>
              <a href="mailto:hello@naya.ng" className="flex items-center gap-3 text-white/40 hover:text-gold-400 text-sm transition-colors">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                hello@naya.ng
              </a>
            </div>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold-400 hover:border-gold-500/30 hover:bg-gold-500/10 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-mono text-xs text-gold-500 tracking-widest uppercase mb-5">{category}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/8">
        <div className="page-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 font-mono">
            © 2026 Naya Real Estate Technologies Ltd. RC-1234567. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/20 font-mono">RSSPC Partner</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="text-xs text-white/20 font-mono">CAC Registered</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="text-xs text-gold-700 font-mono">Port Harcourt, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
