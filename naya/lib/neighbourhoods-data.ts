// lib/neighbourhoods-data.ts
export type ElectricityBand = 'A' | 'B' | 'C' | 'D' | 'E'
export type FloodRisk = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High'

export type Neighbourhood = {
  slug: string; name: string; lga: string; description: string
  electricityBand: ElectricityBand; electricityHoursPerDay: number
  electricityProvider: string; electricityNotes: string
  floodRisk: FloodRisk; floodNotes: string
  avgRentPerYear: { studio: number; oneBed: number; twoBed: number; threeBed: number; fourBed: number }
  avgSalePrice: { oneBed: number; twoBed: number; threeBed: number; fourBed: number }
  priceChange12m: number; avgPricePerSqm: number
  roadQuality: number; internetSpeed: string; security: number
  healthcare: number; schools: number; shopping: number
  population: string; dominantOccupation: string
  expatsPresent: boolean; corporatePresent: boolean
  landmarks: string[]; nearbyAreas: string[]; tags: string[]
  areaScore: number
}

export const ELECTRICITY_BAND_INFO = {
  A: { label:"Band A", description:"20+ hours/day — Most reliable, highest tariff", color:"text-emerald-700", bg:"bg-emerald-50 border-emerald-200", emoji:"🟢" },
  B: { label:"Band B", description:"16-20 hours/day — Good supply with minor interruptions", color:"text-blue-700", bg:"bg-blue-50 border-blue-200", emoji:"🔵" },
  C: { label:"Band C", description:"12-16 hours/day — Moderate, generator needed", color:"text-amber-700", bg:"bg-amber-50 border-amber-200", emoji:"🟡" },
  D: { label:"Band D", description:"8-12 hours/day — Poor supply, heavy generator use", color:"text-orange-700", bg:"bg-orange-50 border-orange-200", emoji:"🟠" },
  E: { label:"Band E", description:"Under 8 hours/day — Very poor, full backup required", color:"text-rose-700", bg:"bg-rose-50 border-rose-200", emoji:"🔴" },
}

export const FLOOD_RISK_INFO = {
  "Very Low": { color:"text-emerald-700", bg:"bg-emerald-50", emoji:"✅" },
  "Low":      { color:"text-blue-700",    bg:"bg-blue-50",    emoji:"🟢" },
  "Medium":   { color:"text-amber-700",   bg:"bg-amber-50",   emoji:"⚠️" },
  "High":     { color:"text-orange-700",  bg:"bg-orange-50",  emoji:"🔶" },
  "Very High":{ color:"text-rose-700",    bg:"bg-rose-50",    emoji:"🚨" },
}

export const NEIGHBOURHOODS: Neighbourhood[] = [
  {
    slug:"gra-phase-2", name:"GRA Phase 2", lga:"Port Harcourt City",
    description:"Port Harcourt's most prestigious residential address. Home to oil executives, diplomats, government officials and top professionals. Wide tree-lined roads, excellent infrastructure and strong security.",
    electricityBand:"B", electricityHoursPerDay:18, electricityProvider:"PHED",
    electricityNotes:"Relatively stable. Most properties have inverter/generator backup. Outages typically 4-6 hrs/day.",
    floodRisk:"Low", floodNotes:"Well-drained. Elevated terrain. Minor flooding near some drainages in heavy rain.",
    avgRentPerYear:{ studio:0, oneBed:1200000, twoBed:2500000, threeBed:5000000, fourBed:9000000 },
    avgSalePrice:{ oneBed:25000000, twoBed:55000000, threeBed:120000000, fourBed:250000000 },
    priceChange12m:18, avgPricePerSqm:450000,
    roadQuality:9, internetSpeed:"50-200 Mbps", security:9, healthcare:9, schools:9, shopping:9,
    population:"~45,000", dominantOccupation:"Oil & Gas, Government, Business", expatsPresent:true, corporatePresent:true,
    landmarks:["GRA Shopping Complex","Various Consulates","Top Private Schools"],
    nearbyAreas:["Old GRA","GRA Phase 1","Rumuola"],
    tags:["Luxury","Expat-Friendly","Corporate","Premium","Secure"],
    areaScore:92,
  },
  {
    slug:"old-gra", name:"Old GRA", lga:"Port Harcourt City",
    description:"One of PH's oldest and most established residential areas. Mix of colonial-era buildings and modern constructions. Popular with senior government officials, judges and long-established businesses.",
    electricityBand:"B", electricityHoursPerDay:16, electricityProvider:"PHED",
    electricityNotes:"Moderate to good supply. Typically 16-18 hours on good days. Generator backup common.",
    floodRisk:"Low", floodNotes:"Generally well-drained. Some streets near low-lying areas may experience minor flooding.",
    avgRentPerYear:{ studio:0, oneBed:900000, twoBed:1800000, threeBed:3800000, fourBed:7000000 },
    avgSalePrice:{ oneBed:18000000, twoBed:40000000, threeBed:95000000, fourBed:200000000 },
    priceChange12m:15, avgPricePerSqm:380000,
    roadQuality:8, internetSpeed:"30-100 Mbps", security:8, healthcare:8, schools:8, shopping:8,
    population:"~30,000", dominantOccupation:"Government, Judiciary, Business", expatsPresent:true, corporatePresent:true,
    landmarks:["Government House vicinity","Federal Secretariat","Polo Club Road"],
    nearbyAreas:["GRA Phase 2","GRA Phase 1","D-Line"],
    tags:["Established","Historic","Prestigious","Quiet"],
    areaScore:88,
  },
  {
    slug:"woji", name:"Woji", lga:"Obio-Akpor",
    description:"One of the fastest-growing residential areas in PH. Popular with young professionals, middle-income families and small business owners. Good road network and increasingly modern infrastructure.",
    electricityBand:"C", electricityHoursPerDay:14, electricityProvider:"PHED",
    electricityNotes:"About 12-16 hours on good days. Power outages frequent. Generator/inverter strongly recommended.",
    floodRisk:"Medium", floodNotes:"Parts prone to flooding near the creek. Check specific street before committing.",
    avgRentPerYear:{ studio:300000, oneBed:600000, twoBed:1200000, threeBed:2500000, fourBed:4500000 },
    avgSalePrice:{ oneBed:10000000, twoBed:25000000, threeBed:60000000, fourBed:120000000 },
    priceChange12m:22, avgPricePerSqm:220000,
    roadQuality:7, internetSpeed:"20-50 Mbps", security:7, healthcare:7, schools:7, shopping:8,
    population:"~120,000", dominantOccupation:"Private Sector, SMEs, Young Professionals", expatsPresent:false, corporatePresent:false,
    landmarks:["Woji Market","Rumuola-Woji Road","Shopping Plazas"],
    nearbyAreas:["Trans Amadi","Rumuola","Rumuokoro"],
    tags:["Growing","Affordable","Young Professional","Good Value"],
    areaScore:74,
  },
  {
    slug:"trans-amadi", name:"Trans Amadi", lga:"Obio-Akpor",
    description:"PH's industrial and commercial hub. Home to oil servicing companies, warehouses and light industry. Also has a strong residential component along quieter streets.",
    electricityBand:"C", electricityHoursPerDay:13, electricityProvider:"PHED",
    electricityNotes:"Industrial areas slightly better than residential. Residential parts typically 12-14 hours.",
    floodRisk:"Medium", floodNotes:"Some low-lying streets experience flooding. Verify specific location.",
    avgRentPerYear:{ studio:350000, oneBed:700000, twoBed:1400000, threeBed:2800000, fourBed:5000000 },
    avgSalePrice:{ oneBed:12000000, twoBed:28000000, threeBed:65000000, fourBed:130000000 },
    priceChange12m:16, avgPricePerSqm:240000,
    roadQuality:7, internetSpeed:"30-100 Mbps", security:7, healthcare:6, schools:6, shopping:7,
    population:"~200,000", dominantOccupation:"Oil Servicing, Logistics, Trade", expatsPresent:false, corporatePresent:true,
    landmarks:["Trans Amadi Industrial Layout","Oil Servicing Firms","Trans Amadi Market"],
    nearbyAreas:["Woji","Rumuola","Peter Odili Road"],
    tags:["Commercial","Strategic","Industrial","Business Hub"],
    areaScore:71,
  },
  {
    slug:"rumuola", name:"Rumuola", lga:"Obio-Akpor",
    description:"Busy, well-connected residential and commercial area. Major road artery connecting GRA to Trans Amadi. Mix of apartments, duplexes and commercial properties.",
    electricityBand:"C", electricityHoursPerDay:12, electricityProvider:"PHED",
    electricityNotes:"Typical Band C. About 10-14 hours supply. Generator backup essential.",
    floodRisk:"Low", floodNotes:"Relatively elevated. Good drainage along main road. Some back streets may collect water.",
    avgRentPerYear:{ studio:250000, oneBed:500000, twoBed:1000000, threeBed:2000000, fourBed:3800000 },
    avgSalePrice:{ oneBed:8000000, twoBed:18000000, threeBed:45000000, fourBed:90000000 },
    priceChange12m:14, avgPricePerSqm:180000,
    roadQuality:7, internetSpeed:"20-50 Mbps", security:6, healthcare:6, schools:7, shopping:8,
    population:"~150,000", dominantOccupation:"Mixed — Trade, Services, Civil Servants", expatsPresent:false, corporatePresent:false,
    landmarks:["Rumuola Road","Sani Abacha Stadium vicinity","Shopping Plazas"],
    nearbyAreas:["GRA Phase 2","Trans Amadi","D-Line"],
    tags:["Well-Connected","Accessible","Mid-Range","Active"],
    areaScore:69,
  },
  {
    slug:"eleme", name:"Eleme", lga:"Eleme",
    description:"Industrial town home to the NNPC Refinery and Eleme Petrochemicals. Significant oil & gas worker population. Growing residential developments with improving infrastructure.",
    electricityBand:"B", electricityHoursPerDay:17, electricityProvider:"PHED + Industrial",
    electricityNotes:"Better than average owing to industrial presence. Refinery feeder lines benefit nearby residences. ~16-18 hours.",
    floodRisk:"Medium", floodNotes:"Parts near creeks are flood-prone. Inland areas safer. Check specific street.",
    avgRentPerYear:{ studio:300000, oneBed:600000, twoBed:1200000, threeBed:2400000, fourBed:4500000 },
    avgSalePrice:{ oneBed:9000000, twoBed:22000000, threeBed:55000000, fourBed:110000000 },
    priceChange12m:20, avgPricePerSqm:200000,
    roadQuality:7, internetSpeed:"20-50 Mbps", security:7, healthcare:7, schools:6, shopping:6,
    population:"~200,000", dominantOccupation:"Petrochemical, Refinery, Trade", expatsPresent:false, corporatePresent:true,
    landmarks:["NNPC PH Refinery","Eleme Petrochemicals","Indorama Eleme"],
    nearbyAreas:["Oyigbo","Okrika","Trans Amadi"],
    tags:["Industrial","Oil & Gas Workers","Growing","Good Power"],
    areaScore:72,
  },
  {
    slug:"peter-odili-road", name:"Peter Odili Road", lga:"Port Harcourt City",
    description:"One of PH's most prominent corridors. Mix of luxury residential estates, corporate offices and high-end shopping. Rapidly developing with significant real estate investment.",
    electricityBand:"B", electricityHoursPerDay:17, electricityProvider:"PHED",
    electricityNotes:"Good supply from proximity to GRA feeders. ~16-18 hours daily. Many buildings have solar + inverter backup.",
    floodRisk:"Low", floodNotes:"Main road well-managed. Generally good drainage. Side streets vary.",
    avgRentPerYear:{ studio:400000, oneBed:900000, twoBed:2000000, threeBed:4000000, fourBed:7500000 },
    avgSalePrice:{ oneBed:15000000, twoBed:35000000, threeBed:90000000, fourBed:180000000 },
    priceChange12m:25, avgPricePerSqm:320000,
    roadQuality:8, internetSpeed:"30-100 Mbps", security:8, healthcare:8, schools:8, shopping:9,
    population:"~80,000", dominantOccupation:"Business, Corporate, Oil & Gas", expatsPresent:true, corporatePresent:true,
    landmarks:["Genesis Restaurant","Luxury Estates","Corporate Offices"],
    nearbyAreas:["GRA Phase 2","Woji","Trans Amadi"],
    tags:["Luxury Corridor","Corporate","Growing Fast","Premium"],
    areaScore:85,
  },
  {
    slug:"choba", name:"Choba", lga:"Obio-Akpor",
    description:"University town home to the University of Port Harcourt. Strong student and academic community. Growing fast with new residential estates and commercial development.",
    electricityBand:"D", electricityHoursPerDay:9, electricityProvider:"PHED",
    electricityNotes:"Band D area. Typically 8-12 hours. Very frequent interruptions. Full generator/solar setup recommended.",
    floodRisk:"Low", floodNotes:"Generally good terrain near university. Some streets near creek affected.",
    avgRentPerYear:{ studio:180000, oneBed:350000, twoBed:700000, threeBed:1500000, fourBed:2800000 },
    avgSalePrice:{ oneBed:6000000, twoBed:14000000, threeBed:35000000, fourBed:70000000 },
    priceChange12m:18, avgPricePerSqm:130000,
    roadQuality:6, internetSpeed:"10-30 Mbps", security:6, healthcare:6, schools:9, shopping:6,
    population:"~250,000", dominantOccupation:"Students, Academics, SMEs", expatsPresent:false, corporatePresent:false,
    landmarks:["University of Port Harcourt","Rivers State University","Choba Market"],
    nearbyAreas:["Rumuokoro","Alakahia","Woji"],
    tags:["University Town","Student-Friendly","Affordable","Growing"],
    areaScore:63,
  },
  {
    slug:"bonny-island", name:"Bonny Island", lga:"Bonny",
    description:"Island town and home to Nigeria LNG (NLNG). Largely corporate-driven economy with very high expat presence. Premium quality of life within compound areas.",
    electricityBand:"A", electricityHoursPerDay:22, electricityProvider:"NLNG + PHED",
    electricityNotes:"NLNG compound areas have near-24hr supply from their own generation. Town areas Band B-C.",
    floodRisk:"High", floodNotes:"Island location. Prone to tidal flooding. All properties should be elevated.",
    avgRentPerYear:{ studio:500000, oneBed:1500000, twoBed:3000000, threeBed:6000000, fourBed:12000000 },
    avgSalePrice:{ oneBed:20000000, twoBed:45000000, threeBed:100000000, fourBed:220000000 },
    priceChange12m:10, avgPricePerSqm:350000,
    roadQuality:8, internetSpeed:"50-200 Mbps", security:9, healthcare:9, schools:8, shopping:6,
    population:"~200,000", dominantOccupation:"NLNG, Oil & Gas, Marine", expatsPresent:true, corporatePresent:true,
    landmarks:["Nigeria LNG Plant","Finima Community","Bonny River waterfront"],
    nearbyAreas:["Okrika","Eleme"],
    tags:["NLNG","Corporate","Expat","Island","Excellent Power"],
    areaScore:78,
  },
  {
    slug:"d-line", name:"D-Line", lga:"Port Harcourt City",
    description:"Central residential area popular with government workers and private sector professionals. Good central location with access to most parts of PH. Mix of old and new constructions.",
    electricityBand:"C", electricityHoursPerDay:11, electricityProvider:"PHED",
    electricityNotes:"Band C. About 10-13 hours. Generator important for uninterrupted daily living.",
    floodRisk:"Low", floodNotes:"Generally elevated. Good road drainage. Occasional back-street flooding.",
    avgRentPerYear:{ studio:200000, oneBed:450000, twoBed:900000, threeBed:1800000, fourBed:3500000 },
    avgSalePrice:{ oneBed:7000000, twoBed:16000000, threeBed:40000000, fourBed:80000000 },
    priceChange12m:11, avgPricePerSqm:160000,
    roadQuality:7, internetSpeed:"15-40 Mbps", security:6, healthcare:7, schools:7, shopping:7,
    population:"~90,000", dominantOccupation:"Civil Servants, Private Sector, Trade", expatsPresent:false, corporatePresent:false,
    landmarks:["D-Line Market","Artillery Junction","Mile 1 vicinity"],
    nearbyAreas:["Old GRA","Rumuola","Stadium Road"],
    tags:["Central","Accessible","Mid-Range","Civil Servants"],
    areaScore:65,
  },
]

export default NEIGHBOURHOODS
