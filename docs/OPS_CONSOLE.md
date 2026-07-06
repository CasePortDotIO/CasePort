# CasePort Internal Operations Console (/ops)

The single internal app that merges the two engines built on this backend into one operator surface: the CasePort Intelligence Core (which aims) and the Demand Capture Engine (which executes), joined by the shared event log (the learning loop). Internal only, access controlled, read only in this first cut.

## What it is

`/ops` is a gated Next.js route that renders one fused cockpit:

- **Flywheel band.** The fusion narrative in three stages. Aim (Intelligence Core: active signals, sources), Capture (Demand Capture: pursued cells, published assets, funded markets), Learn (the shared event log pulse). Every headline number is derived from the panels below.
- **Intelligence Core panel.** Source registry by reliability (A/B/C) and status, active versus superseded signals, active signals by domain, and the latest ingested signals.
- **Demand Capture panel.** Demand cells pursued versus ignored with ignore reasons, the top pursued cells by score, the capture asset pipeline by status, funded markets, and recently published assets.
- **Live event feed.** The shared audit log across both engines and the backend core, lane colored so it reads as one system.

## Design and guarantees

- **Internal only (H6, HL6).** The page is gated to an authenticated CasePort operator through `payload.auth`. An unauthenticated visitor sees only a sign in prompt, never engine state. `robots: noindex`.
- **Read only in this cut.** No writes, no promotions, no publishes. The human gated actions (register and ingest signals, score cells, approve and publish assets, stage promotions) are the fast follow, and they will run through the existing services so the H1 and HL4 approval gates hold.
- **A projection, not a source of truth (H4).** The read model in `src/lib/ops/cockpit.ts` aggregates the shared collections and the event log. It holds no fact that exists nowhere else and is fully recomputable.
- **Every number traces to a real record or event (D6 quality bar).** Nothing on the console is fabricated. Empty and offline states are honest: a cold or absent database renders an offline console rather than invented data, so preview deploys still work.

## Files

- `src/lib/ops/cockpit.ts`: the fused read model, `loadOpsCockpit` and `offlineCockpit`, guarded per collection.
- `src/app/(frontend)/ops/page.tsx`: the gated server route (auth, offline handling, live snapshot).
- `src/app/(frontend)/ops/OpsCockpitClient.tsx`: the cockpit UI.
- `src/app/(frontend)/ops/OpsGate.tsx`: the operator sign in gate.
- `src/app/(frontend)/ops/ops.css`: the scoped `.ops-root` terminal theme.
- `tests/int/ops/cockpit.int.spec.ts`: read model aggregation, lane mapping, and offline degradation.

## Next

- Wire the human gated actions (Phase B of each engine surfaces here): ingest, score, approve and publish, and stage promotions, each through its service with the approval gate.
- Surface the CIC briefings and recommendations, and the Demand Capture attribution loop, as those phases land.
