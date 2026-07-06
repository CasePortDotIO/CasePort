'use client'

import { useEffect, useState } from 'react'
import type { ClaimantStatusView } from '@/lib/claimant/statusTimeline'

/**
 * The living status page (Section 6 step 8). No black hole: a claimant who
 * started the worst week of their life and handed us their case can come back
 * here and see motion on their behalf. Everything shown is geographic and
 * procedural only, never an evaluative signal (W2). It says what has happened
 * and what happens next, calmly, and asks nothing of them.
 *
 * It reads from the signed status endpoint, which is guarded three ways before
 * anything reaches this component. If the link is invalid or the case cannot be
 * found, it shows a plain, reassuring message rather than an error.
 */

interface StatusResponse {
  reference: string
  status: string
  protectionPlan: string[]
  timeline: ClaimantStatusView
}

type Phase = 'loading' | 'ready' | 'notfound'

export default function StatusClient({ dossierId }: { dossierId: string }) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [data, setData] = useState<StatusResponse | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const sig = new URLSearchParams(window.location.search).get('sig') ?? ''
        const res = await fetch(
          `/api/checkmycase/status/${encodeURIComponent(dossierId)}?sig=${encodeURIComponent(sig)}`,
        )
        if (cancelled) return
        if (!res.ok) {
          setPhase('notfound')
          return
        }
        setData((await res.json()) as StatusResponse)
        setPhase('ready')
      } catch {
        if (!cancelled) setPhase('notfound')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [dossierId])

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        <div style={brandStyle}>CASEPORT</div>

        {phase === 'loading' && <p style={mutedStyle}>Loading your case status.</p>}

        {phase === 'notfound' && (
          <div style={cardStyle}>
            <h1 style={headlineStyle}>We could not open this case</h1>
            <p style={bodyStyle}>
              This status link may have expired or is incomplete. If you have your reference number, the firm reviewing
              your case can look it up for you. There is nothing you need to do right now.
            </p>
          </div>
        )}

        {phase === 'ready' && data && (
          <>
            <div style={{ marginBottom: 22 }}>
              <div style={kickerStyle}>Your case is in motion</div>
              <h1 style={headlineStyle}>{data.timeline.headline}</h1>
              <p style={subheadStyle}>{data.timeline.subhead}</p>
              <div style={refPillStyle}>Reference {data.reference}</div>
            </div>

            <ol style={timelineStyle}>
              {data.timeline.steps.map((step) => (
                <li key={step.key} style={stepStyle}>
                  <span style={dotWrapStyle}>
                    <span style={dotStyle(step.state)} />
                  </span>
                  <div>
                    <div style={stepLabelStyle(step.state)}>{step.label}</div>
                    <div style={stepDetailStyle}>{step.detail}</div>
                    {step.at && step.state === 'done' && (
                      <div style={stepTimeStyle}>{formatWhen(step.at)}</div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {data.protectionPlan.length > 0 && (
              <div style={cardStyle}>
                <div style={{ ...kickerStyle, color: '#0f6e56' }}>While you wait</div>
                <h2 style={{ ...headlineStyle, fontSize: 18, marginBottom: 12 }}>Your protection plan</h2>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {data.protectionPlan.map((p, i) => (
                    <li key={i} style={{ ...bodyStyle, marginBottom: 8 }}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <p style={footNoteStyle}>
              This page updates on its own. You can close it and come back anytime using the link we sent you.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function formatWhen(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  return new Date(t).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'var(--cream, #f7f3ec)',
  padding: '32px 20px 64px',
}
const shellStyle: React.CSSProperties = { maxWidth: 640, margin: '0 auto' }
const brandStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '.28em',
  color: 'var(--teal, #0f6e56)',
  marginBottom: 28,
}
const kickerStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'var(--teal, #0f6e56)',
  marginBottom: 10,
}
const headlineStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 500,
  lineHeight: 1.2,
  color: 'var(--ink, #1a1a1a)',
  marginBottom: 8,
}
const subheadStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 300,
  lineHeight: 1.6,
  color: 'var(--body-text, #55514b)',
  marginBottom: 16,
}
const refPillStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '.04em',
  color: 'var(--teal, #0f6e56)',
  background: 'rgba(15,110,86,0.08)',
  border: '1px solid rgba(15,110,86,0.18)',
  borderRadius: 999,
  padding: '5px 12px',
}
const timelineStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: '0 0 24px',
  padding: 0,
  borderLeft: '2px solid var(--border-soft, #e6dfd2)',
}
const stepStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  gap: 14,
  padding: '0 0 22px 22px',
  marginLeft: -1,
}
const dotWrapStyle: React.CSSProperties = {
  position: 'absolute',
  left: -9,
  top: 2,
  width: 16,
  height: 16,
  display: 'grid',
  placeItems: 'center',
  background: 'var(--cream, #f7f3ec)',
}
const dotStyle = (state: string): React.CSSProperties => ({
  width: state === 'pending' ? 8 : 12,
  height: state === 'pending' ? 8 : 12,
  borderRadius: '50%',
  background:
    state === 'done' ? 'var(--teal, #0f6e56)' : state === 'active' ? '#e0a12e' : 'var(--border, #ccc3b2)',
  boxShadow: state === 'active' ? '0 0 0 4px rgba(224,161,46,0.18)' : 'none',
})
const stepLabelStyle = (state: string): React.CSSProperties => ({
  fontSize: 15,
  fontWeight: state === 'pending' ? 400 : 600,
  color: state === 'pending' ? 'var(--muted, #8a857d)' : 'var(--ink, #1a1a1a)',
  marginBottom: 3,
})
const stepDetailStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 300,
  lineHeight: 1.6,
  color: 'var(--body-text, #55514b)',
}
const stepTimeStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--muted, #8a857d)',
  marginTop: 4,
}
const cardStyle: React.CSSProperties = {
  background: 'var(--cream-alt, #fbf8f2)',
  border: '1px solid var(--border-soft, #ece6da)',
  borderRadius: 14,
  padding: 22,
  marginBottom: 18,
}
const bodyStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 300,
  lineHeight: 1.65,
  color: 'var(--body-text, #55514b)',
}
const mutedStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--muted, #8a857d)',
}
const footNoteStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--muted, #8a857d)',
  lineHeight: 1.6,
  marginTop: 8,
}
