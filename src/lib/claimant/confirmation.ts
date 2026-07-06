/**
 * The claimant confirmation touch (Section 6, the anti black hole promise). The
 * moment a case file is received, the claimant gets a message with a link back to
 * their living status page, so they never wonder whether anything happened. The
 * copy is geographic and procedural only: it says the file was received and a
 * firm in their area is reviewing it, and nothing about the strength or value of
 * the case (W2, W6).
 *
 * Pure, so the copy is unit tested and cannot drift into a claim. The sending is
 * done by the caller through the Notifier, which no ops cleanly without keys.
 */

export interface ConfirmationMessages {
  sms: string
  emailSubject: string
  emailBody: string
}

export function buildConfirmationMessages(input: {
  firstName: string
  reference: string
  statusUrl: string
}): ConfirmationMessages {
  const name = input.firstName?.trim() || 'there'
  const sms =
    `CasePort: your personal injury case file (${input.reference}) was received. ` +
    `A firm in your area is reviewing it. Track your case here: ${input.statusUrl}`

  const emailSubject = 'Your case file was received'
  const emailBody =
    `Hi ${name},\n\n` +
    `Your personal injury case file was received and organized. Your reference number is ${input.reference}.\n\n` +
    `A firm in your area is reviewing your case. An attorney will contact you directly. ` +
    `There is nothing more you need to do right now.\n\n` +
    `You can check your case status anytime here:\n${input.statusUrl}\n\n` +
    `CasePort`

  return { sms, emailSubject, emailBody }
}
