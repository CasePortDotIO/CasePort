import { describe, it, expect } from 'vitest'
import { createDossierAssemblyService, type DocumentationReader } from '@/services/DossierAssemblyService'
import { createIntelligenceService } from '@/services/IntelligenceService'
import { createIntelligenceHarness, intelligenceDepsFrom } from '@/services/fakes/intelligenceInMemory'
import { DossierService } from '@/services/DossierService'
import { toClaimantDossier } from '@/lib/compliance/dossierProjections'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import type { Dossier, FirmOnlyEvaluation } from '@/lib/compliance/dossierProjections'
import type { DossierRepository, EventStore, StoredEvent } from '@/services/ports'

/**
 * The Dossier Assembly Orchestrator (AGENTS.md Section 4.2, Section 8, Phase 3).
 * It computes and attaches the versioned SCPS triage AFTER routing, keeps the
 * audience split intact (W2), and never lets a quality signal touch routing (W1,
 * enforced by running only once a firm is already resolved).
 */

const noDocs: DocumentationReader = {
  forDossier: async () => ({
    injuryPhoto: false,
    voiceStatement: false,
    policeReport: false,
    scenePhotos: false,
    platePhotos: false,
    insuranceCard: false,
  }),
}

const fullDocs: DocumentationReader = {
  forDossier: async () => ({
    injuryPhoto: true,
    voiceStatement: true,
    policeReport: true,
    scenePhotos: true,
    platePhotos: true,
    insuranceCard: true,
  }),
}

/** A tiny dossier store that starts each dossier with an empty evaluation. */
function dossierStore(seed: Dossier[]): { repo: DossierRepository; rows: Map<string, Dossier> } {
  const rows = new Map(seed.map((d) => [d.id, d]))
  const repo: DossierRepository = {
    create: async (d) => {
      rows.set(d.id, d)
      return d
    },
    get: async (id) => rows.get(id) ?? null,
    attachEvaluation: async (id, evaluation) => {
      const d = rows.get(id)
      if (d) rows.set(id, { ...d, evaluation })
    },
  }
  return { repo, rows }
}

function eventCollector(): { store: EventStore; log: StoredEvent[] } {
  const log: StoredEvent[] = []
  let n = 0
  const store: EventStore = {
    append: async (e) => {
      const stored = { id: `evt_${(n += 1)}`, ...e }
      log.push(stored)
      return stored
    },
  }
  return { store, log }
}

function seedDossier(id: string): Dossier {
  return DossierService.assemble({
    id,
    claimantId: `clm_${id}`,
    intakeSessionId: `sess_${id}`,
    market: 'atlanta-ga',
    caseType: 'motor-vehicle-accident',
    plainLanguageSummary: 'Rear ended at a stop light. Neck pain the next morning.',
    protectionPlan: ['Keep every medical appointment.'],
    statuteOfLimitationsDate: '2028-01-01T00:00:00.000Z',
    receivedAt: '2026-07-05T12:00:00.000Z',
  })
}

const firm = {
  get: async (id: string) => ({ id, caseTypes: ['motor-vehicle-accident'], slaCallbackMinutes: 15 }),
}

function buildAssembly(documentation: DocumentationReader, dstore = dossierStore([seedDossier('CP-1')])) {
  const intelHarness = createIntelligenceHarness()
  const intel = createIntelligenceService(intelligenceDepsFrom(intelHarness))
  const events = eventCollector()
  const svc = createDossierAssemblyService({
    dossiers: dstore.repo,
    firms: firm,
    documentation,
    score: (dossierId, factors) => intel.scoreDossier(dossierId, factors),
    events: events.store,
    clock: { nowIso: () => '2026-07-05T12:05:00.000Z' },
  })
  return { svc, rows: dstore.rows, log: events.log }
}

describe('Dossier Assembly Orchestrator (Section 4.2)', () => {
  it('computes and attaches a versioned SCPS as firm facing triage', async () => {
    const { svc, rows, log } = buildAssembly(noDocs)
    const result = await svc.assembleFirmPackage('CP-1', 'firm_a')

    expect(result).not.toBeNull()
    expect(result!.scpsVersion).toBe('v1')
    expect(result!.scpsScore).toBeGreaterThan(0)

    const evaluation = rows.get('CP-1')!.evaluation
    expect(evaluation.scpsScore).toBe(result!.scpsScore)
    expect(evaluation.scpsVersion).toBe('v1')
    expect(evaluation.qualificationScore).toBe(result!.scpsScore)
    expect(evaluation.qualificationBreakdown.length).toBe(5)
    // Value is never fabricated.
    expect(evaluation.estimatedValue).toBe(0)
    // signedCaseProbability is the SCPS expressed as a fraction.
    expect(evaluation.signedCaseProbability).toBeCloseTo(result!.scpsScore / 100, 6)

    // The assembly is audited on the event log with the firm facing triage.
    const assembled = log.filter((e) => e.eventType === 'DossierAssembled')
    expect(assembled).toHaveLength(1)
    expect(assembled[0].payload?.scpsVersion).toBe('v1')
  })

  it('keeps the audience split intact: the claimant projection carries no evaluative field (W2)', async () => {
    const { svc, rows } = buildAssembly(fullDocs)
    await svc.assembleFirmPackage('CP-1', 'firm_a')

    const dossier = rows.get('CP-1')!
    // The firm half now carries a real SCPS.
    expect(dossier.evaluation.scpsScore).toBeGreaterThan(0)
    // The claimant projection still leaks nothing.
    const claimantView = toClaimantDossier(dossier)
    expect(findEvaluativeLeaks(claimantView)).toEqual([])
  })

  it('reflects documentation completeness honestly: more captured, higher factors', async () => {
    const bare = buildAssembly(noDocs, dossierStore([seedDossier('CP-bare')]))
    const documented = buildAssembly(fullDocs, dossierStore([seedDossier('CP-doc')]))
    const a = await bare.svc.assembleFirmPackage('CP-bare', 'firm_a')
    const b = await documented.svc.assembleFirmPackage('CP-doc', 'firm_a')

    // A fully documented dossier scores at least as high as an undocumented one.
    expect(b!.scpsScore).toBeGreaterThan(a!.scpsScore)
    // The firm sees exactly why: documentation status, never a fabricated judgment.
    const evalDoc = documented.rows.get('CP-doc')!.evaluation
    expect(evalDoc.injurySeverity).toContain('documented')
    expect(evalDoc.liabilityAssessment).toContain('documented')
  })

  it('is deterministic: re running attaches the same evaluation (retry safe)', async () => {
    const { svc, rows } = buildAssembly(fullDocs)
    const first = await svc.assembleFirmPackage('CP-1', 'firm_a')
    const evalAfterFirst: FirmOnlyEvaluation = { ...rows.get('CP-1')!.evaluation }
    const second = await svc.assembleFirmPackage('CP-1', 'firm_a')

    expect(second!.scpsScore).toBe(first!.scpsScore)
    expect(rows.get('CP-1')!.evaluation).toEqual(evalAfterFirst)
  })

  it('returns null when the dossier or firm is missing, without throwing', async () => {
    const { svc } = buildAssembly(noDocs)
    expect(await svc.assembleFirmPackage('CP-missing', 'firm_a')).toBeNull()
  })
})
