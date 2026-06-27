import { NextRequest, NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { processRxCheckoutReminders } from "@/lib/rx-checkout-reminder";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Hourly cron — remind patients with pending RX payment links after 24h. */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.RX_CHECKOUT_REMINDER_CRON_ENABLED === "false") {
    return NextResponse.json({ sent: 0, reason: "disabled" });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const result = await processRxCheckoutReminders(supabase);
  return NextResponse.json(result);
}
