import type { Clock, EventStore, StoredEvent } from '../ports'
import type {
  ArtifactRecord,
  ArtifactRepository,
  DomainSignalReader,
  DomainSynthesisInput,
  DomainSynthesisOutput,
  DomainSynthesizer,
  RecommendationRecord,
  RecommendationRepository,
  SynthIdGenerator,
  SynthesisDeps,
} from '../synthesisPorts'
import type { IntelligenceCoreHarness } from './intelligenceCoreInMemory'
import type { IntelligenceDomain, ReliabilityRating } from '@/lib/domain/intelligenceCore'

/**
 * In memory harness for CIC domain synthesis (Phase C). It reads active signals
 * from an existing IntelligenceCoreHarness, so synthesis reasons over the real
 * ingested signals, and it captures the artifacts and recommendations the
 * service persists. The synthesizer fakes include a compliant one and one per
 * adversarial case the gates must defeat.
 */
export interface SynthesisHarness {
  log: StoredEvent[]
  artifactRows: ArtifactRecord[]
  recommendationRows: RecommendationRecord[]
  signals: DomainSignalReader
  artifacts: ArtifactRepository
  recommendations: RecommendationRepository
  events: EventStore
  ids: SynthIdGenerator
  clock: Clock
}

/** Build a synthesis harness whose signal reader is backed by a CIC harness. */
export function createSynthesisHarness(core: IntelligenceCoreHarness): SynthesisHarness {
  const log: StoredEvent[] = []
  const artifactRows: ArtifactRecord[] = []
  const recommendationRows: RecommendationRecord[] = []

  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`

  const signals: DomainSignalReader = {
    async activeByDomain(domain) {
      return core.signalRows
        .filter((s) => s.domain === domain && s.status === 'active')
        .map((s) => ({
          id: s.id,
          claim: s.claim,
          sourceKey: s.sourceKey,
          reliability: s.reliability,
          observedAt: s.observedAt,
        }))
    },
  }

  return {
    log,
    artifactRows,
    recommendationRows,
    signals,
    artifacts: {
      async save(record) {
        artifactRows.push(record)
      },
      async list(domain) {
        return artifactRows.filter((a) => !domain || a.domain === domain)
      },
    },
    recommendations: {
      async save(record) {
        recommendationRows.push(record)
      },
      async list(domain) {
        return recommendationRows.filter((r) => !domain || r.domain === domain)
      },
    },
    events: {
      async append(event) {
        const stored: StoredEvent = { ...event, id: next('evt') }
        log.push(stored)
        return stored
      },
    },
    ids: { artifactId: () => next('art'), recommendationId: () => next('rec') },
    clock: { nowIso: () => '2026-07-06T12:00:00.000Z' },
  }
}

export function synthesisDepsFrom(h: SynthesisHarness, synthesizer: DomainSynthesizer): SynthesisDeps {
  return {
    signals: h.signals,
    synthesizer,
    artifacts: h.artifacts,
    recommendations: h.recommendations,
    events: h.events,
    ids: h.ids,
    clock: h.clock,
  }
}

/**
 * A grounded synthesizer: every finding cites a real signal, and its one
 * recommendation is compliant (a flat price tier move or a market entry). This
 * is the honest baseline.
 */
export function createGroundedSynthesizer(): DomainSynthesizer {
  return {
    async synthesize({ domain, signals }: DomainSynthesisInput): Promise<DomainSynthesisOutput> {
      const findings = signals.map((s, i) => ({ claim: `Grounded: ${s.claim}`, signalId: s.id, rank: i + 1 }))
      return {
        title: `${domain} brief`,
        summary: `Synthesized from ${signals.length} active ${domain} signals.`,
        findings,
        recommendations: [
          {
            action:
              domain === 'supply'
                ? 'Move motor vehicle accident in Atlanta to the higher flat price tier.'
                : 'Enter the Richmond market once a firm funds a wallet there.',
            expectedValue: '+12 percent margin per delivered opportunity',
            rationale: 'Close rate data supports a higher flat fee per delivered opportunity in this cell.',
            sourceSignalIds: signals.slice(0, 1).map((s) => s.id),
          },
        ],
      }
    },
  }
}

/** Adversarial: invents a finding with no backing signal (hallucinated opinion). */
export function createHallucinatingSynthesizer(claim: string): DomainSynthesizer {
  return {
    async synthesize({ domain }): Promise<DomainSynthesisOutput> {
      return {
        title: `${domain} brief`,
        summary: 'Contains an unbacked claim.',
        findings: [{ claim, signalId: null, rank: 1 }],
        recommendations: [],
      }
    },
  }
}

/** Adversarial: a recommendation that proposes smart routing or outcome pricing. */
export function createNonCompliantSynthesizer(kind: 'smart-routing' | 'outcome-pricing'): DomainSynthesizer {
  const rec =
    kind === 'smart-routing'
      ? {
          action: 'Route by SCPS so the highest value cases reach the best firms first.',
          expectedValue: '+8 percent signing',
          rationale: 'Quality based routing would lift conversion.',
          sourceSignalIds: [],
        }
      : {
          action: 'Charge a success fee as a percentage of settlement on signed cases.',
          expectedValue: '+30 percent revenue',
          rationale: 'Outcome based pricing captures more of the recovery.',
          sourceSignalIds: [],
        }
  return {
    async synthesize({ domain, signals }): Promise<DomainSynthesisOutput> {
      return {
        title: `${domain} brief`,
        summary: 'Contains a non compliant recommendation.',
        findings: signals.slice(0, 1).map((s, i) => ({ claim: s.claim, signalId: s.id, rank: i + 1 })),
        recommendations: [rec],
      }
    },
  }
}

/** Helper to seed an active signal of a given domain and reliability. */
export function seedSignalRow(
  core: IntelligenceCoreHarness,
  domain: IntelligenceDomain,
  reliability: ReliabilityRating,
  claim: string,
): string {
  const id = `seed_${core.signalRows.length + 1}`
  core.signalRows.push({
    id,
    sourceId: 'seed-src',
    sourceKey: reliability === 'A' ? 'primary-source' : 'research-source',
    origin: 'rented',
    reliability,
    domain,
    dedupKey: `seed:${domain}:${core.signalRows.length + 1}`,
    claim,
    observedAt: '2026-07-01T00:00:00.000Z',
    ingestedAt: '2026-07-01T00:00:00.000Z',
    status: 'active',
  })
  return id
}
