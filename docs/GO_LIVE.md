# Go live

The product is built. This is the sequence to turn it on: a real domain, the
environment variables, the first accounts, and the checks that prove it. Run the
preflight after each stage and let it tell you what is still dry.

Diagnostics live at:

- `GET /api/admin/preflight` — what is armed vs dry, and why a partner cannot sign in.
- `GET /api/admin/ledger-audit` — money path integrity on real data (read only).

Both are admin only. Create the first admin at `/admin` (Payload's first user
flow) before calling them.

---

## 1. Point a real domain

A `*.vercel.app` URL is the single biggest not-ready signal. No managing partner
funds a wallet on a vercel.app link.

1. In Vercel, open the project, Settings, Domains, and add `caseport.io`.
2. At your registrar, add the records Vercel shows. Usually:
   - Apex `caseport.io`: an `A` record to Vercel's IP, or an `ALIAS`/`ANAME` to
     `cname.vercel-dns.com` if your registrar supports it.
   - `www.caseport.io`: a `CNAME` to `cname.vercel-dns.com`.
3. Wait for Vercel to show the domain as Valid and issue the TLS certificate.

### Optional subdomain split

A cleaner mental model, not required:

- `caseport.io/checkmycase` — the claimant intake surface.
- `app.caseport.io` — the firm dashboard. Add `app.caseport.io` as a second
  domain (a `CNAME` to `cname.vercel-dns.com`) pointing at the same project.

You do not have to split. Whatever you choose, set `NEXT_PUBLIC_APP_URL` to the
canonical origin (below) and every outbound SMS and email link uses it
automatically.

---

## 2. Environment variables

Set these in Vercel, Settings, Environment Variables, for Production (and a
separate set for Preview). The preflight reports presence, never values.

### Required to run at all

| Variable | What it is | Without it |
| --- | --- | --- |
| `PAYLOAD_SECRET` | Signs sessions and every signed link | Every database route, including login, fails |
| `DATABASE_URL` | MongoDB Atlas connection string | Nothing persists; the app cannot start cleanly |
| `NEXT_PUBLIC_APP_URL` | Canonical origin, e.g. `https://caseport.io` | Outbound links fall back to the request origin |

### Required to take money and store media

| Variable | What it is |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for media uploads |
| `STRIPE_SECRET_KEY` | Stripe secret key for wallet funding |
| `STRIPE_WEBHOOK_SECRET` | Verifies the Stripe top up webhook |

### Signed link secrets (set in production, do not rely on the fallback)

| Variable | Falls back to |
| --- | --- |
| `MEDIA_LINK_SECRET` | `PAYLOAD_SECRET` |
| `STATUS_LINK_SECRET` | `PAYLOAD_SECRET` |
| `RESUME_LINK_SECRET` | `PAYLOAD_SECRET` |

Setting `PAYLOAD_SECRET` alone is enough for these to be real (the preflight
treats link secrets as ready when `PAYLOAD_SECRET` is set). Set the per link
secrets only if you want to rotate them independently.

### Turns the magic on (dry no ops until set)

| Variable | Arms |
| --- | --- |
| `ANTHROPIC_API_KEY` | Insurance card auto fill, reflective playback, coaching |
| `DEEPGRAM_API_KEY` | Voice statement transcription |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | SMS and the speed callback |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Transactional email |

### Operational

| Variable | What it is |
| --- | --- |
| `SEED_SECRET` | Guards the dev seed if you ever run it in production |
| `ALLOW_MONEY_PATH_PROOF` | Set to `1` only on staging to enable the write path money proof; never in production |

---

## 3. First accounts

1. Visit `/admin` and create your admin user (the internal Users collection).
2. Create a live market: in the admin, Markets, set one of Virginia, Maryland,
   Washington DC, or Georgia live for intake, with its ZIP clusters.
3. Create the Founding Partner firm: Firms, with its per case type price table
   and callback SLA minutes.
4. Create the partner login: Firm Users (or `POST /api/admin/firm-user` with
   `{email, password, name, firmId}`). The partner signs in at `/firm/login`.
5. Arm the speed callback for that firm when the agreement is signed:
   `POST /api/admin/firm/[firmId]/activate-callback` with `{active: true, slaCallbackMinutes: 15}`.

Run `GET /api/admin/preflight` and confirm `canLogin: true` and, when ready,
`goLive: true`.

---

## 4. Prove the money path

- On staging, with `ALLOW_MONEY_PATH_PROOF=1`, the write path proof exercises a
  real ACID debit under a forced retry against Atlas and tears its test data down.
- On production, `GET /api/admin/ledger-audit` continuously proves integrity on
  real data: every firm's ledger sum matches its snapshot, no idempotency key is
  used twice (no double charge), and every billed delivery has exactly one debit.

The ledger is the truth. If the audit is clean, the money moved correctly.

---

## 5. Compliance sign off (not code)

Before real claimants flow, get a personal injury advertising lawyer to sign off
on the claimant surfaces against the ABA memo and the launch states. The Wall is
built into the code, but the copy and the disclosures are a legal review, not an
engineering one.
