import Anthropic from '@anthropic-ai/sdk'
import type { CaptureDirection, CaptureInventory, NarrativeClient, PlaybackResult } from '../ports'
import { nextEssentialCapture } from '@/lib/domain/captureChecklist'

/**
 * The production NarrativeClient. Claude backed reflective playback, evidence
 * coaching, and protection plan generation (Section 3, Section 6).
 *
 * Compliance is enforced in the prompts and by construction: these calls
 * organize and direct, they never evaluate. The playback is a court reporter,
 * not a judge. It never says strong case. The coaching is photographic
 * direction only. None of the output is evaluative, so none of it is gated by
 * W2, but nothing here ever produces SCPS, tier, value, or severity.
 *
 * Model and parameters follow the current Claude API guidance: claude-opus-4-8
 * with adaptive thinking. Requests are small, so a non streaming call with a
 * bounded max_tokens is used. The reply is instructed to be strict JSON and
 * parsed defensively.
 */

const MODEL = 'claude-opus-4-8'

function firstText(message: Anthropic.Message): string {
  for (const block of message.content) {
    if (block.type === 'text') return block.text
  }
  return ''
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start === -1 || end === -1) return fallback
    return JSON.parse(raw.slice(start, end + 1)) as T
  } catch {
    return fallback
  }
}

export function createAnthropicNarrativeClient(
  client: Anthropic = new Anthropic(),
): NarrativeClient {
  return {
    async reflectivePlayback({ transcript }): Promise<PlaybackResult> {
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        thinking: { type: 'adaptive' },
        system:
          'You are a warm, plain English court reporter, not a judge. Reflect back what the ' +
          'person said as organization, never as legal evaluation. Never say strong case, ' +
          'never assess fault, value, or severity. Reply as strict JSON with keys ' +
          '"summary" (one warm paragraph) and "points" (array of short strings).',
        messages: [{ role: 'user', content: transcript }],
      })
      return parseJson<PlaybackResult>(firstText(message), { summary: '', points: [] })
    },

    async evidenceCoaching({ photosSoFar, lastPhotoKind }): Promise<string> {
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 256,
        thinking: { type: 'adaptive' },
        system:
          'You give one short piece of photographic direction for documenting a personal injury ' +
          'accident scene. Photographic direction only. Zero legal evaluation. One sentence.',
        messages: [
          {
            role: 'user',
            content: `Photos taken so far: ${photosSoFar}. Last photo: ${lastPhotoKind ?? 'none'}. What single next shot should they take?`,
          },
        ],
      })
      return firstText(message).trim()
    },

    async nextCaptureDirection({ inventory }: { inventory: CaptureInventory }): Promise<CaptureDirection> {
      const summarize = (items: Array<{ kind: string }>) =>
        items.length ? items.map((i) => i.kind).join(', ') : 'none'
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 256,
        thinking: { type: 'adaptive' },
        system:
          'You direct a person photographing their own personal injury accident scene, one shot ' +
          'at a time, so they build the most complete record of what happened. Photographic and ' +
          'factual direction only. You are a court reporter, not a judge. Never evaluate the case: ' +
          'never say strong case, never mention value, settlement, fault, liability, or a score, ' +
          'and never rank or recommend a lawyer. Give one short instruction for the single next ' +
          'capture. Reply as strict JSON with keys "direction" (one short sentence), "focus" (one ' +
          'of wide, damage, plate, scene, injury, insurance-card, police-report, voice), and ' +
          '"done" (true only when the essentials are all captured).',
        messages: [
          {
            role: 'user',
            content:
              `Photos so far: ${summarize(inventory.photos)}. ` +
              `Documents so far: ${summarize(inventory.documents)}. ` +
              `Voice account recorded: ${inventory.voiceCaptured}. ` +
              `Insurance card read: ${inventory.insuranceCardParsed}. ` +
              `What is the single next capture?`,
          },
        ],
      })
      // The checklist is the compliant floor if the model returns nothing usable.
      const fallback = nextEssentialCapture(inventory)
      const parsed = parseJson<Partial<CaptureDirection>>(firstText(message), {})
      const direction = typeof parsed.direction === 'string' && parsed.direction.trim() ? parsed.direction.trim() : fallback.direction
      return {
        direction,
        done: typeof parsed.done === 'boolean' ? parsed.done : fallback.done,
        focus: typeof parsed.focus === 'string' ? parsed.focus : fallback.focus,
      }
    },

    async protectionPlan({ summary, caseType }): Promise<string[]> {
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        thinking: { type: 'adaptive' },
        system:
          'You write a short, plain English personal injury protection plan: concrete, ' +
          'practical steps a claimant should take (keep medical appointments, do not post ' +
          'about the accident, what to say if an adjuster calls). No legal evaluation, no ' +
          'assessment of the case. Reply as strict JSON with key "steps" (array of short strings).',
        messages: [
          { role: 'user', content: `Case type: ${caseType}. What happened: ${summary}` },
        ],
      })
      return parseJson<{ steps: string[] }>(firstText(message), { steps: [] }).steps
    },
  }
}
