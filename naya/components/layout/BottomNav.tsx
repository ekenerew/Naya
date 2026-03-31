'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Search, Heart, MessageCircle, User,
  Plus, Map, Sparkles, Bell
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',         icon: Home,          label: 'Home'    },
  { href: '/search',   icon: Search,        label: 'Search'  },
  { href: '/map',      icon: Map,           label: 'Map'     },
  { href: '/alerts',   icon: Bell,          label: 'Alerts'  },
  { href: '/login',    icon: User,          label: 'Account' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const [lastY, setLastY]     = useState(0)

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setVisible(y < lastY || y < 80)
      setLastY(y)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [lastY])

  // Don't show on map page (it uses full screen)
  if (pathname === '/map') return null

  return (
    <>
      {/* Bottom nav spacer — prevents content hiding behind nav */}
      <div className="h-[72px] md:hidden" />

      {/* The nav itself */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-[300] md:hidden transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{
          background: 'rgba(10,10,11,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all active:scale-95"
                style={{ minWidth: 52 }}
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all ${active ? 'bg-gold-500' : 'bg-transparent'}`}>
                  <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-obsidian-900' : 'text-white/50'}`} />
                  {/* Notification dot for alerts */}
                  {item.label === 'Alerts' && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-obsidian-900" />
                  )}
                </div>
                <span className={`text-[9px] font-semibold tracking-wide transition-colors ${active ? 'text-gold-400' : 'text-white/30'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
