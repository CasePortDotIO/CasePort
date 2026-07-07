import { claudeJson, anthropicConfigured } from './anthropicJson'
import type { DomainSynthesizer, DomainSynthesisOutput } from '../synthesisPorts'
import type { QueryAnswer, QueryResponder } from '../briefingPorts'
import type { AnswerDrafter, DraftedAnswer, DraftInput } from '../demandAgentPorts'
import type { OutboundDrafter } from '../b2bPorts'

/**
 * Live Claude backed adapters for the agentic ports. Each activates real
 * reasoning when ANTHROPIC_API_KEY is set and falls back to a safe, honest,
 * non asserting value when it is not, so the system runs dry and testable and a
 * single env var flips it live.
 *
 * Compliance is enforced downstream, not here: a synthesizer's output still
 * passes the regulatory verification and recommendation guard in
 * SynthesisService; a drafter's output still passes the placement and public
 * copy gate in publishAsset; an outbound draft still passes the Rule 7.1 gate.
 * The prompts reinforce the Wall; the gates guarantee it. That is why a live
 * model can never publish a non compliant asset or promote a non compliant
 * change no matter what it generates.
 */

const STANDARDS =
  'Write personal injury in full, never PI. Use no em dashes. Never use evaluative or non ' +
  'recommendation language (approved, vetted, qualified, matched, best). Never promise an outcome or ' +
  'guarantee. The author is not a lawyer and content is educational.'

/** CIC domain synthesizer (Phase C). Reasons over the domain's signals. */
export function createAnthropicDomainSynthesizer(): DomainSynthesizer {
  return {
    async synthesize(input) {
      const fallback: DomainSynthesisOutput = {
        title: `${input.domain} brief`,
        summary: anthropicConfigured()
          ? `Synthesis produced no findings from ${input.signals.length} signals.`
          : 'Live synthesis is not configured (no ANTHROPIC_API_KEY); no findings generated.',
        findings: [],
        recommendations: [],
      }
      return claudeJson<DomainSynthesisOutput>({
        maxTokens: 2000,
        system:
          `You are the CasePort ${input.domain} intelligence synthesizer. Reason over the provided ` +
          'signals and return strict JSON: {"title","summary","findings":[{"claim","signalId","rank"}],' +
          '"recommendations":[{"action","expectedValue","rationale","sourceSignalIds":[]}]}. ' +
          'Only reference signalId values that appear in the input signals; never invent one. ' +
          'Never recommend making routing depend on any quality signal, score, severity, or value. ' +
          'Never recommend pricing that scales with settlement, recovery, contingency, or outcome. ' +
          STANDARDS,
        user: JSON.stringify({ domain: input.domain, signals: input.signals }),
        fallback,
      })
    },
  }
}

/** CIC on demand query responder (Phase D). Answers over the fused intelligence. */
export function createAnthropicQueryResponder(): QueryResponder {
  return {
    async answer(question, context) {
      const fallback: QueryAnswer = {
        answer: anthropicConfigured()
          ? 'No confident answer from the current intelligence. Flagging for human verification.'
          : 'Live query answering is not configured (no ANTHROPIC_API_KEY).',
        citations: [],
        confidence: 'low',
      }
      return claudeJson<QueryAnswer>({
        maxTokens: 1200,
        system:
          'You answer internal CasePort operations questions in CasePort numbers, strictly from the ' +
          'provided artifacts and recommendations. Return JSON {"answer","citations":[],"confidence":"high|medium|low"}. ' +
          'Never assert a figure that is not present in the context. Cite the artifacts and recommendations you used ' +
          '(for example recommendation:<id> or artifact:<domain>). If the context is thin, say so and set confidence low. ' +
          STANDARDS,
        user: JSON.stringify({ question, context }),
        fallback,
      })
    },
  }
}

/** Demand B2C answer drafter (Phase B). Drafts a compliant, citable answer. */
export function createAnthropicAnswerDrafter(): AnswerDrafter {
  return {
    async draft(input: DraftInput) {
      const keyword = `${input.market} ${input.legalConcept}`.trim()
      const url = `https://caseport.io/guide/${input.cellKey.replace(/:/g, '/')}`
      // A safe, incomplete fallback that will not pass the placement gate, so it
      // stays a draft rather than publishing an empty asset without a model.
      const fallback: DraftedAnswer = {
        title: `${keyword} explained`,
        url,
        owningIdentity: input.owningIdentity,
        structure: {
          side: 'b2c',
          targetKeyword: keyword,
          directAnswer: '[draft pending: no model configured]',
          body: '[draft pending: no model configured]',
          schemaType: 'FAQPage',
          intakeCtaText: 'Send my information',
          intakeCtaHref: '/checkmycase',
          hasComplianceDisclaimer: true,
        },
      }
      return claudeJson<DraftedAnswer>({
        maxTokens: 2500,
        system:
          'You draft a compliant, citable personal injury educational answer for an answer engine. Return JSON ' +
          '{"title","url","owningIdentity","structure":{"side":"b2c","targetKeyword","directAnswer","faqAnswers":[],' +
          '"body","schemaType","intakeCtaText","intakeCtaHref","hasComplianceDisclaimer"}}. ' +
          'directAnswer must be 100 to 150 words. Each faqAnswers entry must be 55 to 75 words. The body must contain ' +
          `the target keyword within its first 300 words. intakeCtaText must be exactly "Send my information" and ` +
          'intakeCtaHref must be /checkmycase, with hasComplianceDisclaimer true. Never route to a phone call or a scheduler. ' +
          STANDARDS,
        user: JSON.stringify({ ...input, targetKeyword: keyword, url }),
        fallback,
      })
    },
  }
}

/** Demand B2B outbound drafter (Phase C). Drafts Rule 7.1 clean outreach. */
export function createAnthropicOutboundDrafter(): OutboundDrafter {
  return {
    async draft({ target, research, proof }) {
      const fallback = {
        subject: `Representative recent activity in your ${target.market} market`,
        body: anthropicConfigured()
          ? 'Draft unavailable.'
          : 'Draft pending: live outbound drafting is not configured (no ANTHROPIC_API_KEY).',
      }
      return claudeJson<{ subject: string; body: string }>({
        maxTokens: 1200,
        system:
          'You draft a Rule 7.1 clean B2B outreach email to a personal injury firm partner. Return JSON ' +
          '{"subject","body"}. Frame the attached activity as representative recent activity, never as a volume ' +
          'guarantee. Make no guarantee, no promise of case volume or return, and no unjustified expectation. ' +
          'Never include claimant personally identifiable information (no names, emails, or phone numbers). ' +
          STANDARDS,
        user: JSON.stringify({ target, research, proof }),
        fallback,
      })
    },
  }
}

export { anthropicConfigured }
