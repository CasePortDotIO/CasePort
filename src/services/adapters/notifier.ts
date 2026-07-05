import type { Notifier, NotifyResult } from '../agentPorts'

/**
 * The production notifier: Twilio for SMS and the speed callback, Resend for
 * email (Section 3). It posts to their REST APIs directly, so it needs no SDK
 * dependency, and it no ops cleanly when the credentials are absent. That is
 * what lets the whole agent suite be scaffolded and tested dry: with no keys
 * configured every send is a logged dry run, never an error.
 */

function twilioConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER)
}
function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
}

export function httpNotifier(): Notifier {
  return {
    async sms({ to, body }): Promise<NotifyResult> {
      if (!twilioConfigured()) {
        console.info('[notifier] dry run sms', { to, body })
        return { sent: false, channel: 'sms', dryRun: true }
      }
      try {
        const sid = process.env.TWILIO_ACCOUNT_SID as string
        const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')
        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
          method: 'POST',
          headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ To: to, From: process.env.TWILIO_FROM_NUMBER as string, Body: body }),
        })
        const data = (await res.json().catch(() => ({}))) as { sid?: string }
        return { sent: res.ok, channel: 'sms', ref: data.sid, dryRun: false }
      } catch (err) {
        console.error('[notifier] twilio sms failed', err)
        return { sent: false, channel: 'sms', dryRun: false }
      }
    },

    async email({ to, subject, body }): Promise<NotifyResult> {
      if (!resendConfigured()) {
        console.info('[notifier] dry run email', { to, subject })
        return { sent: false, channel: 'email', dryRun: true }
      }
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to, subject, text: body }),
        })
        const data = (await res.json().catch(() => ({}))) as { id?: string }
        return { sent: res.ok, channel: 'email', ref: data.id, dryRun: false }
      } catch (err) {
        console.error('[notifier] resend email failed', err)
        return { sent: false, channel: 'email', dryRun: false }
      }
    },
  }
}
