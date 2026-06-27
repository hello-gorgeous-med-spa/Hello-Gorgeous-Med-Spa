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

/** GET /api/admin/rx-messages — thread inbox */
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
  return NextResponse.json({ threads });
}

/** POST /api/admin/rx-messages — staff reply */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let body: { threadId?: string; messageBody?: string; sentBy?: string };
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
    const message = await sendStaffRxMessage(admin, threadId, messageBody, body.sentBy);
    return NextResponse.json({ success: true, message });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not send";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
