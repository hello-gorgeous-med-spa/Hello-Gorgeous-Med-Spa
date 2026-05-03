// ============================================================
// BIRTHDAY CAMPAIGN AGENT
// Autonomous agent that sends birthday offers to clients
// Runs on 1st of each month via cron
// Sends SMS with birthday discount offer
// ============================================================

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { validatePhoneNumber } from "@/lib/hgos/sms-marketing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hellogorgeousmedspa.com";
const CAMPAIGN_PREFIX = "birthday";
const DISCOUNT_PERCENT = 15;
const MAX_BATCH_SIZE = 100;

const BIRTHDAY_MESSAGE = (firstName: string) =>
  `🎂 Happy Birthday ${firstName}! 🎉 Celebrate with ${DISCOUNT_PERCENT}% OFF any treatment at Hello Gorgeous this month! Book your birthday glow-up: ${SITE_URL}/book — Love, Danielle & Ryan 💕`;

type Client = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  birthday_month: number | null;
  birthday_last_campaign_year: number | null;
};

export type BirthdayAgentResult = {
  ok: boolean;
  month: number;
  year: number;
  totalClientsWithBirthday: number;
  eligibleAfterFilter: number;
  contacted: number;
  smsSent: number;
  smsFailed: number;
  skippedNoPhone: number;
  skippedAlreadySent: number;
  errors: string[];
  runAt: string;
};

export async function runBirthdayAgent(options?: {
  dryRun?: boolean;
  maxBatch?: number;
  targetMonth?: number; // For testing specific months
}): Promise<BirthdayAgentResult> {
  const dryRun = options?.dryRun ?? false;
  const maxBatch = options?.maxBatch ?? MAX_BATCH_SIZE;
  
  const now = new Date();
  const currentMonth = options?.targetMonth ?? (now.getMonth() + 1); // 1-12
  const currentYear = now.getFullYear();

  const result: BirthdayAgentResult = {
    ok: false,
    month: currentMonth,
    year: currentYear,
    totalClientsWithBirthday: 0,
    eligibleAfterFilter: 0,
    contacted: 0,
    smsSent: 0,
    smsFailed: 0,
    skippedNoPhone: 0,
    skippedAlreadySent: 0,
    errors: [],
    runAt: now.toISOString(),
  };

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    result.errors.push("Supabase not configured");
    return result;
  }

  // Get clients with birthday this month
  const { data: clients, error: fetchError } = await supabase
    .from("clients")
    .select("id, full_name, phone, email, birthday_month, birthday_last_campaign_year")
    .eq("birthday_month", currentMonth)
    .limit(1000);

  if (fetchError) {
    result.errors.push(`Fetch error: ${fetchError.message}`);
    return result;
  }

  if (!clients || clients.length === 0) {
    result.ok = true;
    return result;
  }

  result.totalClientsWithBirthday = clients.length;

  // Filter out clients already contacted this year
  const eligible = (clients as Client[]).filter((c) => {
    if (c.birthday_last_campaign_year === currentYear) {
      result.skippedAlreadySent++;
      return false;
    }
    if (!c.phone) {
      result.skippedNoPhone++;
      return false;
    }
    return true;
  });

  result.eligibleAfterFilter = eligible.length;

  // Batch limit
  const batch = eligible.slice(0, maxBatch);

  for (const client of batch) {
    const phone = client.phone!;
    const firstName = client.full_name?.split(" ")[0] || "Gorgeous";

    const validation = validatePhoneNumber(phone);
    if (!validation.valid) {
      result.skippedNoPhone++;
      continue;
    }

    const message = BIRTHDAY_MESSAGE(firstName);

    if (dryRun) {
      console.log(`[DRY RUN] Birthday SMS to ${phone}: ${message}`);
      result.contacted++;
      result.smsSent++;
      continue;
    }

    const smsResult = await sendSms(validation.formatted, message);

    if (smsResult.success) {
      result.smsSent++;

      // Update client to mark birthday sent
      await supabase
        .from("clients")
        .update({ birthday_last_campaign_year: currentYear })
        .eq("id", client.id);
    } else {
      result.smsFailed++;
      result.errors.push(`${phone}: ${smsResult.error}`);
    }

    result.contacted++;

    // Small delay between sends
    await new Promise((r) => setTimeout(r, 150));
  }

  result.ok = result.errors.length === 0 || result.smsSent > 0;
  return result;
}
