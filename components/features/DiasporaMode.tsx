'use client'
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

type Currency = { code: string; symbol: string; flag: string; name: string; rate: number }

const CURRENCIES: Currency[] = [
  { code:'NGN', symbol:'₦',  flag:'🇳🇬', name:'Nigerian Naira',   rate: 1 },
  { code:'USD', symbol:'$',  flag:'🇺🇸', name:'US Dollar',        rate: 0.00063 },
  { code:'GBP', symbol:'£',  flag:'🇬🇧', name:'British Pound',    rate: 0.00050 },
  { code:'EUR', symbol:'€',  flag:'🇪🇺', name:'Euro',             rate: 0.00059 },
  { code:'CAD', symbol:'C$', flag:'🇨🇦', name:'Canadian Dollar',  rate: 0.00086 },
  { code:'AUD', symbol:'A$', flag:'🇦🇺', name:'Australian Dollar',rate: 0.00098 },
]

type DiasporaCtx = {
  currency: Currency
  setCurrency: (c: Currency) => void
  convert: (naira: number) => string
  diasporaMode: boolean
}

const DiasporaContext = createContext<DiasporaCtx>({
  currency: CURRENCIES[0],
  setCurrency: () => {},
  convert: (n) => `₦${n.toLocaleString()}`,
  diasporaMode: false,
})

export function DiasporaProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState(CURRENCIES[0])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('naya_currency')
      if (saved) {
        const c = CURRENCIES.find(c => c.code === saved)
        if (c) setCurrencyState(c)
      }
    } catch {}
  }, [])

  const setCurrency = (c: Currency) => {
    setCurrencyState(c)
    try { localStorage.setItem('naya_currency', c.code) } catch {}
  }

  const convert = (naira: number): string => {
    const val = naira * currency.rate
    if (currency.code === 'NGN') {
      if (naira >= 1_000_000) return `₦${(naira/1_000_000).toFixed(1)}M`
      if (naira >= 1_000)     return `₦${(naira/1_000).toFixed(0)}K`
      return `₦${naira.toLocaleString()}`
    }
    if (val >= 1_000_000) return `${currency.symbol}${(val/1_000_000).toFixed(2)}M`
    if (val >= 1_000)     return `${currency.symbol}${(val/1_000).toFixed(1)}K`
    return `${currency.symbol}${val.toFixed(0)}`
  }

  return (
    <DiasporaContext.Provider value={{ currency, setCurrency, convert, diasporaMode: currency.code !== 'NGN' }}>
      {children}
    </DiasporaContext.Provider>
  )
}

export const useDiaspora = () => useContext(DiasporaContext)

// ── Currency Switcher ─────────────────────────────────────────
export function CurrencySwitcher({ dark = false }: { dark?: boolean }) {
  const { currency, setCurrency } = useDiaspora()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(prev => !prev) }}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
          dark
            ? 'border-white/20 text-white hover:bg-white/10 bg-white/5'
            : 'border-surface-border text-obsidian-700 hover:border-gold-400 bg-white'
        } ${currency.code !== 'NGN' ? 'border-blue-400 bg-blue-500/10' : ''}`}>
        <span className="text-base leading-none">{currency.flag}</span>
        <span className="font-semibold text-xs">{currency.code}</span>
        <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-52 bg-white border border-surface-border rounded-2xl shadow-2xl z-[200] overflow-hidden"
          onClick={e => e.stopPropagation()}>
          <div className="px-4 py-2.5 border-b border-surface-border bg-surface-subtle">
            <p className="text-[10px] font-bold text-obsidian-500 uppercase tracking-wider">Display Currency</p>
          </div>
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              onClick={(e) => { e.stopPropagation(); setCurrency(c); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-subtle ${
                currency.code === c.code ? 'bg-gold-50' : ''
              }`}>
              <span className="text-xl leading-none">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-obsidian-900">{c.code} <span className="text-obsidian-400 font-normal">{c.symbol}</span></p>
                <p className="text-xs text-obsidian-400 truncate">{c.name}</p>
              </div>
              {currency.code === c.code && (
                <div className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0" />
              )}
            </button>
          ))}
          <div className="px-4 py-2 border-t border-surface-border bg-surface-subtle">
            <p className="text-[10px] text-obsidian-400">Approximate rates. Updated daily.</p>
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
    <div className="bg-blue-600 text-white py-2.5 px-4 text-center text-sm flex items-center justify-center gap-3 flex-wrap relative">
      <Globe className="w-4 h-4 flex-shrink-0" />
      <span className="text-white/90">🌍 Viewing from abroad? See prices in your currency.</span>
      <div className="flex items-center gap-2">
        {['USD','GBP','EUR'].map(code => {
          const c = CURRENCIES.find(x => x.code === code)!
          return (
            <button key={code} onClick={() => setCurrency(c)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition-colors">
              {c.flag} {code}
            </button>
          )
        })}
      </div>
      <button onClick={() => setDismissed(true)}
        className="absolute right-4 text-white/60 hover:text-white text-lg leading-none">×</button>
    </div>
  )
}

// ── Price Display ─────────────────────────────────────────────
export function PriceDisplay({ naira, period, size = 'md' }: { naira: number; period?: string; size?: 'sm'|'md'|'lg' }) {
  const { convert, currency } = useDiaspora()
  const periodMap: Record<string,string> = { YEARLY:'/yr', MONTHLY:'/mo', PER_NIGHT:'/night', TOTAL:'' }
  const periodStr = period ? (periodMap[period] || '') : ''
  const sizes = { sm:'text-base', md:'text-xl', lg:'text-3xl' }

  return (
    <div>
      <span className={`font-display font-semibold text-obsidian-900 ${sizes[size]}`}>
        {convert(naira)}
      </span>
      {periodStr && <span className="text-obsidian-400 text-sm">{periodStr}</span>}
      {currency.code !== 'NGN' && (
        <div className="text-[10px] text-obsidian-400 mt-0.5">
          {naira >= 1_000_000 ? `₦${(naira/1_000_000).toFixed(1)}M` : `₦${(naira/1_000).toFixed(0)}K`} NGN
        </div>
      )}
    </div>
  )
}
