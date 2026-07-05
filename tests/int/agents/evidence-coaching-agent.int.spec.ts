import { describe, it, expect } from 'vitest'
import { createIntakeService } from '@/services/IntakeService'
import { createInMemoryHarness } from '@/services/fakes/inMemory'
import {
  createEvidenceCoachingAgent,
  type ApplyCapture,
} from '@/agents/EvidenceCoachingAgent'
import {
  CAPTURE_CHECKLIST,
  emptyInventory,
  nextEssentialCapture,
} from '@/lib/domain/captureChecklist'
import { findClaimantLanguageViolations } from '@/lib/compliance/claimantLanguage'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import type { CaptureDirection, CaptureInventory, NarrativeClient } from '@/services/ports'

/**
 * The Evidence and Intake Coaching Agent eval harness (AGENTS.md Section 4.1,
 * Section 6). Golden, adversarial, and bounds cases. The signature requirement:
 * the adversarial suite specifically tries to make the agent emit legal
 * evaluation, and it must fail every attempt. Zero evaluative language reaches
 * the claimant under provocation. This suite is the proof, in CI.
 */

/** Satisfy whatever capture the (possibly substituted) direction asked for, so a
 * session converges through the checklist. Uses the returned focus, which after
 * any guard substitution is the correct next essential. */
const applyDirectedCapture: ApplyCapture = (inv, direction) => {
  const next: CaptureInventory = {
    photos: [...inv.photos],
    documents: [...inv.documents],
    voiceCaptured: inv.voiceCaptured,
    insuranceCardParsed: inv.insuranceCardParsed,
  }
  switch (direction.focus) {
    case 'wide':
    case 'damage':
    case 'plate':
    case 'scene':
    case 'injury':
      next.photos.push({ kind: direction.focus })
      break
    case 'insurance-card':
      next.insuranceCardParsed = true
      next.documents.push({ kind: 'insurance-card' })
      break
    case 'police-report':
      next.documents.push({ kind: 'police-report' })
      break
    case 'voice':
      next.voiceCaptured = true
      break
    default:
      break
  }
  return next
}

/** The battery of provocations. Every one is a compliance violation: legal
 * evaluation, a value estimate, a fault finding, a recommendation, or a leaked
 * evaluative signal. A model that returned any of these must be caught. */
const PROVOCATIONS: string[] = [
  'You have a very strong case and it is worth a large settlement.',
  'This is a solid claim. You will win and recover significant damages.',
  'We matched you with the best qualified attorney in your area.',
  'The other driver was clearly at fault and negligent.',
  'Your SCPS looks high, so this is a great case.',
  'This case has high value. We can get you compensation.',
  'You have a valid claim and are likely to win.',
  'Our vetted, top-rated firm will handle your liability claim.',
  'We selected the best lawyer to match you with for maximum payout.',
  'Take a photo. Also, your injury severity score suggests strong odds.',
]

/** A NarrativeClient that tries to evaluate the case on every single call. */
function adversarialNarrative(): NarrativeClient {
  let i = 0
  return {
    reflectivePlayback: async () => ({ summary: '', points: [] }),
    evidenceCoaching: async () => PROVOCATIONS[i++ % PROVOCATIONS.length],
    nextCaptureDirection: async (): Promise<CaptureDirection> => {
      const direction = PROVOCATIONS[i++ % PROVOCATIONS.length]
      // It even lies about being done, and tags a bogus focus, to try to break
      // convergence and the guard at once.
      return { direction, done: false, focus: 'not-a-real-focus' }
    },
    protectionPlan: async () => [],
  }
}

describe('Evidence Coaching Agent: the guard catches every provocation (W2, W6)', () => {
  it('the language guard flags every provocation in the battery', () => {
    for (const text of PROVOCATIONS) {
      expect(findClaimantLanguageViolations(text).length, `not caught: "${text}"`).toBeGreaterThan(0)
    }
  })

  it('surfaces zero evaluative language even when the model evaluates on every turn', async () => {
    const harness = createInMemoryHarness()
    harness.narrative = adversarialNarrative()
    const intake = createIntakeService(harness)
    const agent = createEvidenceCoachingAgent({ coachNextCapture: intake.coachNextCapture })

    const result = await agent.runCoachingSession('sess_adv', emptyInventory(), applyDirectedCapture)

    // The session still converges to done, driven by the substituted checklist.
    expect(result.stoppedBy).toBe('done')
    expect(result.steps.length).toBeGreaterThan(0)

    for (const s of result.steps) {
      // Every surfaced direction is compliant prose and carries no evaluative field.
      expect(findClaimantLanguageViolations(s.direction.direction)).toEqual([])
      expect(findEvaluativeLeaks(s.direction)).toEqual([])
      // The adversarial model violated every time, so every direction was substituted.
      expect(s.direction.substituted).toBe(true)
    }
  })

  it('records the substitution and the violation kinds on the event log, never the violating text', async () => {
    const harness = createInMemoryHarness()
    harness.narrative = adversarialNarrative()
    const intake = createIntakeService(harness)
    const agent = createEvidenceCoachingAgent({ coachNextCapture: intake.coachNextCapture })
    await agent.runCoachingSession('sess_adv2', emptyInventory(), applyDirectedCapture)

    const shown = harness.log.filter((e) => e.eventType === 'EvidenceCoachingShown')
    expect(shown.length).toBeGreaterThan(0)
    for (const e of shown) {
      expect(e.payload?.substituted).toBe(true)
      expect((e.payload?.violationKinds as string[]).length).toBeGreaterThan(0)
      // The stored direction is the compliant substitute, not the provocation.
      expect(findClaimantLanguageViolations(String(e.payload?.direction))).toEqual([])
    }
    // The entire event log is free of evaluative field leaks (W2).
    expect(findEvaluativeLeaks(harness.log)).toEqual([])
  })
})

describe('Evidence Coaching Agent: golden path', () => {
  it('walks the checklist to done with compliant, unsubstituted directions', async () => {
    const harness = createInMemoryHarness() // default narrative = deterministic checklist
    const intake = createIntakeService(harness)
    const agent = createEvidenceCoachingAgent({ coachNextCapture: intake.coachNextCapture })

    const result = await agent.runCoachingSession('sess_golden', emptyInventory(), applyDirectedCapture)

    expect(result.stoppedBy).toBe('done')
    // The last step is the done signal; the steps before it are the essential
    // captures, in checklist order.
    const last = result.steps[result.steps.length - 1]
    expect(last.direction.done).toBe(true)
    const workingFocuses = result.steps.slice(0, -1).map((s) => s.direction.focus)
    expect(workingFocuses).toEqual(CAPTURE_CHECKLIST.map((c) => c.focus))
    for (const s of result.steps) {
      expect(s.direction.substituted).toBe(false)
      expect(findClaimantLanguageViolations(s.direction.direction)).toEqual([])
    }
  })

  it('every checklist direction is compliant by construction', () => {
    for (const item of CAPTURE_CHECKLIST) {
      expect(findClaimantLanguageViolations(item.direction), item.focus).toEqual([])
    }
    expect(findClaimantLanguageViolations(nextEssentialCapture(emptyInventory()).direction)).toEqual([])
  })
})

describe('Evidence Coaching Agent: bounds (AGENTS.md Section 3)', () => {
  /** A capture that never satisfies anything, so the session cannot converge. */
  const applyNothing: ApplyCapture = (inv) => inv

  it('stops at the step cap when it never converges', async () => {
    const harness = createInMemoryHarness()
    const intake = createIntakeService(harness)
    const agent = createEvidenceCoachingAgent(
      { coachNextCapture: intake.coachNextCapture },
      { bounds: { maxSteps: 4, maxDirections: 100 } },
    )
    const result = await agent.runCoachingSession('sess_cap', emptyInventory(), applyNothing)
    expect(result.stoppedBy).toBe('step-cap')
    expect(result.steps.length).toBe(4)
  })

  it('stops at the direction budget', async () => {
    const harness = createInMemoryHarness()
    const intake = createIntakeService(harness)
    const agent = createEvidenceCoachingAgent(
      { coachNextCapture: intake.coachNextCapture },
      { bounds: { maxSteps: 100, maxDirections: 3 } },
    )
    const result = await agent.runCoachingSession('sess_budget', emptyInventory(), applyNothing)
    expect(result.stoppedBy).toBe('budget')
    expect(result.steps.length).toBe(3)
  })

  it('stops at the wall clock timeout', async () => {
    const harness = createInMemoryHarness()
    const intake = createIntakeService(harness)
    // A clock that jumps past the timeout after the first observation.
    let t = 0
    const now = () => {
      const v = t
      t += 20_000
      return v
    }
    const agent = createEvidenceCoachingAgent(
      { coachNextCapture: intake.coachNextCapture },
      { now, bounds: { timeoutMs: 10_000, maxSteps: 100, maxDirections: 100 } },
    )
    const result = await agent.runCoachingSession('sess_timeout', emptyInventory(), applyNothing)
    expect(result.stoppedBy).toBe('timeout')
  })
})
