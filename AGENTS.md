# CasePort Agentic Architecture Doctrine

Version 1.0. Internal. Companion to the CasePort Backend Master Prompt. Save this as `AGENTS.md` at the repository root. Claude Code reads both `CLAUDE.md` and this file every session. Where they overlap, the Wall in `CLAUDE.md` governs.

---

## 0. Purpose

This document defines where agentic capability belongs in CasePort, where it is forbidden, and how every agent is built so it stays bounded, auditable, and compliant. The count of agents is a vanity metric, exactly like a 10,000-page content target. One agent that makes the dossier undeniable beats ten that decorate the funnel. Build only the agents specified here, in the order specified here, and give the flagship agent attention out of proportion to the rest.

---

## 1. The decision rule: agent, workflow, or deterministic code

Apply this rule before writing anything. Most tasks that people call agentic should not be agents.

Build a **true agent** (an observe, decide, act, repeat loop toward a goal) only when all four are true:

1. Open-ended: the next correct action depends on what previous actions revealed and cannot be fully enumerated in advance.
2. Recurring: it happens often enough to justify the complexity and the eval burden.
3. Recoverable: a wrong action can be caught, corrected, or reversed without irreversible harm and without any compliance breach.
4. Boundable: the entire action space can be reduced to a small allowlist of safe, audited domain services.

Build a **durable workflow with agentic sub-steps** (a fixed sequence where individual steps use model inference) when the goal and the steps are known but the content of each step varies. Retryability and observability matter more than autonomy here.

Build **deterministic code** when the input is bounded and the output must be consistent. If the task needs reproducibility and audit (scoring), use a versioned narrow inference call that records its model version and inputs, not an agent.

If a task decides which firm receives a case, it is **forbidden** from being an agent. See Section 2. This is not a judgment call.

State which of the three patterns you are using at the top of every module, and why, referencing this rule.

---

## 2. The forbidden zone: routing and scoring are never agentic

Two components must never be agents, and this is non-negotiable.

**Routing.** `RoutingService` decides which firm receives a dossier. If an agent makes that decision, CasePort is analyzing a legal problem to determine which lawyer receives the referral, which is the exact conduct that produced state bar findings against Avvo in five jurisdictions. Routing stays deterministic and geographic only, forever. Its inputs are market and a validation boolean. Nothing else is reachable. See Wall rule W1.

**Scoring.** SCPS must be reproducible and versioned so the Signed-Case Feedback Loop can trust its own history and so any output is auditable. An agentic score you cannot reproduce is a moat you cannot defend and an audit you cannot pass. SCPS is a versioned, deterministic-given-version inference that records model version and exact inputs on every score. It is computed after routing, firm-facing only, and never a routing input. See Wall rules W1 and W2.

Do not make either of these clever. Their value is that they are boring and provable.

---

## 3. How every agent is built in this codebase

These rules apply to every agent and workflow without exception.

- **The action space is the domain service layer.** No agent has raw database, external API, filesystem, or network access. An agent acts only by calling IntakeService, QualificationService, DossierService, WalletService, ComplianceService, OutcomeService, IntelligenceService, or ProspectingService. This makes an agent's capability equal to a small, audited, testable set of functions. This is the primary safety mechanism.
- **Every agent action emits an event.** Agent behavior is appended to the event log and fully replayable. There is no agent action that is not recorded.
- **Every agent is bounded.** A declared per-agent tool allowlist, a maximum step count, and a timeout. No open-ended tool access. No agent that can call anything.
- **Every agent runs inside an Inngest durable function.** Steps are persisted, retryable, and observable. A crash mid-run resumes, it does not corrupt state.
- **Human-in-the-loop is mandatory for three things:** sending any B2B outreach, promoting any SCPS model version, and any irreversible money movement. Agents draft and propose. Humans approve these three.
- **No agent output on a claimant-facing surface contains evaluative data.** SCPS, severity, value, probability, or 5LQS reasoning never reach a claimant through any agent. Tested, not trusted.
- **Every agent ships with an eval harness.** Golden cases, adversarial cases, and compliance regression cases. The evidence agent's adversarial suite specifically tries to make it emit legal evaluation and must fail every attempt. No agent merges without its eval harness green in CI.
- **Every agent run is observable and budgeted.** Traced in PostHog and the event log, with a token and cost ceiling per run.

---

## 4. The agent roster

Each card is a build spec. Follow the phase gating.

### 4.1 Evidence and Intake Coaching Agent (flagship, build first)

**Pattern:** True agent. Every accident differs, so the next best photo or question depends on what has already been captured. Cannot be scripted.

**Why it matters:** This is the single highest-value place in the system. It makes the injured person feel received while quietly assembling the most defensible dossier in the category. One backend, two magics. A form-based competitor structurally cannot copy it. This agent is the painkiller.

**Trigger:** After each capture event during intake (photo uploaded, voice segment captured, document added).

**Inputs:** Current capture inventory and what Claude Vision and Deepgram extracted. Never any legal evaluation.

**Tools (via IntakeService only):** Read captured-media metadata, call Claude Vision for gap analysis, return the next capture direction, generate the reflective playback summary, generate the protection plan.

**Hard boundaries:** Photographic and factual direction only. Zero legal evaluation. Never says strong case, never estimates value, never mentions SCPS or probability. A court reporter, not a judge. It cannot see or emit any evaluative field. Its entire vocabulary is procedural: the wide shot, both vehicles in frame, the second angle, the follow-up detail.

**Compliance spine:** Wall W2 and W6. Reflective playback reflects the claimant's own words back as organization, never as legal assessment.

**Success criteria:** Dossier completeness improves (firm-facing metric), claimant completion rate improves, and the adversarial eval suite proves zero evaluative language leaks under provocation.

**Phase:** Now. Phase 1.

### 4.2 Dossier Assembly Orchestrator

**Pattern:** Durable workflow with agentic sub-steps, not a true agent. The goal and the steps are known. Only the content of each step varies. Determinism and retryability beat autonomy here.

**Sequence:** Parse police report, transcribe and structure the claimant statement, categorize photos, extract insurance card fields, resolve statute status, compute SCPS as firm-facing triage, assemble the firm-facing package, and populate the HIPAA authorization with the firm name at routing.

**Tools:** DossierService, QualificationService, ComplianceService.

**Hard boundaries:** SCPS computed in this workflow is attached to the dossier after routing, as firm-facing triage. It is never a routing input. The HIPAA authorization is named only at routing, and CasePort never stores medical records.

**Success criteria:** Idempotent assembly, clean audience split (claimant-safe versus firm-only fields), full attribution tuple carried through.

**Phase:** Now. Phases 1 through 3.

### 4.3 B2B Prospecting and Proof-of-Reality Agent

**Pattern:** True agent. Research is open-ended.

**Why it matters:** This is the only agentic work that moves the binding constraint, which is signing Founding Partner one. It cannot close the first skeptic, a human does that, but it manufactures the personalized proof at scale that makes the human close land. It deserves attention out of proportion to its glamour.

**Trigger:** Manual (a target firm is named) or list-driven from a target set.

**Inputs:** Target firm and its market.

**Tools (via ProspectingService):** Clay enrichment, web research on the firm and partner, pull the redacted representative recent activity for that market (the proof-of-reality read API), and draft the personalized outreach.

**Hard boundaries:** It drafts, a human sends (Section 3). It cannot make any claim that violates Rule 7.1: no guarantees, no unjustified expectations, no promised outcomes. Proof-of-reality is representative recent activity with claimant PII redacted, framed as what came through the market, never as a volume guarantee.

**Compliance spine:** Rule 7.1 truthful and non-misleading. PII redaction enforced on any market activity surfaced.

**Success criteria:** Accurate, personalized, compliant drafts. Higher reply rate. Zero non-compliant claims in the adversarial eval.

**Phase:** Now. It moves the bottleneck.

### 4.4 Abandoned Intake Recovery Agent

**Pattern:** Light true agent. It decides timing, channel, and message to re-engage a half-finished intake.

**Trigger:** An intake session goes stale past a threshold with no completion.

**Tools:** IntakeService (resume link generation), Resend, Twilio, read session state.

**Hard boundaries:** Claimant-initiated flow only. It re-engages a claimant who already started an intake. It never cold-contacts anyone. It sends only on a channel where consent is already captured. No legal evaluation in any message.

**Compliance spine:** ABA Formal Opinion 501 forbids proactively contacting claimants who did not initiate contact. This agent only touches sessions the claimant started. TCPA consent gates every channel.

**Success criteria:** Recovered completion rate, zero contact to non-initiators, consent verified before every send.

**Phase:** Now, claimant side.

### 4.5 SLA Watchdog and Decay Interrupt

**Pattern:** SLA Watchdog is mostly deterministic monitoring with alerting and light agency in the escalation decision. Decay Interrupt is a light agent deciding the nudge inside the decay curve.

**Trigger:** SLA Watchdog runs on delivery-to-response timing against the firm's contractual SLA. Decay Interrupt runs when a delivered opportunity sits unworked inside the decay window.

**Tools:** Read delivery and response records, OutcomeService, Twilio, Resend, alerting.

**Hard boundaries:** These act on firm behavior, never on the claimant. Neither ever re-routes, because single-firm-per-market means there is no backup firm. They alert and nudge only.

**Compliance spine:** Firm-facing operations only. No claimant contact.

**Phase:** Gated. Both require a signed firm with an SLA. Scaffold now, activate at firm one.

### 4.6 Compounding Intelligence and SCPS Recalibration Agent

**Pattern:** Proposal agent, not autonomous in production. It reads the Signed-Case Feedback Loop, proposes recalibrated weights for the next SCPS version, and updates attribution intelligence.

**Hard boundaries:** It proposes a new SCPS version. A human promotes it (Section 3). A scorer that silently rewrites itself breaks auditability and the trust the feedback loop depends on. Every proposed version records the outcome data it learned from.

**Compliance spine:** SCPS stays firm-facing and versioned. Recalibration never touches any fee. Outcome data flows only into intelligence, never into billing.

**Phase:** Wire the loop now. Activate the brain after the first cases close, because it has nothing to learn from until then. This is the long-term moat, not an early feature.

### 4.7 Internal Operations MCP (Layer 1)

**Pattern:** A natural-language operations wrapper over the domain services, so two people can run the business in language instead of clicking dashboards.

**Design note:** The domain services are the MCP tools. This is the payoff for designing every service as MCP-ready from day one in the master prompt. Do not build a separate tool layer. Expose the services that already exist.

**Hard boundaries:** The MCP inherits every service access control and every Wall rule. No tool mutates a wallet outside an ACID transaction. No tool exposes evaluative data on a claimant surface. No tool routes on anything but geography.

**Phase:** Build the MCP after the core is proven, but the service-as-tool discipline that enables it happens now.

### 4.8 Firm-facing MCP (Layer 2)

**Pattern:** CasePort intelligence embedded inside a firm's own AI workflows.

**Phase:** After Founding Partner one. Out of scope until then.

---

## 5. Build order

Ordered by impact against the binding constraint and by what is safe to build before a firm exists.

1. **Now, Phase 1:** Evidence and Intake Coaching Agent. Dossier Assembly Orchestrator. Abandoned Intake Recovery Agent.
2. **Now, parallel:** B2B Prospecting and Proof-of-Reality Agent, because it moves the bottleneck of signing firm one.
3. **Wire now, activate at firm one:** SLA Watchdog and Decay Interrupt scaffolding. The speed callback loop hooks in here.
4. **Wire now, activate after first cases close:** Compounding Intelligence and SCPS Recalibration proposal agent.
5. **After core is proven:** Internal Operations MCP.
6. **After firm one:** Firm-facing MCP.

Do not build ahead of this order. Every agent above the line you have reached should be shippable and evaluated before the next begins.

---

## 6. Definition of done for any agent

- The pattern (agent, workflow, or deterministic) is declared and justified against the Section 1 rule.
- The action space is domain services only. No raw access anywhere.
- Every action emits an event and is replayable.
- Bounded: tool allowlist, step cap, timeout declared.
- Runs inside an Inngest durable function.
- Human-in-the-loop enforced where Section 3 requires it.
- Eval harness green in CI, including the compliance adversarial suite.
- Observable and cost-budgeted per run.
- Nothing it produces violates the Wall.

One agent that makes the dossier undeniable is worth more than ten that decorate the funnel. Build the coaching agent, the assembly pipeline, and the prospecting agent first. Everything else waits for the case that proves the loop.

---

## Appendix. Payload CMS engineering rules

The Payload CMS v3 development ruleset (access control, transaction safety, hooks, components, query patterns) that previously lived in this file is preserved verbatim at `docs/PAYLOAD_RULES.md`. It is the mechanical how-to for working in this Payload codebase. This doctrine governs where agentic capability belongs; `docs/PAYLOAD_RULES.md` governs how the Payload primitives are used safely. Read both. On any conflict about agent boundaries or the Wall, this doctrine and `CLAUDE.md` win.
