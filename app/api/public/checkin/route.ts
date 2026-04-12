// HG_DEV_007 — Public virtual check-in (QR → /checkin). No auth.

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { checkInClientForToday, findClientsByPhoneLoose } from "@/lib/checkin-lookup";
import { normalizeToE164 } from "@/lib/phone-e164";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Check-in unavailable" }, { status: 503 });
  }

  let body: { phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = String(body?.phone || "").trim();
  if (!raw) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const matches = await findClientsByPhoneLoose(admin, raw);
  if (matches.length === 0) {
    return NextResponse.json(
      { error: "We could not find that phone on file. Please check in with the front desk." },
      { status: 404 },
    );
  }
  if (matches.length > 1) {
    return NextResponse.json(
      { error: "Multiple accounts match. Please check in with the front desk." },
      { status: 409 },
    );
  }

  const c = matches[0];
  const displayName = [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || "Guest";
  const phoneNorm = normalizeToE164(raw);

  const result = await checkInClientForToday(admin, c.id, displayName, phoneNorm);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    success: true,
    message: result.already_checked_in
      ? "You are already checked in. Have a seat — we will be right with you."
      : "You are checked in. Have a seat — we will be right with you.",
    appointment_id: result.appointment_id,
    starts_at: result.starts_at,
    already_checked_in: result.already_checked_in ?? false,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "POST JSON { phone } — use the check-in page on your phone.",
  });
}
