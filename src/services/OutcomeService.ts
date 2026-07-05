import type { OutcomeDeps, OutcomeRecordInput, OutcomeResult, StoredOutcome } from './intelligencePorts'

/**
 * OutcomeService. Section 7 step 8, W4. A firm reports what happened to a
 * delivered case: retained, not retained, still evaluating, or settled with a
 * value. That report feeds intelligence and the SCPS feedback loop only. It
 * never touches the fee, which was fixed and charged on delivery regardless of
 * outcome (W3, W4).
 *
 * W4 is enforced by construction, not by discipline: OutcomeDeps carries no
 * ledger or wallet port, so there is literally no code path from here to money.
 * The settlement value is recorded as intelligence and can never become a fee.
 */
export function createOutcomeService(deps: OutcomeDeps) {
  async function reportOutcome(input: {
    deliveryId: string
    firmId: string
    result: OutcomeResult
    reasonCode?: string
    settlementValueCents?: number
  }): Promise<StoredOutcome> {
    const reportedAt = deps.clock.nowIso()
    const record: OutcomeRecordInput = {
      deliveryId: input.deliveryId,
      firmId: input.firmId,
      result: input.result,
      reasonCode: input.reasonCode,
      settlementValueCents: input.settlementValueCents,
      reportedAt,
    }
    const outcome = await deps.outcomes.create(record)

    await deps.events.append({
      eventType: 'OutcomeReported',
      aggregateType: 'delivery',
      aggregateId: input.deliveryId,
      actor: 'firm',
      occurredAt: reportedAt,
      payload: {
        outcomeId: outcome.id,
        firmId: input.firmId,
        result: input.result,
        // Recorded for intelligence only. Never an input to any fee (W4).
        settlementValueCents: input.settlementValueCents ?? null,
      },
    })

    return outcome
  }

  return { reportOutcome }
}

export type OutcomeService = ReturnType<typeof createOutcomeService>
