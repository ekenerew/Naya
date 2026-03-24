'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Search, Link2, ExternalLink, Shield, AlertTriangle,
  CheckCircle2, X, Loader2, ArrowRight, Plus, ChevronDown,
  Home, Star, MapPin, Building2, Sparkles, Globe,
  Clipboard, RefreshCw, Eye, MessageCircle, Filter
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────
type Result = {
  id: string
  type: 'naya' | 'external' | 'external_link'
  verified: boolean
  title: string
  description?: string
  price?: number | null
  pricePeriod?: string
  bedrooms?: number | null
  neighborhood?: string
  listingType?: string
  image?: string | null
  url: string
  source: string
  agentBadge?: string
  rsspcStatus?: string
  featured?: boolean
  rawPrice?: string | null
}

type FetchedListing = {
  url: string; title: string; description: string; image: string | null
  siteName: string; price: string | null; bedrooms: number | null
  location: string | null; listingType: string; domain: string
  verified: boolean
}

// ── Helpers ────────────────────────────────────────────────────
const fmt = (n: number) => n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n.toLocaleString()}`
const periodLabel: Record<string,string> = { YEARLY:'/yr', MONTHLY:'/mo', PER_NIGHT:'/night', TOTAL:'' }

const SOURCES = [
  { name:'PropertyPro',              url:'https://propertypro.ng',                    logo:'🏠' },
  { name:'Nigeria Property Centre',  url:'https://nigeriapropertycentre.com',         logo:'🏢' },
  { name:'Jiji Nigeria',             url:'https://jiji.ng/port-harcourt/houses',      logo:'🛒' },
  { name:'ToLet',                    url:'https://tolet.com.ng',                      logo:'🔑' },
  { name:'Private Property',         url:'https://privateproperty.com.ng',            logo:'🏡' },
  { name:'Lamudi',                   url:'https://lamudi.com.ng',                     logo:'🌐' },
]

const QUICK_SEARCHES = [
  '3 bedroom GRA Phase 2 rent', '2 bedroom Woji shortlet',
  'land for sale Port Harcourt', '4 bedroom duplex Eleme',
  'studio apartment Trans Amadi', 'commercial space Rumuola',
]

// ── Result Card ────────────────────────────────────────────────
function ResultCard({ result }: { result: Result }) {
  const isNaya     = result.type === 'naya'
  const isExtLink  = result.type === 'external_link'

  return (
    <div className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isNaya ? 'border-gold-200 bg-gradient-to-br from-gold-50/50 to-white' : 'border-surface-border bg-white hover:border-obsidian-200'
    }`}>
      {/* Verified / Unverified badge */}
      <div className={`absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
        isNaya ? 'bg-emerald-500 text-white' : 'bg-obsidian-700 text-white/80'
      }`}>
        {isNaya ? <><CheckCircle2 className="w-3 h-3" />NAYA VERIFIED</> : <><Globe className="w-3 h-3" />EXTERNAL</>}
      </div>

      {/* Image */}
      <div className="relative h-44 bg-surface-subtle overflow-hidden">
        {result.image ? (
          <img src={result.image} alt={result.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background:'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
            <Home className="w-10 h-10 text-white/20" />
            <p className="text-white/30 text-xs">{result.source}</p>
          </div>
        )}
        {/* Source pill */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur rounded-full text-white text-[10px] font-semibold">
          {result.source}
        </div>
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-obsidian-900 text-sm leading-tight line-clamp-2 mb-2 group-hover:text-gold-700 transition-colors">
          {result.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-obsidian-400 mb-3 flex-wrap">
          {result.neighborhood && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />{result.neighborhood}
            </span>
          )}
          {result.bedrooms && result.bedrooms > 0 && (
            <span>{result.bedrooms} bed{result.bedrooms > 1 ? 's' : ''}</span>
          )}
          {result.listingType && (
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              result.listingType === 'SALE' ? 'bg-blue-50 text-blue-600' :
              result.listingType === 'SHORTLET' ? 'bg-purple-50 text-purple-600' :
              'bg-emerald-50 text-emerald-600'
            }`}>
              {result.listingType.toLowerCase()}
            </span>
          )}
        </div>

        {/* Price */}
        {(result.price || (result as any).rawPrice) && (
          <div className="mb-3">
            <span className="font-display text-lg font-semibold text-obsidian-900">
              {result.price ? fmt(result.price) : (result as any).rawPrice}
            </span>
            {result.pricePeriod && <span className="text-obsidian-400 text-sm">{periodLabel[result.pricePeriod] || ''}</span>}
          </div>
        )}

        {/* Description */}
        {result.description && (
          <p className="text-xs text-obsidian-400 line-clamp-2 mb-3">{result.description}</p>
        )}

        {/* Warning for external */}
        {!isNaya && !isExtLink && (
          <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 leading-relaxed">
              This listing is from an external platform. Naya has not verified the agent or property. Always inspect before paying.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <a href={isNaya ? result.url : result.url}
            target={isNaya ? '_self' : '_blank'}
            rel={isNaya ? '' : 'noopener noreferrer'}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isNaya
                ? 'bg-obsidian-900 hover:bg-obsidian-800 text-white'
                : 'bg-surface-subtle hover:bg-surface-border text-obsidian-700'
            }`}>
            {isNaya ? <><Eye className="w-3.5 h-3.5" />View on Naya</> : <><ExternalLink className="w-3.5 h-3.5" />View Listing</>}
          </a>
          {!isNaya && (
            <Link href={`/portal/list`}
              className="flex items-center gap-1 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-obsidian-900 rounded-xl text-xs font-bold transition-all whitespace-nowrap">
              <Plus className="w-3 h-3" />List on Naya
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ── URL Paste Card ─────────────────────────────────────────────
function URLPasteCard({ onAdd }: { onAdd: (listing: any) => void }) {
  const [url, setUrl]         = useState('')
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState<FetchedListing | null>(null)
  const [error, setError]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const handlePaste = async () => {
    if (!url.trim()) { setError('Please paste a property URL'); return }
    if (!url.startsWith('http')) { setError('URL must start with http:// or https://'); return }
    setLoading(true); setError(''); setFetched(null)
    try {
      const res  = await fetch('/api/discover/fetch-listing', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ url: url.trim() })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Could not fetch listing'); return }
      setFetched(data.data)
    } catch { setError('Network error. Please check your connection.') }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!fetched) return
    setSaving(true)
    try {
      const res = await fetch('/api/discover/submit', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(fetched)
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        onAdd({ ...fetched, id:`url_${Date.now()}`, type:'external', verified:false, source:fetched.domain })
        setTimeout(() => { setUrl(''); setFetched(null); setSaved(false) }, 2000)
      }
    } catch { setError('Failed to save listing') }
    finally { setSaving(false) }
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.startsWith('http')) setUrl(text)
    } catch {}
  }

  return (
    <div className="card p-5 border-2 border-dashed border-gold-200 bg-gold-50/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
          <Link2 className="w-5 h-5 text-gold-600" />
        </div>
        <div>
          <h3 className="font-semibold text-obsidian-900 text-sm">Add a Property from Another Site</h3>
          <p className="text-xs text-obsidian-400">Paste any property link from PropertyPro, Jiji, WhatsApp, etc.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
          <input
            value={url}
            onChange={e => { setUrl(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handlePaste()}
            placeholder="https://propertypro.ng/property/..."
            className="input-field pl-9 pr-3 text-sm w-full font-mono"
          />
        </div>
        <button onClick={pasteFromClipboard}
          className="flex items-center gap-1.5 px-3 py-2 border border-surface-border rounded-xl text-xs text-obsidian-600 hover:border-gold-400 transition-colors whitespace-nowrap">
          <Clipboard className="w-3.5 h-3.5" />Paste
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl mb-3">
          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      )}

      <button onClick={handlePaste} disabled={loading || !url.trim()}
        className="w-full btn-primary justify-center gap-2 disabled:opacity-50 mb-3">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Fetching listing...</> : <><Search className="w-4 h-4" />Fetch Listing Details</>}
      </button>

      {/* Preview of fetched listing */}
      {fetched && (
        <div className="mt-3 p-4 bg-white border border-surface-border rounded-2xl">
          <div className="flex gap-3 mb-3">
            {fetched.image && (
              <img src={fetched.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-obsidian-900 text-sm line-clamp-2">{fetched.title}</p>
              <p className="text-xs text-obsidian-400 mt-1">{fetched.domain}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {fetched.price && <span className="text-xs font-bold text-gold-600">{fetched.price}</span>}
                {fetched.bedrooms && <span className="text-xs text-obsidian-500">{fetched.bedrooms} beds</span>}
                {fetched.location && <span className="text-xs text-obsidian-500">{fetched.location}</span>}
              </div>
            </div>
          </div>
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl mb-3">
            <p className="text-[10px] text-amber-700">
              <strong>⚠ Unverified listing</strong> — This will be added to Discover as external content. Naya has not verified this property or agent.
            </p>
          </div>
          {saved ? (
            <div className="flex items-center justify-center gap-2 py-2 text-emerald-600 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />Added to Discover!
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setFetched(null)}
                className="flex-1 btn-secondary justify-center text-xs py-2">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 btn-primary justify-center gap-2 text-xs py-2">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add to Discover
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function DiscoverPage() {
  const [query, setQuery]         = useState('')
  const [type, setType]           = useState('')
  const [area, setArea]           = useState('')
  const [results, setResults]     = useState<Result[]>([])
  const [loading, setLoading]     = useState(false)
  const [searched, setSearched]   = useState(false)
  const [hasGoogleKey, setHasGoogleKey] = useState(false)
  const [showPaste, setShowPaste] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const search = useCallback(async (q = query) => {
    setLoading(true); setSearched(true)
    try {
      const params = new URLSearchParams()
      if (q)    params.set('q', q)
      if (type) params.set('type', type)
      if (area) params.set('area', area)
      const res  = await fetch(`/api/discover/search?${params}`)
      const data = await res.json()
      setResults(data.data?.results || [])
      setHasGoogleKey(data.data?.hasGoogleKey || false)
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, [query, type, area])

  // Load on mount
  useEffect(() => { search('Port Harcourt property') }, [])

  const addCommunityListing = (listing: any) => {
    setResults(prev => [{ ...listing, type:'external' }, ...prev])
  }

  const nayaResults     = results.filter(r => r.type === 'naya')
  const externalResults = results.filter(r => r.type !== 'naya')

  return (
    <div className="min-h-screen bg-surface-bg">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative bg-obsidian-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gold bg-grid opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/8 rounded-full blur-[120px]" />

        <div className="relative z-10 page-container pt-14 pb-10">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-sm font-semibold mb-5">
              <Sparkles className="w-4 h-4" />Nigeria's Widest Property Search
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-light text-white leading-tight mb-4">
              Discover Properties<br /><span className="gold-text">Across All Platforms</span>
            </h1>
            <p className="text-white/50 text-base mb-8 max-w-xl mx-auto">
              Search Naya's verified listings and thousands more from PropertyPro, Jiji, NigeriaPropertyCentre and beyond — all in one place.
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-obsidian-300" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && search()}
                  placeholder="3 bedroom GRA Phase 2, shortlet Woji, land Eleme..."
                  className="w-full pl-12 pr-4 py-3.5 text-sm text-obsidian-900 bg-transparent outline-none placeholder:text-obsidian-300"
                />
              </div>
              <select value={type} onChange={e => setType(e.target.value)}
                className="px-4 py-3 rounded-xl border border-surface-border text-sm text-obsidian-700 bg-white outline-none md:w-36">
                <option value="">All Types</option>
                <option value="RENT">Rent</option>
                <option value="SALE">Buy</option>
                <option value="SHORTLET">Shortlet</option>
                <option value="LEASE">Lease</option>
              </select>
              <button onClick={() => search()}
                className="btn-primary justify-center gap-2 px-6 whitespace-nowrap">
                <Search className="w-4 h-4" />Search
              </button>
            </div>

            {/* Quick searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {QUICK_SEARCHES.map((qs, i) => (
                <button key={i} onClick={() => { setQuery(qs); search(qs) }}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-white/70 hover:text-white text-xs font-medium transition-all">
                  {qs}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM BADGES ───────────────────────── */}
      <section className="bg-white border-b border-surface-border py-4">
        <div className="page-container">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <p className="text-xs text-obsidian-400 font-semibold whitespace-nowrap flex-shrink-0">Searches across:</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-xs font-bold text-gold-700">
                <CheckCircle2 className="w-3 h-3" />Naya ✦ Verified
              </div>
            </div>
            {SOURCES.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-subtle border border-surface-border text-xs text-obsidian-600 whitespace-nowrap flex-shrink-0">
                {s.logo} {s.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── SIDEBAR ─────────────────────────────── */}
          <div className="space-y-4">

            {/* Paste URL */}
            <button onClick={() => setShowPaste(p => !p)}
              className="w-full flex items-center justify-between p-4 card hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-gold-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-obsidian-900">Add from URL</p>
                  <p className="text-xs text-obsidian-400">Paste any property link</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-obsidian-400 transition-transform ${showPaste ? 'rotate-180' : ''}`} />
            </button>

            {showPaste && <URLPasteCard onAdd={addCommunityListing} />}

            {/* Browse other platforms */}
            <div className="card p-4">
              <h3 className="font-semibold text-obsidian-900 text-sm mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold-600" />Browse Other Platforms
              </h3>
              <div className="space-y-2">
                {SOURCES.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-subtle transition-colors group">
                    <div className="flex items-center gap-2">
                      <span>{s.logo}</span>
                      <span className="text-sm text-obsidian-700 group-hover:text-gold-600 transition-colors">{s.name}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-obsidian-300 group-hover:text-gold-500 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* List on Naya CTA */}
            <div className="card p-4 bg-gradient-to-br from-obsidian-900 to-obsidian-800 border-0">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                <h3 className="font-semibold text-white text-sm mb-2">Get Verified on Naya</h3>
                <p className="text-white/50 text-xs mb-4">
                  Your listings appear first in search results with the Naya Verified badge.
                </p>
                <Link href="/register" className="btn-primary w-full justify-center text-xs">
                  List for Free
                </Link>
              </div>
            </div>

            {/* Google Search setup tip */}
            {!hasGoogleKey && searched && (
              <div className="card p-4 border-blue-200 bg-blue-50">
                <div className="flex items-start gap-2">
                  <Search className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-700 mb-1">Expand Search Results</p>
                    <p className="text-xs text-blue-600">
                      Add Google Custom Search API key to see results from all Nigerian property platforms.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── MAIN RESULTS ────────────────────────── */}
          <div className="lg:col-span-3">

            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                {loading ? (
                  <div className="h-5 w-48 bg-surface-subtle rounded animate-pulse" />
                ) : searched ? (
                  <p className="text-obsidian-700 font-medium text-sm">
                    {results.length} properties found
                    {query && <span className="text-obsidian-400"> for "<span className="text-obsidian-700">{query}</span>"</span>}
                  </p>
                ) : null}
              </div>
              <button onClick={() => search()} disabled={loading}
                className="flex items-center gap-1.5 text-sm text-obsidian-400 hover:text-obsidian-700 transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />Refresh
              </button>
            </div>

            {/* Naya Verified section */}
            {nayaResults.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-xs font-bold">NAYA VERIFIED LISTINGS</span>
                  </div>
                  <div className="flex-1 h-px bg-emerald-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {nayaResults.map(r => <ResultCard key={r.id} result={r} />)}
                </div>
              </div>
            )}

            {/* External / Community listings */}
            {externalResults.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-obsidian-700 rounded-full">
                    <Globe className="w-3.5 h-3.5 text-white/70" />
                    <span className="text-white/80 text-xs font-bold">COMMUNITY LISTINGS — NOT VERIFIED BY NAYA</span>
                  </div>
                  <div className="flex-1 h-px bg-surface-border" />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    The listings below are sourced externally. Naya has not verified these agents or properties.
                    Always inspect before paying and ask for legal documents. 
                    <Link href="/register" className="underline font-semibold ml-1">List on Naya to get verified →</Link>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {externalResults.map(r => <ResultCard key={r.id} result={r} />)}
                </div>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-surface-border overflow-hidden animate-pulse">
                    <div className="h-44 bg-surface-subtle" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-surface-subtle rounded w-4/5" />
                      <div className="h-3 bg-surface-subtle rounded w-1/2" />
                      <div className="h-5 bg-surface-subtle rounded w-1/3" />
                      <div className="h-9 bg-surface-subtle rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && searched && results.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-3xl bg-surface-subtle flex items-center justify-center mx-auto mb-5">
                  <Search className="w-10 h-10 text-obsidian-200" />
                </div>
                <h3 className="font-display text-2xl font-medium text-obsidian-900 mb-2">No results found</h3>
                <p className="text-obsidian-400 text-sm mb-6">Try different keywords or paste a link from another platform.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {QUICK_SEARCHES.slice(0,3).map((qs,i) => (
                    <button key={i} onClick={() => { setQuery(qs); search(qs) }}
                      className="px-4 py-2 bg-surface-subtle border border-surface-border rounded-full text-sm text-obsidian-700 hover:border-gold-400 transition-all">
                      {qs}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
