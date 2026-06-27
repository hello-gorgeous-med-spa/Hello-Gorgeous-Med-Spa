import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  getOrCreateRxMessageThread,
  listRxThreadMessages,
  markRxMessagesRead,
  sendPatientRxMessage,
  verifyRxMessageAccess,
} from "@/lib/rx-secure-messages-server";

export const dynamic = "force-dynamic";

/** GET /api/rx/messages?ref=&email= — patient thread (verify ref + email) */
export async function GET(req: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const intakeRef = req.nextUrl.searchParams.get("ref") || "";
  const email = req.nextUrl.searchParams.get("email") || "";
  const verified = await verifyRxMessageAccess(admin, intakeRef, email);
  if (!verified.ok) return NextResponse.json({ error: verified.error }, { status: 403 });

  try {
    const thread = await getOrCreateRxMessageThread(admin, verified.submission, intakeRef, email);
    const messages = await listRxThreadMessages(admin, thread.id);
    await markRxMessagesRead(admin, thread.id, "patient");
    return NextResponse.json({ thread, messages });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load messages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/rx/messages — patient sends a secure message */
export async function POST(req: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let body: { intakeRef?: string; email?: string; messageBody?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const intakeRef = String(body.intakeRef || "").trim();
  const email = String(body.email || "").trim();
  const messageBody = String(body.messageBody || "").trim();
  if (!messageBody) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const verified = await verifyRxMessageAccess(admin, intakeRef, email);
  if (!verified.ok) return NextResponse.json({ error: verified.error }, { status: 403 });

  try {
    const thread = await getOrCreateRxMessageThread(admin, verified.submission, intakeRef, email);
    const message = await sendPatientRxMessage(admin, thread, messageBody);
    return NextResponse.json({ success: true, message });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not send message";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
