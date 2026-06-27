import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  getOrCreateRxMessageThread,
  listRxThreadMessages,
  markRxMessagesRead,
  sendPatientRxMessage,
} from "@/lib/rx-secure-messages-server";
import { verifyRxPatientAccess } from "@/lib/rx-submission-context";

export const dynamic = "force-dynamic";

/** GET /api/rx/messages?token= | ?ref=&email= — patient thread */
export async function GET(req: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const accessToken = req.nextUrl.searchParams.get("token") || "";
  const intakeRef = req.nextUrl.searchParams.get("ref") || "";
  const email = req.nextUrl.searchParams.get("email") || "";

  const verified = await verifyRxPatientAccess(admin, {
    accessToken: accessToken || undefined,
    intakeRef: intakeRef || undefined,
    email: email || undefined,
  });
  if (!verified.ok) return NextResponse.json({ error: verified.error }, { status: 403 });

  const submission = verified.submission;
  const ref = submission.intakeRef;
  const patientEmail =
    submission.clientEmail ||
    String(submission.responses.email || "") ||
    email;

  try {
    const thread = await getOrCreateRxMessageThread(
      admin,
      {
        id: submission.submissionId,
        access_token: submission.accessToken,
        signer_name: submission.clientName,
        client_phone: submission.clientPhone,
        responses_json: submission.responses,
        template_id: "",
      },
      ref,
      patientEmail,
    );
    const messages = await listRxThreadMessages(admin, thread.id);
    await markRxMessagesRead(admin, thread.id, "patient");
    return NextResponse.json({ thread, messages, accessToken: submission.accessToken });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load messages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/rx/messages — patient sends a secure message */
export async function POST(req: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  let body: {
    intakeRef?: string;
    email?: string;
    accessToken?: string;
    messageBody?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messageBody = String(body.messageBody || "").trim();
  if (!messageBody) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const verified = await verifyRxPatientAccess(admin, {
    accessToken: body.accessToken?.trim() || undefined,
    intakeRef: body.intakeRef?.trim() || undefined,
    email: body.email?.trim() || undefined,
  });
  if (!verified.ok) return NextResponse.json({ error: verified.error }, { status: 403 });

  const submission = verified.submission;
  const ref = submission.intakeRef;
  const patientEmail =
    submission.clientEmail ||
    String(submission.responses.email || "") ||
    body.email?.trim() ||
    "";

  try {
    const thread = await getOrCreateRxMessageThread(
      admin,
      {
        id: submission.submissionId,
        access_token: submission.accessToken,
        signer_name: submission.clientName,
        client_phone: submission.clientPhone,
        responses_json: submission.responses,
        template_id: "",
      },
      ref,
      patientEmail,
    );
    const message = await sendPatientRxMessage(admin, thread, messageBody);
    return NextResponse.json({ success: true, message });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not send message";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
