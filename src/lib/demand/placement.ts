import {
  DIRECT_ANSWER_LIMITS,
  INTAKE_CTA,
  INTAKE_PATH,
  KEYWORD_WINDOW_WORDS,
  type BusinessSide,
} from '@/lib/domain/demandCapture'
import { findPublicCopyViolations, type CopyViolation } from '@/lib/compliance/publicCopy'
import { findCallRoutes } from './routing'

/**
 * Deterministic placement validation (DEMAND_CAPTURE.md Section 7). This is the
 * technical layer that makes answer engines pull CasePort, and it is code, not
 * judgment. An asset that fails any of these does not publish.
 *
 * The checks:
 *   - the answer engine citation summary is 100 to 150 words.
 *   - every FAQ answer is 55 to 75 words.
 *   - the target keyword appears within the first 300 words of body.
 *   - structured data (schema) is present.
 *   - public copy is compliant (HL5, HL7): no evaluative or non recommendation
 *     language, no prohibited call to action, no em dash, no PI abbreviation.
 *   - a B2C asset routes its intake call to action to checkmycase with the one
 *     permitted call to action, and carries the ABA compliance disclaimer.
 */
export interface AssetStructure {
  side: BusinessSide
  targetKeyword: string
  /** The answer engine citation summary block. */
  directAnswer: string
  /** FAQ answer blocks, if any. */
  faqAnswers?: string[]
  /** The article body. The keyword must appear in its first window. */
  body: string
  /** The schema.org type on the asset, for example FAQPage or Article. */
  schemaType?: string
  /** B2C assets carry an intake call to action; these fields describe it. */
  intakeCtaText?: string
  intakeCtaHref?: string
  hasComplianceDisclaimer?: boolean
}

export interface StructureViolation {
  rule:
    | 'aeo-summary-length'
    | 'faq-answer-length'
    | 'keyword-window'
    | 'missing-schema'
    | 'public-copy'
    | 'intake-cta'
    | 'missing-disclaimer'
    | 'routes-to-call'
  detail: string
  copy?: CopyViolation
}

const wordCount = (s: string): number => (s.trim() ? s.trim().split(/\s+/).length : 0)
const firstWords = (s: string, n: number): string => s.trim().split(/\s+/).slice(0, n).join(' ')

export function validateAssetStructure(asset: AssetStructure): {
  valid: boolean
  violations: StructureViolation[]
} {
  const violations: StructureViolation[] = []

  // Answer engine citation summary length (Section 7).
  const summaryWords = wordCount(asset.directAnswer)
  if (summaryWords < DIRECT_ANSWER_LIMITS.aeoSummary.min || summaryWords > DIRECT_ANSWER_LIMITS.aeoSummary.max) {
    violations.push({
      rule: 'aeo-summary-length',
      detail: `direct answer is ${summaryWords} words, must be ${DIRECT_ANSWER_LIMITS.aeoSummary.min} to ${DIRECT_ANSWER_LIMITS.aeoSummary.max}`,
    })
  }

  // FAQ answer length (Section 7).
  for (const [i, faq] of (asset.faqAnswers ?? []).entries()) {
    const n = wordCount(faq)
    if (n < DIRECT_ANSWER_LIMITS.faqAnswer.min || n > DIRECT_ANSWER_LIMITS.faqAnswer.max) {
      violations.push({
        rule: 'faq-answer-length',
        detail: `faq answer ${i + 1} is ${n} words, must be ${DIRECT_ANSWER_LIMITS.faqAnswer.min} to ${DIRECT_ANSWER_LIMITS.faqAnswer.max}`,
      })
    }
  }

  // Target keyword within the first window of body (Section 7).
  const window = firstWords(asset.body, KEYWORD_WINDOW_WORDS).toLowerCase()
  if (asset.targetKeyword && !window.includes(asset.targetKeyword.toLowerCase())) {
    violations.push({
      rule: 'keyword-window',
      detail: `target keyword "${asset.targetKeyword}" not present in first ${KEYWORD_WINDOW_WORDS} words of body`,
    })
  }

  // Schema present on every asset (Section 7).
  if (!asset.schemaType || !asset.schemaType.trim()) {
    violations.push({ rule: 'missing-schema', detail: 'no schema.org type on asset' })
  }

  // Public copy compliance across every text block (HL5, HL7).
  const blocks = [asset.directAnswer, asset.body, ...(asset.faqAnswers ?? [])]
  for (const copy of blocks.flatMap((b) => findPublicCopyViolations(b))) {
    violations.push({ rule: 'public-copy', detail: `${copy.rule}: ${copy.match}`, copy })
  }

  // Self closing routing (Section 8, Phase D): no path routes to a call, ever.
  for (const hit of findCallRoutes([asset.intakeCtaHref, asset.body])) {
    violations.push({ rule: 'routes-to-call', detail: `routes to a call: ${hit}` })
  }

  // B2C intake routing (Section 8). Self initiation only, disclaimer required.
  if (asset.side === 'b2c' && (asset.intakeCtaText || asset.intakeCtaHref)) {
    if (asset.intakeCtaText !== INTAKE_CTA) {
      violations.push({
        rule: 'intake-cta',
        detail: `intake call to action must be "${INTAKE_CTA}", got "${asset.intakeCtaText ?? ''}"`,
      })
    }
    if (!asset.intakeCtaHref || !asset.intakeCtaHref.includes(INTAKE_PATH)) {
      violations.push({
        rule: 'intake-cta',
        detail: `intake call to action must route to ${INTAKE_PATH}, got "${asset.intakeCtaHref ?? ''}"`,
      })
    }
    if (!asset.hasComplianceDisclaimer) {
      violations.push({ rule: 'missing-disclaimer', detail: 'intake call to action missing ABA compliance disclaimer' })
    }
  }

  return { valid: violations.length === 0, violations }
}
