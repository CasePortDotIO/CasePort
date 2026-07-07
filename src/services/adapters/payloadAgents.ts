import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import { httpNotifier } from './notifier'
import type {
  AgentDeliveryStore,
  AgentDeps,
  ClaimantReach,
  ClaimantReachRepository,
  DeliveryForAgent,
  FirmContact,
  FirmContactRepository,
  OutcomeLookup,
} from '../agentPorts'

/**
 * Payload adapters for the agents and the speed loop. The delivery store reads
 * and updates only the response and SLA fields; it never touches billing. The
 * firm contact carries the callbackSlaActive gate so the agents stay dormant
 * until firm one.
 */

const relId = (v: unknown) =>
  v == null ? '' : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v)

function toDelivery(doc: Record<string, unknown>): DeliveryForAgent {
  return {
    id: String(doc.id),
    firmId: relId(doc.firm),
    dossierId: relId(doc.dossier),
    status: (doc.status as DeliveryForAgent['status']) ?? 'held',
    deliveredAt: (doc.deliveredAt as string) ?? null,
    firmRespondedAt: (doc.firmRespondedAt as string) ?? null,
    responseTimeSeconds: (doc.responseTimeSeconds as number) ?? null,
    slaBreached: Boolean(doc.slaBreached),
  }
}

function payloadAgentDeliveryStore(payload: Payload): AgentDeliveryStore {
  return {
    async get(id) {
      const doc = (await payload.findByID({ collection: 'deliveries', id, depth: 0 }).catch(() => null)) as Record<string, unknown> | null
      return doc ? toDelivery(doc) : null
    },
    async recordResponse(id, respondedAt, responseTimeSeconds) {
      await payload.update({ collection: 'deliveries', id, data: { firmRespondedAt: respondedAt, responseTimeSeconds } })
    },
    async markSlaBreached(id) {
      await payload.update({ collection: 'deliveries', id, data: { slaBreached: true } })
    },
  }
}

function payloadFirmContactRepository(payload: Payload): FirmContactRepository {
  return {
    async get(firmId): Promise<FirmContact | null> {
      const doc = (await payload.findByID({ collection: 'firms', id: firmId, depth: 0 }).catch(() => null)) as Record<string, unknown> | null
      if (!doc) return null
      return {
        id: String(doc.id),
        name: String(doc.name ?? ''),
        phone: (doc.phone as string) ?? undefined,
        email: (doc.email as string) ?? undefined,
        slaCallbackMinutes: Number(doc.slaCallbackMinutes ?? 15),
        callbackSlaActive: Boolean(doc.callbackSlaActive),
      }
    },
  }
}

function payloadClaimantReachRepository(payload: Payload): ClaimantReachRepository {
  return {
    async forDossier(dossierId): Promise<ClaimantReach | null> {
      // The dossier carries the claimant relationship; one populated read gets
      // the first name and phone. Nothing evaluative is read here (W2).
      const dossier = (await payload
        .findByID({ collection: 'dossiers', id: dossierId, depth: 1 })
        .catch(() => null)) as Record<string, unknown> | null
      if (!dossier) return null
      const intake = (dossier.intakeSession ?? null) as Record<string, unknown> | null
      const claimant = (intake && typeof intake === 'object' ? intake.claimant : null) as
        | Record<string, unknown>
        | null
      // The claimant may live under the dossier's intake session, or be resolved
      // directly. Fall back to a claimants lookup by the dossier's claimant id.
      let firstName = String(claimant?.firstName ?? '')
      let phone = (claimant?.phone as string) ?? null
      if (!phone) {
        const claimantId =
          (claimant && typeof claimant === 'object' ? String(claimant.id) : '') ||
          String((dossier.claimant as { id?: unknown })?.id ?? dossier.claimant ?? '')
        if (claimantId) {
          const c = (await payload
            .findByID({ collection: 'claimants', id: claimantId, depth: 0 })
            .catch(() => null)) as Record<string, unknown> | null
          if (c) {
            firstName = firstName || String(c.firstName ?? '')
            phone = (c.phone as string) ?? null
          }
        }
      }
      return { firstName, phone }
    },
  }
}

function payloadOutcomeLookup(payload: Payload): OutcomeLookup {
  return {
    async hasOutcome(deliveryId) {
      const res = await payload.find({ collection: 'outcomes', where: { delivery: { equals: deliveryId } }, limit: 1, depth: 0 })
      return res.docs.length > 0
    },
  }
}

export function createPayloadAgentDeps(payload: Payload): AgentDeps {
  return {
    deliveries: payloadAgentDeliveryStore(payload),
    firms: payloadFirmContactRepository(payload),
    outcomes: payloadOutcomeLookup(payload),
    claimants: payloadClaimantReachRepository(payload),
    notify: httpNotifier(),
    events: payloadEventStoreFor(payload),
    clock: { nowIso: () => new Date().toISOString() },
    appBaseUrl:
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || undefined,
  }
}
