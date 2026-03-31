// lib/data.ts — stub file, data now comes from the real DB via API
// This file exists only to prevent import errors on legacy pages

export type Property = any
export type BlogPost = any

export const properties: any[]   = []
export const agents: any[]       = []
export const neighborhoods: any[] = []
export const blogPosts: any[]    = []

export const formatPrice = (n: number) =>
  n >= 1e6 ? `₦${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `₦${(n/1e3).toFixed(0)}K` : `₦${n.toLocaleString()}`

export const getFeaturedProperties = () => []

export const getPropertyGradient = (_type: string) => 'from-slate-800 to-slate-900'

export const getPriceLabel = (price: number, period: string) => {
  const fmt = formatPrice(price)
  const p: Record<string,string> = { YEARLY:'/yr', MONTHLY:'/mo', PER_NIGHT:'/night', TOTAL:'' }
  return `${fmt}${p[period] || ''}`
}

export const propertyTypeEmojis: Record<string, string> = {
  APARTMENT:'🏢', DUPLEX:'🏠', BUNGALOW:'🏡', LAND:'🌿',
  COMMERCIAL:'🏪', SHORTLET:'🛋', TERRACE:'🏘', PENTHOUSE:'🏙',
  STUDIO:'🛏', SELF_CONTAINED:'🏠', ROOM_PARLOUR:'🚪', DEFAULT:'🏠'
}
