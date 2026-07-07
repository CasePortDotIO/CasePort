import { describe, it, expect } from 'vitest'
import { createPromotionService } from '@/services/PromotionService'
import { createPromotionHarness, promotionDepsFrom } from '@/services/fakes/promotionInMemory'

/**
 * CIC Phase F checkpoint (INTELLIGENCE_CORE.md Section 12, H1). No production
 * value can change without a logged human approval and its evidence. The CIC
 * proposes; humans promote.
 */

function svcWith() {
  const h = createPromotionHarness()
  return { h, svc: createPromotionService(promotionDepsFrom(h)) }
}

describe('promotion gate: the human gate (H1)', () => {
  it('promotes an SCPS version on one logged human approval, and versions it', async () => {
    const { h, svc } = svcWith()
    const proposed = await svc.propose({
      type: 'scps-version',
      summary: 'Recalibrate SCPS injury verification weight up.',
      proposedChange: { injuryVerification: 0.32 },
      evidence: { recommendationId: 'rec_9', dataWindow: '2026-Q2' },
      proposedBy: 'cic',
    })
    expect(proposed.promotion?.status).toBe('pending')
    expect(proposed.promotion?.requiredApprovers).toBe(1)

    const approved = await svc.approve(proposed.promotion!.id, 'a-principal')
    expect(approved.promoted).toBe(true)
    expect(approved.promotion?.status).toBe('promoted')
    expect(approved.promotion?.versionId).toBeTruthy()
    expect(approved.promotion?.approvals[0]?.approver).toBe('a-principal')

    // The versioned value traces to the promotion and its approvers.
    expect(h.versionRows).toHaveLength(1)
    expect(h.versionRows[0]?.version).toBe('v1')
    expect(h.versionRows[0]?.approvedBy).toEqual(['a-principal'])
    const types = h.log.map((e) => e.eventType)
    expect(types).toContain('PromotionProposed')
    expect(types).toContain('PromotionPromoted')
  })

  it('holds a market action until two distinct approvers sign (D8)', async () => {
    const { h, svc } = svcWith()
    const proposed = await svc.propose({
      type: 'market-action',
      summary: 'Enter the Richmond market.',
      proposedChange: { market: 'richmond-va', action: 'enter' },
      evidence: { signalId: 's_1', dataWindow: '2026-Q2' },
      proposedBy: 'cic',
    })
    expect(proposed.promotion?.requiredApprovers).toBe(2)

    const first = await svc.approve(proposed.promotion!.id, 'principal-1')
    expect(first.promoted).toBe(false) // one approver is not enough
    expect(first.promotion?.status).toBe('pending')

    // The same human cannot be the second approver.
    const dup = await svc.approve(proposed.promotion!.id, 'principal-1')
    expect(dup.promoted).toBe(false)
    expect(dup.reasons.join(' ')).toMatch(/already approved/)

    const second = await svc.approve(proposed.promotion!.id, 'principal-2')
    expect(second.promoted).toBe(true)
    expect(second.promotion?.approvals).toHaveLength(2)
    expect(h.versionRows[0]?.approvedBy).toEqual(['principal-1', 'principal-2'])
  })

  it('refuses to propose an outcome scaled price change (W3, H3)', async () => {
    const { h, svc } = svcWith()
    const res = await svc.propose({
      type: 'price-change',
      summary: 'Charge a success fee as a percentage of settlement.',
      proposedChange: { model: 'contingency' },
      evidence: {},
      proposedBy: 'cic',
    })
    expect(res.promotion).toBeNull()
    expect(res.reasons.join(' ')).toMatch(/outcome-scaled-pricing/)
    expect(h.promotionRows.size).toBe(0)
  })

  it('refuses to propose smart routing (W1, H2)', async () => {
    const { svc } = svcWith()
    const res = await svc.propose({
      type: 'market-action',
      summary: 'Route by SCPS to send the best cases to the best firms.',
      proposedChange: {},
      evidence: {},
      proposedBy: 'cic',
    })
    expect(res.promotion).toBeNull()
    expect(res.reasons.join(' ')).toMatch(/smart-routing/)
  })

  it('a rejected promotion never promotes and is logged', async () => {
    const { h, svc } = svcWith()
    const proposed = await svc.propose({
      type: 'price-change',
      summary: 'Raise the flat MVA fee in Atlanta to the higher tier.',
      proposedChange: { cell: 'atlanta:mva', feeCents: 90000 },
      evidence: { dataWindow: '2026-Q2' },
      proposedBy: 'cic',
    })
    const rejected = await svc.reject(proposed.promotion!.id, 'a-principal', 'want more data')
    expect(rejected.promotion?.status).toBe('rejected')
    // A rejected promotion cannot then be approved.
    const after = await svc.approve(proposed.promotion!.id, 'a-principal')
    expect(after.promoted).toBe(false)
    expect(h.versionRows).toHaveLength(0)
    expect(h.log.map((e) => e.eventType)).toContain('PromotionRejected')
  })
})
