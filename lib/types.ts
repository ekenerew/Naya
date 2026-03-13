export type PropertyType = 'apartment' | 'duplex' | 'bungalow' | 'land' | 'commercial' | 'shortlet' | 'terrace' | 'penthouse' | 'mansion'
export type ListingType  = 'sale' | 'rent' | 'shortlet' | 'lease'
export type PropertyStatus = 'active' | 'rented' | 'sold' | 'pending'

export interface Property {
  id: string
  slug: string
  title: string
  description: string
  propertyType: PropertyType
  listingType: ListingType
  price: number
  pricePeriod: 'monthly' | 'yearly' | 'total' | 'per_night'
  bedrooms: number
  bathrooms: number
  toilets: number
  sizeSqm: number
  address: string
  neighborhood: string
  lga: string
  state: string
  latitude: number
  longitude: number
  amenities: string[]
  features: string[]
  images: string[]
  virtualTour: boolean
  isVerified: boolean
  isFeatured: boolean
  isNew: boolean
  status: PropertyStatus
  agentId: string
  views: number
  enquiries: number
  yearBuilt: number
  parkingSpaces: number
  floorLevel?: number
  totalFloors?: number
  createdAt: string
}

export interface Agent {
  id: string
  username: string
  name: string
  agencyName: string
  avatar: string
  initials: string
  bio: string
  rsspcNumber: string
  cacNumber: string
  phone: string
  email: string
  whatsapp: string
  neighborhoods: string[]
  specializations: string[]
  totalListings: number
  totalSales: number
  totalRentals: number
  rating: number
  reviewCount: number
  plan: 'basic' | 'pro' | 'premium'
  badge: 'none' | 'verified' | 'top_agent' | 'platinum'
  isVerified: boolean
  yearsActive: number
  languages: string[]
  joinedDate: string
}

export interface Neighborhood {
  id: string
  slug: string
  name: string
  lga: string
  description: string
  character: string
  safetyScore: number
  infrastructureScore: number
  schoolScore: number
  floodRiskScore: number
  avgRent1br: number
  avgRent3br: number
  avgBuyPrice: number
  trend: 'up' | 'down' | 'stable'
  trendPct: number
  heroGradient: string
  emoji: string
  highlights: string[]
  nearbySchools: string[]
  nearbyHospitals: string[]
  nearbyLandmarks: string[]
  propertyCount: number
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: number
  publishedAt: string
  author: string
  authorRole: string
  emoji: string
  featured: boolean
}

export interface MarketStat {
  month: string
  avgRent: number
  avgSale: number
  listings: number
  enquiries: number
}
