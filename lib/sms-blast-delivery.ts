/**
 * SMS blast delivery ledger. Server-only — talks to Twilio and Supabase.
 * The blast screen reads this through /api/admin/sms-blast.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

const STATUS_RANK: Record<string, number> = {
  queued: 0,
  accepted: 1,
  sending: 2,
  sent: 3,
  delivered: 4,
  undelivered: 5,
  failed: 5,
};

export const BLAST_STATUS_CALLBACK_URL =
  "https://www.hellogorgeousmedspa.com/api/webhooks/twilio-sms";

export type TwilioListedMessage = {
  sid: string;
  to: string;
  status: string;
  errorCode: string | null;
  errorMessage: string | null;
  priceUsd: number | null;
  dateSent: string | null;
};

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return last4 ? `•••${last4}` : "•••";
}

export function normalizeTwilioStatus(status: string | null | undefined): string {
  const value = (status || "queued").toLowerCase();
  if (value === "accepted") return "accepted";
  if (STATUS_RANK[value] != null) return value;
  return value;
}

function priceToUsd(price: string | null | undefined): number | null {
  if (price == null || price === "") return null;
  const n = Number(price);
  if (!Number.isFinite(n)) return null;
  return Math.abs(n);
}

function shouldReplaceStatus(current: string | null | undefined, next: string): boolean {
  const nextRank = STATUS_RANK[next] ?? 1;
  const currentRank = STATUS_RANK[(current || "queued").toLowerCase()] ?? 0;
  return nextRank >= currentRank;
}

export async function pullTwilioOutbound(since: Date): Promise<TwilioListedMessage[]> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!sid || !token) {
    throw new Error("Twilio credentials are not configured");
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const day = since.toISOString().slice(0, 10);
  let url: string | null =
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json?PageSize=200&DateSent%3E=${day}`;

  const out: TwilioListedMessage[] = [];
  for (let page = 0; page < 15 && url; page++) {
    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Twilio message list failed (${response.status}): ${detail.slice(0, 180)}`);
    }
    const data = (await response.json()) as {
      messages?: Array<Record<string, string | null>>;
      next_page_uri?: string | null;
    };
    for (const message of data.messages ?? []) {
      const direction = String(message.direction || "");
      if (direction.startsWith("inbound")) continue;
      const messageSid = message.sid;
      if (!messageSid) continue;
      out.push({
        sid: messageSid,
        to: String(message.to || ""),
        status: normalizeTwilioStatus(message.status),
        errorCode: message.error_code ? String(message.error_code) : null,
        errorMessage: message.error_message ? String(message.error_message).slice(0, 300) : null,
        priceUsd: priceToUsd(message.price),
        dateSent: message.date_sent || message.date_created || null,
      });
    }
    url = data.next_page_uri ? `https://api.twilio.com${data.next_page_uri}` : null;
  }
  return out;
}

export async function upsertTwilioMessages(
  supabase: SupabaseClient,
  messages: TwilioListedMessage[],
): Promise<number> {
  if (messages.length === 0) return 0;
  let written = 0;
  for (let i = 0; i < messages.length; i += 200) {
    const slice = messages.slice(i, i + 200).map((message) => ({
      phone: message.to || "unknown",
      twilio_sid: message.sid,
      status: message.status,
      error_code: message.errorCode,
      error_message: message.errorMessage,
      price_usd: message.priceUsd,
      sent_at: message.dateSent,
      status_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("sms_blast_deliveries").upsert(slice, {
      onConflict: "twilio_sid",
    });
    if (error) throw new Error(error.message);
    written += slice.length;
  }

  const sids = messages.map((message) => message.sid);
  const blastIds = new Set<string>();
  for (let i = 0; i < sids.length; i += 200) {
    const { data } = await supabase
      .from("sms_blast_deliveries")
      .select("blast_id")
      .in("twilio_sid", sids.slice(i, i + 200))
      .not("blast_id", "is", null);
    for (const row of data ?? []) {
      if (row.blast_id) blastIds.add(row.blast_id as string);
    }
  }
  for (const blastId of blastIds) {
    await rollupBlast(supabase, blastId);
  }
  return written;
}

export async function applyTwilioStatus(
  supabase: SupabaseClient,
  input: {
    sid: string;
    status: string;
    errorCode?: string | null;
    errorMessage?: string | null;
  },
): Promise<void> {
  const next = normalizeTwilioStatus(input.status);
  const { data: existing } = await supabase
    .from("sms_blast_deliveries")
    .select("id, blast_id, status")
    .eq("twilio_sid", input.sid)
    .maybeSingle();

  if (!existing) return;
  if (!shouldReplaceStatus(existing.status as string, next)) return;

  await supabase
    .from("sms_blast_deliveries")
    .update({
      status: next,
      error_code: input.errorCode || null,
      error_message: input.errorMessage ? input.errorMessage.slice(0, 300) : null,
      status_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id);

  if (existing.blast_id) {
    await rollupBlast(supabase, existing.blast_id as string);
  }
}

export async function rollupBlast(supabase: SupabaseClient, blastId: string): Promise<void> {
  const { data, error } = await supabase
    .from("sms_blast_deliveries")
    .select("status")
    .eq("blast_id", blastId);
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const count = (status: string) => rows.filter((row) => row.status === status).length;
  const queued = count("queued") + count("sending");
  const delivered = count("delivered");
  const failed = count("failed");
  const undelivered = count("undelivered");
  const accepted = rows.filter((row) =>
    ["accepted", "sending", "sent", "delivered"].includes(String(row.status)),
  ).length;

  await supabase
    .from("sms_blasts")
    .update({
      recipient_count: rows.length,
      accepted_count: accepted,
      delivered_count: delivered,
      failed_count: failed + undelivered,
      undelivered_count: undelivered,
      status: queued > 0 ? "sending" : failed + undelivered === rows.length && rows.length > 0 ? "failed" : "sent",
      sent_at: queued > 0 ? null : new Date().toISOString(),
    })
    .eq("id", blastId);
}

export function summarizeTwilio(messages: TwilioListedMessage[]) {
  const byStatus: Record<string, number> = {};
  let priceUsd = 0;
  for (const message of messages) {
    byStatus[message.status] = (byStatus[message.status] ?? 0) + 1;
    priceUsd += message.priceUsd ?? 0;
  }
  const failures = messages
    .filter((message) => message.status === "failed" || message.status === "undelivered")
    .slice(0, 40)
    .map((message) => ({
      at: message.dateSent,
      toLast4: maskPhone(message.to),
      status: message.status,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
    }));
  return {
    outbound: messages.length,
    byStatus,
    priceUsd: Math.round(priceUsd * 100) / 100,
    failures,
  };
}
