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

/**
 * The full firm facing closing kit for one delivered opportunity. Firm only: it
 * carries the SCPS triage and the qualification factors, which never reach a
 * claimant surface (W2). Every field is real; nothing is estimated. A case value
 * is not present because CasePort does not compute one, and a fabricated value
 * would fail the honesty bar (Section 14).
 */
export interface OpportunityDetail {
  deliveryId: string
  reference: string
  caseType: string
  market: string
  deliveredAt: string | null
  firmRespondedAt: string | null
  slaBreached: boolean
  claimant: { name: string; phone: string | null; email: string | null; location: string }
  /** The organized, plain language account. Never a legal evaluation. */
  statement: string
  statuteOfLimitationsDate: string | null
  /** Firm facing triage (W2 firm only). */
  evaluation: {
    scpsScore: number
    scpsVersion: string
    qualificationTier: string
    injurySeverity: string
    liabilityAssessment: string
    statuteStatus: string
    factors: Array<{ label: string; value: number }>
  }
  hipaaExecutedInFirmName: boolean
  /** Categorized evidence the claimant captured: photos and documents, each with
   * its kind and a viewable URL. Assembled from the intake event log. */
  evidence: {
    photos: Array<{ kind: string; url: string }>
    documents: Array<{ kind: string; url: string }>
  }
}

/** Raw captured media for a dossier, read from the intake event log. */
export interface DossierEvidence {
  photos: Array<{ kind: string; url: string }>
  documents: Array<{ kind: string; url: string }>
}

export interface GlassBoxReadPort {
  recentMarketActivity(marketId: string, limit: number): Promise<RedactedActivity[]>
  firmDeliveries(firmId: string): Promise<FirmDeliveryView[]>
  /**
   * The full closing kit for one delivery, scoped to the requesting firm. Returns
   * null when the delivery does not exist or does not belong to this firm, so a
   * firm can never read another firm's case (the core Glass Box invariant).
   */
  opportunityForFirm(firmId: string, deliveryId: string): Promise<OpportunityDetail | null>
}

export interface GlassBoxDeps {
  ledger: LedgerRepository
  snapshots: WalletSnapshotRepository
  firms: FirmRepository
  activity: GlassBoxReadPort
}

/** Human labels for the SCPS factor keys, for the firm facing triage bars. */
const FACTOR_LABELS: Record<string, string> = {
  injuryVerification: 'Injury verification',
  liabilityClarity: 'Liability clarity',
  statuteStatus: 'Statute headroom',
  caseTypeMatch: 'Case type match',
  firmResponseCapacity: 'Firm response capacity',
}

/**
 * Assemble the closing kit from already loaded records. Pure, so the firm
 * scoping invariant and the factor mapping are unit tested directly. Returns
 * null when the delivery is not this firm's, or when the dossier is missing, so
 * a firm can never open another firm's case.
 */
export function buildOpportunityDetail(input: {
  firmId: string
  delivery: {
    id: string
    firmId: string
    dossierId: string
    deliveredAt: string | null
    firmRespondedAt: string | null
    slaBreached: boolean
  }
  dossier: {
    market: string
    caseType: string
    plainLanguageSummary: string
    statuteOfLimitationsDate: string | null
    evaluation: {
      scpsScore: number
      scpsVersion: string
      qualificationTier: string
      injurySeverity: string
      liabilityAssessment: string
      statuteStatus: string
      qualificationBreakdown: Array<{ layer: string; score: number; max?: number }>
    }
  } | null
  claimant: { firstName?: string; lastName?: string; phone?: string | null; email?: string | null; location?: string } | null
  evidence?: DossierEvidence
}): OpportunityDetail | null {
  // The Glass Box invariant: a firm can only ever read its own case.
  if (input.delivery.firmId !== input.firmId) return null
  if (!input.dossier) return null

  const e = input.dossier.evaluation
  const factors = (e.qualificationBreakdown ?? []).map((b) => ({
    label: FACTOR_LABELS[b.layer] ?? b.layer,
    value: Number(b.score ?? 0),
  }))
  const name = input.claimant
    ? `${input.claimant.firstName ?? ''} ${input.claimant.lastName ?? ''}`.trim()
    : ''

  return {
    deliveryId: input.delivery.id,
    reference: `CP-${input.delivery.dossierId.slice(-6).toUpperCase()}`,
    caseType: input.dossier.caseType,
    market: input.dossier.market,
    deliveredAt: input.delivery.deliveredAt,
    firmRespondedAt: input.delivery.firmRespondedAt,
    slaBreached: input.delivery.slaBreached,
    claimant: {
      name: name || 'Claimant',
      phone: input.claimant?.phone ?? null,
      email: input.claimant?.email ?? null,
      location: input.claimant?.location ?? '',
    },
    statement: input.dossier.plainLanguageSummary,
    statuteOfLimitationsDate: input.dossier.statuteOfLimitationsDate,
    evaluation: {
      scpsScore: e.scpsScore,
      scpsVersion: e.scpsVersion,
      qualificationTier: e.qualificationTier,
      injurySeverity: e.injurySeverity,
      liabilityAssessment: e.liabilityAssessment,
      statuteStatus: e.statuteStatus,
      factors,
    },
    hipaaExecutedInFirmName: true,
    evidence: {
      photos: input.evidence?.photos ?? [],
      documents: input.evidence?.documents ?? [],
    },
  }
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

  /**
   * Proof of reality for a market, before any firm record exists. This is the
   * pre funding skeptic converter (Section 7 step 1): a prospective partner sees
   * what actually came through their territory, redacted, framed as
   * representative and never as a volume guarantee. Keyed by market, not firm, so
   * it serves a prospect who has not signed or funded anything yet. Carries no
   * PII and no evaluative signal (reality, not quality).
   */
  async function proofOfRealityForMarket(
    marketId: string,
    limit = 12,
  ): Promise<{ market: string; framing: string; items: RedactedActivity[] }> {
    const items = await deps.activity.recentMarketActivity(marketId, limit)
    return { market: marketId, framing: REPRESENTATIVE_FRAMING, items }
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

  /**
   * The full closing kit for one delivered opportunity, scoped to the firm. The
   * firm scoping is the invariant: the read returns null for a delivery that is
   * not this firm's, so a firm can only ever open its own cases.
   */
  async function opportunityDetail(firmId: string, deliveryId: string): Promise<OpportunityDetail | null> {
    return deps.activity.opportunityForFirm(firmId, deliveryId)
  }

  return { walletView, proofOfRealityFeed, proofOfRealityForMarket, firmGlassBox, sampleDossier, opportunityDetail }
}

const REPRESENTATIVE_FRAMING =
  'Representative recent activity from your territory. Redacted. Not a volume guarantee.'

export type GlassBoxService = ReturnType<typeof createGlassBoxService>
