/**
 * FlowWave shockwave marketing blast — email + SMS to opted-in clients.
 */

import { fetchCampaignRecipients, type CampaignRecipient } from "@/lib/campaign-processor";
import { isDeliverableMarketingEmail } from "@/lib/email-eligibility";
import { sendSMS } from "@/lib/hgos/sms-marketing";
import { getTwilioSmsConfig } from "@/lib/hgos/twilio-config";
import { FLOWWAVE_INTRO_PRICE } from "@/lib/flowwave-marketing";
import { getResendFromAddress } from "@/lib/resend-config";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

const SITE = "https://www.hellogorgeousmedspa.com";

export type FlowwaveBlastResult = {
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

export function flowwaveBlastSmsMessage(firstName: string): string {
  const name = firstName.trim() || "there";
  return [
    `Hello Gorgeous Med Spa:`,
    `Hi ${name}! NEW FlowWave FOCUS shockwave therapy — deep-tissue pain relief & recovery in Oswego.`,
    `Intro ${FLOWWAVE_INTRO_PRICE} first session. Book: ${SITE}/services/flowwave/start?utm_source=sms`,
    `Reply STOP to unsubscribe.`,
  ].join(" ");
}

export function flowwaveBlastEmailHtml(firstName: string): string {
  const name = firstName.trim() || "there";
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111">
      <p>Hi ${name},</p>
      <p><strong>FlowWave FOCUS</strong> shockwave therapy is now at Hello Gorgeous Med Spa — focused acoustic waves for pain, recovery, and men's wellness. NP-directed in Oswego.</p>
      <p>✓ Intro ${FLOWWAVE_INTRO_PRICE} first session (any area)<br/>
      ✓ 3–10 minute sessions · no downtime<br/>
      ✓ Medical screening before every treatment</p>
      <p><a href="${SITE}/services/flowwave" style="color:#E6007E;font-weight:bold">Explore FlowWave →</a><br/>
      <a href="${SITE}/book" style="color:#E6007E;font-weight:bold">Book free screening →</a></p>
      <p style="color:#666;font-size:13px">Hello Gorgeous Med Spa · 74 W. Washington St, Oswego IL · (630) 636-6193</p>
    </div>
  `.trim();
}

export function flowwaveBlastEmailSubject(): string {
  return `FlowWave shockwave therapy — intro ${FLOWWAVE_INTRO_PRICE} | Hello Gorgeous`;
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
      subject: flowwaveBlastEmailSubject(),
      html,
    }),
  });
  return res.ok;
}

export async function runFlowwaveMarketingBlast(options?: {
  dryRun?: boolean;
  maxRecipients?: number;
  emailOnly?: boolean;
  smsOnly?: boolean;
}): Promise<FlowwaveBlastResult> {
  const dryRun = options?.dryRun ?? true;
  const max = options?.maxRecipients ?? 200;
  const result: FlowwaveBlastResult = {
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
        const ok = await sendEmail(r.email, flowwaveBlastEmailHtml(r.firstName));
        if (ok) result.emailsSent++;
        else result.emailsFailed++;
      }
    }
    if (!options?.emailOnly && r.acceptsSms && r.phone) {
      const msg = flowwaveBlastSmsMessage(r.firstName);
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
