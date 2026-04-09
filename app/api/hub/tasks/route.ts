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
  const { data, error } = await supabase
    .from("hg_tasks")
    .select("id,text,assignee,done,created_by,created_at,updated_at")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tasks: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const body = await req.json();
  const text = String(body?.text || "").trim();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  const userKey = userKeyFrom(req, body?.user);
  const assignee = ["dani", "ryan", "both"].includes(body?.assignee) ? body.assignee : "both";
  const createdBy = body?.created_by === "ryan" ? "ryan" : "dani";

  const { data, error } = await supabase
    .from("hg_tasks")
    .insert({ user_key: userKey, text, assignee, created_by: createdBy })
    .select("id,text,assignee,done,created_by,created_at,updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ task: data }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const body = await req.json();
  const id = Number(body?.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "id required" }, { status: 400 });
  const userKey = userKeyFrom(req, body?.user);

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body?.done === "boolean") patch.done = body.done;
  if (typeof body?.text === "string" && body.text.trim()) patch.text = body.text.trim();
  if (["dani", "ryan", "both"].includes(body?.assignee)) patch.assignee = body.assignee;

  const { data, error } = await supabase
    .from("hg_tasks")
    .update(patch)
    .eq("id", id)
    .eq("user_key", userKey)
    .select("id,text,assignee,done,created_by,created_at,updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ task: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const id = Number(req.nextUrl.searchParams.get("id"));
  const userKey = userKeyFrom(req);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("hg_tasks").delete().eq("id", id).eq("user_key", userKey);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
