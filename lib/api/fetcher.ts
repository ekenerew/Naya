// lib/api/fetcher.ts
// Client-side data fetching hooks for Naya

export async function fetchListings(params: Record<string,string> = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`/api/listings${qs ? '?' + qs : ''}`)
  if (!res.ok) return { listings: [], total: 0 }
  const data = await res.json()
  return data.data || { listings: [], total: 0 }
}

export async function fetchAgents(params: Record<string,string> = {}) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`/api/agents${qs ? '?' + qs : ''}`)
  if (!res.ok) return { data: [], pagination: { total: 0 } }
  const json = await res.json()
  return json.data || { data: [], pagination: { total: 0 } }
}

export function formatPrice(price: number, period?: string): string {
  const p = Number(price)
  const formatted = p >= 1_000_000 ? `₦${(p/1_000_000).toFixed(1)}M`
    : p >= 1_000 ? `₦${(p/1_000).toFixed(0)}K`
    : `₦${p.toLocaleString()}`
  if (!period) return formatted
  const periodMap: Record<string,string> = {
    YEARLY:'yr', MONTHLY:'mo', PER_NIGHT:'night', TOTAL:'', MONTHLY_SHORT:'mo'
  }
  return `${formatted}${period in periodMap ? '/'+periodMap[period] : ''}`
}
