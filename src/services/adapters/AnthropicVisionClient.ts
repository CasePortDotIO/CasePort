import Anthropic from '@anthropic-ai/sdk'
import type { VisionClient } from '../ports'

/**
 * The production VisionClient. Claude Vision reads an insurance card photo so the
 * claimant writes nothing down (Section 3, Section 6 step 2). It returns only the
 * structured fields printed on the card. It performs no legal evaluation and
 * produces no evaluative signal, so nothing here is gated by W2.
 *
 * The mediaKey is a fetchable URL (a Vercel Blob URL in production). The image is
 * passed to Claude by URL. On any failure the client returns an empty object
 * rather than throwing, so a card that will not parse never blocks intake.
 */

const MODEL = 'claude-opus-4-8'

function firstText(message: Anthropic.Message): string {
  for (const block of message.content) {
    if (block.type === 'text') return block.text
  }
  return ''
}

function parseJson(raw: string): Record<string, string> {
  try {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start === -1 || end === -1) return {}
    const obj = JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>
    // Keep only string fields, so the shape is always Record<string,string>.
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (v != null && typeof v !== 'object') out[k] = String(v)
    }
    return out
  } catch {
    return {}
  }
}

export function createAnthropicVisionClient(client: Anthropic = new Anthropic()): VisionClient {
  return {
    async parseInsuranceCard({ mediaKey }): Promise<Record<string, string>> {
      try {
        const message = await client.messages.create({
          model: MODEL,
          max_tokens: 512,
          system:
            'You read an auto insurance card image and return only the fields printed on it. ' +
            'No commentary, no evaluation. Reply as strict JSON with any of these keys you can read: ' +
            'carrier, policyNumber, effectiveDate, expirationDate, namedInsured, vehicle. Omit keys you cannot read.',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'image', source: { type: 'url', url: mediaKey } },
                { type: 'text', text: 'Extract the insurance card fields as JSON.' },
              ],
            },
          ],
        })
        return parseJson(firstText(message))
      } catch {
        // Never block intake on a parse failure; the claimant can still proceed.
        return {}
      }
    },
  }
}
