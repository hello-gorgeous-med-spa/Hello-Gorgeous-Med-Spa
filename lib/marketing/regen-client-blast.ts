/**
 * RE GEN marketing blast — email + SMS to opted-in clients.
 */

import { fetchCampaignRecipients, type CampaignRecipient } from "@/lib/campaign-processor";
import { isDeliverableMarketingEmail } from "@/lib/email-eligibility";
import { sendSMS } from "@/lib/hgos/sms-marketing";
import { getTwilioSmsConfig } from "@/lib/hgos/twilio-config";
import { getResendFromAddress } from "@/lib/resend-config";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

const SITE = "https://www.hellogorgeousmedspa.com";

export type RegenBlastResult = {
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

export function regenBlastSmsMessage(firstName: string): string {
  const name = firstName.trim() || "there";
  return [
    `Hello Gorgeous Med Spa:`,
    `Hi ${name}! Introducing RE GEN — NP-supervised weight loss, peptides & hormones shipped across Illinois.`,
    `Real clinic in Oswego. Start: ${SITE}/rx/start?utm_source=sms`,
    `Reply STOP to unsubscribe.`,
  ].join(" ");
}

export function regenBlastEmailHtml(firstName: string): string {
  const name = firstName.trim() || "there";
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111">
      <p>Hi ${name},</p>
      <p><strong>RE GEN</strong> is now available from Hello Gorgeous Med Spa — prescription weight loss, peptides, and hormone programs with nurse-practitioner oversight, shipped across Illinois.</p>
      <p>✓ Real clinic in Oswego — not a sketchy online pharmacy<br/>
      ✓ Ryan Kent, FNP-BC reviews every intake<br/>
      ✓ GLP-1 from $125/mo · transparent pricing</p>
      <p><a href="${SITE}/rx/weight-loss" style="color:#E6007E;font-weight:bold">Explore weight loss →</a><br/>
      <a href="${SITE}/rx" style="color:#E6007E;font-weight:bold">Browse all RE GEN →</a></p>
      <p style="color:#666;font-size:13px">Hello Gorgeous Med Spa · 74 W. Washington St, Oswego IL · (630) 636-6193</p>
    </div>
  `.trim();
}

export function regenBlastEmailSubject(): string {
  return "Introducing RE GEN — prescription care, delivered | Hello Gorgeous";
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
      subject: regenBlastEmailSubject(),
      html,
    }),
  });
  return res.ok;
}

export async function runRegenMarketingBlast(options?: {
  dryRun?: boolean;
  maxRecipients?: number;
  emailOnly?: boolean;
  smsOnly?: boolean;
}): Promise<RegenBlastResult> {
  const dryRun = options?.dryRun ?? true;
  const max = options?.maxRecipients ?? 200;
  const result: RegenBlastResult = {
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
    await processRecipient(r, result, dryRun, options?.emailOnly, options?.smsOnly, twilioConfig);
  }

  result.ok = result.errors.length === 0 || result.emailsSent + result.smsSent > 0;
  return result;
}

async function processRecipient(
  r: CampaignRecipient,
  result: RegenBlastResult,
  dryRun: boolean,
  emailOnly: boolean | undefined,
  smsOnly: boolean | undefined,
  twilioConfig: ReturnType<typeof getTwilioSmsConfig>,
): Promise<void> {
  if (!smsOnly && r.email) {
    if (dryRun) {
      result.emailsSent++;
    } else {
      const ok = await sendEmail(r.email, regenBlastEmailHtml(r.firstName));
      if (ok) result.emailsSent++;
      else result.emailsFailed++;
    }
  }

  if (!emailOnly && r.acceptsSms && r.phone) {
    const msg = regenBlastSmsMessage(r.firstName);
    if (dryRun) {
      result.smsSent++;
    } else {
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
