import type { CaptureSurface } from '@/lib/domain/demandCapture'
import type { AssetStructure } from '@/lib/demand/placement'
import type { DemandCaptureService } from './DemandCaptureService'
import type { KeywordRegistry } from './demandCapturePorts'

/**
 * Ports for the Demand Capture B2C sensing and drafting layer (Phase B). Sensing
 * and drafting are agentic (Section 3): open ended reasoning over heterogeneous
 * surfaces. Both are bounded here behind ports so the orchestration is
 * deterministic and testable, and both are human published (HL4): the drafter
 * produces a draft, never a live post.
 *
 * Nothing in this layer contacts an injured person. The sensor reads public
 * intent expressed in claimants' own words and returns questions to answer; it
 * never returns a person to reach. This is harvesting, never interception (HL1).
 */

/** A high intent question surfaced from a public surface, with its cell scoring inputs. */
export interface SensedQuestion {
  canonicalQuestion: string
  market: string
  caseType: string
  legalConcept: string
  /** Stable cell key: market:caseType:legalConcept. */
  cellKey: string
  /** Can CasePort say something uniquely or better here. 0 to 1. */
  uniqueness: number
  /** Distinct high intent for this question. 0 to 1. */
  intent: number
  /** Why the sensor surfaced it. For the operator, never published. */
  rationale?: string
}

export interface SenseInput {
  market: string
  surface: CaptureSurface
  limit: number
}

/**
 * Surfaces candidate high intent questions on a surface in a market. Agentic in
 * production (reads answer engines, question platforms, search trends via the
 * declared allowlist); a fake returns scripted candidates in tests. It returns
 * questions, never people, and never a message to anyone (HL1).
 */
export interface QuestionSensor {
  sense(input: SenseInput): Promise<SensedQuestion[]>
}

/** A drafted answer, ready for the deterministic placement and copy gate. */
export interface DraftedAnswer {
  title: string
  url: string
  /** The real named identity that will publish it (HL2). */
  owningIdentity: string
  structure: AssetStructure
}

export interface DraftInput {
  canonicalQuestion: string
  market: string
  caseType: string
  legalConcept: string
  cellKey: string
  surface: CaptureSurface
  owningIdentity: string
}

/**
 * Drafts a compliant, citable answer for a question. Agentic in production
 * (Claude), a fake in tests. It drafts only; a human approves and posts through
 * the existing publish gate (HL4). Its output is always run through the
 * deterministic placement and public copy gate, so a non compliant draft can
 * never be published no matter what the drafter produces.
 */
export interface AnswerDrafter {
  draft(input: DraftInput): Promise<DraftedAnswer>
}

export interface DemandAgentDeps {
  demand: DemandCaptureService
  registry: KeywordRegistry
  sensor: QuestionSensor
  drafter: AnswerDrafter
}
