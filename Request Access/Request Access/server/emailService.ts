/**
 * CasePort Email Service
 * 
 * Uses the built-in Forge API to send transactional emails.
 * Branded, ABA-compliant, no marketing language.
 */

import { ENV } from './_core/env';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    const res = await fetch(`${ENV.forgeApiUrl}/api/notification/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[EmailService] Failed to send email:', err);
    return false;
  }
}

export async function sendApplicationConfirmation(params: {
  to: string;
  firmName: string;
  fullName: string;
  leadScore: number;
  leadTier: string;
}): Promise<boolean> {
  const { to, firmName, fullName, leadScore, leadTier } = params;

  const tierLabel = {
    platinum: 'Priority Review',
    gold: 'Standard Review',
    silver: 'Standard Review',
    disqualified: 'Under Review',
  }[leadTier] ?? 'Under Review';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received — CasePort</title>
  <style>
    body { margin: 0; padding: 0; background: #0A0E17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #111827; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
    .header { padding: 32px 36px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .logo { font-size: 13px; font-weight: 700; letter-spacing: 0.14em; color: #F1F3F5; text-transform: uppercase; }
    .accent-line { width: 100%; height: 2px; background: linear-gradient(90deg, #22D3EE, #8B5CF6); margin-bottom: 24px; border-radius: 1px; }
    .body { padding: 32px 36px; }
    h1 { margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #F1F3F5; line-height: 1.2; }
    p { margin: 0 0 16px; font-size: 15px; color: #8B95A5; line-height: 1.6; }
    .status-box { background: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.15); border-radius: 10px; padding: 16px 20px; margin: 24px 0; }
    .status-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #22D3EE; margin-bottom: 4px; }
    .status-value { font-size: 15px; font-weight: 600; color: #F1F3F5; }
    .steps { margin: 24px 0 0; }
    .step { display: flex; gap: 12px; margin-bottom: 16px; align-items: flex-start; }
    .step-num { width: 22px; height: 22px; background: rgba(255,255,255,0.06); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #22D3EE; flex-shrink: 0; margin-top: 1px; }
    .step-text { font-size: 14px; color: #8B95A5; line-height: 1.5; }
    .footer { padding: 20px 36px; border-top: 1px solid rgba(255,255,255,0.06); }
    .footer p { font-size: 12px; color: rgba(255,255,255,0.25); margin: 0; line-height: 1.6; }
    a { color: #22D3EE; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="accent-line"></div>
        <div class="logo">CasePort</div>
      </div>
      <div class="body">
        <h1>Application Received</h1>
        <p>Hello ${fullName},</p>
        <p>We have received the private access application from <strong style="color:#F1F3F5">${firmName}</strong>. Your submission is now under manual review by our team.</p>
        
        <div class="status-box">
          <div class="status-label">Review Status</div>
          <div class="status-value">${tierLabel} — Application Under Evaluation</div>
        </div>

        <p>Our review process is intentionally selective. We evaluate each firm against our network standards before granting access. This protects the quality of case flow for every firm in the system.</p>

        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text"><strong style="color:#F1F3F5">Manual review</strong> — Our team evaluates your application against network criteria. This typically takes 24–48 business hours.</div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text"><strong style="color:#F1F3F5">Decision notification</strong> — You will receive a separate email with the outcome and, if approved, next steps for onboarding.</div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text"><strong style="color:#F1F3F5">Onboarding</strong> — Approved firms complete a brief onboarding call and wallet setup before case flow begins.</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>This is a transactional email confirming receipt of your application. Submission does not guarantee approval, market access, or case volume. CasePort operates in compliance with applicable bar association rules and regulations. For questions, contact <a href="mailto:access@caseport.io">access@caseport.io</a>.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Application Received — CasePort

Hello ${fullName},

We have received the private access application from ${firmName}. Your submission is now under manual review by our team.

Review Status: ${tierLabel} — Application Under Evaluation

What happens next:

1. Manual review — Our team evaluates your application against network criteria. This typically takes 24–48 business hours.
2. Decision notification — You will receive a separate email with the outcome and, if approved, next steps for onboarding.
3. Onboarding — Approved firms complete a brief onboarding call and wallet setup before case flow begins.

This is a transactional email confirming receipt of your application. Submission does not guarantee approval, market access, or case volume. For questions, contact access@caseport.io.

CasePort — Case Flow Without Guesswork
  `.trim();

  return sendEmail({ to, subject: 'Application Received — CasePort Private Access', html, text });
}

export async function sendOwnerAlert(params: {
  firmName: string;
  fullName: string;
  email: string;
  leadScore: number;
  leadTier: string;
  applicationId: number;
}): Promise<void> {
  const { firmName, fullName, email, leadScore, leadTier } = params;

  const tierEmoji = { platinum: '🏆', gold: '🥇', silver: '🥈', disqualified: '⚠️' }[leadTier] ?? '📋';

  await sendEmail({
    to: 'access@caseport.io',
    subject: `${tierEmoji} New Application: ${firmName} (Score: ${leadScore})`,
    html: `<p><strong>New CasePort application received.</strong></p>
<ul>
<li><strong>Firm:</strong> ${firmName}</li>
<li><strong>Contact:</strong> ${fullName} (${email})</li>
<li><strong>Lead Score:</strong> ${leadScore}/100</li>
<li><strong>Tier:</strong> ${leadTier.toUpperCase()}</li>
</ul>`,
    text: `New CasePort application received.\n\nFirm: ${firmName}\nContact: ${fullName} (${email})\nLead Score: ${leadScore}/100\nTier: ${leadTier.toUpperCase()}`,
  });
}
