import { CASE_TYPES } from '@/lib/domain/constants'

/**
 * The living status page, as data (Section 6 step 8). No black hole: a claimant
 * who returns sees motion on their behalf. Every line here is geographic and
 * procedural only, never an evaluative signal and never a legal assessment (W2,
 * W6). There is no strong case, no value, no probability. It says what has
 * happened and what happens next, in plain language, and nothing more.
 *
 * Pure and deterministic, so it is unit tested directly and the same timeline
 * renders on the page and in any test.
 */

export type StepState = 'done' | 'active' | 'pending'

export interface ClaimantStatusStep {
  key: string
  label: string
  detail: string
  state: StepState
  /** ISO timestamp for a completed step, when known. */
  at?: string | null
}

export interface ClaimantStatusView {
  headline: string
  subhead: string
  steps: ClaimantStatusStep[]
}

/** The dossier statuses that reach the claimant. Only these two are claimant
 * safe: received, and delivered to a firm in their area. */
export type ClaimantDossierStatus = 'received' | 'delivered'

function humanizeCaseType(slug: string | null | undefined): string {
  if (!slug) return 'personal injury case'
  const found = CASE_TYPES.find((c) => c.value === slug)
  // Spell personal injury out in full on every claimant facing surface.
  return found ? found.label : 'personal injury case'
}

/**
 * Build the claimant status timeline from the claimant safe dossier facts. The
 * only inputs are the procedural status and the received timestamp: no firm
 * identity, no score, no evaluation. When the case has been delivered to a firm
 * in the claimant's area, the review and the pending attorney contact steps
 * advance; before that they wait. The language never claims an outcome.
 */
export function buildClaimantTimeline(input: {
  status: ClaimantDossierStatus | string
  receivedAt?: string | null
  caseType?: string | null
}): ClaimantStatusView {
  const delivered = input.status === 'delivered'
  const caseLabel = humanizeCaseType(input.caseType)

  const steps: ClaimantStatusStep[] = [
    {
      key: 'received',
      label: 'Your case file was received',
      detail: `We have your ${caseLabel} on file and secured.`,
      state: 'done',
      at: input.receivedAt ?? null,
    },
    {
      key: 'organized',
      label: 'We organized what you told us',
      detail: 'Your account, photos, and documents were put together into one clear file.',
      state: 'done',
      at: input.receivedAt ?? null,
    },
    {
      key: 'reviewing',
      label: 'A firm in your area is reviewing your case',
      detail: delivered
        ? 'Your file was sent to a personal injury firm that serves your area. They are reviewing it now.'
        : 'Your file is being prepared for a personal injury firm that serves your area.',
      state: delivered ? 'done' : 'active',
    },
    {
      key: 'contact',
      label: 'An attorney will contact you directly',
      detail: delivered
        ? 'Keep your phone nearby. The attorney will call from a local number, and their name will appear in a text so you know who is calling.'
        : 'When a firm in your area picks up your file, an attorney will reach out to you directly.',
      state: delivered ? 'active' : 'pending',
    },
  ]

  return {
    headline: delivered
      ? 'A firm in your area is reviewing your case'
      : 'Your case file is received and in motion',
    subhead: delivered
      ? 'You are past the hardest part. An attorney will contact you directly.'
      : 'There is nothing more you need to do right now. We will keep this page updated.',
    steps,
  }
}
