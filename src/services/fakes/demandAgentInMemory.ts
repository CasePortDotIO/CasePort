import type { AssetStructure } from '@/lib/demand/placement'
import type {
  AnswerDrafter,
  DemandAgentDeps,
  DraftInput,
  DraftedAnswer,
  QuestionSensor,
  SensedQuestion,
} from '../demandAgentPorts'
import type { DemandCaptureService } from '../DemandCaptureService'
import type { KeywordRegistry } from '../demandCapturePorts'

/**
 * In memory sensor and drafter for the Demand Capture B2C layer (Phase B). The
 * sensor returns scripted questions; the compliant drafter returns an answer
 * that passes the placement and public copy gate; the adversarial drafters try
 * to slip legal advice, evaluative language, a guarantee, a prohibited call to
 * action, or an em dash past the gate, and the gate must reject every one.
 */

const filler = (n: number) => Array(n).fill('word').join(' ')

/** A sensor that returns a fixed list of candidate questions. */
export function createFakeSensor(questions: SensedQuestion[]): QuestionSensor {
  return { async sense() {
    return questions.map((q) => ({ ...q }))
  } }
}

/** Build a clean, extraction ready structure for a question (Section 7). */
export function compliantStructure(input: DraftInput): AssetStructure {
  const keyword = `${input.market} ${input.legalConcept}`.trim()
  return {
    side: 'b2c',
    targetKeyword: keyword,
    directAnswer: `${keyword} personal injury basics. ${filler(118)}`,
    faqAnswers: [`${keyword} personal injury question. ${filler(58)}`],
    body: `${keyword} personal injury educational overview. ${filler(400)}`,
    schemaType: 'FAQPage',
    intakeCtaText: 'Send my information',
    intakeCtaHref: '/checkmycase',
    hasComplianceDisclaimer: true,
  }
}

/** The compliant drafter. Its output publishes cleanly through the human gate. */
export function createCompliantDrafter(): AnswerDrafter {
  return {
    async draft(input) {
      return draftFrom(input, compliantStructure(input))
    },
  }
}

/**
 * The adversarial drafters, one per attack the eval must defeat. Each returns a
 * structurally plausible asset whose copy carries a specific violation, so the
 * publish gate is exercised against real non compliant drafts.
 */
export type AdversarialKind =
  | 'legal-advice'
  | 'evaluative'
  | 'guarantee'
  | 'prohibited-cta'
  | 'em-dash'
  | 'abbreviation'

export function createAdversarialDrafter(kind: AdversarialKind): AnswerDrafter {
  return {
    async draft(input) {
      const base = compliantStructure(input)
      switch (kind) {
        case 'legal-advice':
          return draftFrom(input, { ...base, body: `You have a strong case. ${base.body}` })
        case 'evaluative':
          return draftFrom(input, { ...base, directAnswer: `These are vetted, top-rated firms. ${filler(118)}` })
        case 'guarantee':
          return draftFrom(input, { ...base, body: `We guarantee you will recover. ${base.body}` })
        case 'prohibited-cta':
          return draftFrom(input, { ...base, intakeCtaText: 'Free case review' })
        case 'em-dash':
          // Build the em dash from an escape so no literal appears in source.
          return draftFrom(input, { ...base, body: `A calm overview ${'\u2014'} educational. ${base.body}` })
        case 'abbreviation':
          return draftFrom(input, { ...base, body: `Your PI claim overview. ${base.body}` })
      }
    },
  }
}

function draftFrom(input: DraftInput, structure: AssetStructure): DraftedAnswer {
  return {
    title: `${input.market} ${input.legalConcept} explained`,
    url: `https://caseport.io/guide/${input.cellKey.replace(/:/g, '/')}`,
    owningIdentity: input.owningIdentity,
    structure,
  }
}

/** Assemble the agent service deps from a base demand service and the fakes. */
export function demandAgentDepsFrom(
  demand: DemandCaptureService,
  registry: KeywordRegistry,
  sensor: QuestionSensor,
  drafter: AnswerDrafter,
): DemandAgentDeps {
  return { demand, registry, sensor, drafter }
}
