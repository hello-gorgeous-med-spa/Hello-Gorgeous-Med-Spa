// ============================================================
// CRON: Queue 7-day Facebook preset sequence (scheduled_social_posts)
// Pair with /api/cron/scheduled-social-posts (every 15m) to publish.
//
// Opt-in: SOCIAL_AUTO_QUEUE_ENABLED=true — avoids accidental queues on deploy.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { queueSuggestedWeekFromPresets } from "@/lib/social-week-queue";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.SOCIAL_AUTO_QUEUE_ENABLED !== "true") {
    return NextResponse.json(
      {
        enabled: false,
        message:
          "Set SOCIAL_AUTO_QUEUE_ENABLED=true on Vercel to allow weekly auto-queue. Posts still publish via CRON_SECRET + scheduled-social-posts.",
      },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";
  const mondayOverride = url.searchParams.get("monday");

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}` : "") ||
    SITE.url;

  const result = await queueSuggestedWeekFromPresets({
    origin,
    force,
    mondayYmdOverride: mondayOverride && /^\d{4}-\d{2}-\d{2}$/.test(mondayOverride) ? mondayOverride : undefined,
  });

  if (!result.ok && result.reason && !result.inserted?.length) {
    return NextResponse.json(result, { status: result.reason.includes("not configured") ? 503 : 400 });
  }

  return NextResponse.json(result);
}
