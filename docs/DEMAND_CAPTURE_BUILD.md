# CasePort Demand Capture Engine: Build Tracker

Running log for the Demand Capture Engine build (`DEMAND_CAPTURE.md`). The engine is the reach layer that makes CasePort the answer already waiting wherever intent is expressed. It harvests, never intercepts: B2C is inbound only, every identity is real, and no injured person is ever contacted. It reads the CIC to know where to point and writes back what converted. Build in the Section 12 phase order; each phase is shippable and evaluated before the next.

---

## Section 14 gate

Resolved in `docs/DECISIONS.md` (D10 to D13). Item 1 (funded markets) is locked as a dynamic resolver over real wallet state. Item 4 (intake link) is locked to caseport.io/checkmycase with the one permitted call to action and the disclaimer. Items 2 (real identities) and 3 (surface allowlist and approvers) carry provisional defaults flagged for confirmation before Phases B and C.

---

## Phase A. Placement and scoring foundation: DONE (2026-07-06)

The demand cell model, the scoring logic, the keyword ownership registry gate, and the deterministic placement layer.

**Checkpoint (met):** a single asset publishes with correct structure, owns its canonical question, and is scored by defensible data cell logic with funded market gating live. Proven by `tests/int/demand/demand-capture-foundation.int.spec.ts` (10 tests green).

Delivered:
- `src/lib/domain/demandCapture.ts`: surfaces, cell and asset lifecycle, direct answer limits, intake routing constants, prohibited public terms and calls to action.
- `src/lib/domain/constants.ts`: added Demand Capture event types to `EVENT_TYPES`.
- `src/lib/demand/scoring.ts`: `scoreDemandCell`, defensible data cell logic with funded market as a hard gate (HL3). Volume is never an input.
- `src/lib/demand/placement.ts`: `validateAssetStructure`, the deterministic Section 7 gate (direct answer word counts, keyword window, schema, intake routing, public copy).
- `src/lib/compliance/publicCopy.ts`: `findPublicCopyViolations`, the public copy content gate (HL5, HL7): non recommendation language, public evaluative signals, prohibited calls to action, em dash, PI abbreviation.
- `src/services/demandCapturePorts.ts`, `src/services/DemandCaptureService.ts`: `scoreCell`, `claimQuestion`, `draftAsset`, and the `publishAsset` pre publish gate (pursued cell, compliant structure and copy, canonical ownership, human approver). Keyword ownership is a derived view over published assets. Never throws on a non compliant asset.
- `src/services/fakes/demandCaptureInMemory.ts`, `src/services/adapters/payloadDemandCapture.ts`: the funded resolver reads real markets, firms, and wallet balance.
- `src/collections/backend/DemandCells.ts`, `CaptureAssets.ts`: registered in `payload.config.ts`.

Verification: `npm run test` (90 passing), `npx tsc --noEmit` clean, `npm run build` compiles.

---

## Pending phases (do not build ahead)

- **Phase B. B2C sensing and drafting.** The sensing and scoring agent and the drafting agent for answer engine and question platform assets, human published. (Confirm D11 identities and D12 approvers first.) Checkpoint: the engine surfaces a ranked list of unowned high intent questions in a funded market and drafts a compliant, citable answer a human approves and posts.
- **Phase C. B2B inbound authority and outbound precision.** Authority drafting and the proof of reality outbound arm, human approved before publish or send. Checkpoint: an outbound draft carries accurate, redacted market proof and passes the Rule 7.1 adversarial suite.
- **Phase D. Routing and the self closing paths.** B2C and B2B routing wired to the correct destinations with disclaimers. Checkpoint: every captured path routes to self initiation and no path routes to a call.
- **Phase E. The learning loop.** Attribution linkage into the CIC and reallocation of effort toward converting cells, plus citation ownership tracking. Checkpoint: a signed case traces back to its originating surface and phrasing, and the CIC reallocates the next cycle.
