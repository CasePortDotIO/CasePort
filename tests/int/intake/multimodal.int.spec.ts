import { describe, it, expect, vi, afterEach } from 'vitest'
import { createAnthropicVisionClient } from '@/services/adapters/AnthropicVisionClient'
import { createDeepgramTranscriptionClient } from '@/services/adapters/DeepgramTranscriptionClient'

/**
 * The real multimodal adapters. Claude Vision reads an insurance card so the
 * claimant writes nothing down; Deepgram transcribes their spoken account. Both
 * must extract cleanly on success and degrade to empty (never throw) on failure,
 * so a card that will not parse or a recording that will not transcribe never
 * blocks intake.
 */

function fakeAnthropic(text: string | (() => never)) {
  return {
    messages: {
      create: async () => {
        if (typeof text === 'function') text()
        return { content: [{ type: 'text', text }] }
      },
    },
  } as unknown as Parameters<typeof createAnthropicVisionClient>[0]
}

describe('Claude Vision insurance card parsing', () => {
  it('extracts only the printed string fields as JSON', async () => {
    const vision = createAnthropicVisionClient(
      fakeAnthropic('Here is the card: {"carrier":"Example Mutual","policyNumber":"PM-000123","vehicle":{"vin":"x"}}'),
    )
    const fields = await vision.parseInsuranceCard({ mediaKey: 'https://blob/card.jpg' })
    expect(fields.carrier).toBe('Example Mutual')
    expect(fields.policyNumber).toBe('PM-000123')
    // Nested objects are dropped: the shape is always Record<string,string>.
    expect(fields.vehicle).toBeUndefined()
  })

  it('returns an empty object rather than throwing when the model call fails', async () => {
    const vision = createAnthropicVisionClient(
      fakeAnthropic(() => {
        throw new Error('vision down')
      }),
    )
    expect(await vision.parseInsuranceCard({ mediaKey: 'https://blob/card.jpg' })).toEqual({})
  })
})

describe('Deepgram transcription', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('extracts the transcript from the Deepgram response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ results: { channels: [{ alternatives: [{ transcript: 'I was stopped at the light.' }] }] } }),
      })),
    )
    const dg = createDeepgramTranscriptionClient('key')
    expect((await dg.transcribe({ mediaKey: 'https://blob/voice.wav' })).transcript).toBe('I was stopped at the light.')
  })

  it('returns an empty transcript on a non-ok response, never throwing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })))
    const dg = createDeepgramTranscriptionClient('key')
    expect((await dg.transcribe({ mediaKey: 'https://blob/voice.wav' })).transcript).toBe('')
  })

  it('returns an empty transcript when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network') }))
    const dg = createDeepgramTranscriptionClient('key')
    expect((await dg.transcribe({ mediaKey: 'https://blob/voice.wav' })).transcript).toBe('')
  })
})
