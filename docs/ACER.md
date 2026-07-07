# ACER, locked

CLAUDE.md Section 15 item 1 required locking ACER before the Glass Box math could
be trusted, because the source documents defined it three ways. This document is
the decision. It is authoritative. The implementation lives in one place,
`src/lib/domain/acer.ts`, and every surface that shows the number calls it.

## The definition

**ACER = Acquisition Cost Efficiency Ratio = a firm's true cost per signed case.**

```
ACER (cents) = total fixed fees the firm actually paid for delivered opportunities
               ------------------------------------------------------------------
               number of those delivered cases the firm signed
```

- A signed case is one the firm reported as `retained` or `settled`.
- `declined` and `still-evaluating` outcomes are not signed cases.
- Fees paid are the sum of the firm's `delivery-debit` ledger entries, in cents.
  The ledger is the source of truth for money, so ACER reads from it directly.

## Why this definition and not the others

Two other candidates appeared in the source material:

1. **Average Case Economic Return.** Requires settlement dollars. CasePort never
   receives settlement figures and never should, so this is not computable from
   facts we hold, and estimating it would fail the honesty bar.
2. **Signed over delivered, as a bare ratio.** Unitless. It answers a different
   question (a conversion rate), not the one the managing partner asks.

Cost per signed case is denominated in dollars, computed only from data we hold
(our own ledger debits and the firm's reported outcomes), and it is the number
the buyer came for: what does a signed case cost me here, versus what it costs me
through Google Ads and shared leads. So that is the locked definition.

## Compliance

- **W3 / W4, one directional.** Billing reads into intelligence: fees paid are an
  input to ACER. The reverse is forbidden and exists nowhere. A reported outcome
  never changes what a delivery cost. The fee is a fixed amount per delivered
  opportunity, looked up from the price table, never derived from a result.
- **Reciprocity.** ACER is unknowable until the firm reports what signed. A firm
  that has paid for deliveries but reported nothing sees ACER `locked`, with the
  honest reason that reporting outcomes unlocks it. We never estimate it.

## Where it is computed and shown

- Single source of truth: `computeAcer` in `src/lib/domain/acer.ts`.
- Domain service: `IntelligenceService.acer(firmId)` reads the firm's ledger and
  outcomes and calls `computeAcer`.
- Surfaced: the firm dashboard (a metric card) and each opportunity's closing kit
  after an outcome is reported. Both show the identical number because both go
  through the one function.
