import type { SupabaseClient } from "@supabase/supabase-js";

import { isDeliverableMarketingEmail } from "@/lib/email-eligibility";
import { getResendFromAddress } from "@/lib/resend-config";
import { sendSMS } from "@/lib/hgos/sms-marketing";
import { getTwilioSmsConfig } from "@/lib/hgos/twilio-config";
import {
  SMS_STUDIO_BATCH_SIZE,
  SMS_STUDIO_THROTTLE_MS,
  type SmsStudioRecipient,
} from "@/lib/sms-studio";

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
  audience_filters: { sendCursor?: number; failureReason?: string } | null;
  started_at?: string | null;
  updated_at?: string | null;
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
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), val || "");
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

export async function seedSmsCampaignRecipients(
  supabase: SupabaseClient,
  campaignId: string,
  recipients: SmsStudioRecipient[],
): Promise<void> {
  if (!recipients.length) return;
  const rows = recipients.map((r) => ({
    campaign_id: campaignId,
    client_id: r.clientId,
    phone_e164: r.phoneE164,
    first_name: r.firstName || null,
    last_name: r.lastName || null,
    status: "pending" as const,
  }));
  // Chunk inserts
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const { error } = await supabase.from("sms_campaign_recipients").insert(chunk);
    if (error) {
      console.error("[campaign-processor] seed recipients:", error.message);
      throw error;
    }
  }
}

async function processSmsLedgerBatch(
  supabase: SupabaseClient,
  campaign: CampaignRow,
  opts: { smsBatchSize: number; throttleMs: number },
): Promise<{
  smsSent: number;
  smsFailed: number;
  done: boolean;
  errors: string[];
  cancelled: boolean;
}> {
  const errors: string[] = [];
  let smsSent = 0;
  let smsFailed = 0;

  // Refresh status — honour cancel
  const { data: fresh } = await supabase
    .from("campaigns")
    .select("status")
    .eq("id", campaign.id)
    .maybeSingle();
  if (fresh?.status === "cancelled") {
    await supabase
      .from("sms_campaign_recipients")
      .update({ status: "cancelled" })
      .eq("campaign_id", campaign.id)
      .eq("status", "pending");
    return { smsSent: 0, smsFailed: 0, done: true, errors, cancelled: true };
  }

  const { data: pending } = await supabase
    .from("sms_campaign_recipients")
    .select("id, phone_e164, first_name, last_name")
    .eq("campaign_id", campaign.id)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(opts.smsBatchSize);

  if (!pending?.length) {
    const { count } = await supabase
      .from("sms_campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaign.id)
      .eq("status", "pending");
    return { smsSent: 0, smsFailed: 0, done: (count ?? 0) === 0, errors, cancelled: false };
  }

  const ids = pending.map((p) => p.id);
  await supabase.from("sms_campaign_recipients").update({ status: "sending" }).in("id", ids);

  const finalSms = ensureOptOut(campaign.sms_content || "");
  const config = getTwilioSmsConfig();

  for (const row of pending) {
    const { data: campCheck } = await supabase
      .from("campaigns")
      .select("status")
      .eq("id", campaign.id)
      .maybeSingle();
    if (campCheck?.status === "cancelled") {
      await supabase
        .from("sms_campaign_recipients")
        .update({ status: "cancelled" })
        .eq("campaign_id", campaign.id)
        .in("status", ["pending", "sending"]);
      return { smsSent, smsFailed, done: true, errors, cancelled: true };
    }

    const msg = personalize(finalSms, {
      firstName: row.first_name || "",
      lastName: row.last_name || "",
    });
    const result = await sendSMS({ to: row.phone_e164, body: msg }, config);
    if (result.success) {
      smsSent++;
      await supabase
        .from("sms_campaign_recipients")
        .update({
          status: "sent",
          twilio_sid: result.messageId ?? null,
          sent_at: new Date().toISOString(),
          error: null,
        })
        .eq("id", row.id);
    } else {
      smsFailed++;
      if (errors.length < 5) errors.push(`${row.phone_e164}: ${result.error}`);
      await supabase
        .from("sms_campaign_recipients")
        .update({
          status: "failed",
          error: (result.error || "send failed").slice(0, 500),
        })
        .eq("id", row.id);
    }
    await new Promise((res) => setTimeout(res, opts.throttleMs));
  }

  const { count: stillPending } = await supabase
    .from("sms_campaign_recipients")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaign.id)
    .eq("status", "pending");

  return {
    smsSent,
    smsFailed,
    done: (stillPending ?? 0) === 0,
    errors,
    cancelled: false,
  };
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
  if (campaign.status === "cancelled") {
    return { emailSent: 0, emailFailed: 0, smsSent: 0, smsFailed: 0, done: true, errors: [] };
  }

  const emailBatchSize = opts.emailBatchSize ?? 40;
  const smsBatchSize = opts.smsBatchSize ?? SMS_STUDIO_BATCH_SIZE;
  const throttleMs = opts.throttleMs ?? (campaign.channel === "sms" ? SMS_STUDIO_THROTTLE_MS : 450);

  const errors: string[] = [];
  let emailSent = 0;
  let emailFailed = 0;
  let smsSent = 0;
  let smsFailed = 0;

  if (campaign.status === "queued") {
    await supabase.from("campaigns").update({ status: "sending" }).eq("id", campaign.id);
  }

  const channel = campaign.channel;

  // SMS Text Studio path — recipient ledger
  if (channel === "sms") {
    const { count: ledgerCount } = await supabase
      .from("sms_campaign_recipients")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaign.id);

    if ((ledgerCount ?? 0) > 0) {
      const batch = await processSmsLedgerBatch(supabase, campaign, { smsBatchSize, throttleMs });
      smsSent = batch.smsSent;
      smsFailed = batch.smsFailed;
      errors.push(...batch.errors);

      const newSmsSent = (campaign.sms_sent ?? 0) + smsSent;
      const newSmsFailed = (campaign.sms_failed ?? 0) + smsFailed;
      const status = batch.cancelled
        ? "cancelled"
        : batch.done
          ? "sent"
          : "sending";

      await supabase
        .from("campaigns")
        .update({
          sms_sent: newSmsSent,
          sms_failed: newSmsFailed,
          status,
          completed_at: batch.done || batch.cancelled ? new Date().toISOString() : null,
        })
        .eq("id", campaign.id);

      return {
        emailSent: 0,
        emailFailed: 0,
        smsSent,
        smsFailed,
        done: batch.done || batch.cancelled,
        errors,
      };
    }
  }

  const recipients = await fetchCampaignRecipients(supabase);
  const cursor = campaign.audience_filters?.sendCursor ?? campaign.email_sent ?? 0;

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
    const smsRecipients = recipients.filter((r) => r.acceptsSms && formatPhone(r.phone || ""));
    const smsSlice = smsRecipients.slice(
      campaign.sms_sent ?? 0,
      (campaign.sms_sent ?? 0) + smsBatchSize,
    );

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
      await new Promise((res) =>
        setTimeout(res, channel === "sms" ? SMS_STUDIO_THROTTLE_MS : 30_000),
      );
    }
  }

  const newCursor = cursor + emailSent + emailFailed;
  const totalEmail = channel === "sms" ? 0 : recipients.length;
  const emailDone = channel === "sms" || newCursor >= totalEmail;
  const smsRecipients = recipients.filter((r) => r.acceptsSms && formatPhone(r.phone || ""));
  const newSmsTotal = (campaign.sms_sent ?? 0) + smsSent + smsFailed;
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

/** Mark campaigns stuck in sending with zero progress for >2h as failed. */
export async function failStuckCampaigns(supabase: SupabaseClient): Promise<number> {
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const { data: stuck } = await supabase
    .from("campaigns")
    .select("id, sms_sent, email_sent, started_at")
    .eq("status", "sending")
    .lt("started_at", cutoff)
    .limit(20);

  let n = 0;
  for (const c of stuck || []) {
    if ((c.sms_sent ?? 0) > 0 || (c.email_sent ?? 0) > 0) continue;
    await supabase
      .from("campaigns")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        audience_filters: { failureReason: "Stuck with zero progress >2h" },
      })
      .eq("id", c.id);
    n++;
  }
  return n;
}
