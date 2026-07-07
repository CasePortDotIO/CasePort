# Deploy runbook: the internal operations console and both engines

One checklist to take CasePort live on Vercel, put the operations console on its own locked subdomain, and switch on the live agents and data sources. Nothing here is required for the build or the tests; each step activates a slice of production.

The console is internal only. Treat `ops.caseport.io` as the crown jewels: its own subdomain, an identity layer in front, operator auth on top, never indexed, never linked publicly.

---

## 0. Prerequisites

- A Vercel account with access to the CasePort project (or permission to create it).
- Control of the `caseport.io` DNS (to add the `ops` subdomain).
- A MongoDB Atlas cluster and its connection string.
- Optional keys to activate the live layer (Section 4). None block a deploy; each turns on its slice.

---

## 1. Environment variables

Set these in Vercel (Project, Settings, Environment Variables). Scope secrets to Production and Preview as you prefer. All are read at runtime; absent means that slice runs dry, never an error.

**Required for real data and auth**
- `DATABASE_URL`: the MongoDB Atlas connection string.
- `PAYLOAD_SECRET`: a long random string for Payload auth and encryption.
- `NEXT_PUBLIC_SITE_URL`: for example `https://caseport.io`.

**The internal console lock (this PR)**
- `OPS_HOST`: `ops.caseport.io`. When set, `/ops` and `/api/ops` are reachable only on that host and 404 everywhere else; the host root lands on `/ops`. Leave unset to keep the console on the main host.
- `OPS_PREVIEW`: `1` only if you want the labeled sample console at `/ops/preview` (for demos). Leave unset in production.

**Live agents and cheap data sources (see docs/LIVE_AGENTS.md)**
- `ANTHROPIC_API_KEY`: activates the Claude synthesizer, query responder, and drafters.
- `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`: the keyword and search data source (pay as you go, cents per query at this scope).
- `PERPLEXITY_API_KEY`: the answer engine citation checker.

**Briefing and alert delivery**
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `OPS_BRIEFING_EMAIL`: the daily and weekly briefing email.
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `OPS_ALERT_PHONE`: the real time alert channel (or swap to a Slack webhook behind the same port later).

**Media storage (already in the stack)**
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob, when media is enabled.

---

## 2. Deploy, path A: Vercel Git integration (recommended)

This is the least effort and gives a preview URL per branch automatically.

1. In Vercel, create or open the CasePort project and connect it to the `caseportdotio/caseport` GitHub repo.
2. Set the environment variables from Section 1 (Production and Preview scopes).
3. Framework preset: Next.js. Build command `npm run build`, install `npm install`, output is auto.
4. Push or merge:
   - Pushing the branch `claude/caseport-intelligence-core-ms1id6` (already pushed) creates a **preview deployment**. Its URL is in Vercel, Deployments, next to that branch. Preview hosts (`*.vercel.app`) always pass the console proxy, so you can open `/ops` there.
   - Merging PR #36 to the production branch triggers the **production deployment**.

To see the populated sample console on a preview, set `OPS_PREVIEW=1` in the Preview scope and open `/ops/preview`. Without it, `/ops` correctly shows the operator sign in gate.

---

## 3. Deploy, path B: Vercel CLI (from your machine)

Use this if you are not using Git integration, or want a one off deploy.

```bash
# from the repo root
npm i -g vercel        # or: npx vercel
vercel login           # authenticate to your Vercel account
vercel link            # link this repo to the CasePort project (creates .vercel/)
vercel env pull        # optional: sync env vars locally
vercel deploy          # preview deployment, prints a URL
vercel deploy --prod   # promote to production when ready
```

Set the Section 1 env vars either in the dashboard or with `vercel env add NAME production`.

---

## 4. Database (MongoDB Atlas)

1. Create an Atlas cluster and a database user.
2. Allow Vercel egress: set Atlas Network Access to allow from anywhere (`0.0.0.0/0`) or Vercel's IPs.
3. Put the connection string in `DATABASE_URL`.
4. First boot creates the collections. Seed the source allowlist (`src/lib/intelligence/sourceAllowlist.ts`) and any markets and firms through the Payload admin at `/admin`.

The app is built to survive a cold or absent database, so a deploy without `DATABASE_URL` still builds and renders the console in its offline state.

---

## 5. The `ops.caseport.io` subdomain and the second lock

The proxy in this PR is the routing lock. Add an identity lock in front for defense in depth.

1. **Add the subdomain to Vercel.** Project, Settings, Domains, add `ops.caseport.io`. Follow Vercel's DNS instructions (a CNAME on `ops` to Vercel), or manage DNS in Cloudflare.
2. **Set `OPS_HOST=ops.caseport.io`.** Now `/ops` and `/api/ops` exist only on that host; the public site 404s them.
3. **Put Cloudflare Access (or Vercel SSO) in front.** Proxy `ops.caseport.io` through Cloudflare, then Cloudflare Zero Trust, Access, add an application for `ops.caseport.io` with a policy that allows only your Google Workspace domain or a named allowlist. Now only your team's Google accounts can even reach the page.
4. **Operator auth on top.** Inside the app, `/ops` still requires an authenticated CasePort operator (Payload user). Two locks, plus `robots: noindex`, plus no public links.

Recommended name: `ops.caseport.io` (accurate, it is an operations console over both engines). `intel.caseport.io` is the on brand alternative.

---

## 6. Turn on the autonomous loop

Once deployed with keys, the Inngest crons run the live loop. Point Inngest at the deploy (the serve route is `/api/inngest`) or run Inngest Cloud against it. Scheduled functions:

- `ingest-owned-intelligence`: owned signals from live outcomes and deliveries (near real time).
- `poll-rented-sources` (daily): DataForSEO keyword and search data, dry until its credentials are set.
- `synthesize-domains` (daily 05:00): the four domain syntheses, through the compliance gates.
- `run-intelligence-briefing` (daily 05:30): the ranked briefing, delivered internally.
- `recalibrate-scps`, `reconcile-wallets`, and the delivery agents: the existing backend loops.

---

## 7. Post deploy verification

- `GET /ops` on the internal host shows the operator sign in gate when signed out, the cockpit when signed in.
- `POST /api/ops/briefing` signed out returns `401`. Signed in, it runs a briefing.
- `GET /ops` on a public host returns `404` once `OPS_HOST` is set.
- The Payload admin at `/admin` lets an operator sign in.
- With `ANTHROPIC_API_KEY` set, a manual synthesis produces artifacts and recommendations; without it, the loop runs dry and asserts nothing.

---

## 8. Cost note

The keyword and search data runs on DataForSEO, pay as you go (roughly single digit dollars per month at the funded market scope, since the defensible data cell gate only deep fetches pursued cells and signals dedupe and supersede). The answer engine citation checker runs on the Perplexity API, cheap per query. This replaces a Semrush API line item of several hundred dollars per month. See `docs/LIVE_AGENTS.md` for the activation seams.
