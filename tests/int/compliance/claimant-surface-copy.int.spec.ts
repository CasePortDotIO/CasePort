import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Compliance guard for claimant facing copy. Rules W2 and W6.
 *
 * The claimant intake surface must never render a case score, a tier, a case
 * assessment, or any of the forbidden non recommendation words (approved,
 * vetted, qualified, pre-screened, top-rated, best, matched, selected). This
 * test scans the source of the claimant component so a regression fails CI
 * rather than reaching a claimant. Scoring lives server side, firm facing,
 * after geographic routing.
 *
 * The list is string exact, targeting the specific violation phrasings, so it
 * does not false positive on CSS class names or internal identifiers.
 */

const CLAIMANT_SURFACES = [
  'src/app/(frontend)/checkmycase/CheckMyCaseClient.tsx',
  'src/app/(frontend)/checkmycase/EvidenceCoach.tsx',
]

/** Phrases that must never appear in a claimant surface. */
const FORBIDDEN_PHRASES = [
  'Case Intelligence Score',
  'Strong Case Signal',
  'Viable Case',
  'cisDisplay',
  'cis-block',
  'cis-ring',
  'qualified attorney',
  'Being matched',
  'being matched',
  'best qualified',
  'best describes',
  'match you with',
  'matched faster',
]

/** The score computation must not exist on the claimant surface (W1, W2). */
const FORBIDDEN_CODE = ['calculateScore()', 'const calculateScore', 'caseScore']

describe('claimant surface copy compliance (W2, W6)', () => {
  for (const rel of CLAIMANT_SURFACES) {
    const source = readFileSync(join(process.cwd(), rel), 'utf8')

    it(`${rel} renders no evaluative score, tier, or assessment`, () => {
      for (const phrase of FORBIDDEN_PHRASES) {
        expect(source, `forbidden claimant phrase present: "${phrase}"`).not.toContain(phrase)
      }
    })

    it(`${rel} computes no case score on the claimant surface`, () => {
      for (const token of FORBIDDEN_CODE) {
        expect(source, `client side scoring present: "${token}"`).not.toContain(token)
      }
    })

    if (rel.includes('CheckMyCaseClient')) {
      it(`${rel} shows the compliant protection plan instead of a score`, () => {
        expect(source).toContain('Your protection plan')
      })
    }
  }
})
