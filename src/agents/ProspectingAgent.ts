import type { OutreachDraft, ProspectResearch, ProspectTarget } from '@/services/ProspectingService'

/**
 * The B2B Prospecting and Proof of Reality Agent (AGENTS.md Section 4.3).
 *
 * PATTERN: true agent. Research is open ended: what to surface about a firm
 * depends on what enrichment and the web turn up, and cannot be fully scripted.
 * But the action space is tiny and audited, and it produces a draft, never a
 * send.
 *
 * WHY IT MATTERS: this is the only agentic work that moves the binding
 * constraint, signing Founding Partner one. It cannot close the first skeptic, a
 * human does that, but it manufactures the personalized, truthful proof at scale
 * that makes the human close land.
 *
 * HARD BOUNDARIES:
 *   - It DRAFTS, a human SENDS. Enforced structurally: the agent's action space
 *     is research and draft. There is no notify, email, or send capability
 *     anywhere in its dependencies. The output is a draft awaiting human
 *     approval (AGENTS.md Section 3).
 *   - Truthful and non misleading (Rule 7.1). The draft composer rejects any
 *     guarantee, promised outcome, or volume claim, so the agent cannot return a
 *     non compliant draft.
 *   - Proof of reality is redacted, representative recent activity, framed as
 *     what came through the market, never a volume guarantee.
 *
 * BOUNDED: two steps per run (research, draft), a per run timeout. DURABLE: run
 * inside an Inngest function; each step emits an event and is replayable.
 */

/** The audited action space. Research and draft only. No send exists. */
export const TOOL_ALLOWLIST = ['ProspectingService.researchFirm', 'ProspectingService.draftOutreach'] as const

/** The two step action space the agent is given. Note: no send. */
export interface ProspectingActionSpace {
  researchFirm(target: ProspectTarget): Promise<ProspectResearch>
  draftOutreach(research: ProspectResearch): Promise<OutreachDraft>
}

export interface ProspectingResult {
  research: ProspectResearch
  /** A draft awaiting human review and send. Never sent by the agent. */
  draft: OutreachDraft
  awaitingHumanApproval: true
}

export function createProspectingAgent(actions: ProspectingActionSpace) {
  /**
   * Prospect one target firm: research it, then draft outreach. Returns the
   * draft for a human to review and send. The agent never sends: it has no
   * capability to. If the draft composer rejects the copy on Rule 7.1 grounds,
   * the error propagates rather than a bad draft being returned.
   */
  async function prospect(target: ProspectTarget): Promise<ProspectingResult> {
    const research = await actions.researchFirm(target)
    const draft = await actions.draftOutreach(research)
    return { research, draft, awaitingHumanApproval: true }
  }

  return { toolAllowlist: TOOL_ALLOWLIST, prospect }
}

export type ProspectingAgent = ReturnType<typeof createProspectingAgent>
