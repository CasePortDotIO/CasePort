import type { Payload } from 'payload'
import Anthropic from '@anthropic-ai/sdk'
import type { Dossier } from '@/lib/compliance/dossierProjections'
import { nextEssentialCapture } from '@/lib/domain/captureChecklist'
import type {
  ClaimantRepository,
  ConsentClient,
  DossierRepository,
  GeographicLocation,
  IntakeDeps,
  IntakeRepository,
  IntakeSessionRecord,
  MarketResolver,
  MediaStorage,
  NarrativeClient,
  TranscriptionClient,
  VisionClient,
} from '../ports'
import { createAnthropicNarrativeClient } from './AnthropicNarrativeClient'
import { payloadEventStoreFor } from './payloadEvents'

/**
 * Production adapters that implement the intake ports against Payload and the
 * external services. This is the wiring behind the ports: the domain services
 * stay pure and the persistence lives here. The event log and the attribution
 * tuple on the intake session are written through these adapters, which is how
 * the moat accumulates in the system of record.
 */

/* Payload local API bypasses access control by default, which is correct here:
 * this is the trusted server side intake pipeline, not a claimant request. */

function mapSession(doc: {
  id: string | number
  claimant?: unknown
  market?: unknown
  attribution?: Record<string, unknown> | null
  validationPassed?: boolean | null
  events?: unknown[] | null
  createdAt?: string
}): IntakeSessionRecord {
  const relId = (v: unknown): string =>
    v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v)
  const attribution = (doc.attribution ?? {}) as Record<string, unknown>
  return {
    id: String(doc.id),
    claimantId: relId(doc.claimant),
    marketId: doc.market ? relId(doc.market) : null,
    attribution: {
      source: String(attribution.source ?? 'direct'),
      keyword: (attribution.keyword as string) ?? undefined,
      referringSurface: (attribution.referringSurface as string) ?? undefined,
      sessionBehavior: (attribution.sessionBehavior as Record<string, unknown>) ?? undefined,
      firstTouchAt: String(attribution.firstTouchAt ?? doc.createdAt ?? ''),
    },
    validationPassed: Boolean(doc.validationPassed),
    eventIds: (doc.events ?? []).map(relId),
    createdAt: String(doc.createdAt ?? ''),
  }
}

function payloadIntakeRepository(payload: Payload): IntakeRepository {
  return {
    async createSession({ claimantId, marketId, attribution }) {
      const created = await payload.create({
        collection: 'intakeSessions',
        data: {
          claimant: claimantId,
          market: marketId ?? undefined,
          attribution: {
            source: attribution.source,
            keyword: attribution.keyword,
            referringSurface: attribution.referringSurface,
            sessionBehavior: attribution.sessionBehavior ?? {},
            firstTouchAt: attribution.firstTouchAt,
          },
          validationPassed: false,
          events: [],
        },
      })
      return mapSession(created as never)
    },
    async getSession(id) {
      try {
        const doc = await payload.findByID({ collection: 'intakeSessions', id, depth: 0 })
        return doc ? mapSession(doc as never) : null
      } catch {
        return null
      }
    },
    async updateSession(id, patch) {
      const data: Record<string, unknown> = {}
      if (patch.marketId !== undefined) data.market = patch.marketId ?? undefined
      if (patch.validationPassed !== undefined) data.validationPassed = patch.validationPassed
      if (patch.eventIds !== undefined) data.events = patch.eventIds
      const updated = await payload.update({ collection: 'intakeSessions', id, data })
      return mapSession(updated as never)
    },
  }
}

function payloadClaimantRepository(payload: Payload): ClaimantRepository {
  return {
    async create(contact) {
      const marketZip =
        contact.location.zip ||
        [contact.location.city, contact.location.state].filter(Boolean).join(', ')
      const created = await payload.create({
        collection: 'claimants',
        data: {
          firstName: contact.firstName,
          lastName: contact.lastName || '—',
          phone: contact.phone,
          email: contact.email,
          marketZip,
        },
      })
      return { id: String(created.id) }
    },
    async get(id) {
      try {
        const doc = await payload.findByID({ collection: 'claimants', id, depth: 0 })
        if (!doc) return null
        return {
          id: String(doc.id),
          firstName: doc.firstName,
          lastName: doc.lastName,
          phone: doc.phone ?? undefined,
          email: doc.email ?? undefined,
          location: { zip: doc.marketZip ?? undefined },
        }
      } catch {
        return null
      }
    },
  }
}

function payloadDossierRepository(payload: Payload): DossierRepository {
  return {
    async create(dossier) {
      const created = await payload.create({
        collection: 'dossiers',
        data: {
          claimant: dossier.claimantId,
          intakeSession: dossier.intakeSessionId ?? undefined,
          market: dossier.market,
          caseType: dossier.caseType as never,
          status: dossier.status as never,
          plainLanguageSummary: dossier.plainLanguageSummary,
          protectionPlan: dossier.protectionPlan.map((step) => ({ step })),
          statuteOfLimitationsDate: dossier.statuteOfLimitationsDate ?? undefined,
          receivedAt: dossier.receivedAt,
          evaluation: dossier.evaluation as never,
        },
      })
      return { ...dossier, id: String(created.id) }
    },
    async get() {
      return null
    },
  }
}

/**
 * Resolve a market geographically (W1). Matches a live market by ZIP cluster
 * first, then by state and metro. No quality signal is reachable.
 */
function payloadMarketResolver(payload: Payload): MarketResolver {
  return {
    async resolveByLocation(loc: GeographicLocation) {
      const byZip = loc.zip
        ? await payload.find({
            collection: 'markets',
            where: { and: [{ liveForIntake: { equals: true } }, { 'zipClusters.zip': { equals: loc.zip } }] },
            limit: 1,
          })
        : { docs: [] as { id: unknown; slug?: string; state?: string; liveForIntake?: boolean }[] }
      let doc = byZip.docs[0]
      if (!doc && loc.state) {
        const byState = await payload.find({
          collection: 'markets',
          where: {
            and: [
              { liveForIntake: { equals: true } },
              { state: { equals: loc.state } },
              ...(loc.city ? [{ metro: { like: loc.city } }] : []),
            ],
          },
          limit: 1,
        })
        doc = byState.docs[0]
      }
      if (!doc) return null
      return {
        id: String(doc.id),
        slug: String((doc as { slug?: string }).slug ?? ''),
        state: String((doc as { state?: string }).state ?? ''),
        liveForIntake: Boolean((doc as { liveForIntake?: boolean }).liveForIntake),
      }
    },
  }
}

/* TrustedForm consent: record the client generated certificate (W7). */
function trustedFormConsentClient(): ConsentClient {
  return {
    async certify({ providedCertUrl }) {
      return {
        trustedFormUrl: providedCertUrl || 'about:blank#no-certificate',
        consentLanguageVersion: 'v1',
      }
    },
  }
}

/* Media, transcription, and vision are defined but their concrete R2, Deepgram,
 * and Claude Vision adapters land in a follow up. The structured intake submit
 * path does not invoke them, so they throw a clear error if called early. */
function unimplemented(name: string): never {
  throw new Error(`${name} adapter is not wired yet (Phase 1 follow up).`)
}
const stubMedia: MediaStorage = {
  put: () => unimplemented('MediaStorage.put'),
  signedUrl: () => unimplemented('MediaStorage.signedUrl'),
}
const stubTranscription: TranscriptionClient = {
  transcribe: () => unimplemented('TranscriptionClient.transcribe'),
}
const stubVision: VisionClient = {
  parseInsuranceCard: () => unimplemented('VisionClient.parseInsuranceCard'),
}

/* Narrative: real Claude client when an API key is present, else an empty
 * client so the handler falls back to the default protection plan. */
function resolveNarrativeClient(): NarrativeClient {
  if (process.env.ANTHROPIC_API_KEY) {
    return createAnthropicNarrativeClient(new Anthropic())
  }
  return {
    reflectivePlayback: async () => ({ summary: '', points: [] }),
    evidenceCoaching: async () => '',
    // No API key: coaching falls back to the deterministic, compliant checklist
    // so a claimant is still guided through the essential captures.
    nextCaptureDirection: async ({ inventory }) => nextEssentialCapture(inventory),
    protectionPlan: async () => [],
  }
}

let counter = 0
function nextId(prefix: string): string {
  counter += 1
  return `${prefix}_${counter.toString(36)}`
}

/**
 * Assemble the full production dependency set for the intake pipeline from a
 * Payload instance. The clock and id generator are simple server implementations.
 */
export function createPayloadIntakeDeps(payload: Payload): IntakeDeps {
  return {
    events: payloadEventStoreFor(payload),
    intake: payloadIntakeRepository(payload),
    claimants: payloadClaimantRepository(payload),
    dossiers: payloadDossierRepository(payload),
    markets: payloadMarketResolver(payload),
    consent: trustedFormConsentClient(),
    narrative: resolveNarrativeClient(),
    media: stubMedia,
    transcription: stubTranscription,
    vision: stubVision,
    ids: {
      sessionId: () => nextId('sess'),
      claimantId: () => nextId('clm'),
      dossierId: () => nextId('CP'),
      eventId: () => nextId('evt'),
      submissionId: () => nextId('sub'),
    },
    clock: { nowIso: () => new Date().toISOString() },
  }
}
