import { describe, it, expect } from 'vitest'
import { createSynthesisService } from '@/services/SynthesisService'
import { createIntelligenceCoreHarness } from '@/services/fakes/intelligenceCoreInMemory'
import {
  createSynthesisHarness,
  synthesisDepsFrom,
  createGroundedSynthesizer,
  createHallucinatingSynthesizer,
  createNonCompliantSynthesizer,
  seedSignalRow,
} from '@/services/fakes/synthesisInMemory'

/**
 * CIC Phase C checkpoint (INTELLIGENCE_CORE.md Section 12). Each domain produces
 * a ranked, sourced artifact, and the regulatory adversarial suite is green: the
 * synthesis refuses to assert an unverified rule change, and the recommendation
 * guard refuses to propose smart routing or outcome scaled pricing.
 */

function harness() {
  return createIntelligenceCoreHarness()
}

describe('domain synthesis: ranked, sourced artifacts (Section 4)', () => {
  it('produces a ranked artifact whose findings cite real signals', async () => {
    const core = harness()
    seedSignalRow(core, 'demand', 'B', 'Atlanta car accident search volume up.')
    seedSignalRow(core, 'demand', 'B', 'A new claimant question cluster is emerging.')
    const h = createSynthesisHarness(core)
    const svc = createSynthesisService(synthesisDepsFrom(h, createGroundedSynthesizer()))

    const { artifact } = await svc.synthesizeDomain('demand')
    expect(artifact.domain).toBe('demand')
    expect(artifact.findings).toHaveLength(2)
    expect(artifact.findings[0]?.rank).toBe(1)
    // Every finding is traceable to the signal behind it and asserted (B rated).
    expect(artifact.findings.every((f) => f.signalId && f.status === 'asserted')).toBe(true)
    expect(h.log.map((e) => e.eventType)).toContain('IntelligenceArtifactSynthesized')
  })

  it('proposes a compliant recommendation and events it', async () => {
    const core = harness()
    seedSignalRow(core, 'supply', 'B', 'Close rate supports a higher tier for MVA in Atlanta.')
    const h = createSynthesisHarness(core)
    const svc = createSynthesisService(synthesisDepsFrom(h, createGroundedSynthesizer()))

    const { proposed, rejected } = await svc.synthesizeDomain('supply')
    expect(proposed).toHaveLength(1)
    expect(rejected).toHaveLength(0)
    expect(proposed[0]?.status).toBe('proposed')
    expect(h.log.map((e) => e.eventType)).toContain('RecommendationProposed')
  })
})

describe('regulatory adversarial suite (Section 11, H5)', () => {
  it('refuses to assert a hallucinated opinion with no backing signal', async () => {
    const core = harness()
    const h = createSynthesisHarness(core)
    const svc = createSynthesisService(
      synthesisDepsFrom(h, createHallucinatingSynthesizer('Georgia just banned all contingency fees.')),
    )
    const { artifact } = await svc.synthesizeDomain('regulatory')
    // The invented finding is surfaced but never asserted as fact.
    expect(artifact.findings[0]?.status).toBe('needs-verification')
    expect(artifact.findings[0]?.signalId).toBeNull()
  })

  it('refuses to assert a regulatory finding backed only by a non primary source', async () => {
    const core = harness()
    // A B rated (research, not primary) regulatory signal. Not enough to assert.
    seedSignalRow(core, 'regulatory', 'B', 'A blog claims Georgia changed its statute.')
    const h = createSynthesisHarness(core)
    const svc = createSynthesisService(synthesisDepsFrom(h, createGroundedSynthesizer()))
    const { artifact } = await svc.synthesizeDomain('regulatory')
    expect(artifact.findings[0]?.status).toBe('needs-verification')
  })

  it('asserts a regulatory finding backed by an A rated primary source', async () => {
    const core = harness()
    seedSignalRow(core, 'regulatory', 'A', 'The Georgia bar published opinion 2026-3.')
    const h = createSynthesisHarness(core)
    const svc = createSynthesisService(synthesisDepsFrom(h, createGroundedSynthesizer()))
    const { artifact } = await svc.synthesizeDomain('regulatory')
    expect(artifact.findings[0]?.status).toBe('asserted')
    expect(artifact.findings[0]?.reliability).toBe('A')
  })
})

describe('recommendation compliance guard (Section 11, H2, H3)', () => {
  it('rejects a smart routing recommendation', async () => {
    const core = harness()
    seedSignalRow(core, 'supply', 'B', 'signal')
    const h = createSynthesisHarness(core)
    const svc = createSynthesisService(synthesisDepsFrom(h, createNonCompliantSynthesizer('smart-routing')))
    const { proposed, rejected } = await svc.synthesizeDomain('supply')
    expect(proposed).toHaveLength(0)
    expect(rejected).toHaveLength(1)
    expect(rejected[0]?.rejectionReason).toMatch(/smart-routing/)
    expect(h.log.map((e) => e.eventType)).toContain('RecommendationRejected')
  })

  it('rejects an outcome scaled pricing recommendation', async () => {
    const core = harness()
    seedSignalRow(core, 'supply', 'B', 'signal')
    const h = createSynthesisHarness(core)
    const svc = createSynthesisService(synthesisDepsFrom(h, createNonCompliantSynthesizer('outcome-pricing')))
    const { proposed, rejected } = await svc.synthesizeDomain('supply')
    expect(proposed).toHaveLength(0)
    expect(rejected[0]?.rejectionReason).toMatch(/outcome-scaled-pricing/)
  })
})
