// ============================================================
// API: KIOSK TOKEN (staff — requires admin session)
// Generate short-lived URL for iPad kiosk consent signing
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/audit/middleware";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { createKioskConsentSession } from "@/lib/kiosk/create-kiosk-session";
import { originFromRequest } from "@/lib/url/request-origin";

export const dynamic = "force-dynamic";

const STAFF_ROLES = new Set(["owner", "admin", "staff", "provider"]);

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session.role || !STAFF_ROLES.has(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: { appointment_id?: string; staff_user_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const appointmentId = body.appointment_id;
  if (!appointmentId) {
    return NextResponse.json({ error: "appointment_id is required" }, { status: 400 });
  }

  const staffUserId = body.staff_user_id || session.userId || null;
  const result = await createKioskConsentSession(supabase, appointmentId, {
    staffUserId,
    source: "staff",
  });

  if (!result.ok) {
    if (result.code === "no_outstanding") {
      return NextResponse.json({
        success: false,
        message: result.message,
        outstanding_count: 0,
      });
    }
    if (result.code === "appointment_not_found") {
      return NextResponse.json({ error: result.message }, { status: 404 });
    }
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  const origin = originFromRequest(request);
  const url = `${origin}${result.path}`;

  return NextResponse.json({
    success: true,
    url,
    token: result.token,
    expires_at: result.expiresAt,
    expires_in_minutes: 15,
    outstanding_consents: result.templateNames,
    outstanding_count: result.outstandingCount,
  });
}
