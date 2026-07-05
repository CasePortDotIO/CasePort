/**
 * Lead Quality Scoring Engine
 * ML-based scoring to rank opportunities by conversion probability
 * Factors: case type, firm history, market conditions, time sensitivity
 */

export interface LeadScoringInput {
  caseType: string;
  market: string;
  estimatedValue: number;
  firmConversionRate: number;
  firmResponseTime: number; // minutes
  daysSincePosted: number;
  similarCasesConverted: number;
  similarCasesTotal: number;
}

export interface LeadScore {
  score: number; // 0-100
  probability: number; // 0-1
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  factors: {
    caseTypeScore: number;
    marketScore: number;
    valueScore: number;
    firmHistoryScore: number;
    urgencyScore: number;
    similarCaseScore: number;
  };
  recommendation: string;
}

export function scoreLeadQuality(input: LeadScoringInput): LeadScore {
  // Case Type Score (0-20 points)
  const caseTypeWeights: Record<string, number> = {
    'Auto Accident': 18,
    'Slip & Fall': 16,
    'Workers Comp': 14,
    'Medical Malpractice': 12,
    'Product Liability': 10,
    'Other': 8,
  };
  const caseTypeScore = caseTypeWeights[input.caseType] || 8;

  // Market Score (0-15 points) - based on market demand
  const marketScores: Record<string, number> = {
    'Houston': 15,
    'Dallas': 14,
    'Austin': 12,
    'San Antonio': 11,
    'Other': 8,
  };
  const marketScore = marketScores[input.market] || 8;

  // Value Score (0-15 points) - higher value = higher priority
  const valueScore = Math.min(15, (input.estimatedValue / 100000) * 15);

  // Firm History Score (0-25 points)
  const firmHistoryScore = Math.min(25, input.firmConversionRate * 25);

  // Urgency Score (0-15 points) - older cases less valuable
  const urgencyScore = Math.max(0, 15 - (input.daysSincePosted * 0.5));

  // Similar Case Score (0-10 points) - historical success rate
  const similarCaseScore =
    input.similarCasesTotal > 0
      ? (input.similarCasesConverted / input.similarCasesTotal) * 10
      : 5;

  // Calculate total score
  const totalScore =
    caseTypeScore +
    marketScore +
    valueScore +
    firmHistoryScore +
    urgencyScore +
    similarCaseScore;

  // Determine tier
  let tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  if (totalScore >= 85) tier = 'platinum';
  else if (totalScore >= 70) tier = 'gold';
  else if (totalScore >= 55) tier = 'silver';
  else tier = 'bronze';

  // Convert to probability (0-1)
  const probability = totalScore / 100;

  // Generate recommendation
  let recommendation = '';
  if (tier === 'platinum') {
    recommendation = 'High priority - Accept immediately. 85%+ conversion probability.';
  } else if (tier === 'gold') {
    recommendation = 'Good opportunity - Strong match for your firm. 70-85% conversion probability.';
  } else if (tier === 'silver') {
    recommendation = 'Moderate opportunity - Consider based on current workload. 55-70% conversion probability.';
  } else {
    recommendation = 'Lower priority - May not be ideal fit. <55% conversion probability.';
  }

  return {
    score: Math.round(totalScore),
    probability: Math.round(probability * 100) / 100,
    tier,
    factors: {
      caseTypeScore: Math.round(caseTypeScore * 10) / 10,
      marketScore: Math.round(marketScore * 10) / 10,
      valueScore: Math.round(valueScore * 10) / 10,
      firmHistoryScore: Math.round(firmHistoryScore * 10) / 10,
      urgencyScore: Math.round(urgencyScore * 10) / 10,
      similarCaseScore: Math.round(similarCaseScore * 10) / 10,
    },
    recommendation,
  };
}

/**
 * Batch score multiple leads
 */
export function scoreLeadsBatch(leads: LeadScoringInput[]): LeadScore[] {
  return leads.map(scoreLeadQuality).sort((a, b) => b.score - a.score);
}

/**
 * Get tier color for UI
 */
export function getTierColor(tier: string): string {
  switch (tier) {
    case 'platinum':
      return '#FFD700'; // Gold
    case 'gold':
      return '#0F6E56'; // Teal
    case 'silver':
      return '#888888'; // Gray
    case 'bronze':
      return '#CD7F32'; // Bronze
    default:
      return '#888888';
  }
}
