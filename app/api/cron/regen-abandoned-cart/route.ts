import { NextRequest, NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { processRegenAbandonedCartReminders } from "@/lib/regen/abandoned-cart-reminder";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Hourly cron — RE GEN abandoned carts:
 * patient email/SMS with pay link after 2h; staff alert when cart ≥ $150.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.REGEN_ABANDONED_CART_CRON_ENABLED === "false") {
    return NextResponse.json({ patientSent: 0, staffAlerted: 0, reason: "disabled" });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const result = await processRegenAbandonedCartReminders(supabase);
  return NextResponse.json(result);
}
