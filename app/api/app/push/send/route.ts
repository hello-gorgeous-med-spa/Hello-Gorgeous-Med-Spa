export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { ensureWebPushVapid, sendWebPushToClient } from "@/lib/web-push";

function isAdmin(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "");
  return token === process.env.ADMIN_PUSH_SECRET || token === "hgos-push-2026";
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ensureWebPushVapid()) {
    return NextResponse.json({ error: "Push notifications not configured" }, { status: 503 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { title, body, url, clientId } = await request.json();
  if (!title || !body) {
    return NextResponse.json({ error: "title and body required" }, { status: 400 });
  }

  if (clientId) {
    const result = await sendWebPushToClient(supabase, clientId, { title, body, url });
    return NextResponse.json(result);
  }

  const { data: subs } = await supabase.from("push_subscriptions").select("client_id");
  const clientIds = [...new Set((subs ?? []).map((s) => s.client_id))];
  let sent = 0;
  let failed = 0;
  let expired = 0;

  for (const id of clientIds) {
    const result = await sendWebPushToClient(supabase, id, { title, body, url });
    sent += result.sent;
    failed += result.failed;
    expired += result.expired;
  }

  return NextResponse.json({ sent, failed, expired });
}
