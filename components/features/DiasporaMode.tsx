'use client'
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'

type Currency = { code: string; symbol: string; flag: string; name: string; rate: number }
const CURRENCIES: Currency[] = [
  { code:'NGN', symbol:'₦',  flag:'🇳🇬', name:'Nigerian Naira',   rate:1 },
  { code:'USD', symbol:'$',  flag:'🇺🇸', name:'US Dollar',        rate:0.00063 },
  { code:'GBP', symbol:'£',  flag:'🇬🇧', name:'British Pound',    rate:0.00050 },
  { code:'EUR', symbol:'€',  flag:'🇪🇺', name:'Euro',             rate:0.00059 },
  { code:'CAD', symbol:'C$', flag:'🇨🇦', name:'Canadian Dollar',  rate:0.00086 },
  { code:'AUD', symbol:'A$', flag:'🇦🇺', name:'Australian Dollar',rate:0.00098 },
]
type Ctx = { currency:Currency; setCurrency:(c:Currency)=>void; convert:(n:number)=>string; diasporaMode:boolean }
const DiasporaContext = createContext<Ctx>({ currency:CURRENCIES[0], setCurrency:()=>{}, convert:(n)=>`₦${n.toLocaleString()}`, diasporaMode:false })
export function DiasporaProvider({ children }:{ children:ReactNode }) {
  const [currency, set] = useState(CURRENCIES[0])
  useEffect(()=>{ try { const s=localStorage.getItem('naya_cur'); if(s){const c=CURRENCIES.find(x=>x.code===s); if(c)set(c)} }catch{} },[])
  const setCurrency = (c:Currency) => { set(c); try{localStorage.setItem('naya_cur',c.code)}catch{} }
  const convert = (n:number):string => {
    const v=n*currency.rate
    if(currency.code==='NGN'){ if(n>=1e6)return `₦${(n/1e6).toFixed(1)}M`; if(n>=1000)return `₦${(n/1000).toFixed(0)}K`; return `₦${n.toLocaleString()}` }
    if(v>=1e6)return `${currency.symbol}${(v/1e6).toFixed(2)}M`; if(v>=1000)return `${currency.symbol}${(v/1000).toFixed(1)}K`; return `${currency.symbol}${v.toFixed(0)}`
  }
  return <DiasporaContext.Provider value={{ currency, setCurrency, convert, diasporaMode:currency.code!=='NGN' }}>{children}</DiasporaContext.Provider>
}
export const useDiaspora = () => useContext(DiasporaContext)
export function CurrencySwitcher({ dark=false }:{ dark?:boolean }) {
  const { currency, setCurrency } = useDiaspora()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const h=(e:MouseEvent)=>{ if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false) }
    document.addEventListener('mousedown',h); return()=>document.removeEventListener('mousedown',h)
  },[])
  return (
    <div className="relative" ref={ref}>
      <button onClick={e=>{e.stopPropagation();setOpen(p=>!p)}}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${dark?'border-white/20 text-white bg-white/5 hover:bg-white/10':'border-surface-border text-obsidian-700 bg-white hover:border-gold-400'} ${currency.code!=='NGN'?'border-blue-400':''}`}>
        <span>{currency.flag}</span>
        <span>{currency.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open?'rotate-180':''}`}/>
      </button>
      {open&&(
        <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-surface-border rounded-2xl shadow-2xl z-[999] overflow-hidden" onClick={e=>e.stopPropagation()}>
          <div className="px-3 py-2 bg-surface-subtle border-b border-surface-border">
            <p className="text-[10px] font-bold text-obsidian-500 uppercase tracking-wider">Display Currency</p>
          </div>
          {CURRENCIES.map(c=>(
            <button key={c.code} onClick={e=>{e.stopPropagation();setCurrency(c);setOpen(false)}}
              className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-subtle transition-colors ${currency.code===c.code?'bg-gold-50':''}`}>
              <span className="text-lg">{c.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-obsidian-900">{c.code} <span className="text-obsidian-400 font-normal">{c.symbol}</span></p>
                <p className="text-xs text-obsidian-400">{c.name}</p>
              </div>
              {currency.code===c.code&&<Check className="w-3.5 h-3.5 text-gold-500 flex-shrink-0"/>}
            </button>
          ))}
          <div className="px-3 py-1.5 bg-surface-subtle border-t border-surface-border">
            <p className="text-[10px] text-obsidian-400">Rates updated daily</p>
          </div>
        </div>
      )}
    </div>
  )
}
export function DiasporaBanner() {
  const { diasporaMode, setCurrency } = useDiaspora()
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(()=>setMounted(true),[])
  if(!mounted||diasporaMode||dismissed)return null
  return (
    <div className="bg-blue-600 text-white py-2 px-4 flex items-center justify-center gap-3 flex-wrap relative text-sm">
      <Globe className="w-4 h-4"/><span>🌍 Viewing from abroad? See prices in your currency.</span>
      <div className="flex gap-2">
        {['USD','GBP','EUR'].map(code=>{ const c=CURRENCIES.find(x=>x.code===code)!; return <button key={code} onClick={()=>setCurrency(c)} className="px-2.5 py-0.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold">{c.flag} {code}</button> })}
      </div>
      <button onClick={()=>setDismissed(true)} className="absolute right-3 text-white/70 hover:text-white text-xl">×</button>
    </div>
  )
}
export function PriceDisplay({ naira, period, size='md' }:{ naira:number; period?:string; size?:'sm'|'md'|'lg' }) {
  const { convert, currency } = useDiaspora()
  const pm:Record<string,string>={YEARLY:'/yr',MONTHLY:'/mo',PER_NIGHT:'/night',TOTAL:''}
  const s={sm:'text-base',md:'text-xl',lg:'text-3xl'}
  return <div><span className={`font-display font-semibold text-obsidian-900 ${s[size]}`}>{convert(naira)}</span>{period&&pm[period]&&<span className="text-obsidian-400 text-sm">{pm[period]}</span>}{currency.code!=='NGN'&&<div className="text-[10px] text-obsidian-400 mt-0.5">{naira>=1e6?`₦${(naira/1e6).toFixed(1)}M`:`₦${(naira/1000).toFixed(0)}K`} NGN</div>}</div>
}
