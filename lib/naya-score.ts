// lib/naya-score.ts
// Naya Score™ — Proprietary property rating algorithm

export type NayaScoreBreakdown = {
  total: number          // 0-100
  titleStrength: number  // 0-25
  floodRisk: number      // 0-20
  neighbourhood: number  // 0-20
  valueForMoney: number  // 0-20
  infrastructure: number // 0-15
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'
  label: string
  color: string
  highlights: string[]
  warnings: string[]
}

const TITLE_SCORES: Record<string, number> = {
  COF_O: 25, GOVERNORS_CONSENT: 22, DEED_OF_ASSIGNMENT: 18,
  SURVEY_PLAN: 12, GAZETTE: 15, FAMILY_LAND: 6, UNKNOWN: 3,
}

const FLOOD_RISK_BY_AREA: Record<string, number> = {
  'GRA Phase 2': 18, 'Old GRA': 17, 'GRA Phase 1': 17,
  'Woji': 15, 'Trans Amadi': 13, 'Rumuola': 13,
  'Rumueme': 12, 'Choba': 11, 'Rumuokoro': 11,
  'Eleme': 14, 'D-Line': 10, 'Diobu': 9,
  'Borokiri': 7, 'Bonny Island': 6, 'Okrika': 8,
  'Stadium Road': 12, 'Peter Odili Road': 14,
}

const NEIGHBOURHOOD_SCORES: Record<string, number> = {
  'GRA Phase 2': 20, 'Old GRA': 19, 'GRA Phase 1': 19,
  'Woji': 17, 'Trans Amadi': 15, 'Rumuola': 14,
  'Eleme': 13, 'Choba': 12, 'Rumueme': 12,
  'Rumuokoro': 11, 'D-Line': 13, 'Diobu': 10,
  'Stadium Road': 13, 'Peter Odili Road': 16,
  'Bonny Island': 14, 'Oyigbo': 10,
}

const INFRA_SCORES: Record<string, number> = {
  'GRA Phase 2': 15, 'Old GRA': 14, 'Woji': 13,
  'Trans Amadi': 13, 'Peter Odili Road': 13, 'Rumuola': 12,
  'Eleme': 11, 'Stadium Road': 12, 'D-Line': 11,
  'Choba': 10, 'Rumueme': 10, 'Diobu': 9,
}

export function calculateNayaScore(property: {
  titleType?: string
  neighborhood: string
  price: number
  listingType: string
  bedrooms: number
  sizeSqm?: number
  amenities?: string[]
  isVerified?: boolean
  virtualTour?: boolean
  agent?: { rsspcStatus?: string; avgRating?: number }
}): NayaScoreBreakdown {
  const highlights: string[] = []
  const warnings: string[] = []

  // 1. Title Strength (0-25)
  const titleStrength = TITLE_SCORES[property.titleType || 'UNKNOWN'] || 3
  if (titleStrength >= 22) highlights.push('Strong title documentation')
  else if (titleStrength <= 8) warnings.push('Weak title — verify documents carefully')

  // 2. Flood Risk (0-20)
  const floodRisk = FLOOD_RISK_BY_AREA[property.neighborhood] || 10
  if (floodRisk >= 17) highlights.push('Low flood risk area')
  else if (floodRisk <= 9) warnings.push('Higher flood risk — check drainage')

  // 3. Neighbourhood Score (0-20)
  const neighbourhood = NEIGHBOURHOOD_SCORES[property.neighborhood] || 10
  if (neighbourhood >= 18) highlights.push('Premium neighbourhood')
  else if (neighbourhood <= 10) warnings.push('Developing area — amenities may be limited')

  // 4. Value for Money (0-20)
  let valueForMoney = 12 // base
  const avgPrices: Record<string, number> = {
    'GRA Phase 2': 5000000, 'Old GRA': 3800000, 'Woji': 2900000,
    'Trans Amadi': 2200000, 'Rumuola': 1400000, 'Eleme': 1800000,
  }
  if (property.listingType === 'RENT') {
    const avgArea = avgPrices[property.neighborhood] || 2000000
    const ratio = property.price / avgArea
    if (ratio < 0.85) { valueForMoney = 20; highlights.push('Priced below market — excellent value') }
    else if (ratio < 1.0) { valueForMoney = 17; highlights.push('Good value for the area') }
    else if (ratio > 1.3) { valueForMoney = 8; warnings.push('Priced above market rate') }
    else valueForMoney = 13
  }

  // Bonus for verified listing, virtual tour, RSSPC agent
  if (property.isVerified) { valueForMoney = Math.min(20, valueForMoney + 2); highlights.push('Naya Verified listing') }
  if (property.virtualTour) { highlights.push('360° virtual tour available') }
  if (property.agent?.rsspcStatus === 'VERIFIED') highlights.push('RSSPC verified agent')
  if (property.amenities?.includes('Generator')) highlights.push('Full generator backup')
  if (property.amenities?.includes('24-hr Security')) highlights.push('24-hour security')

  // 5. Infrastructure (0-15)
  const infrastructure = INFRA_SCORES[property.neighborhood] || 9

  const total = Math.min(100, titleStrength + floodRisk + neighbourhood + valueForMoney + infrastructure)

  // Grade
  let grade: NayaScoreBreakdown['grade']
  let label: string
  let color: string
  if (total >= 90)      { grade = 'A+'; label = 'Exceptional';   color = '#059669' }
  else if (total >= 80) { grade = 'A';  label = 'Excellent';     color = '#10b981' }
  else if (total >= 70) { grade = 'B+'; label = 'Very Good';     color = '#C8A84B' }
  else if (total >= 60) { grade = 'B';  label = 'Good';          color = '#d97706' }
  else if (total >= 50) { grade = 'C+'; label = 'Fair';          color = '#f59e0b' }
  else if (total >= 40) { grade = 'C';  label = 'Below Average'; color = '#ef4444' }
  else                  { grade = 'D';  label = 'Poor';          color = '#dc2626' }

  return { total, titleStrength, floodRisk, neighbourhood, valueForMoney, infrastructure, grade, label, color, highlights, warnings }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 70) return '#C8A84B'
  if (score >= 60) return '#d97706'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}
