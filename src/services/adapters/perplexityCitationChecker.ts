import type { CitationChecker } from '../learningPorts'

/**
 * Perplexity backed citation checker (DEMAND_CAPTURE.md Phase E, Section 9). The
 * roll your own, cheap alternative to a managed answer engine tracker: ask the
 * Perplexity API a target question and check whether CasePort appears in the
 * citations it returns. CasePort's zero search volume coined terms make this a
 * near trivial match, so citation ownership is measured, not assumed.
 *
 * It runs dry (reports not cited) when PERPLEXITY_API_KEY is absent, so building
 * it commits no spend and the learning loop stays observable. It is provider
 * agnostic: a managed tracker (Otterly, Peec) is a different CitationChecker
 * behind the same port.
 */

const CASEPORT_HOST = 'caseport.io'

function perplexityConfigured(): boolean {
  return Boolean(process.env.PERPLEXITY_API_KEY)
}

/** Whether any citation URL points at CasePort. Pure, so it is testable. */
export function citesCaseport(citations: string[], host = CASEPORT_HOST): boolean {
  const re = new RegExp(host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  return citations.some((c) => re.test(c))
}

async function askPerplexity(question: string): Promise<string[]> {
  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.PERPLEXITY_MODEL ?? 'sonar',
        messages: [{ role: 'user', content: question }],
      }),
    })
    const json = (await res.json().catch(() => ({}))) as { citations?: string[] }
    return json.citations ?? []
  } catch (err) {
    console.error('[perplexity] citation check failed', err)
    return []
  }
}

export function createPerplexityCitationChecker(): CitationChecker {
  return {
    async check(question) {
      if (!perplexityConfigured()) return { cited: false, engines: [] }
      const citations = await askPerplexity(question)
      return citesCaseport(citations) ? { cited: true, engines: ['perplexity'] } : { cited: false, engines: [] }
    },
  }
}
