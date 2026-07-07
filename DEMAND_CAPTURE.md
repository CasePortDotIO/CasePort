# CasePort Demand Capture Engine: Claude Code Super Prompt

Version 1.0. Internal. This builds the Demand Capture Engine, the reach layer that makes CasePort the answer already waiting wherever an injured person expresses intent (B2C) and wherever a personal injury partner forms a vendor opinion (B2B). It is a companion to `CLAUDE.md`, `AGENTS.md`, and `INTELLIGENCE_CORE.md`. Claude Code reads all four. Where they touch, the Wall in `CLAUDE.md` governs. Save this as `DEMAND_CAPTURE.md` at the repository root.

The Intelligence Core aims. This engine captures. It reads the CIC to know where to point, and it feeds the CIC the attribution data that tells the CIC what actually converted. The two are one flywheel.

---

## 1. Mission and the one distinction that decides everything

This is demand harvesting, never demand interception. Understand the difference before writing a line, because one branch of it is a felony.

**Forbidden, never build:** an engine that scrapes crash reports, police blotters, DMV data, hospital chatter, or social posts to reach out to injured people. Sourcing accident data to solicit victims violates the Driver's Privacy Protection Act and is barratry, criminal ambulance-chasing, in several states. Proactively contacting claimants is the exact conduct ABA Formal Opinion 501 targets. Your single cleanest compliance fact is that the claimant volunteers. An outbound-to-claimant engine detonates that on day one.

**What this engine is:** it makes CasePort the best, most citable, most compliant answer already present at every surface where an injured person is expressing intent in their own words, so that person self-initiates contact. Same fish, opposite mechanism. You do not swim to the fish and grab them. You become the thing already in the water at the exact spot they are already swimming.

The one-line definition of done: when someone types or speaks a high-intent personal injury question in a funded market, on search, on an AI answer engine, on a question platform, or by voice, CasePort is the answer they find, and it routes them to self-initiate. And when a five million dollar personal injury partner evaluates whether to trust a new vendor, CasePort is the authority they keep encountering, and the precise proof they receive when contacted.

---

## 2. The hard lines

These are absolute. Breaking any one rebuilds the forbidden engine wearing a friendly mask.

**HL1. B2C is inbound only.** No outbound contact to any injured person, ever. No accident-report, DMV, crash-data, or social-post sourcing to solicit. The claimant always initiates.

**HL2. No sockpuppets, anywhere.** Every identity-based surface (Quora, question platforms, communities, Reddit) uses a real named identity with real CasePort credentials. No AI posing as a human. No fake accounts. Your buyer is a skeptical lawyer watching your brand. Fake accounts are both a platform violation and brand suicide with that audience.

**HL3. Funded-market scoping for B2C capture.** The engine harvests claimant demand only in markets where a firm is funded to receive it. A perfect lead in an uncovered market is worth zero and has nowhere compliant to land. This is a feature. It keeps you out of the vanity-volume trap.

**HL4. Human publishes anything under a real identity.** The engine drafts. A human posts. Agents produce assets and outreach. Martha or a principal publishes anything that carries a real name. Human-in-the-loop on identity surfaces and on all B2B outbound sends.

**HL5. No legal advice, no evaluative language, on any public surface.** Every legal answer carries the disclaimer. Nothing implies CasePort selects, recommends, matches on merit, or that a firm is approved, vetted, or qualified. SCPS, case value, and probability never appear publicly. See Wall W2 and W6. The author is not a lawyer, and content is educational.

**HL6. B2B outbound is permitted and must be Rule 7.1 clean.** Firms are not protected the way claimants are, so outbound to firms is normal B2B sales. But it makes no guarantees, creates no unjustified expectations, and promises no outcomes. Proof-of-reality is representative recent activity with claimant PII redacted, never a volume guarantee.

**HL7. Standards apply to every produced asset.** Personal injury spelled out in full. No em dashes. ABA compliance disclaimer on every intake CTA. Coined terms stated as CasePort originals. Defensible-data-cell logic, never vanity volume, because mass publishing damages answer-engine authority.

---

## 3. Architecture

Apply the `AGENTS.md` decision rule to every component.

- **Sensing and scoring is agentic.** Continuously reading surfaces for emerging intent clusters and unowned high-intent questions, and deciding what is worth pursuing, is open-ended and is a true agent use case.
- **Asset and outreach drafting is agentic sub-steps, human-published.** See HL4.
- **Placement is deterministic.** Schema, `llms.txt`, direct-answer structure, and entity consistency are code, not judgment.
- **Distribution and scheduling is durable workflows.** Inngest, retryable, observable.
- **The action space is the domain service layer, the internal ops MCP, and a declared surface allowlist.** No raw access beyond the allowlist. Every action emits an event and is replayable. Every sub-agent is bounded by tool allowlist, step cap, timeout, and cost budget.

**Coupling with the Intelligence Core.** The engine reads the CIC to know which cells, markets, and questions to pursue, and writes back, through the attribution tuple, which surface, phrasing, market, and question actually produced a completed intake and a signed case. The CIC reallocates the engine's effort toward what converts. Neither is useful without the other.

The engine runs one loop: sense, score, produce, place, route, learn. Everything below fills in that loop for each side of the business.

---

## 4. B2C demand harvesting

Surfaces ranked by intent density multiplied by how thin the competition is. Pursue in this order.

**4.1 AI answer engines. The frontier and your real edge.** ChatGPT, Perplexity, Gemini, Google AI Overviews, and Claude are where injured people increasingly ask their first question, and almost every personal injury firm is still fighting over Google blue links and ignoring this. The job is citation ownership: structure content and coined terms so that when someone asks an answer engine a launch-market question, CasePort is the source it pulls. Your zero-search-volume coined terms are a structural weapon. The moment an indexed article contains SCPS or the Lead Decay Curve, you are the only citable source for it. Own this before the category wakes up. This surface gets disproportionate effort.

**4.2 Search.** Long-tail, state-specific queries at the intersection of geography, case type, and legal concept. Programmatic geographic pages built only for funded markets, and only where a distinct search intent and a unique data cell exist. Virginia contributory negligence, Georgia SB 68, DC pedestrian carve-outs: underserved, high-intent, geo-filtered.

**4.3 Question platforms.** Quora (already live under Martha's real identity), Justia Ask a Lawyer, and similar. People mid-intent, in their own words, geo-taggable. The engine surfaces the high-value unowned questions and drafts the answer in the account owner's voice. A human posts.

**4.4 Voice search.** Spoken queries read aloud by assistants. Native FAQ blocks, direct-answer blocks, and question-phrased structure so an assistant can lift the answer cleanly.

**4.5 Video.** YouTube and short-form, where "what to do after a car accident" carries enormous volume. The engine drafts compliant educational scripts. Flat-fee educational creators only, compliant scripts, never solicitation.

**4.6 Local and community.** Community groups and local surfaces where incident intent appears. Genuine, disclosed helpfulness under a real identity, or no participation. Reddit specifically bans solicitation and will remove anything resembling lead generation, so the only play there is authentic disclosed helpfulness under a real name, or nothing.

Every B2C surface produces presence. None ever messages an individual injured person. Every surface routes to self-initiation. See Section 8.

---

## 5. B2B demand capture

Capturing firm demand is two motions. Build both.

**5.1 Inbound authority. Make skeptical partners find you.** The goal from the brief is that every single week, something is written about CasePort. The engine surfaces and drafts for:

- Legal trade press and syndication: Above the Law, LawSites, JD Supra, ABA Journal, and adjacent outlets.
- Expert-citation platforms: Qwoted (Expert account live), Featured.com, and journalist-request services, so CasePort founders are the quoted authority on case acquisition.
- Academic and credibility repositories: SSRN and Zenodo. This is a genuine differentiator no competing legal-tech company uses. It manufactures citable, institutional authority.
- LinkedIn thought leadership from the company page and the founders.

Inbound authority is where a trained skeptic's first impression of CasePort forms before you ever contact them. It is the reason the outbound message below lands instead of bouncing.

**5.2 Outbound precision. This is the arm that moves the binding constraint.** This is the Prospecting and Proof-of-Reality Agent from `AGENTS.md` 4.3, given its full harvesting context here. The engine works the enumerable universe of roughly seven thousand target firms doing five million dollars or more, enriched through Clay, sequenced, and personalized. For each target it researches the firm and the partner, pulls the redacted representative recent activity from that firm's actual market, and drafts outreach that shows them what came through their territory. It drafts. A human sends (HL4, HL6). The proof-of-reality artifact answers the skeptic's only real objection, prove it is real, before they can raise it.

---

## 6. Scoring: what to pursue and what to ignore

Volume is a trap. Score every opportunity by defensible-data-cell logic, not by raw search volume.

A cell is worth pursuing only when all three hold: CasePort can say something uniquely or better than any other source, a distinct intent exists for it, and a funded firm can monetize the result. High volume in an unfunded market scores zero. High volume where you have nothing unique to say scores zero. The engine is aimed by the CIC toward the cells with the highest expected converted value, and it deprioritizes vanity cells automatically. Mass publishing damages answer-engine authority, so fewer, denser, more citable assets beat volume every time. Every asset must pass the test of saying something no other source says or says better.

---

## 7. Placement: the technical layer that makes answer engines pull you

This is deterministic and non-negotiable on every asset.

- Direct-answer blocks engineered for extraction: one hundred to one hundred fifty words for answer-engine citation summaries, fifty-five to seventy-five words for FAQ answers.
- Native details FAQ blocks for zero-JavaScript crawlability.
- The target question owned uniquely per URL, one canonical answer per question across the whole domain, enforced by the keyword ownership registry as a pre-publish gate.
- The target keyword present naturally within the first three hundred words of body.
- Structured data and schema on every asset.
- A dynamic `llms.txt` route that auto-updates from the CMS so answer engines get a clean, current map of CasePort's authority.
- Entity consistency across Crunchbase, Wikidata, LinkedIn, and Google Business Profile so answer engines resolve CasePort as a coherent, citable entity.
- Coined terms seeded and stated as CasePort originals, so indexing any asset makes CasePort the sole citable source for that term.
- Real clickable government-resource links with the correct new-tab and no-referrer attributes.

---

## 8. Routing: the self-closing ecosystem

Every captured intent routes to self-initiation. A claimant or a buyer completes the journey without ever booking a call. Never route to a call.

- **B2C:** every claimant surface routes to caseport.io/checkmycase. The default call to action is Send my information. Never free case review or case evaluation, both of which are prohibited. Every intake call to action carries the ABA compliance disclaimer. This corrects and replaces any older intake links.
- **B2B, routed by reader psychology:** pain-awareness content routes to /markets. Financial or return-on-investment content and vendor-evaluation content route to /request-access. Pure education routes to the next pillar asset. The buyer self-serves toward a funded wallet, never toward a phone call.

---

## 9. The learning loop

This is what makes the engine compound rather than merely publish.

- Every captured touch carries the attribution tuple: source, surface, phrasing, market, and timestamps, immutable, exactly as the backend defines it.
- The engine writes back to the CIC which surface, phrasing, market, and question produced a completed intake and eventually a signed case.
- The CIC returns a sharper aim, reallocating the engine's effort toward the cells and surfaces that actually convert, and away from the ones that generate motion without revenue.
- The engine also tracks whether answer engines have begun citing CasePort for target questions, so citation ownership is measured, not assumed.

An engine that captures without closing this loop is a vitamin. This one closes it into the CIC.

---

## 10. Data model additions

- `demandCells`: the geography by case-type by legal-concept units, each with its uniqueness, intent, and funded-monetizability scores, and its pursue or ignore status.
- `captureAssets`: every produced asset or answer, its surface, its target cell, its owning identity, its publish status, and its human approver.
- `surfacePresence`: per-surface, per-market presence and citation-tracking state.
- `b2bTargets`: the enumerable firm universe, enrichment state, sequence state, and outreach drafts pending human send.
- `captureAttribution`: the tuple linkage from a captured touch through intake to signed outcome, joined to the CIC.

All additions live in the intelligence and reach layers and are recomputable. None is a source of truth for a case fact.

---

## 11. Guardrails, eval, and observability

- Action space is domain services, the internal ops MCP, and the declared surface allowlist only.
- Every action emits an event and is replayable. Every sub-agent is bounded and cost-budgeted.
- Human approval is enforced before any publish under a real identity and before any B2B outbound send.
- Every drafting agent ships an eval harness with a compliance adversarial suite that tries to make it produce legal advice, evaluative language, a guarantee, or claimant-outbound behavior, and must fail every attempt.
- Funded-market scoping is enforced in code for B2C capture, not left to judgment.
- Citation ownership and conversion are tracked, so the engine is measured on converted demand in funded markets, never on raw volume.

---

## 12. Build sequence

1. **Phase A. Placement and scoring foundation.** The demand-cell model, the scoring logic, the keyword ownership registry gate, the schema, `llms.txt`, direct-answer, and entity-consistency layer. Checkpoint: a single asset publishes with correct structure, owns its canonical question, and is scored by defensible-data-cell logic with funded-market gating live.
2. **Phase B. B2C sensing and drafting for the AEO frontier and question platforms.** The sensing and scoring agent, and the drafting agent for answer-engine assets and question-platform answers, human-published. Checkpoint: the engine surfaces a ranked list of unowned high-intent questions in a funded market and drafts a compliant, citable answer that a human approves and posts.
3. **Phase C. B2B inbound authority and outbound precision.** The authority drafting for press, expert-citation, and repositories, and the proof-of-reality outbound arm against the target universe, both human-approved before publish or send. Checkpoint: an outbound draft carries accurate, redacted market proof and passes the Rule 7.1 adversarial suite.
4. **Phase D. Routing and the self-closing paths.** The B2C and B2B routing rules wired to the correct destinations, disclaimers in place. Checkpoint: every captured path routes to self-initiation and no path routes to a call.
5. **Phase E. The learning loop.** The attribution linkage into the CIC and the reallocation of effort toward converting cells, plus citation-ownership tracking. Checkpoint: a signed case traces back to its originating surface and phrasing, and the CIC reallocates the engine's next cycle.

Do not build ahead of this order. B2C capture produces value only in funded markets, so its full multi-surface breadth and self-reallocation come online as markets fund. Build the engine now. Let its reach widen with the footprint.

---

## 13. Definition of done

- CasePort is the answer found at high-intent surfaces in funded markets, and every path routes to self-initiation.
- B2C is inbound only, every identity is real, and no injured person is ever contacted.
- B2B captures through both inbound authority and Rule 7.1 clean outbound precision.
- Every asset is defensible-data-cell scored, uniquely owns its question, and is structured for answer-engine extraction.
- The engine closes its loop into the CIC and is measured on converted demand and citation ownership, never on raw volume.
- Every compliance adversarial eval is green. Personal injury is spelled out in full. No em dashes anywhere.

Ask before every merge: is this excellent, is this world class, would Apple ship this. If not, it does not merge.

---

## 14. Before you build, confirm with the founder

1. The confirmed funded markets at build time, since B2C capture is scoped to them.
2. The real identities and their credentials for each identity-based surface.
3. The approved surface allowlist and the human approvers for publish and for B2B send.
4. Confirmation that all older intake links are being migrated to caseport.io/checkmycase.

Do not begin Phase A until items 1 through 4 are answered.

---

Harvest, never intercept. Become the answer already waiting, so they come to you. Capture the right demand first, in funded markets, and let the dossier and the speed win the economics. Reach gets you to the table. The backend wins the hand.
