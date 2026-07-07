import { describe, it, expect, beforeAll } from 'vitest'
import { citesCaseport, createPerplexityCitationChecker } from '@/services/adapters/perplexityCitationChecker'

/**
 * Perplexity citation checker: the cheap, roll your own answer engine citation
 * tracker (Phase E). Proves the pure citation match and the dry run behavior
 * (reports not cited, no spend) when the key is absent.
 */

beforeAll(() => {
  delete process.env.PERPLEXITY_API_KEY
})

describe('citation match', () => {
  it('detects a CasePort citation among answer engine sources', () => {
    expect(citesCaseport(['https://caseport.io/guide/va/contributory-negligence', 'https://example.com'])).toBe(true)
    expect(citesCaseport(['https://competitor.com', 'https://nolo.com'])).toBe(false)
    expect(citesCaseport([])).toBe(false)
  })
})

describe('dry run without a key', () => {
  it('reports not cited and makes no request', async () => {
    const checker = createPerplexityCitationChecker()
    const result = await checker.check('What is contributory negligence in Virginia?', 'answer-engine')
    expect(result.cited).toBe(false)
    expect(result.engines).toEqual([])
  })
})
