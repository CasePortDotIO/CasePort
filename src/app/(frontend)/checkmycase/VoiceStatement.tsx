'use client'

import { useRef, useState } from 'react'

/**
 * The voice statement and the I heard you moment (Section 6 steps 2 and 4). The
 * claimant tells us what happened in their own words. Deepgram transcribes it,
 * then one Claude call reflects it back as a calm, organized summary they confirm.
 * A court reporter, not a judge: it reflects their own account back as
 * organization, never as legal evaluation, and never says strong case (W2, W6).
 *
 * Both the transcript and the playback come back guarded from the server
 * (/api/checkmycase/transcribe and /playback). This component can only ever render
 * a compliant reflection. Fully degrading: if recording or transcription is
 * unavailable, the claimant is thanked and can proceed; the flow is never blocked.
 */

type Phase = 'idle' | 'recording' | 'working' | 'playback' | 'confirmed' | 'unavailable'

interface Playback {
  summary: string
  points: string[]
}

export default function VoiceStatement({ sessionId }: { sessionId: string | null }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [playback, setPlayback] = useState<Playback | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setPhase('unavailable')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        void handleRecorded(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }))
      }
      recorderRef.current = recorder
      recorder.start()
      setPhase('recording')
    } catch {
      // Microphone denied or unavailable: fall back gracefully.
      setPhase('unavailable')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
    setPhase('working')
  }

  async function handleRecorded(blob: Blob) {
    try {
      const form = new FormData()
      form.append('file', new File([blob], 'statement.webm', { type: blob.type }))
      if (sessionId) form.append('sessionId', sessionId)
      const tr = await fetch('/api/checkmycase/transcribe', { method: 'POST', body: form })
      const transcript = tr.ok ? ((await tr.json()) as { transcript: string }).transcript : ''

      if (!transcript.trim()) {
        // Nothing to reflect. Thank them and move on; never block the flow.
        setPhase('confirmed')
        return
      }

      const pb = await fetch('/api/checkmycase/playback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId, transcript }),
      })
      if (pb.ok) {
        setPlayback((await pb.json()) as Playback)
        setPhase('playback')
      } else {
        setPhase('confirmed')
      }
    } catch {
      setPhase('confirmed')
    }
  }

  if (phase === 'confirmed') {
    return (
      <div style={cardStyle}>
        <div style={{ ...kickerStyle, color: '#2f8f6b' }}>On file</div>
        <p style={bodyStyle}>Thank you. We have your account of what happened on file for a firm in your area to review.</p>
      </div>
    )
  }

  if (phase === 'playback' && playback) {
    return (
      <div style={cardStyle}>
        <div style={{ ...kickerStyle, color: '#2f8f6b' }}>Here is what we heard</div>
        <p style={{ ...bodyStyle, marginBottom: playback.points.length ? 14 : 16 }}>{playback.summary}</p>
        {playback.points.length > 0 && (
          <ul style={{ margin: '0 0 16px', paddingLeft: 18 }}>
            {playback.points.map((p, i) => (
              <li key={i} style={{ ...bodyStyle, marginBottom: 6 }}>{p}</li>
            ))}
          </ul>
        )}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" style={primaryBtn} onClick={() => setPhase('confirmed')}>
            That is right
          </button>
          <button type="button" style={ghostBtn} onClick={() => { setPlayback(null); setPhase('idle') }}>
            Add something
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'unavailable') {
    return (
      <div style={cardStyle}>
        <div style={kickerStyle}>Your statement</div>
        <p style={{ ...bodyStyle, marginBottom: 0, color: 'var(--muted, #8a857d)' }}>
          Recording is not available on this device. That is fine. Your attorney will take your statement directly when they call.
        </p>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <div style={kickerStyle}>Your statement</div>
      <h3 style={headlineStyle}>Tell us what happened, in your own words.</h3>
      <p style={bodyStyle}>
        Speak naturally, as if you were telling a friend. We organize it for you and show you what we heard so you can confirm it.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {phase === 'idle' && (
          <button type="button" style={primaryBtn} onClick={() => void startRecording()}>
            Start recording
          </button>
        )}
        {phase === 'recording' && (
          <button type="button" style={{ ...primaryBtn, background: '#b3402f' }} onClick={stopRecording}>
            Stop and organize
          </button>
        )}
        {phase === 'working' && (
          <button type="button" style={primaryBtn} disabled>
            Organizing what you said
          </button>
        )}
      </div>
      {phase === 'recording' && (
        <p style={{ ...bodyStyle, marginTop: 12, marginBottom: 0, color: '#b3402f' }}>Recording. Take your time.</p>
      )}
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
