// ============================================================
// CRON: Process queued marketing campaigns in reliable batches
// (Vercel kills fire-and-forget background work after response)
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import { processCampaignBatch, type CampaignRow } from "@/lib/campaign-processor";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

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
    return NextResponse.json({ processed: 0, message: "No campaigns in queue" });
  }

  const results = [];
  for (const row of campaigns as CampaignRow[]) {
    const result = await processCampaignBatch(supabase, row, { emailBatchSize: EMAIL_BATCH });
    results.push({ id: row.id, name: row.name, ...result });
    if (result.errors.length) {
      console.warn("[cron/process-campaigns]", row.name, result.errors);
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
