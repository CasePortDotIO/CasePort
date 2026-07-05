import type { StepRunner, WorkflowDeps } from './stepPort'

/**
 * Durable workflows, expressed as pure orchestrations over a StepRunner. Each
 * step is independently retryable and its result memoized, so a crash mid
 * workflow resumes from the last completed step. Because every service call is
 * idempotent, even a worst case full replay charges and delivers exactly once.
 */

/**
 * Deliver a dossier end to end: load, route geographically, deliver as a closing
 * kit, settle the fee or hold. On a hold it fans out a low balance event so the
 * firm is prompted to top up. Retry safe: the debit is anchored to a stable
 * delivery id and guarded by the unique idempotency key, so a retried deliver
 * step never double charges.
 */
export async function deliverDossierWorkflow(
  deps: WorkflowDeps,
  step: StepRunner,
  input: { dossierId: string },
): Promise<{ status: 'not-found' | 'no-firm' | 'delivered' | 'held'; details?: unknown }> {
  const dossier = await step.run('load-dossier', () => deps.loadDossier(input.dossierId))
  if (!dossier) return { status: 'not-found' }

  // Routing is geographic only (W1). It sees the market and the validation
  // boolean, nothing evaluative.
  const decision = await step.run('route', () =>
    deps.routing.route({ dossierId: input.dossierId, market: dossier.market, validationPassed: true }),
  )
  if (!decision.routed || !decision.firmId) {
    return { status: 'no-firm', details: decision }
  }

  const firmId = decision.firmId
  const outcome = await step.run('deliver', () => deps.delivery.deliver({ dossierId: input.dossierId, firmId }))

  if (outcome.status === 'held') {
    await step.sendEvent('alert-low-balance', {
      name: 'wallet/low-balance',
      data: { firmId, deliveryId: outcome.deliveryId },
    })
  }

  return { status: outcome.status, details: outcome }
}

/**
 * Release a firm's held queue after a top up. Triggered by wallet/funded. Re
 * runs each held delivery: those the wallet can now cover settle, the rest stay
 * held. Idempotent, so a duplicate wallet/funded event cannot double charge.
 */
export async function releaseHeldWorkflow(
  deps: WorkflowDeps,
  step: StepRunner,
  input: { firmId: string },
): Promise<{ firmId: string; delivered: number; stillHeld: number }> {
  const released = await step.run('release-held', () => deps.delivery.releaseHeld(input.firmId))
  const delivered = released.filter((r) => r.status === 'delivered').length
  const stillHeld = released.filter((r) => r.status === 'held').length
  return { firmId: input.firmId, delivered, stillHeld }
}

/**
 * Scheduled reconciliation (Section 10). Compares each firm's snapshot against
 * the authoritative ledger sum and flags any drift for human review rather than
 * silently healing it: money discrepancies are surfaced, not swept. Runs on a
 * cron in production.
 */
export async function reconcileWalletsWorkflow(
  deps: WorkflowDeps,
  step: StepRunner,
  input: { firmIds: string[] },
): Promise<Array<{ firmId: string; inSync: boolean; driftCents: number }>> {
  const results: Array<{ firmId: string; inSync: boolean; driftCents: number }> = []
  for (const firmId of input.firmIds) {
    const recon = await step.run(`reconcile-${firmId}`, () => deps.wallet.reconcile(firmId))
    if (!recon.inSync) {
      await step.sendEvent(`flag-drift-${firmId}`, {
        name: 'wallet/drift-detected',
        data: { firmId, driftCents: recon.driftCents },
      })
    }
    results.push({ firmId, inSync: recon.inSync, driftCents: recon.driftCents })
  }
  return results
}
