import { describe, it, expect } from 'vitest'
import { createAgentService, slaStatus, speedCallbackClaimantMessage } from '@/services/AgentService'
import { createAgentHarness } from '@/services/fakes/agentInMemory'
import { findClaimantLanguageViolations } from '@/lib/compliance/claimantLanguage'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import type { DeliveryForAgent, FirmContact } from '@/services/agentPorts'

/**
 * Phase 5 checkpoint (Section 13). The agents and the speed loop are scaffolded
 * and testable in a dry run without a live firm or a live Twilio. The notifier
 * records what it would have sent; the callbackSlaActive gate keeps the speed
 * loop and watchdog dormant until firm one.
 */

const DELIVERED_AT = '2026-07-05T12:00:00.000Z'

function activeFirm(over: Partial<FirmContact> = {}): FirmContact {
  return { id: 'firm_a', name: 'Peachtree Injury Partners', phone: '+14045551212', email: 'partner@peachtree.example', slaCallbackMinutes: 15, callbackSlaActive: true, ...over }
}
function delivery(over: Partial<DeliveryForAgent> = {}): DeliveryForAgent {
  return { id: 'del_1', firmId: 'firm_a', dossierId: 'CP-1', status: 'billed', deliveredAt: DELIVERED_AT, firmRespondedAt: null, responseTimeSeconds: null, slaBreached: false, ...over }
}

describe('slaStatus (pure)', () => {
  it('is within SLA when the firm responded before the window closed', () => {
    const s = slaStatus({ deliveredAt: DELIVERED_AT, firmRespondedAt: '2026-07-05T12:10:00.000Z', slaMinutes: 15, nowIso: '2026-07-05T12:20:00.000Z' })
    expect(s.respondedInTime).toBe(true)
    expect(s.breached).toBe(false)
  })
  it('breaches when the window passed with no response', () => {
    const s = slaStatus({ deliveredAt: DELIVERED_AT, firmRespondedAt: null, slaMinutes: 15, nowIso: '2026-07-05T12:16:00.000Z' })
    expect(s.breached).toBe(true)
  })
  it('is not breached before the window closes', () => {
    const s = slaStatus({ deliveredAt: DELIVERED_AT, firmRespondedAt: null, slaMinutes: 15, nowIso: '2026-07-05T12:05:00.000Z' })
    expect(s.breached).toBe(false)
  })
})

describe('speed callback loop (Section 6 step 9)', () => {
  it('notifies the firm on delivery, dry, when the callback SLA is active', async () => {
    const h = createAgentHarness()
    h.addFirm(activeFirm())
    h.addDelivery(delivery())
    const agents = createAgentService(h)

    const res = await agents.notifyOnDelivery({ deliveryId: 'del_1' })
    expect(res.activated).toBe(true)
    expect(res.notified).toBe(2) // sms + email
    expect(h.sent.map((m) => m.channel).sort()).toEqual(['email', 'sms'])
    // Personal injury is spelled out in full.
    expect(h.sent.every((m) => m.body.includes('personal injury'))).toBe(true)
    expect(h.log.filter((e) => e.eventType === 'SpeedCallbackNotified')).toHaveLength(1)
  })

  it('stays dormant before firm one (callback SLA not active): sends nothing', async () => {
    const h = createAgentHarness()
    h.addFirm(activeFirm({ callbackSlaActive: false }))
    h.addDelivery(delivery())
    h.addClaimant('CP-1', { firstName: 'Jordan', phone: '+14045550100' })
    const agents = createAgentService(h)

    const res = await agents.notifyOnDelivery({ deliveryId: 'del_1' })
    expect(res.activated).toBe(false)
    expect(res.claimantNotified).toBe(false)
    // Not even the claimant is texted before firm one.
    expect(h.sent).toHaveLength(0)
    expect(h.log.filter((e) => e.eventType === 'SpeedCallbackNotified')).toHaveLength(0)
  })

  it('also texts the claimant to expect the call when the SLA is active', async () => {
    const h = createAgentHarness()
    h.addFirm(activeFirm())
    h.addDelivery(delivery())
    h.addClaimant('CP-1', { firstName: 'Jordan', phone: '+14045550100' })
    const agents = createAgentService(h)

    const res = await agents.notifyOnDelivery({ deliveryId: 'del_1' })
    expect(res.activated).toBe(true)
    expect(res.claimantNotified).toBe(true)

    const claimantSms = h.sent.find((m) => m.to === '+14045550100')
    expect(claimantSms).toBeDefined()
    // Names the firm that is calling, procedural only, and spells personal injury out.
    expect(claimantSms!.body).toContain('Peachtree Injury Partners')
    expect(claimantSms!.body).toContain('personal injury')
    // Claimant facing text: must carry no legal evaluation or non compliant language.
    expect(findClaimantLanguageViolations(claimantSms!.body)).toHaveLength(0)
    // The event records that the claimant was notified.
    const evt = h.log.find((e) => e.eventType === 'SpeedCallbackNotified')
    expect((evt?.payload as { claimantNotified?: boolean }).claimantNotified).toBe(true)
  })

  it('notifies the firm even when the claimant has no reachable phone', async () => {
    const h = createAgentHarness()
    h.addFirm(activeFirm())
    h.addDelivery(delivery())
    h.addClaimant('CP-1', { firstName: 'Jordan', phone: null })
    const agents = createAgentService(h)

    const res = await agents.notifyOnDelivery({ deliveryId: 'del_1' })
    expect(res.activated).toBe(true)
    expect(res.claimantNotified).toBe(false)
    expect(res.notified).toBe(2) // firm sms + email still fire
  })
})

describe('speed callback claimant message (pure, compliant)', () => {
  it('is procedural, names the firm, and makes no case claim', () => {
    const msg = speedCallbackClaimantMessage({ firstName: 'Sam', firmName: 'Peachtree Injury Partners' })
    expect(msg).toContain('Sam')
    expect(msg).toContain('Peachtree Injury Partners')
    expect(msg).toContain('personal injury')
    expect(findClaimantLanguageViolations(msg)).toHaveLength(0)
    expect(findEvaluativeLeaks({ msg })).toHaveLength(0)
  })

  it('works without a first name', () => {
    const msg = speedCallbackClaimantMessage({ firmName: 'Peachtree Injury Partners' })
    expect(findClaimantLanguageViolations(msg)).toHaveLength(0)
    expect(msg.startsWith('CasePort:')).toBe(true)
  })
})

describe('SLA watchdog (Section 7 step 9)', () => {
  it('flags a breach and alerts when the window closes with no response', async () => {
    const h = createAgentHarness('2026-07-05T12:16:00.000Z') // past the 15 min window
    h.addFirm(activeFirm())
    h.addDelivery(delivery())
    const agents = createAgentService(h)

    const res = await agents.checkSla({ deliveryId: 'del_1' })
    expect(res.breached).toBe(true)
    expect(h.deliveryRows.get('del_1')!.slaBreached).toBe(true)
    expect(h.log.filter((e) => e.eventType === 'SlaBreached')).toHaveLength(1)
    expect(h.sent.some((m) => m.body.toLowerCase().includes('window'))).toBe(true)
  })

  it('does not breach when the firm responded in time', async () => {
    const h = createAgentHarness('2026-07-05T12:20:00.000Z')
    h.addFirm(activeFirm())
    h.addDelivery(delivery({ firmRespondedAt: '2026-07-05T12:08:00.000Z' }))
    const agents = createAgentService(h)

    const res = await agents.checkSla({ deliveryId: 'del_1' })
    expect(res.breached).toBe(false)
    expect(h.log.filter((e) => e.eventType === 'SlaBreached')).toHaveLength(0)
  })

  it('records a firm response and measures it against the SLA', async () => {
    const h = createAgentHarness('2026-07-05T12:09:00.000Z')
    h.addFirm(activeFirm())
    h.addDelivery(delivery())
    const agents = createAgentService(h)

    const res = await agents.recordFirmResponse({ deliveryId: 'del_1', respondedAt: '2026-07-05T12:09:00.000Z' })
    expect(res.recorded).toBe(true)
    expect(res.responseTimeSeconds).toBe(540) // 9 minutes
    expect(res.withinSla).toBe(true)
    expect(h.deliveryRows.get('del_1')!.firmRespondedAt).toBe('2026-07-05T12:09:00.000Z')
    expect(h.log.filter((e) => e.eventType === 'FirmResponded')).toHaveLength(1)
  })
})

describe('decay interrupt (Section 7 step 9)', () => {
  it('re engages when a delivered opportunity is still unworked', async () => {
    const h = createAgentHarness()
    h.addFirm(activeFirm())
    h.addDelivery(delivery())
    const agents = createAgentService(h)

    const res = await agents.checkDecay({ deliveryId: 'del_1' })
    expect(res.reengaged).toBe(true)
    expect(h.log.filter((e) => e.eventType === 'DecayInterrupt')).toHaveLength(1)
    expect(h.sent.some((m) => m.body.toLowerCase().includes('decay'))).toBe(true)
  })

  it('leaves a worked opportunity alone once an outcome is reported', async () => {
    const h = createAgentHarness()
    h.addFirm(activeFirm())
    h.addDelivery(delivery())
    h.addOutcome('del_1')
    const agents = createAgentService(h)

    const res = await agents.checkDecay({ deliveryId: 'del_1' })
    expect(res.reengaged).toBe(false)
    expect(h.log.filter((e) => e.eventType === 'DecayInterrupt')).toHaveLength(0)
    expect(h.sent).toHaveLength(0)
  })
})
