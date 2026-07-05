/**
 * Your Brow Journey marketing blast — email + SMS to opted-in clients.
 */

import { fetchCampaignRecipients } from "@/lib/campaign-processor";
import { isDeliverableMarketingEmail } from "@/lib/email-eligibility";
import { sendSMS } from "@/lib/hgos/sms-marketing";
import { getTwilioSmsConfig } from "@/lib/hgos/twilio-config";
import { BROW_JOURNEY_PATH, BROW_JOURNEY_PRICING } from "@/lib/brow-journey-marketing";
import { getResendFromAddress } from "@/lib/resend-config";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

const SITE = "https://www.hellogorgeousmedspa.com";

export type BrowBlastResult = {
  ok: boolean;
  dryRun: boolean;
  totalRecipients: number;
  emailsSent: number;
  emailsFailed: number;
  smsSent: number;
  smsFailed: number;
  errors: string[];
  runAt: string;
};

export function browBlastSmsMessage(firstName: string): string {
  const name = firstName.trim() || "there";
  return [
    `Hello Gorgeous Med Spa:`,
    `Hi ${name}! Your Brow Journey is here — microblading & brow PMU by Jen Vokoun in Oswego.`,
    `Meet Jen special from ${BROW_JOURNEY_PRICING.meetMicroblading}. Book: ${SITE}${BROW_JOURNEY_PATH}?utm_source=sms`,
    `Reply STOP to unsubscribe.`,
  ].join(" ");
}

export function browBlastEmailHtml(firstName: string): string {
  const name = firstName.trim() || "there";
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111">
      <p>Hi ${name},</p>
      <p><strong>Your Brow Journey</strong> is live at Hello Gorgeous — microblading, powder, combo & nano brows by Jen Vokoun, with NP-directed screening in Oswego.</p>
      <p>✓ Custom brow mapping · Tina Davies pigments<br/>
      ✓ Perfecting touch-up included<br/>
      ✓ Meet Jen special from ${BROW_JOURNEY_PRICING.meetMicroblading}<br/>
      ✓ 0% APR financing with Cherry</p>
      <p><a href="${SITE}${BROW_JOURNEY_PATH}" style="color:#E6007E;font-weight:bold">Explore Your Brow Journey →</a><br/>
      <a href="${SITE}/book" style="color:#E6007E;font-weight:bold">Book free consult →</a></p>
      <p style="color:#666;font-size:13px">Hello Gorgeous Med Spa · 74 W. Washington St, Oswego IL · (630) 636-6193</p>
    </div>
  `.trim();
}

export function browBlastEmailSubject(): string {
  return `Your Brow Journey — microblading by Jen Vokoun | Hello Gorgeous`;
}

async function sendEmail(to: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  if (!isDeliverableMarketingEmail(to)) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getResendFromAddress(),
      to,
      subject: browBlastEmailSubject(),
      html,
    }),
  });
  return res.ok;
}

export async function runBrowMarketingBlast(options?: {
  dryRun?: boolean;
  maxRecipients?: number;
  emailOnly?: boolean;
  smsOnly?: boolean;
}): Promise<BrowBlastResult> {
  const dryRun = options?.dryRun ?? true;
  const max = options?.maxRecipients ?? 200;
  const result: BrowBlastResult = {
    ok: false,
    dryRun,
    totalRecipients: 0,
    emailsSent: 0,
    emailsFailed: 0,
    smsSent: 0,
    smsFailed: 0,
    errors: [],
    runAt: new Date().toISOString(),
  };

  const admin = createAdminSupabaseClient();
  if (!admin) {
    result.errors.push("Supabase not configured");
    return result;
  }

  const recipients = (await fetchCampaignRecipients(admin)).slice(0, max);
  result.totalRecipients = recipients.length;

  if (!recipients.length) {
    result.ok = true;
    return result;
  }

  const twilioConfig = getTwilioSmsConfig();

  for (const r of recipients) {
    if (!options?.smsOnly && r.email) {
      if (dryRun) result.emailsSent++;
      else {
        const ok = await sendEmail(r.email, browBlastEmailHtml(r.firstName));
        if (ok) result.emailsSent++;
        else result.emailsFailed++;
      }
    }
    if (!options?.emailOnly && r.acceptsSms && r.phone) {
      const msg = browBlastSmsMessage(r.firstName);
      if (dryRun) result.smsSent++;
      else {
        try {
          const smsRes = await sendSMS({ to: r.phone, body: msg }, twilioConfig);
          if (smsRes.success) result.smsSent++;
          else {
            result.smsFailed++;
            if (smsRes.error) result.errors.push(`${r.phone}: ${smsRes.error}`);
          }
        } catch (e) {
          result.smsFailed++;
          result.errors.push(e instanceof Error ? e.message : String(e));
        }
      }
    }
  }

  result.ok = result.errors.length === 0 || result.emailsSent + result.smsSent > 0;
  return result;
}
