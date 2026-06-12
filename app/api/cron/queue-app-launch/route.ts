// ============================================================
// CRON / manual: Queue 7-day Hello Gorgeous app launch (FB + Google)
// Pair with /api/cron/scheduled-social-posts (every 15m) to publish.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { queueAppLaunchSocial } from "@/lib/marketing/app-launch-social";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";
  const startOverride = url.searchParams.get("start");

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}` : "") ||
    SITE.url;

  const result = await queueAppLaunchSocial({
    origin,
    force,
    startYmdOverride:
      startOverride && /^\d{4}-\d{2}-\d{2}$/.test(startOverride) ? startOverride : undefined,
  });

  if (!result.ok && result.reason && !result.inserted?.length) {
    return NextResponse.json(result, {
      status: result.reason.includes("not configured") ? 503 : 400,
    });
  }

  return NextResponse.json(result);
}
