// POST /api/admin/marketing/app-launch/queue — staff schedules app launch week

import { NextRequest, NextResponse } from "next/server";
import { requireMarketingAccess } from "@/lib/api-auth";
import { queueAppLaunchSocial } from "@/lib/marketing/app-launch-social";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  let force = false;
  let startYmdOverride: string | undefined;
  try {
    const body = (await request.json()) as { force?: boolean; startYmd?: string };
    force = body.force === true;
    if (body.startYmd && /^\d{4}-\d{2}-\d{2}$/.test(body.startYmd)) {
      startYmdOverride = body.startYmd;
    }
  } catch {
    // empty body OK
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    SITE.url;

  const result = await queueAppLaunchSocial({ origin, force, startYmdOverride });

  if (!result.ok && result.reason && !result.inserted?.length) {
    return NextResponse.json(result, {
      status: result.reason.includes("not configured") ? 503 : 400,
    });
  }

  return NextResponse.json(result);
}
