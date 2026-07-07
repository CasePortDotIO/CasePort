/**
 * The executed HIPAA authorization document (W5). At routing, the claimant's
 * pre signed template is populated with the specific firm's name, and the named
 * authorization is delivered to the firm so the firm can request records
 * directly from providers. CasePort stores this executed authorization as a
 * record and never receives, transmits, or stores any medical records
 * themselves. This document is the authorization, not the records.
 *
 * Pure: it renders the authorization as a self contained HTML document from the
 * claimant name, the firm name, and the execution date. No network, no medical
 * data. Unit tested so the named firm and the compliance language are always
 * present.
 */

export interface HipaaAuthorizationInput {
  claimantName: string
  firmName: string
  /** ISO date the authorization was executed (the intake signature date). */
  executedDate: string | null
  /** The claimant's market, for the record header. Geographic only. */
  market?: string | null
  reference?: string | null
}

function formatDate(iso: string | null): string {
  if (!iso) return 'the date of execution'
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return 'the date of execution'
  return new Date(t).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Render the executed authorization as a printable HTML document. The firm named
 * in the authorization is the firm the case was routed to, and it appears as the
 * authorized recipient of records. The document states plainly that it authorizes
 * the release of records to that firm, and that it is not itself a medical record.
 */
export function renderHipaaAuthorization(input: HipaaAuthorizationInput): string {
  const claimant = escapeHtml(input.claimantName || 'The claimant')
  const firm = escapeHtml(input.firmName || 'the authorized firm')
  const date = formatDate(input.executedDate)
  const ref = input.reference ? escapeHtml(input.reference) : null
  const market = input.market ? escapeHtml(input.market) : null

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>HIPAA Authorization for Release of Records</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; max-width: 720px; margin: 40px auto; padding: 0 24px; line-height: 1.6; }
  h1 { font-size: 20px; letter-spacing: .02em; margin-bottom: 4px; }
  .kicker { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: #0f6e56; font-weight: 700; }
  .meta { font-family: -apple-system, system-ui, sans-serif; font-size: 12px; color: #55514b; margin: 12px 0 24px; }
  .meta div { margin-bottom: 3px; }
  p { margin: 0 0 14px; }
  .firm { font-weight: 700; }
  .sig { margin-top: 36px; border-top: 1px solid #ccc3b2; padding-top: 16px; font-family: -apple-system, system-ui, sans-serif; font-size: 13px; }
  .fine { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; color: #8a857d; margin-top: 28px; border-top: 1px solid #ece6da; padding-top: 14px; }
</style>
</head>
<body>
  <div class="kicker">Authorization for release of protected health information</div>
  <h1>HIPAA Authorization</h1>
  <div class="meta">
    <div><b>Executed by:</b> ${claimant}</div>
    <div><b>Date executed:</b> ${date}</div>
    ${ref ? `<div><b>Reference:</b> ${ref}</div>` : ''}
    ${market ? `<div><b>Market:</b> ${market}</div>` : ''}
  </div>

  <p>
    I, ${claimant}, authorize my health care providers, hospitals, physicians, and
    other covered entities to release my protected health information to the law
    firm named below, for the purpose of evaluating and pursuing my personal
    injury claim.
  </p>

  <p>
    <span class="firm">Authorized recipient firm: ${firm}.</span>
  </p>

  <p>
    This authorization permits ${firm} to request and receive records directly
    from my providers. I understand that I may revoke this authorization in
    writing at any time, except to the extent that action has already been taken
    in reliance on it. I understand that treatment, payment, enrollment, and
    eligibility for benefits may not be conditioned on signing this authorization.
  </p>

  <div class="sig">
    Signature on file. Executed electronically by ${claimant} on ${date}.
  </div>

  <p class="fine">
    This document is an authorization for the release of records to the named
    firm. It is not itself a medical record. CasePort stores this executed
    authorization as a record and never receives, transmits, or stores medical
    records. The named firm requests records directly from the providers.
  </p>
</body>
</html>`
}
