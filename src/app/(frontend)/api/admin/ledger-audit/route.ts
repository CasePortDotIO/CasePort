import config from '@payload-config'
import { getPayload } from 'payload'
import { requireInternal } from '@/lib/adminAuth'
import {
  auditLedgerIntegrity,
  type AuditLedgerEntry,
  type AuditWallet,
  type AuditDelivery,
} from '@/lib/ops/ledgerAudit'

/**
 * Money path integrity audit (admin only, read only). Proves on real data that
 * the ledger held: every firm's ledger sum matches its wallet snapshot, no
 * idempotency key was used twice (no double charge), and every billed delivery
 * has exactly one debit. The ledger is the truth (Section 10); a clean audit
 * means money moved correctly.
 *
 * It writes nothing and touches no evaluative field. Run it any time in
 * production to confirm the money system is sound.
 */
export const dynamic = 'force-dynamic'

const relId = (v: unknown) => (v == null ? null : typeof v === 'object' ? String((v as { id: unknown }).id) : String(v))

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config })
    const auth = await requireInternal(payload, req, { admin: true })
    if ('response' in auth) return auth.response

    const [ledger, wallets, deliveries] = await Promise.all([
      payload.find({ collection: 'ledgerEntries', limit: 100000, depth: 0 }),
      payload.find({ collection: 'wallets', limit: 100000, depth: 0 }),
      payload.find({ collection: 'deliveries', limit: 100000, depth: 0 }),
    ])

    const entries: AuditLedgerEntry[] = ledger.docs.map((d) => {
      const r = d as unknown as Record<string, unknown>
      return {
        firmId: relId(r.firm) ?? '',
        entryType: (r.entryType as 'credit' | 'debit') ?? 'debit',
        reason: String(r.reason ?? ''),
        amountCents: Number(r.amountCents ?? 0),
        idempotencyKey: r.idempotencyKey ? String(r.idempotencyKey) : null,
        deliveryId: relId(r.delivery),
      }
    })
    const walletRows: AuditWallet[] = wallets.docs.map((d) => {
      const r = d as unknown as Record<string, unknown>
      return { firmId: relId(r.firm) ?? '', balanceCents: Number(r.balanceCents ?? 0) }
    })
    const deliveryRows: AuditDelivery[] = deliveries.docs.map((d) => {
      const r = d as unknown as Record<string, unknown>
      return { deliveryId: String(r.id), firmId: relId(r.firm) ?? '', billed: Boolean(r.billed) }
    })

    const report = auditLedgerIntegrity({ entries, wallets: walletRows, deliveries: deliveryRows })
    return Response.json(report, { status: report.ok ? 200 : 409 })
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
