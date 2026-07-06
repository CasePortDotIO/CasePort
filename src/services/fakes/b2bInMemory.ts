import type { Clock, EventStore, StoredEvent } from '../ports'
import type {
  B2BCaptureDeps,
  B2BIdGenerator,
  B2BTargetRecord,
  B2BTargetRepository,
  CaptureAssetWriter,
  MarketActivityItem,
  MarketProofReader,
  OutboundDrafter,
  ProspectResearcher,
} from '../b2bPorts'

/**
 * In memory harness for Demand Capture B2B (Phase C). It models the target
 * store, a redacted market proof reader, a prospect researcher, and a capture
 * asset writer, plus a compliant outbound drafter and one adversarial drafter
 * per Rule 7.1 attack the gate must defeat.
 */
export interface B2BHarness {
  log: StoredEvent[]
  targetRows: Map<string, B2BTargetRecord>
  assetRows: Array<{ id: string; surface: string; status: string }>
  targets: B2BTargetRepository
  assets: CaptureAssetWriter
  proof: MarketProofReader
  events: EventStore
  ids: B2BIdGenerator
  clock: Clock
}

/** Redacted representative recent activity, PII already stripped (HL6). */
const CLEAN_ACTIVITY: MarketActivityItem[] = [
  { caseType: 'motor-vehicle-accident', market: 'va', summary: 'Rear end collision, documented injuries, police report attached.', occurredAt: '2026-07-03' },
  { caseType: 'premises-liability', market: 'va', summary: 'Grocery store slip, incident report and photographs captured.', occurredAt: '2026-07-04' },
]

export function createB2BHarness(activity: MarketActivityItem[] = CLEAN_ACTIVITY): B2BHarness {
  const log: StoredEvent[] = []
  const targetRows = new Map<string, B2BTargetRecord>()
  const assetRows: Array<{ id: string; surface: string; status: string }> = []

  let n = 0
  const next = (p: string) => `${p}_${(n += 1)}`

  return {
    log,
    targetRows,
    assetRows,
    targets: {
      async get(id) {
        const r = targetRows.get(id)
        return r ? { ...r } : null
      },
      async save(record) {
        targetRows.set(record.id, { ...record })
      },
      async list() {
        return [...targetRows.values()].map((r) => ({ ...r }))
      },
    },
    assets: {
      async create(input) {
        const id = next('asset')
        assetRows.push({ id, surface: input.surface, status: input.status })
        return { id }
      },
    },
    proof: {
      async recentActivity(market, limit) {
        return activity.filter((a) => a.market === market).slice(0, limit)
      },
    },
    events: {
      async append(event) {
        const stored: StoredEvent = { ...event, id: next('evt') }
        log.push(stored)
        return stored
      },
    },
    ids: { targetId: () => next('target'), assetId: () => next('asset') },
    clock: { nowIso: () => '2026-07-06T12:00:00.000Z' },
  }
}

export function b2bDepsFrom(
  h: B2BHarness,
  researcher: ProspectResearcher,
  drafter: OutboundDrafter,
): B2BCaptureDeps {
  return {
    targets: h.targets,
    assets: h.assets,
    proof: h.proof,
    researcher,
    drafter,
    events: h.events,
    ids: h.ids,
    clock: h.clock,
  }
}

export function createFakeResearcher(): ProspectResearcher {
  return {
    async research(target) {
      return {
        firmName: target.firmName,
        partnerName: target.partnerName ?? 'the managing partner',
        notes: `${target.firmName} handles personal injury in ${target.market}.`,
      }
    },
  }
}

/** A Rule 7.1 clean outbound drafter. Frames proof as representative, no promises. */
export function createCompliantOutboundDrafter(): OutboundDrafter {
  return {
    async draft({ target, research, proof }) {
      return {
        subject: `Representative recent activity in your ${target.market} market`,
        body:
          `Hello ${research.partnerName}. Here is representative recent personal injury activity ` +
          `that came through the ${target.market} market. It is a sample of real, worked up intake, ` +
          `not a projection. ${proof.length} recent items are attached, with claimant details redacted.`,
      }
    },
  }
}

export type OutboundAttack = 'guarantee' | 'volume-guarantee' | 'unjustified-expectation' | 'pii-leak'

/** Adversarial outbound drafters, one per Rule 7.1 attack. */
export function createAdversarialOutboundDrafter(kind: OutboundAttack): OutboundDrafter {
  return {
    async draft({ target }) {
      const subject = `Your ${target.market} market`
      switch (kind) {
        case 'guarantee':
          return { subject, body: 'We guarantee signed cases every month for your firm.' }
        case 'volume-guarantee':
          return { subject, body: 'You will receive 20 cases per month, guaranteed volume in your market.' }
        case 'unjustified-expectation':
          return { subject, body: 'This is risk free and you will earn more with zero downside.' }
        case 'pii-leak':
          return { subject, body: 'Recent claimant: John Smith, john.smith@email.com, 555-123-4567, rear end collision.' }
      }
    },
  }
}
