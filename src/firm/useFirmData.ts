'use client'

import { useEffect, useState } from 'react'
import { CASE_TYPES } from '@/lib/domain/constants'

/**
 * The firm data seam. Resolves the current firm, then loads that firm's own
 * Glass Box: its wallet and ledger (every dollar auditable), its deliveries and
 * response times, and the redacted proof of reality for its market. This is the
 * one place the firm island reaches the backend; every surface that shows real
 * data reads from here, so wiring a component is a matter of consuming this hook.
 *
 * It never invents numbers. When the backend is unreachable or the firm has no
 * data yet, it returns empty, and the surfaces render honest empty states rather
 * than mock arrays.
 */

/** A ledger entry as the Glass Box serves it. Amounts are in cents. */
export interface FirmLedgerEntry {
  id: string
  entryType: 'credit' | 'debit'
  reason: 'topup' | 'delivery-debit' | 'adjustment'
  amountCents: number
  occurredAt: string
  balanceAfterCents: number
}

export interface FirmWalletView {
  firmId: string
  balanceCents: number
  snapshotBalanceCents: number | null
  lowBalanceThresholdCents: number | null
  inSync: boolean
  entries: FirmLedgerEntry[]
}

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

export interface RedactedActivity {
  reference: string
  caseType: string
  market: string
  receivedAt: string
  status: string
}

export interface FirmGlassBox {
  firmId: string
  wallet: FirmWalletView
  deliveries: FirmDeliveryView[]
  proofFeed: { market: string | null; framing: string; items: RedactedActivity[] }
}

export interface FirmDataState {
  firmId: string | null
  firmName: string | null
  data: FirmGlassBox | null
  loading: boolean
  error: string | null
}

export function useFirmData(): FirmDataState {
  const [state, setState] = useState<FirmDataState>({
    firmId: null,
    firmName: null,
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const currentRes = await fetch('/api/firm/current')
        const current = (await currentRes.json()) as { firmId: string | null; name: string | null }
        if (cancelled) return

        if (!current.firmId) {
          setState({ firmId: null, firmName: null, data: null, loading: false, error: null })
          return
        }

        const glassRes = await fetch(`/api/firm/${encodeURIComponent(current.firmId)}/glassbox`)
        if (!glassRes.ok) throw new Error(`glassbox ${glassRes.status}`)
        const data = (await glassRes.json()) as FirmGlassBox
        if (cancelled) return

        setState({ firmId: current.firmId, firmName: current.name, data, loading: false, error: null })
      } catch (err) {
        if (cancelled) return
        setState({ firmId: null, firmName: null, data: null, loading: false, error: String(err) })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

/** Dollars from cents, for display. */
export function dollars(cents: number | null | undefined): string {
  const n = (cents ?? 0) / 100
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** A ledger row ready for the wallet table and export. Newest first. */
export interface LedgerRow {
  occurredAt: string
  description: string
  type: 'Top-Up' | 'Delivery' | 'Adjustment'
  /** Signed cents: credits positive, debits negative, regardless of stored sign. */
  amountCents: number
  balanceCents: number
}

const REASON_LABEL: Record<FirmLedgerEntry['reason'], LedgerRow['type']> = {
  topup: 'Top-Up',
  'delivery-debit': 'Delivery',
  adjustment: 'Adjustment',
}

const REASON_DESCRIPTION: Record<FirmLedgerEntry['reason'], string> = {
  topup: 'Wallet top-up via Stripe',
  'delivery-debit': 'Delivered personal injury opportunity',
  adjustment: 'Ledger adjustment',
}

/**
 * Map raw ledger entries to display rows, newest first. The displayed sign is
 * derived from the entry type (credit vs debit), so it is correct whether the
 * stored amount is signed or a magnitude. Pure, so it is unit tested directly.
 */
export function toLedgerRows(entries: FirmLedgerEntry[]): LedgerRow[] {
  return [...entries]
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
    .map((e) => ({
      occurredAt: e.occurredAt,
      description: REASON_DESCRIPTION[e.reason],
      type: REASON_LABEL[e.reason],
      amountCents: e.entryType === 'credit' ? Math.abs(e.amountCents) : -Math.abs(e.amountCents),
      balanceCents: e.balanceAfterCents,
    }))
}

/** An opportunity row for the firm's list, mapped from a real delivery record.
 * Note what it does NOT carry: no fabricated case value, no invented conversion
 * probability. Every field here is a real delivery fact. */
export interface OpportunityRow {
  /** Display reference derived from the dossier id. */
  id: string
  /** The delivery id, used for navigation and lookups. */
  deliveryId: string
  caseType: string
  deliveredAt: string | null
  /** Response time in whole minutes, or null when the firm has not responded. */
  responseTimeMin: number | null
  status: 'Contacted' | 'Awaiting Response'
  sla: 'On time' | 'Overdue' | 'Pending'
  /** The fixed fee actually billed for this delivery, in cents. */
  feeCents: number | null
  slaBreached: boolean
}

const CASE_TYPE_LABEL: Record<string, string> = Object.fromEntries(CASE_TYPES.map((c) => [c.value, c.label]))

/** A short, human reference for a dossier id. */
export function caseReference(dossierId: string): string {
  return `CP-${String(dossierId).slice(-6).toUpperCase()}`
}

/**
 * Map a firm's real deliveries to opportunity rows, newest first. Deterministic
 * and free of any fabricated evaluative number, so it is unit tested directly.
 */
export function toOpportunityRows(deliveries: FirmDeliveryView[]): OpportunityRow[] {
  return [...deliveries]
    .sort((a, b) => Date.parse(b.deliveredAt ?? '') - Date.parse(a.deliveredAt ?? ''))
    .map((d) => ({
      id: caseReference(d.dossierId),
      deliveryId: d.deliveryId,
      caseType: CASE_TYPE_LABEL[d.caseType] ?? d.caseType,
      deliveredAt: d.deliveredAt,
      responseTimeMin: d.responseTimeSeconds != null ? Math.round(d.responseTimeSeconds / 60) : null,
      status: d.firmRespondedAt ? 'Contacted' : 'Awaiting Response',
      sla: d.slaBreached ? 'Overdue' : d.firmRespondedAt ? 'On time' : 'Pending',
      feeCents: d.billedCents,
      slaBreached: d.slaBreached,
    }))
}

/**
 * Where the dashboard "Review now" banner should land. The partner is never
 * dropped into the full past-cases archive: one call they owe goes straight to
 * that claimant's detail so they can dial; more than one goes to the
 * opportunities list scoped to exactly those calls. Pure, so it is unit tested.
 */
export function reviewNowTarget(rows: OpportunityRow[]): string {
  const awaiting = rows.filter((o) => o.status === 'Awaiting Response')
  return awaiting.length === 1
    ? `/opportunity/${awaiting[0].deliveryId}`
    : `/opportunities?status=${encodeURIComponent('Awaiting Response')}`
}

/** Cockpit metrics, every one derived from real Glass Box data. Fields that
 * would require outcome data we do not hold (cost per signed case, conversion
 * rate) are deliberately absent rather than estimated. */
export interface FirmMetrics {
  balanceCents: number
  delivered: number
  /** Delivered cases the firm has not yet responded to. Needs a first call. */
  awaitingCount: number
  /** Median first-response time in minutes across responded cases, or null. */
  medianResponseMin: number | null
  /** Share of delivered cases responded to within SLA, 0..100, or null. */
  slaAdherencePct: number | null
  /** Fixed fees actually billed across delivered cases, in cents. */
  feesPaidCents: number
}

function median(nums: number[]): number | null {
  if (nums.length === 0) return null
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}

/** Derive the cockpit metrics from a firm's Glass Box. Pure, unit tested. */
export function toFirmMetrics(glass: Pick<FirmGlassBox, 'wallet' | 'deliveries'> | null): FirmMetrics {
  const deliveries = glass?.deliveries ?? []
  const delivered = deliveries.filter((d) => d.deliveredAt != null)
  const responded = delivered.filter((d) => d.firmRespondedAt != null && d.responseTimeSeconds != null)
  const onTime = delivered.filter((d) => d.firmRespondedAt != null && !d.slaBreached)
  const responseMins = responded.map((d) => Math.round((d.responseTimeSeconds as number) / 60))
  return {
    balanceCents: glass?.wallet.balanceCents ?? 0,
    delivered: delivered.length,
    awaitingCount: delivered.filter((d) => d.firmRespondedAt == null).length,
    medianResponseMin: median(responseMins),
    slaAdherencePct: delivered.length ? Math.round((onTime.length / delivered.length) * 100) : null,
    feesPaidCents: delivered.reduce((s, d) => s + (d.billedCents ?? 0), 0),
  }
}

/** A short relative time like "2 hrs ago" from an ISO timestamp. */
export function relativeTime(iso: string | null, nowMs: number): string {
  if (!iso) return '—'
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return '—'
  const mins = Math.max(0, Math.round((nowMs - t) / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}
