// lib/data.ts — stub file, data now comes from the real DB

export type Property = any
export type BlogPost = any
export type Agent = any

export const properties: any[] = []
export const agents: any[] = []
export const neighborhoods: any[] = []
export const blogPosts: any[] = []

export const commercialListings: any[] = []

export const formatPrice = (n: number) =>
  n >= 1e6
    ? `₦${(n / 1e6).toFixed(1)}M`
    : n >= 1e3
    ? `₦${(n / 1e3).toFixed(1)}K`
    : `₦${n}`

export const getFeaturedProperties = () => []

export const getPropertyGradient = (_type: string) => 'from-gray-200 to-gray-400'

export const getPriceLabel = (price: number, period: string) => {
  const fmt = formatPrice(price)
  const p: Record<string, string> = {
    YEARLY: '/yr',
    MONTHLY: '/mo',
    DAILY: '/day'
  }
  return `${fmt}${p[period] || ''}`
}

export const propertyTypeEmojis: Record<string, string> = {
  APARTMENT: '🏢',
  DUPLEX: '🏠',
  BUNGALOW: '🏡',
  LAND: '🌿',
  COMMERCIAL: '🏪',
  SHORTLET: '🛋',
  TERRACE: '🏘',
  PENTHOUSE: '🏙',
  STUDIO: '🛏',
  SELF_CONTAINED: '🏠',
  ROOM_PARLOUR: '🚪',
  DEFAULT: '🏠'
}

export const getAgentById = (id: string) => {
  return agents.find((agent: any) => agent.id === id) || null
}

export const getPropertyBySlug = (slug: string) => {
  return properties.find((p: any) => p.slug === slug) || null
}

export const getPropertiesByNeighborhood = (name: string) => {
  return properties.filter((p: any) => p.neighborhood === name)
}
