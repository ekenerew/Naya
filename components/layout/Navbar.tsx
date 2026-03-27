'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import NotificationBell from '@/components/notifications/NotificationBell'
import { CurrencySwitcher } from '@/components/features/DiasporaMode'
import {
  Search, Menu, X, ChevronDown, Heart,
  LogIn, LogOut, LayoutDashboard, Plus, Home, Settings
} from 'lucide-react'

const navLinks = [
  { label: 'Buy',        href: '/buy' },
  { label: 'Rent',       href: '/rent' },
  { label: 'Shortlet',   href: '/shortlet' },
  { label: 'Commercial', href: '/commercial' },
  { label: 'Agents',     href: '/agents' },
  { label: 'Discover',   href: '/discover' },
  { label: '🗺 Map',      href: '/map' },
]

const moreLinks = [
  { label: 'New Developments',       href: '/new-developments' },
  { label: 'Neighbourhoods',         href: '/neighborhoods' },
  { label: 'Market Trends & AI',     href: '/market-trends' },
  { label: 'Blog',                   href: '/blog' },
  { label: 'Mortgage Calculator',    href: '/tools/mortgage-calculator' },
  { label: 'Property Valuation',     href: '/tools/valuation' },
  { label: 'Rent-to-Own Calculator', href: '/tools/rent-to-own' },
  { label: 'Agent League',           href: '/agent-league' },
]

type AuthUser = {
  id: string; firstName: string; lastName: string
  email: string; accountType: string; avatarUrl?: string
}

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userOpen, setUserOpen]     = useState(false)
  const [user, setUser]             = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const moreRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // Auth
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.success) setUser(d.data) })
      .catch(() => {})
      .finally(() => setAuthLoading(false))
  }, [])

  // Scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setUserOpen(false)
    router.push('/')
    router.refresh()
  }

  const isAgent = user?.accountType === 'AGENT' || user?.accountType === 'LANDLORD'
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : ''

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'bg-obsidian-900/95 backdrop-blur-xl shadow-lg border-b border-white/5' : 'bg-obsidian-900'
      }`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16 md:h-[68px] gap-4">

            {/* ── Logo ─────────────────────────────────── */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/naya-logo.png" alt="Naya" width={160} height={64}
                className="h-12 w-auto object-contain" priority />
            </Link>

            {/* ── Desktop Nav ──────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href}
                  className="px-3.5 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all whitespace-nowrap">
                  {l.label}
                </Link>
              ))}
              {/* More dropdown */}
              <div className="relative" ref={moreRef}>
                <button onClick={() => setMoreOpen(p => !p)}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
                  More <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                {moreOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-60 rounded-2xl overflow-hidden"
                    style={{ background:'#0A0A0B', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 20px 60px rgba(0,0,0,0.5)', zIndex:9999 }}>
                    {moreLinks.map(l => (
                      <Link key={l.href} href={l.href} onClick={() => setMoreOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-white/60 hover:text-gold-400 hover:bg-white/5 transition-all">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* ── Right Actions ────────────────────────── */}
            <div className="flex items-center gap-1.5 flex-shrink-0">

              {/* Search */}
              <button onClick={() => setSearchOpen(true)}
                className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/8 transition-all">
                <Search className="w-4 h-4" />
              </button>

              {/* Currency — ALWAYS VISIBLE */}
              <div className="hidden md:block">
                <CurrencySwitcher dark />
              </div>

              {/* Auth section */}
              {!authLoading && (
                <>
                  {user ? (
                    <>
                      {/* Notifications */}
                      <NotificationBell />

                      {/* List Property (agents only) */}
                      {isAgent && (
                        <Link href="/portal/list"
                          className="hidden md:flex btn-primary btn-sm gap-1 whitespace-nowrap">
                          <Plus className="w-3.5 h-3.5" />List
                        </Link>
                      )}

                      {/* User menu */}
                      <div className="relative" ref={userRef}>
                        <button onClick={() => setUserOpen(p => !p)}
                          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 transition-all">
                          {user.avatarUrl
                            ? <img src={user.avatarUrl} className="w-7 h-7 rounded-full object-cover" alt="" />
                            : <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-obsidian-900 text-xs font-bold">{initials}</div>
                          }
                          <span className="hidden md:block text-sm font-medium text-white max-w-[80px] truncate">{user.firstName}</span>
                          <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {userOpen && (
                          <div className="absolute top-[calc(100%+8px)] right-0 w-64 rounded-2xl overflow-hidden py-1"
                            style={{ background:'#fff', border:'1px solid #E8E3D8', boxShadow:'0 16px 48px rgba(10,10,11,0.16)', zIndex:9999 }}>
                            {/* Profile info */}
                            <div className="px-4 py-3 border-b border-surface-border">
                              <p className="font-semibold text-obsidian-900 text-sm truncate">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-obsidian-400 truncate mt-0.5">{user.email}</p>
                              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isAgent ? 'bg-gold-100 text-gold-700' : 'bg-obsidian-100 text-obsidian-600'}`}>
                                {user.accountType.toLowerCase()}
                              </span>
                            </div>
                            {/* Links */}
                            <div className="py-1">
                              {isAgent && (
                                <Link href="/portal/dashboard" onClick={() => setUserOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-obsidian-700 hover:bg-surface-subtle">
                                  <LayoutDashboard className="w-4 h-4 text-obsidian-400" />Dashboard
                                </Link>
                              )}
                              <Link href="/dashboard/saved" onClick={() => setUserOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-obsidian-700 hover:bg-surface-subtle">
                                <Heart className="w-4 h-4 text-obsidian-400" />Saved Properties
                              </Link>
                              <Link href="/portal/profile" onClick={() => setUserOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-obsidian-700 hover:bg-surface-subtle">
                                <Settings className="w-4 h-4 text-obsidian-400" />Profile & Verification
                              </Link>
                            </div>
                            {/* Logout */}
                            <div className="border-t border-surface-border pt-1">
                              <button onClick={logout}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 w-full text-left">
                                <LogOut className="w-4 h-4" />Sign Out
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List Property */}
                      <Link href="/portal"
                        className="hidden md:flex btn-primary btn-sm whitespace-nowrap">
                        List Property
                      </Link>
                      {/* Sign In */}
                      <Link href="/login"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-all whitespace-nowrap">
                        <LogIn className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Sign In</span>
                      </Link>
                    </>
                  )}
                </>
              )}

              {/* Mobile menu */}
              <button onClick={() => setMobileOpen(p => !p)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/8 transition-all">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden bg-obsidian-900 border-t border-white/10">
            <div className="page-container py-4 space-y-0.5">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl">
                  {l.label}
                </Link>
              ))}
              <div className="px-4 py-2 text-[10px] font-bold text-gold-500 uppercase tracking-widest mt-2">More</div>
              {moreLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-xl">
                  {l.label}
                </Link>
              ))}

              {/* Mobile currency */}
              <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-white/10">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Currency</span>
                <CurrencySwitcher dark />
              </div>

              {/* Mobile auth */}
              <div className="pt-2 border-t border-white/10">
                {user ? (
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center font-bold text-obsidian-900">{initials}</div>
                      <div>
                        <p className="text-white text-sm font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-white/40 text-xs">{user.email}</p>
                      </div>
                    </div>
                    {isAgent && (
                      <Link href="/portal/dashboard" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl">
                        <LayoutDashboard className="w-4 h-4" />Dashboard
                      </Link>
                    )}
                    <Link href="/portal/list" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl">
                      <Plus className="w-4 h-4" />List a Property
                    </Link>
                    <button onClick={logout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-white/5 rounded-xl w-full">
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-2">
                    <Link href="/portal" onClick={() => setMobileOpen(false)} className="btn-primary justify-center">List Your Property</Link>
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all">
                      <LogIn className="w-4 h-4" />Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Search Overlay ───────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 bg-obsidian-900/95 backdrop-blur-xl flex items-start justify-center pt-24 px-4"
          style={{ zIndex: 99999 }}>
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-3 bg-white/8 border border-white/15 rounded-2xl px-5 py-4">
              <Search className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <input autoFocus type="text"
                placeholder="Search properties, neighbourhoods, agents…"
                className="flex-1 bg-transparent text-white text-lg font-light placeholder:text-white/30 outline-none" />
              <button onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
              {['GRA Phase 2','Woji','Trans Amadi','Rumuola','Old GRA','Eleme'].map(n => (
                <Link key={n} href={`/search?area=${encodeURIComponent(n)}`}
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-3 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                  📍 {n}
                </Link>
              ))}
            </div>
            <button onClick={() => setSearchOpen(false)} className="mt-6 text-sm text-white/30 hover:text-white/60">
              Tap to close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
