'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Home, MessageCircle, X, Search, List } from 'lucide-react'

export default function MobileFAB() {
  const [open, setOpen] = useState(false)

  const actions = [
    { icon: Home,           label: 'List Property',   href: '/portal/list',  color: 'bg-gold-500 text-obsidian-900' },
    { icon: Search,         label: 'Discover',         href: '/discover',     color: 'bg-blue-500 text-white' },
    { icon: MessageCircle,  label: 'Naya Managed',    href: '/managed',      color: 'bg-emerald-500 text-white' },
    { icon: List,           label: 'Browse All',      href: '/search',       color: 'bg-obsidian-700 text-white' },
  ]

  return (
    <div className="mobile-fab">
      {/* Action buttons */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setOpen(false)}
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter:'blur(4px)' }}
          />
          <div className="flex flex-col items-end gap-3 mb-3">
            {actions.map((a, i) => (
              <div key={i} className="flex items-center gap-3"
                style={{ animation: `slideUpFade 0.2s ease ${i * 0.05}s both` }}>
                <span className="px-3 py-1.5 bg-white rounded-full text-obsidian-900 text-xs font-bold shadow-lg whitespace-nowrap">
                  {a.label}
                </span>
                <Link href={a.href} onClick={() => setOpen(false)}
                  className={`w-12 h-12 rounded-full ${a.color} flex items-center justify-center shadow-xl`}>
                  <a.icon className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen(p => !p)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-obsidian-700 rotate-45' : 'bg-gold-500 hover:bg-gold-400'
        }`}
        style={{ boxShadow: '0 8px 32px rgba(200,168,75,0.4)' }}
      >
        <Plus className={`w-6 h-6 transition-transform duration-300 ${open ? 'text-white' : 'text-obsidian-900'}`} />
      </button>
    </div>
  )
}
