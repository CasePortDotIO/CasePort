# Founder Decisions Log

Locked answers to the Section 15 gate in `CLAUDE.md`. Phase 0 does not begin until all four items are resolved. This log is append-only in spirit: supersede a decision with a new dated entry, do not silently rewrite history.

## Status of the Section 15 gate

| Item | Topic | Status |
| ---- | ----- | ------ |
| 1 | ACER definition | Locked |
| 2 | Wallet-dry market policy | Locked |
| 3 | Per-opportunity price table | Open |
| 4 | Manus prototype | Open |

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

## D3. Per-opportunity price table (open)

Awaiting founder-approved fixed fees by case type and launch market (Virginia, Maryland, Washington DC, Georgia). The price-table structure will be built regardless; Phase 3 debit needs approved values before it can move real money. Fees are fixed and never derived from outcome (W3).

## D4. Manus prototype (open)

Awaiting both dashboards (law firm dashboard and CasePort dashboard) so the API contract serves the existing screens exactly. The backend serves the frontend that exists; it does not invent a contract the frontend cannot consume.
