'use client'

import { useEffect, useState } from 'react'

/**
 * The proof of reality surface (Section 7 step 1 and step 2). A skeptical
 * managing partner, before they commit a cent, sees what actually came through
 * their territory, redacted, and a full fidelity sample of a delivered case file.
 * The magic here is not emotion. It is the collapse of disbelief on contact with
 * something real and specific to their own market.
 *
 * Honesty is the product. The activity is framed as representative, never as a
 * volume guarantee. The cost math is a framework the firm fills with their own
 * numbers, never a fabricated conversion rate. Nothing is invented.
 */

interface ProofItem {
  reference: string
  caseType: string
  receivedAt: string
  status: string
}
interface Sample {
  reference: string
  caseType: string
  claimantStatement: string
  categorizedPhotos: string[]
  policeReport: { onFile: boolean; citationIssued: boolean }
  evaluation: { scpsScore: number; injurySeverity: string; liabilityAssessment: string; statuteStatus: string }
  hipaaAuthorization: { executedInFirmName: boolean }
}
interface ProofResponse {
  market: { slug: string; metro: string; state: string | null }
  framing: string
  count: number
  items: ProofItem[]
  sample: Sample
}

type Phase = 'loading' | 'ready' | 'notfound'

function fmtDate(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ProofClient({ marketSlug }: { marketSlug: string }) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [data, setData] = useState<ProofResponse | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/proof/${encodeURIComponent(marketSlug)}`)
        if (cancelled) return
        if (!res.ok) {
          setPhase('notfound')
          return
        }
        setData((await res.json()) as ProofResponse)
        setPhase('ready')
      } catch {
        if (!cancelled) setPhase('notfound')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [marketSlug])

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        <div style={brandStyle}>CASEPORT</div>

        {phase === 'loading' && <p style={mutedStyle}>Loading your market.</p>}

        {phase === 'notfound' && (
          <div style={cardStyle}>
            <h1 style={h1Style}>This market is not open yet</h1>
            <p style={bodyStyle}>
              We serve Virginia, Maryland, Washington DC, and Georgia at launch. If your territory is not live yet, we
              can tell you where it stands.
            </p>
          </div>
        )}

        {phase === 'ready' && data && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={kickerStyle}>Proof of reality</div>
              <h1 style={h1Style}>
                What came through {data.market.metro}
                {data.market.state ? `, ${data.market.state}` : ''}
              </h1>
              <p style={leadStyle}>{data.framing}</p>
            </div>

            {/* Representative recent activity, redacted. Real references, no PII,
                no scores. Reality, not quality. */}
            <div style={cardStyle}>
              <div style={cardHeadStyle}>
                <span style={kickerStyle}>Recent activity in your territory</span>
                <span style={countStyle}>{data.count} shown</span>
              </div>
              {data.items.length === 0 ? (
                <p style={bodyStyle}>
                  No representative activity to show for this market yet. As real personal injury cases flow through your
                  territory, they appear here, redacted.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <Th>Reference</Th>
                        <Th>Case type</Th>
                        <Th>Received</Th>
                        <Th>Status</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((it) => (
                        <tr key={it.reference} style={{ borderTop: '1px solid var(--border-soft, #ece6da)' }}>
                          <td style={tdMonoStyle}>{it.reference}</td>
                          <td style={tdStyle}>{it.caseType}</td>
                          <td style={tdMutedStyle}>{fmtDate(it.receivedAt)}</td>
                          <td style={tdMutedStyle}>{it.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p style={fineStyle}>
                References are redacted. No claimant identifying information is shown. This is representative recent
                activity, not a promise of volume.
              </p>
            </div>

            {/* The full fidelity sample closing kit. This is what a delivered case
                looks like in your hands: statement, categorized evidence, police
                report, the SCPS triage, and the HIPAA authorization already
                executed in your firm name. */}
            <div style={cardStyle}>
              <div style={kickerStyle}>A sample delivered case file</div>
              <h2 style={h2Style}>What you receive, in full</h2>
              <p style={{ ...bodyStyle, marginBottom: 16 }}>
                A seeded sample, not a real claimant. Every delivered case arrives worked up like this.
              </p>

              <Row label="Case type" value={humanize(data.sample.caseType)} />
              <Row label="Claimant statement" value={data.sample.claimantStatement} />
              <Row label="Categorized evidence" value={data.sample.categorizedPhotos.join(', ')} />
              <Row
                label="Police report"
                value={data.sample.policeReport.onFile ? 'On file' + (data.sample.policeReport.citationIssued ? ', citation issued' : '') : 'Not on file'}
              />
              <Row label="Injury severity" value={data.sample.evaluation.injurySeverity} />
              <Row label="Liability" value={data.sample.evaluation.liabilityAssessment} />
              <Row label="Statute status" value={data.sample.evaluation.statuteStatus} />
              <Row label="SCPS triage" value={`${data.sample.evaluation.scpsScore}%`} highlight />
              <Row
                label="HIPAA authorization"
                value={data.sample.hipaaAuthorization.executedInFirmName ? 'Executed in your firm name' : 'Template'}
                highlight
              />
            </div>

            {/* The cost framework. Honest: a fixed fee per delivered opportunity,
                filled with the firm's own numbers, never a fabricated conversion. */}
            <div style={cardStyle}>
              <div style={kickerStyle}>Your cost math, in your numbers</div>
              <h2 style={h2Style}>A fixed fee per delivered case. Nothing hidden.</h2>
              <p style={bodyStyle}>
                You pay one fixed amount per delivered opportunity, set in your agreement by case type. It never changes
                with the outcome, the settlement, or whether the case signs. Compare that fixed cost per delivered case
                against what you pay today per signed case through advertising and shared leads. We show you the real
                math against your own spend, and we never estimate a number we cannot trace.
              </p>
            </div>

            <p style={footNoteStyle}>
              Geographic exclusivity, a contractual callback window, and a fixed per opportunity price by case type. One
              firm per market. We never rate firms and never imply we vetted anyone.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function humanize(slug: string): string {
  return slug.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ')
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={thStyle}>{children}</th>
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={rowStyle}>
      <div style={rowLabelStyle}>{label}</div>
      <div style={{ ...rowValueStyle, ...(highlight ? { color: 'var(--teal, #0f6e56)', fontWeight: 600 } : {}) }}>{value}</div>
    </div>
  )
}

const pageStyle: React.CSSProperties = { minHeight: '100vh', background: 'var(--cream, #f7f3ec)', padding: '32px 20px 64px' }
const shellStyle: React.CSSProperties = { maxWidth: 720, margin: '0 auto' }
const brandStyle: React.CSSProperties = { fontSize: 13, fontWeight: 800, letterSpacing: '.28em', color: 'var(--teal, #0f6e56)', marginBottom: 28 }
const kickerStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--teal, #0f6e56)', marginBottom: 10 }
const h1Style: React.CSSProperties = { fontSize: 28, fontWeight: 500, lineHeight: 1.15, color: 'var(--ink, #1a1a1a)', marginBottom: 10 }
const h2Style: React.CSSProperties = { fontSize: 19, fontWeight: 500, color: 'var(--ink, #1a1a1a)', marginBottom: 8 }
const leadStyle: React.CSSProperties = { fontSize: 15, fontWeight: 300, lineHeight: 1.6, color: 'var(--body-text, #55514b)' }
const cardStyle: React.CSSProperties = { background: 'var(--cream-alt, #fbf8f2)', border: '1px solid var(--border-soft, #ece6da)', borderRadius: 14, padding: 22, marginBottom: 18 }
const cardHeadStyle: React.CSSProperties = { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }
const countStyle: React.CSSProperties = { fontSize: 12, color: 'var(--muted, #8a857d)' }
const bodyStyle: React.CSSProperties = { fontSize: 13, fontWeight: 300, lineHeight: 1.65, color: 'var(--body-text, #55514b)' }
const fineStyle: React.CSSProperties = { fontSize: 12, color: 'var(--muted, #8a857d)', lineHeight: 1.6, marginTop: 12 }
const mutedStyle: React.CSSProperties = { fontSize: 14, color: 'var(--muted, #8a857d)' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
const thStyle: React.CSSProperties = { textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted, #8a857d)', padding: '0 12px 8px 0', whiteSpace: 'nowrap' }
const tdStyle: React.CSSProperties = { fontSize: 13, color: 'var(--ink, #1a1a1a)', padding: '10px 12px 10px 0' }
const tdMonoStyle: React.CSSProperties = { ...tdStyle, fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: 'var(--teal, #0f6e56)' }
const tdMutedStyle: React.CSSProperties = { ...tdStyle, color: 'var(--muted, #8a857d)' }
const rowStyle: React.CSSProperties = { display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border-soft, #ece6da)', alignItems: 'baseline' }
const rowLabelStyle: React.CSSProperties = { flex: '0 0 150px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted, #8a857d)' }
const rowValueStyle: React.CSSProperties = { flex: 1, fontSize: 14, color: 'var(--ink, #1a1a1a)', lineHeight: 1.5 }
const footNoteStyle: React.CSSProperties = { fontSize: 12, color: 'var(--muted, #8a857d)', lineHeight: 1.6, marginTop: 8 }
