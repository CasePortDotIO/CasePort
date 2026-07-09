import type { TranscriptionClient } from '../ports'

/**
 * The production TranscriptionClient. Deepgram transcribes the claimant's spoken
 * account (Section 3, Section 6 step 2), so the reflective playback can reflect
 * their own words back as organization. It is a pure transcription: no legal
 * evaluation, no evaluative signal.
 *
 * Uses Deepgram's REST API directly (no SDK dependency). The mediaKey is a
 * fetchable URL (a Vercel Blob URL in production). On any failure it returns an
 * empty transcript rather than throwing, so a recording that will not transcribe
 * never blocks intake; the claimant's typed answers still stand.
 */

const ENDPOINT = 'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true'

export function createDeepgramTranscriptionClient(apiKey: string): TranscriptionClient {
  return {
    async transcribe({ mediaKey }): Promise<{ transcript: string }> {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { Authorization: `Token ${apiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify({ url: mediaKey }),
        })
        if (!res.ok) return { transcript: '' }
        const data = (await res.json()) as {
          results?: { channels?: Array<{ alternatives?: Array<{ transcript?: string }> }> }
        }
        const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? ''
        return { transcript }
      } catch {
        return { transcript: '' }
      }
    },
  }
}
