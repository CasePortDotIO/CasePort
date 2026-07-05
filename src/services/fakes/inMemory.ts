import type { Dossier } from '@/lib/compliance/dossierProjections'
import type {
  ClaimantContact,
  IdGenerator,
  IntakeDeps,
  IntakeSessionRecord,
  MarketInfo,
  StoredEvent,
} from '../ports'

/**
 * In memory fakes for the intake ports. These let the full intake pipeline run
 * end to end in a test with no database and no external API. The event log and
 * repositories are plain arrays and maps; the external clients return fixed,
 * deterministic values. Nothing here is used in production.
 */

/** A deterministic id generator. Sequential, so tests are reproducible. */
function sequentialIds(): IdGenerator {
  const counters: Record<string, number> = {}
  const next = (prefix: string) => {
    counters[prefix] = (counters[prefix] ?? 0) + 1
    return `${prefix}_${counters[prefix]}`
  }
  return {
    sessionId: () => next('sess'),
    claimantId: () => next('clm'),
    dossierId: () => next('CP-2026-000'),
    eventId: () => next('evt'),
    submissionId: () => next('sub'),
  }
}

export interface InMemoryHarness extends IntakeDeps {
  /** The full append only event log, for assertions. */
  log: StoredEvent[]
  /** All dossiers created, for assertions. */
  createdDossiers: Dossier[]
  /** All sessions, for attribution trace assertions. */
  sessions: Map<string, IntakeSessionRecord>
}

export function createInMemoryHarness(
  opts: { liveMarket?: boolean } = {},
): InMemoryHarness {
  const ids = sequentialIds()
  const log: StoredEvent[] = []
  const sessions = new Map<string, IntakeSessionRecord>()
  const claimants = new Map<string, ClaimantContact & { id: string }>()
  const createdDossiers: Dossier[] = []

  const liveMarket: MarketInfo = {
    id: 'mkt_atlanta',
    slug: 'atlanta-ga',
    state: 'GA',
    liveForIntake: opts.liveMarket ?? true,
  }

  const deps: IntakeDeps = {
    ids,
    clock: { nowIso: () => '2026-07-05T12:00:00.000Z' },
    events: {
      append: async (event) => {
        const stored: StoredEvent = { id: ids.eventId(), ...event }
        log.push(stored)
        return stored
      },
    },
    intake: {
      createSession: async ({ claimantId, marketId, attribution }) => {
        const record: IntakeSessionRecord = {
          id: ids.sessionId(),
          claimantId,
          marketId,
          attribution,
          validationPassed: false,
          eventIds: [],
          createdAt: '2026-07-05T12:00:00.000Z',
        }
        sessions.set(record.id, record)
        return record
      },
      getSession: async (id) => sessions.get(id) ?? null,
      updateSession: async (id, patch) => {
        const current = sessions.get(id)
        if (!current) throw new Error(`session ${id} not found`)
        const updated = { ...current, ...patch }
        sessions.set(id, updated)
        return updated
      },
    },
    claimants: {
      create: async (contact) => {
        const id = ids.claimantId()
        claimants.set(id, { id, ...contact })
        return { id }
      },
      get: async (id) => claimants.get(id) ?? null,
    },
    dossiers: {
      create: async (dossier) => {
        createdDossiers.push(dossier)
        return dossier
      },
      get: async (id) => createdDossiers.find((d) => d.id === id) ?? null,
    },
    markets: {
      resolveByLocation: async (loc) => {
        const inAtlanta =
          loc.zip?.startsWith('303') || loc.city?.toLowerCase() === 'atlanta' || loc.state === 'GA'
        return inAtlanta && liveMarket.liveForIntake ? liveMarket : null
      },
    },
    media: {
      put: async ({ key }) => ({ key }),
      signedUrl: async (key) => `https://r2.example/${key}?sig=fake`,
    },
    narrative: {
      reflectivePlayback: async ({ transcript }) => ({
        summary:
          'You were rear ended at an intersection. We organized what you told us so a firm can review it.',
        points: transcript
          .split('.')
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3),
      }),
      evidenceCoaching: async () =>
        'Next, take a wide photo showing both vehicles and the intersection.',
      protectionPlan: async () => [
        'Keep every medical appointment.',
        'Do not post about the accident.',
        'Photograph any bruising again in two days.',
      ],
    },
    vision: {
      parseInsuranceCard: async () => ({ carrier: 'Example Mutual', policyNumber: 'PM-000' }),
    },
    transcription: {
      transcribe: async () => ({
        transcript:
          'I was stopped at the light on Peachtree. A truck hit me from behind. My neck hurts.',
      }),
    },
    consent: {
      certify: async () => ({
        trustedFormUrl: 'https://cert.trustedform.com/fake',
        consentLanguageVersion: 'v1',
      }),
    },
  }

  return { ...deps, log, createdDossiers, sessions }
}
