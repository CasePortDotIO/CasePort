import config from '@payload-config'
import { getPayload } from 'payload'
import { createIntakeService } from '@/services/IntakeService'
import { createPayloadIntakeDeps } from '@/services/adapters/payload'
import { ComplianceService } from '@/services/ComplianceService'
import { enforceRateLimit } from '@/lib/rateLimit'
import { storeClaimantMedia, fileFromForm, MAX_MEDIA_BYTES } from '@/lib/mediaUpload'

/**
 * Voice statement capture (Section 6 step 2). The claimant records what happened
 * in their own words; Deepgram transcribes it. The recording is stored and the
 * capture is put on the immutable event log through the domain service
 * (VoiceCaptured, VoiceTranscribed). The transcript is the claimant's own account
 * of events, organized later into the reflective playback, and carries no
 * evaluative signal (W2).
 *
 * Resilient: if transcription is unavailable the transcript comes back empty and
 * the claimant can type or re record; intake is never blocked on a paid AI call.
 */
export async function POST(req: Request) {
  const limited = enforceRateLimit(req, 'transcribe', { limit: 20, windowMs: 60_000 })
  if (limited) return limited

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return Response.json({ error: 'expected multipart form data' }, { status: 400 })
  }

  const file = fileFromForm(form, 'file')
  if (!file) return Response.json({ error: 'missing recording' }, { status: 400 })
  if (file.size > MAX_MEDIA_BYTES) return Response.json({ error: 'recording too large' }, { status: 413 })

  const sessionId = String(form.get('sessionId') || '') || 'voice-anon'

  let transcript = ''
  try {
    const payload = await getPayload({ config })
    const intake = createIntakeService(createPayloadIntakeDeps(payload))
    const stored = await storeClaimantMedia(payload, { file, alt: 'voice statement' })
    const result = await intake.recordVoice(sessionId, stored.key)
    transcript = result.transcript
  } catch (err) {
    console.error('transcription failed', err)
    transcript = ''
  }

  const body = { transcript, transcribed: transcript.length > 0 }
  ComplianceService.guardClaimantPayload(body)
  return Response.json(body, { status: 200 })
}
