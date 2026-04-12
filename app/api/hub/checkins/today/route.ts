import { NextRequest, NextResponse } from "next/server";
import { businessDayToISOBounds } from "@/lib/business-timezone";
import { getBusinessTodayDateString } from "@/lib/business-today";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ checkins: [] });

  const dateOnly = getBusinessTodayDateString();
  const { startISO } = businessDayToISOBounds(dateOnly);

  const { data: rows, error } = await admin
    .from("hg_checkins")
    .select("id, checked_in_at, display_name, phone_normalized, appointment_id, client_id")
    .gte("checked_in_at", startISO)
    .order("checked_in_at", { ascending: false })
    .limit(40);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ checkins: rows || [], business_date: dateOnly });
}
