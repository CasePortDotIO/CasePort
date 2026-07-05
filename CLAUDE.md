# CasePort Backend Build: Claude Code Master Prompt and Project Doctrine

Version 1.0. Internal. This document is both the kickoff prompt for a Claude Code build session and the persistent doctrine for the repository.

---

## 0. How to use this document

Do two things with it.

1. Save the whole document as `CLAUDE.md` at the repository root. Claude Code reads it every session. It is the constitution. Nothing in the codebase may contradict it.
2. Start your first session by pasting Section 13 (Build Sequence) as the opening instruction, telling Claude Code to read `CLAUDE.md` in full first, then begin Phase 0 and stop at the checkpoint.

Do not ask Claude Code to build everything at once. Force the phase order. Review at every checkpoint. The compliance wall is poured before any feature that could violate it exists.

Before Claude Code writes a single line, share the Manus prototype (the law firm dashboard and the CasePort dashboard). Claude Code reads the prototype first, maps every piece of data those screens need, and designs the API contract to serve them exactly. The backend serves the frontend that exists. It does not invent a contract the frontend cannot consume.

---

## 1. Mission

You are building the source system for a personal injury case acquisition network. Not lead generation. Not software layered on a firm's broken intake. The system that creates, captures, qualifies, routes, recovers, and protects case opportunities, and that compounds first-party signed-case outcome data into an uncopyable moat.

Two humans touch this system. An injured claimant at one of the worst moments of their life, and a managing partner at a personal injury firm doing five million dollars or more in annual revenue who is the most skeptical buyer on earth. One backend produces two experiences. The claimant feels received and protected. The partner receives a worked-up case file they could sign on the first call. The same operational artifact does both. Protect that operational truth at the center and both hold. Compromise it and both collapse.

The economic target is one million dollars per month in profit as the floor. The revenue mechanism is a pre-funded wallet that auto-deducts a flat fee per delivered qualified opportunity. Money moves correctly, atomically, and auditably, or the business dies. Treat the wallet and the compliance wall as life-critical systems. Everything else is a feature.

---

## 2. The Wall: compliance is the architecture, not the wrapper

Read the CasePort ABA Compliance Memo before you design anything. These rules are not preferences. A single state bar complaint ends this company. Avvo had a 650 million dollar valuation and was nuked in five states for conduct these rules exist to prevent. You will enforce compliance structurally, in types and access control, not in copy review.

The Wall, stated as engineering constraints:

**W1. Routing is geographic only.** The routing decision takes exactly two inputs: the claimant's market (ZIP cluster) and whether intake passed basic validation. The routing function has no access to SCPS, injury severity, case value, or any quality signal. Enforce this in the function signature so it is impossible, not merely discouraged, for a quality score to influence which firm receives a dossier. The audit record for every routing decision carries a `reason` field whose only permitted value is `geographic`.

**W2. SCPS and all evaluative data are firm-facing only, computed after routing, delivered as triage.** SCPS, 5LQS reasoning, estimated case value, injury severity scoring, and signed-case probability never appear in any claimant-facing route, response, component, or log. Not once. Add an automated test that asserts no claimant-serving endpoint can serialize any field from the evaluative set. This test must exist before the intake flow ships.

**W3. Pricing is a fixed dollar amount per delivered opportunity.** It never scales with case outcome, settlement value, contingency fee, or signing. No success tiers. No bonuses. No money-back guarantees. Any code path that would compute a fee as a function of outcome is a fee-splitting violation under ABA Rule 5.4 and is prohibited. The wallet debit amount is looked up from a fixed price table keyed by case type and market. It is never derived from a result.

**W4. Deduction happens on verified delivery, regardless of outcome.** The wallet is debited when the dossier is delivered to the firm. Whether the case signs, settles, or produces revenue is irrelevant to the fee. Outcome data flows the other direction, into intelligence, never into billing.

**W5. HIPAA authorization is dynamically named at routing and CasePort never touches medical records.** The claimant pre-signs a template. At routing, the template is populated with the specific firm name. The named authorization is delivered to the firm. The firm requests records directly from providers. CasePort stores the executed authorization as a record and never receives, transmits, or stores the medical records themselves.

**W6. Every claimant-facing surface carries the non-recommendation disclaimer and uses only compliant language.** No instance of approved, vetted, qualified, pre-screened, top-rated, best, matched, or selected on claimant surfaces. Store disclosure and disclaimer text as jurisdiction-served Payload fields, never hard-coded, so New York attorney-advertising labels, Florida office-location disclosure, and Texas no-representation language are served by state.

**W7. Full audit and retention.** TrustedForm certificate URL on every submission. Timestamped consent with IP, user agent, submission ID, and versioned consent language. Audit log of every routing and delivery decision. Seven-year retention on all consent, disclosure, and routing records.

**W8. Florida is deferred.** Launch markets are Virginia, Maryland, Washington DC, and Georgia. Florida's four-firm-panel rule conflicts with single-firm exclusivity and is out of scope for this build. Do not build Florida routing. Leave a clean seam for a later multi-firm market type.

If any feature request in any future session conflicts with W1 through W8, refuse it and cite the rule. The Wall wins over helpfulness, speed, and every stakeholder request.

---

## 3. Locked tech stack

Do not substitute. Do not add heavy dependencies without justification against the doctrine.

- Runtime and app: Next.js App Router, TypeScript, strict mode.
- CMS and admin: Payload CMS v3. Payload collections are the system of record surface. Field-level access control is a primary compliance enforcement mechanism.
- Database: MongoDB Atlas. Multi-document ACID transactions are used for all wallet operations. No wallet mutation happens outside a transaction.
- Durable workflows: Inngest for every async, retryable, multi-step process (intake pipeline, dossier assembly, delivery, outcome ingestion, reconciliation).
- Payments: Stripe for money-in only. Top-ups create wallet credit. The authoritative balance lives in the CasePort ledger, not in Stripe.
- Telephony and delivery: Twilio for SMS and the speed callback loop. Resend for transactional email.
- Multimodal intake: Claude Vision for insurance card parsing and damage assessment. Deepgram for voice transcription. Claude for the reflective playback, evidence coaching, and protection plan generation.
- Media and PII storage: Cloudflare R2, access controlled. Dossier photos, voice files, and documents live here behind signed, expiring URLs. Never public.
- Analytics: PostHog for product events. B2B enrichment: Clay. These are downstream consumers of the event log, never sources of truth.
- Hosting: Vercel. GitHub for source, with the existing hardening preserved (scoped tokens, branch protection, secret scanning, Actions pinned to commit SHAs, separated preview and production environments).

---

## 4. Architecture doctrine

**Event-sourced core.** Every state change is an immutable event appended to a global event log. Current state is a projection of events, not the primary truth. This gives you the audit trail compliance requires and the raw material the intelligence layer compounds on, for free, as a side effect of correct design.

**System of record versus system of intelligence, separated.** The system of record is the append-only event log plus Payload collections holding facts: claimants, dossiers, firms, markets, wallets, ledger, consents, deliveries, outcomes. The system of intelligence is derived and always recomputable: SCPS scores, ACER metrics, decay-curve positions, benchmark aggregates. Intelligence is never a source of truth. If you deleted the entire intelligence layer, you could rebuild it from events. If you cannot, you have put truth in the wrong place.

**Domain service layer as the single callable interface.** All business logic lives behind a set of pure domain services. Routes, Payload hooks, and Inngest functions call services. They never reach into the database directly for business operations. The services are: IntakeService, QualificationService, RoutingService, DossierService, WalletService, ComplianceService, OutcomeService, IntelligenceService. Design each service as if it will become an MCP tool, because it will. Clean inputs, clean outputs, no hidden side channels.

**The attribution tuple is captured at first touch and carried to the wallet.** This is the Answer-to-Wallet Engine. At the moment intake begins, capture the full tuple: source, keyword or referring surface, market, session behavior, and timestamps. Carry it, immutable, through qualification, routing, delivery, wallet debit, and outcome. When a firm reports a signed case, you can trace that dollar back to the exact keyword, source, and intake behavior that produced it. That closed trace is the billion-dollar secret and the thing no competitor can reconstruct after the fact. Build it into the data model at creation, not as a later join.

**Idempotency everywhere money or delivery is involved.** Every delivery and every debit carries an idempotency key derived from the delivery event id, enforced by a unique index. The same event can never charge twice or deliver twice, no matter how many retries Inngest performs.

---

## 5. Core data model

Design these collections. Names are guidance, structure is not optional.

- `events`: append-only global log. Every event has type, aggregate id, tuple reference, actor, timestamp, and payload. Immutable.
- `claimants`: identity and contact, R2 media references, consent references. PII. Access controlled.
- `intakeSessions`: one per claimant intake attempt, carrying the attribution tuple and the ordered event references for that session.
- `dossiers`: the assembled case file. Split fields by audience. Claimant-safe fields (status, plain-language summary, protection plan) versus firm-only evaluative fields (SCPS, 5LQS reasoning, severity, statute status). Enforce the split with Payload field-level access, not convention.
- `markets`: ZIP cluster to firm assignment. Type field distinguishes single-firm protected markets from a future multi-firm type. Carries the state for jurisdiction-served disclosures.
- `firms`: partner record, SLA terms including required callback time, and the per-opportunity price table keyed by case type. Founding Partner flag.
- `wallets`: a derived balance snapshot for fast reads. Not authoritative. Rebuildable from `ledgerEntries`.
- `ledgerEntries`: append-only, authoritative. Every top-up credit and every delivery debit. Unique index on idempotency key. The wallet balance is the sum of entries, always.
- `deliveries`: dossier to firm, with delivery timestamp, firm response timestamp, and computed response time against SLA.
- `outcomes`: firm-reported signed, declined, settled, and value. Feeds intelligence only. Never billing.
- `scpsScores`: versioned. Every score records the model version that produced it so v2 recalibration is auditable.
- `consents`: TrustedForm URL, timestamp, IP, user agent, submission id, consent language version.
- `hipaaAuthorizations`: the template plus the firm-named executed instance produced at routing.
- `disclosures`: jurisdiction-served text blocks. New York, Florida, Texas, and general.
- `auditLog`: every routing and delivery decision, with the geographic-only reason field, retained seven years.

---

## 6. Claimant journey as a system flow

This is the B2C supply side. The claimant is not the payer. The claimant is the source of the asset. Every step emits events.

1. **Attribution captured.** Claimant arrives at the intake surface (caseport.io/checkmycase). The tuple is captured before anything else. `AttributionCaptured`.
2. **Multimodal intake.** Photos, voice statement, documents, structured fields. Insurance card photographed and parsed by Claude Vision so the claimant writes nothing down. Police report parsed. Voice statement transcribed by Deepgram. Media stored in R2 behind signed URLs. `PhotoUploaded`, `VisionParsed`, `VoiceCaptured`, `VoiceTranscribed`, `DocumentParsed`.
3. **Evidence coaching.** After each photo, a Claude call gently directs the next shot (wide frame, both vehicles, the intersection). The claimant becomes a professional investigator holding their own phone. This simultaneously builds the most defensible dossier in the category. Coaching contains zero legal evaluation. It is photographic direction only. `EvidenceCoachingShown`.
4. **The I heard you moment.** After voice capture, one Claude call returns a warm, plain-English structured summary of what happened, shown on a calm card with a confirm button and an add-something option. It reflects their own words back as organization, never as legal evaluation. It never says strong case. A court reporter, not a judge. The correction loop cleans the data. `PlaybackShown`, `PlaybackConfirmed`.
5. **Consent and HIPAA template.** TrustedForm certificate generated. Timestamped consent recorded. HIPAA authorization template pre-signed, firm name left blank until routing. `ConsentCaptured`, `TrustedFormCertified`, `HIPAATemplateSigned`.
6. **Basic intake validation.** Server-side check that the submission is complete and in a live market. This is a completeness gate, not a quality gate. It has nothing to do with SCPS. `IntakeValidated`.
7. **Protection plan.** A personalized plain-English plan generated from what they told you: keep every medical appointment, do not post about the accident, photograph bruising again in two days, exact word-for-word script if the adjuster calls. They walked in helpless. They walk out armed. `ProtectionPlanGenerated`.
8. **Living status page.** No black hole. The claimant returns to a page showing motion on their behalf. Status language is geographic and procedural only. `StatusViewed`.
9. **Speed callback loop.** Day-you-sign-firm-one feature. On delivery, the firm partner is notified and calls while the claimant is still on the confirmation screen. Twilio scaffolding built now, activated when a firm with a contractual callback SLA exists.

Nothing in this journey ever exposes SCPS, case value, or any evaluative signal. See W2.

---

## 7. Firm journey as a system flow

This is the B2B buyer side. This is who pays. The magic here is not emotion. It is the collapse of a trained skeptic's disbelief on contact with a real, worked-up, exclusive, pre-proven case.

1. **Proof before funding.** Before the firm commits a cent, they see redacted representative recent activity from their actual territory. This is what came through your market. PII redacted. Framed as representative recent activity, never as a volume guarantee. This is the single artifact that converts the first skeptic. Build the read API for it.
2. **Sample dossier and ACER math.** The firm holds a full-fidelity sample dossier and sees the cost-per-signed-case math in their own numbers against their Google Ads and shared-lead spend. Seeded honestly, never faked.
3. **Founding Partner agreement.** Geographic exclusivity, contractual callback SLA, fixed per-opportunity price by case type, and outcome-reporting plus case-study rights in exchange for pre-loaded wallet credit. Terms captured on the firm record.
4. **Wallet funding.** Firm funds the pre-funded wallet through Stripe. Top-up creates a ledger credit. `WalletFunded`.
5. **Dossier delivery as a closing kit.** When a dossier routes to their market, they receive it where they already live (phone, inbox, later their case management system), inside the Golden Window. It arrives as a case file: categorized photos, structured claimant statement, parsed police report, SCPS triage number, evidence severity per item, statute status, and the HIPAA authorization already executed in their firm name. The involuntary thought is: I could sign this on the first call. `DossierDelivered`.
6. **Auto-deduct.** On verified delivery, the wallet is debited the fixed fee for that case type and market, atomically, once. See Section 10. `WalletDebited`.
7. **The Glass Box.** The firm sees full sourcing trail, qualification steps, delivery timestamp, their own response time against SLA, and signed and declined outcomes, every dollar auditable. It shows the firm their own data and their own market. It never rates other firms and never implies CasePort vetted anyone.
8. **Outcome reporting and the feedback loop.** The firm reports signed, declined, settled, and value. This feeds SCPS recalibration and per-market intelligence. It never touches the fee. `OutcomeReported`, `SCPSRecalibrated`.
9. **Post-signing agents.** SLA watchdog (alerts on missed callback windows), decay interrupt (re-engages an unworked opportunity inside the decay curve), and the outcome-ingestion recalibration loop. Scaffold now, activate after firm one.

---

## 8. The routing engine

The most important compliance-bearing component in the system. Build it so that violating the Wall is impossible, not just prohibited.

`RoutingService.route(intake)` accepts an intake object exposing exactly two things: the resolved market (ZIP cluster) and the boolean validation result. It has no parameter, field, or closure access to SCPS, severity, or value. It resolves the single firm assigned to that protected market, produces a routing decision with `reason: geographic`, writes the audit record, and emits `GeographicRouteResolved`.

Every dossier that passes basic intake validation in a live market routes to that market's firm. SCPS does not gate which dossiers deliver. The firm receives everything valid in their territory and makes its own legal evaluation. SCPS is attached to the delivered dossier afterward, as firm-facing triage, so the partner can prioritize what they already received. Routing cause and triage data are two different things at two different times. Keep them physically separated in code.

Wallet-dry markets are a commercial hold, not a quality filter. If a firm's wallet cannot cover the opportunity at delivery time, the dossier holds in a delivery queue and the firm is alerted to top up. The claimant status remains received and pending firm contact. This is a policy decision to confirm with the founder before building. Do not silently drop or re-route.

---

## 9. SCPS and the 5LQS scoring engine

SCPS v1 is a firm-facing triage number expressed as a percentage. Factors, per the Data Standards: injury verification, liability clarity, statute of limitations status, case-type match, and firm response capacity. The 5LQS is the five-stage internal qualification view: valid contact, documented injury verification, liability assessment, statute check, and firm case-type and market match.

Version everything from v1. Every score records the model version that produced it. The Signed-Case Feedback Loop ingests firm-reported outcomes and recalibrates weights into v2. Wire the loop from day one even though it has nothing to learn from until the first cases close. The wiring is the moat. The data that flows through it later is the compounding advantage that cannot be bought.

SCPS lives entirely in the intelligence layer and the firm-only dossier fields. It is never a routing input (W1). It is never claimant-facing (W2). Enforce both in code.

---

## 10. The wallet system and auto-deduct

Life-critical. Correctness beats every other consideration here.

**Money-in.** Firms top up through Stripe. A successful top-up creates an append-only credit entry in `ledgerEntries` and updates the derived `wallets` snapshot. Funds move through Stripe. The authoritative balance is the sum of ledger entries in Mongo. Stripe is the rail, the ledger is the truth.

**The debit, atomically.** On verified `DossierDelivered`, run a single MongoDB multi-document ACID transaction that:

1. Looks up the fixed fee from the firm's price table by case type and market. Never derived from outcome (W3).
2. Reads the current balance from the ledger. If insufficient, aborts the transaction, holds the delivery in the queue, and fires a top-up alert. No partial state.
3. Writes an append-only debit entry keyed by an idempotency key derived from the delivery event id, protected by a unique index. A retry cannot double-charge.
4. Updates the derived wallet snapshot.
5. Records the delivery as billed.

If any step fails, the whole transaction rolls back. There is no state in which a dossier is delivered but the debit is ambiguous, and no state in which the same delivery is charged twice.

**Reconciliation.** A scheduled Inngest job reconciles the Mongo ledger against Stripe top-up records and flags any drift for human review. The ledger and the money rail must agree.

**Low balance.** A configurable threshold on the wallet fires a Resend and Twilio top-up prompt well before the wallet empties, so a Founding Partner never silently goes dark in their own market.

No manual invoicing exists anywhere in this system. The only ways money moves are Stripe top-ups in and fixed per-opportunity debits out. There is no code path for a discretionary charge.

---

## 11. Attribution: the Answer-to-Wallet Engine

Already introduced in Section 4, specified here as a build requirement. The tuple captured at first touch (source, keyword or surface, market, intake behavior, timestamps) is written immutably into `intakeSessions` and referenced by every downstream event through delivery, debit, and outcome. Build the query that, given a signed-case outcome, returns the exact originating tuple. That query is your intelligence product and your pricing engine's future input. If the tuple cannot be traced end to end, the attribution is broken and the moat is not real. Test the full trace.

---

## 12. Compliance guardrails as hard code rules

Restating the Wall as things a reviewer or a test can check.

- No claimant-serving endpoint serializes any field in the evaluative set (SCPS, 5LQS reasoning, severity, value, probability). Automated test required before intake ships.
- `RoutingService.route` signature exposes only market and validation boolean. No quality signal reachable. Type-enforced.
- Every fee lookup reads a fixed price table. No fee computed from an outcome field. Grep-clean.
- Every routing and delivery decision writes an audit record with `reason: geographic`.
- Every submission generates a TrustedForm certificate and a timestamped, versioned consent record.
- HIPAA authorization is firm-named only at routing. CasePort stores no medical records.
- Disclosure and disclaimer text is served from `disclosures` by jurisdiction, never hard-coded.
- Seven-year retention configured on consent, disclosure, routing, and audit collections.
- Florida routing does not exist in this build.

---

## 13. Build sequence: paste this to start, force the order

Read `CLAUDE.md` in full first. Then read the Manus prototype and map every data need on those screens. Then build in this order, stopping at each checkpoint for review. Do not proceed past a checkpoint without approval.

**Phase 0. The rails.** Repo, TypeScript strict, Payload v3, Mongo Atlas connection, the event log, the core collections from Section 5, field-level access control on the dossier audience split, and the compliance test harness from Section 12. No features yet. Checkpoint: prove the evaluative-field test fails a deliberately-wrong endpoint and passes a correct one.

**Phase 1. Claimant intake and dossier assembly.** Attribution capture, multimodal intake with Claude Vision and Deepgram, R2 storage with signed URLs, evidence coaching, the reflective playback, consent and TrustedForm, HIPAA template, basic validation, protection plan, living status page. Seed data, no firm yet. Checkpoint: a full intake produces an assembled dossier with the audience split intact and the tuple recorded, and no claimant route can leak an evaluative field.

**Phase 2. Firms, wallets, and the Glass Box read side.** Firm records with price tables and SLA terms, Stripe top-up creating ledger credit, the derived wallet snapshot, the proof-of-reality redacted feed API, the sample dossier API, and the Glass Box read endpoints. Checkpoint: a firm funds a wallet, the ledger and snapshot agree, and the Glass Box serves only that firm's own data.

**Phase 3. Routing, delivery, and auto-deduct.** The geographic-only RoutingService, dossier delivery as a closing kit with SCPS attached as firm-facing triage, the ACID debit with idempotency, the wallet-dry hold queue, and reconciliation. This is the money-moving slice. Checkpoint: a delivery debits exactly once under forced retries, an insufficient wallet holds cleanly with no partial state, and every routing record reads geographic.

**Phase 4. Outcome loop and SCPS recalibration.** Outcome reporting, the Signed-Case Feedback Loop wiring, SCPS versioning, and the ACER metric once its definition is locked. Checkpoint: an outcome recalibrates a versioned score without touching any fee, and the full attribution trace from signed case back to originating tuple returns correctly.

**Phase 5. Agents and the speed loop.** SLA watchdog, decay interrupt, and the Twilio speed callback scaffolding, all activated at firm one. Checkpoint: scaffolding is testable in a dry run without a live firm.

Work in vertical slices. Each phase ends in something that runs and is reviewable. Never leave a phase half-built to start the next.

---

## 14. Definition of done and the quality bar

Every deliverable passes the "glad I got this" test. Specifically for this backend:

- ACID correctness on every wallet mutation, proven under forced retries and concurrent access.
- Idempotency proven: the same delivery event cannot double-charge or double-deliver.
- The evaluative-field leak test passes and is in CI.
- The full attribution trace returns end to end.
- Every routing decision is audit-recorded as geographic.
- No em dashes anywhere in code comments, docs, seed copy, or claimant-facing text. Periods, commas, colons only.
- Personal injury is spelled out in full in every claimant-facing and SEO-relevant field. Never abbreviated.
- The system reads as institutional. It never reads as a rookie's first project. Perceived value is highest without a single false claim.

Ask before every merge: is this excellent, is this world class, would Apple ship this. If not, it does not merge.

---

## 15. Before you write code, confirm these with the founder

1. **ACER definition.** It is defined three ways across the source documents (Average Case Economic Return, Case Acquisition Efficiency Ratio as signed over delivered, and Acquisition Cost Efficiency Ratio as true cost per signed case). Lock one. The Glass Box math depends on it.
2. **Wallet-dry market policy.** Confirm the hold-queue behavior in Section 8 versus any alternative. Single-firm exclusivity means there is no backup firm, so this edge case needs an explicit decision.
3. **Per-opportunity price table.** Confirm the fixed prices by case type and by launch market (Virginia, Maryland, DC, Georgia).
4. **The Manus prototype.** Share both dashboards so the API contract serves the existing screens exactly rather than inventing a contract they cannot consume.

Do not begin Phase 0 until items 1 through 4 are answered.

---

One backend. Two magics. Protect the operational truth at the center and both hold. The Wall is the architecture. Money moves correctly or not at all.

---

## Appendix. Current codebase reference

The pre-existing description of the current repository (commands, current Payload collections, frontend routes, and established patterns) is preserved at `docs/CODEBASE_MAP.md`. It documents the state of the repo as it exists today. Where the current stack diverges from Section 3 of this doctrine (for example, Vercel Blob today versus Cloudflare R2 in the locked stack, or the Mongoose adapter versus MongoDB Atlas transactions), this doctrine is the target and the codebase map is the starting point. This doctrine wins on any conflict.
