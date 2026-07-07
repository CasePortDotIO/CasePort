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

## What is still a documented seam

- **Rented source fetchers** (`SourceFetcher`): `ACTIVATED_FETCHERS` in `src/services/adapters/payloadIngestion.ts` is empty. Semrush data arrives through the Semrush MCP, which is a session tool rather than a server-callable API, so the fetcher for it is activated when that integration is available. The `pollRentedSources` cron runs and is observable meanwhile; adding a fetcher is one entry in `ACTIVATED_FETCHERS`, behind the same epistemic gate.
- **Question sensor** (`QuestionSensor`) and **citation checker** (`CitationChecker`): agentic reads of answer engines and search surfaces. These activate when the reading integration (Semrush MCP, answer-engine access) is wired; the demand sensing and drafting orchestration is otherwise complete.
- **Prospect researcher** (`ProspectResearcher`): firm and partner research, activated with the enrichment integration (Clay).

## Environment variables

- `ANTHROPIC_API_KEY`: activates every Claude adapter.
- `OPS_BRIEFING_EMAIL`, `OPS_ALERT_PHONE`: briefing and alert recipients (Resend, Twilio). Absent means dry run.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `TWILIO_*`: the delivery rails, already used by the existing notifier.

None of these are required for the build, the tests, or a preview deploy; each one activates its slice of the live system.
