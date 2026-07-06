/**
 * The recommendation compliance guard (INTELLIGENCE_CORE.md H2, H3, Wall W1,
 * W3). The CIC may recommend market entry, capacity, and flat per opportunity
 * price tiers. It may never recommend making routing smart or making pricing
 * scale with outcome, internal reasoning or not. This guard scans a proposed
 * recommendation and blocks either, structurally, before it can be persisted as
 * a proposal a human might approve.
 *
 * These are content checks on the recommendation action and rationale, distinct
 * from the type level guard on RoutingService (which makes smart routing
 * unrepresentable in code). Here the CIC is proposing in natural language, so
 * the words are what must be policed.
 */
export interface RecommendationViolation {
  rule: 'smart-routing' | 'outcome-scaled-pricing'
  match: string
}

/**
 * Routing must stay geographic and deterministic (W1, H2). Any suggestion to
 * route by quality, score, severity, value, or to prioritize a firm by a signal
 * is forbidden.
 */
const SMART_ROUTING_TERMS = [
  'route by score',
  'route by quality',
  'route by scps',
  'route by value',
  'route by severity',
  'quality based routing',
  'quality-based routing',
  'smart routing',
  'prioritize routing',
  'prioritise routing',
  'routing priority',
  'route high value',
  'route the best',
  'send better cases',
  'steer cases',
]

/**
 * Pricing must stay a flat fee per delivered opportunity (W3, H3). Any fee that
 * scales with settlement, recovery, contingency, outcome, or signing is fee
 * splitting under ABA Rule 5.4.
 */
const OUTCOME_PRICING_TERMS = [
  'per settlement',
  'percent of settlement',
  'percentage of settlement',
  'percent of recovery',
  'share of recovery',
  'contingency',
  'success fee',
  'success based',
  'success-based',
  'per signed case fee',
  'fee per signed',
  'price per signed',
  'bonus per signed',
  'per outcome',
  'outcome based pricing',
  'outcome-based pricing',
  'commission on',
  'take a cut',
]

function has(haystackLower: string, phrase: string): boolean {
  const escaped = phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(haystackLower)
}

/** Scan a recommendation for the two forbidden classes. Non throwing. */
export function findRecommendationViolations(text: string): RecommendationViolation[] {
  const violations: RecommendationViolation[] = []
  if (!text) return violations
  const lower = text.toLowerCase()
  for (const term of SMART_ROUTING_TERMS) {
    if (has(lower, term)) violations.push({ rule: 'smart-routing', match: term })
  }
  for (const term of OUTCOME_PRICING_TERMS) {
    if (has(lower, term)) violations.push({ rule: 'outcome-scaled-pricing', match: term })
  }
  return violations
}

export function isRecommendationCompliant(text: string): boolean {
  return findRecommendationViolations(text).length === 0
}
