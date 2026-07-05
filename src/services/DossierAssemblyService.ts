import type { FirmOnlyEvaluation } from '@/lib/compliance/dossierProjections'
import type { Clock, DossierRepository, EventStore } from './ports'
import type { ScpsFactors } from './scps'
import { QualificationService, tierForScps, type QualificationInput } from './QualificationService'

/**
 * DossierAssemblyService. The Dossier Assembly Orchestrator (AGENTS.md Section
 * 4.2).
 *
 * PATTERN: a durable workflow with a deterministic body, not a true agent. The
 * goal and the steps are fixed; only the content varies. It runs as a step
 * inside the delivery workflow (src/inngest/workflows.ts), so it is retryable
 * and observable.
 *
 * WHAT IT DOES: the one write that turns a claimant assembled dossier into a
 * firm facing closing kit. It gathers the qualification signals, computes the
 * five layer view and the SCPS factors (QualificationService), scores a
 * versioned SCPS from those factors (the intelligence scorer, the single
 * auditable place scoring happens), and attaches the firm only evaluation half
 * to the dossier.
 *
 * COMPLIANCE SPINE:
 *   W1: this runs AFTER the geographic routing decision. Routing already
 *       resolved the firm from market and validation alone. No factor computed
 *       here is ever reachable by the router. The physical separation is the
 *       guarantee: assembly cannot run before routing in the workflow.
 *   W2: everything produced here is the firm only half. The claimant projection
 *       omits it structurally.
 *   W3, W4: no fee is read or written. SCPS never gates delivery; it rides along
 *       as triage so the partner can prioritize what they already received.
 */

/** The firm facts the assembly needs. Practice areas and the callback window. */
export interface FirmForAssembly {
  id: string
  caseTypes: string[]
  slaCallbackMinutes: number
}

/**
 * Documentation completeness for a dossier, derived from the intake event log.
 * A record of what was captured, never a judgment about the case.
 */
export interface DocumentationReader {
  forDossier(input: {
    dossierId: string
    intakeSessionId: string | null
  }): Promise<QualificationInput['documentation']>
}

export interface AssemblyDeps {
  dossiers: Pick<DossierRepository, 'get' | 'attachEvaluation'>
  firms: { get(firmId: string): Promise<FirmForAssembly | null> }
  documentation: DocumentationReader
  /** The versioned SCPS scorer (IntelligenceService.scoreDossier). */
  score(dossierId: string, factors: ScpsFactors): Promise<{ score: number; modelVersion: string }>
  events: EventStore
  clock: Clock
}

export interface AssemblyResult {
  dossierId: string
  firmId: string
  scpsScore: number
  scpsVersion: string
  qualificationTier: FirmOnlyEvaluation['qualificationTier']
}

export function createDossierAssemblyService(deps: AssemblyDeps) {
  /**
   * Assemble the firm facing package for a routed dossier. Deterministic given
   * the dossier facts and the active model version, so a workflow retry reattaches
   * the same evaluation rather than drifting. Returns null when the dossier or
   * firm is missing, so the caller can decide without a thrown error.
   */
  async function assembleFirmPackage(dossierId: string, firmId: string): Promise<AssemblyResult | null> {
    const dossier = await deps.dossiers.get(dossierId)
    if (!dossier) return null
    const firm = await deps.firms.get(firmId)
    if (!firm) return null

    const documentation = await deps.documentation.forDossier({
      dossierId,
      intakeSessionId: dossier.intakeSessionId,
    })

    const qualification = QualificationService.runFiveLayer({
      caseType: dossier.caseType,
      statuteOfLimitationsDate: dossier.statuteOfLimitationsDate,
      receivedAt: dossier.receivedAt,
      firmCaseTypes: firm.caseTypes,
      firmSlaCallbackMinutes: firm.slaCallbackMinutes,
      documentation,
    })

    // The versioned SCPS, the single place scoring happens. Records its model
    // version so a later recalibration is auditable (Section 9, W1, W2).
    const { score, modelVersion } = await deps.score(dossierId, qualification.factors)

    const evaluation: FirmOnlyEvaluation = {
      scpsScore: score,
      scpsVersion: modelVersion,
      qualificationScore: score,
      qualificationTier: tierForScps(score),
      qualificationBreakdown: qualification.evaluation.qualificationBreakdown,
      estimatedValue: qualification.evaluation.estimatedValue,
      injurySeverity: qualification.evaluation.injurySeverity,
      liabilityAssessment: qualification.evaluation.liabilityAssessment,
      statuteStatus: qualification.evaluation.statuteStatus,
      // SCPS is the Signed Case Probability Score; the probability is the score.
      signedCaseProbability: score / 100,
    }

    await deps.dossiers.attachEvaluation(dossierId, evaluation)

    await deps.events.append({
      eventType: 'DossierAssembled',
      aggregateType: 'dossier',
      aggregateId: dossierId,
      actor: 'system',
      occurredAt: deps.clock.nowIso(),
      payload: {
        firmId,
        scpsScore: score,
        scpsVersion: modelVersion,
        qualificationTier: evaluation.qualificationTier,
        fiveLayer: qualification.fiveLayer,
      },
    })

    return { dossierId, firmId, scpsScore: score, scpsVersion: modelVersion, qualificationTier: evaluation.qualificationTier }
  }

  return { assembleFirmPackage }
}

export type DossierAssemblyService = ReturnType<typeof createDossierAssemblyService>
