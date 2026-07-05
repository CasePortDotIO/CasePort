# Prototype to Backend Contract Map

Source: the two Manus prototypes (law firm dashboard and internal/operator dashboard) provided by the founder. This document maps every screen's data need onto the Section 5 collections and the Section 4 domain-service layer, and it reconciles the prototype against The Wall (Section 2). Where the prototype conflicts with the doctrine, the doctrine wins and the conflict is logged here for a founder decision.

Method: two read-only inventory passes over `prototype/lawfirm` and `prototype/internal`. Both prototypes render almost entirely from in-component mock data and in-memory engines. Only auth, scheduled reports, and a notifications router are persisted. So the component prop shapes, not the stub database, are the real UI contract.

---

## 1. The market-model fork (the one architectural decision that gates everything)

The prototype is built on a multi-firm competitive market. The doctrine is built on single-firm geographic exclusivity.

Prototype evidence:
- Internal `markets` show `slots` like `3/3` and statuses `FULL / LIMITED / OPEN / WAITLIST`. Multiple firms per market.
- Firm dashboard shows `Market Rank #8 of 156`, a full leaderboard of competing firms, percentiles, gamification, and copy such as "Top 5 firms receive priority premium cases" and "Firms with 90%+ reporting completeness receive priority routing."

Doctrine position (W1, W8, Section 8):
- Routing is geographic only. A protected market resolves to exactly one firm.
- Quality, rank, reporting completeness, and score can never influence which firm receives a dossier. "Priority routing" for high performers is a direct W1 violation and cannot ship.
- A future multi-firm market type is an explicit seam (Florida's four-firm panel is deferred).

Recommended reconciliation (pending founder confirmation, see D5 in DECISIONS.md):
- Launch markets (Virginia, Maryland, Washington DC, Georgia) are single-firm protected markets. One firm per market. `Markets.marketType = 'single-firm-exclusive'`, with a reserved `'multi-firm-panel'` value left unbuilt.
- The leaderboard and rank become national and cross-market vanity metrics only (you are one of N CasePort founding partners nationally). They carry zero routing consequence. This keeps the Bloomberg-terminal competitive texture the founder wants without violating W1.
- "Priority routing" and "priority premium cases" copy is removed. Reporting completeness can gate nothing about routing. It may remain a displayed health metric.
- Internal `slots N/M` becomes `slot 1/1` for single-firm markets, or is replaced by a simple `assigned / open / on-hold` state.

---

## 2. Wall reconciliations applied to the prototype

These are compliance corrections the backend enforces regardless of the prototype. They are not optional and are not founder decisions.

1. Audience split (W2). The prototype co-mingles evaluative data and claimant PII in single payloads (internal QualifyQueue and OpportunityPanel; firm Opportunities list renders Value and Risk columns inline). The backend splits every dossier into a claimant-safe projection and a firm-only evaluative projection, enforced by Payload field-level access, not by convention. The same case object can never serialize its evaluative half to a claimant surface.

2. Evaluative set is firm-only (W2). The following prototype fields are the SCPS-analogues and are firm-facing only, never claimant-facing, never in a claimant log: `qualificationScore`, `qualificationTier`, `qualificationBreakdown` (layers Signal Integrity, Geographic Fit, Case Viability, Contactability, Buyer Fit), `tier` (A/B/C/D and platinum/gold/silver/bronze), `qualityScore`, `estimatedValue` / case value / settlement range, `conversionProbability` and every "% likely to convert" string, `Case Fit Score`, `Response Score`, injury severity, liability assessment, insurance limits, churn risk, LTV / CAC / ROI / cost-per-case.

3. Routing is geographic only (W1). No routing algorithm exists in the prototype (firms are pre-assigned in mock data). The backend defines `RoutingService.route(intake)` from scratch with a signature that exposes only the resolved market and the validation boolean. No score, value, or severity is reachable. Every routing record carries `reason: geographic`.

4. Server-side redaction (W2, W7). The prototype masks a phone number as a display string only; the stub database stores full PII unmasked. The backend enforces masking and field-level redaction server-side. Claimant PII lives in the access-controlled `claimants` collection and is referenced, not duplicated, into projections.

5. Fee is fixed and outcome-independent (W3, W4). The prototype ties incentives to performance ("10% wallet bonus for top 5", "priority premium cases"). No fee or credit may be a function of case outcome, settlement, or signing. Wallet debit is a fixed lookup by case type and market. Top-up bonus credit, if kept, is a volume incentive on money-in only and is never tied to a case result. Confirm any bonus with the founder against W3.

6. Value-reveal-on-accept is a server rule. The firm dashboard reveals exact case value only after the firm accepts (range `0.6x` to `1.4x` before, exact after). This is a legitimate firm-side product rule and is enforced server-side, not just in the client. It is entirely inside the firm-only projection and never touches a claimant surface.

7. Auth. In the internal prototype every read except the audit trail is an unauthenticated public procedure, including reads that return PII and evaluative scores. The backend gates every read behind authenticated, role-scoped, firm-scoped access. A firm sees only its own data (the Glass Box shows the firm its own market and its own numbers, never another firm's).

## 3. Quality-bar flags (Section 14, "not a single false claim")

The prototype contains manipulative patterns and likely fabricated statistics that conflict with the institutional, no-false-claims quality bar. Flagged for founder review, not built as-is:
- `CompulsiveCheckingDashboard` copy "Firms who check 15+ times daily see 3.2x higher conversion" is an unsourced claim.
- `InvestmentLayer` computes a "switching cost" and sunk-capital framing designed to trap the firm.
- Gamification streaks and dark-pattern urgency.

Recommendation: keep the dense, real-time, auditable Bloomberg-terminal texture. Remove fabricated stats and coercive framing. Every number on every panel must trace to a real event.

---

## 4. Screen to collection to service map

Legend for collections is Section 5 of the doctrine. Services are Section 4.

### 4.1 Internal / operator dashboard

| Screen | Primary data need | Collections | Services |
| ------ | ----------------- | ----------- | -------- |
| Command Centre (live opportunity queue, alerts, SLA countdowns) | opportunity id, type, market, status, assigned firm, time since alert, live SLA remaining; metric singleton (activeOpps, atRisk, slaBreaches1h, recoveryRunning, openDisputes, overdueFeedback) | `dossiers`, `deliveries`, `markets`, `firms`, `events`, `auditLog` | DossierService, RoutingService, ComplianceService |
| Qualify Queue (manual review approve/reject) | opportunity plus qualification breakdown, claimant data, flags | `dossiers` (firm-only projection), `scpsScores`, `claimants`, `events` | QualificationService, DossierService |
| Opportunity Panel (slide-over detail) | full opportunity, claimant data, qualification breakdown, flags | `dossiers`, `claimants`, `scpsScores`, `auditLog` | DossierService, ComplianceService |
| SLA Watch (breach war room) | breaching delivery, alert sent, ack received, first touch verified, hold expiry; 7-day compliance, recent SLA events | `deliveries`, `firms` (SLA terms), `events`, `auditLog` | Delivery/DossierService, OutcomeService |
| SOL Monitor (statute of limitations) | per-case type, incident date, SOL deadline, days left, alerts sent, next alert | `dossiers` (statute status is firm-only), `events` | ComplianceService, IntelligenceService |
| Market Health Board | per market: status, slots, 7d volume, avg score, SLA compliance, signed rate, next SOL | `markets`, `deliveries`, `outcomes`, `scpsScores` (aggregate) | IntelligenceService |
| Firm Health Board and Firm Health Scores | firm name, status, markets, wallet balance, response and reporting scores, signed rate, last delivery, at-risk count, flags, sentiment, churn risk, next review | `firms`, `wallets`, `ledgerEntries`, `deliveries`, `outcomes` | WalletService, IntelligenceService, OutcomeService |
| Market Intelligence | per market: slots, available, utilization, volume, avg value, competitor activity, trend, price index | `markets`, `dossiers` (aggregate), `outcomes` | IntelligenceService |
| Conversion Funnel | leads, qualified, contacted, reviewing, signed; per-market breakdown | `events` (funnel is a projection of the event log), `outcomes` | IntelligenceService |
| Operator Performance | per operator: cases, conversion, avg close time, SLA compliance, revenue | operators (new internal collection, see 5.2), `deliveries`, `outcomes` | IntelligenceService |
| Revenue and Billing | this month, this year, projected, wallet funded, utilization, retention, pending payments, avg contract value, churn | `ledgerEntries`, `wallets`, `firms` | WalletService, IntelligenceService |
| Workflows (Inngest status) | workflow name, type, status, last run, next run, 24h errors | operational, from Inngest, mirrored to `events` | (infra) |
| Audit Trail | action, entity, entity id, actor, timestamp, details | `auditLog`, `events` | ComplianceService |
| Disputes | case id, firm, status, days open, amount, reason, priority | disputes (new internal collection, see 5.2), `deliveries` | OutcomeService |

### 4.2 Law firm / partner dashboard

| Screen | Primary data need | Collections | Services |
| ------ | ----------------- | ----------- | -------- |
| Dashboard (World Class, Institutional, base) | current balance, delivered this month, signed cases, response score, market rank, reporting completeness, SOL alerts, recent opportunities table | `wallets`, `ledgerEntries`, `deliveries`, `outcomes`, `dossiers` (firm projection), `scpsScores` | WalletService, DossierService, OutcomeService, IntelligenceService |
| Opportunities list | id, case type, received, response time, status, outcome, value, risk, conversion probability | `dossiers` (firm-only projection), `deliveries`, `scpsScores` | DossierService |
| Opportunity Detail (Production, Excellent, Enhanced) | case profile, SOL, submit outcome with reason codes, response performance vs benchmark, intake intelligence (injury type, damages, liability, insurance), timeline, dispute | `dossiers`, `hipaaAuthorizations`, `deliveries`, `outcomes`, `scpsScores`, `auditLog`, `events` | DossierService, OutcomeService, ComplianceService |
| Wallet (Enhanced, replenishment widget) | current balance, on hold, ledger (date, description, type, amount, balance), auto top-up, payment methods, recent top-ups | `wallets`, `ledgerEntries`, `firms` | WalletService |
| Outcome Feedback | overdue, pending, completed outcomes; submit outcome; reason codes; reporting completeness | `outcomes`, `deliveries`, `dossiers`, `events` | OutcomeService |
| Case Feedback Loop | rate lead quality 1-5 plus text; conversion stats | `outcomes`, `scpsScores` (feeds recalibration) | OutcomeService, IntelligenceService |
| Analytics, Revenue Analytics, Performance | LTV, CAC, ROI, cost per case, conversion funnel, cohort retention, channel attribution, response-time trend, signed-case rate, market rank | `ledgerEntries`, `deliveries`, `outcomes`, `intakeSessions` (attribution), `events` | IntelligenceService, WalletService |
| Competitive Positioning, Benchmarking, Leaderboard | rank, percentile, gaps vs target, benchmark metrics, leaderboard entries (names maskable) | `firms`, `outcomes`, `deliveries` (national aggregate) | IntelligenceService |
| Audit Trail Viewer (Glass Box) | timestamped entries, actor, action, resource, field-level from and to diffs, IP, CSV export | `auditLog`, `events` | ComplianceService |
| Activity Feed, Collaboration, Notifications, Gamification | per-case activity, comments and mentions, notifications, badges and streaks | `events`, notifications, plus optional collaboration collections | (product) |

---

## 5. Data model deltas against Section 5

### 5.1 Confirmed by the prototype (already in Section 5)
`dossiers` (audience split confirmed necessary), `firms` (price table, SLA terms, founding partner flag, plus health and reporting scores as intelligence), `markets` (add `marketType` and `slots`), `wallets` and `ledgerEntries` (the prototype's Wallet ledger with types Delivery, Hold Placed, Top-Up maps directly), `deliveries` (delivery timestamp, firm response timestamp, response time vs SLA), `outcomes` (retained, not-retained with reason codes NR-001..NR-005, still evaluating, settled, value), `scpsScores` (versioned; the 5-layer model is the v1 factor set), `consents`, `hipaaAuthorizations`, `disclosures`, `auditLog`, `events`, `intakeSessions` (attribution tuple; the prototype's channel attribution and case `source` confirm the need).

### 5.2 New collections the prototype requires (internal, firm-scoped)
- `operators` internal staff who work the queue (name, role, status, and derived performance which lives in intelligence).
- `disputes` case id, firm, status (Open, In Review, Resolved), reason, amount, priority, days open, resolution.
- `notifications` per recipient (firm user or operator) typed messages; the prototype defines `opportunity, rank_change, wallet_update, case_accepted, case_rejected` for firms and operational alerts for internal.

### 5.3 Field-name reconciliations
- Case type. Two prototype systems: internal `Auto, Slip, Medical, Other` and firm `Auto Accident, Slip and Fall, Workers Comp, Medical Malpractice, Product Liability, Wrongful Death, Premises Liability`. The price table implies the fuller list. Pending founder confirmation (open item, DECISIONS.md D3 and the enum question).
- Tier. Internal `A/B/C/D`, firm `platinum/gold/silver/bronze`. These are two skins of the same firm-only triage tier. Pick one canonical internal representation and map for display. All firm-only.
- Score enums differ (`A|B|C|-` vs `A|B|C|D`). Reconcile to one before exposing.

### 5.4 Not modeled yet but implied
- Lead sourcing and vendor provenance for the Glass Box. The prototype shows marketing channel `source` only. If the Glass Box must show the firm where a case originated, the attribution tuple in `intakeSessions` supplies it, but confirm the firm-facing depth of the sourcing view.

---

## 6. Domain-service API contract (first cut)

All business logic is behind these services (Section 4). Routes, Payload hooks, and Inngest functions call services and never touch the database directly for business operations. Each is shaped to become an MCP tool later.

- IntakeService. `beginIntake(attributionTuple)`, `attachMedia`, `recordVoice`, `runVisionParse`, `runTranscription`, `capturePlayback`, `confirmPlayback`, `captureConsent`, `signHipaaTemplate`, `validateIntake`. Emits the Section 6 events. Produces the claimant-safe side of the dossier and the raw material for the firm-only side.
- QualificationService. `computeScps(dossierId, modelVersion)`, `runFiveLayer(dossierId)`. Writes versioned `scpsScores`. Firm-only. Never a routing input.
- RoutingService. `route({ market, validationPassed })`. Geographic only. Resolves the single market firm, writes the audit record with `reason: geographic`, emits `GeographicRouteResolved`. No evaluative input reachable.
- DossierService. `assemble(dossierId)`, `firmProjection(dossierId, firmId)`, `claimantProjection(dossierId)`. The two projections are the enforced audience split.
- WalletService. `topUp(firmId, amount, stripeRef)` writes a credit ledger entry. `debitForDelivery(deliveryEventId)` runs the Section 10 ACID transaction with idempotency. `balance(firmId)` sums the ledger. `snapshot(firmId)` rebuilds the derived wallet. Reconciliation job compares ledger to Stripe.
- ComplianceService. `serveDisclosure(jurisdiction)`, `assertNoEvaluativeLeak(payload)`, `writeAudit(decision)`, `retentionPolicy`. Backs the automated evaluative-field leak test.
- OutcomeService. `reportOutcome(deliveryId, result, reasonCode?, value?)`. Feeds intelligence only. Never billing. Emits `OutcomeReported`.
- IntelligenceService. Derived and recomputable. `marketHealth`, `firmHealth`, `conversionFunnel`, `acer(firmId, period)` where ACER is true cost per signed case per D1, `benchmark`, `leaderboard`, `attributionTrace(outcomeId)` which returns the originating tuple end to end.

---

## 7. Open decisions this map surfaces

1. D5 market model. Single-firm exclusivity for launch, with leaderboard and rank as national no-consequence metrics, and "priority routing" removed. Recommended and pending founder confirmation.
2. D3 price table and case-type enum set. Still open.
3. Quality-bar cleanup. Remove fabricated stats and coercive framing, keep the dense auditable terminal texture. Pending founder direction.
4. Glass Box sourcing depth. How much of the attribution tuple is shown to the firm. Pending.
