'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, ChevronDown, Heart, LogIn } from 'lucide-react'

const navItems = [
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/rent' },
  { label: 'Shortlet', href: '/shortlet' },
  { label: 'Commercial', href: '/commercial' },
  { label: 'Agents', href: '/agents' },
  {
    label: 'More',
    children: [
      { label: 'New Developments', href: '/new-developments' },
      { label: 'Neighborhoods', href: '/neighborhoods' },
      { label: 'Market Trends', href: '/market-trends' },
      { label: 'Blog', href: '/blog' },
      { label: 'Mortgage Calculator', href: '/tools/mortgage-calculator' },
      { label: 'Property Valuation', href: '/tools/valuation' },
    ]
  }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${
        scrolled ? 'bg-obsidian-900/95 backdrop-blur-xl shadow-2xl border-b border-white/5' : 'bg-obsidian-900'
      }`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/naya-logo.png"
                alt="Naya Real Estate"
                width={90}
                height={45}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setMoreOpen(!moreOpen)}
                      onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                      className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150"
                    >
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {moreOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl py-2 animate-[scaleIn_0.2s_ease]">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center px-4 py-2.5 text-sm text-white/60 hover:text-gold-400 hover:bg-white/5 transition-all duration-100 mx-1 rounded-xl"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/8 transition-all duration-150"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Saved */}
              <Link href="/dashboard/saved" className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/8 transition-all duration-150">
                <Heart className="w-4.5 h-4.5" />
              </Link>

              {/* List Property */}
              <Link href="/portal" className="hidden md:flex btn-primary btn-sm whitespace-nowrap">
                List Property
              </Link>

              {/* Sign In */}
              <Link href="/login" className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white transition-all duration-150">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/60 hover:text-white hover:bg-white/8 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-obsidian-900 animate-[slideUp_0.25s_ease]">
            <div className="page-container py-4 space-y-1">
              {navItems.map(item =>
                item.children ? (
                  <div key={item.label}>
                    <div className="px-4 py-2 text-xs font-semibold text-gold-500 tracking-widest uppercase mt-3 mb-1">{item.label}</div>
                    {item.children.map(child => (
                      <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link key={item.href} href={item.href!} onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    {item.label}
                  </Link>
                )
              )}
              <div className="pt-4 pb-2 flex flex-col gap-2">
                <Link href="/portal" onClick={() => setMobileOpen(false)} className="btn-primary justify-center">
                  List Your Property
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-ghost text-white/70 border-white/20 justify-center">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[300] bg-obsidian-900/95 backdrop-blur-xl flex items-start justify-center pt-24 px-4 animate-[fadeIn_0.2s_ease]">
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-3 bg-white/8 border border-white/15 rounded-2xl px-5 py-4">
              <Search className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search properties, neighbourhoods, agents…"
                className="flex-1 bg-transparent text-white text-lg font-light placeholder:text-white/30 outline-none"
              />
              <button onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
              {['GRA Phase 2', 'Woji', 'Trans Amadi', 'Rumuola', 'Old GRA', 'Eleme'].map(n => (
                <Link key={n} href={`/search?area=${n.toLowerCase().replace(/ /g,'-')}`}
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-3 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                  📍 {n}
                </Link>
              ))}
            </div>
            <button onClick={() => setSearchOpen(false)} className="mt-6 text-sm text-white/30 hover:text-white/60 transition-colors">
              Press ESC to close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
