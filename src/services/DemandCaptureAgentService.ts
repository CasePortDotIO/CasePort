import { scoreDemandCell } from '@/lib/demand/scoring'
import type { DemandAgentDeps, SensedQuestion } from './demandAgentPorts'
import type { CaptureAssetRecord, DemandCellRecord } from './demandCapturePorts'
import type { CaptureSurface } from '@/lib/domain/demandCapture'

/**
 * DemandCaptureAgentService. The B2C sensing and drafting layer (DEMAND_CAPTURE
 * .md Phase B). It surfaces high intent questions on a surface in a funded
 * market, keeps only the ones worth pursuing and not already owned, ranks them,
 * and drafts a compliant answer for a human to approve and post.
 *
 * It harvests, never intercepts (HL1): it works with questions, never people,
 * and it produces no message to any injured person. Drafting is agentic but
 * human published (HL4): this service can draft and submit for approval, but the
 * only path to a live post is the human approved publish gate on the base
 * DemandCaptureService.
 */
export interface Opportunity {
  canonicalQuestion: string
  cellKey: string
  market: string
  caseType: string
  legalConcept: string
  surface: CaptureSurface
  score: number
  rationale?: string
}

export function createDemandCaptureAgentService(deps: DemandAgentDeps) {
  /**
   * Surface a ranked list of unowned high intent questions in a funded market.
   * Each sensed question is scored by the defensible data cell logic with funded
   * market gating (the score is persisted through the base service), then kept
   * only if it is pursued and not already owned by a published asset. Ranked by
   * score, highest first. Vanity and unfunded questions never appear.
   */
  async function surfaceOpportunities(input: {
    market: string
    surface: CaptureSurface
    limit: number
  }): Promise<Opportunity[]> {
    const sensed = await deps.sensor.sense(input)
    const opportunities: Opportunity[] = []

    for (const q of sensed) {
      // Persist the score through the base service so funded gating, the cell
      // record, and the DemandCellScored event all happen exactly once here.
      const cell: DemandCellRecord = await deps.demand.scoreCell({
        cellKey: q.cellKey,
        market: q.market,
        caseType: q.caseType,
        legalConcept: q.legalConcept,
        surface: input.surface,
        uniqueness: q.uniqueness,
        intent: q.intent,
      })
      if (cell.status !== 'pursue') continue

      // Unowned only: skip a question a published asset already owns (Section 7).
      const owner = await deps.registry.owner(q.canonicalQuestion)
      if (owner) continue

      opportunities.push({
        canonicalQuestion: q.canonicalQuestion,
        cellKey: q.cellKey,
        market: q.market,
        caseType: q.caseType,
        legalConcept: q.legalConcept,
        surface: input.surface,
        score: cell.score,
        rationale: q.rationale,
      })
    }

    return opportunities.sort((a, b) => b.score - a.score).slice(0, input.limit)
  }

  /**
   * Draft a compliant answer for an opportunity and place it in the draft state.
   * The draft is not published and not yet in the approval queue; call
   * submitForApproval to queue it for a human. The draft passes through the same
   * placement and public copy gate at publish time, so a non compliant draft can
   * never reach a public surface no matter what the drafter produced.
   */
  async function draftForOpportunity(
    opportunity: Opportunity,
    owningIdentity: string,
  ): Promise<CaptureAssetRecord> {
    const drafted = await deps.drafter.draft({
      canonicalQuestion: opportunity.canonicalQuestion,
      market: opportunity.market,
      caseType: opportunity.caseType,
      legalConcept: opportunity.legalConcept,
      cellKey: opportunity.cellKey,
      surface: opportunity.surface,
      owningIdentity,
    })
    return deps.demand.draftAsset({
      cellKey: opportunity.cellKey,
      surface: opportunity.surface,
      canonicalQuestion: opportunity.canonicalQuestion,
      url: drafted.url,
      owningIdentity: drafted.owningIdentity,
      title: drafted.title,
      structure: drafted.structure,
    })
  }

  /** Queue a draft for human approval (HL4). Never publishes. */
  async function submitForApproval(assetId: string): Promise<CaptureAssetRecord | null> {
    return deps.demand.submitForApproval(assetId)
  }

  /**
   * One convenience pass for the operator: sense, score, filter, rank, and draft
   * the top opportunities, leaving each in the approval queue for a human. It
   * never publishes. Returns the opportunities and the drafts queued for review.
   */
  async function senseAndDraft(input: {
    market: string
    surface: CaptureSurface
    limit: number
    owningIdentity: string
  }): Promise<{ opportunities: Opportunity[]; drafts: CaptureAssetRecord[] }> {
    const opportunities = await surfaceOpportunities(input)
    const drafts: CaptureAssetRecord[] = []
    for (const opp of opportunities) {
      const draft = await draftForOpportunity(opp, input.owningIdentity)
      const submitted = await deps.demand.submitForApproval(draft.id)
      drafts.push(submitted ?? draft)
    }
    return { opportunities, drafts }
  }

  return { surfaceOpportunities, draftForOpportunity, submitForApproval, senseAndDraft }
}

export type DemandCaptureAgentService = ReturnType<typeof createDemandCaptureAgentService>

/**
 * A pure scoring preview for a sensed question, without persisting. Handy for an
 * operator dry run and for tests that assert the funded gate before any write.
 */
export function previewSensedScore(q: SensedQuestion, fundedMonetizable: boolean) {
  return scoreDemandCell({ uniqueness: q.uniqueness, intent: q.intent, fundedMonetizable })
}
