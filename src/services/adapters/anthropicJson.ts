import Anthropic from '@anthropic-ai/sdk'

/**
 * Shared Claude JSON call for the live agent adapters. Follows the same pattern
 * as AnthropicNarrativeClient: claude-opus-4-8, a bounded non streaming call, a
 * strict JSON reply parsed defensively. It no ops cleanly when the key is absent
 * (returns the caller's fallback), so the whole agentic surface runs dry and
 * testable without credentials, and a live key activates real reasoning.
 *
 * Compliance is not enforced here. Every adapter's output still flows through
 * the existing service gates (the regulatory verification and recommendation
 * guard in SynthesisService, the placement and public copy gate in
 * publishAsset, the Rule 7.1 gate in B2BCaptureService), so even a live model
 * cannot bypass the Wall. The prompts reinforce it; the gates enforce it.
 */

const MODEL = 'claude-opus-4-8'

export function anthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

function firstText(message: Anthropic.Message): string {
  for (const block of message.content) if (block.type === 'text') return block.text
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

/**
 * Call Claude for a JSON object. Returns fallback when no key is configured or on
 * any error, so the caller always gets a safe value and never throws.
 */
export async function claudeJson<T>(input: {
  system: string
  user: string
  fallback: T
  maxTokens?: number
  client?: Anthropic
}): Promise<T> {
  if (!anthropicConfigured() && !input.client) return input.fallback
  try {
    const client = input.client ?? new Anthropic()
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: input.maxTokens ?? 1500,
      system: input.system,
      messages: [{ role: 'user', content: input.user }],
    })
    return parseJson(firstText(message), input.fallback)
  } catch (err) {
    console.error('[anthropic] json call failed, using fallback', err)
    return input.fallback
  }
}
