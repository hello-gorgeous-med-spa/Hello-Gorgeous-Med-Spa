import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getPortalClientSession } from "@/lib/portal/session";
import {
  loadPortalRxMessageSummary,
  loadPortalRxThreadMessages,
  sendPortalRxMessage,
} from "@/lib/rx-portal-messages";

export const dynamic = "force-dynamic";

/** GET /api/portal/rx/messages — care team threads + optional thread messages */
export async function GET(req: NextRequest) {
  const session = await getPortalClientSession(req);
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const threadId = req.nextUrl.searchParams.get("threadId")?.trim();

  if (threadId) {
    const loaded = await loadPortalRxThreadMessages(admin, threadId, session.email);
    if (!loaded) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    return NextResponse.json(loaded);
  }

  const summary = await loadPortalRxMessageSummary(admin, session.clientId, session.email);
  return NextResponse.json(summary);
}

/** POST /api/portal/rx/messages — send message to care team */
export async function POST(req: NextRequest) {
  const session = await getPortalClientSession(req);
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let body: { messageBody?: string; threadId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messageBody = String(body.messageBody || "").trim();
  if (!messageBody) return NextResponse.json({ error: "Message required" }, { status: 400 });

  try {
    const result = await sendPortalRxMessage(
      admin,
      session.clientId,
      session.email,
      messageBody,
      body.threadId,
    );
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not send message";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
