import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { startConsentsFromSquareBooking } from "@/lib/hub/square-start-consents";
import { originFromRequest } from "@/lib/url/request-origin";

export const dynamic = "force-dynamic";

/**
 * Hub interim: Square booking → HG appointment + core consent packets → kiosk URL.
 * POST { bookingId: string }
 */
export async function POST(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: { bookingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bookingId = String(body.bookingId || "").trim();
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
  }

  const result = await startConsentsFromSquareBooking(admin, bookingId, originFromRequest(req));
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    success: true,
    ...result,
  });
}
