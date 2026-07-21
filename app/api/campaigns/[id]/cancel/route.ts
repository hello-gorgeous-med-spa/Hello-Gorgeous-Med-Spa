import { NextRequest, NextResponse } from "next/server";

import { requireMarketingAccess } from "@/lib/api-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing campaign id" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, status, channel")
    .eq("id", id)
    .maybeSingle();

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  if (!["queued", "sending", "scheduled"].includes(campaign.status)) {
    return NextResponse.json(
      { error: `Cannot cancel campaign in status "${campaign.status}"` },
      { status: 400 },
    );
  }

  await supabase
    .from("campaigns")
    .update({ status: "cancelled", completed_at: new Date().toISOString() })
    .eq("id", id);

  if (campaign.channel === "sms") {
    await supabase
      .from("sms_campaign_recipients")
      .update({ status: "cancelled" })
      .eq("campaign_id", id)
      .in("status", ["pending", "sending"]);
  }

  return NextResponse.json({ success: true, campaignId: id, status: "cancelled" });
}
