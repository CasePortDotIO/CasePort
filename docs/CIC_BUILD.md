# CasePort Intelligence Core: Build Tracker

Running log for the CIC build (`INTELLIGENCE_CORE.md`). The CIC is the internal-only compounding intelligence engine. It lives in the system of intelligence, is fully recomputable, and modifies production only through a logged human gate. Build in the Section 12 phase order; each phase is shippable and evaluated before the next.

---

## Section 14 gate

Resolved in `docs/DECISIONS.md` (D7, D8, D9). Item 1 (ACER) is D1. Item 2 (source allowlist and ratings) is locked provisional. Items 3 (promotion approvers) and 4 (delivery channels) carry provisional defaults and are flagged for founder confirmation before Phases F and D respectively.

---

## Phase A. Foundation: DONE (2026-07-06)

IntelligenceCoreService, the source registry, the signals store, the data model additions, and the epistemic rating and supersession logic.

**Checkpoint (met):** an ingested signal is dated, rated, deduplicated, and superseded correctly, and nothing from a prohibited or unlisted source can enter. Proven by `tests/int/intelligence/cic-foundation.int.spec.ts` (8 tests green).

Delivered:
- `src/lib/domain/intelligenceCore.ts`: reliability ratings (A/B/C), the four domains, source and signal lifecycle states, rejection reasons, dispositions.
- `src/lib/domain/constants.ts`: added CIC event types to `EVENT_TYPES`.
- `src/services/intelligenceCorePorts.ts`: registry and signal-store ports, ingest input, typed `IngestResult`.
- `src/services/IntelligenceCoreService.ts`: `registerSource`, `retireSource`, and the `ingestSignal` epistemic gate (allowlist, rating inheritance, dedup, supersession, evented rejections).
- `src/services/fakes/intelligenceCoreInMemory.ts`: in-memory harness.
- `src/services/adapters/payloadIntelligenceCore.ts`: Payload-backed registry and signal store.
- `src/collections/backend/IntelligenceSources.ts`, `IntelligenceSignals.ts`: registered in `payload.config.ts`.
- `src/lib/intelligence/sourceAllowlist.ts`: provisional seed allowlist (D7).

Verification: `npm run test` (80 passing), `npx tsc --noEmit` clean, `npm run build` compiles.

---

## Phase B. Ingestion: DONE (2026-07-06)

Durable ingestion feeding the signals store from two directions, both through the epistemic gate.

**Checkpoint (met):** owned intelligence updates in near real time from live events, and rented sources poll on their cadences. Proven by `tests/int/intelligence/ingestion.int.spec.ts` (7 tests green).

Delivered:
- `src/lib/intelligence/ownedSignals.ts`: `eventToOwnedSignal`, mapping live domain events (outcome, delivery, wallet funded, intake validated, capture published) into first party signals. Returns null for events that carry no intelligence; fabricates nothing.
- `src/services/ingestionPorts.ts`, `IngestionService.ts`: `consumeEvent` (owned, near real time) and `pollSource` / `pollAll` (rented, per cadence). Both ingest only through the gate; typed summaries, never throws.
- `src/inngest/intelligenceWorkflows.ts`: pure `ingestOwnedSignalWorkflow` and `pollRentedSourcesWorkflow`. Idempotent under retry (a duplicate is detected, never doubled).
- `src/services/adapters/payloadIngestion.ts`: owned path fully live; rented fetchers activate one at a time behind the gate (none active yet, so the poller runs dry and observable).
- `src/inngest/functions.ts`: `ingestOwnedIntelligence` (on outcome and delivery events) and `pollRentedSources` (daily cron), registered.

Verification: `npm run test` (112 passing), `npx tsc --noEmit` clean, `npm run build` compiles. Owned ingestion events surface live on the `/ops` console feed.

---

## Phase C. Domain synthesis: DONE (2026-07-06)

The four domain synthesizers producing ranked, sourced artifacts and compliance gated recommendations.

**Checkpoint (met):** each domain produces a ranked, sourced artifact, and the regulatory adversarial suite is green. Proven by `tests/int/intelligence/synthesis.int.spec.ts` (7 tests).

Delivered:
- `src/lib/intelligence/recommendationGuard.ts`: blocks any recommendation that would make routing smart (W1, H2) or make pricing scale with outcome (W3, H3).
- `src/services/synthesisPorts.ts`, `SynthesisService.ts`: reads active signals per domain, runs the agentic synthesizer, and applies two gates the synthesizer cannot bypass. Regulatory verification (H5): a finding is asserted only when backed by a sufficiently reliable active signal (regulatory requires an A rated primary source); a hallucinated or under sourced finding is flagged needs-verification, never asserted. Recommendation compliance (H2, H3): a non compliant proposal is rejected before it can be proposed.
- `src/collections/backend/IntelligenceArtifacts.ts`, `Recommendations.ts`: registered in `payload.config.ts`.
- `src/services/adapters/payloadSynthesis.ts`, `fakes/synthesisInMemory.ts` (grounded, hallucinating, and non compliant synthesizers).

Verification: `npm run test` (127 passing), `npx tsc --noEmit` clean, `npm run build` compiles. Artifacts and recommendation proposals surface on the `/ops` console.

---

## Pending phases (do not build ahead)

- **Phase D. Fusion, briefing, surfaces.** Lead synthesis agent, proactive briefing, on-demand MCP query, alerts. (Confirm D9 channels first.)
- **Phase F. Promotion gates.** Versioning and human promotion workflow for SCPS, pricing, qualification weights, and market actions. (Confirm D8 approver policy first.)

## Phase E. Self-scoring loop: DONE (2026-07-06)

RecommendationLoopService grades each executed recommendation against its realized outcome and calibrates confidence by recommendation type, so the CIC learns which classes of advice actually produce revenue. New `recommendation-outcomes` collection; `RecommendationOutcomeMeasured` event; ports, fake, and payload adapter.

**Checkpoint (met):** the CIC grades a past recommendation against its real outcome and adjusts confidence. Proven by `tests/int/intelligence/recommendation-loop.int.spec.ts` (3 tests). Confidence surfaces on the `/ops` self-scoring strip. Full suite green (134), tsc clean, build compiles.
