import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  getRxMessageThread,
  listRxMessageThreads,
  listRxThreadMessages,
  markRxMessagesRead,
  sendStaffRxMessage,
} from "@/lib/rx-secure-messages-server";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/ops/messages — ops console inbox (HGRX-080) */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const threadId = req.nextUrl.searchParams.get("threadId");
  if (threadId) {
    const admin = getSupabaseAdminClient();
    if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
    const thread = await getRxMessageThread(threadId);
    if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    const messages = await listRxThreadMessages(admin, threadId);
    await markRxMessagesRead(admin, threadId, "staff");
    return NextResponse.json({ thread, messages });
  }

  const threads = await listRxMessageThreads(80);
  const unread = threads.filter((t) => t.unreadStaff > 0).length;
  return NextResponse.json({ threads, unread });
}

/** POST /api/admin/rx/ops/messages — staff reply from ops console */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let body: { threadId?: string; messageBody?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const threadId = String(body.threadId || "").trim();
  const messageBody = String(body.messageBody || "").trim();
  if (!threadId || !messageBody) {
    return NextResponse.json({ error: "threadId and messageBody required" }, { status: 400 });
  }

  try {
    const message = await sendStaffRxMessage(admin, threadId, messageBody, auth.user.email);
    return NextResponse.json({ ok: true, message });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not send";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
