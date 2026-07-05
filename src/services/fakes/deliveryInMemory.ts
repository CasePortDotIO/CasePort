import type { Dossier } from '@/lib/compliance/dossierProjections'
import type { CaseTypeValue } from '@/lib/domain/constants'
import type { DossierRepository } from '../ports'
import type {
  AuditLogWriter,
  DeliveryRecord,
  DeliveryRepository,
  MarketRoutingRepository,
  TransactionRunner,
} from '../deliveryPorts'
import { createWalletService } from '../WalletService'
import { createWalletHarness, type WalletHarness } from './walletInMemory'

/**
 * In memory harness for the routing and delivery slice. It composes the wallet
 * harness so the debit exercises the same idempotent ledger the wallet tests
 * use, and adds delivery, market routing, and audit fakes plus a pass through
 * transaction runner. Nothing here runs in production.
 */

export interface AuditEntry {
  decisionType: 'routing' | 'delivery'
  reason: 'geographic' | 'delivered' | 'held'
  aggregateId: string
  firmId?: string
  marketId?: string
  actor: string
  details?: Record<string, unknown>
  occurredAt: string
}

export interface DeliveryHarness {
  wallet: WalletHarness
  dossiers: DossierRepository
  deliveries: DeliveryRepository
  markets: MarketRoutingRepository
  audit: AuditLogWriter
  tx: TransactionRunner
  auditRows: AuditEntry[]
  deliveryRows: DeliveryRecord[]
  addDossier(input: {
    id: string
    market: string
    caseType: CaseTypeValue
    scpsScore?: number
  }): Dossier
}

/** A full internal dossier fixture with both audience halves populated. */
function makeDossier(input: { id: string; market: string; caseType: CaseTypeValue; scpsScore?: number }): Dossier {
  return {
    id: input.id,
    claimantId: `clm_${input.id}`,
    intakeSessionId: `sess_${input.id}`,
    market: input.market,
    caseType: input.caseType,
    status: 'received',
    plainLanguageSummary: 'Rear ended at a stop light. Neck and back pain the next morning.',
    protectionPlan: ['Keep every medical appointment.', 'Do not post about the accident.'],
    statuteOfLimitationsDate: '2028-01-01T00:00:00.000Z',
    receivedAt: '2026-07-05T12:00:00.000Z',
    evaluation: {
      scpsScore: input.scpsScore ?? 82,
      scpsVersion: 'v1',
      qualificationTier: 'B',
      qualificationScore: 71,
      qualificationBreakdown: [],
      estimatedValue: 45000,
      injurySeverity: 'Moderate soft tissue',
      liabilityAssessment: 'Clear, rear end collision',
      statuteStatus: 'Well within statute',
      signedCaseProbability: 0.6,
    },
  }
}

export function createDeliveryHarness(
  marketAssignments: Record<string, { firmId: string; marketType: string }> = {
    mkt_atlanta: { firmId: 'firm_a', marketType: 'single-firm-exclusive' },
    mkt_baltimore: { firmId: 'firm_b', marketType: 'single-firm-exclusive' },
  },
): DeliveryHarness {
  const wallet = createWalletHarness()
  const dossierRows = new Map<string, Dossier>()
  const deliveryRows: DeliveryRecord[] = []
  const auditRows: AuditEntry[] = []

  const dossiers: DossierRepository = {
    create: async (d) => {
      dossierRows.set(d.id, d)
      return d
    },
    get: async (id) => dossierRows.get(id) ?? null,
  }

  const deliveries: DeliveryRepository = {
    create: async ({ dossierId, firmId, status }) => {
      const rec: DeliveryRecord = {
        id: `del_${deliveryRows.length + 1}`,
        dossierId,
        firmId,
        status,
        deliveredAt: null,
        billed: false,
      }
      deliveryRows.push(rec)
      return rec
    },
    get: async (id) => deliveryRows.find((d) => d.id === id) ?? null,
    markDelivered: async (id, deliveredAt) => {
      const d = deliveryRows.find((r) => r.id === id)
      if (d) {
        d.status = 'delivered'
        d.deliveredAt = deliveredAt
      }
    },
    markBilled: async (id) => {
      const d = deliveryRows.find((r) => r.id === id)
      if (d) {
        d.status = 'billed'
        d.billed = true
      }
    },
    listHeldByFirm: async (firmId) => deliveryRows.filter((d) => d.firmId === firmId && d.status === 'held'),
    findForDossierFirm: async (dossierId, firmId) =>
      [...deliveryRows].reverse().find((d) => d.dossierId === dossierId && d.firmId === firmId) ?? null,
  }

  const markets: MarketRoutingRepository = {
    assignedFirmForMarket: async (marketId) => marketAssignments[marketId] ?? null,
  }

  const audit: AuditLogWriter = {
    record: async (entry) => {
      auditRows.push(entry)
    },
  }

  // Pass through: the fake has no real transaction, and it does not need one.
  const tx: TransactionRunner = { run: (fn) => fn() }

  return {
    wallet,
    dossiers,
    deliveries,
    markets,
    audit,
    tx,
    auditRows,
    deliveryRows,
    addDossier: (input) => {
      const d = makeDossier(input)
      dossierRows.set(d.id, d)
      return d
    },
  }
}

/** Convenience: build DeliveryDeps from a delivery harness. */
export function deliveryDepsFrom(h: DeliveryHarness) {
  return {
    dossiers: h.dossiers,
    deliveries: h.deliveries,
    wallet: createWalletService(h.wallet),
    audit: h.audit,
    events: h.wallet.events,
    ids: h.wallet.ids,
    clock: h.wallet.clock,
    tx: h.tx,
  }
}
