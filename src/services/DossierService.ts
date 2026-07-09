import {
  toClaimantDossier,
  toFirmDossier,
  type Dossier,
  type ClaimantSafeDossier,
  type FirmOnlyEvaluation,
} from '@/lib/compliance/dossierProjections'

/**
 * DossierService. Section 4, Section 5. Assembles the case file and produces the
 * two audience projections. The projections are the enforced audience split
 * (W2). The claimant projection never carries an evaluative field; the
 * compliance leak test guards it.
 */

/** The firm only evaluation half at intake time. SCPS and the qualification
 * factors are computed by QualificationService and attached after routing
 * (Section 8, Phase 3), so at assembly they are unset placeholders. Keeping the
 * fields present preserves the physical split from day one. */
function emptyEvaluation(): FirmOnlyEvaluation {
  return {
    scpsScore: 0,
    scpsVersion: 'v1',
    qualificationTier: 'D',
    qualificationScore: 0,
    qualificationBreakdown: [],
    estimatedValue: 0,
    injurySeverity: 'not yet assessed',
    liabilityAssessment: 'not yet assessed',
    statuteStatus: 'not yet assessed',
    signedCaseProbability: 0,
  }
}

export const DossierService = {
  /**
   * Assemble a dossier from claimant safe intake material. The evaluation half
   * starts empty and is populated firm side after routing. Returns the full
   * internal dossier holding both halves.
   */
  assemble(input: Omit<ClaimantSafeDossier, 'status'> & { claimantId: string; intakeSessionId?: string | null }): Dossier {
    return {
      id: input.id,
      reference: input.reference,
      claimantId: input.claimantId,
      intakeSessionId: input.intakeSessionId ?? null,
      market: input.market,
      caseType: input.caseType,
      status: 'received',
      plainLanguageSummary: input.plainLanguageSummary,
      protectionPlan: [...input.protectionPlan],
      statuteOfLimitationsDate: input.statuteOfLimitationsDate,
      receivedAt: input.receivedAt,
      evaluation: emptyEvaluation(),
    }
  },

  /** The claimant safe projection. Structurally omits the evaluation half (W2). */
  claimantProjection(dossier: Dossier): ClaimantSafeDossier {
    return toClaimantDossier(dossier)
  },

  /** The firm facing projection. Both halves, gated to the market firm elsewhere. */
  firmProjection(dossier: Dossier): Dossier {
    return toFirmDossier(dossier)
  },
}
