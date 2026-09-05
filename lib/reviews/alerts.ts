import { MEDSPA_OPS_EMAIL, MEDSPA_SEND_FROM } from '@/lib/business-contact';

const OWNER_EMAIL = process.env.REVIEW_ALERT_EMAIL || MEDSPA_OPS_EMAIL;
const OWNER_CELL = process.env.REVIEW_ALERT_PHONE || '+16308813398';

async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) return false;
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  return r.ok;
}

async function sendEmail(subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.RESEND_FROM_EMAIL || MEDSPA_SEND_FROM;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [OWNER_EMAIL], subject, html }),
  });
  return r.ok;
}

/** One alert per cron batch — not per patient. */
export async function alertReviewRequestFailures(input: {
  failed: number;
  reasons: string[];
  pendingDue?: number;
}): Promise<{ emailed: boolean; texted: boolean }> {
  if (input.failed < 1) return { emailed: false, texted: false };

  const reasonList = [...new Set(input.reasons.filter(Boolean))].slice(0, 5).join(' · ') || 'unknown';
  const subject = `Review ask failed — ${input.failed} patient${input.failed === 1 ? '' : 's'} did not get a Google link`;
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
    <h1 style="color:#E6007E;font-size:20px;margin:0 0 8px;">Google review ask failed</h1>
    <p style="color:#444;font-size:15px;line-height:1.5;">
      ${input.failed} Square 24-hour review request${input.failed === 1 ? '' : 's'} did not send SMS or email.
      Those patients are still in the queue and will retry on the next hourly cron.
    </p>
    <p style="color:#111;font-size:14px;"><strong>Why:</strong> ${reasonList}</p>
    ${input.pendingDue != null ? `<p style="color:#444;font-size:14px;">Still due in queue: ${input.pendingDue}</p>` : ''}
    <p style="color:#888;font-size:13px;margin-top:16px;">Check Admin → Marketing → Google review automation.</p>
  </div>`;

  const sms = `HG review ask FAILED for ${input.failed} patient${input.failed === 1 ? '' : 's'}. ${reasonList}. They stay in queue for retry.`;

  const emailed = await sendEmail(subject, html);
  const texted = await sendSms(OWNER_CELL, sms);
  return { emailed, texted };
}
