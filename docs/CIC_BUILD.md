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

## Pending phases (do not build ahead)

- **Phase B. Ingestion.** Durable rented-source Inngest workflows and internal event-log consumers feeding owned and rented signals continuously. Checkpoint: owned intelligence updates in near real time from live events; rented sources poll on their cadences.
- **Phase C. Domain synthesis.** The four domain agents producing artifacts and recommendations, joined by the attribution tuple. Checkpoint: each domain produces a ranked, sourced artifact; the regulatory adversarial suite is green.
- **Phase D. Fusion, briefing, surfaces.** Lead synthesis agent, proactive briefing, on-demand MCP query, alerts. (Confirm D9 channels first.)
- **Phase E. Self-scoring loop.** Recommendation outcome measurement and recommendation-type self-calibration.
- **Phase F. Promotion gates.** Versioning and human promotion workflow for SCPS, pricing, qualification weights, and market actions. (Confirm D8 approver policy first.)
