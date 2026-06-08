import type { SupabaseClient } from "@supabase/supabase-js";

import { isDeliverableMarketingEmail } from "@/lib/email-eligibility";
import { getResendFromAddress } from "@/lib/resend-config";
import { sendSMS } from "@/lib/hgos/sms-marketing";
import { getTwilioSmsConfig } from "@/lib/hgos/twilio-config";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = getResendFromAddress();

export type CampaignRecipient = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  acceptsSms: boolean;
};

export type CampaignRow = {
  id: string;
  name: string;
  channel: string;
  status: string;
  subject: string | null;
  email_html: string | null;
  sms_content: string | null;
  total_recipients: number;
  email_sent: number;
  email_bounced: number;
  sms_sent: number;
  sms_failed: number;
  audience_filters: { sendCursor?: number } | null;
};

function formatPhone(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

function personalize(text: string, data: Record<string, string>): string {
  let out = text;
  for (const [key, val] of Object.entries(data)) {
    out = out.replace(new RegExp(`\\{${key}\\}`, "g"), val || "");
  }
  return out;
}

function ensureOptOut(msg: string): string {
  const phrases = ["reply stop", "text stop", "opt out", "unsubscribe", "stop to"];
  if (phrases.some((p) => msg.toLowerCase().includes(p))) return msg;
  return `${msg}\n\nReply STOP to unsubscribe.`;
}

async function sendOneEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY missing" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { ok: false, error: d.message || d.error || "Resend error" };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Send failed" };
  }
}

/** Stable audience: clients with email on file, marketing opt-in, valid address. */
export async function fetchCampaignRecipients(
  supabase: SupabaseClient,
): Promise<CampaignRecipient[]> {
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, email, first_name, last_name, phone, accepts_sms_marketing, accepts_email_marketing")
    .not("email", "is", null)
    .order("id", { ascending: true });

  if (error || !clients?.length) return [];

  const seen = new Set<string>();
  const out: CampaignRecipient[] = [];

  for (const c of clients) {
    if (c.accepts_email_marketing === false) continue;
    const email = (c.email ?? "").trim().toLowerCase();
    if (!isDeliverableMarketingEmail(email) || seen.has(email)) continue;
    seen.add(email);
    out.push({
      email,
      firstName: c.first_name || "",
      lastName: c.last_name || "",
      phone: c.phone || null,
      acceptsSms: c.accepts_sms_marketing === true,
    });
  }

  return out;
}

export async function processCampaignBatch(
  supabase: SupabaseClient,
  campaign: CampaignRow,
  opts: { emailBatchSize?: number; smsBatchSize?: number; throttleMs?: number } = {},
): Promise<{
  emailSent: number;
  emailFailed: number;
  smsSent: number;
  smsFailed: number;
  done: boolean;
  errors: string[];
}> {
  const emailBatchSize = opts.emailBatchSize ?? 40;
  const smsBatchSize = opts.smsBatchSize ?? 2;
  const throttleMs = opts.throttleMs ?? 450;

  const recipients = await fetchCampaignRecipients(supabase);
  const cursor = campaign.audience_filters?.sendCursor ?? campaign.email_sent ?? 0;
  const errors: string[] = [];
  let emailSent = 0;
  let emailFailed = 0;
  let smsSent = 0;
  let smsFailed = 0;

  if (campaign.status === "queued") {
    await supabase.from("campaigns").update({ status: "sending" }).eq("id", campaign.id);
  }

  const channel = campaign.channel;

  if (channel === "email" || channel === "multichannel") {
    const slice = recipients.slice(cursor, cursor + emailBatchSize);
    for (const r of slice) {
      const subject = personalize(campaign.subject || "Hello Gorgeous Med Spa", {
        firstName: r.firstName,
        lastName: r.lastName,
      });
      const html = personalize(campaign.email_html || "", {
        firstName: r.firstName,
        lastName: r.lastName,
      });
      const result = await sendOneEmail(r.email, subject, html);
      if (result.ok) emailSent++;
      else {
        emailFailed++;
        if (errors.length < 5) errors.push(`${r.email}: ${result.error}`);
      }
      await new Promise((res) => setTimeout(res, throttleMs));
    }
  }

  if (channel === "sms" || channel === "multichannel") {
    const smsSlice = recipients
      .filter((r) => r.acceptsSms && formatPhone(r.phone || ""))
      .slice(campaign.sms_sent ?? 0, (campaign.sms_sent ?? 0) + smsBatchSize);

    const finalSms = ensureOptOut(campaign.sms_content || "");
    const config = getTwilioSmsConfig();

    for (const r of smsSlice) {
      const phone = formatPhone(r.phone || "");
      if (!phone) continue;
      const msg = personalize(finalSms, { firstName: r.firstName, lastName: r.lastName });
      const result = await sendSMS({ to: phone, body: msg }, config);
      if (result.success) smsSent++;
      else {
        smsFailed++;
        if (errors.length < 5) errors.push(`${phone}: ${result.error}`);
      }
      await new Promise((res) => setTimeout(res, 30_000));
    }
  }

  const newCursor = cursor + emailSent + emailFailed;
  const totalEmail = channel === "sms" ? 0 : recipients.length;
  const emailDone = channel === "sms" || newCursor >= totalEmail;
  const smsRecipients = recipients.filter((r) => r.acceptsSms && formatPhone(r.phone || ""));
  const newSmsTotal = (campaign.sms_sent ?? 0) + smsSent;
  const smsDone = channel === "email" || newSmsTotal >= smsRecipients.length;
  const done = emailDone && smsDone;

  await supabase
    .from("campaigns")
    .update({
      email_sent: (campaign.email_sent ?? 0) + emailSent,
      email_bounced: (campaign.email_bounced ?? 0) + emailFailed,
      sms_sent: (campaign.sms_sent ?? 0) + smsSent,
      sms_failed: (campaign.sms_failed ?? 0) + smsFailed,
      audience_filters: { sendCursor: newCursor },
      status: done ? "sent" : "sending",
      completed_at: done ? new Date().toISOString() : null,
    })
    .eq("id", campaign.id);

  return { emailSent, emailFailed, smsSent, smsFailed, done, errors };
}
