import type { Payload } from 'payload'
import { httpNotifier } from '@/services/adapters/notifier'
import { buildFirmInviteMessages, buildFirmResetMessages, activationUrl } from './inviteMessages'

/**
 * Issue a set your password link for a firm partner and email it. Uses Payload's
 * own reset token machinery (so the token is validated the same way a login is)
 * but suppresses Payload's built in email and sends a branded message through the
 * Resend notifier instead. Returns the link too, so an admin who provisions a
 * partner always has it even when email is not configured.
 *
 * This is the whole of the invite motion: CasePort is invite only, so a partner
 * never signs up. They are provisioned after a signed agreement and receive this
 * link to set their own password on a secure page. No password is ever shared.
 */
export async function issueFirmPasswordLink(
  payload: Payload,
  input: { email: string; name?: string; firmName?: string; origin: string; kind: 'invite' | 'reset' },
): Promise<{ sent: boolean; activationLink: string | null }> {
  // Generate a reset token without Payload sending its own email.
  const token = await payload.forgotPassword({
    collection: 'firmUsers',
    data: { email: input.email },
    disableEmail: true,
  })
  const tokenStr = typeof token === 'string' ? token : String((token as { token?: string } | null)?.token ?? '')
  if (!tokenStr) return { sent: false, activationLink: null }

  const link = activationUrl(input.origin, tokenStr)
  const messages =
    input.kind === 'invite'
      ? buildFirmInviteMessages({ name: input.name, firmName: input.firmName, activationUrl: link })
      : buildFirmResetMessages({ name: input.name, activationUrl: link })

  let sent = false
  try {
    const r = await httpNotifier().email({ to: input.email, subject: messages.subject, body: messages.body })
    sent = r.sent
  } catch {
    sent = false
  }
  return { sent, activationLink: link }
}
