# Activating the live agents and sources

The agentic pieces of both engines run behind ports. In tests and dry runs they use in-memory fakes; in production they use live adapters that activate when their credentials are present and fall back to a safe, non-asserting value when they are not. Compliance is enforced by the service gates, not the adapters, so a live model can never bypass the Wall.

## What is wired

`src/services/adapters/liveAgents.ts` provides the live Claude adapters, all using `src/services/adapters/anthropicJson.ts` (claude-opus-4-8, strict JSON, defensive parse, no-op without a key):

| Adapter | Port | Used by | Activation |
| ------- | ---- | ------- | ---------- |
| `createAnthropicDomainSynthesizer` | `DomainSynthesizer` | `synthesizeDomains` Inngest cron (daily 05:00) through SynthesisService | `ANTHROPIC_API_KEY` |
| `createAnthropicQueryResponder` | `QueryResponder` | `/api/ops/briefing` and the `runIntelligenceBriefing` cron (daily 05:30) | `ANTHROPIC_API_KEY` |
| `createAnthropicAnswerDrafter` | `AnswerDrafter` | Demand B2C drafting (operator triggered, fast follow) | `ANTHROPIC_API_KEY` |
| `createAnthropicOutboundDrafter` | `OutboundDrafter` | Demand B2B outbound drafting (operator triggered, fast follow) | `ANTHROPIC_API_KEY` |

Every adapter's output still passes the existing gates:
- Synthesizer output passes regulatory verification (never asserts an unverified rule change) and the recommendation guard (no smart routing, no outcome-scaled pricing) in `SynthesisService`.
- Answer drafter output passes the placement and public-copy gate in `publishAsset`; the no-key fallback deliberately fails the gate so nothing empty publishes.
- Outbound drafter output passes the Rule 7.1 gate in `B2BCaptureService`.

Proven by `tests/int/agents/live-adapters.int.spec.ts`: without a key each adapter returns a safe fallback and the synthesizer's output still flows through the gates.

## Rented data sources (chosen for cost, not just quality)

The Semrush API is the most expensive way to get keyword and search data (a ~$500/mo Business plan floor plus per-row API units). Because the engine is provider agnostic behind the `SourceFetcher` and `CitationChecker` ports, we wired cheaper, equally good sources:

- **DataForSEO** (`src/services/adapters/dataForSeoFetcher.ts`) is the keyword and search data fetcher, registered as source `dataforseo`. Pay as you go, no subscription (~$0.0006 per SERP, ~$0.0001 per keyword). It derives its keyword list from the pursued funded cells, so it only ever spends on cells that can monetize, and signals dedup and supersede so unchanged data is never refetched. At CasePort's scope this is single digit dollars per month versus $500+ for Semrush. Activate with `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`.
- **Perplexity** (`src/services/adapters/perplexityCitationChecker.ts`) is the answer engine citation checker: it asks the Perplexity API a target question and matches CasePort in the citations. CasePort's coined terms make this a near trivial, dirt cheap match. Activate with `PERPLEXITY_API_KEY`. A managed tracker (Otterly, Peec) is a drop in replacement behind the same port.
- The Semrush MCP (the session tool) is retained in the allowlist for ad hoc competitive lookups, not the programmatic pipeline.

Both run dry (fetch nothing, report not cited) without credentials, so wiring them commits no spend, and the `pollRentedSources` and `runLearningLoop` crons stay observable.

## What is still a documented seam

- **Question sensor** (`QuestionSensor`): agentic reading of unowned high intent questions on answer engines and question platforms. Can be backed by DataForSEO SERP or Perplexity next; the sensing and drafting orchestration is otherwise complete.
- **Prospect researcher** (`ProspectResearcher`): firm and partner research, activated with the enrichment integration (Clay).

## Environment variables

- `ANTHROPIC_API_KEY`: activates every Claude adapter.
- `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` (and optional `DATAFORSEO_LOCATION_CODE`): the keyword and search data fetcher.
- `PERPLEXITY_API_KEY` (and optional `PERPLEXITY_MODEL`): the answer engine citation checker.
- `OPS_BRIEFING_EMAIL`, `OPS_ALERT_PHONE`: briefing and alert recipients (Resend, Twilio). Absent means dry run.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `TWILIO_*`: the delivery rails, already used by the existing notifier.
- `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`: activate the DataForSEO keyword and search data source (a pay as you go alternative to the Semrush API). Absent means the poller runs dry.
- `PERPLEXITY_API_KEY`: activate the Perplexity answer-engine citation checker. Absent means citation checks report not cited.
- `OPS_HOST`: the internal subdomain the operations console is scoped to (for example `ops.caseport.io`). When set, `src/proxy.ts` makes `/ops` and `/api/ops` reachable only on that host and 404s them everywhere else; the host's root lands on `/ops`. Unset means the console stays reachable on any host (current behavior). Put an identity layer (Cloudflare Access or Vercel SSO) in front of the subdomain for the second lock, with the app's operator auth on top.

None of these are required for the build, the tests, or a preview deploy; each one activates its slice of the live system.
