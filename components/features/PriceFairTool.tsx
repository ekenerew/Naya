'use client'
import { useState } from 'react'
import { TrendingUp, Search, Loader2, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react'

const AREAS = ['GRA Phase 2','Old GRA','Woji','Trans Amadi','Rumuola','Eleme','Peter Odili Road','Stadium Road','Bonny Island','Choba','D-Line']

export default function PriceFairTool() {
  const [neighborhood, setNeighborhood] = useState('')
  const [listingType, setListingType]   = useState('rent')
  const [bedrooms, setBedrooms]         = useState('3')
  const [price, setPrice]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [result, setResult]             = useState<any>(null)
  const [error, setError]               = useState('')

  const check = async () => {
    if (!neighborhood || !price) { setError('Please select an area and enter a price'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/price-check', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ neighborhood, listingType, bedrooms, price })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Check failed'); return }
      setResult(data.data)
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  const fmt = (n: number) => n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n.toLocaleString()}`

  const colorMap: Record<string,string> = {
    emerald:'bg-emerald-50 border-emerald-200 text-emerald-700',
    blue:   'bg-blue-50 border-blue-200 text-blue-700',
    amber:  'bg-amber-50 border-amber-200 text-amber-700',
    rose:   'bg-rose-50 border-rose-200 text-rose-700',
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-gold-600" />
        </div>
        <div>
          <h3 className="font-semibold text-obsidian-900">Is This Price Fair?</h3>
          <p className="text-xs text-obsidian-400">Compare against Port Harcourt market data</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="input-label text-xs">Area</label>
          <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="input-field text-sm">
            <option value="">Select area...</option>
            {AREAS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="input-label text-xs">Type</label>
          <select value={listingType} onChange={e => setListingType(e.target.value)} className="input-field text-sm">
            <option value="rent">Rent</option>
            <option value="sale">Buy/Sale</option>
          </select>
        </div>
        <div>
          <label className="input-label text-xs">Bedrooms</label>
          <select value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="input-field text-sm">
            {['1','2','3','4'].map(n => <option key={n} value={n}>{n} bed{Number(n)>1?'s':''}</option>)}
          </select>
        </div>
        <div>
          <label className="input-label text-xs">Asking Price (₦)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400 text-sm">₦</span>
            <input value={price} onChange={e => setPrice(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && check()}
              placeholder="3,500,000"
              className="input-field pl-7 text-sm font-mono" />
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}

      <button onClick={check} disabled={loading || !neighborhood || !price}
        className="btn-primary w-full justify-center gap-2 disabled:opacity-50 mb-4">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Checking...</> : <><Search className="w-4 h-4" />Check This Price</>}
      </button>

      {result && (
        <div className={`p-4 rounded-2xl border ${colorMap[result.color] || colorMap.blue}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{result.emoji}</span>
            <span className="font-bold text-base">{result.label}</span>
          </div>
          <p className="text-sm leading-relaxed mb-3">{result.message}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/60 rounded-xl p-2 text-center">
              <p className="font-bold">{result.marketAvgFormatted}</p>
              <p className="opacity-70">Market average</p>
            </div>
            <div className="bg-white/60 rounded-xl p-2 text-center">
              <p className="font-bold">{result.marketRangeFormatted}</p>
              <p className="opacity-70">Typical range</p>
            </div>
          </div>
          {result.percentageDiff !== 0 && (
            <div className="mt-2 text-xs text-center font-semibold">
              {result.percentageDiff > 0 ? `${result.percentageDiff}% above` : `${Math.abs(result.percentageDiff)}% below`} market average
            </div>
          )}
        </div>
      )}
    </div>
  )
}
