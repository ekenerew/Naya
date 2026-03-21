'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Search, Menu, X, ChevronDown, Heart, LogIn,
  LogOut, User, LayoutDashboard, Plus, Bell, Settings
} from 'lucide-react'

const navItems = [
  { label: 'Buy',        href: '/buy' },
  { label: 'Rent',       href: '/rent' },
  { label: 'Shortlet',   href: '/shortlet' },
  { label: 'Commercial', href: '/commercial' },
  { label: 'Agents',     href: '/agents' },
  {
    label: 'More',
    children: [
      { label: 'New Developments',    href: '/new-developments' },
      { label: 'Neighborhoods',       href: '/neighborhoods' },
      { label: 'Market Trends',       href: '/market-trends' },
      { label: 'Blog',                href: '/blog' },
      { label: 'Mortgage Calculator', href: '/tools/mortgage-calculator' },
      { label: 'Property Valuation',  href: '/tools/valuation' },
    ]
  }
]

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  accountType: string
  avatarUrl?: string
  agentProfile?: any
}

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [moreOpen, setMoreOpen]       = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser]               = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Fetch current user
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success) setUser(data.data)
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false))
  }, [])

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const isAgent = user?.accountType === 'AGENT' || user?.accountType === 'LANDLORD'
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : ''

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${
        scrolled
          ? 'bg-obsidian-900/95 backdrop-blur-xl shadow-2xl border-b border-white/5'
          : 'bg-obsidian-900'
      }`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image src="/naya-logo.png" alt="Naya" width={90} height={45} className="h-10 w-auto object-contain" priority />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setMoreOpen(!moreOpen)}
                      onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                      className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {moreOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl py-2">
                        {item.children.map(child => (
                          <Link key={child.href} href={child.href}
                            className="flex items-center px-4 py-2.5 text-sm text-white/60 hover:text-gold-400 hover:bg-white/5 transition-all mx-1 rounded-xl">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={item.href} href={item.href!}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/8 transition-all">
                <Search className="w-4 h-4" />
              </button>

              {!loadingUser && (
                <>
                  {user ? (
                    <>
                      {/* Saved */}
                      <Link href="/dashboard/saved"
                        className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/8 transition-all">
                        <Heart className="w-4 h-4" />
                      </Link>

                      {/* List property button for agents */}
                      {isAgent && (
                        <Link href="/portal/list"
                          className="hidden md:flex btn-primary btn-sm whitespace-nowrap gap-1">
                          <Plus className="w-3.5 h-3.5" />List Property
                        </Link>
                      )}

                      {/* User menu */}
                      <div className="relative" ref={userMenuRef}>
                        <button
                          onClick={() => setUserMenuOpen(!userMenuOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-all border border-white/10">
                          {/* Avatar */}
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.firstName}
                              className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-obsidian-900 text-xs font-bold">
                              {initials}
                            </div>
                          )}
                          <span className="hidden md:block text-sm font-medium text-white max-w-[100px] truncate">
                            {user.firstName}
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        {userMenuOpen && (
                          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-surface-border rounded-2xl shadow-xl py-2 z-50">
                            {/* User info */}
                            <div className="px-4 py-3 border-b border-surface-border">
                              <p className="font-semibold text-obsidian-900 text-sm">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-obsidian-400 truncate">{user.email}</p>
                              <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isAgent
                                  ? 'bg-gold-100 text-gold-700'
                                  : 'bg-obsidian-100 text-obsidian-600'
                              }`}>
                                {user.accountType.toLowerCase()}
                              </span>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                              {isAgent && (
                                <>
                                  <Link href="/portal/dashboard" onClick={() => setUserMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-obsidian-700 hover:bg-surface-subtle transition-all">
                                    <LayoutDashboard className="w-4 h-4 text-obsidian-400" />Dashboard
                                  </Link>
                                  <Link href="/portal/list" onClick={() => setUserMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-obsidian-700 hover:bg-surface-subtle transition-all">
                                    <Plus className="w-4 h-4 text-obsidian-400" />List a Property
                                  </Link>
                                </>
                              )}
                              <Link href="/dashboard/saved" onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-obsidian-700 hover:bg-surface-subtle transition-all">
                                <Heart className="w-4 h-4 text-obsidian-400" />Saved Properties
                              </Link>
                              <Link href="/search" onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-obsidian-700 hover:bg-surface-subtle transition-all">
                                <Search className="w-4 h-4 text-obsidian-400" />Browse Properties
                              </Link>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-surface-border py-1 mt-1">
                              <button onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-all w-full text-left">
                                <LogOut className="w-4 h-4" />Sign Out
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Not logged in */}
                      <Link href="/portal"
                        className="hidden md:flex btn-primary btn-sm whitespace-nowrap">
                        List Property
                      </Link>
                      <Link href="/login"
                        className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white transition-all">
                        <LogIn className="w-4 h-4" />Sign In
                      </Link>
                    </>
                  )}
                </>
              )}

              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/60 hover:text-white hover:bg-white/8 transition-all">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-obsidian-900">
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

              {/* Mobile auth section */}
              <div className="pt-4 pb-2 border-t border-white/10 mt-2">
                {user ? (
                  <>
                    <div className="px-4 py-3 flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-obsidian-900 font-bold">
                        {initials}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{user.firstName} {user.lastName}</p>
                        <p className="text-white/40 text-xs">{user.email}</p>
                      </div>
                    </div>
                    {isAgent && (
                      <Link href="/portal/dashboard" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl">
                        <LayoutDashboard className="w-4 h-4" />Dashboard
                      </Link>
                    )}
                    <Link href="/portal/list" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl">
                      <Plus className="w-4 h-4" />List a Property
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-white/5 rounded-xl w-full text-left">
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/portal" onClick={() => setMobileOpen(false)} className="btn-primary justify-center">
                      List Your Property
                    </Link>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-ghost text-white/70 border-white/20 justify-center">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[300] bg-obsidian-900/95 backdrop-blur-xl flex items-start justify-center pt-24 px-4">
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
                <Link key={n} href={`/search?area=${n.toLowerCase().replace(/ /g,'-')}`}
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-3 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                  📍 {n}
                </Link>
              ))}
            </div>
            <button onClick={() => setSearchOpen(false)} className="mt-6 text-sm text-white/30 hover:text-white/60">
              Press ESC or tap to close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
