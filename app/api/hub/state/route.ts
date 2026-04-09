import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubApi } from "@/lib/hub-api-auth";

/** Never persist or return Google OAuth *client* credentials via hub state (use Vercel env + /api/auth/google). */
function scrubHubCredentials(credentials: unknown): Record<string, unknown> {
  if (!credentials || typeof credentials !== "object" || Array.isArray(credentials)) {
    return {};
  }
  const out = { ...(credentials as Record<string, unknown>) };
  delete out.gbp;
  return out;
}

function userKeyFrom(req: NextRequest, bodyUser?: string | null): "dani" | "ryan" {
  const q = (req.nextUrl.searchParams.get("user") || bodyUser || "dani").toLowerCase();
  return q === "ryan" ? "ryan" : "dani";
}

export async function GET(req: NextRequest) {
  const gate = await requireHubApi(req);
  if (gate instanceof NextResponse) return gate;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const userKey = userKeyFrom(req);
  const { data, error } = await supabase
    .from("hg_hub_state")
    .select("user_key,expenses,bills,tags,sq_data,credentials,updated_at")
    .eq("user_key", userKey)
    .single();

  if (error && error.code !== "PGRST116") return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) {
    const { data: created, error: insertError } = await supabase
      .from("hg_hub_state")
      .insert({ user_key: userKey })
      .select("user_key,expenses,bills,tags,sq_data,credentials,updated_at")
      .single();
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    return NextResponse.json({
      state: { ...created, credentials: scrubHubCredentials(created.credentials) },
    });
  }

  return NextResponse.json({
    state: { ...data, credentials: scrubHubCredentials(data.credentials) },
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const gate = await requireHubApi(req, body);
  if (gate instanceof NextResponse) return gate;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const userKey = userKeyFrom(req, body?.user);
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (Array.isArray(body?.expenses)) patch.expenses = body.expenses;
  if (Array.isArray(body?.bills)) patch.bills = body.bills;
  if (body?.tags && typeof body.tags === "object") patch.tags = body.tags;
  if (Array.isArray(body?.sq_data)) patch.sq_data = body.sq_data;
  if (body?.credentials && typeof body.credentials === "object") {
    patch.credentials = scrubHubCredentials(body.credentials);
  }

  const { data, error } = await supabase
    .from("hg_hub_state")
    .upsert({ user_key: userKey, ...patch }, { onConflict: "user_key" })
    .select("user_key,expenses,bills,tags,sq_data,credentials,updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    state: { ...data, credentials: scrubHubCredentials(data.credentials) },
  });
}
