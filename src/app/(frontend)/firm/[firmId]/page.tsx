import config from '@payload-config'
import { getPayload } from 'payload'
import { createGlassBoxService } from '@/services/GlassBoxService'
import { createPayloadGlassBoxDeps } from '@/services/adapters/payloadWallet'

export const dynamic = 'force-dynamic'

const usd = (cents: number) =>
  `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const dt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
const titleize = (s: string) => s.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ')

/**
 * The Glass Box (Section 7). A firm's own data and its own market, every dollar
 * auditable. Firm scoped: it reads only this firm's wallet, ledger, and
 * deliveries. Never rates other firms, never implies CasePort vetted anyone.
 */
export default async function GlassBoxPage({ params }: { params: Promise<{ firmId: string }> }) {
  const { firmId } = await params
  const payload = await getPayload({ config })
  const deps = createPayloadGlassBoxDeps(payload)
  const glass = createGlassBoxService(deps)

  const firm = await deps.firms.get(firmId)
  const [wallet, proof, box] = await Promise.all([
    glass.walletView(firmId),
    glass.proofOfRealityFeed(firmId, 12),
    glass.firmGlassBox(firmId),
  ])
  const sample = glass.sampleDossier()
  const low = wallet.lowBalanceThresholdCents != null && wallet.balanceCents < wallet.lowBalanceThresholdCents

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="gb">
        <header className="gb-top">
          <div>
            <div className="gb-kicker">CasePort Glass Box</div>
            <h1 className="gb-firm">{firm?.name || 'Firm'}</h1>
            <div className="gb-market">{firm?.marketId ? `Market ${firm.marketId}` : 'No market assigned'} · Every dollar auditable</div>
          </div>
          <div className={`gb-sync ${wallet.inSync ? 'ok' : 'warn'}`}>
            <span className="dot" /> {wallet.inSync ? 'Ledger in sync' : 'Reconcile needed'}
          </div>
        </header>

        <section className="gb-grid">
          <div className="gb-card wallet">
            <div className="gb-card-label">Wallet balance</div>
            <div className={`gb-balance ${low ? 'low' : ''}`}>{usd(wallet.balanceCents)}</div>
            <div className="gb-sub">
              Authoritative (sum of ledger). Snapshot {wallet.snapshotBalanceCents != null ? usd(wallet.snapshotBalanceCents) : '—'}.
              {low && <span className="gb-low"> Low balance — top up to stay live.</span>}
            </div>
          </div>
          <div className="gb-card">
            <div className="gb-card-label">Ledger entries</div>
            <div className="gb-stat">{wallet.entries.length}</div>
            <div className="gb-sub">Append only. The balance is always the sum of these.</div>
          </div>
          <div className="gb-card">
            <div className="gb-card-label">Deliveries</div>
            <div className="gb-stat">{box.deliveries.length}</div>
            <div className="gb-sub">Dossiers delivered to you. Response time tracked against SLA.</div>
          </div>
        </section>

        <section className="gb-panel">
          <div className="gb-panel-head">Ledger <span>authoritative, append only</span></div>
          <div className="gb-table-wrap">
            <table className="gb-table">
              <thead><tr><th>Date</th><th>Type</th><th>Reason</th><th className="r">Amount</th><th className="r">Balance after</th><th>Reference</th></tr></thead>
              <tbody>
                {wallet.entries.length === 0 && (
                  <tr><td colSpan={6} className="gb-empty">No entries yet. Fund the wallet to begin.</td></tr>
                )}
                {wallet.entries.map((e) => (
                  <tr key={e.id}>
                    <td>{dt(e.occurredAt)}</td>
                    <td><span className={`tag ${e.entryType}`}>{e.entryType}</span></td>
                    <td>{e.reason}</td>
                    <td className={`r num ${e.amountCents < 0 ? 'neg' : 'pos'}`}>{e.amountCents < 0 ? '' : '+'}{usd(e.amountCents)}</td>
                    <td className="r num">{usd(e.balanceAfterCents)}</td>
                    <td className="ref">{e.stripeRef || e.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="gb-two">
          <div className="gb-panel">
            <div className="gb-panel-head">Proof of reality <span>your territory, redacted</span></div>
            <div className="gb-framing">{proof.framing}</div>
            <div className="gb-feed">
              {proof.items.length === 0 && <div className="gb-empty pad">No recent activity to show yet.</div>}
              {proof.items.map((it) => (
                <div key={it.reference} className="gb-feed-item">
                  <div className="gb-feed-type">{titleize(it.caseType)}</div>
                  <div className="gb-feed-meta">{it.reference} · {dt(it.receivedAt)} · {it.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="gb-panel">
            <div className="gb-panel-head">Sample dossier <span>seeded, honest</span></div>
            <div className="gb-sample">
              <div className="gb-sample-row"><span>Reference</span><b>{sample.reference}</b></div>
              <div className="gb-sample-row"><span>Case type</span><b>{titleize(sample.caseType)}</b></div>
              <div className="gb-sample-row"><span>SCPS triage</span><b className="gold">{sample.evaluation.scpsScore}% · {sample.evaluation.scpsVersion}</b></div>
              <div className="gb-sample-row"><span>Injury</span><b>{sample.evaluation.injurySeverity}</b></div>
              <div className="gb-sample-row"><span>Liability</span><b>{sample.evaluation.liabilityAssessment}</b></div>
              <div className="gb-sample-row"><span>HIPAA</span><b>{sample.hipaaAuthorization.executedInFirmName ? 'Executed in your firm name' : 'Pending'}</b></div>
              <div className="gb-sample-note">{sample.note}</div>
            </div>
          </div>
        </section>

        <footer className="gb-foot">CasePort · The Glass Box shows your data and your market. It never rates other firms.</footer>
      </div>
    </>
  )
}

const CSS = `
.gb{min-height:100vh;background:radial-gradient(1200px 600px at 20% -10%,#0f2b2e 0%,#081c1f 45%,#050f11 100%);color:#dfe9e8;font-family:'Figtree',system-ui,sans-serif;padding:32px clamp(16px,5vw,56px);letter-spacing:.01em}
.gb-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;border-bottom:1px solid rgba(201,168,76,.18);padding-bottom:20px;margin-bottom:24px}
.gb-kicker{font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#c9a84c;margin-bottom:6px}
.gb-firm{font-family:'Fraunces',Georgia,serif;font-size:clamp(24px,4vw,34px);font-weight:500;color:#fff;line-height:1.1}
.gb-market{font-size:12px;color:#7fa39d;margin-top:4px}
.gb-sync{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;padding:8px 14px;border-radius:100px;border:1px solid rgba(255,255,255,.1)}
.gb-sync.ok{color:#5fd39a;background:rgba(74,180,126,.08)} .gb-sync.warn{color:#e8a13a;background:rgba(232,161,58,.08)}
.gb-sync .dot{width:7px;height:7px;border-radius:50%;background:currentColor;box-shadow:0 0 10px currentColor}
.gb-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px}
.gb-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:20px 22px}
.gb-card.wallet{background:linear-gradient(150deg,rgba(201,168,76,.12),rgba(255,255,255,.02));border-color:rgba(201,168,76,.28)}
.gb-card-label{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8fb0aa;margin-bottom:10px}
.gb-balance{font-family:'Fraunces',Georgia,serif;font-size:38px;font-weight:500;color:#fff;font-variant-numeric:tabular-nums;line-height:1}
.gb-balance.low{color:#e8a13a}
.gb-stat{font-family:'Fraunces',Georgia,serif;font-size:38px;font-weight:500;color:#fff;font-variant-numeric:tabular-nums;line-height:1}
.gb-sub{font-size:12px;color:#7fa39d;margin-top:10px;line-height:1.5}
.gb-low{color:#e8a13a;font-weight:600}
.gb-panel{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:18px 20px;margin-bottom:20px}
.gb-panel-head{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#dfe9e8;margin-bottom:14px;display:flex;justify-content:space-between;align-items:baseline}
.gb-panel-head span{font-size:10px;font-weight:500;letter-spacing:.06em;color:#6f938d;text-transform:none}
.gb-table-wrap{overflow-x:auto}
.gb-table{width:100%;border-collapse:collapse;font-size:13px}
.gb-table th{text-align:left;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6f938d;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.08)}
.gb-table td{padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.05);color:#cfe0dd}
.gb-table .r{text-align:right} .gb-table .num{font-variant-numeric:tabular-nums;font-weight:600}
.gb-table .num.pos{color:#5fd39a} .gb-table .num.neg{color:#e88a6a}
.gb-table .ref{color:#6f938d;font-family:ui-monospace,monospace;font-size:11px}
.tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:3px 9px;border-radius:100px}
.tag.credit{color:#5fd39a;background:rgba(74,180,126,.12)} .tag.debit{color:#e88a6a;background:rgba(196,102,58,.12)}
.gb-empty{color:#6f938d;text-align:center;padding:22px} .gb-empty.pad{padding:16px}
.gb-two{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:820px){.gb-two{grid-template-columns:1fr}}
.gb-framing{font-size:12px;color:#8fb0aa;font-style:italic;margin-bottom:12px;line-height:1.5}
.gb-feed{display:flex;flex-direction:column;gap:8px}
.gb-feed-item{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:11px 14px}
.gb-feed-type{font-size:13px;font-weight:600;color:#fff}
.gb-feed-meta{font-size:11px;color:#6f938d;margin-top:2px;font-family:ui-monospace,monospace}
.gb-sample-row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px}
.gb-sample-row span{color:#8fb0aa} .gb-sample-row b{color:#eef4f3;text-align:right;font-weight:600}
.gb-sample-row b.gold{color:#c9a84c}
.gb-sample-note{font-size:11px;color:#6f938d;font-style:italic;margin-top:12px}
.gb-foot{margin-top:28px;padding-top:18px;border-top:1px solid rgba(255,255,255,.08);font-size:11px;color:#5c7c77;text-align:center}
`
