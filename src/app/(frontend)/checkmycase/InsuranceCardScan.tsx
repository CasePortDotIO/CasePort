'use client'

import { useRef, useState } from 'react'

/**
 * Insurance card auto fill (Section 6 step 2). The claimant photographs their
 * card and Claude Vision reads the printed fields back so they write nothing
 * down. This is the please can you handle this for me moment: they point a
 * camera, we do the typing.
 *
 * Every field shown here came back from /api/checkmycase/vision, which stores the
 * photo, parses it through the domain service, and guards the response. The fields
 * are the plain data printed on the claimant's own card, never an assessment (W2).
 * Fully degrading: if the card cannot be read, the claimant simply proceeds; the
 * flow is never blocked on the parse.
 */

interface CardFields {
  carrier?: string
  policyNumber?: string
  namedInsured?: string
  effectiveDate?: string
  expirationDate?: string
  vehicle?: string
  [k: string]: string | undefined
}

const FIELD_LABELS: Record<string, string> = {
  carrier: 'Insurance carrier',
  policyNumber: 'Policy number',
  namedInsured: 'Named insured',
  effectiveDate: 'Effective date',
  expirationDate: 'Expiration date',
  vehicle: 'Vehicle',
}

type Phase = 'idle' | 'reading' | 'done' | 'empty'

export default function InsuranceCardScan({ sessionId }: { sessionId: string | null }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [fields, setFields] = useState<CardFields>({})
  const inputRef = useRef<HTMLInputElement>(null)

  async function onPick(file: File) {
    setPhase('reading')
    try {
      const form = new FormData()
      form.append('file', file)
      if (sessionId) form.append('sessionId', sessionId)
      const res = await fetch('/api/checkmycase/vision', { method: 'POST', body: form })
      if (res.ok) {
        const data = (await res.json()) as { fields: CardFields; parsed: boolean }
        if (data.parsed && Object.keys(data.fields).length) {
          setFields(data.fields)
          setPhase('done')
          return
        }
      }
      setPhase('empty')
    } catch {
      // Never block the claimant on a parse failure.
      setPhase('empty')
    }
  }

  const entries = Object.entries(fields).filter(([, v]) => v && String(v).trim())

  return (
    <div style={cardStyle}>
      <div style={kickerStyle}>Insurance card</div>
      <h3 style={headlineStyle}>Photograph your card. We will read it for you.</h3>
      <p style={bodyStyle}>
        Point your camera at your auto insurance card. You will not type anything. We fill in the details and you confirm.
      </p>

      {phase === 'done' && entries.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {entries.map(([k, v]) => (
            <div key={k} style={rowStyle}>
              <span style={fieldLabelStyle}>{FIELD_LABELS[k] ?? k}</span>
              <span style={fieldValueStyle}>{v}</span>
            </div>
          ))}
          <p style={{ ...bodyStyle, marginTop: 12, marginBottom: 0 }}>
            Read from your card. If anything looks off, you can correct it when your attorney contacts you.
          </p>
        </div>
      )}

      {phase === 'empty' && (
        <p style={{ ...bodyStyle, color: 'var(--muted, #8a857d)' }}>
          We could not read the card clearly. That is fine. Your attorney will collect these details directly.
        </p>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" style={primaryBtn} disabled={phase === 'reading'} onClick={() => inputRef.current?.click()}>
          {phase === 'reading' ? 'Reading your card' : phase === 'done' ? 'Retake photo' : 'Photograph card'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void onPick(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'var(--cream-alt, #fbf8f2)',
  border: '1px solid var(--border-soft, #ece6da)',
  borderLeft: '4px solid var(--teal, #0f6e56)',
  borderRadius: 14,
  padding: 22,
  marginBottom: 18,
}
const kickerStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'var(--teal, #0f6e56)',
  marginBottom: 8,
}
const headlineStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 500,
  color: 'var(--ink, #1a1a1a)',
  marginBottom: 6,
}
const bodyStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--body-text, #55514b)',
  lineHeight: 1.65,
  fontWeight: 300,
  marginBottom: 16,
}
const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: 12,
  padding: '8px 0',
  borderBottom: '1px solid var(--border-soft, #ece6da)',
}
const fieldLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  color: 'var(--muted, #8a857d)',
}
const fieldValueStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--ink, #1a1a1a)',
  textAlign: 'right',
}
const primaryBtn: React.CSSProperties = {
  background: 'var(--teal, #0f6e56)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 18px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
}
