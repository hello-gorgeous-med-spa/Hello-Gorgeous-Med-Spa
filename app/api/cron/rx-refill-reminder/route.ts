import { NextRequest, NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { processRxRefillReminders } from "@/lib/rx-refill-reminder";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Daily cron — SMS, email, and push when GLP-1 or peptide refill is due. */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const result = await processRxRefillReminders(supabase);
  return NextResponse.json(result);
}
