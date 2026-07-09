import type { CaptureDirection, CaptureInventory } from '@/services/ports'
import { essentialCapturesRemaining } from '@/lib/domain/captureChecklist'

/**
 * The Evidence and Intake Coaching Agent. The flagship (AGENTS.md Section 4.1).
 *
 * PATTERN: true agent (AGENTS.md Section 1). All four conditions hold:
 *   1. Open-ended: the next best shot depends on what has already been captured
 *      and cannot be scripted in advance, because every accident differs.
 *   2. Recurring: it runs on every intake, the highest volume surface we have.
 *   3. Recoverable: a wrong direction is a suboptimal photo prompt, reversible
 *      and never a compliance breach, because its output is guarded (below).
 *   4. Boundable: its entire action space is a single audited domain service
 *      method, IntakeService.coachNextCapture.
 *
 * ACTION SPACE (AGENTS.md Section 3): IntakeService only. The agent is
 * constructed with a Pick of exactly the methods it may call, so it has no raw
 * model, database, filesystem, or network access. Its capability equals that
 * small, audited, testable set of functions. This is the primary safety
 * mechanism. TOOL_ALLOWLIST names it explicitly for audit.
 *
 * COMPLIANCE SPINE (W2, W6): the agent never evaluates. Its whole vocabulary is
 * procedural. Enforcement does not rely on the agent behaving: every direction
 * is guarded inside coachNextCapture, which substitutes a compliant fallback if
 * the model drifts. The agent cannot surface a violating direction even if it
 * tries. Tested, not trusted, by the adversarial eval suite.
 *
 * BOUNDED (AGENTS.md Section 3, Section 6): a declared tool allowlist, a maximum
 * step count, a wall clock timeout, and a per run direction budget. No open
 * ended loop.
 *
 * DURABLE: run inside an Inngest durable function (see src/inngest/functions.ts),
 * so a crash mid session resumes rather than corrupting state. Every step emits
 * EvidenceCoachingShown to the event log and is replayable.
 */

/** The audited tool allowlist. The agent may call nothing else. */
export const TOOL_ALLOWLIST = ['IntakeService.coachNextCapture'] as const

/** The action space the agent is given: exactly the guarded coaching action. */
export interface CoachingActionSpace {
  coachNextCapture(
    sessionId: string,
    inventory: CaptureInventory,
  ): Promise<CaptureDirection & { substituted: boolean }>
}

/** Per agent bounds (AGENTS.md Section 3). */
export interface EvidenceCoachingBounds {
  /** Maximum coaching steps in one session. Backstop against a non converging loop. */
  maxSteps: number
  /** Wall clock ceiling for a whole coaching session, milliseconds. */
  timeoutMs: number
  /** Maximum directions surfaced in one run. The cost budget for the run. */
  maxDirections: number
}

export const DEFAULT_BOUNDS: EvidenceCoachingBounds = {
  // The checklist has eight essentials; a little headroom, then stop.
  maxSteps: 12,
  timeoutMs: 30_000,
  maxDirections: 12,
}

export type CoachingStopReason = 'done' | 'step-cap' | 'timeout' | 'budget'

export interface CoachingStep {
  step: number
  direction: CaptureDirection & { substituted: boolean }
  remainingBefore: number
}

export interface CoachingSessionResult {
  sessionId: string
  steps: CoachingStep[]
  stoppedBy: CoachingStopReason
}

/**
 * Advance the inventory by whatever the claimant captured after a direction.
 * Injected so the same agent drives real intake (the app supplies the actual
 * next inventory from capture events) and the dry run eval (the harness
 * simulates the claimant taking the directed shot).
 */
export type ApplyCapture = (
  inventory: CaptureInventory,
  direction: CaptureDirection & { substituted: boolean },
) => CaptureInventory

export function createEvidenceCoachingAgent(
  actions: CoachingActionSpace,
  options: { now?: () => number; bounds?: Partial<EvidenceCoachingBounds> } = {},
) {
  const now = options.now ?? (() => Date.now())
  const bounds: EvidenceCoachingBounds = { ...DEFAULT_BOUNDS, ...options.bounds }

  /**
   * One observe, decide, act step. The event-driven entry point: the app calls
   * this after each real capture event, passing the current inventory, and gets
   * back the single next direction to surface. Guarding happens inside the
   * action, so what returns is always compliant.
   */
  async function coachOnce(
    sessionId: string,
    inventory: CaptureInventory,
  ): Promise<CaptureDirection & { substituted: boolean }> {
    return actions.coachNextCapture(sessionId, inventory)
  }

  /**
   * The bounded observe, decide, act, repeat loop. Used for a full dry run and
   * for the eval harness. Repeatedly coaches, applies the resulting capture, and
   * stops on the first of: the agent reports done, the step cap, the direction
   * budget, or the timeout. It cannot run away.
   */
  async function runCoachingSession(
    sessionId: string,
    initialInventory: CaptureInventory,
    applyCapture: ApplyCapture,
  ): Promise<CoachingSessionResult> {
    const startedAt = now()
    const steps: CoachingStep[] = []
    let inventory = initialInventory

    for (let i = 0; i < bounds.maxSteps; i++) {
      if (now() - startedAt >= bounds.timeoutMs) {
        return { sessionId, steps, stoppedBy: 'timeout' }
      }
      if (steps.length >= bounds.maxDirections) {
        return { sessionId, steps, stoppedBy: 'budget' }
      }

      const remainingBefore = essentialCapturesRemaining(inventory)
      const direction = await actions.coachNextCapture(sessionId, inventory)
      steps.push({ step: i + 1, direction, remainingBefore })

      if (direction.done) {
        return { sessionId, steps, stoppedBy: 'done' }
      }
      inventory = applyCapture(inventory, direction)
    }

    return { sessionId, steps, stoppedBy: 'step-cap' }
  }

  return { bounds, toolAllowlist: TOOL_ALLOWLIST, coachOnce, runCoachingSession }
}

export type EvidenceCoachingAgent = ReturnType<typeof createEvidenceCoachingAgent>
