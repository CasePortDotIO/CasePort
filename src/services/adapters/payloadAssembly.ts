import type { Payload } from 'payload'
import { payloadEventStoreFor } from './payloadEvents'
import { createPayloadDeliveryDeps } from './payloadDelivery'
import { createIntelligenceService } from '../IntelligenceService'
import { createPayloadIntelligenceDeps } from './payloadIntelligence'
import type { AssemblyDeps, DocumentationReader, FirmForAssembly } from '../DossierAssemblyService'
import type { ScpsFactors } from '../scps'

/**
 * Payload adapters for the Dossier Assembly Orchestrator (AGENTS.md Section 4.2).
 *
 * The firm reader pulls practice areas from the price table (a firm handles a
 * case type when it prices it) and the contractual callback window. The
 * documentation reader derives capture completeness from the intake event log:
 * it reads what was actually captured, never a judgment, and defaults to not
 * documented when a signal is absent, which is the honest floor.
 */

function firmReaderFor(payload: Payload): { get(firmId: string): Promise<FirmForAssembly | null> } {
  return {
    async get(firmId) {
      const doc = (await payload
        .findByID({ collection: 'firms', id: firmId, depth: 0 })
        .catch(() => null)) as Record<string, unknown> | null
      if (!doc) return null
      const priceTable = Array.isArray(doc.priceTable) ? (doc.priceTable as Array<{ caseType?: string }>) : []
      const caseTypes = [...new Set(priceTable.map((r) => String(r.caseType)).filter(Boolean))]
      return {
        id: String(doc.id),
        caseTypes,
        slaCallbackMinutes: Number(doc.slaCallbackMinutes ?? 15),
      }
    },
  }
}

/** Does any event carry this capture kind in its payload (kind or focus)? */
function hasCaptureKind(events: Array<{ eventType: string; payload?: Record<string, unknown> }>, kind: string): boolean {
  return events.some((e) => {
    const p = e.payload ?? {}
    return p.kind === kind || p.focus === kind
  })
}

function documentationReaderFor(payload: Payload): DocumentationReader {
  return {
    async forDossier({ intakeSessionId }) {
      const none = {
        injuryPhoto: false,
        voiceStatement: false,
        policeReport: false,
        scenePhotos: false,
        platePhotos: false,
        insuranceCard: false,
      }
      if (!intakeSessionId) return none

      const res = await payload
        .find({ collection: 'events', where: { intakeSession: { equals: intakeSessionId } }, limit: 5000, depth: 0 })
        .catch(() => null)
      if (!res) return none
      const events = res.docs.map((d) => {
        const doc = d as unknown as Record<string, unknown>
        return { eventType: String(doc.eventType), payload: (doc.payload as Record<string, unknown>) ?? {} }
      })
      const types = new Set(events.map((e) => e.eventType))
      const submitted = (events.find((e) => e.eventType === 'IntakeSubmitted')?.payload ?? {}) as Record<string, unknown>

      return {
        injuryPhoto: hasCaptureKind(events, 'injury') || Boolean(submitted.injuryPhoto),
        voiceStatement: types.has('VoiceCaptured') || types.has('VoiceTranscribed'),
        policeReport: hasCaptureKind(events, 'police-report') || Boolean(submitted.policeReport),
        scenePhotos: hasCaptureKind(events, 'scene') || hasCaptureKind(events, 'wide'),
        platePhotos: hasCaptureKind(events, 'plate'),
        insuranceCard: types.has('VisionParsed') || Boolean(submitted.insuranceCard),
      }
    },
  }
}

export function createPayloadAssemblyDeps(payload: Payload): AssemblyDeps {
  const deliveryDeps = createPayloadDeliveryDeps(payload)
  const intel = createIntelligenceService(createPayloadIntelligenceDeps(payload))
  return {
    dossiers: deliveryDeps.dossiers,
    firms: firmReaderFor(payload),
    documentation: documentationReaderFor(payload),
    score: (dossierId: string, factors: ScpsFactors) => intel.scoreDossier(dossierId, factors),
    events: payloadEventStoreFor(payload),
    clock: { nowIso: () => new Date().toISOString() },
  }
}
