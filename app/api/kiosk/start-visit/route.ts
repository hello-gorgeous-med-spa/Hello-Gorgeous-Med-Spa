import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { startKioskVisit } from "@/lib/kiosk/start-visit";
import { getStaffPortalPin, pinMatches } from "@/lib/staff-session";
import { originFromRequest } from "@/lib/url/request-origin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const expectedPin = getStaffPortalPin();
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: {
    pin?: string;
    phone?: string;
    formIds?: string[];
    firstName?: string;
    lastName?: string;
    clientId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (expectedPin && !pinMatches(String(body.pin || ""), expectedPin)) {
    return NextResponse.json({ error: "Wrong staff PIN." }, { status: 401 });
  }

  const result = await startKioskVisit(supabase, {
    phone: String(body.phone || ""),
    formIds: Array.isArray(body.formIds) ? body.formIds.map(String) : [],
    firstName: body.firstName,
    lastName: body.lastName,
    clientId: body.clientId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const origin = originFromRequest(request);
  return NextResponse.json({
    success: true,
    path: result.path,
    url: `${origin}${result.path}`,
    token: result.token,
    expires_at: result.expiresAt,
    client_name: result.clientName,
    packets_created: result.packetsCreated,
    outstanding_count: result.outstandingCount,
    skipped_already_signed: result.skippedAlreadySigned,
  });
}
