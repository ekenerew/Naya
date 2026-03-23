'use client'
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
type Currency = { code: string; symbol: string; flag: string; name: string; rate: number }
type DiasporaCtx = {
  currency: Currency
  setCurrency: (c: Currency) => void
  convert: (naira: number) => string
  diasporaMode: boolean
}

// ── Data ──────────────────────────────────────────────────────
export const CURRENCIES: Currency[] = [
  { code:'NGN', symbol:'₦',  flag:'🇳🇬', name:'Nigerian Naira',    rate: 1        },
  { code:'USD', symbol:'$',  flag:'🇺🇸', name:'US Dollar',         rate: 0.00063  },
  { code:'GBP', symbol:'£',  flag:'🇬🇧', name:'British Pound',     rate: 0.00050  },
  { code:'EUR', symbol:'€',  flag:'🇪🇺', name:'Euro',              rate: 0.00059  },
  { code:'CAD', symbol:'C$', flag:'🇨🇦', name:'Canadian Dollar',   rate: 0.00086  },
  { code:'AUD', symbol:'A$', flag:'🇦🇺', name:'Australian Dollar', rate: 0.00098  },
]

// ── Context ───────────────────────────────────────────────────
const Ctx = createContext<DiasporaCtx>({
  currency: CURRENCIES[0],
  setCurrency: () => {},
  convert: (n) => `₦${n.toLocaleString()}`,
  diasporaMode: false,
})

export function DiasporaProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('naya_currency')
      const match = CURRENCIES.find(c => c.code === saved)
      if (match) setCurrencyState(match)
    } catch {}
  }, [])

  const setCurrency = (c: Currency) => {
    setCurrencyState(c)
    try { localStorage.setItem('naya_currency', c.code) } catch {}
  }

  const convert = (naira: number): string => {
    const val = naira * currency.rate
    if (currency.code === 'NGN') {
      if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`
      if (naira >= 1_000)     return `₦${(naira / 1_000).toFixed(0)}K`
      return `₦${naira.toLocaleString()}`
    }
    if (val >= 1_000_000) return `${currency.symbol}${(val / 1_000_000).toFixed(2)}M`
    if (val >= 1_000)     return `${currency.symbol}${(val / 1_000).toFixed(1)}K`
    return `${currency.symbol}${val.toFixed(0)}`
  }

  return (
    <Ctx.Provider value={{ currency, setCurrency, convert, diasporaMode: currency.code !== 'NGN' }}>
      {children}
    </Ctx.Provider>
  )
}

export const useDiaspora = () => useContext(Ctx)

// ── Currency Switcher ─────────────────────────────────────────
export function CurrencySwitcher({ dark = false }: { dark?: boolean }) {
  const { currency, setCurrency } = useDiaspora()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      // Use capture phase so it fires before anything else
      document.addEventListener('click', onOutside, true)
      return () => document.removeEventListener('click', onOutside, true)
    }
  }, [open])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(prev => !prev)
  }

  const handleSelect = (e: React.MouseEvent, c: Currency) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrency(c)
    setOpen(false)
  }

  const isForeign = currency.code !== 'NGN'

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '24px',
          border: `1.5px solid ${isForeign ? '#60a5fa' : dark ? 'rgba(255,255,255,0.2)' : '#E8E3D8'}`,
          background: isForeign ? 'rgba(96,165,250,0.12)' : dark ? 'rgba(255,255,255,0.07)' : '#FFFFFF',
          color: dark ? '#FFFFFF' : '#0A0A0B',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          userSelect: 'none',
          outline: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: '16px', lineHeight: 1 }}>{currency.flag}</span>
        <span>{currency.code}</span>
        <span style={{
          display: 'inline-block',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          opacity: 0.6,
          fontSize: '10px',
        }}>▼</span>
      </button>

      {/* Dropdown — rendered with inline styles so Tailwind purging can't affect it */}
      {open && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '220px',
            background: '#FFFFFF',
            border: '1px solid #E8E3D8',
            borderRadius: '20px',
            boxShadow: '0 16px 48px rgba(10,10,11,0.18), 0 4px 12px rgba(10,10,11,0.08)',
            zIndex: 99999,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '10px 16px',
            background: '#F5F3EE',
            borderBottom: '1px solid #E8E3D8',
          }}>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Display Currency
            </p>
          </div>

          {/* Options */}
          {CURRENCIES.map(c => {
            const isSelected = currency.code === c.code
            return (
              <button
                key={c.code}
                type="button"
                onClick={(e) => handleSelect(e, c)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  background: isSelected ? '#FDF8EC' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderBottom: '1px solid #F5F3EE',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = '#F5F3EE' }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0A0A0B' }}>
                    {c.code} <span style={{ color: '#6B6B6B', fontWeight: 400 }}>{c.symbol}</span>
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#9A9A9A', marginTop: '1px' }}>{c.name}</p>
                </div>
                {isSelected && (
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: '#C8A84B', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0
                  }}>
                    <span style={{ color: '#0A0A0B', fontSize: '10px', fontWeight: 900 }}>✓</span>
                  </div>
                )}
              </button>
            )
          })}

          {/* Footer */}
          <div style={{
            padding: '8px 16px',
            background: '#F5F3EE',
            borderTop: '1px solid #E8E3D8',
          }}>
            <p style={{ margin: 0, fontSize: '10px', color: '#9A9A9A' }}>
              Approximate rates · Updated daily
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Diaspora Banner ───────────────────────────────────────────
export function DiasporaBanner() {
  const { diasporaMode, setCurrency } = useDiaspora()
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || diasporaMode || dismissed) return null

  return (
    <div style={{
      background: 'linear-gradient(90deg, #1d4ed8, #2563eb)',
      color: '#fff',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      position: 'relative',
      fontSize: '13px',
    }}>
      <Globe style={{ width: 16, height: 16, flexShrink: 0 }} />
      <span>🌍 Viewing from abroad? See prices in your currency.</span>
      <div style={{ display: 'flex', gap: '8px' }}>
        {['USD', 'GBP', 'EUR'].map(code => {
          const c = CURRENCIES.find(x => x.code === code)!
          return (
            <button key={code} onClick={() => setCurrency(c)}
              style={{
                padding: '3px 10px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              }}>
              {c.flag} {code}
            </button>
          )
        })}
      </div>
      <button onClick={() => setDismissed(true)}
        style={{
          position: 'absolute', right: '16px',
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.7)', fontSize: '20px',
          cursor: 'pointer', lineHeight: 1, padding: '0 4px',
        }}>×</button>
    </div>
  )
}

// ── Price Display ─────────────────────────────────────────────
export function PriceDisplay({
  naira, period, size = 'md',
}: {
  naira: number; period?: string; size?: 'sm' | 'md' | 'lg'
}) {
  const { convert, currency } = useDiaspora()
  const periodMap: Record<string, string> = {
    YEARLY: '/yr', MONTHLY: '/mo', PER_NIGHT: '/night', TOTAL: '',
  }
  const sizeMap = { sm: '1rem', md: '1.25rem', lg: '1.875rem' }

  return (
    <div>
      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: sizeMap[size], fontWeight: 600, color: '#0A0A0B' }}>
        {convert(naira)}
      </span>
      {period && periodMap[period] && (
        <span style={{ color: '#6B6B6B', fontSize: '0.875rem' }}>{periodMap[period]}</span>
      )}
      {currency.code !== 'NGN' && (
        <div style={{ fontSize: '10px', color: '#9A9A9A', marginTop: '2px' }}>
          ≈ {naira >= 1_000_000 ? `₦${(naira / 1_000_000).toFixed(1)}M` : `₦${(naira / 1_000).toFixed(0)}K`} NGN
        </div>
      )}
    </div>
  )
}
