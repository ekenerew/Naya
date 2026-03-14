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
