import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { loadRegenPublicOrderStatus } from "@/lib/regen/order-status-public";

export const dynamic = "force-dynamic";

/** GET ?ref=RG-xxx — patient-safe RE GEN order + telehealth visit status (no auth). */
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")?.trim();
  if (!ref) {
    return NextResponse.json({ error: "ref is required" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const status = await loadRegenPublicOrderStatus(admin, ref);
  if (!status) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order: status });
}
