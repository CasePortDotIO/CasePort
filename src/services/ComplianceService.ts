import {
  assertNoEvaluativeLeak,
  findEvaluativeLeaks,
  type EvaluativeLeak,
} from '@/lib/compliance/assertNoEvaluativeLeak'
import {
  assertCompliantClaimantText,
  findClaimantLanguageViolations,
  type ClaimantLanguageViolation,
} from '@/lib/compliance/claimantLanguage'

/**
 * ComplianceService. Section 4 domain service.
 *
 * The single callable surface for the compliance wall. Routes, Payload hooks,
 * and Inngest functions call this. They never reimplement the checks inline.
 * Designed to become an MCP tool: clean inputs, clean outputs, no side channels.
 *
 * Phase 0 scope: the evaluative leak guard (W2). Later phases add
 * serveDisclosure (W6), writeAudit (W7), and retentionPolicy (W7).
 */
export const ComplianceService = {
  /**
   * Guard a payload bound for a claimant surface. Throws on any evaluative
   * field. Call at the boundary of every claimant serving endpoint.
   */
  guardClaimantPayload(payload: unknown): void {
    assertNoEvaluativeLeak(payload)
  },

  /**
   * Non throwing inspection. Returns every evaluative leak found. Useful for
   * logging, tests, and admin tooling.
   */
  inspectForLeaks(payload: unknown): EvaluativeLeak[] {
    return findEvaluativeLeaks(payload)
  },

  /**
   * Guard a piece of generated prose bound for a claimant surface (evidence
   * coaching, reflective playback, protection plan). Throws on any W6 non
   * recommendation phrasing or W2 legal evaluation. The prose complement to
   * guardClaimantPayload: one guards structured fields, this guards free text.
   */
  guardClaimantText(text: string): void {
    assertCompliantClaimantText(text)
  },

  /**
   * Non throwing inspection of generated prose. Returns every claimant language
   * violation found. Used by the coaching agent to decide whether to surface a
   * generated direction or substitute a safe fallback, and by its eval harness.
   */
  inspectClaimantText(text: string): ClaimantLanguageViolation[] {
    return findClaimantLanguageViolations(text)
  },
}
