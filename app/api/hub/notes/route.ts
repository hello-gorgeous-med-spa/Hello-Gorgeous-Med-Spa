import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

function userKeyFrom(req: NextRequest, bodyUser?: string | null): "dani" | "ryan" {
  const q = (req.nextUrl.searchParams.get("user") || bodyUser || "dani").toLowerCase();
  return q === "ryan" ? "ryan" : "dani";
}

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const userKey = userKeyFrom(req);
  const clientId = req.nextUrl.searchParams.get("clientId");
  let query = supabase
    .from("hg_notes")
    .select("id,client_id,client_name,note,created_by,created_at")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false });
  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notes: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const body = await req.json();
  const userKey = userKeyFrom(req, body?.user);
  const clientId = String(body?.client_id || "").trim();
  const note = String(body?.note || "").trim();
  if (!clientId || !note) return NextResponse.json({ error: "client_id and note required" }, { status: 400 });

  const { data, error } = await supabase
    .from("hg_notes")
    .insert({
      user_key: userKey,
      client_id: clientId,
      client_name: body?.client_name ? String(body.client_name) : null,
      note,
      created_by: body?.created_by === "ryan" ? "ryan" : "dani",
    })
    .select("id,client_id,client_name,note,created_by,created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ note: data }, { status: 201 });
}
