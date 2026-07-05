import type { FirmRepository, LedgerRepository, StoredLedgerEntry, WalletSnapshotRepository } from './walletPorts'

/**
 * GlassBoxService. Section 7. The firm facing read side. It shows a firm its own
 * data and its own market, every dollar auditable. It never rates other firms
 * and never implies CasePort vetted anyone. Strict firm scoping is the core
 * invariant: a firm can only ever read its own wallet, ledger, and deliveries.
 *
 * Two read artifacts convert the skeptic before they fund:
 *   proofOfRealityFeed, redacted representative recent activity from the firm's
 *   territory, PII removed, framed as representative and never as a volume
 *   guarantee (Section 7 step 1).
 *   sampleDossier, a full fidelity example, seeded honestly (Section 7 step 2).
 */

/** Redacted market activity. No PII, no evaluative field. Reality, not quality. */
export interface RedactedActivity {
  reference: string
  caseType: string
  market: string
  receivedAt: string
  status: string
}

/** A firm's own delivery record for the Glass Box. Phase 3 populates deliveries. */
export interface FirmDeliveryView {
  deliveryId: string
  dossierId: string
  caseType: string
  deliveredAt: string | null
  firmRespondedAt: string | null
  responseTimeSeconds: number | null
  slaBreached: boolean
  billedCents: number | null
}

export interface GlassBoxReadPort {
  recentMarketActivity(marketId: string, limit: number): Promise<RedactedActivity[]>
  firmDeliveries(firmId: string): Promise<FirmDeliveryView[]>
}

export interface GlassBoxDeps {
  ledger: LedgerRepository
  snapshots: WalletSnapshotRepository
  firms: FirmRepository
  activity: GlassBoxReadPort
}

/**
 * An honest, full fidelity sample dossier for the pre funding firm. Firm facing,
 * so it may carry the SCPS triage number as an example of what a delivered
 * dossier looks like. Seeded, never presented as a real claimant.
 */
export const SAMPLE_DOSSIER = {
  reference: 'CP-SAMPLE-0001',
  market: 'atlanta-ga',
  caseType: 'motor-vehicle-accident',
  status: 'sample',
  receivedAt: '2026-06-01T14:30:00.000Z',
  claimantStatement:
    'Rear ended at a red light on Peachtree Street. Taken to the emergency room the same day for neck and back pain. Ongoing physical therapy.',
  categorizedPhotos: ['vehicle-rear', 'intersection-wide', 'visible-bruising'],
  policeReport: { onFile: true, citationIssued: true },
  evaluation: {
    scpsScore: 82,
    scpsVersion: 'v1',
    injurySeverity: 'moderate soft tissue',
    liabilityAssessment: 'clear liability, rear end collision',
    statuteStatus: 'well within statute',
  },
  hipaaAuthorization: { executedInFirmName: true },
  note: 'This is a seeded sample. It is not a real claimant.',
} as const

export function createGlassBoxService(deps: GlassBoxDeps) {
  /**
   * A firm's own wallet view. Balance is the authoritative ledger sum; the
   * snapshot is shown alongside so drift is visible. Only this firm's entries.
   */
  async function walletView(firmId: string): Promise<{
    firmId: string
    balanceCents: number
    snapshotBalanceCents: number | null
    lowBalanceThresholdCents: number | null
    inSync: boolean
    entries: StoredLedgerEntry[]
  }> {
    const [balanceCents, snapshot, entries] = await Promise.all([
      deps.ledger.sumByFirm(firmId),
      deps.snapshots.get(firmId),
      deps.ledger.listByFirm(firmId),
    ])
    const snapshotBalanceCents = snapshot?.balanceCents ?? null
    return {
      firmId,
      balanceCents,
      snapshotBalanceCents,
      lowBalanceThresholdCents: snapshot?.lowBalanceThresholdCents ?? null,
      inSync: snapshotBalanceCents == null ? false : snapshotBalanceCents === balanceCents,
      entries,
    }
  }

  /**
   * Proof of reality. Representative recent activity from the firm's own
   * territory, redacted. Framed as representative, never a volume guarantee.
   */
  async function proofOfRealityFeed(
    firmId: string,
    limit = 10,
  ): Promise<{ market: string | null; framing: string; items: RedactedActivity[] }> {
    const firm = await deps.firms.get(firmId)
    if (!firm || !firm.marketId) {
      return { market: null, framing: REPRESENTATIVE_FRAMING, items: [] }
    }
    const items = await deps.activity.recentMarketActivity(firm.marketId, limit)
    return { market: firm.marketId, framing: REPRESENTATIVE_FRAMING, items }
  }

  /** The firm's own Glass Box: its deliveries and response times. Firm scoped. */
  async function firmGlassBox(firmId: string): Promise<{
    firmId: string
    deliveries: FirmDeliveryView[]
  }> {
    const deliveries = await deps.activity.firmDeliveries(firmId)
    return { firmId, deliveries }
  }

  function sampleDossier(): typeof SAMPLE_DOSSIER {
    return SAMPLE_DOSSIER
  }

  return { walletView, proofOfRealityFeed, firmGlassBox, sampleDossier }
}

const REPRESENTATIVE_FRAMING =
  'Representative recent activity from your territory. Redacted. Not a volume guarantee.'

export type GlassBoxService = ReturnType<typeof createGlassBoxService>
