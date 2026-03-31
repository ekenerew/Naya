'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, X, MapPin, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const POPULAR = [
  { label:'3 bed GRA Phase 2',  href:'/search?q=3+bedroom+GRA+Phase+2' },
  { label:'Shortlet Woji',      href:'/shortlet?area=Woji' },
  { label:'Land for sale PH',   href:'/search?type=LAND&listingType=SALE' },
  { label:'2 bed Trans Amadi',  href:'/search?q=2+bedroom+Trans+Amadi' },
  { label:'Studio apartment',   href:'/search?q=studio' },
  { label:'Commercial Rumuola', href:'/search?q=commercial+Rumuola' },
]

const AREAS = ['GRA Phase 2','Old GRA','Woji','Trans Amadi','Rumuola','Eleme','Peter Odili Road','Choba']

export default function MobileSearch() {
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const router              = useRouter()
  const inputRef            = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const handleSearch = () => {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
    setOpen(false)
    setQuery('')
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="flex items-center gap-3 w-full mx-4 px-4 py-3 bg-white/10 border border-white/15 rounded-2xl text-white/50 text-sm md:hidden"
      style={{ backdropFilter:'blur(8px)' }}
    >
      <Search className="w-4 h-4 flex-shrink-0" />
      <span>Search properties, areas...</span>
    </button>
  )

  return (
    <div
      className="fixed inset-0 z-[500] md:hidden"
      style={{ background:'rgba(10,10,11,0.97)', backdropFilter:'blur(20px)' }}
    >
      {/* Search input */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex-1 flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-4 py-3">
          <Search className="w-5 h-5 text-gold-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search properties, areas..."
            className="flex-1 bg-transparent text-white text-base outline-none placeholder:text-white/30"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X className="w-4 h-4 text-white/40" />
            </button>
          )}
        </div>
        <button onClick={() => setOpen(false)} className="text-white/50 text-sm font-medium px-1">
          Cancel
        </button>
      </div>

      <div className="overflow-y-auto h-full pb-32 px-4 pt-4">
        {/* Areas */}
        <div className="mb-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
            <MapPin className="w-3 h-3" />Popular Areas
          </p>
          <div className="grid grid-cols-2 gap-2">
            {AREAS.map((area, i) => (
              <Link key={i} href={`/search?area=${encodeURIComponent(area)}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm hover:bg-white/10 transition-colors active:scale-95">
                <MapPin className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                {area}
              </Link>
            ))}
          </div>
        </div>

        {/* Popular searches */}
        <div className="mb-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
            <TrendingUp className="w-3 h-3" />Popular Searches
          </p>
          <div className="space-y-1">
            {POPULAR.map((s, i) => (
              <Link key={i} href={s.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-3.5 rounded-xl text-white/60 text-sm hover:bg-white/5 transition-colors active:bg-white/10">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-white/20" />
                  {s.label}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/20" />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick category links */}
        <div>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Browse by type</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label:'🏠 Rent',       href:'/rent' },
              { label:'🏡 Buy',        href:'/buy' },
              { label:'🛋 Shortlet',   href:'/shortlet' },
              { label:'🏢 Commercial', href:'/commercial' },
              { label:'🌿 Land',       href:'/land' },
              { label:'🗺 Map View',   href:'/map' },
            ].map((c,i) => (
              <Link key={i} href={c.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm text-center hover:bg-white/10 active:scale-95 transition-all">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
