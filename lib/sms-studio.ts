/**
 * Hello Gorgeous Text Studio — opt-in audience, quiet hours, cost helpers.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeToE164 } from "@/lib/phone-e164";

export const SMS_COST_PER_SEGMENT_USD = 0.0079;
/** A2P Messaging Service batch size per cron tick. */
export const SMS_STUDIO_BATCH_SIZE = 20;
/** Pause between sends within a batch (ms). */
export const SMS_STUDIO_THROTTLE_MS = 1500;

export type SmsStudioRecipient = {
  clientId: string | null;
  phoneE164: string;
  firstName: string;
  lastName: string;
};

function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^1(\d{10})$/, "$1");
}

/** True 9pm–9am America/Chicago (marketing enqueue blocked). */
export function isSmsQuietHours(now = new Date()): boolean {
  const hourStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    hour12: false,
  }).format(now);
  const hour = Number.parseInt(hourStr, 10);
  if (!Number.isFinite(hour)) return false;
  return hour >= 21 || hour < 9;
}

async function loadOptOutPhoneSet(supabase: SupabaseClient): Promise<Set<string>> {
  const opted = new Set<string>();
  try {
    const { data: outs } = await supabase
      .from("sms_opt_outs")
      .select("phone, resubscribed_at")
      .limit(20000);
    for (const row of outs || []) {
      if (row.resubscribed_at) continue;
      const e164 = normalizeToE164(row.phone);
      if (e164) opted.add(e164);
      const d = phoneDigits(row.phone || "");
      if (d.length === 10) opted.add(d);
    }
  } catch {
    /* table optional */
  }
  try {
    const { data: unsubs } = await supabase.from("unsubscribes").select("phone").limit(20000);
    for (const row of unsubs || []) {
      const e164 = normalizeToE164(row.phone);
      if (e164) opted.add(e164);
      const d = phoneDigits(row.phone || "");
      if (d.length === 10) opted.add(d);
    }
  } catch {
    /* table optional */
  }
  return opted;
}

function isOptedOut(phoneE164: string, optOuts: Set<string>): boolean {
  if (optOuts.has(phoneE164)) return true;
  const d = phoneDigits(phoneE164);
  return d.length === 10 && optOuts.has(d);
}

/**
 * Clients with accepts_sms_marketing + valid phone, minus STOP lists.
 */
export async function fetchSmsStudioRecipients(
  supabase: SupabaseClient,
): Promise<SmsStudioRecipient[]> {
  const optOuts = await loadOptOutPhoneSet(supabase);
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, first_name, last_name, phone, accepts_sms_marketing")
    .eq("accepts_sms_marketing", true)
    .not("phone", "is", null)
    .neq("phone", "")
    .order("id", { ascending: true })
    .limit(20000);

  if (error || !clients?.length) return [];

  const seen = new Set<string>();
  const out: SmsStudioRecipient[] = [];

  for (const c of clients) {
    const phoneE164 = normalizeToE164(c.phone);
    if (!phoneE164 || seen.has(phoneE164) || isOptedOut(phoneE164, optOuts)) continue;
    seen.add(phoneE164);
    out.push({
      clientId: c.id as string,
      phoneE164,
      firstName: c.first_name || "",
      lastName: c.last_name || "",
    });
  }

  return out;
}

export async function countSmsStudioOptIns(supabase: SupabaseClient): Promise<number> {
  return (await fetchSmsStudioRecipients(supabase)).length;
}

/**
 * Intersect pasted numbers with the opt-in list. Returns eligible + skipped counts.
 */
export async function resolveCustomSmsRecipients(
  supabase: SupabaseClient,
  rawPhones: string[],
): Promise<{ recipients: SmsStudioRecipient[]; skippedNotOptedIn: number; skippedInvalid: number }> {
  const optedIn = await fetchSmsStudioRecipients(supabase);
  const byPhone = new Map(optedIn.map((r) => [r.phoneE164, r]));
  const byDigits = new Map(optedIn.map((r) => [phoneDigits(r.phoneE164), r]));

  const seen = new Set<string>();
  const recipients: SmsStudioRecipient[] = [];
  let skippedInvalid = 0;
  let skippedNotOptedIn = 0;

  for (const raw of rawPhones) {
    const e164 = normalizeToE164(raw.trim());
    if (!e164) {
      skippedInvalid++;
      continue;
    }
    if (seen.has(e164)) continue;
    const match = byPhone.get(e164) || byDigits.get(phoneDigits(e164));
    if (!match) {
      skippedNotOptedIn++;
      continue;
    }
    seen.add(e164);
    recipients.push(match);
  }

  return { recipients, skippedNotOptedIn, skippedInvalid };
}

export function estimateSmsCampaign(opts: {
  recipients: number;
  segments: number;
}): { costUsd: number; costLabel: string; minutes: number } {
  const segments = Math.max(1, opts.segments);
  const costUsd = opts.recipients * segments * SMS_COST_PER_SEGMENT_USD;
  // ~20/tick every 2 min ≈ 10/min sustained
  const minutes = Math.max(1, Math.ceil(opts.recipients / 10));
  return {
    costUsd,
    costLabel: `$${costUsd.toFixed(2)}`,
    minutes,
  };
}

/** Count new SMS opt-ins in the last 7 days (best-effort via clients.updated_at if present). */
export async function countRecentSmsOptIns(supabase: SupabaseClient): Promise<number | null> {
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const { count, error } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("accepts_sms_marketing", true)
    .not("phone", "is", null)
    .gte("updated_at", since.toISOString());
  if (error) return null;
  return typeof count === "number" ? count : null;
}
