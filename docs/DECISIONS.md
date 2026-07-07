# Founder Decisions Log

Locked answers to the Section 15 gate in `CLAUDE.md`. Phase 0 does not begin until all four items are resolved. This log is append-only in spirit: supersede a decision with a new dated entry, do not silently rewrite history.

## Status of the Section 15 gate

| Item | Topic | Status |
| ---- | ----- | ------ |
| 1 | ACER definition | Locked |
| 2 | Wallet-dry market policy | Locked |
| 3 | Per-opportunity price table and case types | Locked (provisional fees, reversible) |
| 4 | Manus prototype | Received and mapped (see PROTOTYPE_CONTRACT_MAP.md) |
| 5 | Market model: single-firm vs multi-firm | Locked (per-market type) |
| 6 | Quality bar: fabricated stats and dark patterns | Locked (remove) |

Section 15 gate is cleared. Phase 0 may begin.

---

## D1. ACER definition (2026-07-05)

**Locked: Acquisition Cost Efficiency Ratio. ACER is the true, all-in cost per signed case.**

Rationale. Section 7 frames the Glass Box as the cost-per-signed-case math shown against a firm's Google Ads and shared-lead spend. ACER is a dollar figure: total acquisition cost attributable to a firm over a period divided by the number of cases that firm signed in that period. It is a Glass Box and intelligence metric only. It never feeds billing. Per W3 and W4 the fee is fixed per delivered opportunity and is never a function of outcome, so ACER being outcome-aware is fine because it lives entirely in the intelligence layer.

## D2. Wallet-dry market policy (2026-07-05)

**Locked: hold in the delivery queue and fire a top-up alert. No drop, no re-route.**

Behavior.
- The dossier holds in a delivery queue. It is not delivered and the wallet is not debited until funds cover the fixed fee.
- The firm receives an urgent top-up alert through Resend and Twilio.
- The claimant status remains received and pending firm contact. Status language stays geographic and procedural only, per W2 and W6.
- Single-firm exclusivity means there is no backup firm, so re-routing is structurally off the table. A wallet-dry hold is a commercial hold, never a quality filter.

## D3. Case types and per-opportunity price table (2026-07-05)

**Case types locked (full personal injury list).** Motor vehicle accident, commercial trucking accident, premises liability (slip and fall), medical malpractice, wrongful death, dog bite and animal attack. "Personal injury" is spelled in full everywhere per Section 14. This is the firm-facing triage case-type enum and the price-table key. The prototype's minimal internal set (Auto, Slip, Medical, Other) maps into this list; "Other" is not used as a billing bucket.

**Price table locked as provisional and reversible.** Founder asked for an industry-intelligence-based recommendation. Fixed fee per delivered opportunity:

| Case type | Base fee (standard markets) | Premium metros (DC, Atlanta, Northern Virginia, Baltimore) |
| --------- | --------------------------- | ---------------------------------------------------------- |
| Motor vehicle accident | 750 | 900 |
| Premises liability (slip and fall) | 700 | 840 |
| Dog bite and animal attack | 450 | 540 |
| Commercial trucking accident | 1800 | 1800 |
| Medical malpractice | 2500 | 2500 |
| Wrongful death | 3000 | 3000 |

Rationale, from 2025 to 2026 market data. Exclusive personal injury leads run 250 to 600, and 300 to 1500 in competitive metros. Cost per signed case via Google Ads runs 2500 to 3000 on average and 8700 to 12900 in competitive metros. Medical malpractice cost per acquisition runs 2000 to 5000. CasePort delivers a worked-up, exclusive dossier with the HIPAA authorization pre-executed, not a raw lead, so it prices above an exclusive lead while still beating the firm's cost per signed case comfortably at reasonable sign rates. Competition-driven types (auto, premises, dog bite) carry a roughly 20 percent premium in the hot metros; value-driven types (trucking, medical malpractice, wrongful death) price on national case economics and stay flat. This encodes the founder's "not every city is equal" point as a market tier.

Fees are fixed and never derived from outcome (W3, W4). The values live in a price table keyed by case type and market tier and can be retuned per cell without code changes. Phase 3 debit uses these values; the founder can revise any cell before or after go-live.

## D4. Manus prototype (received and mapped, 2026-07-05)

Both dashboards received (law firm dashboard and internal operator dashboard). Fully inventoried and mapped to Section 5 collections and the Section 4 domain services in `docs/PROTOTYPE_CONTRACT_MAP.md`. Key finding: the prototype assumes a multi-firm competitive market that conflicts with single-firm exclusivity. That conflict is escalated as D5.

## D5. Market model: per-market type (2026-07-05)

Founder direction: it depends on the market and city, not every city is created equal. Encoded as a per-market type rather than one global model.

- `markets.marketType` is set per market: `single-firm-exclusive` or `multi-firm-panel`. Premium cities can be locked to one firm; others may hold a panel.
- Launch build ships single-firm routing only. Each launch market (Virginia, Maryland, Washington DC, Georgia) is configured `single-firm-exclusive` at go-live unless the founder designates a specific city as a panel.
- The `multi-firm-panel` routing rule (a compliant, non-quality rotation by geography and capacity) is the W8-deferred seam. It is reserved in the schema and implemented in a fast-follow, never using any quality signal to choose among panel firms (W1).
- Leaderboard and rank are national, cross-market vanity metrics with zero routing consequence. "Priority routing" and "priority premium cases" are removed. Reporting completeness gates nothing about routing.

## D6. Quality bar: remove fabricated stats and dark patterns (2026-07-05)

The prototype contains unsourced claims (for example "firms who check 15+ times daily see 3.2x higher conversion") and coercive framing (the InvestmentLayer switching-cost and sunk-capital panel, compulsive-checking urgency). These conflict with the Section 14 bar of not a single false claim.

Locked: strip fabricated statistics and coercive framing. Keep the dense, real-time, auditable Bloomberg-terminal texture. Every number on every panel must trace to a real event. Leaderboard, streaks, and any retained engagement mechanics are driven only by real data.

---

# CasePort Intelligence Core: Section 14 gate

`INTELLIGENCE_CORE.md` Section 14 gates Phase A on four items. This section records their resolution, following the same provisional-and-reversible pattern as D3.

## Status of the Section 14 gate

| Item | Topic | Status |
| ---- | ----- | ------ |
| 1 | ACER definition | Locked (see D1) |
| 2 | Rented source allowlist and reliability ratings | Locked (provisional, reversible) |
| 3 | Promotion approver policy | Provisional default, confirm before Phase F |
| 4 | Internal delivery channels | Provisional default, confirm before Phase D |

Phase A may begin. Items 3 and 4 do not affect Phase A content (source registry and signals store); their provisional defaults are recorded so the gate is documented, and they are flagged for founder confirmation before the phases that consume them.

## D7. CIC source allowlist and reliability ratings (2026-07-06)

**Locked as provisional and reversible.** The seed allowlist lives in `src/lib/intelligence/sourceAllowlist.ts`, derived directly from the sources named in `INTELLIGENCE_CORE.md` Section 4 and rated by the H5 discipline: A primary or institutional, B industry research, C synthesized or estimated.

- Regulatory sources (ABA model rules, the VA, MD, DC, and GA state bar ethics opinions, state legislature statute trackers) are rated A. These are the highest-leverage domain (Section 4.3) and must be human-verified before any market action regardless of rating.
- Industry research (Semrush via MCP, Clay enrichment, lead-market-rate benchmarks, injury and settlement benchmarks, the mini-TCPA tracker) is rated B.
- Inferred or modeled signals (answer-engine citation gaps, competitor pricing) are rated C and always flagged for verification before action.
- The owned CasePort first party event log is rated A. It is the moat, joined by the attribution tuple.

Like the D3 price table, any entry can be added, retuned, or retired per cell without code changes. The epistemic gate in `IntelligenceCoreService` is source agnostic: the allowlist governs what may be ingested, never how ingestion works. New sources are added only through human review; nothing is auto-trusted, and nothing from an unlisted or prohibited source can enter (H5, proven by the Phase A checkpoint test).

## D8. CIC promotion approver policy (2026-07-06, provisional)

**Provisional default, pending founder confirmation before Phase F.** No production value (SCPS version, price-table cell, qualification weight, or market entry/exit) changes without a logged human approval in `promotionLog` (H1). Provisional authority model:

- An SCPS version or a price-table change requires one approval from an operator with the `admin` role.
- A regulatory-triggered market action (entry or exit) requires two approvals, because a hallucinated opinion that triggers a market exit is costly and a missed real one is fatal (Section 4.3).

This is a genuine business and authority decision. It does not affect Phase A. Confirm or override before building the Phase F promotion gates.

## D9. CIC internal delivery channels (2026-07-06, provisional)

**Provisional default, pending founder confirmation before Phase D.** Briefings and alerts are internal only (H6) and access controlled. Provisional channels: Resend for the daily and weekly briefing email, and a messaging channel for real-time alerts (Twilio SMS is already in the stack; a Slack or webhook target is to be named). Confirm the exact channels before building the Phase D surfaces.

**Update (2026-07-06): Phase D built on this provisional default.** The BriefingService delivers through a channel abstraction (`BriefingNotifier`): email via Resend to `OPS_BRIEFING_EMAIL`, and the messaging channel via Twilio SMS to `OPS_ALERT_PHONE`. Both dry run cleanly when the env vars are unset, so the surface ships and tests without live channels. Swapping the messaging channel to Slack or a webhook is a one adapter change in `payloadBriefing.ts` behind the same port. Founder still to confirm the final recipients and whether the messaging channel is SMS or Slack; the code does not need to change to switch.

---

# CasePort Demand Capture Engine: Section 14 gate

`DEMAND_CAPTURE.md` Section 14 gates Phase A on four items. Resolved here in the same provisional-and-reversible manner as D3 and D7.

## Status of the Section 14 gate

| Item | Topic | Status |
| ---- | ----- | ------ |
| 1 | Funded markets at build time | Locked (dynamic, launch markets provisional) |
| 2 | Real identities and credentials | Provisional default, confirm before Phase B and C |
| 3 | Surface allowlist and human approvers | Provisional default, confirm before Phase B and C |
| 4 | Intake link migration to checkmycase | Locked |

Phase A may begin. Items 2 and 3 govern identity surfaces and B2B send, which are Phases B and C; their provisional defaults are recorded and flagged for confirmation before those phases.

## D10. Funded markets at build time (2026-07-06)

**Locked: fundedness is resolved dynamically, never hard-coded.** A market is funded when it is active, has an assigned firm, and that firm's wallet balance is positive (HL3). The funded market resolver reads this from the real markets, firms, and wallet state, so B2C capture gating can never drift from whether a firm can actually receive the opportunity. The eligible launch markets are Virginia, Maryland, Washington DC, and Georgia (CLAUDE.md W8); each is funded only while its assigned firm's wallet is positive. This is reversible per market as the footprint changes.

## D11. Real identities and credentials (2026-07-06, provisional)

**Provisional default, pending founder confirmation before Phases B and C.** Identity based surfaces use real named identities with real credentials (HL2), never sockpuppets or AI posing as a human. Provisional identities from the doctrine: Martha for the question platforms (Quora live) and community surfaces; the founders for LinkedIn, expert citation (Qwoted Expert live), and B2B outbound. Credentials are secrets and live in the environment, never in the repository. Confirm the full identity roster and per surface owner before building the identity surface drafting in Phases B and C.

## D12. Surface allowlist and human approvers (2026-07-06, provisional)

**Provisional default, pending founder confirmation before Phases B and C.** The declared surface allowlist is the set enumerated in `src/lib/domain/demandCapture.ts` (`CAPTURE_SURFACES`), derived from Section 4 and Section 5. Provisional approvers: Martha approves and publishes identity surface B2C assets (HL4); a principal approves every B2B outbound send (HL6). Human approval is enforced structurally in the pre publish gate; the specific approver roster is the reversible part. Confirm before Phases B and C.

## D13. Intake link migration to checkmycase (2026-07-06)

**Locked: the one canonical intake destination is caseport.io/checkmycase.** The only permitted claimant call to action is "Send my information"; "free case review", "case review", "case evaluation", and "free consultation" are prohibited (W6, Section 8), and every intake call to action carries the ABA compliance disclaimer. These are enforced in code by the placement gate (`src/lib/demand/placement.ts`) and the public copy checker (`src/lib/compliance/publicCopy.ts`). All older intake links are superseded by this destination.
