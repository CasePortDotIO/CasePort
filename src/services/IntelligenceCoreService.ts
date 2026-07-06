import type {
  IngestResult,
  IntelligenceCoreDeps,
  SignalIngestInput,
  SignalRecord,
  SourceRecord,
  SourceRecordInput,
} from './intelligenceCorePorts'

/**
 * IntelligenceCoreService. The foundation of the CasePort Intelligence Core
 * (INTELLIGENCE_CORE.md Phase A). It owns the source registry and the epistemic
 * gate through which every signal must pass. It is the whole of the CIC's write
 * surface for knowledge; the domain synthesis agents (Phase C) and ingestion
 * workflows (Phase B) reach the signal store only through here.
 *
 * It lives entirely in the system of intelligence (H4). It never writes money,
 * never touches routing, and never asserts an unverified figure (H5). It cannot
 * promote anything to production; that is the human gate in Phase F.
 *
 *   registerSource   add an allowlisted source through human review. Never
 *                    auto-trusted. Prohibited sources can be recorded but never
 *                    ingest.
 *   ingestSignal     the epistemic gate. Enforces the allowlist, inherits the
 *                    source rating, dates the signal, deduplicates, and applies
 *                    supersession. Returns a typed disposition; never throws on
 *                    untrusted input so ingestion stays durable (Section 3).
 */
export function createIntelligenceCoreService(deps: IntelligenceCoreDeps) {
  /**
   * Register or update a source in the registry (Section 5). Adding a source is
   * a human act: `addedBy` is required and is never a system actor. A source
   * defaults to active; a prohibited source is recorded so the audit trail
   * shows the decision, but it can never pass the gate below.
   */
  async function registerSource(input: SourceRecordInput): Promise<SourceRecord> {
    const now = deps.clock.nowIso()
    const existing = await deps.sources.getByKey(input.sourceKey)
    const record: SourceRecord = {
      id: existing?.id ?? deps.ids.sourceId(),
      sourceKey: input.sourceKey,
      name: input.name,
      origin: input.origin,
      reliability: input.reliability,
      domains: input.domains,
      status: input.status ?? existing?.status ?? 'active',
      addedBy: input.addedBy,
      notes: input.notes ?? existing?.notes,
      registeredAt: existing?.registeredAt ?? now,
      lastCheckedAt: existing?.lastCheckedAt ?? null,
    }
    await deps.sources.save(record)
    await deps.events.append({
      eventType: 'IntelligenceSourceRegistered',
      aggregateType: 'intelligence-source',
      aggregateId: record.id,
      actor: input.addedBy,
      occurredAt: now,
      payload: {
        sourceKey: record.sourceKey,
        reliability: record.reliability,
        status: record.status,
        domains: record.domains,
      },
    })
    return record
  }

  /**
   * Retire a source. Its historical signals are preserved; only future
   * ingestion is closed. Never a delete (H4, Section 5).
   */
  async function retireSource(sourceKey: string, actor: string): Promise<SourceRecord | null> {
    const source = await deps.sources.getByKey(sourceKey)
    if (!source) return null
    const retired: SourceRecord = { ...source, status: 'retired' }
    await deps.sources.save(retired)
    await deps.events.append({
      eventType: 'IntelligenceSourceRetired',
      aggregateType: 'intelligence-source',
      aggregateId: source.id,
      actor,
      occurredAt: deps.clock.nowIso(),
      payload: { sourceKey: source.sourceKey },
    })
    return retired
  }

  /**
   * The epistemic gate (H5, Section 5). Every rented figure enters here or not
   * at all. The gate, in order:
   *
   *   1. Allowlist. The source must exist in the registry and be active. An
   *      unlisted or prohibited or retired source is rejected. Nothing bypasses
   *      the rating.
   *   2. Body and date. A signal must carry a claim and an observation date, so
   *      an empty or undated figure is never asserted as fact.
   *   3. Rating and dating. The signal inherits the source reliability (a signal
   *      never outranks its source) and is stamped with the ingestion time.
   *   4. Deduplication. The same claim (dedupKey) observed at the same date is
   *      not stored twice.
   *   5. Supersession. A newer observation for the same claim supersedes the
   *      active one, which is marked, not deleted. An older observation arriving
   *      after a newer one is stored as superseded on arrival, preserving the
   *      audit trail.
   *
   * Returns a typed disposition and never throws on untrusted input, so a
   * durable ingestion workflow (Phase B) records the outcome rather than failing.
   */
  async function ingestSignal(input: SignalIngestInput): Promise<IngestResult> {
    const now = deps.clock.nowIso()

    // 1. Allowlist. The registry is the trust boundary.
    const source = await deps.sources.getByKey(input.sourceKey)
    if (!source) {
      await rejected(input, 'unlisted-source', now, null)
      return { disposition: 'rejected', signal: null, rejectionReason: 'unlisted-source' }
    }
    if (source.status !== 'active') {
      await rejected(input, 'prohibited-source', now, source.id)
      return { disposition: 'rejected', signal: null, rejectionReason: 'prohibited-source' }
    }

    // 2. Body and date. Never assert an empty or undated figure.
    if (!input.observedAt) {
      await rejected(input, 'missing-observed-at', now, source.id)
      return { disposition: 'rejected', signal: null, rejectionReason: 'missing-observed-at' }
    }
    if (!input.claim || !input.claim.trim()) {
      await rejected(input, 'missing-claim', now, source.id)
      return { disposition: 'rejected', signal: null, rejectionReason: 'missing-claim' }
    }

    // Record that the source was polled. Does not change trust.
    await deps.sources.touch(source.id, now)

    // 4 and 5 depend on the current active signal for this claim.
    const active = await deps.signals.activeByDedupKey(input.dedupKey)

    // 4. Deduplication. Same claim, same observation date is the same figure.
    if (active && active.observedAt === input.observedAt) {
      return { disposition: 'duplicate', signal: active, duplicateOfSignalId: active.id }
    }

    // 5b. Stale arrival. An older observation than the active one is stored as
    // superseded on arrival: kept for the audit trail, never surfaced as current.
    if (active && input.observedAt < active.observedAt) {
      const stale = await appendSignal(input, source, now, 'superseded', {
        supersededById: active.id,
        supersededAt: now,
      })
      return { disposition: 'superseded-on-arrival', signal: stale, supersededSignalId: active.id }
    }

    // 5a. Newer observation. Supersede the active one, then insert the new active.
    const fresh = await appendSignal(input, source, now, 'active')
    if (active) {
      await deps.signals.markSuperseded(active.id, fresh.id, now)
      await deps.events.append({
        eventType: 'IntelligenceSignalSuperseded',
        aggregateType: 'intelligence-signal',
        aggregateId: active.id,
        actor: 'cic',
        occurredAt: now,
        payload: { dedupKey: input.dedupKey, supersededById: fresh.id, sourceKey: input.sourceKey },
      })
      return { disposition: 'ingested', signal: fresh, supersededSignalId: active.id }
    }
    return { disposition: 'ingested', signal: fresh }
  }

  /** Read the current figure for a claim, or null if none is active. */
  async function activeSignal(dedupKey: string): Promise<SignalRecord | null> {
    return deps.signals.activeByDedupKey(dedupKey)
  }

  /** The full, ordered history for a claim: every observation, active and past. */
  async function signalHistory(dedupKey: string): Promise<SignalRecord[]> {
    return deps.signals.historyByDedupKey(dedupKey)
  }

  // Append a signal, inheriting the source rating and stamping ingestion time.
  async function appendSignal(
    input: SignalIngestInput,
    source: SourceRecord,
    ingestedAt: string,
    status: SignalRecord['status'],
    supersession?: { supersededById: string; supersededAt: string },
  ): Promise<SignalRecord> {
    const signal = await deps.signals.append({
      sourceId: source.id,
      sourceKey: source.sourceKey,
      origin: source.origin,
      reliability: source.reliability, // a signal never outranks its source
      domain: input.domain,
      dedupKey: input.dedupKey,
      claim: input.claim.trim(),
      observedAt: input.observedAt,
      ingestedAt,
      status,
      data: input.data,
      attributionRef: input.attributionRef,
      supersededById: supersession?.supersededById,
      supersededAt: supersession?.supersededAt,
    })
    await deps.events.append({
      eventType: 'IntelligenceSignalIngested',
      aggregateType: 'intelligence-signal',
      aggregateId: signal.id,
      actor: 'cic',
      occurredAt: ingestedAt,
      payload: {
        sourceKey: source.sourceKey,
        domain: input.domain,
        dedupKey: input.dedupKey,
        reliability: source.reliability,
        status,
        observedAt: input.observedAt,
      },
    })
    return signal
  }

  // Event a rejected ingestion so an attempt from an untrusted source is auditable.
  async function rejected(
    input: SignalIngestInput,
    reason: string,
    at: string,
    sourceId: string | null,
  ): Promise<void> {
    await deps.events.append({
      eventType: 'IntelligenceSignalRejected',
      aggregateType: 'intelligence-signal',
      aggregateId: sourceId ?? input.sourceKey,
      actor: 'cic',
      occurredAt: at,
      payload: { sourceKey: input.sourceKey, dedupKey: input.dedupKey, reason },
    })
  }

  return { registerSource, retireSource, ingestSignal, activeSignal, signalHistory }
}

export type IntelligenceCoreService = ReturnType<typeof createIntelligenceCoreService>
