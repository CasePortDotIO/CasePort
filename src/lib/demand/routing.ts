import {
  B2B_ROUTES,
  INTAKE_CTA,
  INTAKE_PATH,
  PROHIBITED_INTAKE_CTAS,
  type BusinessSide,
} from '@/lib/domain/demandCapture'

/**
 * The self closing routing layer (DEMAND_CAPTURE.md Phase D, Section 8). Every
 * captured intent routes to self initiation. A claimant or a buyer completes the
 * journey without ever booking a call. No path routes to a call, ever.
 *
 *   B2C: every claimant surface routes to caseport.io/checkmycase with the one
 *        permitted call to action, Send my information, and the ABA disclaimer.
 *   B2B: routed by reader psychology. Pain awareness routes to /markets. Financial
 *        or return on investment and vendor evaluation content routes to
 *        /request-access. Pure education routes to the next pillar asset. The
 *        buyer self serves toward a funded wallet, never toward a phone call.
 */

/** B2B reader intent that decides the destination (Section 8). */
export const ROUTING_INTENTS = [
  { value: 'pain-awareness', label: 'Pain Awareness' },
  { value: 'financial', label: 'Financial or Return on Investment' },
  { value: 'vendor-evaluation', label: 'Vendor Evaluation' },
  { value: 'education', label: 'Pure Education' },
] as const
export type RoutingIntent = (typeof ROUTING_INTENTS)[number]['value']

export interface RouteResolution {
  destination: string
  cta: string
  disclaimerRequired: boolean
  /** Always false. A route that would send someone to a call is a violation. */
  routesToCall: false
}

export interface RouteInput {
  side: BusinessSide
  /** B2B only: the reader psychology intent. */
  intent?: RoutingIntent
  /** B2B education fallback: the next pillar asset URL. Defaults to the guide hub. */
  nextPillarUrl?: string
}

/**
 * Resolve the self initiation destination for a captured surface. Never returns
 * a call. B2C always lands on the intake path with the one permitted call to
 * action and the disclaimer; B2B lands on a self serve destination by intent.
 */
export function resolveRoute(input: RouteInput): RouteResolution {
  if (input.side === 'b2c') {
    return { destination: INTAKE_PATH, cta: INTAKE_CTA, disclaimerRequired: true, routesToCall: false }
  }
  // B2B, routed by reader psychology.
  let destination: string
  switch (input.intent) {
    case 'financial':
    case 'vendor-evaluation':
      destination = B2B_ROUTES.financialOrVendorEvaluation // /request-access
      break
    case 'education':
      destination = input.nextPillarUrl ?? '/guide'
      break
    case 'pain-awareness':
    default:
      destination = B2B_ROUTES.painAwareness // /markets
  }
  return { destination, cta: 'Read the next brief', disclaimerRequired: false, routesToCall: false }
}

/**
 * Detect any link or call to action that would route a person to a call rather
 * than to self initiation (Section 8). Scans hrefs and copy for phone links,
 * scheduler links, and call to action phrasing. A hit blocks publication.
 */
const CALL_ROUTE_PATTERNS: RegExp[] = [
  /tel:/i,
  /callto:/i,
  /calendly\.com/i,
  /cal\.com/i,
  /acuityscheduling/i,
  /book(ing)?[-\s]?a[-\s]?call/i,
  /schedule[-\s]?a[-\s]?call/i,
  /book[-\s]?a[-\s]?(demo|meeting|consultation)/i,
  /call[-\s]?(us|now|today)/i,
  /\bfree consultation\b/i,
]

export function findCallRoutes(values: Array<string | undefined | null>): string[] {
  const hits: string[] = []
  for (const v of values) {
    if (!v) continue
    for (const re of CALL_ROUTE_PATTERNS) {
      const m = v.match(re)
      if (m) hits.push(m[0])
    }
  }
  return hits
}

/** True when a destination is a compliant self initiation path, not a call. */
export function isSelfInitiation(destination: string): boolean {
  return findCallRoutes([destination]).length === 0
}

/**
 * Validate that a captured asset's routing is self closing (Phase D checkpoint).
 * B2C must land on the intake path with the permitted call to action and carry
 * the disclaimer; no asset may route to a call, and no B2C call to action may be
 * a prohibited one. Returns the list of violations; empty means compliant.
 */
export interface RoutingValidationInput {
  side: BusinessSide
  intakeCtaText?: string
  intakeCtaHref?: string
  hasComplianceDisclaimer?: boolean
  /** Any other links in the asset, scanned for call routes. */
  links?: string[]
  body?: string
}

export function validateRouting(input: RoutingValidationInput): string[] {
  const violations: string[] = []

  // No path routes to a call (Section 8). Scan every link and the body copy.
  const callHits = findCallRoutes([input.intakeCtaHref, ...(input.links ?? []), input.body])
  for (const hit of callHits) violations.push(`routes-to-call: ${hit}`)

  if (input.side === 'b2c' && (input.intakeCtaText || input.intakeCtaHref)) {
    if (input.intakeCtaText !== INTAKE_CTA) {
      violations.push(`intake-cta: must be "${INTAKE_CTA}"`)
    }
    if (PROHIBITED_INTAKE_CTAS.some((c) => (input.intakeCtaText ?? '').toLowerCase().includes(c))) {
      violations.push('intake-cta: prohibited call to action')
    }
    if (!input.intakeCtaHref || !input.intakeCtaHref.includes(INTAKE_PATH)) {
      violations.push(`intake-cta: must route to ${INTAKE_PATH}`)
    }
    if (!input.hasComplianceDisclaimer) violations.push('missing-disclaimer')
  }

  return violations
}
