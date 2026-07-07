import { findRecommendationViolations } from '@/lib/intelligence/recommendationGuard'
import { REQUIRED_APPROVERS, type PromotionType } from '@/lib/domain/intelligenceCore'
import type {
  ModelVersionRecord,
  PromotionDeps,
  PromotionInput,
  PromotionRecord,
  PromotionResult,
} from './promotionPorts'

/**
 * PromotionService. The CIC promotion gates (INTELLIGENCE_CORE.md Phase F, H1).
 * No production value (SCPS version, price cell, qualification weight, market
 * action) changes without a logged human approval and its evidence. The CIC
 * proposes; humans promote. This is H1 in operation.
 *
 * Two invariants hold structurally:
 *   - A promotion cannot be proposed if it would make routing smart or make
 *     pricing scale with outcome (W1, W3, H2, H3), caught by the same guard the
 *     recommendation loop uses.
 *   - A promotion cannot promote until it has the required number of distinct
 *     human approvers (decision D8), and every approval is logged with the
 *     approver and the timestamp. On the crossing approval the versioned value is
 *     written, so any production value traces to the proposal, the evidence, and
 *     the approvers that produced it.
 */
export function createPromotionService(deps: PromotionDeps) {
  /**
   * Propose a production change. Blocked outright if it would make routing smart
   * or pricing outcome scaled. Otherwise recorded as pending, awaiting the human
   * gate. Nothing about production changes here; this only opens the gate.
   */
  async function propose(input: PromotionInput): Promise<PromotionResult> {
    const now = deps.clock.nowIso()
    const violations = findRecommendationViolations(`${input.summary} ${JSON.stringify(input.proposedChange)}`)
    if (violations.length > 0) {
      return { promotion: null, promoted: false, reasons: violations.map((v) => `${v.rule}: ${v.match}`) }
    }
    const record: PromotionRecord = {
      id: deps.ids.promotionId(),
      type: input.type,
      summary: input.summary,
      proposedChange: input.proposedChange,
      evidence: input.evidence,
      proposedBy: input.proposedBy,
      status: 'pending',
      requiredApprovers: REQUIRED_APPROVERS[input.type],
      approvals: [],
      versionId: null,
      createdAt: now,
      decidedAt: null,
    }
    await deps.promotions.save(record)
    await deps.events.append({
      eventType: 'PromotionProposed',
      aggregateType: 'promotion',
      aggregateId: record.id,
      actor: input.proposedBy,
      occurredAt: now,
      payload: { type: record.type, requiredApprovers: record.requiredApprovers },
    })
    return { promotion: record, promoted: false, reasons: [] }
  }

  /**
   * Record a human approval. A promotion promotes only once it has the required
   * number of distinct approvers (D8). Each approval is logged; a repeat approval
   * by the same human does not count twice. The crossing approval writes the
   * versioned production value and marks the promotion promoted.
   */
  async function approve(promotionId: string, approver: string): Promise<PromotionResult> {
    const now = deps.clock.nowIso()
    if (!approver || !approver.trim()) return { promotion: null, promoted: false, reasons: ['no approver'] }
    const promotion = await deps.promotions.get(promotionId)
    if (!promotion) return { promotion: null, promoted: false, reasons: ['promotion not found'] }
    if (promotion.status !== 'pending') {
      return { promotion, promoted: false, reasons: [`promotion already ${promotion.status}`] }
    }
    if (promotion.approvals.some((a) => a.approver === approver)) {
      return { promotion, promoted: false, reasons: ['approver already approved; a second distinct approver is required'] }
    }

    const approvals = [...promotion.approvals, { approver, at: now }]
    await deps.events.append({
      eventType: 'PromotionApproved',
      aggregateType: 'promotion',
      aggregateId: promotion.id,
      actor: approver,
      occurredAt: now,
      payload: { type: promotion.type, approvals: approvals.length, required: promotion.requiredApprovers },
    })

    // Not enough approvers yet: record the approval and keep waiting.
    if (approvals.length < promotion.requiredApprovers) {
      const updated: PromotionRecord = { ...promotion, approvals }
      await deps.promotions.save(updated)
      return { promotion: updated, promoted: false, reasons: [] }
    }

    // The crossing approval. Write the versioned production value and promote.
    const nextVersion = (await deps.versions.latestVersion(promotion.type)) + 1
    const version = `v${nextVersion}`
    const versionRecord: ModelVersionRecord = {
      id: deps.ids.versionId(),
      type: promotion.type,
      version,
      value: promotion.proposedChange,
      dataWindow: String((promotion.evidence.dataWindow as string) ?? 'unspecified'),
      promotionId: promotion.id,
      approvedBy: approvals.map((a) => a.approver),
      createdAt: now,
    }
    await deps.versions.save(versionRecord)

    const promoted: PromotionRecord = {
      ...promotion,
      approvals,
      status: 'promoted',
      versionId: versionRecord.id,
      decidedAt: now,
    }
    await deps.promotions.save(promoted)
    await deps.events.append({
      eventType: 'PromotionPromoted',
      aggregateType: 'promotion',
      aggregateId: promotion.id,
      actor: approver,
      occurredAt: now,
      payload: { type: promotion.type, version, approvedBy: versionRecord.approvedBy, promotionId: promotion.id },
    })
    return { promotion: promoted, promoted: true, reasons: [] }
  }

  /** Reject a pending promotion. Logged, so a declined change is auditable too. */
  async function reject(promotionId: string, approver: string, reason: string): Promise<PromotionResult> {
    const now = deps.clock.nowIso()
    const promotion = await deps.promotions.get(promotionId)
    if (!promotion) return { promotion: null, promoted: false, reasons: ['promotion not found'] }
    if (promotion.status !== 'pending') return { promotion, promoted: false, reasons: [`already ${promotion.status}`] }
    const rejected: PromotionRecord = { ...promotion, status: 'rejected', rejectionReason: reason, decidedAt: now }
    await deps.promotions.save(rejected)
    await deps.events.append({
      eventType: 'PromotionRejected',
      aggregateType: 'promotion',
      aggregateId: promotion.id,
      actor: approver || 'operator',
      occurredAt: now,
      payload: { type: promotion.type, reason },
    })
    return { promotion: rejected, promoted: false, reasons: [] }
  }

  /** The active version number for a production value type, or 0 if none promoted. */
  async function activeVersion(type: PromotionType): Promise<number> {
    return deps.versions.latestVersion(type)
  }

  return { propose, approve, reject, activeVersion }
}

export type PromotionService = ReturnType<typeof createPromotionService>
