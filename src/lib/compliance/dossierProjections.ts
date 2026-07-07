/**
 * The dossier audience split, in types and in projection functions.
 * Compliance rules W1 and W2, and Section 5 of CLAUDE.md.
 *
 * A dossier holds two physically separated halves:
 *
 *   ClaimantSafeDossier: status, plain language summary, protection plan,
 *   procedural and geographic facts. This is all a claimant may ever see.
 *
 *   FirmOnlyEvaluation: SCPS, 5LQS reasoning, severity, statute status,
 *   estimated value, and every other evaluative signal. Firm facing only,
 *   computed after routing, delivered as triage.
 *
 * The projection functions are the only sanctioned way to produce a claimant
 * facing view. toClaimantDossier never copies an evaluative field. The Payload
 * field level access control on the dossiers collection is the second, runtime
 * enforced layer. The compliance leak test guards this projection.
 */

/** Firm only evaluative half. Never reaches a claimant surface (W2). */
export interface FirmOnlyEvaluation {
  scpsScore: number
  scpsVersion: string
  qualificationTier: 'A' | 'B' | 'C' | 'D'
  qualificationScore: number
  qualificationBreakdown: Array<{ layer: string; score: number; max: number }>
  estimatedValue: number
  injurySeverity: string
  liabilityAssessment: string
  statuteStatus: string
  signedCaseProbability: number
}

/** Claimant safe half. Procedural and geographic only (W2, W6). */
export interface ClaimantSafeDossier {
  id: string
  /** The short, opaque, human case reference (CP-XXXXXX). The one public id a
   * claimant ever sees, in place of the raw database id. Claimant safe. */
  reference: string
  market: string
  caseType: string
  status: string
  plainLanguageSummary: string
  protectionPlan: string[]
  statuteOfLimitationsDate: string | null
  receivedAt: string
}

/** The full internal dossier. Holds both halves plus claimant reference. */
export interface Dossier extends ClaimantSafeDossier {
  claimantId: string
  /**
   * The intake session this dossier was assembled from. Carried at creation, not
   * reconstructed later, so the attribution trace from a signed case back to the
   * first touch tuple is a direct chain (Section 11). System field: never part
   * of the claimant projection.
   */
  intakeSessionId: string | null
  evaluation: FirmOnlyEvaluation
}

/**
 * Produce the claimant safe view of a dossier. This is the correct projection.
 * It selects only claimant safe fields by name and never touches
 * dossier.evaluation, so no evaluative field can travel with the result.
 */
export function toClaimantDossier(dossier: Dossier): ClaimantSafeDossier {
  return {
    id: dossier.id,
    reference: dossier.reference,
    market: dossier.market,
    caseType: dossier.caseType,
    status: dossier.status,
    plainLanguageSummary: dossier.plainLanguageSummary,
    protectionPlan: [...dossier.protectionPlan],
    statuteOfLimitationsDate: dossier.statuteOfLimitationsDate,
    receivedAt: dossier.receivedAt,
  }
}

/**
 * Produce the firm facing dossier. Both halves are visible to the firm after
 * routing and delivery. Access to this projection is gated to the market's
 * assigned firm elsewhere. It is never served to a claimant.
 */
export function toFirmDossier(dossier: Dossier): Dossier {
  return dossier
}
