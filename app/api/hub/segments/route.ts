import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubApi } from "@/lib/hub-api-auth";

export const dynamic = "force-dynamic";

function userKeyFrom(req: NextRequest, bodyUser?: string): "dani" | "ryan" {
  const q = (req.nextUrl.searchParams.get("user") || bodyUser || "dani").toLowerCase();
  return q === "ryan" ? "ryan" : "dani";
}

export async function GET(req: NextRequest) {
  const gate = await requireHubApi(req);
  if (gate instanceof NextResponse) return gate;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ segments: [] });

  const userKey = userKeyFrom(req);
  const { data, error } = await admin
    .from("hg_segments")
    .select("id, name, filters_json, created_at")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ segments: data || [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const gate = await requireHubApi(req, body);
  if (gate instanceof NextResponse) return gate;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const name = String(body?.name || "").trim();
  const filters = body?.filters_json ?? body?.filters ?? {};
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const userKey = userKeyFrom(req, body?.user);
  const { data, error } = await admin
    .from("hg_segments")
    .insert({ user_key: userKey, name, filters_json: filters })
    .select("id, name, filters_json, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ segment: data }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const gate = await requireHubApi(req);
  if (gate instanceof NextResponse) return gate;

  const id = Number(req.nextUrl.searchParams.get("id"));
  const userKey = userKeyFrom(req);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { error } = await admin.from("hg_segments").delete().eq("id", id).eq("user_key", userKey);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
