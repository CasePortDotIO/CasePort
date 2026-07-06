import { scoreDemandCell } from '@/lib/demand/scoring'
import { validateAssetStructure } from '@/lib/demand/placement'
import { IDENTITY_BASED_SURFACES } from '@/lib/domain/demandCapture'
import type {
  CaptureAssetInput,
  CaptureAssetRecord,
  DemandCaptureDeps,
  DemandCellInput,
  DemandCellRecord,
  PublishResult,
} from './demandCapturePorts'

/**
 * DemandCaptureService. The foundation of the CasePort Demand Capture Engine
 * (DEMAND_CAPTURE.md Phase A). It scores demand cells by defensible data cell
 * logic with funded market gating (Section 6, HL3), enforces one canonical
 * answer per question through the keyword ownership registry (Section 7), and
 * runs the pre publish gate that lets a compliant, human approved asset go live
 * (HL4, HL5).
 *
 * The engine harvests, never intercepts (Section 1). Nothing here contacts an
 * injured person. Every asset routes to self initiation, and no method exposes
 * an evaluative signal on a public surface.
 *
 *   scoreCell       resolve fundedness, score by the three gates, persist the
 *                   cell with pursue or ignore. Emits DemandCellScored.
 *   claimQuestion   the registry gate. Bind a canonical question to one URL, or
 *                   report a conflict with the existing owner.
 *   draftAsset      record a produced asset in draft. Drafting itself is Phase B.
 *   publishAsset    the pre publish gate. Publishes only when the cell is
 *                   pursued, the structure and public copy are compliant, the
 *                   asset owns its canonical question, and a human approves.
 *                   Returns a typed result; never throws on a non compliant asset.
 */
export function createDemandCaptureService(deps: DemandCaptureDeps) {
  /**
   * Score a demand cell (Section 6). Funded market state is resolved through the
   * resolver, never decided here, so a cell can never be pursued in a market
   * that cannot receive it (HL3). High volume is never an input.
   */
  async function scoreCell(input: DemandCellInput): Promise<DemandCellRecord> {
    const now = deps.clock.nowIso()
    const fundedMonetizable = await deps.funded.isFunded(input.market)
    const scored = scoreDemandCell({
      uniqueness: input.uniqueness,
      intent: input.intent,
      fundedMonetizable,
    })

    const existing = await deps.cells.getByKey(input.cellKey)
    const record: DemandCellRecord = {
      id: existing?.id ?? deps.ids.cellId(),
      cellKey: input.cellKey,
      market: input.market,
      caseType: input.caseType,
      legalConcept: input.legalConcept,
      surface: input.surface,
      uniqueness: input.uniqueness,
      intent: input.intent,
      status: scored.status,
      score: scored.score,
      ignoreReason: scored.ignoreReason,
      fundedMonetizable,
      scoredAt: now,
    }
    await deps.cells.save(record)
    await deps.events.append({
      eventType: 'DemandCellScored',
      aggregateType: 'demand-cell',
      aggregateId: record.id,
      actor: 'demand-capture',
      occurredAt: now,
      payload: {
        cellKey: record.cellKey,
        market: record.market,
        status: record.status,
        score: record.score,
        ignoreReason: record.ignoreReason,
        fundedMonetizable,
      },
    })
    return record
  }

  /**
   * Check whether a canonical question is available for a URL to own (Section 7).
   * One canonical answer per question across the domain. Returns ok when the
   * question is unowned or already owned by this same URL; returns a conflict
   * with the current owner otherwise. This is an advisory planning check; the
   * binding claim is publication itself, in publishAsset below.
   */
  async function claimQuestion(
    canonicalQuestion: string,
    url: string,
  ): Promise<{ ok: boolean; conflictUrl?: string }> {
    const existing = await deps.registry.owner(canonicalQuestion)
    if (existing && existing.url !== url) return { ok: false, conflictUrl: existing.url }
    return { ok: true }
  }

  /** Record a produced asset in draft (Section 10). Drafting is agentic in Phase B. */
  async function draftAsset(input: CaptureAssetInput): Promise<CaptureAssetRecord> {
    const now = deps.clock.nowIso()
    const record: CaptureAssetRecord = {
      id: deps.ids.assetId(),
      cellKey: input.cellKey,
      surface: input.surface,
      canonicalQuestion: input.canonicalQuestion,
      url: input.url,
      owningIdentity: input.owningIdentity,
      title: input.title,
      structure: input.structure,
      status: 'draft',
      approvedBy: null,
      publishedAt: null,
      createdAt: now,
    }
    await deps.assets.save(record)
    await deps.events.append({
      eventType: 'CaptureAssetDrafted',
      aggregateType: 'capture-asset',
      aggregateId: record.id,
      actor: 'demand-capture',
      occurredAt: now,
      payload: { cellKey: record.cellKey, surface: record.surface, canonicalQuestion: record.canonicalQuestion },
    })
    return record
  }

  /**
   * The pre publish gate (Section 7, HL4, HL5). An asset publishes only when
   * every condition holds:
   *
   *   1. Human approver. A human publishes anything under a real identity (HL4).
   *      Identity based surfaces additionally require a named owning identity
   *      (HL2), never an anonymous or AI author.
   *   2. Pursued cell. The asset's demand cell must be pursued, which means its
   *      market is funded (HL3). No capture in an unfunded market.
   *   3. Compliant structure and copy. The deterministic placement checks and
   *      the public copy compliance checks all pass (Section 7, HL5, HL7).
   *   4. Canonical ownership. The asset owns its canonical question, or the
   *      question is unowned and is claimed now. A question owned by a different
   *      URL blocks publication.
   *
   * Returns a typed result and never throws. A blocked publish records the
   * asset as rejected with the exact reasons and emits CaptureAssetRejected.
   */
  async function publishAsset(assetId: string, approver: string): Promise<PublishResult> {
    const now = deps.clock.nowIso()
    const asset = await deps.assets.get(assetId)
    if (!asset) return { published: false, asset: null, reasons: ['asset not found'] }

    const reasons: string[] = []

    // 1. Human approver (HL4) and real identity on identity surfaces (HL2).
    if (!approver || !approver.trim()) reasons.push('no human approver (HL4)')
    if (IDENTITY_BASED_SURFACES.has(asset.surface) && (!asset.owningIdentity || !asset.owningIdentity.trim())) {
      reasons.push('identity based surface requires a real owning identity (HL2)')
    }

    // 2. Pursued cell means funded market (HL3).
    const cell = await deps.cells.getByKey(asset.cellKey)
    if (!cell) reasons.push(`demand cell "${asset.cellKey}" not scored`)
    else if (cell.status !== 'pursue') {
      reasons.push(`demand cell is ignore (${cell.ignoreReason ?? 'unknown'}); no capture in an unfunded or vanity cell`)
    }

    // 3. Structure and public copy compliance (Section 7, HL5, HL7).
    const structure = validateAssetStructure(asset.structure)
    if (!structure.valid) {
      for (const v of structure.violations) reasons.push(`structure: ${v.rule}: ${v.detail}`)
    }

    // 4. Canonical question ownership (Section 7).
    const owner = await deps.registry.owner(asset.canonicalQuestion)
    if (owner && owner.url !== asset.url) {
      reasons.push(`canonical question already owned by ${owner.url}`)
    }

    if (reasons.length > 0) {
      const rejected: CaptureAssetRecord = { ...asset, status: 'rejected' }
      await deps.assets.save(rejected)
      await deps.events.append({
        eventType: 'CaptureAssetRejected',
        aggregateType: 'capture-asset',
        aggregateId: asset.id,
        actor: approver || 'demand-capture',
        occurredAt: now,
        payload: { cellKey: asset.cellKey, reasons },
      })
      return { published: false, asset: rejected, reasons }
    }

    // All gates pass. Publication establishes ownership of the canonical
    // question (the registry is a derived view over published assets).
    const published: CaptureAssetRecord = { ...asset, status: 'published', approvedBy: approver, publishedAt: now }
    await deps.assets.save(published)
    if (!owner) {
      await deps.events.append({
        eventType: 'KeywordQuestionClaimed',
        aggregateType: 'keyword-ownership',
        aggregateId: asset.canonicalQuestion,
        actor: approver,
        occurredAt: now,
        payload: { canonicalQuestion: asset.canonicalQuestion, url: asset.url, assetId: asset.id },
      })
    }
    await deps.events.append({
      eventType: 'CaptureAssetPublished',
      aggregateType: 'capture-asset',
      aggregateId: asset.id,
      actor: approver,
      occurredAt: now,
      payload: {
        cellKey: asset.cellKey,
        surface: asset.surface,
        canonicalQuestion: asset.canonicalQuestion,
        url: asset.url,
      },
    })
    return { published: true, asset: published, reasons: [] }
  }

  return { scoreCell, claimQuestion, draftAsset, publishAsset }
}

export type DemandCaptureService = ReturnType<typeof createDemandCaptureService>
