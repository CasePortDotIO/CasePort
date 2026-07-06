import { describe, it, expect } from 'vitest'
import { createDemandCaptureService } from '@/services/DemandCaptureService'
import {
  createDemandCaptureHarness,
  demandCaptureDepsFrom,
} from '@/services/fakes/demandCaptureInMemory'
import { findPublicCopyViolations } from '@/lib/compliance/publicCopy'
import type { AssetStructure } from '@/lib/demand/placement'
import type { CaptureAssetInput } from '@/services/demandCapturePorts'

/**
 * Demand Capture Engine Phase A checkpoint (DEMAND_CAPTURE.md Section 12). A
 * single asset publishes with correct structure, owns its canonical question,
 * and is scored by defensible data cell logic with funded market gating live.
 * Nothing here contacts an injured person; every path routes to self initiation.
 */

const words = (n: number) => Array(n).fill('word').join(' ')

/** A structurally correct, compliant B2C asset (Section 7, HL5). */
function validStructure(overrides: Partial<AssetStructure> = {}): AssetStructure {
  return {
    side: 'b2c',
    targetKeyword: 'virginia contributory negligence',
    directAnswer: `virginia contributory negligence ${words(120)}`,
    faqAnswers: [words(60)],
    body: `virginia contributory negligence ${words(400)}`,
    schemaType: 'FAQPage',
    intakeCtaText: 'Send my information',
    intakeCtaHref: '/checkmycase',
    hasComplianceDisclaimer: true,
    ...overrides,
  }
}

function assetInput(overrides: Partial<CaptureAssetInput> = {}): CaptureAssetInput {
  return {
    cellKey: 'va:mva:contributory-negligence',
    surface: 'answer-engine',
    canonicalQuestion: 'What is contributory negligence in Virginia personal injury cases?',
    url: 'https://caseport.io/guide/va/contributory-negligence',
    owningIdentity: 'CasePort',
    title: 'Virginia contributory negligence explained',
    structure: validStructure(),
    ...overrides,
  }
}

const types = (h: ReturnType<typeof createDemandCaptureHarness>) => h.log.map((e) => e.eventType)

async function pursuedCell(h: ReturnType<typeof createDemandCaptureHarness>, svc: ReturnType<typeof createDemandCaptureService>) {
  h.fund('va')
  return svc.scoreCell({
    cellKey: 'va:mva:contributory-negligence',
    market: 'va',
    caseType: 'motor-vehicle-accident',
    legalConcept: 'contributory-negligence',
    surface: 'answer-engine',
    uniqueness: 0.9,
    intent: 0.8,
  })
}

describe('demand cell scoring with funded market gating (Section 6, HL3)', () => {
  it('pursues a unique, high intent cell in a funded market', async () => {
    const h = createDemandCaptureHarness()
    const svc = createDemandCaptureService(demandCaptureDepsFrom(h))
    const cell = await pursuedCell(h, svc)

    expect(cell.status).toBe('pursue')
    expect(cell.fundedMonetizable).toBe(true)
    expect(cell.score).toBeGreaterThan(0)
    expect(cell.ignoreReason).toBeNull()
    expect(types(h)).toContain('DemandCellScored')
  })

  it('ignores the same cell in an unfunded market, scoring zero (HL3)', async () => {
    const h = createDemandCaptureHarness()
    const svc = createDemandCaptureService(demandCaptureDepsFrom(h))
    // Note: no h.fund('va'), so the market is not funded.
    const cell = await svc.scoreCell({
      cellKey: 'va:mva:contributory-negligence',
      market: 'va',
      caseType: 'motor-vehicle-accident',
      legalConcept: 'contributory-negligence',
      surface: 'answer-engine',
      uniqueness: 0.95,
      intent: 0.95,
    })
    expect(cell.status).toBe('ignore')
    expect(cell.score).toBe(0)
    expect(cell.ignoreReason).toBe('unfunded-market')
  })

  it('ignores a funded cell with nothing unique to say', async () => {
    const h = createDemandCaptureHarness()
    const svc = createDemandCaptureService(demandCaptureDepsFrom(h))
    h.fund('va')
    const cell = await svc.scoreCell({
      cellKey: 'va:mva:generic',
      market: 'va',
      caseType: 'motor-vehicle-accident',
      legalConcept: 'generic',
      surface: 'answer-engine',
      uniqueness: 0.2,
      intent: 0.9,
    })
    expect(cell.status).toBe('ignore')
    expect(cell.ignoreReason).toBe('not-unique')
  })
})

describe('pre publish gate: a compliant asset publishes (Section 7, HL4)', () => {
  it('publishes an approved, structurally correct asset on a pursued cell', async () => {
    const h = createDemandCaptureHarness()
    const svc = createDemandCaptureService(demandCaptureDepsFrom(h))
    await pursuedCell(h, svc)

    const asset = await svc.draftAsset(assetInput())
    const res = await svc.publishAsset(asset.id, 'Martha')

    expect(res.published).toBe(true)
    expect(res.reasons).toEqual([])
    expect(res.asset?.status).toBe('published')
    expect(res.asset?.approvedBy).toBe('Martha')
    expect(types(h)).toContain('CaptureAssetPublished')
    expect(types(h)).toContain('KeywordQuestionClaimed')
  })
})

describe('pre publish gate: ownership, funding, structure, and human approval', () => {
  it('blocks a second URL from owning a question already published (Section 7)', async () => {
    const h = createDemandCaptureHarness()
    const svc = createDemandCaptureService(demandCaptureDepsFrom(h))
    await pursuedCell(h, svc)

    const first = await svc.draftAsset(assetInput())
    await svc.publishAsset(first.id, 'Martha')

    const second = await svc.draftAsset(
      assetInput({ url: 'https://caseport.io/duplicate/va/contributory-negligence' }),
    )
    const res = await svc.publishAsset(second.id, 'Martha')
    expect(res.published).toBe(false)
    expect(res.reasons.join(' ')).toMatch(/already owned by/)
  })

  it('blocks publication with no human approver (HL4)', async () => {
    const h = createDemandCaptureHarness()
    const svc = createDemandCaptureService(demandCaptureDepsFrom(h))
    await pursuedCell(h, svc)
    const asset = await svc.draftAsset(assetInput())
    const res = await svc.publishAsset(asset.id, '')
    expect(res.published).toBe(false)
    expect(res.reasons.join(' ')).toMatch(/no human approver/)
  })

  it('blocks capture in an unfunded or vanity cell (HL3)', async () => {
    const h = createDemandCaptureHarness()
    const svc = createDemandCaptureService(demandCaptureDepsFrom(h))
    // Score the cell in an unfunded market so it is ignore.
    await svc.scoreCell({
      cellKey: 'va:mva:contributory-negligence',
      market: 'va',
      caseType: 'motor-vehicle-accident',
      legalConcept: 'contributory-negligence',
      surface: 'answer-engine',
      uniqueness: 0.9,
      intent: 0.9,
    })
    const asset = await svc.draftAsset(assetInput())
    const res = await svc.publishAsset(asset.id, 'Martha')
    expect(res.published).toBe(false)
    expect(res.reasons.join(' ')).toMatch(/unfunded|ignore/)
  })

  it('blocks a structurally wrong or non compliant asset (Section 7, HL5)', async () => {
    const h = createDemandCaptureHarness()
    const svc = createDemandCaptureService(demandCaptureDepsFrom(h))
    await pursuedCell(h, svc)

    // Direct answer too short, evaluative term present, wrong intake CTA.
    const bad = await svc.draftAsset(
      assetInput({
        structure: validStructure({
          directAnswer: 'This firm is vetted and approved.',
          intakeCtaText: 'Free case review',
        }),
      }),
    )
    const res = await svc.publishAsset(bad.id, 'Martha')
    expect(res.published).toBe(false)
    const joined = res.reasons.join(' ')
    expect(joined).toMatch(/aeo-summary-length/)
    expect(joined).toMatch(/public-copy/)
    expect(joined).toMatch(/intake-cta/)
    expect(types(h)).toContain('CaptureAssetRejected')
  })
})

describe('public copy compliance (HL5, HL7)', () => {
  it('flags evaluative language, prohibited CTA, em dash, and PI abbreviation', () => {
    expect(findPublicCopyViolations('CasePort works with vetted, top-rated firms.').some((v) => v.rule === 'prohibited-term')).toBe(true)
    expect(findPublicCopyViolations('Get a free case review today.').some((v) => v.rule === 'prohibited-cta')).toBe(true)
    expect(findPublicCopyViolations('The SCPS is high.').some((v) => v.rule === 'public-evaluative')).toBe(true)
    expect(findPublicCopyViolations('A calm answer \u2014 engineered.').some((v) => v.rule === 'em-dash')).toBe(true)
    expect(findPublicCopyViolations('Your PI claim matters.').some((v) => v.rule === 'abbreviation')).toBe(true)
  })

  it('passes clean educational copy that spells personal injury in full', () => {
    expect(findPublicCopyViolations('This is educational personal injury information. The author is not a lawyer.')).toEqual([])
  })
})
