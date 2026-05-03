// ============================================================
// WIN-BACK AGENT
// Autonomous agent that contacts lapsed clients (90+ days)
// Runs weekly via cron, sends SMS with $25 off offer
// Tracks outreach to prevent spam (30-day cooldown)
// ============================================================

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { validatePhoneNumber } from "@/lib/hgos/sms-marketing";

const SQUARE_API_VERSION = "2025-04-16";
const CAMPAIGN_ID = "lapsed_winback_v1";
const COOLDOWN_DAYS = 30; // Don't contact same person within 30 days
const MAX_BATCH_SIZE = 50; // Limit per run to avoid timeout / cost spikes

// Win-back message template
const WINBACK_MESSAGE = (firstName: string) =>
  `${firstName}, it's been a while! 💕 We'd love to see you — enjoy $25 off your next visit at Hello Gorgeous. Book before it expires: hellogorgeousmedspa.com/book`;

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
  family_name?: string;
  phone_number?: string;
  email_address?: string;
  group_ids?: string[];
};

async function getLapsedGroupId(): Promise<string | null> {
  const data = await squareFetch<{ groups?: { id: string; name: string }[] }>(
    "/v2/customers/groups?limit=50"
  );
  const group = data.groups?.find((g) => g.name === "HG Lapsed (90+ Days)");
  return group?.id ?? null;
}

async function getLapsedCustomers(groupId: string): Promise<SquareCustomer[]> {
  const customers: SquareCustomer[] = [];
  let cursor: string | undefined;

  do {
    const qs = new URLSearchParams({ limit: "100" });
    if (cursor) qs.set("cursor", cursor);

    const data = await squareFetch<{
      customers?: SquareCustomer[];
      cursor?: string;
    }>(`/v2/customers?${qs.toString()}`);

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

export type WinbackResult = {
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
};

export async function runWinbackAgent(options?: {
  dryRun?: boolean;
  maxBatch?: number;
}): Promise<WinbackResult> {
  const dryRun = options?.dryRun ?? false;
  const maxBatch = options?.maxBatch ?? MAX_BATCH_SIZE;

  const result: WinbackResult = {
    ok: false,
    campaignId: CAMPAIGN_ID,
    lapsedGroupId: null,
    totalLapsed: 0,
    eligibleAfterCooldown: 0,
    contacted: 0,
    smsSuccess: 0,
    smsFailed: 0,
    skippedInvalidPhone: 0,
    errors: [],
    runAt: new Date().toISOString(),
  };

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    result.errors.push("Supabase not configured");
    return result;
  }

  // 1. Get the lapsed group from Square
  const groupId = await getLapsedGroupId();
  if (!groupId) {
    result.errors.push(
      'Square group "HG Lapsed (90+ Days)" not found. Run segment sync first.'
    );
    return result;
  }
  result.lapsedGroupId = groupId;

  // 2. Get lapsed customers with phone numbers
  const lapsedCustomers = await getLapsedCustomers(groupId);
  result.totalLapsed = lapsedCustomers.length;

  if (lapsedCustomers.length === 0) {
    result.ok = true;
    return result;
  }

  // 3. Filter out anyone contacted in the last COOLDOWN_DAYS
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - COOLDOWN_DAYS);

  const phoneNumbers = lapsedCustomers.map((c) => c.phone_number!);
  const { data: recentContacts } = await supabase
    .from("agent_winback_log")
    .select("phone")
    .eq("campaign_id", CAMPAIGN_ID)
    .gte("contacted_at", cutoffDate.toISOString())
    .in("phone", phoneNumbers);

  const recentlyContactedPhones = new Set(
    (recentContacts ?? []).map((r) => r.phone)
  );

  const eligible = lapsedCustomers.filter(
    (c) => !recentlyContactedPhones.has(c.phone_number!)
  );
  result.eligibleAfterCooldown = eligible.length;

  // 4. Batch limit
  const batch = eligible.slice(0, maxBatch);

  // 5. Send SMS to each
  for (const customer of batch) {
    const phone = customer.phone_number!;
    const firstName = customer.given_name || "Friend";

    // Validate phone
    const validation = validatePhoneNumber(phone);
    if (!validation.valid) {
      result.skippedInvalidPhone++;
      continue;
    }

    const message = WINBACK_MESSAGE(firstName);

    if (dryRun) {
      console.log(`[DRY RUN] Would send to ${phone}: ${message}`);
      result.contacted++;
      result.smsSuccess++;
      continue;
    }

    // Send SMS
    const smsResult = await sendSms(phone, message);

    // Log to database
    const { error: logError } = await supabase.from("agent_winback_log").insert({
      square_customer_id: customer.id,
      phone: validation.formatted,
      email: customer.email_address ?? null,
      first_name: firstName,
      campaign_id: CAMPAIGN_ID,
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

    // Small delay between sends
    await new Promise((r) => setTimeout(r, 150));
  }

  result.ok = result.errors.length === 0 || result.smsSuccess > 0;
  return result;
}
