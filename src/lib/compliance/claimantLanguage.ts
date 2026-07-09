import { normalizeKey, EVALUATIVE_TOKENS } from './evaluativeFields'

/**
 * The claimant language guard. Compliance rules W2 and W6, enforced on free text
 * at runtime.
 *
 * The evaluative leak guard (assertNoEvaluativeLeak) scans structured payloads
 * for forbidden field names. This guard is its complement for prose: it scans
 * generated claimant facing text (evidence coaching directions, the reflective
 * playback summary, the protection plan) for two things.
 *
 *   1. W6 non recommendation language: the specific violation phrasings that
 *      imply CasePort screened, ranked, or matched a lawyer (vetted, pre
 *      screened, top rated, qualified attorney, best firm, matched you with, we
 *      selected). CasePort recommends no one.
 *
 *   2. Legal evaluation: any language that assesses the case rather than
 *      organizes it (strong case, you have a claim, likely to win, case value,
 *      settlement, liability, at fault). The intake surface is a court reporter,
 *      not a judge. It never says strong case, never estimates value.
 *
 * Matching is phrase and token exact, not bare keyword, so it does not false
 * positive on legitimate procedural coaching. "The best angle for that photo" is
 * fine; "the best firm" is not. "Frame the whole scene" is fine; "you have a
 * strong case" is not. This mirrors the philosophy of the static claimant copy
 * test: target the specific violations so real coaching is never blocked.
 *
 * This is the compliance spine of the Evidence and Intake Coaching Agent
 * (AGENTS.md Section 4.1). Its adversarial eval suite tries to make the agent
 * emit evaluation, and this guard is what must catch every attempt. Tested, not
 * trusted.
 */

export type ClaimantLanguageViolationKind =
  | 'non-recommendation' // W6: implies CasePort screened, ranked, or matched a lawyer
  | 'legal-evaluation' // W2: assesses the case (strength, value, fault, outcome)
  | 'evaluative-token' // W2: names an evaluative signal (SCPS, severity, probability)

export interface ClaimantLanguageViolation {
  /** The matched fragment, lowercased. */
  term: string
  kind: ClaimantLanguageViolationKind
  /** Character index of the match in the scanned text. */
  index: number
}

/**
 * W6 non recommendation phrasings. Each implies CasePort evaluated or ranked a
 * lawyer, which is the exact conduct the Wall forbids on a claimant surface.
 */
const NON_RECOMMENDATION_PATTERNS: RegExp[] = [
  /\bvetted\b/i,
  /\bpre-?screened\b/i,
  /\bpre-?qualified\b/i,
  /\btop-?rated\b/i,
  /\bhand-?picked\b/i,
  /\bqualified\s+(?:attorney|attorneys|lawyer|lawyers|firm|firms)\b/i,
  /\bbest\s+(?:attorney|attorneys|lawyer|lawyers|firm|firms|qualified)\b/i,
  /\b(?:approved|vetted|selected|matched|screened)\s+(?:attorney|attorneys|lawyer|lawyers|firm|firms)\b/i,
  /\bwe\s+(?:selected|matched|approved|vetted|screened|picked|chose)\b/i,
  /\bmatch(?:ed|ing)?\s+you\b/i,
  /\bmatch\s+you\s+with\b/i,
  /\bconnect\s+you\s+with\s+the\s+(?:best|top|right)\b/i,
]

/**
 * Legal evaluation phrasings. Anything that judges the case rather than
 * organizes it. The intake surface never assesses strength, value, fault, or
 * outcome.
 */
const LEGAL_EVALUATION_PATTERNS: RegExp[] = [
  /\b(?:strong|solid|good|great|weak|viable|winnable|excellent|promising)\s+(?:case|claim|signal)\b/i,
  /\byou\s+(?:have|'ve\s+got|got)\s+a\s+(?:case|claim|good|strong)\b/i,
  /\bvalid\s+claim\b/i,
  /\byou(?:'ll|\s+will|\s+would|\s+could|\s+can|\s+should)\s+win\b/i,
  /\blikely\s+to\s+win\b/i,
  /\b(?:high|strong|great|good)\s+(?:value|chances?|odds)\b/i,
  /\bcase\s+(?:value|worth|strength)\b/i,
  /\bworth\s+\$?\d/i,
  /\b(?:settlement|compensation|damages|payout|recovery)\b/i,
  /\b(?:liable|liability|negligent|negligence)\b/i,
  /\bat\s+fault\b/i,
  /\b(?:clearly|obviously)\s+(?:their|the\s+other)\b/i,
  /\bguarantee/i,
  /\bwe\s+can\s+(?:win|recover|get\s+you)\b/i,
]

/** Scan a single pattern list and collect matches. */
function scan(text: string, patterns: RegExp[], kind: ClaimantLanguageViolationKind): ClaimantLanguageViolation[] {
  const out: ClaimantLanguageViolation[] = []
  for (const pattern of patterns) {
    const m = pattern.exec(text)
    if (m) out.push({ term: m[0].toLowerCase(), kind, index: m.index })
  }
  return out
}

/**
 * Scan free text for W2 evaluative tokens. Splits on non alphanumerics, then
 * normalizes each word the same way the evaluative field registry does, so
 * "SCPS", "scps score", or "severity" trip against the single source of truth.
 */
function scanEvaluativeTokens(text: string): ClaimantLanguageViolation[] {
  const out: ClaimantLanguageViolation[] = []
  const wordRe = /[A-Za-z0-9]+/g
  let m: RegExpExecArray | null
  while ((m = wordRe.exec(text)) !== null) {
    if (EVALUATIVE_TOKENS.has(normalizeKey(m[0]))) {
      out.push({ term: m[0].toLowerCase(), kind: 'evaluative-token', index: m.index })
    }
  }
  return out
}

/**
 * Return every claimant language violation in a piece of generated text. Empty
 * array means the text is compliant to surface to a claimant.
 */
export function findClaimantLanguageViolations(text: string): ClaimantLanguageViolation[] {
  if (!text) return []
  return [
    ...scan(text, NON_RECOMMENDATION_PATTERNS, 'non-recommendation'),
    ...scan(text, LEGAL_EVALUATION_PATTERNS, 'legal-evaluation'),
    ...scanEvaluativeTokens(text),
  ].sort((a, b) => a.index - b.index)
}

/** True when the text is safe to surface to a claimant. */
export function isCompliantClaimantText(text: string): boolean {
  return findClaimantLanguageViolations(text).length === 0
}

/** Thrown when generated claimant text carries forbidden language. */
export class ClaimantLanguageError extends Error {
  readonly violations: ClaimantLanguageViolation[]
  constructor(violations: ClaimantLanguageViolation[]) {
    const summary = violations.map((v) => `${v.kind}:"${v.term}"`).join(', ')
    super(`Forbidden claimant language: ${summary}`)
    this.name = 'ClaimantLanguageError'
    this.violations = violations
  }
}

/** Assert generated text is safe for a claimant surface. Throws on any violation. */
export function assertCompliantClaimantText(text: string): void {
  const violations = findClaimantLanguageViolations(text)
  if (violations.length > 0) throw new ClaimantLanguageError(violations)
}
