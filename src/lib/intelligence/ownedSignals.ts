import type { SignalIngestInput } from '@/services/intelligenceCorePorts'
import type { IntelligenceDomain } from '@/lib/domain/intelligenceCore'

/**
 * The owned intelligence mapper (INTELLIGENCE_CORE.md Section 5, Phase B). It
 * turns a live domain event from the shared event log into a first party
 * intelligence signal, so owned intelligence updates in near real time as the
 * business runs. Owned data is the moat: it is joined by the attribution tuple
 * and cannot be rented.
 *
 * All owned signals carry the source key `caseport-event-log` (registered in the
 * allowlist as an owned, rating A source), so they pass the epistemic gate like
 * any other signal. The mapper never fabricates: it returns null for an event
 * that carries no intelligence, rather than inventing a claim.
 *
 * dedupKey groups repeated observations of the same subject so the newest
 * supersedes the older through the standard supersession path. observedAt is the
 * event time, so a later event about the same subject wins.
 */
export interface OwnedEventInput {
  eventType: string
  occurredAt: string
  aggregateId: string
  payload?: Record<string, unknown> | null
}

const OWNED_SOURCE_KEY = 'caseport-event-log'

const str = (v: unknown): string => (v == null ? '' : String(v))

export function eventToOwnedSignal(e: OwnedEventInput): SignalIngestInput | null {
  const p = e.payload ?? {}

  const build = (
    domain: IntelligenceDomain,
    dedupKey: string,
    claim: string,
    attributionRef?: string,
  ): SignalIngestInput => ({
    sourceKey: OWNED_SOURCE_KEY,
    domain,
    dedupKey,
    claim,
    observedAt: e.occurredAt,
    data: { eventType: e.eventType, aggregateId: e.aggregateId, ...p },
    attributionRef,
  })

  switch (e.eventType) {
    // A firm reported a signed or declined case. The sharpest owned signal:
    // supply side conversion, joined back to the originating intake by trace.
    case 'OutcomeReported': {
      const firmId = str(p.firmId)
      const result = str(p.result) || 'reported'
      return build(
        'supply',
        `owned:firm-outcome:${firmId}`,
        `Firm ${firmId} most recently reported a case outcome of ${result}.`,
        str(p.outcomeId) || e.aggregateId,
      )
    }
    // A dossier was delivered into a market. Demand actually landed with a firm.
    case 'DossierDelivered': {
      const firmId = str(p.firmId)
      return build(
        'supply',
        `owned:firm-delivery:${firmId}`,
        `A worked up dossier was most recently delivered to firm ${firmId}.`,
        str(p.deliveryId) || e.aggregateId,
      )
    }
    // A firm funded its wallet. Owned supply side funding and burn behavior.
    case 'WalletFunded': {
      const firmId = str(p.firmId)
      return build('supply', `owned:firm-funding:${firmId}`, `Firm ${firmId} most recently funded its wallet.`)
    }
    // A claimant completed a valid intake in a live market. Owned demand signal.
    case 'IntakeValidated': {
      const market = str(p.market) || str(p.marketId)
      return build(
        'demand',
        `owned:intake-completed:${market || 'unknown'}`,
        `A personal injury intake was most recently completed and validated in market ${market || 'unknown'}.`,
        str(p.intakeSessionId),
      )
    }
    // A capture asset went live. Owned demand surface presence.
    case 'CaptureAssetPublished': {
      const cellKey = str(p.cellKey)
      const surface = str(p.surface)
      return build(
        'demand',
        `owned:capture-presence:${cellKey}`,
        `CasePort most recently published a capture asset for cell ${cellKey} on ${surface}.`,
      )
    }
    default:
      return null
  }
}

export const OWNED_EVENT_TYPES = [
  'OutcomeReported',
  'DossierDelivered',
  'WalletFunded',
  'IntakeValidated',
  'CaptureAssetPublished',
] as const

/** Whether an event type produces an owned signal, for the consumer trigger set. */
export function isOwnedEvent(eventType: string): boolean {
  return (OWNED_EVENT_TYPES as readonly string[]).includes(eventType)
}
