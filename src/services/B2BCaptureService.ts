import { findRule71Violations, findPiiLeaks } from '@/lib/compliance/rule71'
import type { CaptureSurface } from '@/lib/domain/demandCapture'
import type {
  B2BCaptureDeps,
  B2BTargetInput,
  B2BTargetRecord,
  DraftOutboundResult,
  MarketActivityItem,
} from './b2bPorts'

/**
 * B2BCaptureService. Demand Capture B2B (DEMAND_CAPTURE.md Phase C, Section 5).
 * It captures firm demand through two motions, both human gated:
 *
 *   Outbound precision. For a target it pulls redacted representative recent
 *   activity from that firm's actual market, researches the firm and partner,
 *   and drafts outreach. The draft passes a Rule 7.1 gate before it can queue,
 *   so a guarantee, an unjustified expectation, a volume promise, or leaked
 *   claimant PII blocks it. A human sends; the service never sends (HL4, HL6).
 *
 *   Inbound authority. It drafts authority content for a B2B surface, Rule 7.1
 *   checked, left as a draft for a human to approve and publish (HL4).
 *
 * The proof of reality is representative recent activity with claimant PII
 * redacted, never a volume guarantee. That artifact answers the skeptic's only
 * real objection, prove it is real, before they can raise it.
 */
export function createB2BCaptureService(deps: B2BCaptureDeps) {
  async function addTarget(input: B2BTargetInput): Promise<B2BTargetRecord> {
    const now = deps.clock.nowIso()
    const record: B2BTargetRecord = {
      id: deps.ids.targetId(),
      firmName: input.firmName,
      market: input.market,
      partnerName: input.partnerName,
      revenueBand: input.revenueBand,
      status: 'added',
      enriched: false,
      outbound: null,
      createdAt: now,
    }
    await deps.targets.save(record)
    await deps.events.append({
      eventType: 'B2BTargetAdded',
      aggregateType: 'b2b-target',
      aggregateId: record.id,
      actor: 'demand-capture',
      occurredAt: now,
      payload: { firmName: record.firmName, market: record.market },
    })
    return record
  }

  /**
   * Redacted representative recent activity for a market (HL6). Any item that
   * still carries claimant PII is dropped, not sent, so the proof cannot leak a
   * name, email, or phone even if the underlying reader misbehaves.
   */
  async function proofOfReality(market: string, limit = 6): Promise<MarketActivityItem[]> {
    const items = await deps.proof.recentActivity(market, limit)
    return items.filter((it) => findPiiLeaks(`${it.summary}`).length === 0)
  }

  /**
   * Draft outbound for a target: research, attach redacted market proof, draft,
   * and gate on Rule 7.1. A clean draft is stored pending a human send; a non
   * compliant one is rejected and stored as such, never queued. Never sends.
   */
  async function draftOutbound(targetId: string): Promise<DraftOutboundResult> {
    const now = deps.clock.nowIso()
    const target = await deps.targets.get(targetId)
    if (!target) return { ok: false, target: null, reasons: ['target not found'] }

    const proof = await proofOfReality(target.market)
    const research = await deps.researcher.research(target)
    const drafted = await deps.drafter.draft({ target, research, proof })

    // Rule 7.1 gate over the full outbound text and the rendered proof.
    const proofText = proof.map((p) => p.summary).join(' \n')
    const fullText = `${drafted.subject}\n${drafted.body}\n${proofText}`
    const violations = findRule71Violations(fullText)

    if (violations.length > 0) {
      const reasons = violations.map((v) => `${v.rule}: ${v.match}`)
      const rejected: B2BTargetRecord = {
        ...target,
        outbound: { subject: drafted.subject, body: drafted.body, proof, status: 'rejected', rejectionReason: reasons.join('; ') },
      }
      await deps.targets.save(rejected)
      await deps.events.append({
        eventType: 'OutboundRejected',
        aggregateType: 'b2b-target',
        aggregateId: target.id,
        actor: 'demand-capture',
        occurredAt: now,
        payload: { market: target.market, reasons },
      })
      return { ok: false, target: rejected, reasons }
    }

    const queued: B2BTargetRecord = {
      ...target,
      status: 'drafted',
      outbound: { subject: drafted.subject, body: drafted.body, proof, status: 'pending-send' },
    }
    await deps.targets.save(queued)
    await deps.events.append({
      eventType: 'OutboundDrafted',
      aggregateType: 'b2b-target',
      aggregateId: target.id,
      actor: 'demand-capture',
      occurredAt: now,
      payload: { market: target.market, firmName: target.firmName, proofItems: proof.length },
    })
    return { ok: true, target: queued, reasons: [] }
  }

  /**
   * The human send gate (HL4, HL6). Marks a pending outbound as sent only with a
   * named human sender. The service never sends autonomously; this records that
   * a human did. Returns null when there is nothing pending or no sender.
   */
  async function markSent(targetId: string, sender: string): Promise<B2BTargetRecord | null> {
    if (!sender || !sender.trim()) return null
    const target = await deps.targets.get(targetId)
    if (!target || target.outbound?.status !== 'pending-send') return null
    const now = deps.clock.nowIso()
    const sent: B2BTargetRecord = {
      ...target,
      status: 'sent',
      outbound: { ...target.outbound, status: 'sent', sentBy: sender, sentAt: now },
    }
    await deps.targets.save(sent)
    await deps.events.append({
      eventType: 'OutboundSent',
      aggregateType: 'b2b-target',
      aggregateId: target.id,
      actor: sender,
      occurredAt: now,
      payload: { market: target.market, firmName: target.firmName },
    })
    return sent
  }

  /**
   * Draft inbound authority content for a B2B surface (Section 5.1). Rule 7.1
   * checked, then stored as a draft for a human to approve and publish (HL4). A
   * non compliant draft is rejected and never stored.
   */
  async function draftAuthority(input: {
    surface: CaptureSurface
    topic: string
    title: string
    body: string
    url: string
    owningIdentity: string
  }): Promise<{ ok: boolean; assetId: string | null; reasons: string[] }> {
    const now = deps.clock.nowIso()
    const violations = findRule71Violations(`${input.title}\n${input.body}`)
    if (violations.length > 0) {
      return { ok: false, assetId: null, reasons: violations.map((v) => `${v.rule}: ${v.match}`) }
    }
    const created = await deps.assets.create({
      cellKey: `b2b:authority:${input.surface}`,
      surface: input.surface,
      canonicalQuestion: input.topic,
      url: input.url,
      owningIdentity: input.owningIdentity,
      title: input.title,
      structure: {
        side: 'b2b',
        targetKeyword: '',
        directAnswer: input.body.slice(0, 400),
        body: input.body,
        schemaType: 'Article',
      },
      status: 'pending-approval',
    })
    await deps.events.append({
      eventType: 'AuthorityDrafted',
      aggregateType: 'capture-asset',
      aggregateId: created.id,
      actor: 'demand-capture',
      occurredAt: now,
      payload: { surface: input.surface, topic: input.topic, owningIdentity: input.owningIdentity },
    })
    return { ok: true, assetId: created.id, reasons: [] }
  }

  return { addTarget, proofOfReality, draftOutbound, markSent, draftAuthority }
}

export type B2BCaptureService = ReturnType<typeof createB2BCaptureService>
