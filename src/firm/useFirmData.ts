'use client'

import { useEffect, useState } from 'react'

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
