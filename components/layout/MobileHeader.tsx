'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Bell, User, Menu, X, ChevronRight, LogIn, Home, MapPin, Sparkles } from 'lucide-react'
import MobileSearch from './MobileSearch'

const PAGE_TITLES: Record<string, string> = {
  '/search':        'Search',
  '/buy':           'Buy Property',
  '/rent':          'Rent Property',
  '/shortlet':      'Shortlets',
  '/commercial':    'Commercial',
  '/land':          'Land',
  '/map':           'Map Search',
  '/neighborhoods': 'Neighbourhoods',
  '/discover':      'Discover',
  '/managed':       'Naya Managed',
  '/escrow':        'Naya Escrow',
  '/credit-score':  'Tenant Score',
  '/alerts':        'Price Alerts',
  '/tools':         'Tools',
  '/agent-league':  'Agent League',
  '/agents':        'Agents',
  '/market-trends': 'Market Trends',
  '/portal/dashboard': 'Dashboard',
  '/portal/list':   'List Property',
  '/portal/profile':'My Profile',
}

export default function MobileHeader() {
  const pathname  = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const isHome    = pathname === '/'
  const pageTitle = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1]

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[200] md:hidden transition-all duration-300 ${
        scrolled ? 'bg-obsidian-900/95 backdrop-blur-xl shadow-lg' : 'bg-obsidian-900'
      }`} style={{ paddingTop:'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left: Logo or back title */}
          <Link href="/" className="flex items-center flex-shrink-0">
            {isHome || !pageTitle ? (
              <Image src="/naya-logo.png" alt="Naya" width={120} height={48} className="h-9 w-auto object-contain" priority />
            ) : (
              <div className="flex items-center gap-2">
                <Image src="/naya-logo.png" alt="Naya" width={80} height={32} className="h-7 w-auto object-contain opacity-70" />
                {pageTitle && <span className="text-white/60 text-sm font-medium">/ {pageTitle}</span>}
              </div>
            )}
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:bg-white/10 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/alerts"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-obsidian-900" />
            </Link>
            <Link href="/login"
              className="w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:bg-white/10 transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Home page quick search bar */}
        {isHome && (
          <div className="px-4 pb-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-3 w-full px-4 py-3 bg-white/8 border border-white/12 rounded-2xl text-white/40 text-sm"
            >
              <Search className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Search properties, areas, agents...</span>
            </button>
          </div>
        )}
      </header>

      {/* Safe area spacer */}
      <div className={`md:hidden ${isHome ? 'h-[108px]' : 'h-14'}`} style={{ height: isHome ? 'calc(108px + env(safe-area-inset-top))' : 'calc(56px + env(safe-area-inset-top))' }} />

      {/* Search overlay */}
      {searchOpen && <MobileSearch />}
      {searchOpen && <div onClick={() => setSearchOpen(false)} />}
    </>
  )
}
