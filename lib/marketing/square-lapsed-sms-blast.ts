/**
 * Square lapsed-segment SMS blast — shared by winback cron + Oswego command center.
 */

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { validatePhoneNumber } from "@/lib/hgos/sms-marketing";
import { sendSms } from "@/lib/notifications/sms-outbound";

const SQUARE_API_VERSION = "2025-04-16";
const DEFAULT_MAX_BATCH = 50;
const DEFAULT_COOLDOWN_DAYS = 30;
const LAPSED_GROUP_NAME = "HG Lapsed (90+ Days)";

function getSquareBaseUrl(): string {
  const env = (process.env.SQUARE_ENVIRONMENT ?? "").toLowerCase();
  return env === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

async function squareFetch<T>(path: string): Promise<T> {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error("SQUARE_ACCESS_TOKEN not set");

  const res = await fetch(`${getSquareBaseUrl()}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Square API ${res.status}: ${text}`);
  return text ? JSON.parse(text) : ({} as T);
}

type SquareCustomer = {
  id: string;
  given_name?: string;
  phone_number?: string;
  email_address?: string;
  group_ids?: string[];
};

async function getLapsedGroupId(): Promise<string | null> {
  const data = await squareFetch<{ groups?: { id: string; name: string }[] }>(
    "/v2/customers/groups?limit=50",
  );
  return data.groups?.find((g) => g.name === LAPSED_GROUP_NAME)?.id ?? null;
}

async function getLapsedCustomers(groupId: string): Promise<SquareCustomer[]> {
  const customers: SquareCustomer[] = [];
  let cursor: string | undefined;

  do {
    const qs = new URLSearchParams({ limit: "100" });
    if (cursor) qs.set("cursor", cursor);

    const data = await squareFetch<{ customers?: SquareCustomer[]; cursor?: string }>(
      `/v2/customers?${qs.toString()}`,
    );

    if (data.customers) {
      for (const c of data.customers) {
        if (c.group_ids?.includes(groupId) && c.phone_number) {
          customers.push(c);
        }
      }
    }
    cursor = data.cursor;
  } while (cursor && customers.length < 1000);

  return customers;
}

export type LapsedSmsBlastResult = {
  ok: boolean;
  campaignId: string;
  lapsedGroupId: string | null;
  totalLapsed: number;
  eligibleAfterCooldown: number;
  contacted: number;
  smsSuccess: number;
  smsFailed: number;
  skippedInvalidPhone: number;
  errors: string[];
  runAt: string;
  dryRun: boolean;
};

export async function runSquareLapsedSmsBlast(options: {
  campaignId: string;
  messageForFirstName: (firstName: string) => string;
  dryRun?: boolean;
  maxBatch?: number;
  cooldownDays?: number;
  logTable?: "agent_winback_log";
}): Promise<LapsedSmsBlastResult> {
  const dryRun = options.dryRun ?? false;
  const maxBatch = options.maxBatch ?? DEFAULT_MAX_BATCH;
  const cooldownDays = options.cooldownDays ?? DEFAULT_COOLDOWN_DAYS;

  const result: LapsedSmsBlastResult = {
    ok: false,
    campaignId: options.campaignId,
    lapsedGroupId: null,
    totalLapsed: 0,
    eligibleAfterCooldown: 0,
    contacted: 0,
    smsSuccess: 0,
    smsFailed: 0,
    skippedInvalidPhone: 0,
    errors: [],
    runAt: new Date().toISOString(),
    dryRun,
  };

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    result.errors.push("Supabase not configured");
    return result;
  }

  const groupId = await getLapsedGroupId();
  if (!groupId) {
    result.errors.push(`Square group "${LAPSED_GROUP_NAME}" not found. Run segment sync first.`);
    return result;
  }
  result.lapsedGroupId = groupId;

  const lapsedCustomers = await getLapsedCustomers(groupId);
  result.totalLapsed = lapsedCustomers.length;

  if (lapsedCustomers.length === 0) {
    result.ok = true;
    return result;
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - cooldownDays);

  const phoneNumbers = lapsedCustomers.map((c) => c.phone_number!);
  const { data: recentContacts } = await supabase
    .from("agent_winback_log")
    .select("phone")
    .eq("campaign_id", options.campaignId)
    .gte("contacted_at", cutoffDate.toISOString())
    .in("phone", phoneNumbers);

  const recentlyContactedPhones = new Set((recentContacts ?? []).map((r) => r.phone));

  const eligible = lapsedCustomers.filter((c) => !recentlyContactedPhones.has(c.phone_number!));
  result.eligibleAfterCooldown = eligible.length;

  const batch = eligible.slice(0, maxBatch);

  for (const customer of batch) {
    const phone = customer.phone_number!;
    const firstName = customer.given_name || "Friend";

    const validation = validatePhoneNumber(phone);
    if (!validation.valid) {
      result.skippedInvalidPhone++;
      continue;
    }

    const message = options.messageForFirstName(firstName);

    if (dryRun) {
      result.contacted++;
      result.smsSuccess++;
      continue;
    }

    const smsResult = await sendSms(phone, message);

    const { error: logError } = await supabase.from("agent_winback_log").insert({
      square_customer_id: customer.id,
      phone: validation.formatted,
      email: customer.email_address ?? null,
      first_name: firstName,
      campaign_id: options.campaignId,
      channel: "sms",
      message_preview: message.slice(0, 100),
      sms_sent: smsResult.success,
      sms_message_id: smsResult.providerMessageId,
      sms_error: smsResult.error ?? null,
    });

    if (logError) {
      result.errors.push(`Log error for ${phone}: ${logError.message}`);
    }

    result.contacted++;
    if (smsResult.success) {
      result.smsSuccess++;
    } else {
      result.smsFailed++;
      result.errors.push(`${phone}: ${smsResult.error}`);
    }

    await new Promise((r) => setTimeout(r, 150));
  }

  result.ok = result.errors.length === 0 || result.smsSuccess > 0;
  return result;
}

export async function previewLapsedBlast(campaignId: string): Promise<{
  connected: boolean;
  totalLapsed: number;
  eligibleAfterCooldown: number;
  error?: string;
}> {
  try {
    const groupId = await getLapsedGroupId();
    if (!groupId) {
      return {
        connected: false,
        totalLapsed: 0,
        eligibleAfterCooldown: 0,
        error: `Square group "${LAPSED_GROUP_NAME}" not found`,
      };
    }

    const customers = await getLapsedCustomers(groupId);
    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return {
        connected: true,
        totalLapsed: customers.length,
        eligibleAfterCooldown: customers.length,
      };
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DEFAULT_COOLDOWN_DAYS);
    const phones = customers.map((c) => c.phone_number!);
    const { data: recentContacts } = await supabase
      .from("agent_winback_log")
      .select("phone")
      .eq("campaign_id", campaignId)
      .gte("contacted_at", cutoffDate.toISOString())
      .in("phone", phones);

    const recent = new Set((recentContacts ?? []).map((r) => r.phone));
    const eligible = customers.filter((c) => !recent.has(c.phone_number!)).length;

    return {
      connected: true,
      totalLapsed: customers.length,
      eligibleAfterCooldown: eligible,
    };
  } catch (e) {
    return {
      connected: false,
      totalLapsed: 0,
      eligibleAfterCooldown: 0,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
