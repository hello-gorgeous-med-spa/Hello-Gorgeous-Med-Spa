import { NextRequest, NextResponse } from "next/server";
import { requireMarketingAccess } from "@/lib/api-auth";
import { mapNotificationRow } from "@/lib/command-center";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

function noDb() {
  return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
}

export async function GET(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;
  if (auth.user.role !== "owner" && auth.user.role !== "admin") {
    return NextResponse.json({ notifications: [] });
  }

  const db = getSupabase();
  if (!db) return noDb();

  const { data, error } = await db
    .from("hg_cc_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    notifications: (data || []).map((r) => mapNotificationRow(r as Record<string, unknown>)),
  });
}

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const body = await request.json().catch(() => null);
  const text = String(body?.text || "").trim();
  if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

  const { data, error } = await db
    .from("hg_cc_notifications")
    .insert({
      body: text,
      delivery: String(body?.delivery || "Logged in Command Center"),
      unread: true,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    notification: mapNotificationRow(data as Record<string, unknown>),
  });
}

export async function PATCH(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;
  if (auth.user.role !== "owner" && auth.user.role !== "admin") {
    return NextResponse.json({ error: "Owner only" }, { status: 403 });
  }

  const db = getSupabase();
  if (!db) return noDb();

  await db.from("hg_cc_notifications").update({ unread: false }).eq("unread", true);
  return NextResponse.json({ ok: true });
}
