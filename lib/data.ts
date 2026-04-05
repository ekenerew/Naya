export const dynamic = 'force-dynamic';

export const properties: any[] = [];
export const agents: any[] = [];
export const neighborhoods: any[] = [];
export const blogPosts: any[] = [
  {
    id: '1',
    title: 'Coming Soon',
    slug: 'coming-soon',
    excerpt: 'Articles coming soon.',
    content: '',
    category: 'General',
    tags: [],
    author: { name: 'Naya', avatar: '', bio: '' },
    publishedAt: new Date().toISOString(),
    readTime: 1,
    featured: false,
    image: '',
  },
];
export const landListings: any[] = [];
export const rentalListings: any[] = [];
export const shortletListings: any[] = [];
export const newDevelopments: any[] = [];

export const marketStats = {
  averagePrice: 0,
  totalListings: 0,
  priceChange: 0,
  averagePricePerSqm: 0,
  totalAgents: 0,
  totalNeighborhoods: 0,
};

export const formatPrice = (price: number, currency = "NGN"): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

export const getFeaturedProperties = (): any[] => [];
export const getPropertyGradient = (type: string): string => {
  const gradients: Record<string, string> = {
    apartment: "from-blue-500 to-purple-600",
    house: "from-green-500 to-teal-600",
    land: "from-yellow-500 to-orange-600",
    shortlet: "from-pink-500 to-rose-600",
  };
  return gradients[type] ?? "from-gray-500 to-gray-700";
};
export const getPriceLabel = (price: number): string => {
  if (price >= 1_000_000_000) return `₦${(price / 1_000_000_000).toFixed(1)}B`;
  if (price >= 1_000_000) return `₦${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `₦${(price / 1_000).toFixed(0)}K`;
  return `₦${price}`;
};
export const propertyTypeEmojis: Record<string, string> = {
  apartment: "🏢",
  house: "🏠",
  land: "🌍",
  shortlet: "🛎️",
  commercial: "🏗️",
  villa: "🏡",
};

export const commercialListings: any[] = [];
export const getPropertyBySlug = (slug: string): any => null;
export const getAgentById = (id: string): any => null;
export const getPropertiesByNeighborhood = (n: string): any[] => [];
