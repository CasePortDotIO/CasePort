/**
 * Partner onboarding and password reset copy. CasePort is invite only: a firm is
 * provisioned after a signed Founding Partner agreement, never self served, so a
 * partner never sees a public sign up. Instead they receive a branded link to set
 * their own password on a secure page. This is the enterprise onboarding motion,
 * matched to the caliber of firm being sold, and no password is ever handed over
 * insecurely.
 *
 * Pure, so the copy is unit tested and cannot drift. Firm facing, not claimant
 * facing, so the claimant language guards do not apply; it is still plain and
 * makes no fabricated claim.
 */

export interface FirmEmailMessages {
  subject: string
  body: string
}

/** The activation invite for a newly provisioned partner. */
export function buildFirmInviteMessages(input: {
  name?: string
  firmName?: string
  activationUrl: string
}): FirmEmailMessages {
  const name = input.name?.trim() ? input.name.trim() : 'there'
  const firm = input.firmName?.trim() ? ` for ${input.firmName.trim()}` : ''
  return {
    subject: 'Activate your CasePort account',
    body:
      `Hi ${name},\n\n` +
      `Your CasePort partner account${firm} is ready. Set your password to sign in to your dashboard, where you will see your market, your ledger, and your cases.\n\n` +
      `Set your password:\n${input.activationUrl}\n\n` +
      `This link is single use and expires soon, so please set your password when you have a moment. If you were not expecting this, you can ignore this email.\n\n` +
      `CasePort`,
  }
}

/** The password reset link for an existing partner. */
export function buildFirmResetMessages(input: { name?: string; activationUrl: string }): FirmEmailMessages {
  const name = input.name?.trim() ? input.name.trim() : 'there'
  return {
    subject: 'Reset your CasePort password',
    body:
      `Hi ${name},\n\n` +
      `We received a request to reset the password on your CasePort account. Set a new one here:\n${input.activationUrl}\n\n` +
      `This link is single use and expires soon. If you did not request this, you can ignore this email and your password will stay the same.\n\n` +
      `CasePort`,
  }
}

/** Build the activation URL a partner sets their password at, from a reset token. */
export function activationUrl(origin: string, token: string): string {
  return `${origin.replace(/\/$/, '')}/firm/activate?token=${encodeURIComponent(token)}`
}
