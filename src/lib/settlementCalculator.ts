export interface SettlementCalculation {
  economicDamages: number
  painSuffering: number
  totalEstimate: number
  withAttorney: number
  withoutAttorney: number
  statueOfLimitationsYears: number
  contingencyFeePercent: number
}

const SEVERITY_MULTIPLIERS = {
  minor: 1.5,
  moderate: 2.5,
  severe: 4,
  catastrophic: 5,
}

const STATE_STATUTES: Record<string, number> = {
  california: 2,
  texas: 2,
  florida: 4,
  newyork: 3,
  illinois: 2,
  pennsylvania: 2,
}

export function calculateSettlement({
  injuryType,
  severity,
  medicalExpenses,
  lostWages,
  futureExpenses,
  state,
  comparativeNegligence,
  preexistingConditions,
}: {
  injuryType: string
  severity: string
  medicalExpenses: number
  lostWages: number
  futureExpenses: number
  state: string
  comparativeNegligence: number
  preexistingConditions: boolean
}): SettlementCalculation {
  const economicDamages = medicalExpenses + lostWages + futureExpenses
  const multiplier = SEVERITY_MULTIPLIERS[severity as keyof typeof SEVERITY_MULTIPLIERS] || 2.5

  let painSuffering = economicDamages * multiplier

  if (preexistingConditions) {
    painSuffering *= 0.8
  }

  const negligenceMultiplier = (100 - comparativeNegligence) / 100
  const totalEstimate = (economicDamages + painSuffering) * negligenceMultiplier

  const contingencyFee = 0.33
  const withAttorney = totalEstimate * (1 - contingencyFee)
  const withoutAttorney = totalEstimate * 0.85

  const statuteYears = STATE_STATUTES[state.toLowerCase()] || 2

  return {
    economicDamages,
    painSuffering,
    totalEstimate,
    withAttorney,
    withoutAttorney,
    statueOfLimitationsYears: statuteYears,
    contingencyFeePercent: 33,
  }
}

export function getLeadTier(score: number): string {
  if (score >= 80) return 'hot'
  if (score >= 50) return 'warm'
  return 'cold'
}

export function getLeadColor(tier: string): string {
  switch (tier) {
    case 'hot':
      return '#c4714a'
    case 'warm':
      return '#4a8c7e'
    default:
      return '#666'
  }
}