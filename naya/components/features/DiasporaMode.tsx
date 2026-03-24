'use client'
import {
  createContext, useContext, useState,
  useEffect, useRef, useLayoutEffect, ReactNode
} from 'react'
import { Globe } from 'lucide-react'

type Currency = { code: string; symbol: string; flag: string; name: string; rate: number }
type Ctx = { currency: Currency; setCurrency: (c: Currency) => void; convert: (n: number) => string; diasporaMode: boolean }

export const CURRENCIES: Currency[] = [
  { code:'NGN', symbol:'₦',  flag:'🇳🇬', name:'Nigerian Naira',    rate:1       },
  { code:'USD', symbol:'$',  flag:'🇺🇸', name:'US Dollar',         rate:0.00063 },
  { code:'GBP', symbol:'£',  flag:'🇬🇧', name:'British Pound',     rate:0.00050 },
  { code:'EUR', symbol:'€',  flag:'🇪🇺', name:'Euro',              rate:0.00059 },
  { code:'CAD', symbol:'C$', flag:'🇨🇦', name:'Canadian Dollar',   rate:0.00086 },
  { code:'AUD', symbol:'A$', flag:'🇦🇺', name:'Australian Dollar', rate:0.00098 },
]

const DiasporaCtx = createContext<Ctx>({
  currency: CURRENCIES[0], setCurrency: ()=>{},
  convert: (n)=>`₦${n.toLocaleString()}`, diasporaMode: false,
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

  const convert = (naira: number) => {
    const v = naira * currency.rate
    if (currency.code === 'NGN') {
      if (naira >= 1e6) return `₦${(naira/1e6).toFixed(1)}M`
      if (naira >= 1e3) return `₦${(naira/1e3).toFixed(0)}K`
      return `₦${naira.toLocaleString()}`
    }
    if (v >= 1e6) return `${currency.symbol}${(v/1e6).toFixed(2)}M`
    if (v >= 1e3) return `${currency.symbol}${(v/1e3).toFixed(1)}K`
    return `${currency.symbol}${v.toFixed(0)}`
  }

  return (
    <DiasporaCtx.Provider value={{ currency, setCurrency, convert, diasporaMode: currency.code !== 'NGN' }}>
      {children}
    </DiasporaCtx.Provider>
  )
}

export const useDiaspora = () => useContext(DiasporaCtx)

// ── Currency Switcher ─────────────────────────────────────────
// Uses a fixed-position dropdown to escape any stacking context
export function CurrencySwitcher({ dark = false }: { dark?: boolean }) {
  const { currency, setCurrency } = useDiaspora()
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const isForeign = currency.code !== 'NGN'

  // Calculate fixed position of dropdown relative to button
  const openDropdown = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
    }
    setOpen(true)
  }

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener('mousedown', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('mousedown', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  const handleBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (open) setOpen(false)
    else openDropdown()
  }

  const handleSelect = (e: React.MouseEvent, c: Currency) => {
    e.stopPropagation()
    setCurrency(c)
    setOpen(false)
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleBtnClick}
        className={`
          flex items-center gap-1.5 h-8 px-3 rounded-full
          text-xs font-semibold transition-all duration-200
          select-none outline-none cursor-pointer
          ${dark
            ? `border border-white/20 text-white ${isForeign ? 'bg-blue-500/20 border-blue-400/50' : 'bg-white/8 hover:bg-white/15'}`
            : `border border-surface-border text-obsidian-700 bg-white ${isForeign ? 'border-blue-400 bg-blue-50' : 'hover:border-gold-400'}`
          }
        `}
      >
        <span className="text-base leading-none">{currency.flag}</span>
        <span className="tracking-wide">{currency.code}</span>
        <svg
          className={`w-3 h-3 opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Fixed dropdown — escapes all stacking contexts */}
      {open && (
        <>
          {/* Invisible backdrop to catch outside clicks */}
          <div
            onClick={() => setOpen(false)}
            style={{ position:'fixed', inset:0, zIndex:99998 }}
          />
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: dropPos.top,
              right: dropPos.right,
              width: 228,
              zIndex: 99999,
              background: '#FFFFFF',
              border: '1px solid #E8E3D8',
              borderRadius: 20,
              boxShadow: '0 20px 60px rgba(10,10,11,0.2), 0 4px 12px rgba(10,10,11,0.08)',
              overflow: 'hidden',
              animation: 'fadeDropdown 0.15s ease',
            }}
          >
            {/* Header */}
            <div style={{ padding:'10px 16px', background:'#F5F3EE', borderBottom:'1px solid #E8E3D8' }}>
              <p style={{ margin:0, fontSize:10, fontWeight:700, color:'#6B6B6B', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Display Currency
              </p>
            </div>

            {/* Currency options */}
            {CURRENCIES.map(c => {
              const selected = currency.code === c.code
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={e => handleSelect(e, c)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '9px 16px',
                    background: selected ? '#FDF8EC' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #F5F3EE',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!selected) (e.currentTarget).style.background = '#F5F3EE' }}
                  onMouseLeave={e => { if (!selected) (e.currentTarget).style.background = 'transparent' }}
                >
                  <span style={{ fontSize:22, lineHeight:1, flexShrink:0 }}>{c.flag}</span>
                  <span style={{ flex:1, minWidth:0 }}>
                    <span style={{ display:'block', fontSize:14, fontWeight:600, color:'#0A0A0B', fontFamily:'Outfit,sans-serif' }}>
                      {c.code} <span style={{ color:'#9A9A9A', fontWeight:400 }}>{c.symbol}</span>
                    </span>
                    <span style={{ display:'block', fontSize:11, color:'#9A9A9A', marginTop:1 }}>{c.name}</span>
                  </span>
                  {selected && (
                    <span style={{
                      width:20, height:20, borderRadius:'50%',
                      background:'linear-gradient(135deg,#C8A84B,#F0D9A0)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      flexShrink:0, fontSize:11, color:'#0A0A0B', fontWeight:900
                    }}>✓</span>
                  )}
                </button>
              )
            })}

            {/* Footer */}
            <div style={{ padding:'8px 16px', background:'#F5F3EE', borderTop:'1px solid #E8E3D8' }}>
              <p style={{ margin:0, fontSize:10, color:'#9A9A9A' }}>Approximate rates · Updated daily</p>
            </div>
          </div>
        </>
      )}
    </>
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
    <div className="relative flex items-center justify-center gap-3 flex-wrap py-2.5 px-4 text-sm text-white"
      style={{ background:'linear-gradient(90deg,#1d4ed8,#2563eb)' }}>
      <Globe className="w-4 h-4 flex-shrink-0" />
      <span>🌍 Viewing from abroad? See prices in your currency.</span>
      <div className="flex gap-2">
        {['USD','GBP','EUR'].map(code => {
          const c = CURRENCIES.find(x => x.code === code)!
          return (
            <button key={code} onClick={() => setCurrency(c)}
              className="px-3 py-0.5 rounded-full text-xs font-bold transition-colors"
              style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)' }}>
              {c.flag} {code}
            </button>
          )
        })}
      </div>
      <button onClick={() => setDismissed(true)}
        className="absolute right-4 text-white/60 hover:text-white text-xl leading-none">×</button>
    </div>
  )
}

// ── Price Display ─────────────────────────────────────────────
export function PriceDisplay({ naira, period, size='md' }: { naira:number; period?:string; size?:'sm'|'md'|'lg' }) {
  const { convert, currency } = useDiaspora()
  const pm: Record<string,string> = { YEARLY:'/yr', MONTHLY:'/mo', PER_NIGHT:'/night', TOTAL:'' }
  const sizes = { sm:'text-lg', md:'text-xl', lg:'text-3xl' }

  return (
    <div>
      <span className={`font-display font-semibold text-obsidian-900 ${sizes[size]}`}>{convert(naira)}</span>
      {period && pm[period] && <span className="text-obsidian-400 text-sm">{pm[period]}</span>}
      {currency.code !== 'NGN' && (
        <div className="text-[10px] text-obsidian-400 mt-0.5">
          ≈ {naira >= 1e6 ? `₦${(naira/1e6).toFixed(1)}M` : `₦${(naira/1e3).toFixed(0)}K`} NGN
        </div>
      )}
    </div>
  )
}
