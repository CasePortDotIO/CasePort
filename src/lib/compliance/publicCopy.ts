import {
  PROHIBITED_ADVICE_TERMS,
  PROHIBITED_GUARANTEE_TERMS,
  PROHIBITED_INTAKE_CTAS,
  PROHIBITED_PUBLIC_EVALUATIVE,
  PROHIBITED_PUBLIC_TERMS,
} from '@/lib/domain/demandCapture'

/**
 * Public copy compliance for the Demand Capture Engine (DEMAND_CAPTURE.md HL5,
 * HL7, Wall W6). Where assertNoEvaluativeLeak guards claimant payloads by field
 * name, this guards the text body of any asset bound for a public surface by
 * content.
 *
 * It fails copy that:
 *   - uses a non recommendation word (approved, vetted, qualified, matched, ...)
 *     that would imply CasePort selects or endorses a firm (HL5, W6).
 *   - exposes an evaluative signal publicly (SCPS, case value, probability) (W2).
 *   - uses a prohibited call to action (free case review, case evaluation) (S8).
 *   - contains an em dash (HL7, Section 14 of CLAUDE.md).
 *   - abbreviates personal injury as PI (HL7).
 *
 * The author is not a lawyer and the content is educational; that framing plus
 * this gate is how a public asset stays Rule 7.1 clean.
 */
export interface CopyViolation {
  rule:
    | 'prohibited-term'
    | 'public-evaluative'
    | 'prohibited-cta'
    | 'guarantee'
    | 'legal-advice'
    | 'em-dash'
    | 'abbreviation'
  match: string
}

/** Match a whole word or phrase, case insensitive, on a word boundary. */
function containsPhrase(haystackLower: string, phrase: string): boolean {
  const p = phrase.toLowerCase()
  // Word boundary on both ends so "best" does not trip inside "biggest".
  const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(haystackLower)
}

/**
 * Scan a block of public copy and return every violation found. Non throwing so
 * it can be used in tests, admin tooling, and the pre publish gate alike.
 */
export function findPublicCopyViolations(text: string): CopyViolation[] {
  const violations: CopyViolation[] = []
  if (!text) return violations
  const lower = text.toLowerCase()

  for (const term of PROHIBITED_PUBLIC_TERMS) {
    if (containsPhrase(lower, term)) violations.push({ rule: 'prohibited-term', match: term })
  }
  for (const term of PROHIBITED_PUBLIC_EVALUATIVE) {
    if (containsPhrase(lower, term)) violations.push({ rule: 'public-evaluative', match: term })
  }
  for (const cta of PROHIBITED_INTAKE_CTAS) {
    if (containsPhrase(lower, cta)) violations.push({ rule: 'prohibited-cta', match: cta })
  }
  for (const term of PROHIBITED_GUARANTEE_TERMS) {
    if (containsPhrase(lower, term)) violations.push({ rule: 'guarantee', match: term })
  }
  for (const term of PROHIBITED_ADVICE_TERMS) {
    if (containsPhrase(lower, term)) violations.push({ rule: 'legal-advice', match: term })
  }
  // Em dash, anywhere (HL7). Figure dash and horizontal bar too. Expressed as
  // unicode escapes so the em dash character never appears literally in source.
  const dash = text.match(/[\u2014\u2015\u2012]/)
  if (dash) violations.push({ rule: 'em-dash', match: dash[0] })
  // Personal injury abbreviated as PI (standalone token, upper case).
  if (/(^|[^a-zA-Z])PI([^a-zA-Z]|$)/.test(text)) {
    violations.push({ rule: 'abbreviation', match: 'PI' })
  }

  return violations
}

export function isPublicCopyClean(text: string): boolean {
  return findPublicCopyViolations(text).length === 0
}
