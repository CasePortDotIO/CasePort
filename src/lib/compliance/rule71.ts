import { findPublicCopyViolations } from './publicCopy'

/**
 * Rule 7.1 compliance for B2B outbound and authority copy (DEMAND_CAPTURE.md
 * HL6, ABA Rule 7.1). Firms are not protected the way claimants are, so outbound
 * to firms is normal B2B sales, but it makes no guarantees, creates no
 * unjustified expectations, and promises no outcomes. Proof of reality is
 * representative recent activity with claimant PII redacted, never a volume
 * guarantee.
 *
 * This reuses the guarantee and legal advice detection from the public copy gate
 * and adds the two B2B specific failure modes: a volume or supply guarantee, and
 * claimant personally identifiable information leaking into the proof.
 */
export interface Rule71Violation {
  rule: 'guarantee' | 'legal-advice' | 'prohibited-term' | 'volume-guarantee' | 'unjustified-expectation' | 'pii-leak'
  match: string
}

/**
 * A promise of case volume or supply. CasePort frames representative recent
 * activity, never a guarantee of how many cases a firm will receive.
 */
const VOLUME_GUARANTEE_TERMS = [
  'guaranteed volume',
  'guaranteed cases',
  'guaranteed leads',
  'we will send you',
  'you will receive',
  'cases per month',
  'cases a month',
  'leads per month',
  'leads a month',
  'guaranteed roi',
  'guaranteed return',
  'exclusive volume',
]

/** Unjustified expectation language Rule 7.1 forbids. */
const UNJUSTIFIED_EXPECTATION_TERMS = [
  'you will win',
  'you will make',
  'you will earn',
  'certain to',
  'no risk',
  'risk free',
  'risk-free',
  'sure thing',
]

function has(haystackLower: string, phrase: string): boolean {
  const escaped = phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(haystackLower)
}

/**
 * Detect claimant PII in text that is supposed to be redacted. Emails, phone
 * numbers, and full personal names must never appear in proof of reality. This
 * is deliberately conservative: a hit blocks the send.
 */
export function findPiiLeaks(text: string): string[] {
  const leaks: string[] = []
  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (email) leaks.push(email[0])
  // North American phone shapes: 555-123-4567, (555) 123-4567, 5551234567.
  const phone = text.match(/(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)
  if (phone) leaks.push(phone[0])
  return leaks
}

/** Scan B2B outbound or authority copy for every Rule 7.1 failure mode. */
export function findRule71Violations(text: string): Rule71Violation[] {
  const violations: Rule71Violation[] = []
  if (!text) return violations
  const lower = text.toLowerCase()

  // Guarantee, legal advice, and non recommendation terms carry over from the
  // public copy gate; they are just as forbidden in B2B copy.
  for (const v of findPublicCopyViolations(text)) {
    if (v.rule === 'guarantee' || v.rule === 'legal-advice' || v.rule === 'prohibited-term') {
      violations.push({ rule: v.rule, match: v.match })
    }
  }
  for (const term of VOLUME_GUARANTEE_TERMS) {
    if (has(lower, term)) violations.push({ rule: 'volume-guarantee', match: term })
  }
  for (const term of UNJUSTIFIED_EXPECTATION_TERMS) {
    if (has(lower, term)) violations.push({ rule: 'unjustified-expectation', match: term })
  }
  for (const pii of findPiiLeaks(text)) {
    violations.push({ rule: 'pii-leak', match: pii })
  }
  return violations
}

export function isRule71Clean(text: string): boolean {
  return findRule71Violations(text).length === 0
}
