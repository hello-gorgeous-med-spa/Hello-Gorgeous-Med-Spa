// ============================================================
// CRON: Process queued marketing campaigns in reliable batches
// Text Studio SMS: every 2 minutes, Messaging Service batches
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import {
  failStuckCampaigns,
  processCampaignBatch,
  type CampaignRow,
} from "@/lib/campaign-processor";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { SMS_STUDIO_BATCH_SIZE, SMS_STUDIO_THROTTLE_MS } from "@/lib/sms-studio";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const EMAIL_BATCH = 40;

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

  const stuckFailed = await failStuckCampaigns(supabase);

  // Promote due scheduled campaigns
  const now = new Date().toISOString();
  await supabase
    .from("campaigns")
    .update({ status: "queued", started_at: now })
    .eq("status", "scheduled")
    .lte("scheduled_at", now);

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*")
    .in("status", ["queued", "sending"])
    .order("started_at", { ascending: true })
    .limit(3);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!campaigns?.length) {
    return NextResponse.json({
      processed: 0,
      stuckFailed,
      message: "No campaigns in queue",
    });
  }

  const results = [];
  for (const row of campaigns as CampaignRow[]) {
    const isSms = row.channel === "sms";
    const result = await processCampaignBatch(supabase, row, {
      emailBatchSize: EMAIL_BATCH,
      smsBatchSize: isSms ? SMS_STUDIO_BATCH_SIZE : 2,
      throttleMs: isSms ? SMS_STUDIO_THROTTLE_MS : 450,
    });
    results.push({ id: row.id, name: row.name, channel: row.channel, ...result });
    if (result.errors.length) {
      console.warn("[cron/process-campaigns]", row.name, result.errors);
    }
  }

  return NextResponse.json({ processed: results.length, stuckFailed, results });
}
