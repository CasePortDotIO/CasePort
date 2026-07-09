import type { Clock, EventStore } from './ports'
import type { RedactedActivity } from './GlassBoxService'
import { findOutreachClaimViolations, type OutreachClaimViolation } from '@/lib/compliance/outreachClaims'

/**
 * ProspectingService. The action space of the B2B Prospecting and Proof of
 * Reality Agent (AGENTS.md Section 4.3). It is the only agentic work that moves
 * the binding constraint, signing Founding Partner one: it manufactures
 * personalized, truthful proof at scale so the human close lands.
 *
 * Two hard boundaries live here, in the service, so the agent cannot bypass them:
 *   - It DRAFTS. A human SENDS. There is no send method anywhere in this service
 *     (AGENTS.md Section 3: human in the loop for all B2B outreach). The output
 *     is always a draft.
 *   - Every draft is truthful and non misleading (Rule 7.1). No guarantee, no
 *     promised outcome, no volume guarantee. Proof of reality is representative
 *     recent activity with claimant PII redacted, framed as what came through
 *     the market, never as a volume guarantee. Both are enforced, not assumed.
 */

/** A target firm to prospect. Public B2B facts only. */
export interface ProspectTarget {
  firmId: string
  firmName: string
  market: string
  domain?: string
}

/** Clay style enrichment on a firm. Public firmographic data. */
export interface EnrichmentClient {
  enrich(input: { firmName: string; market: string; domain?: string }): Promise<{
    partnerName?: string
    practiceAreas?: string[]
    headcount?: number
    notes?: string[]
  }>
}

/** Open web research on the firm and partner. Public information only. */
export interface WebResearchClient {
  research(input: { firmName: string; market: string }): Promise<{ findings: string[] }>
}

/** The proof of reality reader: redacted representative recent activity. */
export interface ProofOfRealityReader {
  forMarket(market: string, limit: number): Promise<RedactedActivity[]>
}

export interface ProspectResearch {
  target: ProspectTarget
  partnerName: string | null
  practiceAreas: string[]
  webFindings: string[]
  proof: RedactedActivity[]
}

export interface OutreachDraft {
  /** Always draft. A human reviews and sends (AGENTS.md Section 3). */
  status: 'draft'
  target: ProspectTarget
  subject: string
  body: string
  /** The representative recent activity referenced, redacted. */
  proof: RedactedActivity[]
  /** Framing that must accompany the proof: representative, never a guarantee. */
  proofFraming: string
}

export interface ProspectingDeps {
  enrichment: EnrichmentClient
  web: WebResearchClient
  proof: ProofOfRealityReader
  events: EventStore
  clock: Clock
}

export const REPRESENTATIVE_FRAMING =
  'Representative recent activity from your market. This is what came through, not a guarantee of volume or outcome.'

/** Claimant PII patterns that must never survive into surfaced proof. */
const PII_PATTERNS: RegExp[] = [
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // phone
  /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/, // email
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN
]

/** True when a redacted activity item still carries claimant PII (it must not). */
function activityHasPii(item: RedactedActivity): boolean {
  const blob = `${item.reference} ${item.caseType} ${item.market} ${item.status}`
  return PII_PATTERNS.some((re) => re.test(blob))
}

export function createProspectingService(deps: ProspectingDeps) {
  /**
   * Research a target firm: enrich, web research, and pull the redacted proof of
   * reality for its market. Any proof item that still carries PII is dropped, not
   * surfaced, so redaction is enforced here regardless of the reader.
   */
  async function researchFirm(target: ProspectTarget): Promise<ProspectResearch> {
    const [enrichment, web, proofRaw] = await Promise.all([
      deps.enrichment.enrich({ firmName: target.firmName, market: target.market, domain: target.domain }),
      deps.web.research({ firmName: target.firmName, market: target.market }),
      deps.proof.forMarket(target.market, 5),
    ])

    // Enforce redaction: never surface an item that still carries PII.
    const proof = proofRaw.filter((item) => !activityHasPii(item))

    await deps.events.append({
      eventType: 'ProspectResearched',
      aggregateType: 'firm',
      aggregateId: target.firmId,
      actor: 'agent',
      occurredAt: deps.clock.nowIso(),
      payload: {
        market: target.market,
        proofCount: proof.length,
        droppedForPii: proofRaw.length - proof.length,
      },
    })

    return {
      target,
      partnerName: enrichment.partnerName ?? null,
      practiceAreas: enrichment.practiceAreas ?? [],
      webFindings: web.findings,
      proof,
    }
  }

  /**
   * Draft personalized outreach from the research. Deterministic template so the
   * draft is reproducible and every fact is traceable. The body is guarded
   * against Rule 7.1 before it is returned: if any guarantee, promised outcome,
   * or volume claim slipped in, the draft is rejected rather than returned, so a
   * non compliant draft can never reach the human reviewer, let alone a firm.
   */
  async function draftOutreach(research: ProspectResearch): Promise<OutreachDraft> {
    const { target } = research
    const greetingName = research.partnerName ? research.partnerName : 'there'
    const practice = research.practiceAreas[0] ?? 'personal injury'

    const lines = [
      `Hi ${greetingName},`,
      ``,
      `I lead partnerships at CasePort. I noticed ${target.firmName} works ${practice} matters in ${target.market}.`,
      research.webFindings[0] ? `${research.webFindings[0]}` : ``,
      ``,
      `We built a source system that assembles worked up personal injury case files and routes them, one firm per market, on geography alone. I can show you redacted, representative recent activity from ${target.market} so you can see what has actually been coming through, and a full sample case file.`,
      ``,
      `${research.proof.length} representative recent matters are attached, redacted. This shows what actually came through the market. It is representative recent activity, not a prediction of volume or outcome.`,
      ``,
      `Open to a short call to walk through it in your own numbers?`,
      ``,
      `Best,`,
      `CasePort Partnerships`,
    ]
    const body = lines.filter((l) => l !== null && l !== undefined).join('\n')
    const subject = `Redacted recent personal injury activity in ${target.market}`

    // Rule 7.1 hard stop. A draft that makes a forbidden claim is never returned.
    const violations = findOutreachClaimViolations(`${subject}\n${body}`)
    if (violations.length > 0) {
      throw new ProspectingComplianceError(violations)
    }

    await deps.events.append({
      eventType: 'ProspectDraftCreated',
      aggregateType: 'firm',
      aggregateId: target.firmId,
      actor: 'agent',
      occurredAt: deps.clock.nowIso(),
      payload: { market: target.market, proofCount: research.proof.length, status: 'draft' },
    })

    return { status: 'draft', target, subject, body, proof: research.proof, proofFraming: REPRESENTATIVE_FRAMING }
  }

  return { researchFirm, draftOutreach }
}

/** Thrown when a generated draft would violate Rule 7.1. It is never returned. */
export class ProspectingComplianceError extends Error {
  readonly violations: OutreachClaimViolation[]
  constructor(violations: OutreachClaimViolation[]) {
    super(`Draft blocked by Rule 7.1: ${violations.map((v) => v.kind).join(', ')}`)
    this.name = 'ProspectingComplianceError'
    this.violations = violations
  }
}

export type ProspectingService = ReturnType<typeof createProspectingService>
