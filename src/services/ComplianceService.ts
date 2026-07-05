import {
  assertNoEvaluativeLeak,
  findEvaluativeLeaks,
  type EvaluativeLeak,
} from '@/lib/compliance/assertNoEvaluativeLeak'

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
}
