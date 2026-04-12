import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubApi } from "@/lib/hub-api-auth";

export const dynamic = "force-dynamic";

function userKey(body: { user?: string }): "dani" | "ryan" {
  return String(body?.user || "dani").toLowerCase() === "ryan" ? "ryan" : "dani";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const gate = await requireHubApi(req, body);
  if (gate instanceof NextResponse) return gate;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const hubClientId = body?.hub_client_id != null ? String(body.hub_client_id).trim() : "";
  const packageSlug = body?.package_slug != null ? String(body.package_slug).trim() : "";
  const clientUuid = body?.client_id != null ? String(body.client_id).trim() : "";
  const sessions = Number(body?.sessions_remaining);
  if ((!hubClientId && !clientUuid) || !packageSlug) {
    return NextResponse.json({ error: "hub_client_id or client_id, and package_slug required" }, { status: 400 });
  }

  const { data: pkg, error: pe } = await admin
    .from("hg_service_packages")
    .select("id, total_sessions")
    .eq("slug", packageSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (pe || !pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const sessionsRemaining = Number.isFinite(sessions) && sessions > 0 ? Math.floor(sessions) : pkg.total_sessions;

  const row: Record<string, unknown> = {
    package_id: pkg.id,
    sessions_remaining: sessionsRemaining,
    notes: body?.notes ? String(body.notes) : `Assigned from Hub (${userKey(body)})`,
  };
  if (hubClientId) row.hub_client_id = hubClientId;
  if (clientUuid) row.client_id = clientUuid;

  const { data: inserted, error: insErr } = await admin
    .from("hg_client_packages")
    .insert(row)
    .select("id, sessions_remaining, package_id, hub_client_id, client_id")
    .single();

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
  return NextResponse.json({ balance: inserted }, { status: 201 });
}
