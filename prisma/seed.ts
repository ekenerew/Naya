// prisma/seed.ts
// Seeds the Naya database with initial data for development
// Run: npx ts-node prisma/seed.ts

import { PrismaClient, AccountType, AgentBadge, AgentPlan, VerificationStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Naya database...')

  // ── Admin User ─────────────────────────────────────────────
  const adminPw = await bcrypt.hash('Admin@Naya2026!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@naya.ng' },
    update: {},
    create: {
      email:        'admin@naya.ng',
      firstName:    'Naya',
      lastName:     'Admin',
      passwordHash: adminPw,
      accountType:  AccountType.ADMIN,
      emailVerified:true,
      isActive:     true,
    }
  })
  console.log('✅ Admin user:', admin.email)

  // ── Sample Agents ──────────────────────────────────────────
  const agentPw = await bcrypt.hash('Agent@Naya2026!', 12)

  const agentData = [
    {
      email: 'samuel.okeke@naya.ng', firstName: 'Samuel', lastName: 'Okeke',
      agencyName: 'Okeke Premium Properties', rsspcNumber: 'RS-2024-1847',
      badge: AgentBadge.PLATINUM, plan: AgentPlan.PREMIUM,
      neighborhoods: ['GRA Phase 2', 'Old GRA', 'Trans Amadi'],
      specializations: ['Luxury', 'Expat Housing', 'Commercial'],
      avgRating: 4.9, reviewCount: 84, totalListings: 47, totalSales: 23, yearsActive: 8,
    },
    {
      email: 'amara.obi@naya.ng', firstName: 'Amara', lastName: 'Obi',
      agencyName: 'Obi Realty PH', rsspcNumber: 'RS-2023-0942',
      badge: AgentBadge.TOP_AGENT, plan: AgentPlan.PRO,
      neighborhoods: ['Old GRA', 'Woji', 'GRA Phase 2'],
      specializations: ['Residential', 'Luxury', 'Investment'],
      avgRating: 4.8, reviewCount: 61, totalListings: 31, totalSales: 15, yearsActive: 6,
    },
    {
      email: 'chidi.ihejirika@naya.ng', firstName: 'Chidi', lastName: 'Ihejirika',
      agencyName: 'Ihejirika & Associates', rsspcNumber: 'RS-2022-0318',
      badge: AgentBadge.VERIFIED, plan: AgentPlan.PRO,
      neighborhoods: ['Trans Amadi', 'Rumuola', 'Woji'],
      specializations: ['Commercial', 'Industrial', 'Land'],
      avgRating: 4.7, reviewCount: 48, totalListings: 28, totalSales: 19, yearsActive: 5,
    },
    {
      email: 'ngozi.eze@naya.ng', firstName: 'Ngozi', lastName: 'Eze',
      agencyName: 'Pearl Properties PH', rsspcNumber: 'RS-2024-0521',
      badge: AgentBadge.PLATINUM, plan: AgentPlan.PREMIUM,
      neighborhoods: ['Woji', 'Rumuola', 'GRA Phase 2', 'Eleme'],
      specializations: ['Shortlet', 'Residential', 'Luxury'],
      avgRating: 4.9, reviewCount: 93, totalListings: 52, totalSales: 31, yearsActive: 7,
    },
    {
      email: 'emeka.nwosu@naya.ng', firstName: 'Emeka', lastName: 'Nwosu',
      agencyName: 'Nwosu Prime Realty', rsspcNumber: 'RS-2023-1204',
      badge: AgentBadge.VERIFIED, plan: AgentPlan.PRO,
      neighborhoods: ['Trans Amadi', 'Rumuola', 'Eleme'],
      specializations: ['Commercial', 'Industrial', 'Land'],
      avgRating: 4.6, reviewCount: 37, totalListings: 22, totalSales: 11, yearsActive: 4,
    },
    {
      email: 'adaeze.okafor@naya.ng', firstName: 'Adaeze', lastName: 'Okafor',
      agencyName: 'Okafor Homes PH', rsspcNumber: 'RS-2024-0789',
      badge: AgentBadge.VERIFIED, plan: AgentPlan.STARTER,
      neighborhoods: ['Rumuola', 'Woji', 'Rumueme'],
      specializations: ['Residential', 'First-Time Buyers', 'Affordable'],
      avgRating: 4.7, reviewCount: 29, totalListings: 18, totalSales: 8, yearsActive: 3,
    },
  ]

  for (const agent of agentData) {
    const user = await prisma.user.upsert({
      where: { email: agent.email },
      update: {},
      create: {
        email:         agent.email,
        firstName:     agent.firstName,
        lastName:      agent.lastName,
        passwordHash:  agentPw,
        accountType:   AccountType.AGENT,
        emailVerified: true,
        phoneVerified: true,
        isActive:      true,
      }
    })

    await prisma.agentProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId:        user.id,
        agencyName:    agent.agencyName,
        rsspcNumber:   agent.rsspcNumber,
        badge:         agent.badge,
        plan:          agent.plan,
        rsspcStatus:   VerificationStatus.VERIFIED,
        rsspcVerifiedAt: new Date('2024-01-15'),
        rsspcExpiresAt: new Date('2026-01-15'),
        idVerified:    true,
        cacVerified:   agent.plan !== AgentPlan.STARTER,
        neighborhoods: agent.neighborhoods,
        specializations: agent.specializations,
        avgRating:     agent.avgRating,
        reviewCount:   agent.reviewCount,
        totalListings: agent.totalListings,
        activeListings:Math.floor(agent.totalListings * 0.6),
        totalSales:    agent.totalSales,
        totalRentals:  Math.floor(agent.totalSales * 1.5),
        yearsActive:   agent.yearsActive,
        responseRatePct: 95,
        avgResponseHrs:  1.5,
        whatsapp:      '+2348168117004',
      }
    })
    console.log(`✅ Agent: ${agent.firstName} ${agent.lastName}`)
  }

  // ── Neighbourhoods ─────────────────────────────────────────
  const neighbourhoodData = [
    {
      slug: 'gra-phase-2', name: 'GRA Phase 2', lga: 'Port Harcourt',
      description: 'The most prestigious address in Port Harcourt.',
      safetyScore: 92, infrastructureScore: 88, schoolScore: 85, floodRiskScore: 78,
      avgRent1br: BigInt(1800000), avgRent3br: BigInt(4500000), avgBuyPrice: BigInt(180000000),
      trend: 'up', trendPct: 8.2, emoji: '🏛',
      highlights: ['24-hr security', 'Expat community', 'Corporate tenants', 'Paved roads'],
      nearbySchools: ['Rumuola Int\'l School', 'Capital Science Academy'],
      nearbyHospitals: ['BMH Hospital', 'Braithwaite Memorial'],
      nearbyLandmarks: ['Government House', 'PHCC HQ', 'Polo Club'],
      propertyCount: 187,
    },
    {
      slug: 'woji', name: 'Woji', lga: 'Obio-Akpor',
      description: 'One of Port Harcourt\'s most desirable mid-market neighbourhoods.',
      safetyScore: 84, infrastructureScore: 81, schoolScore: 82, floodRiskScore: 70,
      avgRent1br: BigInt(1200000), avgRent3br: BigInt(2900000), avgBuyPrice: BigInt(120000000),
      trend: 'up', trendPct: 18.7, emoji: '🏘',
      highlights: ['Gated estates', 'Top developers', 'New constructions', 'Secure'],
      nearbySchools: ['Graceland Int\'l School', 'Woji Academy'],
      nearbyHospitals: ['Medbury Hospital', 'St Kizito Medical'],
      nearbyLandmarks: ['Polo Road Junction', 'Ezimgbu Road'],
      propertyCount: 256,
    },
    {
      slug: 'rumuola', name: 'Rumuola', lga: 'Obio-Akpor',
      description: 'A rapidly developing suburb popular with young professionals.',
      safetyScore: 72, infrastructureScore: 74, schoolScore: 78, floodRiskScore: 65,
      avgRent1br: BigInt(600000), avgRent3br: BigInt(1400000), avgBuyPrice: BigInt(55000000),
      trend: 'up', trendPct: 15.3, emoji: '🌆',
      highlights: ['Growing area', 'New developments', 'Good schools', 'Near airport'],
      nearbySchools: ['Rumuola Comprehensive', 'Deeper Life High School'],
      nearbyHospitals: ['Amadi Creek Hospital', 'UPTH Satellite'],
      nearbyLandmarks: ['PH International Airport', 'Rumuola Junction'],
      propertyCount: 428,
    },
  ]

  for (const n of neighbourhoodData) {
    await prisma.neighbourhood.upsert({
      where: { slug: n.slug },
      update: { propertyCount: n.propertyCount },
      create: { ...n, character: 'Growing · Mixed · Residential' },
    })
    console.log(`✅ Neighbourhood: ${n.name}`)
  }

  // ── Market Stats ───────────────────────────────────────────
  const statsData = [
    { month: "Apr '25", year: 2025, monthNum: 4, avgRent: BigInt(2100000), avgSalePrice: BigInt(145000000), activeListings: 1840, enquiries: 4200, newListings: 320 },
    { month: "May '25", year: 2025, monthNum: 5, avgRent: BigInt(2150000), avgSalePrice: BigInt(148000000), activeListings: 1920, enquiries: 4450, newListings: 345 },
    { month: "Jun '25", year: 2025, monthNum: 6, avgRent: BigInt(2200000), avgSalePrice: BigInt(150000000), activeListings: 2010, enquiries: 4800, newListings: 380 },
    { month: "Jul '25", year: 2025, monthNum: 7, avgRent: BigInt(2180000), avgSalePrice: BigInt(153000000), activeListings: 1980, enquiries: 4650, newListings: 310 },
    { month: "Aug '25", year: 2025, monthNum: 8, avgRent: BigInt(2250000), avgSalePrice: BigInt(158000000), activeListings: 2120, enquiries: 5100, newListings: 402 },
    { month: "Sep '25", year: 2025, monthNum: 9, avgRent: BigInt(2280000), avgSalePrice: BigInt(162000000), activeListings: 2200, enquiries: 5400, newListings: 421 },
    { month: "Oct '25", year: 2025, monthNum: 10, avgRent: BigInt(2320000), avgSalePrice: BigInt(165000000), activeListings: 2350, enquiries: 5750, newListings: 445 },
    { month: "Nov '25", year: 2025, monthNum: 11, avgRent: BigInt(2400000), avgSalePrice: BigInt(170000000), activeListings: 2480, enquiries: 6100, newListings: 478 },
    { month: "Dec '25", year: 2025, monthNum: 12, avgRent: BigInt(2450000), avgSalePrice: BigInt(175000000), activeListings: 2390, enquiries: 5900, newListings: 389 },
    { month: "Jan '26", year: 2026, monthNum: 1, avgRent: BigInt(2500000), avgSalePrice: BigInt(178000000), activeListings: 2520, enquiries: 6300, newListings: 510 },
    { month: "Feb '26", year: 2026, monthNum: 2, avgRent: BigInt(2580000), avgSalePrice: BigInt(182000000), activeListings: 2640, enquiries: 6700, newListings: 534 },
    { month: "Mar '26", year: 2026, monthNum: 3, avgRent: BigInt(2650000), avgSalePrice: BigInt(188000000), activeListings: 2847, enquiries: 7200, newListings: 567 },
  ]

  for (const stat of statsData) {
    await prisma.marketStat.upsert({
      where: { year_monthNum: { year: stat.year, monthNum: stat.monthNum } },
      update: {},
      create: stat,
    })
  }
  console.log('✅ Market stats seeded (12 months)')

  console.log('\n🎉 Seeding complete!')
  console.log('─────────────────────────────────────')
  console.log('Admin login:  admin@naya.ng / Admin@Naya2026!')
  console.log('Agent login:  samuel.okeke@naya.ng / Agent@Naya2026!')
  console.log('─────────────────────────────────────')
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
