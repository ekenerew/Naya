import type { Property, Agent, Neighborhood, BlogPost, MarketStat } from './types'

export const neighborhoods: Neighborhood[] = [
  {
    id: 'n1', slug: 'gra-phase-2', name: 'GRA Phase 2', lga: 'Port Harcourt',
    description: 'The most prestigious address in Port Harcourt. GRA Phase 2 is home to expatriates, senior executives, and Nigeria\'s elite. Wide, tree-lined streets, uninterrupted power, and world-class security define this neighbourhood.',
    character: 'Ultra-premium · Expat community · Corporate housing',
    safetyScore: 92, infrastructureScore: 88, schoolScore: 85, floodRiskScore: 78,
    avgRent1br: 1800000, avgRent3br: 4500000, avgBuyPrice: 180000000,
    trend: 'up', trendPct: 8.2,
    heroGradient: 'from-emerald-900 via-emerald-800 to-teal-900',
    emoji: '🏛', highlights: ['24-hr security', 'Expat community', 'Corporate tenants', 'Paved roads'],
    nearbySchools: ['Rumuola Int\'l School', 'Capital Science Academy'],
    nearbyHospitals: ['BMH Hospital', 'Braithwaite Memorial'],
    nearbyLandmarks: ['Government House', 'PHCC HQ', 'Polo Club'],
    propertyCount: 187
  },
  {
    id: 'n2', slug: 'old-gra', name: 'Old GRA', lga: 'Port Harcourt',
    description: 'The original government reserved area with character-filled colonial-era buildings alongside modern developments. Old GRA offers a quieter, leafier version of PH\'s premium market.',
    character: 'Heritage · Quiet · Established families',
    safetyScore: 88, infrastructureScore: 82, schoolScore: 90, floodRiskScore: 72,
    avgRent1br: 1500000, avgRent3br: 3800000, avgBuyPrice: 150000000,
    trend: 'stable', trendPct: 2.1,
    heroGradient: 'from-amber-900 via-amber-800 to-orange-900',
    emoji: '🌳', highlights: ['Historic architecture', 'Top schools nearby', 'Large plots', 'Low density'],
    nearbySchools: ['Government Girls Sec School', 'Federal Govt Girls College'],
    nearbyHospitals: ['Rivers State University Teaching Hospital'],
    nearbyLandmarks: ['University of Port Harcourt', 'RSUTH'],
    propertyCount: 143
  },
  {
    id: 'n3', slug: 'trans-amadi', name: 'Trans Amadi', lga: 'Port Harcourt',
    description: 'Port Harcourt\'s commercial powerhouse. Trans Amadi hosts oil company offices, industrial facilities, and a booming rental market driven by oil workers and business executives.',
    character: 'Commercial · Oil & Gas · High demand',
    safetyScore: 76, infrastructureScore: 79, schoolScore: 65, floodRiskScore: 60,
    avgRent1br: 900000, avgRent3br: 2200000, avgBuyPrice: 85000000,
    trend: 'up', trendPct: 12.5,
    heroGradient: 'from-slate-900 via-slate-800 to-zinc-900',
    emoji: '🏭', highlights: ['Oil & Gas hub', 'Close to SPDC', 'Good roads', 'Commercial zone'],
    nearbySchools: ['Hillcrest School', 'Lagos Business School'],
    nearbyHospitals: ['Meridian Hospital', 'St Anne\'s Hospital'],
    nearbyLandmarks: ['Agip Office', 'SPDC HQ', 'Shopping Malls'],
    propertyCount: 312
  },
  {
    id: 'n4', slug: 'rumuola', name: 'Rumuola', lga: 'Obio-Akpor',
    description: 'A rapidly developing suburb popular with young professionals and middle-class families. Rumuola offers modern housing at more accessible price points with good infrastructure.',
    character: 'Emerging · Young professionals · Value for money',
    safetyScore: 72, infrastructureScore: 74, schoolScore: 78, floodRiskScore: 65,
    avgRent1br: 600000, avgRent3br: 1400000, avgBuyPrice: 55000000,
    trend: 'up', trendPct: 15.3,
    heroGradient: 'from-violet-900 via-purple-800 to-indigo-900',
    emoji: '🌆', highlights: ['Growing area', 'New developments', 'Good schools', 'Near airport'],
    nearbySchools: ['Rumuola Comprehensive', 'Deeper Life High School'],
    nearbyHospitals: ['Amadi Creek Hospital', 'UPTH Satellite'],
    nearbyLandmarks: ['PH International Airport', 'Rumuola Police Station'],
    propertyCount: 428
  },
  {
    id: 'n5', slug: 'woji', name: 'Woji', lga: 'Obio-Akpor',
    description: 'One of Port Harcourt\'s most desirable mid-market neighbourhoods, Woji has seen explosive growth with gated estates and luxury apartment complexes attracting senior executives and returnees.',
    character: 'Gated estates · Premium mid-market · Returnees',
    safetyScore: 84, infrastructureScore: 81, schoolScore: 82, floodRiskScore: 70,
    avgRent1br: 1200000, avgRent3br: 2900000, avgBuyPrice: 120000000,
    trend: 'up', trendPct: 18.7,
    heroGradient: 'from-rose-900 via-pink-800 to-rose-900',
    emoji: '🏘', highlights: ['Gated estates', 'Top developers', 'New constructions', 'Secure'],
    nearbySchools: ['Graceland Int\'l School', 'Woji Academy'],
    nearbyHospitals: ['Medbury Hospital', 'St Kizito Medical'],
    nearbyLandmarks: ['Polo Road Junction', 'Ezimgbu Road'],
    propertyCount: 256
  },
  {
    id: 'n6', slug: 'eleme', name: 'Eleme', lga: 'Eleme',
    description: 'Home to the NLNG plant and Port Harcourt Refinery, Eleme is a key industrial area with strong expatriate demand for upscale housing. Offers excellent value for oil & gas workers.',
    character: 'Industrial · NLNG community · Expat demand',
    safetyScore: 69, infrastructureScore: 71, schoolScore: 68, floodRiskScore: 55,
    avgRent1br: 700000, avgRent3br: 1800000, avgBuyPrice: 65000000,
    trend: 'stable', trendPct: 3.4,
    heroGradient: 'from-cyan-900 via-teal-800 to-emerald-900',
    emoji: '⚡', highlights: ['NLNG proximity', 'Expat housing', 'Refinery access', 'Industrial hub'],
    nearbySchools: ['NLNG Secondary School', 'Federal Polytechnic Nekede'],
    nearbyHospitals: ['NLNG Hospital', 'Eleme General Hospital'],
    nearbyLandmarks: ['NLNG Plant', 'PH Refinery', 'Eleme Petrochemical'],
    propertyCount: 198
  },
]

export const agents: Agent[] = [
  {
    id: 'a1', username: 'samuel-okeke', name: 'Samuel Okeke', agencyName: 'Okeke Premium Properties',
    avatar: '', initials: 'SO', bio: 'Port Harcourt\'s most trusted luxury property agent with over 12 years of experience. Specialising in GRA and Old GRA premium listings. RSSPC certified and CAC registered.',
    rsspcNumber: 'RS-2024-1847', cacNumber: 'RC-884721', phone: '+234 803 456 7890', email: 'samuel@okekeproperties.ng', whatsapp: '+2348034567890',
    neighborhoods: ['GRA Phase 2', 'Old GRA', 'Rumuola'],
    specializations: ['Luxury', 'Expat Housing', 'Commercial'],
    totalListings: 47, totalSales: 28, totalRentals: 96, rating: 4.9, reviewCount: 84,
    plan: 'premium', badge: 'platinum', isVerified: true, yearsActive: 12, languages: ['English', 'Igbo'],
    joinedDate: '2023-01-15'
  },
  {
    id: 'a2', username: 'amara-obi', name: 'Amara Obi', agencyName: 'Obi Realty & Homes',
    avatar: '', initials: 'AO', bio: 'Specialist in residential and commercial properties across Trans Amadi and Rumuola. Trusted by Shell, SPDC, and Chevron for staff housing.',
    rsspcNumber: 'RS-2023-0934', cacNumber: 'RC-671234', phone: '+234 706 789 0123', email: 'amara@obirealty.ng', whatsapp: '+2347067890123',
    neighborhoods: ['Trans Amadi', 'Rumuola', 'Woji'],
    specializations: ['Corporate Housing', 'Short Lets', 'Property Management'],
    totalListings: 63, totalSales: 41, totalRentals: 148, rating: 4.8, reviewCount: 112,
    plan: 'premium', badge: 'top_agent', isVerified: true, yearsActive: 8, languages: ['English', 'Yoruba', 'Igbo'],
    joinedDate: '2023-03-20'
  },
  {
    id: 'a3', username: 'chidi-ihejirika', name: 'Chidi Ihejirika', agencyName: 'Ihejirika Properties',
    avatar: '', initials: 'CI', bio: 'Focused on helping first-time buyers and young professionals find their perfect home in Port Harcourt. Expert in Woji and new developments.',
    rsspcNumber: 'RS-2024-2201', cacNumber: 'RC-445890', phone: '+234 901 234 5678', email: 'chidi@ihejirikaprops.ng', whatsapp: '+2349012345678',
    neighborhoods: ['Woji', 'Rumuola', 'GRA Phase 2'],
    specializations: ['First-time Buyers', 'New Developments', 'Residential'],
    totalListings: 31, totalSales: 19, totalRentals: 67, rating: 4.7, reviewCount: 58,
    plan: 'pro', badge: 'verified', isVerified: true, yearsActive: 5, languages: ['English', 'Igbo'],
    joinedDate: '2023-06-01'
  },
  {
    id: 'a4', username: 'ngozi-eze', name: 'Ngozi Eze', agencyName: 'Eze Signature Homes',
    avatar: '', initials: 'NE', bio: 'Luxury property consultant specialising in high-net-worth clients. Over 15 years in PH real estate with a portfolio of exclusive listings across GRA and Woji.',
    rsspcNumber: 'RS-2022-0412', cacNumber: 'RC-234567', phone: '+234 812 345 6789', email: 'ngozi@ezesignature.ng', whatsapp: '+2348123456789',
    neighborhoods: ['GRA Phase 2', 'Old GRA', 'Woji', 'Eleme'],
    specializations: ['Luxury', 'Investment', 'Off-plan'],
    totalListings: 52, totalSales: 38, totalRentals: 87, rating: 4.9, reviewCount: 97,
    plan: 'premium', badge: 'platinum', isVerified: true, yearsActive: 15, languages: ['English', 'Igbo', 'French'],
    joinedDate: '2023-01-05'
  },
  {
    id: 'a5', username: 'emeka-nwosu', name: 'Emeka Nwosu', agencyName: 'Nwosu Realtors',
    avatar: '', initials: 'EN', bio: 'Expert in commercial properties and industrial land. Long-standing relationships with PH\'s business community and oil sector tenants.',
    rsspcNumber: 'RS-2023-1567', cacNumber: 'RC-567890', phone: '+234 702 890 1234', email: 'emeka@nwosurealtors.ng', whatsapp: '+2347028901234',
    neighborhoods: ['Trans Amadi', 'Eleme', 'Old GRA'],
    specializations: ['Commercial', 'Industrial', 'Warehouses'],
    totalListings: 29, totalSales: 22, totalRentals: 44, rating: 4.6, reviewCount: 41,
    plan: 'pro', badge: 'verified', isVerified: true, yearsActive: 9, languages: ['English', 'Igbo'],
    joinedDate: '2023-07-12'
  },
  {
    id: 'a6', username: 'adaeze-okafor', name: 'Adaeze Okafor', agencyName: 'Adaeze Homes',
    avatar: '', initials: 'AD', bio: 'Young and dynamic property agent focused on the Rumuola and Woji market. Specialising in mid-range residential and short-term rentals for returning diaspora.',
    rsspcNumber: 'RS-2024-3012', cacNumber: 'RC-789012', phone: '+234 805 678 9012', email: 'adaeze@adaezehomes.ng', whatsapp: '+2348056789012',
    neighborhoods: ['Rumuola', 'Woji', 'Trans Amadi'],
    specializations: ['Short Lets', 'Diaspora Buyers', 'Residential'],
    totalListings: 22, totalSales: 11, totalRentals: 55, rating: 4.7, reviewCount: 33,
    plan: 'pro', badge: 'verified', isVerified: true, yearsActive: 3, languages: ['English', 'Igbo'],
    joinedDate: '2024-01-20'
  },
]

export const properties: Property[] = [
  {
    id: 'p1', slug: '5-bedroom-detached-mansion-gra-phase-2-ph-p001',
    title: '5 Bedroom Detached Mansion, GRA Phase 2',
    description: 'An architectural masterpiece in the heart of GRA Phase 2. This stunning 5-bedroom mansion features Italian marble finishes, a 20-metre swimming pool, home cinema, and a dedicated driver\'s quarters. The property sits on a 1,200 sqm plot with a beautifully landscaped garden. 24-hour power supply via industrial generator, borehole, and CCTV surveillance throughout. Perfect for high-net-worth families and corporate executives.',
    propertyType: 'mansion', listingType: 'rent',
    price: 18000000, pricePeriod: 'yearly',
    bedrooms: 5, bathrooms: 6, toilets: 8, sizeSqm: 680,
    address: '14 Aba Road, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8156, longitude: 7.0498,
    amenities: ['Swimming Pool', 'Home Cinema', 'Gym', 'Generator (Industrial)', 'Solar Power', 'Borehole', 'CCTV', 'Smart Home', 'Garden', 'Staff Quarters', 'Boys Quarters', 'Air Conditioning'],
    features: ['Marble Flooring', 'Italian Kitchen', 'Walk-in Wardrobe', 'Jacuzzi', 'Balconies', 'Double Garage', 'Security Post', 'Intercom'],
    images: ['mansion-gra-1', 'mansion-gra-2', 'mansion-gra-3', 'mansion-gra-4', 'mansion-gra-5'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a1', views: 1847, enquiries: 43,
    yearBuilt: 2022, parkingSpaces: 4, createdAt: '2026-02-15'
  },
  {
    id: 'p2', slug: '3-bedroom-luxury-apartment-woji-ph-p002',
    title: '3 Bedroom Luxury Apartment, Woji',
    description: 'Ultra-modern apartment in a brand-new gated estate in Woji. Features open-plan living, premium German kitchen fittings, floor-to-ceiling windows, and a private terrace with panoramic city views. The estate offers 24-hour security, a communal pool, and a fully equipped gym. Ideal for corporate tenants and young professionals.',
    propertyType: 'apartment', listingType: 'rent',
    price: 3500000, pricePeriod: 'yearly',
    bedrooms: 3, bathrooms: 3, toilets: 4, sizeSqm: 185,
    address: 'Palm Estate, Woji Road', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8243, longitude: 7.0612,
    amenities: ['Swimming Pool', 'Gym', 'Generator', 'Borehole', 'CCTV', 'Air Conditioning', 'Intercom', 'Parking'],
    features: ['Open-Plan Living', 'German Kitchen', 'Floor-to-Ceiling Windows', 'Private Terrace', 'Fitted Wardrobes'],
    images: ['apt-woji-1', 'apt-woji-2', 'apt-woji-3'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: true,
    status: 'active', agentId: 'a3', views: 2341, enquiries: 67,
    yearBuilt: 2025, parkingSpaces: 2, floorLevel: 4, totalFloors: 8, createdAt: '2026-02-28'
  },
  {
    id: 'p3', slug: '4-bedroom-duplex-for-sale-gra-phase-2-ph-p003',
    title: '4 Bedroom Duplex for Sale, GRA Phase 2',
    description: 'Exceptional duplex in GRA Phase 2 ideal for owner-occupiers or as an investment. The property features a grand entrance foyer, spacious living and dining areas, and a fully fitted kitchen. Located on one of the most sought-after streets in PH with excellent road network access.',
    propertyType: 'duplex', listingType: 'sale',
    price: 320000000, pricePeriod: 'total',
    bedrooms: 4, bathrooms: 5, toilets: 6, sizeSqm: 420,
    address: '7 Peter Odili Road, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8201, longitude: 7.0523,
    amenities: ['Generator', 'Borehole', 'CCTV', 'Garden', 'Boys Quarters', 'Air Conditioning'],
    features: ['Grand Foyer', 'Fitted Kitchen', 'Tiled Floors', 'Double Garage', 'Perimeter Fence'],
    images: ['duplex-gra-1', 'duplex-gra-2', 'duplex-gra-3'],
    virtualTour: false, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a4', views: 1523, enquiries: 28,
    yearBuilt: 2019, parkingSpaces: 3, createdAt: '2026-01-20'
  },
  {
    id: 'p4', slug: '2-bedroom-apartment-trans-amadi-ph-p004',
    title: '2 Bedroom Apartment, Trans Amadi',
    description: 'Well-maintained 2-bedroom apartment in a secure Trans Amadi estate. Perfect for oil & gas workers and corporate professionals. Close to Shell HQ, Agip offices, and major amenities.',
    propertyType: 'apartment', listingType: 'rent',
    price: 1800000, pricePeriod: 'yearly',
    bedrooms: 2, bathrooms: 2, toilets: 3, sizeSqm: 120,
    address: 'Industrial Layout, Trans Amadi', neighborhood: 'Trans Amadi', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8312, longitude: 7.0734,
    amenities: ['Generator', 'Borehole', 'CCTV', 'Parking', 'Air Conditioning'],
    features: ['Tiled Floors', 'Fitted Kitchen', 'Perimeter Fence'],
    images: ['apt-ta-1', 'apt-ta-2'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a2', views: 876, enquiries: 22,
    yearBuilt: 2018, parkingSpaces: 1, createdAt: '2026-01-10'
  },
  {
    id: 'p5', slug: '5-bedroom-mansion-for-sale-old-gra-ph-p005',
    title: '5 Bedroom Heritage Mansion, Old GRA',
    description: 'A rare opportunity to own a large colonial-era mansion in Old GRA, fully renovated to modern standards. Sitting on 1,500 sqm of prime land with heritage trees and a cobblestone driveway. Investment opportunity or premium family home.',
    propertyType: 'mansion', listingType: 'sale',
    price: 850000000, pricePeriod: 'total',
    bedrooms: 5, bathrooms: 7, toilets: 9, sizeSqm: 950,
    address: 'Old Station Road, Old GRA', neighborhood: 'Old GRA', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.7934, longitude: 7.0287,
    amenities: ['Swimming Pool', 'Generator (Industrial)', 'Solar', 'Borehole', 'Garden', 'Staff Quarters', 'CCTV', 'Smart Home'],
    features: ['Heritage Architecture', 'Cobblestone Driveway', 'Heritage Trees', 'Wine Cellar', 'Rooftop Terrace'],
    images: ['mansion-ogra-1', 'mansion-ogra-2', 'mansion-ogra-3'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a4', views: 3102, enquiries: 51,
    yearBuilt: 1965, parkingSpaces: 6, createdAt: '2025-12-05'
  },
  {
    id: 'p6', slug: '3-bedroom-terrace-for-sale-rumuola-ph-p006',
    title: '3 Bedroom Terrace House, Rumuola',
    description: 'Brand new 3-bedroom terrace in a newly built estate in Rumuola. Great value for money with modern finishes. Ideal first home for young families. Close to schools and amenities.',
    propertyType: 'terrace', listingType: 'sale',
    price: 65000000, pricePeriod: 'total',
    bedrooms: 3, bathrooms: 3, toilets: 4, sizeSqm: 165,
    address: 'Sunrise Estate, Rumuola', neighborhood: 'Rumuola', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8401, longitude: 7.0189,
    amenities: ['Generator', 'Borehole', 'CCTV', 'Parking'],
    features: ['New Build', 'Modern Finishes', 'Estate Security', 'Paved Roads'],
    images: ['terrace-rum-1', 'terrace-rum-2'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: true,
    status: 'active', agentId: 'a3', views: 654, enquiries: 18,
    yearBuilt: 2025, parkingSpaces: 1, createdAt: '2026-03-01'
  },
  {
    id: 'p7', slug: '1-bedroom-shortlet-gra-phase-2-ph-p007',
    title: '1 Bedroom Luxury Shortlet, GRA Phase 2',
    description: 'Premium shortlet apartment fully furnished to a 5-star hotel standard. Smart TV, high-speed WiFi, premium towels and toiletries. Perfect for business travellers and oil executives visiting Port Harcourt.',
    propertyType: 'shortlet', listingType: 'shortlet',
    price: 45000, pricePeriod: 'per_night',
    bedrooms: 1, bathrooms: 1, toilets: 1, sizeSqm: 75,
    address: 'Diamond Hill Estate, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8178, longitude: 7.0501,
    amenities: ['Generator', 'WiFi', 'Air Conditioning', 'Smart TV', 'Kitchenette', 'Pool Access', 'Security'],
    features: ['Fully Furnished', '5-Star Fixtures', 'Daily Housekeeping', 'Airport Pickup (optional)'],
    images: ['shortlet-gra-1', 'shortlet-gra-2', 'shortlet-gra-3'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a6', views: 4521, enquiries: 134,
    yearBuilt: 2023, parkingSpaces: 1, createdAt: '2026-01-08'
  },
  {
    id: 'p8', slug: '4-bedroom-semi-detached-woji-ph-p008',
    title: '4 Bedroom Semi-Detached, Woji',
    description: 'Spacious semi-detached home in a tranquil Woji street. Large compound, mature garden, and excellent natural light. Recently renovated kitchen and bathrooms. Great for families seeking space in a growing neighbourhood.',
    propertyType: 'duplex', listingType: 'rent',
    price: 5500000, pricePeriod: 'yearly',
    bedrooms: 4, bathrooms: 4, toilets: 5, sizeSqm: 310,
    address: 'Ezimgbu Road, Woji', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8290, longitude: 7.0587,
    amenities: ['Generator', 'Borehole', 'Garden', 'CCTV', 'Boys Quarters', 'Parking'],
    features: ['Large Compound', 'Mature Garden', 'Renovated Kitchen', 'Ensuite Bedrooms'],
    images: ['semi-woji-1', 'semi-woji-2'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a2', views: 1102, enquiries: 31,
    yearBuilt: 2015, parkingSpaces: 2, createdAt: '2026-02-01'
  },
  {
    id: 'p9', slug: 'commercial-space-trans-amadi-ph-p009',
    title: 'Prime Commercial Office Space, Trans Amadi',
    description: 'Grade A office space in Trans Amadi\'s commercial corridor. Suitable for oil & gas companies, financial institutions, and large corporates. Raised floors, modular layout, 200-person capacity. Multiple units available.',
    propertyType: 'commercial', listingType: 'lease',
    price: 12000000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 4, toilets: 6, sizeSqm: 850,
    address: 'Commercial Avenue, Trans Amadi', neighborhood: 'Trans Amadi', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8356, longitude: 7.0821,
    amenities: ['Generator (Industrial)', 'Air Conditioning', 'Lift', 'Reception', 'Parking', 'CCTV', 'Server Room'],
    features: ['Grade A', 'Raised Floors', 'Modular Layout', 'Loading Bay', 'Conference Rooms'],
    images: ['commercial-ta-1', 'commercial-ta-2'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a5', views: 891, enquiries: 14,
    yearBuilt: 2020, parkingSpaces: 20, createdAt: '2026-01-25'
  },
  {
    id: 'p10', slug: '6-bedroom-penthouse-woji-ph-p010',
    title: '6 Bedroom Penthouse, Woji Towers',
    description: 'The crown jewel of PH residential. This stunning full-floor penthouse at the top of Woji Towers offers unobstructed 360° views of Port Harcourt, the Bonny River, and beyond. Features include a private rooftop pool, home automation, and a personal concierge service.',
    propertyType: 'penthouse', listingType: 'sale',
    price: 650000000, pricePeriod: 'total',
    bedrooms: 6, bathrooms: 8, toilets: 10, sizeSqm: 780,
    address: 'Woji Towers, Woji Road', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8267, longitude: 7.0603,
    amenities: ['Private Rooftop Pool', 'Home Automation', 'Concierge', 'Generator', 'Solar', 'Gym', 'Cinema Room', 'Wine Cellar', 'CCTV', 'Smart Home'],
    features: ['360° Views', 'Full-Floor', 'Private Lift Lobby', 'Wine Cellar', 'Rooftop Garden'],
    images: ['penthouse-woji-1', 'penthouse-woji-2', 'penthouse-woji-3'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: true,
    status: 'active', agentId: 'a4', views: 5643, enquiries: 89,
    yearBuilt: 2025, parkingSpaces: 4, floorLevel: 22, totalFloors: 22, createdAt: '2026-03-05'
  },
  {
    id: 'p11', slug: 'land-for-sale-rumuola-ph-p011',
    title: 'Prime Land for Sale — 1,000 sqm, Rumuola',
    description: 'Clean, documented land in a fast-developing Rumuola neighbourhood. C-of-O available. Suitable for residential or mixed-use development. Corner plot with dual-road access. Priced to sell.',
    propertyType: 'land', listingType: 'sale',
    price: 45000000, pricePeriod: 'total',
    bedrooms: 0, bathrooms: 0, toilets: 0, sizeSqm: 1000,
    address: 'New Layout Road, Rumuola', neighborhood: 'Rumuola', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8421, longitude: 7.0198,
    amenities: ['Road Access', 'Drainage', 'Electricity Supply'],
    features: ['C-of-O', 'Corner Plot', 'Dual-Road Access', 'Survey Plan'],
    images: ['land-rum-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a3', views: 432, enquiries: 12,
    yearBuilt: 0, parkingSpaces: 0, createdAt: '2026-02-10'
  },
  {
    id: 'p12', slug: '2-bedroom-shortlet-woji-ph-p012',
    title: '2 Bedroom Serviced Shortlet, Woji',
    description: 'Beautifully furnished 2-bedroom shortlet apartment ideal for extended stays. Netflix, Disney+, high-speed WiFi, fully equipped kitchen with Nigerian and continental cookware. Minimum 3-night stay. Great for visiting executives and diaspora returnees.',
    propertyType: 'shortlet', listingType: 'shortlet',
    price: 75000, pricePeriod: 'per_night',
    bedrooms: 2, bathrooms: 2, toilets: 2, sizeSqm: 110,
    address: 'Green Court Estate, Woji', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8251, longitude: 7.0571,
    amenities: ['Generator', 'WiFi', 'Air Conditioning', 'Smart TV', 'Full Kitchen', 'Pool Access', 'Security', 'Parking'],
    features: ['Fully Furnished', 'Netflix Subscription', 'Airport Transfer', 'City Views'],
    images: ['shortlet-woji-1', 'shortlet-woji-2'],
    virtualTour: true, isVerified: true, isFeatured: false, isNew: true,
    status: 'active', agentId: 'a6', views: 2134, enquiries: 76,
    yearBuilt: 2024, parkingSpaces: 2, createdAt: '2026-03-08'
  },
]

export const blogPosts: BlogPost[] = [
  { id: 'b1', slug: 'best-areas-to-live-in-port-harcourt-2026', title: 'The 6 Best Areas to Live in Port Harcourt in 2026', excerpt: 'From the prestigious GRA to the rapidly developing Woji corridor — a comprehensive guide to PH\'s top neighbourhoods.', category: 'Area Guide', readTime: 8, publishedAt: '2026-03-05', author: 'Naya Editorial', authorRole: 'Editorial Team', emoji: '📍', featured: true },
  { id: 'b2', slug: 'expat-housing-guide-port-harcourt', title: 'The Ultimate Expat Housing Guide — Port Harcourt', excerpt: 'Everything international workers in the oil & gas sector need to know about finding and securing premium accommodation in PH.', category: 'Expat Guide', readTime: 12, publishedAt: '2026-02-28', author: 'Naya Editorial', authorRole: 'Editorial Team', emoji: '✈️', featured: true },
  { id: 'b3', slug: 'ph-real-estate-market-report-q1-2026', title: 'Port Harcourt Real Estate Market Report — Q1 2026', excerpt: 'Prices up 12% YoY. Woji leading growth. Shortlet demand surges. Full data on rents, sales, and investment outlook.', category: 'Market Report', readTime: 6, publishedAt: '2026-03-01', author: 'Naya Research', authorRole: 'Research Team', emoji: '📊', featured: true },
  { id: 'b4', slug: 'how-to-verify-agent-rsspc-nigeria', title: 'How to Verify Your Agent\'s RSSPC Licence in Nigeria', excerpt: 'Don\'t get scammed. Here\'s the step-by-step process to check if your estate agent is genuinely RSSPC certified.', category: 'Legal Guide', readTime: 5, publishedAt: '2026-02-15', author: 'Naya Legal', authorRole: 'Legal Advisor', emoji: '🏛', featured: false },
  { id: 'b5', slug: 'mortgage-guide-nigeria-2026', title: 'Getting a Mortgage in Nigeria: What You Need to Know in 2026', excerpt: 'Interest rates, NHF loans, and local bank options explained. A practical guide for first-time buyers in Port Harcourt.', category: 'Finance', readTime: 10, publishedAt: '2026-02-08', author: 'Naya Finance', authorRole: 'Financial Advisor', emoji: '🏦', featured: false },
  { id: 'b6', slug: 'investment-property-port-harcourt-returns', title: 'Rental Yield vs Capital Growth: Investing in PH Property', excerpt: 'Which neighbourhoods offer the best rental yields? Where is capital appreciation strongest? Data-backed analysis.', category: 'Investment', readTime: 9, publishedAt: '2026-01-22', author: 'Naya Research', authorRole: 'Research Team', emoji: '💰', featured: false },
]

export const marketStats: MarketStat[] = [
  { month: 'Apr \'25', avgRent: 2100000, avgSale: 145000000, listings: 1840, enquiries: 4200 },
  { month: 'May \'25', avgRent: 2150000, avgSale: 148000000, listings: 1920, enquiries: 4450 },
  { month: 'Jun \'25', avgRent: 2200000, avgSale: 150000000, listings: 2010, enquiries: 4800 },
  { month: 'Jul \'25', avgRent: 2180000, avgSale: 153000000, listings: 1980, enquiries: 4650 },
  { month: 'Aug \'25', avgRent: 2250000, avgSale: 158000000, listings: 2120, enquiries: 5100 },
  { month: 'Sep \'25', avgRent: 2280000, avgSale: 162000000, listings: 2200, enquiries: 5400 },
  { month: 'Oct \'25', avgRent: 2320000, avgSale: 165000000, listings: 2350, enquiries: 5750 },
  { month: 'Nov \'25', avgRent: 2400000, avgSale: 170000000, listings: 2480, enquiries: 6100 },
  { month: 'Dec \'25', avgRent: 2450000, avgSale: 175000000, listings: 2390, enquiries: 5900 },
  { month: 'Jan \'26', avgRent: 2500000, avgSale: 178000000, listings: 2520, enquiries: 6300 },
  { month: 'Feb \'26', avgRent: 2580000, avgSale: 182000000, listings: 2640, enquiries: 6700 },
  { month: 'Mar \'26', avgRent: 2650000, avgSale: 188000000, listings: 2847, enquiries: 7200 },
]

// Helper functions
export function formatPrice(price: number, period?: string): string {
  if (price >= 1000000000) return `₦${(price / 1000000000).toFixed(1)}B`
  if (price >= 1000000) return `₦${(price / 1000000).toFixed(1)}M`
  if (price >= 1000) return `₦${(price / 1000).toFixed(0)}K`
  return `₦${price.toLocaleString()}`
}

export function getPriceLabel(property: Property): string {
  const p = formatPrice(property.price)
  if (property.pricePeriod === 'yearly') return `${p}/yr`
  if (property.pricePeriod === 'monthly') return `${p}/mo`
  if (property.pricePeriod === 'per_night') return `${p}/night`
  return p
}

export function getAgentById(id: string): Agent | undefined {
  return agents.find(a => a.id === id)
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find(p => p.slug === slug)
}

export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return neighborhoods.find(n => n.slug === slug)
}

export function getPropertiesByNeighborhood(name: string): Property[] {
  return properties.filter(p => p.neighborhood === name)
}

export function getFeaturedProperties(): Property[] {
  return properties.filter(p => p.isFeatured && p.status === 'active')
}

export function getPropertyGradient(propertyType: string): string {
  const gradients: Record<string, string> = {
    mansion:    'from-amber-950 via-amber-900 to-stone-950',
    apartment:  'from-slate-900 via-slate-800 to-zinc-900',
    duplex:     'from-emerald-950 via-emerald-900 to-teal-950',
    terrace:    'from-rose-950 via-rose-900 to-pink-950',
    penthouse:  'from-violet-950 via-purple-900 to-indigo-950',
    land:       'from-green-950 via-green-900 to-lime-950',
    commercial: 'from-blue-950 via-blue-900 to-cyan-950',
    shortlet:   'from-orange-950 via-orange-900 to-yellow-950',
    bungalow:   'from-teal-950 via-teal-900 to-cyan-950',
  }
  return gradients[propertyType] || gradients.apartment
}

export const propertyTypeEmojis: Record<string, string> = {
  mansion: '🏰', apartment: '🏢', duplex: '🏠', terrace: '🏘',
  penthouse: '🌆', land: '🌿', commercial: '🏭', shortlet: '🛎', bungalow: '🏡',
}

// ── Extended Rental Properties ──────────────────────────────────────────────
export const rentalListings: Property[] = [
  {
    id: 'r1', slug: 'single-room-for-rent-rumuola-ph-r001',
    title: 'Neat Single Room — Rumuola',
    description: 'Clean, well-maintained single room in a secure compound. Shared bathroom and kitchen. Suitable for a working-class individual or student. Close to Rumuola bus stop.',
    propertyType: 'single_room', listingType: 'rent',
    price: 180000, pricePeriod: 'yearly',
    bedrooms: 1, bathrooms: 0, toilets: 1, sizeSqm: 18,
    address: 'Rumuola Road, Rumuola', neighborhood: 'Rumuola', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8156, longitude: 7.0134,
    amenities: ['Security', 'Water Supply', 'Borehole'],
    features: ['Tiled Floor', 'Painted Walls', 'Compound Light'],
    images: ['single-room-rumuola-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a6', views: 312, enquiries: 18,
    yearBuilt: 2018, parkingSpaces: 0, createdAt: '2026-02-10'
  },
  {
    id: 'r2', slug: 'two-rooms-for-rent-trans-amadi-ph-r002',
    title: 'Two Rooms — Trans Amadi',
    description: 'Two separate rooms with shared toilet and bathroom in a well-secured compound. Good for couples or two working professionals. Easy access to Trans Amadi Industrial Layout.',
    propertyType: 'two_rooms', listingType: 'rent',
    price: 320000, pricePeriod: 'yearly',
    bedrooms: 2, bathrooms: 0, toilets: 1, sizeSqm: 36,
    address: 'Aba Expressway, Trans Amadi', neighborhood: 'Trans Amadi', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8234, longitude: 7.0312,
    amenities: ['Security', 'Borehole', 'Compound Parking'],
    features: ['Tiled Floor', 'Separate Entrance', 'Compound Light'],
    images: ['two-rooms-trans-amadi-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a5', views: 198, enquiries: 11,
    yearBuilt: 2015, parkingSpaces: 0, createdAt: '2026-01-20'
  },
  {
    id: 'r3', slug: 'room-and-parlour-for-rent-rumuola-ph-r003',
    title: 'Room & Parlour — Rumuola',
    description: 'Spacious room and parlour with private toilet and bathroom. Newly painted with tiles throughout. Compound has steady borehole water and 24-hr security.',
    propertyType: 'room_parlour', listingType: 'rent',
    price: 480000, pricePeriod: 'yearly',
    bedrooms: 1, bathrooms: 1, toilets: 1, sizeSqm: 45,
    address: 'Elelenwo Road, Rumuola', neighborhood: 'Rumuola', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8189, longitude: 7.0098,
    amenities: ['Security', 'Borehole', 'Prepaid Meter'],
    features: ['Private Toilet', 'Tiled Floor', 'Kitchen Space', 'Compound Parking'],
    images: ['room-parlour-rumuola-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: true,
    status: 'active', agentId: 'a6', views: 445, enquiries: 28,
    yearBuilt: 2020, parkingSpaces: 1, createdAt: '2026-03-01'
  },
  {
    id: 'r4', slug: 'self-contained-for-rent-woji-ph-r004',
    title: 'Self Contained — Woji',
    description: 'Modern self-contained apartment in a gated estate. Open plan layout with kitchenette, private bathroom and toilet. Perfect for a young professional.',
    propertyType: 'self_contained', listingType: 'rent',
    price: 650000, pricePeriod: 'yearly',
    bedrooms: 1, bathrooms: 1, toilets: 1, sizeSqm: 38,
    address: 'Green Estate, Woji Road', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8301, longitude: 7.0189,
    amenities: ['24-hr Security', 'Borehole', 'CCTV', 'Prepaid Meter', 'Gym Access'],
    features: ['Kitchenette', 'Ensuite Bathroom', 'Wardrobe Space', 'Private Balcony'],
    images: ['self-contained-woji-1'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: true,
    status: 'active', agentId: 'a3', views: 876, enquiries: 54,
    yearBuilt: 2023, parkingSpaces: 1, createdAt: '2026-03-05'
  },
  {
    id: 'r5', slug: 'bedsitter-for-rent-trans-amadi-ph-r005',
    title: 'Luxury Bedsitter — Trans Amadi',
    description: 'Well-furnished bedsitter with combined sleeping and living area, private kitchenette and modern bathroom. Suited for oil company workers and corporate professionals.',
    propertyType: 'bedsitter', listingType: 'rent',
    price: 550000, pricePeriod: 'yearly',
    bedrooms: 1, bathrooms: 1, toilets: 1, sizeSqm: 32,
    address: 'Industrial Close, Trans Amadi', neighborhood: 'Trans Amadi', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8267, longitude: 7.0345,
    amenities: ['Prepaid Meter', 'Borehole', 'Security', 'Parking'],
    features: ['Furnished', 'Air Conditioning', 'Private Kitchen', 'Modern Bathroom'],
    images: ['bedsitter-trans-amadi-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a5', views: 543, enquiries: 31,
    yearBuilt: 2021, parkingSpaces: 1, createdAt: '2026-02-14'
  },
  {
    id: 'r6', slug: 'store-for-rent-trans-amadi-ph-r006',
    title: 'Commercial Store — Trans Amadi Industrial',
    description: 'Large ground-floor store in Trans Amadi Industrial Layout. High ceiling, roller shutter doors, and easy truck access. Ideal for storage, light manufacturing, or distribution.',
    propertyType: 'store', listingType: 'rent',
    price: 2400000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 1, toilets: 1, sizeSqm: 280,
    address: 'Industrial Layout, Trans Amadi', neighborhood: 'Trans Amadi', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8245, longitude: 7.0367,
    amenities: ['24-hr Security', 'CCTV', 'Loading Bay', 'Perimeter Fencing'],
    features: ['Roller Shutter', 'High Ceiling', 'Truck Access', 'Concrete Floor', '3-Phase Power'],
    images: ['store-trans-amadi-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a5', views: 234, enquiries: 14,
    yearBuilt: 2017, parkingSpaces: 4, createdAt: '2026-01-08'
  },
  {
    id: 'r7', slug: 'one-bedroom-flat-for-rent-rumuola-ph-r007',
    title: 'Modern 1-Bedroom Flat — Rumuola',
    description: 'Tastefully finished 1-bedroom flat in a serene compound. Spacious living room, modern kitchen with cabinets, and ensuite master bedroom. Close to PH Airport.',
    propertyType: 'one_bedroom_flat', listingType: 'rent',
    price: 900000, pricePeriod: 'yearly',
    bedrooms: 1, bathrooms: 1, toilets: 2, sizeSqm: 65,
    address: 'Airport Road, Rumuola', neighborhood: 'Rumuola', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8145, longitude: 7.0067,
    amenities: ['Borehole', 'Prepaid Meter', 'Security', 'Parking', 'Generator'],
    features: ['Kitchen Cabinets', 'Wardrobe', 'POP Ceiling', 'Tiled Floor', 'Ensuite'],
    images: ['1bed-rumuola-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a6', views: 723, enquiries: 42,
    yearBuilt: 2022, parkingSpaces: 1, createdAt: '2026-02-18'
  },
  {
    id: 'r8', slug: 'two-bedroom-flat-for-rent-woji-ph-r008',
    title: 'Executive 2-Bedroom Flat — Woji',
    description: 'Premium 2-bedroom flat in a gated estate in Woji. Both bedrooms are ensuite. Open plan kitchen and dining, large living room with balcony. Ideal for small families.',
    propertyType: 'two_bedroom_flat', listingType: 'rent',
    price: 1800000, pricePeriod: 'yearly',
    bedrooms: 2, bathrooms: 2, toilets: 3, sizeSqm: 110,
    address: 'Palm Court Estate, Woji', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8312, longitude: 7.0201,
    amenities: ['24-hr Security', 'Borehole', 'CCTV', 'Generator', 'Swimming Pool', 'Gym'],
    features: ['Both Ensuite', 'Open Plan Kitchen', 'Balcony', 'Kitchen Cabinets', 'POP Ceiling', 'Wardrobe'],
    images: ['2bed-woji-1'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: true,
    status: 'active', agentId: 'a3', views: 1234, enquiries: 87,
    yearBuilt: 2024, parkingSpaces: 2, createdAt: '2026-03-08'
  },
  {
    id: 'r9', slug: 'three-bedroom-flat-for-rent-gra-ph-r009',
    title: 'Luxury 3-Bedroom Flat — GRA Phase 2',
    description: 'Fully serviced 3-bedroom apartment in a prestigious GRA compound. All rooms ensuite, American kitchen, large living and dining areas. Suitable for expatriates and senior executives.',
    propertyType: 'three_bedroom_flat', listingType: 'rent',
    price: 6500000, pricePeriod: 'yearly',
    bedrooms: 3, bathrooms: 3, toilets: 4, sizeSqm: 220,
    address: 'Aba Road, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8089, longitude: 7.0456,
    amenities: ['24-hr Security', 'CCTV', 'Generator', 'Borehole', 'Swimming Pool', 'Gym', 'Parking'],
    features: ['All Ensuite', 'American Kitchen', 'Marble Floors', 'Smart Home', 'Home Theatre', 'Study Room'],
    images: ['3bed-gra-1'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a1', views: 2341, enquiries: 143,
    yearBuilt: 2023, parkingSpaces: 3, createdAt: '2026-01-15'
  },
  {
    id: 'r10', slug: 'four-bedroom-flat-for-rent-old-gra-ph-r010',
    title: '4-Bedroom Flat — Old GRA',
    description: 'Spacious 4-bedroom flat in a quiet Old GRA compound. Ideal for large families and executives. Comes with a BQ (boys quarters), large compound, and 24-hr security.',
    propertyType: 'four_bedroom_flat', listingType: 'rent',
    price: 9000000, pricePeriod: 'yearly',
    bedrooms: 4, bathrooms: 4, toilets: 5, sizeSqm: 310,
    address: 'Old Station Road, Old GRA', neighborhood: 'Old GRA', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8067, longitude: 7.0423,
    amenities: ['24-hr Security', 'Generator', 'Borehole', 'CCTV', 'BQ'],
    features: ['Boys Quarters', 'All Ensuite', 'Large Compound', 'Study Room', 'Pantry'],
    images: ['4bed-old-gra-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a2', views: 876, enquiries: 52,
    yearBuilt: 2019, parkingSpaces: 4, createdAt: '2026-02-05'
  },
  {
    id: 'r11', slug: 'bungalow-for-rent-eleme-ph-r011',
    title: '3-Bedroom Bungalow — Eleme',
    description: 'Detached 3-bedroom bungalow with large garden. Ideal for NLNG staff and oil company families. Quiet street, 24-hr security, reliable power from NLNG substation nearby.',
    propertyType: 'bungalow', listingType: 'rent',
    price: 4500000, pricePeriod: 'yearly',
    bedrooms: 3, bathrooms: 3, toilets: 4, sizeSqm: 210,
    address: 'Aleto Road, Eleme', neighborhood: 'Eleme', lga: 'Eleme', state: 'Rivers',
    latitude: 4.7934, longitude: 7.1089,
    amenities: ['24-hr Security', 'Generator', 'Borehole', 'Garden', 'BQ'],
    features: ['Large Garden', 'BQ', 'Tiled Throughout', 'Wardrobe', 'Carport'],
    images: ['bungalow-eleme-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a4', views: 654, enquiries: 38,
    yearBuilt: 2018, parkingSpaces: 2, createdAt: '2026-02-22'
  },
  {
    id: 'r12', slug: 'three-room-duplex-for-rent-woji-ph-r012',
    title: '3-Room Duplex — Woji',
    description: 'Compact but well-designed 3-room duplex with private entrance, separate upstairs and downstairs living areas. Perfect for a small family that wants duplex living at an accessible price.',
    propertyType: 'three_room_duplex', listingType: 'rent',
    price: 2200000, pricePeriod: 'yearly',
    bedrooms: 3, bathrooms: 2, toilets: 3, sizeSqm: 145,
    address: 'Ezimgbu Street, Woji', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8289, longitude: 7.0178,
    amenities: ['Security', 'Borehole', 'Prepaid Meter', 'Parking'],
    features: ['Private Entrance', 'Upstairs Balcony', 'Kitchen Cabinets', 'Wardrobe'],
    images: ['3room-duplex-woji-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a3', views: 567, enquiries: 33,
    yearBuilt: 2021, parkingSpaces: 1, createdAt: '2026-02-28'
  },
  {
    id: 'r13', slug: 'mini-flat-for-rent-rumuola-ph-r013',
    title: 'Mini Flat — Rumuola',
    description: 'Neat mini flat with combined bedroom and sitting area, separate kitchen and modern bathroom. Great value in a rapidly developing area near PH Airport.',
    propertyType: 'mini_flat', listingType: 'rent',
    price: 700000, pricePeriod: 'yearly',
    bedrooms: 1, bathrooms: 1, toilets: 1, sizeSqm: 52,
    address: 'New Layout, Rumuola', neighborhood: 'Rumuola', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8167, longitude: 7.0089,
    amenities: ['Borehole', 'Security', 'Prepaid Meter'],
    features: ['Separate Kitchen', 'Modern Bathroom', 'Tiled Floor', 'POP Ceiling'],
    images: ['mini-flat-rumuola-1'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: true,
    status: 'active', agentId: 'a6', views: 389, enquiries: 22,
    yearBuilt: 2022, parkingSpaces: 1, createdAt: '2026-03-03'
  },
  {
    id: 'r14', slug: 'studio-apartment-for-rent-gra-ph-r014',
    title: 'Studio Apartment — GRA Phase 2',
    description: 'Sleek studio apartment in a premium GRA serviced building. Fully furnished option available. High-speed WiFi, backup power, and concierge service. Ideal for corporate short-stay.',
    propertyType: 'studio', listingType: 'rent',
    price: 2800000, pricePeriod: 'yearly',
    bedrooms: 1, bathrooms: 1, toilets: 1, sizeSqm: 48,
    address: 'Diamond Hill, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8098, longitude: 7.0478,
    amenities: ['24-hr Security', 'Generator', 'WiFi', 'Swimming Pool', 'Concierge', 'CCTV'],
    features: ['Fully Furnished Option', 'Smart TV', 'Air Conditioning', 'Work Desk'],
    images: ['studio-gra-1'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: true,
    status: 'active', agentId: 'a1', views: 1456, enquiries: 98,
    yearBuilt: 2024, parkingSpaces: 1, createdAt: '2026-03-10'
  },
  {
    id: 'r15', slug: 'four-bedroom-duplex-for-rent-gra-ph-r015',
    title: '4-Bedroom Duplex — GRA Phase 2',
    description: 'Magnificent 4-bedroom fully detached duplex in the heart of GRA Phase 2. Corporate and expat standard with BQ, smart home features, and a private swimming pool.',
    propertyType: 'duplex', listingType: 'rent',
    price: 14000000, pricePeriod: 'yearly',
    bedrooms: 4, bathrooms: 5, toilets: 6, sizeSqm: 450,
    address: 'Peter Odili Road, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8112, longitude: 7.0467,
    amenities: ['Private Pool', '24-hr Security', 'CCTV', 'Generator', 'BQ', 'Smart Home'],
    features: ['Private Pool', 'BQ', 'Smart Home', 'Cinema Room', 'Home Office', 'All Ensuite'],
    images: ['4bed-duplex-gra-1'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a1', views: 3211, enquiries: 187,
    yearBuilt: 2023, parkingSpaces: 4, createdAt: '2026-01-10'
  },
]

// ── Extended Shortlet Listings ──────────────────────────────────────────────
export const shortletListings: Property[] = [
  {
    id: 's1', slug: 'studio-shortlet-gra-phase-2-ph-s001',
    title: 'The GRA Studio — Minimalist Luxury',
    description: 'A sleek, architect-designed studio shortlet in the heart of GRA Phase 2. Ideal for solo business travellers. Includes a Nespresso machine, rainfall shower, smart lighting, and curated Nigerian art.',
    propertyType: 'studio', listingType: 'shortlet',
    price: 35000, pricePeriod: 'per_night',
    bedrooms: 1, bathrooms: 1, toilets: 1, sizeSqm: 52,
    address: 'Aba Road, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8102, longitude: 7.0461,
    amenities: ['24-hr Security', 'WiFi 100Mbps', 'Generator', 'Air Conditioning', 'Smart TV', 'CCTV'],
    features: ['Nespresso Machine', 'Rainfall Shower', 'Smart Lighting', 'Nigerian Art', 'Work Desk', 'Blackout Curtains'],
    images: ['studio-gra-shortlet-1'], virtualTour: true, isVerified: true, isFeatured: false, isNew: true,
    status: 'active', agentId: 'a1', views: 1876, enquiries: 112, yearBuilt: 2024, parkingSpaces: 1, createdAt: '2026-03-01'
  },
  {
    id: 's2', slug: '3-bedroom-villa-shortlet-old-gra-ph-s002',
    title: 'The Heritage Villa — Old GRA',
    description: 'A stunning 3-bedroom colonial-era villa fully restored to modern luxury standards. Private pool, lush tropical garden, chef-equipped kitchen, and a private cinema room. Perfect for families and executive retreats.',
    propertyType: 'mansion', listingType: 'shortlet',
    price: 180000, pricePeriod: 'per_night',
    bedrooms: 3, bathrooms: 3, toilets: 4, sizeSqm: 380,
    address: 'Old Station Road, Old GRA', neighborhood: 'Old GRA', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8071, longitude: 7.0431,
    amenities: ['Private Pool', '24-hr Security', 'WiFi', 'Generator', 'Air Conditioning', 'Smart TV', 'CCTV', 'Chef Service'],
    features: ['Private Pool', 'Cinema Room', 'Chef Kitchen', 'Tropical Garden', 'Concierge', 'Airport Transfer'],
    images: ['villa-old-gra-1'], virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a2', views: 5421, enquiries: 287, yearBuilt: 1962, parkingSpaces: 4, createdAt: '2026-01-05'
  },
  {
    id: 's3', slug: '2-bedroom-shortlet-trans-amadi-ph-s003',
    title: 'Executive Suite — Trans Amadi',
    description: 'Purpose-built executive shortlet for oil & gas professionals. Close to SPDC, Agip, and Trans Amadi Industrial Layout. Comes with a dedicated work desk, printer, video conferencing setup, and complimentary breakfast.',
    propertyType: 'apartment', listingType: 'shortlet',
    price: 55000, pricePeriod: 'per_night',
    bedrooms: 2, bathrooms: 2, toilets: 2, sizeSqm: 115,
    address: 'Industrial Close, Trans Amadi', neighborhood: 'Trans Amadi', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8271, longitude: 7.0351,
    amenities: ['WiFi 200Mbps', 'Generator', 'Air Conditioning', 'Smart TV', 'Security', 'Parking', 'CCTV'],
    features: ['Video Conferencing Setup', 'Printer', 'Complimentary Breakfast', 'Work Desk', 'Ironing Service', 'Daily Housekeeping'],
    images: ['exec-trans-amadi-1'], virtualTour: false, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a5', views: 3102, enquiries: 167, yearBuilt: 2022, parkingSpaces: 2, createdAt: '2026-01-20'
  },
  {
    id: 's4', slug: 'penthouse-shortlet-woji-ph-s004',
    title: 'The Woji Penthouse — Sky Living',
    description: 'Port Harcourt\'s most premium shortlet experience. Full-floor penthouse with panoramic city views, rooftop terrace, private plunge pool, and personal butler service. Minimum 3 nights.',
    propertyType: 'penthouse', listingType: 'shortlet',
    price: 350000, pricePeriod: 'per_night',
    bedrooms: 4, bathrooms: 4, toilets: 5, sizeSqm: 520,
    address: 'Woji Towers, Woji Road', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8269, longitude: 7.0601,
    amenities: ['Rooftop Terrace', 'Plunge Pool', 'Butler Service', 'WiFi', 'Generator', 'Smart Home', 'Gym', 'Concierge'],
    features: ['Butler Service', 'Plunge Pool', 'Panoramic Views', 'Smart Home', 'Home Cinema', 'Wine Fridge', 'Airport Transfer'],
    images: ['penthouse-woji-shortlet-1'], virtualTour: true, isVerified: true, isFeatured: true, isNew: true,
    status: 'active', agentId: 'a4', views: 8934, enquiries: 421, yearBuilt: 2025, parkingSpaces: 4, floorLevel: 18, totalFloors: 18, createdAt: '2026-03-10'
  },
  {
    id: 's5', slug: '1-bedroom-shortlet-rumuola-ph-s005',
    title: 'The Rumuola Nest — Cosy & Modern',
    description: 'Affordable, stylish 1-bedroom shortlet perfect for budget-conscious travellers and domestic tourists. Modern interiors, fast WiFi, and a fully equipped kitchen. Near PH Airport.',
    propertyType: 'self_contained', listingType: 'shortlet',
    price: 22000, pricePeriod: 'per_night',
    bedrooms: 1, bathrooms: 1, toilets: 1, sizeSqm: 58,
    address: 'Airport Road, Rumuola', neighborhood: 'Rumuola', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8149, longitude: 7.0071,
    amenities: ['WiFi', 'Generator', 'Air Conditioning', 'Smart TV', 'Security', 'Parking'],
    features: ['Fully Equipped Kitchen', 'Netflix', 'Iron & Board', 'Self Check-in', 'Airport Nearby'],
    images: ['rumuola-nest-1'], virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a6', views: 2341, enquiries: 143, yearBuilt: 2022, parkingSpaces: 1, createdAt: '2026-02-15'
  },
  {
    id: 's6', slug: '4-bedroom-family-shortlet-woji-ph-s006',
    title: 'The Woji Family Estate — 4 Beds',
    description: 'Spacious 4-bedroom fully furnished shortlet designed for families and group travellers. Each bedroom is ensuite. Has a large garden, children\'s play area, BBQ terrace, and a dedicated family lounge.',
    propertyType: 'duplex', listingType: 'shortlet',
    price: 145000, pricePeriod: 'per_night',
    bedrooms: 4, bathrooms: 4, toilets: 5, sizeSqm: 380,
    address: 'Palm Estate, Woji Road', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8305, longitude: 7.0195,
    amenities: ['Garden', 'BBQ Terrace', 'WiFi', 'Generator', 'Security', 'Air Conditioning', 'Smart TV', 'Parking'],
    features: ['Children\'s Play Area', 'BBQ Terrace', 'All Ensuite', 'Family Lounge', 'Cots Available', 'Board Games'],
    images: ['family-woji-1'], virtualTour: true, isVerified: true, isFeatured: true, isNew: true,
    status: 'active', agentId: 'a3', views: 4231, enquiries: 198, yearBuilt: 2023, parkingSpaces: 3, createdAt: '2026-02-28'
  },
  {
    id: 's7', slug: '2-bedroom-shortlet-eleme-ph-s007',
    title: 'NLNG Executive Apartment — Eleme',
    description: 'Purpose-built for NLNG and refinery workers on rotation. 2-bedroom fully serviced apartment with international TV channels, airport transfers, and a dedicated concierge for oil & gas professionals.',
    propertyType: 'apartment', listingType: 'shortlet',
    price: 65000, pricePeriod: 'per_night',
    bedrooms: 2, bathrooms: 2, toilets: 2, sizeSqm: 120,
    address: 'Aleto Road, Eleme', neighborhood: 'Eleme', lga: 'Eleme', state: 'Rivers',
    latitude: 4.7938, longitude: 7.1091,
    amenities: ['WiFi', 'Generator', 'Air Conditioning', 'Smart TV', 'Security', 'Parking', 'Laundry'],
    features: ['International TV Channels', 'Airport Transfer', 'Weekly Housekeeping', 'Dedicated Concierge', 'Oil & Gas Wi-Fi Package'],
    images: ['nlng-eleme-1'], virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a4', views: 1876, enquiries: 94, yearBuilt: 2021, parkingSpaces: 2, createdAt: '2026-02-10'
  },
  {
    id: 's8', slug: '3-bedroom-shortlet-gra-ph-s008',
    title: 'The GRA Prestige — 3-Bed Serviced',
    description: 'Flagship 3-bedroom serviced apartment in GRA Phase 2. Marble floors, bespoke Nigerian furniture, and a private terrace. Includes daily breakfast, evening turndown, and personal grocery stocking on request.',
    propertyType: 'three_bedroom_flat', listingType: 'shortlet',
    price: 120000, pricePeriod: 'per_night',
    bedrooms: 3, bathrooms: 3, toilets: 4, sizeSqm: 240,
    address: 'Peter Odili Road, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8115, longitude: 7.0469,
    amenities: ['24-hr Security', 'WiFi 200Mbps', 'Generator', 'Air Conditioning', 'Smart TV', 'Pool Access', 'Gym', 'Concierge'],
    features: ['Daily Breakfast', 'Evening Turndown', 'Grocery Stocking', 'Private Terrace', 'Marble Floors', 'Bespoke Furniture'],
    images: ['gra-prestige-1'], virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a1', views: 6712, enquiries: 334, yearBuilt: 2023, parkingSpaces: 3, createdAt: '2026-01-15'
  },
]

// ── Commercial Listings ────────────────────────────────────────────────────
export const commercialListings: Property[] = [
  {
    id: 'c1', slug: 'grade-a-office-gra-ph-c001',
    title: 'Grade A Office Floor — GRA Phase 2',
    description: 'Prestigious full-floor Grade A office in PH\'s premier business address. Floor-to-ceiling glazing, raised access floors, BMS-controlled HVAC, and a dedicated reception lobby. Ideal for oil majors, banks, and corporate headquarters.',
    propertyType: 'commercial', listingType: 'lease',
    price: 28000000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 6, toilets: 8, sizeSqm: 1200,
    address: 'Plot 5, Peter Odili Road, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8118, longitude: 7.0471,
    amenities: ['Industrial Generator', 'Central Air Conditioning', 'Passenger Lift', 'CCTV', '24-hr Security', 'Parking (50 spaces)', 'Server Room', 'Fibre Internet'],
    features: ['Grade A Spec', 'Full Floor', 'BMS HVAC', 'Raised Access Floors', 'Dedicated Reception', 'Conference Suite', 'Pantry', 'Card Access'],
    images: ['grade-a-gra-1'], virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a5', views: 3241, enquiries: 87, yearBuilt: 2022, parkingSpaces: 50, createdAt: '2026-01-10'
  },
  {
    id: 'c2', slug: 'serviced-office-trans-amadi-ph-c002',
    title: 'Serviced Office Suites — Trans Amadi',
    description: 'Plug-and-play serviced offices for 5–50 people. Available from monthly terms. Includes receptionist, meeting rooms, high-speed internet, and shared amenities. No fit-out costs. Move in today.',
    propertyType: 'commercial', listingType: 'lease',
    price: 850000, pricePeriod: 'monthly',
    bedrooms: 0, bathrooms: 2, toilets: 3, sizeSqm: 120,
    address: 'Industrial Layout, Trans Amadi', neighborhood: 'Trans Amadi', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8267, longitude: 7.0812,
    amenities: ['WiFi 1Gbps', 'Generator', 'Air Conditioning', 'Receptionist', 'Parking', 'CCTV', 'Printer/Copier'],
    features: ['Fully Furnished', 'Meeting Rooms', 'Hot Desks', 'Breakout Areas', 'Monthly Leases', 'Mail Handling', 'IT Support'],
    images: ['serviced-office-ta-1'], virtualTour: true, isVerified: true, isFeatured: true, isNew: true,
    status: 'active', agentId: 'a5', views: 2876, enquiries: 134, yearBuilt: 2023, parkingSpaces: 15, createdAt: '2026-02-15'
  },
  {
    id: 'c3', slug: 'retail-shop-rumuola-ph-c003',
    title: 'Prime Retail Shop — Rumuola Junction',
    description: 'High-footfall retail space on Rumuola\'s main commercial corridor. Ground-floor corner unit with maximum street visibility. Glass frontage, high ceilings, and rear storage room. Suitable for pharmacy, fashion, electronics, or FMCG.',
    propertyType: 'commercial', listingType: 'lease',
    price: 3500000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 1, toilets: 1, sizeSqm: 85,
    address: 'Rumuola Junction, Rumuola Road', neighborhood: 'Rumuola', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8191, longitude: 7.0102,
    amenities: ['Security', 'Prepaid Meter', 'Borehole', 'Parking'],
    features: ['Corner Unit', 'Glass Frontage', 'High Ceiling', 'Storage Room', 'High Footfall', 'Signage Rights'],
    images: ['retail-rumuola-1'], virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a6', views: 1234, enquiries: 45, yearBuilt: 2019, parkingSpaces: 3, createdAt: '2026-02-01'
  },
  {
    id: 'c4', slug: 'warehouse-trans-amadi-ph-c004',
    title: 'Industrial Warehouse — 2,000 sqm, Trans Amadi',
    description: 'Large-span industrial warehouse with 12m clear height, 4 dock-level loading bays, and 3-phase power. Sprinkler-fitted and CCTV-monitored. Ideal for FMCG, logistics, oil equipment storage, and light manufacturing.',
    propertyType: 'commercial', listingType: 'lease',
    price: 18000000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 4, toilets: 6, sizeSqm: 2000,
    address: 'Port Harcourt Industrial Area, Trans Amadi', neighborhood: 'Trans Amadi', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8312, longitude: 7.0867,
    amenities: ['3-Phase Power', 'Industrial Generator', 'CCTV', '24-hr Security', 'Loading Bays', 'Perimeter Fencing', 'Fire Suppression'],
    features: ['12m Clear Height', '4 Loading Bays', 'Sprinkler System', 'Office Mezzanine', 'Truck Access', 'Weighbridge'],
    images: ['warehouse-ta-1'], virtualTour: false, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a5', views: 1876, enquiries: 38, yearBuilt: 2018, parkingSpaces: 20, createdAt: '2026-01-20'
  },
  {
    id: 'c5', slug: 'filling-station-eleme-ph-c005',
    title: 'Petrol Station — Eleme Expressway',
    description: 'Fully operational filling station on the Eleme Expressway with 6 pumps, underground tanks (60,000L capacity), a convenience store, and car wash bay. Strong daily throughput from NLNG and refinery traffic.',
    propertyType: 'commercial', listingType: 'lease',
    price: 24000000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 2, toilets: 2, sizeSqm: 1500,
    address: 'Eleme Expressway, Eleme', neighborhood: 'Eleme', lga: 'Eleme', state: 'Rivers',
    latitude: 4.7945, longitude: 7.1102,
    amenities: ['Industrial Generator', '24-hr Security', 'CCTV', 'Underground Tanks', 'Air Compressor'],
    features: ['6 Pump Islands', '60K Litre Tanks', 'Convenience Store', 'Car Wash Bay', 'Canopy', 'DPR Licensed'],
    images: ['filling-station-eleme-1'], virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a4', views: 2341, enquiries: 67, yearBuilt: 2016, parkingSpaces: 20, createdAt: '2026-02-08'
  },
  {
    id: 'c6', slug: 'hotel-old-gra-ph-c006',
    title: 'Boutique Hotel — 18 Rooms, Old GRA',
    description: 'Fully operational 18-room boutique hotel in Old GRA. Running at 70% occupancy. Includes a restaurant, bar, conference room, and swimming pool. Offered for lease as a going concern. Strong corporate and government clientele.',
    propertyType: 'commercial', listingType: 'lease',
    price: 65000000, pricePeriod: 'yearly',
    bedrooms: 18, bathrooms: 18, toilets: 22, sizeSqm: 2800,
    address: 'Old Station Road, Old GRA', neighborhood: 'Old GRA', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8074, longitude: 7.0438,
    amenities: ['Swimming Pool', 'Restaurant', 'Bar', 'Industrial Generator', 'CCTV', '24-hr Security', 'Parking', 'Laundry'],
    features: ['18 Rooms', 'Restaurant', 'Bar', 'Conference Room', 'Pool', '70% Occupancy', 'Going Concern', 'Staff Included'],
    images: ['hotel-old-gra-1'], virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a2', views: 4521, enquiries: 112, yearBuilt: 2014, parkingSpaces: 30, createdAt: '2026-01-05'
  },
  {
    id: 'c7', slug: 'plaza-woji-ph-c007',
    title: 'Commercial Plaza — 12 Units, Woji',
    description: 'Brand new 12-unit commercial plaza in the heart of Woji\'s growing retail corridor. Units from 40–120 sqm available individually. Strong anchor tenant already in place. Ideal for banks, telecoms, food chains, and boutiques.',
    propertyType: 'commercial', listingType: 'lease',
    price: 4200000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 2, toilets: 3, sizeSqm: 100,
    address: 'Woji Road, Woji', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8295, longitude: 7.0201,
    amenities: ['Generator', 'Security', 'CCTV', 'Parking', 'Borehole', 'Prepaid Meter'],
    features: ['Brand New', 'Individual Units', 'Anchor Tenant', 'Signage Rights', 'High Visibility', 'Common Area'],
    images: ['plaza-woji-1'], virtualTour: false, isVerified: true, isFeatured: false, isNew: true,
    status: 'active', agentId: 'a3', views: 1567, enquiries: 56, yearBuilt: 2025, parkingSpaces: 25, createdAt: '2026-03-05'
  },
  {
    id: 'c8', slug: 'event-centre-gra-ph-c008',
    title: 'Event Centre & Conference Hall — GRA',
    description: 'Premium event centre seating 500 guests. Includes a main hall, VIP lounge, bridal suite, full commercial kitchen, and outdoor terrace. Available daily, weekly, or on annual lease. Fully air-conditioned with backup power.',
    propertyType: 'commercial', listingType: 'lease',
    price: 45000000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 8, toilets: 12, sizeSqm: 3500,
    address: 'Aba Road, GRA Phase 2', neighborhood: 'GRA Phase 2', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8109, longitude: 7.0456,
    amenities: ['Industrial Generator', 'Central AC', '24-hr Security', 'CCTV', 'Parking (100 cars)', 'Commercial Kitchen'],
    features: ['500-Seat Capacity', 'VIP Lounge', 'Bridal Suite', 'Commercial Kitchen', 'Outdoor Terrace', 'AV System', 'Staging'],
    images: ['event-centre-gra-1'], virtualTour: true, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a1', views: 2876, enquiries: 98, yearBuilt: 2021, parkingSpaces: 100, createdAt: '2026-02-10'
  },
  {
    id: 'c9', slug: 'land-commercial-trans-amadi-ph-c009',
    title: 'Commercial Land — 5,000 sqm, Trans Amadi',
    description: 'Prime industrial and commercial land on Trans Amadi\'s main spine road. Fully fenced with C-of-O, road access from two sides, and existing perimeter security. Suitable for logistics hub, production facility, or commercial complex.',
    propertyType: 'land', listingType: 'sale',
    price: 380000000, pricePeriod: 'total',
    bedrooms: 0, bathrooms: 0, toilets: 0, sizeSqm: 5000,
    address: 'Spine Road, Trans Amadi Industrial', neighborhood: 'Trans Amadi', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8334, longitude: 7.0834,
    amenities: ['Perimeter Fencing', 'Security Post', 'Road Access', 'Drainage'],
    features: ['C-of-O', 'Dual Road Access', 'Fully Fenced', 'Survey Plan', 'Industrial Zone', 'Utilities Available'],
    images: ['land-ta-commercial-1'], virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    status: 'active', agentId: 'a5', views: 987, enquiries: 22, yearBuilt: 0, parkingSpaces: 0, createdAt: '2026-01-28'
  },
  {
    id: 'c10', slug: 'medical-clinic-rumuola-ph-c010',
    title: 'Medical Clinic Space — Rumuola',
    description: 'Purpose-built medical facility suitable for a clinic, diagnostic centre, or specialist practice. Includes consultation rooms, a laboratory space, waiting area, and a pharmacy unit. All plumbing and medical gas connections in place.',
    propertyType: 'commercial', listingType: 'lease',
    price: 7500000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 4, toilets: 6, sizeSqm: 320,
    address: 'Rumuola Road, Rumuola', neighborhood: 'Rumuola', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8178, longitude: 7.0089,
    amenities: ['Generator', 'Air Conditioning', 'Security', 'Parking', 'Borehole', 'CCTV'],
    features: ['6 Consultation Rooms', 'Lab Space', 'Pharmacy Unit', 'Waiting Area', 'Medical Gas', 'Accessible Entrance'],
    images: ['clinic-rumuola-1'], virtualTour: false, isVerified: true, isFeatured: false, isNew: true,
    status: 'active', agentId: 'a6', views: 1234, enquiries: 43, yearBuilt: 2023, parkingSpaces: 10, createdAt: '2026-03-02'
  },
  {
    id: 'c11', slug: 'open-plan-office-woji-ph-c011',
    title: 'Open Plan Office — 450 sqm, Woji',
    description: 'Modern open-plan office floor in a new Woji development. Cat-6 cabling throughout, suspended ceilings, LED lighting, and fully glazed facade. Suitable for tech companies, agencies, and fast-growing businesses.',
    propertyType: 'commercial', listingType: 'lease',
    price: 9500000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 3, toilets: 4, sizeSqm: 450,
    address: 'Ezimgbu Road, Woji', neighborhood: 'Woji', lga: 'Obio-Akpor', state: 'Rivers',
    latitude: 4.8281, longitude: 7.0189,
    amenities: ['Generator', 'Central AC', 'Lift', 'CCTV', 'Security', 'Parking', 'Fibre Internet'],
    features: ['Open Plan', 'Cat-6 Cabling', 'Suspended Ceiling', 'LED Lighting', 'Glass Facade', '2 Meeting Rooms', 'Pantry'],
    images: ['open-plan-woji-1'], virtualTour: true, isVerified: true, isFeatured: false, isNew: true,
    status: 'active', agentId: 'a3', views: 1456, enquiries: 61, yearBuilt: 2024, parkingSpaces: 20, createdAt: '2026-03-08'
  },
  {
    id: 'c12', slug: 'bank-branch-space-old-gra-ph-c012',
    title: 'Bank-Ready Branch Space — Old GRA',
    description: 'Ground-floor commercial space pre-configured for a banking hall. Steel vault room, reinforced walls, fire-rated doors, generator room, and UPS-ready electrical system. Previously occupied by a tier-2 bank.',
    propertyType: 'commercial', listingType: 'lease',
    price: 14000000, pricePeriod: 'yearly',
    bedrooms: 0, bathrooms: 2, toilets: 4, sizeSqm: 380,
    address: 'Old Station Road, Old GRA', neighborhood: 'Old GRA', lga: 'Port Harcourt', state: 'Rivers',
    latitude: 4.8068, longitude: 7.0426,
    amenities: ['Industrial Generator', 'UPS System', 'CCTV', '24-hr Security', 'AC', 'Parking'],
    features: ['Vault Room', 'Reinforced Walls', 'Fire-Rated Doors', 'ATM Space', 'UPS Ready', 'High-Voltage Electrical', 'Accessible'],
    images: ['bank-old-gra-1'], virtualTour: false, isVerified: true, isFeatured: true, isNew: false,
    status: 'active', agentId: 'a2', views: 2187, enquiries: 54, yearBuilt: 2017, parkingSpaces: 12, createdAt: '2026-02-05'
  },
]

// ── New Developments ───────────────────────────────────────────────────────
export interface Development {
  id: string
  slug: string
  name: string
  developer: string
  developerLogo: string
  neighborhood: string
  address: string
  latitude: number
  longitude: number
  type: 'residential' | 'mixed_use' | 'commercial' | 'estate'
  status: 'off_plan' | 'under_construction' | 'ready' | 'sold_out'
  completionDate: string
  totalUnits: number
  availableUnits: number
  priceFrom: number
  priceTo: number
  description: string
  longDescription: string
  amenities: string[]
  unitTypes: { type: string; beds: number; sizeSqm: number; priceFrom: number; available: number }[]
  features: string[]
  gallery: string[]
  virtualTour: boolean
  isVerified: boolean
  isFeatured: boolean
  isNew: boolean
  agentId: string
  views: number
  enquiries: number
  yearBuilt: number
  floors: number
  constructionPct: number
  paymentPlan: string
  warranty: string
  tags: string[]
}

export const newDevelopments: Development[] = [
  {
    id: 'd1', slug: 'ocean-view-towers-gra-phase-2',
    name: 'Ocean View Towers', developer: 'Zenith Properties Nigeria Ltd',
    developerLogo: 'zenith-props', neighborhood: 'GRA Phase 2',
    address: 'Plot 12, Peter Odili Road, GRA Phase 2, Port Harcourt',
    latitude: 4.8121, longitude: 7.0478,
    type: 'residential', status: 'under_construction',
    completionDate: 'Q4 2026', totalUnits: 48, availableUnits: 19,
    priceFrom: 145000000, priceTo: 650000000,
    description: 'Port Harcourt\'s most anticipated luxury residential tower. 22 floors of premium apartments with panoramic views of the Garden City and the Bonny River.',
    longDescription: 'Ocean View Towers redefines luxury living in Port Harcourt. A collaboration between Zenith Properties and award-winning Lagos architect firm Studio Black, the 22-storey tower features floor-to-ceiling glazing, private balconies on every unit, a rooftop infinity pool, and a ground-floor retail podium. Targeting the city\'s oil & gas executives, diaspora returnees, and high-net-worth residents who demand international-standard finishes in the heart of GRA Phase 2.',
    amenities: ['Rooftop Infinity Pool', '24-hr Concierge', 'Residents\' Gym', 'Underground Parking', 'Smart Home System', 'Generator (Full Building)', 'Fibre Internet', 'CCTV & Access Control', 'Children\'s Play Zone', 'Business Lounge'],
    unitTypes: [
      { type: '1-Bedroom', beds: 1, sizeSqm: 85,  priceFrom: 145000000, available: 5 },
      { type: '2-Bedroom', beds: 2, sizeSqm: 145, priceFrom: 245000000, available: 8 },
      { type: '3-Bedroom', beds: 3, sizeSqm: 220, priceFrom: 385000000, available: 4 },
      { type: 'Penthouse', beds: 4, sizeSqm: 480, priceFrom: 650000000, available: 2 },
    ],
    features: ['Floor-to-Ceiling Glazing', 'Italian Marble Floors', 'Miele Kitchen Appliances', 'Smart Lighting', 'Private Balconies', 'Rooftop Infinity Pool', 'Underground Parking'],
    gallery: ['ovt-1', 'ovt-2', 'ovt-3', 'ovt-4'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    agentId: 'a1', views: 12456, enquiries: 487, yearBuilt: 2025, floors: 22,
    constructionPct: 68,
    paymentPlan: '30% deposit · 40% during construction · 30% on completion',
    warranty: '10-year structural · 2-year fixtures & fittings',
    tags: ['Luxury', 'Off-Plan', 'Oil & Gas', 'Investment', 'Panoramic Views'],
  },
  {
    id: 'd2', slug: 'palm-grove-estate-woji',
    name: 'Palm Grove Estate', developer: 'Greenfield Homes Nigeria',
    developerLogo: 'greenfield-homes', neighborhood: 'Woji',
    address: 'Ezimgbu Extension, Woji, Obio-Akpor, Rivers State',
    latitude: 4.8318, longitude: 7.0208,
    type: 'estate', status: 'under_construction',
    completionDate: 'Q2 2026', totalUnits: 24, availableUnits: 11,
    priceFrom: 85000000, priceTo: 195000000,
    description: 'A secure gated estate of 24 luxury detached and semi-detached homes in fast-growing Woji. Solar-powered street lighting, paved roads, and a residents\' clubhouse.',
    longDescription: 'Palm Grove Estate is Greenfield Homes\'s flagship gated community in Port Harcourt\'s most dynamic growth corridor. Designed by leading Nigerian urban planners, the estate features wide internal roads, mature landscaping, a central park, and a fully equipped clubhouse. Every home benefits from individual solar backup, pre-installed smart home wiring, and a 5-year developer warranty.',
    amenities: ['Gated Entry (Biometric)', '24-hr Security', 'Clubhouse & Pool', 'Children\'s Park', 'Solar Street Lighting', 'Paved Roads', 'CCTV', 'Borehole (Estate)', 'Sports Court', 'Visitor Parking'],
    unitTypes: [
      { type: '3-Bed Detached', beds: 3, sizeSqm: 210, priceFrom: 85000000,  available: 4 },
      { type: '4-Bed Detached', beds: 4, sizeSqm: 320, priceFrom: 130000000, available: 5 },
      { type: '5-Bed Detached', beds: 5, sizeSqm: 450, priceFrom: 195000000, available: 2 },
    ],
    features: ['Detached Homes', 'BQ Included', 'Solar Backup', 'Smart Home Wiring', 'Landscaped Garden', 'Carport (2 cars)', 'Perimeter Wall'],
    gallery: ['pge-1', 'pge-2', 'pge-3'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    agentId: 'a3', views: 8923, enquiries: 312, yearBuilt: 2024, floors: 2,
    constructionPct: 85,
    paymentPlan: '25% deposit · 12-month instalment plan available',
    warranty: '5-year structural · 1-year fixtures & fittings',
    tags: ['Gated Estate', 'Family Homes', 'Solar', 'Smart Home', 'Woji'],
  },
  {
    id: 'd3', slug: 'heritage-court-old-gra',
    name: 'Heritage Court', developer: 'Landmark Developments PH',
    developerLogo: 'landmark-ph', neighborhood: 'Old GRA',
    address: 'Old Station Road Extension, Old GRA, Port Harcourt',
    latitude: 4.8079, longitude: 7.0441,
    type: 'residential', status: 'ready',
    completionDate: 'Ready Now', totalUnits: 12, availableUnits: 4,
    priceFrom: 280000000, priceTo: 520000000,
    description: 'Twelve exclusive terraced mansions in the heart of Old GRA. Completed and ready for immediate occupation. Colonial-inspired architecture with ultra-modern interiors.',
    longDescription: 'Heritage Court pays homage to Old GRA\'s colonial architectural heritage while delivering thoroughly modern living standards. Twelve double-plot terraced mansions, each with BQ, private garden, and 3-car garage. Completed and snagged — ready for immediate occupation. This is one of the last premium residential developments in Old GRA\'s most sought-after enclave.',
    amenities: ['Private Garden', '3-Car Garage', 'BQ', 'Swimming Pool (Communal)', '24-hr Security', 'CCTV', 'Generator', 'Borehole'],
    unitTypes: [
      { type: '4-Bed Terrace Mansion', beds: 4, sizeSqm: 380, priceFrom: 280000000, available: 2 },
      { type: '5-Bed Terrace Mansion', beds: 5, sizeSqm: 460, priceFrom: 520000000, available: 2 },
    ],
    features: ['Ready to Move In', 'Private Garden', '3-Car Garage', 'BQ', 'Colonial Architecture', 'Modern Interiors', 'Marble Floors', 'Jacuzzi'],
    gallery: ['hc-1', 'hc-2', 'hc-3'],
    virtualTour: true, isVerified: true, isFeatured: true, isNew: false,
    agentId: 'a2', views: 6712, enquiries: 234, yearBuilt: 2025, floors: 3,
    constructionPct: 100,
    paymentPlan: 'Outright purchase · Mortgage available (select banks)',
    warranty: '3-year snagging warranty included',
    tags: ['Ready Now', 'Luxury', 'Old GRA', 'Terrace Mansion', 'Immediate Occupation'],
  },
  {
    id: 'd4', slug: 'nova-residences-rumuola',
    name: 'Nova Residences', developer: 'Apex Construction Group',
    developerLogo: 'apex-construction', neighborhood: 'Rumuola',
    address: 'Airport Road Corridor, Rumuola, Obio-Akpor',
    latitude: 4.8153, longitude: 7.0079,
    type: 'residential', status: 'off_plan',
    completionDate: 'Q3 2027', totalUnits: 64, availableUnits: 52,
    priceFrom: 38000000, priceTo: 95000000,
    description: 'Affordable luxury apartments for first-time buyers and young professionals near PH Airport. 64 units across 8 floors with structured payment plans.',
    longDescription: 'Nova Residences makes premium apartment living accessible in Port Harcourt\'s fastest-growing suburb. Designed for first-time buyers, young professionals, and investors seeking strong rental yields near PH International Airport. Structured off-plan payment plans allow buyers to spread costs over 24 months while the development completes.',
    amenities: ['Rooftop Terrace', '24-hr Security', 'Generator', 'Borehole', 'CCTV', 'Parking', 'Gym (Rooftop)', 'Laundry Room'],
    unitTypes: [
      { type: 'Studio',      beds: 1, sizeSqm: 42,  priceFrom: 38000000, available: 12 },
      { type: '1-Bedroom',   beds: 1, sizeSqm: 65,  priceFrom: 52000000, available: 24 },
      { type: '2-Bedroom',   beds: 2, sizeSqm: 95,  priceFrom: 75000000, available: 14 },
      { type: '3-Bedroom',   beds: 3, sizeSqm: 130, priceFrom: 95000000, available: 2 },
    ],
    features: ['Off-Plan Investment', '24-Month Payment Plan', 'POP Ceiling', 'Kitchen Cabinets', 'All Ensuite', 'Rooftop Gym', 'Solar Panels'],
    gallery: ['nova-1', 'nova-2', 'nova-3'],
    virtualTour: false, isVerified: true, isFeatured: true, isNew: true,
    agentId: 'a6', views: 9234, enquiries: 418, yearBuilt: 2026, floors: 8,
    constructionPct: 15,
    paymentPlan: '20% deposit · 24-month instalment · 0% interest',
    warranty: '5-year structural warranty',
    tags: ['Off-Plan', 'First-Time Buyers', 'Investment', 'Airport Road', 'Payment Plan'],
  },
  {
    id: 'd5', slug: 'meridian-mixed-use-trans-amadi',
    name: 'Meridian Hub', developer: 'TransCity Developers Ltd',
    developerLogo: 'transcity-dev', neighborhood: 'Trans Amadi',
    address: 'Industrial Crescent, Trans Amadi, Port Harcourt',
    latitude: 4.8278, longitude: 7.0823,
    type: 'mixed_use', status: 'under_construction',
    completionDate: 'Q1 2027', totalUnits: 36, availableUnits: 28,
    priceFrom: 65000000, priceTo: 320000000,
    description: 'A mixed-use development with retail ground floor, corporate offices on floors 2–5, and luxury residential apartments from floor 6. Targeting oil & gas sector occupiers.',
    longDescription: 'Meridian Hub is Trans Amadi\'s first true mixed-use tower — delivering retail, office, and residential in a single premium development. Ground-floor retail anchored by a convenience store and pharmacy. Corporate offices on floors 2–5 with Grade B spec. Luxury serviced apartments from floor 6 targeting oil & gas workers on rotation and senior executives. Designed by a UK-trained architect with 15 years of Nigerian commercial experience.',
    amenities: ['Retail Podium', 'Grade B Offices', 'Residents\' Pool', 'Industrial Generator', 'Smart Access Control', 'CCTV', 'Parking (80 spaces)', 'Fibre Internet', 'EV Charging Points'],
    unitTypes: [
      { type: 'Office Floor (per floor)', beds: 0, sizeSqm: 320, priceFrom: 65000000, available: 3 },
      { type: '2-Bed Apartment',          beds: 2, sizeSqm: 110, priceFrom: 120000000, available: 14 },
      { type: '3-Bed Apartment',          beds: 3, sizeSqm: 165, priceFrom: 195000000, available: 8 },
      { type: 'Penthouse',                beds: 4, sizeSqm: 360, priceFrom: 320000000, available: 3 },
    ],
    features: ['Mixed-Use Tower', 'Grade B Offices', 'EV Charging', 'Smart Access', 'Rooftop Terrace', 'Retail Ground Floor', 'Co-Working Lounge'],
    gallery: ['meridian-1', 'meridian-2', 'meridian-3'],
    virtualTour: true, isVerified: true, isFeatured: false, isNew: true,
    agentId: 'a5', views: 5431, enquiries: 198, yearBuilt: 2025, floors: 14,
    constructionPct: 42,
    paymentPlan: '30% on contract · 70% on handover · Corporate lease options',
    warranty: '7-year structural · 2-year MEP systems',
    tags: ['Mixed-Use', 'Oil & Gas', 'Corporate', 'Investment', 'Trans Amadi'],
  },
  {
    id: 'd6', slug: 'eleme-executive-villas',
    name: 'Eleme Executive Villas', developer: 'Delta Prime Properties',
    developerLogo: 'delta-prime', neighborhood: 'Eleme',
    address: 'NLNG Corridor, Aleto Road, Eleme, Rivers State',
    latitude: 4.7951, longitude: 7.1098,
    type: 'estate', status: 'ready',
    completionDate: 'Ready Now', totalUnits: 16, availableUnits: 6,
    priceFrom: 165000000, priceTo: 280000000,
    description: 'Sixteen fully detached executive villas designed specifically for NLNG, Shell, and Chevron personnel. Completed and ready for immediate corporate lettings or purchase.',
    longDescription: 'Eleme Executive Villas was conceived from the ground up for Port Harcourt\'s oil & gas expatriate community. Each of the 16 detached villas meets international corporate housing standards with generator-backed 24-hr power, VSAT-ready infrastructure, reinforced security, and corporate lease documentation. Currently 10 of the 16 units are let to Shell and NLNG on corporate leases. 6 remain available for purchase or long-term corporate letting.',
    amenities: ['Full Generator Backup', 'VSAT-Ready', '24-hr Guard Post', 'CCTV Perimeter', 'Swimming Pool (Shared)', 'Tennis Court', 'Borehole', 'Waste Management'],
    unitTypes: [
      { type: '3-Bed Executive Villa', beds: 3, sizeSqm: 280, priceFrom: 165000000, available: 3 },
      { type: '4-Bed Executive Villa', beds: 4, sizeSqm: 380, priceFrom: 220000000, available: 2 },
      { type: '5-Bed Executive Villa', beds: 5, sizeSqm: 480, priceFrom: 280000000, available: 1 },
    ],
    features: ['Fully Detached', 'BQ Included', 'Corporate Lease Ready', 'VSAT Infrastructure', 'Full Power Backup', 'Tennis Court', 'Pool'],
    gallery: ['eleme-villas-1', 'eleme-villas-2'],
    virtualTour: false, isVerified: true, isFeatured: false, isNew: false,
    agentId: 'a4', views: 4312, enquiries: 145, yearBuilt: 2024, floors: 2,
    constructionPct: 100,
    paymentPlan: 'Outright purchase · Corporate lease (min 2 years)',
    warranty: '3-year snagging · Annual maintenance contract available',
    tags: ['Ready Now', 'Expat Housing', 'NLNG', 'Corporate Lease', 'Eleme'],
  },
]
