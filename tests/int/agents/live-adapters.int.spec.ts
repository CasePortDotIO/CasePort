import { describe, it, expect, beforeAll } from 'vitest'
import {
  createAnthropicDomainSynthesizer,
  createAnthropicQueryResponder,
  createAnthropicAnswerDrafter,
  createAnthropicOutboundDrafter,
  anthropicConfigured,
} from '@/services/adapters/liveAgents'
import { createSynthesisService } from '@/services/SynthesisService'
import { createIntelligenceCoreHarness } from '@/services/fakes/intelligenceCoreInMemory'
import { createSynthesisHarness, synthesisDepsFrom, seedSignalRow } from '@/services/fakes/synthesisInMemory'
import { validateAssetStructure } from '@/lib/demand/placement'
import { findRule71Violations } from '@/lib/compliance/rule71'
import type { B2BTargetRecord } from '@/services/b2bPorts'

/**
 * The live agent adapters activate real reasoning when ANTHROPIC_API_KEY is set
 * and fall back to a safe, honest, non asserting value when it is not. This
 * proves the dry run behavior (no key) and, crucially, that a drafter's output
 * still passes through the existing compliance gates: a live model can never
 * bypass the Wall.
 */

beforeAll(() => {
  delete process.env.ANTHROPIC_API_KEY
})

describe('live adapters: safe dry run without a key', () => {
  it('reports not configured', () => {
    expect(anthropicConfigured()).toBe(false)
  })

  it('the domain synthesizer returns an empty, non asserting output and flows through the gates', async () => {
    const core = createIntelligenceCoreHarness()
    seedSignalRow(core, 'demand', 'B', 'A demand signal.')
    const h = createSynthesisHarness(core)
    const svc = createSynthesisService(synthesisDepsFrom(h, createAnthropicDomainSynthesizer()))

    // No crash, and the SynthesisService gates still run over the empty output.
    const { artifact, proposed } = await svc.synthesizeDomain('demand')
    expect(artifact.findings).toEqual([])
    expect(proposed).toEqual([])
    expect(h.log.map((e) => e.eventType)).toContain('IntelligenceArtifactSynthesized')
  })

  it('the query responder returns a low confidence, non asserting answer', async () => {
    const responder = createAnthropicQueryResponder()
    const answer = await responder.answer('What should we price slip and fall in Atlanta?', {
      artifacts: [],
      recommendations: [],
    })
    expect(answer.confidence).toBe('low')
    expect(answer.citations).toEqual([])
  })

  it('the answer drafter fallback cannot pass the placement gate, so it stays a draft', async () => {
    const drafter = createAnthropicAnswerDrafter()
    const drafted = await drafter.draft({
      canonicalQuestion: 'What is contributory negligence in Virginia?',
      market: 'va',
      caseType: 'motor-vehicle-accident',
      legalConcept: 'contributory-negligence',
      cellKey: 'va:mva:contributory-negligence',
      surface: 'answer-engine',
      owningIdentity: 'Martha',
    })
    // The fallback body is a placeholder, so the gate blocks publication.
    const check = validateAssetStructure(drafted.structure)
    expect(check.valid).toBe(false)
    // But its routing is still self initiation, never a call.
    expect(drafted.structure.intakeCtaHref).toContain('/checkmycase')
  })

  it('the outbound drafter fallback is Rule 7.1 clean (no guarantee, no PII)', async () => {
    const target: B2BTargetRecord = {
      id: 't1',
      firmName: 'Smith and Partners',
      market: 'va',
      status: 'added',
      enriched: false,
      outbound: null,
      createdAt: '2026-07-06T00:00:00.000Z',
    }
    const drafter = createAnthropicOutboundDrafter()
    const drafted = await drafter.draft({
      target,
      research: { firmName: 'Smith and Partners', partnerName: 'Ms. Smith', notes: '' },
      proof: [],
    })
    expect(findRule71Violations(`${drafted.subject}\n${drafted.body}`)).toEqual([])
  })
})
