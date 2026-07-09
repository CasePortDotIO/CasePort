/**
 * The B2B outreach claims guard. ABA Model Rule 7.1: a communication about a
 * lawyer's services must be truthful and not misleading. For CasePort's own B2B
 * outreach to firms, this means no guarantees, no unjustified expectations, and
 * no promised outcomes (AGENTS.md Section 4.3 hard boundaries).
 *
 * This is the compliance spine of the B2B Prospecting and Proof-of-Reality
 * Agent. The agent drafts, a human sends, but the draft is guarded first so a
 * human never has to catch a non compliant claim by eye. Tested, not trusted.
 *
 * Three forbidden classes, matched at phrase level to avoid false positives on
 * legitimate, specific, personalized outreach:
 *
 *   1. Guarantees and promises: guarantee, we promise, assured, risk free,
 *      money back. CasePort promises no result.
 *   2. Promised outcomes: you will sign, will convert, will win, guaranteed
 *      cases. Outcomes are never promised.
 *   3. Volume guarantees: N cases a month, at least N, expect N. Proof of
 *      reality is representative recent activity, never a volume guarantee.
 */

export type OutreachViolationKind = 'guarantee' | 'promised-outcome' | 'volume-guarantee'

export interface OutreachClaimViolation {
  term: string
  kind: OutreachViolationKind
  index: number
}

/** Guarantees and promises of any kind. */
const GUARANTEE_PATTERNS: RegExp[] = [
  /\bguarantee(?:d|s|ing)?\b/i,
  /\bwe\s+promise\b/i,
  /\bpromised?\b/i,
  /\bassure(?:d|s)?\s+you\b/i,
  /\brisk[-\s]?free\b/i,
  /\bmoney[-\s]?back\b/i,
  /\bno[-\s]?risk\b/i,
  /\bwe\s+can\s+guarantee\b/i,
]

/** Promised outcomes. Any claim that a result will happen. */
const PROMISED_OUTCOME_PATTERNS: RegExp[] = [
  /\byou\s+will\s+(?:sign|convert|win|close|land|retain|secure)\b/i,
  /\bwill\s+(?:sign|convert|win|close)\s+(?:cases|clients|more)\b/i,
  /\bguaranteed\s+(?:cases|clients|signings|conversions|results|roi|return)\b/i,
  /\b(?:double|triple|10x|quadruple)\s+your\b/i,
  /\bmaximize\s+your\s+(?:revenue|profit|caseload|returns?)\b/i,
  /\bguaranteed\s+to\b/i,
  /\bwe\s+will\s+(?:win|get\s+you|make\s+you)\b/i,
]

/** Volume guarantees. Any promised quantity of cases or clients. */
const VOLUME_GUARANTEE_PATTERNS: RegExp[] = [
  /\b\d+\s+(?:cases|clients|signings|leads)\s+(?:per|a|each)\s+(?:month|week|day|quarter|year)\b/i,
  /\bat\s+least\s+\d+\s+(?:cases|clients|signings|leads)\b/i,
  /\bexpect\s+\d+\s+(?:cases|clients|signings|leads)\b/i,
  /\bwe\s+deliver\s+\d+\b/i,
  /\bguaranteed\s+volume\b/i,
  /\bup\s+to\s+\d+\s+(?:cases|clients|signings)\s+(?:per|a|each)\b/i,
]

function scan(text: string, patterns: RegExp[], kind: OutreachViolationKind): OutreachClaimViolation[] {
  const out: OutreachClaimViolation[] = []
  for (const pattern of patterns) {
    const m = pattern.exec(text)
    if (m) out.push({ term: m[0].toLowerCase(), kind, index: m.index })
  }
  return out
}

/** Return every Rule 7.1 violation in a piece of outreach copy. */
export function findOutreachClaimViolations(text: string): OutreachClaimViolation[] {
  if (!text) return []
  return [
    ...scan(text, GUARANTEE_PATTERNS, 'guarantee'),
    ...scan(text, PROMISED_OUTCOME_PATTERNS, 'promised-outcome'),
    ...scan(text, VOLUME_GUARANTEE_PATTERNS, 'volume-guarantee'),
  ].sort((a, b) => a.index - b.index)
}

/** True when the outreach is truthful and non misleading under Rule 7.1. */
export function isCompliantOutreach(text: string): boolean {
  return findOutreachClaimViolations(text).length === 0
}

export class OutreachClaimError extends Error {
  readonly violations: OutreachClaimViolation[]
  constructor(violations: OutreachClaimViolation[]) {
    super(`Non compliant outreach claim (Rule 7.1): ${violations.map((v) => `${v.kind}:"${v.term}"`).join(', ')}`)
    this.name = 'OutreachClaimError'
    this.violations = violations
  }
}

/** Assert an outreach draft is compliant. Throws on any Rule 7.1 violation. */
export function assertCompliantOutreach(text: string): void {
  const violations = findOutreachClaimViolations(text)
  if (violations.length > 0) throw new OutreachClaimError(violations)
}
