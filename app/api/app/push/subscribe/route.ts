import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

async function getClientFromSession(request: NextRequest): Promise<string | null> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return null;
  const token = request.cookies.get("portal_session")?.value;
  if (!token) return null;
  const { data } = await supabase
    .from("client_sessions")
    .select("client_id")
    .eq("session_token", token)
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();
  return data?.client_id ?? null;
}

export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const clientId = await getClientFromSession(request);
  if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { endpoint, keys } = body ?? {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  // Upsert so re-subscribes don't duplicate
  await supabase.from("push_subscriptions").upsert(
    {
      client_id: clientId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" }
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const clientId = await getClientFromSession(request);
  if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint } = await request.json();
  if (endpoint) {
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint).eq("client_id", clientId);
  }

  return NextResponse.json({ ok: true });
}
