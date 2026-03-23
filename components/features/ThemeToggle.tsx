'use client'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ position = 'fixed' }: { position?: 'fixed' | 'inline' }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('naya_theme')
      const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      const dark = saved === 'dark' || (!saved && preferred)
      setIsDark(dark)
      applyTheme(dark)
    } catch {}
  }, [])

  function applyTheme(dark: boolean) {
    const root = document.documentElement
    if (dark) {
      root.style.setProperty('--bg-primary', '#0A0A0B')
      root.style.setProperty('--bg-card', '#141414')
      root.style.setProperty('--bg-subtle', '#1A1A1A')
      root.style.setProperty('--border', '#252525')
      root.style.setProperty('--text-primary', '#FAFAF8')
      root.style.setProperty('--text-secondary', '#9A9A9A')
      root.style.setProperty('--text-muted', '#6B6B6B')
      root.classList.add('dark-mode')
    } else {
      root.style.setProperty('--bg-primary', '#FAFAF8')
      root.style.setProperty('--bg-card', '#FFFFFF')
      root.style.setProperty('--bg-subtle', '#F5F3EE')
      root.style.setProperty('--border', '#E8E3D8')
      root.style.setProperty('--text-primary', '#0A0A0B')
      root.style.setProperty('--text-secondary', '#6B6B6B')
      root.style.setProperty('--text-muted', '#9A9A9A')
      root.classList.remove('dark-mode')
    }
  }

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    applyTheme(next)
    try { localStorage.setItem('naya_theme', next ? 'dark' : 'light') } catch {}
  }

  if (!mounted) return null

  if (position === 'inline') return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '24px',
        border: '1.5px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.08)',
        color: '#FFFFFF',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        backdropFilter: 'blur(8px)',
      }}
    >
      {isDark
        ? <><Sun style={{ width: 16, height: 16, color: '#C8A84B' }} />Light Mode</>
        : <><Moon style={{ width: 16, height: 16 }} />Dark Mode</>
      }
    </button>
  )

  // Fixed floating toggle
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: `2px solid ${isDark ? 'rgba(200,168,75,0.5)' : '#E8E3D8'}`,
        background: isDark ? '#1A1A1A' : '#FFFFFF',
        boxShadow: isDark
          ? '0 4px 24px rgba(200,168,75,0.2), 0 2px 8px rgba(0,0,0,0.4)'
          : '0 4px 24px rgba(10,10,11,0.12), 0 2px 8px rgba(10,10,11,0.06)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        outline: 'none',
      }}
      onMouseEnter={e => {
        const btn = e.currentTarget
        btn.style.transform = 'scale(1.1)'
        btn.style.boxShadow = isDark
          ? '0 8px 32px rgba(200,168,75,0.3), 0 4px 12px rgba(0,0,0,0.5)'
          : '0 8px 32px rgba(10,10,11,0.18), 0 4px 12px rgba(10,10,11,0.1)'
      }}
      onMouseLeave={e => {
        const btn = e.currentTarget
        btn.style.transform = 'scale(1)'
        btn.style.boxShadow = isDark
          ? '0 4px 24px rgba(200,168,75,0.2), 0 2px 8px rgba(0,0,0,0.4)'
          : '0 4px 24px rgba(10,10,11,0.12), 0 2px 8px rgba(10,10,11,0.06)'
      }}
    >
      {isDark
        ? <Sun style={{ width: 22, height: 22, color: '#C8A84B' }} />
        : <Moon style={{ width: 22, height: 22, color: '#0A0A0B' }} />
      }
    </button>
  )
}
