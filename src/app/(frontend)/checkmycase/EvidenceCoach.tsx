'use client'

import { useEffect, useRef, useState } from 'react'
import type { CaptureInventory } from '@/services/ports'

/**
 * The claimant facing surface of the Evidence and Intake Coaching Agent
 * (AGENTS.md Section 4.1). It guides the injured person through their own
 * accident documentation, one shot at a time, and quietly assembles the most
 * defensible dossier in the category.
 *
 * It holds the running capture inventory and asks the server for the next
 * direction after each capture. Every direction it renders came back guarded
 * from /api/checkmycase/coach: the server substitutes a compliant fallback if
 * the model ever drifts, so this component can only ever display procedural,
 * photographic direction, never a case assessment (W2, W6).
 */

interface CoachDirection {
  direction: string
  focus: string | null
  done: boolean
}

const PHOTO_FOCUSES = new Set(['wide', 'damage', 'plate', 'scene', 'injury'])

function advance(inv: CaptureInventory, focus: string | null): CaptureInventory {
  const next: CaptureInventory = {
    photos: [...inv.photos],
    documents: [...inv.documents],
    voiceCaptured: inv.voiceCaptured,
    insuranceCardParsed: inv.insuranceCardParsed,
  }
  if (focus && PHOTO_FOCUSES.has(focus)) next.photos.push({ kind: focus })
  else if (focus === 'insurance-card') {
    next.insuranceCardParsed = true
    next.documents.push({ kind: 'insurance-card' })
  } else if (focus === 'police-report') next.documents.push({ kind: 'police-report' })
  else if (focus === 'voice') next.voiceCaptured = true
  return next
}

const EMPTY: CaptureInventory = { photos: [], documents: [], voiceCaptured: false, insuranceCardParsed: false }

export default function EvidenceCoach({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [inventory, setInventory] = useState<CaptureInventory>(EMPTY)
  const [direction, setDirection] = useState<CoachDirection | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function fetchNext(inv: CaptureInventory) {
    setLoading(true)
    try {
      const res = await fetch('/api/checkmycase/coach', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ inventory: inv }),
      })
      if (res.ok) setDirection((await res.json()) as CoachDirection)
    } catch {
      // The coach is an enhancement. If it is unreachable, the plain upload
      // path below still works; we simply show no direction.
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchNext(EMPTY)
    // Only on mount: subsequent fetches are driven by captures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function step(focus: string | null, files?: File[]) {
    if (files && files.length) onFiles(files)
    const next = advance(inventory, focus)
    setInventory(next)
    void fetchNext(next)
  }

  if (direction?.done) {
    return (
      <div style={cardStyle}>
        <div style={{ ...kickerStyle, color: '#2f8f6b' }}>Your file is well documented</div>
        <p style={bodyStyle}>
          You have captured the essentials. Anything else you add helps, but you have already built a strong record of
          what happened.
        </p>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <div style={kickerStyle}>Guided documentation</div>
      <h3 style={headlineStyle}>{direction ? 'Your next photo' : 'Preparing your first step'}</h3>
      <p style={bodyStyle}>{direction ? direction.direction : 'One moment.'}</p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
        <button
          type="button"
          style={primaryBtn}
          disabled={loading || !direction}
          onClick={() => inputRef.current?.click()}
        >
          {direction?.focus === 'voice' ? 'Add a recording' : 'Add this photo'}
        </button>
        <button
          type="button"
          style={ghostBtn}
          disabled={loading || !direction}
          onClick={() => step(direction?.focus ?? null)}
        >
          Skip this step
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,audio/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          if (files.length) step(direction?.focus ?? null, files)
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
const ghostBtn: React.CSSProperties = {
  background: 'none',
  color: 'var(--muted, #8a857d)',
  border: '1px solid var(--border, #ddd6ca)',
  borderRadius: 8,
  padding: '10px 18px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
}
