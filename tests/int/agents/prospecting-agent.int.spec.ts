import { describe, it, expect } from 'vitest'
import {
  createProspectingService,
  ProspectingComplianceError,
  type EnrichmentClient,
  type ProofOfRealityReader,
  type ProspectTarget,
  type WebResearchClient,
} from '@/services/ProspectingService'
import { createProspectingAgent } from '@/agents/ProspectingAgent'
import { findOutreachClaimViolations } from '@/lib/compliance/outreachClaims'
import type { RedactedActivity } from '@/services/GlassBoxService'
import type { EventStore, StoredEvent } from '@/services/ports'

/**
 * The B2B Prospecting and Proof of Reality Agent eval harness (AGENTS.md Section
 * 4.3, Section 6). Proven: it drafts and never sends (human in the loop), every
 * draft is truthful and non misleading (Rule 7.1), and claimant PII never
 * survives into surfaced proof of reality.
 */

const target: ProspectTarget = { firmId: 'firm_x', firmName: 'Peachtree Injury Law', market: 'atlanta-ga', domain: 'peachtreeinjury.com' }

const cleanProof: RedactedActivity[] = [
  { reference: 'CP-0001', caseType: 'motor-vehicle-accident', market: 'atlanta-ga', receivedAt: '2026-07-01T00:00:00.000Z', status: 'received' },
  { reference: 'CP-0002', caseType: 'premises-liability', market: 'atlanta-ga', receivedAt: '2026-07-02T00:00:00.000Z', status: 'received' },
]

function eventCollector(): { store: EventStore; log: StoredEvent[] } {
  const log: StoredEvent[] = []
  let n = 0
  return {
    log,
    store: {
      append: async (e) => {
        const stored = { id: `evt_${(n += 1)}`, ...e }
        log.push(stored)
        return stored
      },
    },
  }
}

function build(opts: {
  enrichment?: Partial<Awaited<ReturnType<EnrichmentClient['enrich']>>>
  webFindings?: string[]
  proof?: RedactedActivity[]
}) {
  const events = eventCollector()
  const enrichment: EnrichmentClient = {
    enrich: async () => ({ partnerName: 'Dana Whitfield', practiceAreas: ['personal injury'], ...opts.enrichment }),
  }
  const web: WebResearchClient = {
    research: async () => ({ findings: opts.webFindings ?? ['Your team recently expanded its trial practice.'] }),
  }
  const proof: ProofOfRealityReader = { forMarket: async () => opts.proof ?? cleanProof }
  const svc = createProspectingService({ enrichment, web, proof, events: events.store, clock: { nowIso: () => '2026-07-05T18:00:00.000Z' } })
  const agent = createProspectingAgent(svc)
  return { svc, agent, log: events.log }
}

describe('Prospecting Agent: human in the loop (AGENTS.md 3, 4.3)', () => {
  it('produces a draft awaiting human approval, never a send', async () => {
    const { agent } = build({})
    const result = await agent.prospect(target)
    expect(result.draft.status).toBe('draft')
    expect(result.awaitingHumanApproval).toBe(true)
    // The action space has no send capability. The result is a draft only.
    expect(Object.keys(result)).toEqual(['research', 'draft', 'awaitingHumanApproval'])
  })

  it('personalizes the draft from research and frames proof as representative, not a guarantee', async () => {
    const { agent, log } = build({})
    const { draft } = await agent.prospect(target)
    expect(draft.body).toContain('Dana Whitfield')
    expect(draft.body).toContain('atlanta-ga')
    expect(draft.proofFraming.toLowerCase()).toContain('not a guarantee')
    expect(findOutreachClaimViolations(`${draft.subject}\n${draft.body}`)).toEqual([])
    // Both steps are audited.
    expect(log.map((e) => e.eventType)).toEqual(['ProspectResearched', 'ProspectDraftCreated'])
  })
})

describe('Prospecting Agent: Rule 7.1 hard stop', () => {
  it('rejects a draft when research injects a guarantee or volume claim', async () => {
    const { agent } = build({ webFindings: ['We guarantee you at least 20 cases a month, risk free.'] })
    await expect(agent.prospect(target)).rejects.toBeInstanceOf(ProspectingComplianceError)
  })

  it('the guard catches a battery of forbidden claims and passes legitimate outreach', () => {
    const forbidden = [
      'We guarantee results.',
      'You will sign more clients.',
      'Expect 30 cases per month.',
      'Double your revenue, risk free.',
      'At least 10 signings guaranteed.',
    ]
    for (const t of forbidden) expect(findOutreachClaimViolations(t).length, t).toBeGreaterThan(0)
    const ok = 'We route worked up personal injury case files, one firm per market, on geography alone.'
    expect(findOutreachClaimViolations(ok)).toEqual([])
  })
})

describe('Prospecting Agent: PII redaction on proof of reality', () => {
  it('drops any proof item that still carries claimant PII and records the drop', async () => {
    const leaky: RedactedActivity[] = [
      ...cleanProof,
      { reference: 'CP-LEAK jane@example.com', caseType: 'dog-bite', market: 'atlanta-ga', receivedAt: '2026-07-03T00:00:00.000Z', status: 'received' },
      { reference: 'CP-LEAK 404-555-0100', caseType: 'dog-bite', market: 'atlanta-ga', receivedAt: '2026-07-03T00:00:00.000Z', status: 'received' },
    ]
    const { agent, log } = build({ proof: leaky })
    const { research } = await agent.prospect(target)
    // Only the clean items survive.
    expect(research.proof).toHaveLength(2)
    expect(research.proof.every((p) => !/@|\d{3}[-.]?\d{3}[-.]?\d{4}/.test(p.reference))).toBe(true)
    const researched = log.find((e) => e.eventType === 'ProspectResearched')
    expect(researched?.payload?.droppedForPii).toBe(2)
  })
})
