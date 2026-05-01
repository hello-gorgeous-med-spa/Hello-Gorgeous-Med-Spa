// AI Concierge — diagnostics self-test.
// Server-to-server simulation: signs a synthetic Twilio payload with the project's
// TWILIO_AUTH_TOKEN and POSTs to /api/ai-concierge/voice/incoming. Returns the
// response, asserts on TwiML, and verifies an ai_concierge_calls row landed.
//
// Synthetic CallSids are prefixed `selftest-` so staff can spot them in the calls
// table; the row is also tagged `summary='selftest'` and cleaned up by default.

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { canonicalWebhookUrl } from "@/lib/ai-concierge/webhook-url";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type CleanupMode = "delete" | "keep";

export async function POST(request: NextRequest) {
  const session = await getAiConciergeStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = canonicalWebhookUrl(request);
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!token) {
    return NextResponse.json(
      { ok: false, step: "config", error: "TWILIO_AUTH_TOKEN is not set; cannot sign self-test." },
      { status: 200 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const cleanup: CleanupMode = body?.cleanup === "keep" ? "keep" : "delete";

  const callSid = `selftest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const fromNumber = "+15555550123";
  const toNumber = process.env.TWILIO_PHONE_NUMBER?.trim() || "+15555550199";

  const params: Record<string, string> = {
    CallSid: callSid,
    From: fromNumber,
    To: toNumber,
    CallStatus: "ringing",
    Direction: "inbound",
    AccountSid: process.env.TWILIO_ACCOUNT_SID?.trim() || "ACselftest",
  };

  const formBody = new URLSearchParams(params).toString();
  const signature = twilio.getExpectedTwilioSignature(token, url, params);

  let webhookStatus = 0;
  let webhookText = "";
  let webhookError: string | undefined;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Twilio-Signature": signature,
        // Hint downstream signature rebuilder that we used the same proto/host.
        "X-Forwarded-Host": new URL(url).host,
        "X-Forwarded-Proto": new URL(url).protocol.replace(":", ""),
      },
      body: formBody,
      cache: "no-store",
    });
    webhookStatus = res.status;
    webhookText = await res.text();
  } catch (e) {
    webhookError = e instanceof Error ? e.message : "Unknown fetch error";
  }

  const twimlOk =
    webhookStatus === 200 &&
    webhookText.includes("<?xml") &&
    webhookText.includes("<Say") &&
    webhookText.includes("<Gather");

  const admin = getSupabaseAdminClient();
  let dbRowFound = false;
  let dbError: string | undefined;
  if (admin) {
    try {
      const { data, error } = await admin
        .from("ai_concierge_calls")
        .select("call_sid, from_number, to_number, status")
        .eq("call_sid", callSid)
        .maybeSingle();
      dbRowFound = !!data;
      if (error) dbError = error.message;
      if (dbRowFound && cleanup === "delete") {
        const { error: delErr } = await admin
          .from("ai_concierge_calls")
          .delete()
          .eq("call_sid", callSid);
        if (delErr) dbError = `cleanup failed: ${delErr.message}`;
      } else if (dbRowFound && cleanup === "keep") {
        await admin
          .from("ai_concierge_calls")
          .update({ summary: "selftest" })
          .eq("call_sid", callSid);
      }
    } catch (e) {
      dbError = e instanceof Error ? e.message : "Unknown DB error";
    }
  } else {
    dbError = "Supabase admin client not configured";
  }

  const ok = !webhookError && twimlOk && dbRowFound && !dbError;

  return NextResponse.json({
    ok,
    callSid,
    webhook: {
      url,
      status: webhookStatus,
      bodySnippet: webhookText.slice(0, 600),
      error: webhookError,
      twimlLooksValid: twimlOk,
    },
    db: { rowFound: dbRowFound, cleanup, error: dbError },
    notes: {
      cleanupModes: ["delete (default — removes the synthetic row)", "keep (keeps row tagged summary='selftest')"],
      tip: "If status is 403, your TWILIO_AUTH_TOKEN doesn't match the deployed environment.",
    },
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    method: "POST {cleanup?: 'delete'|'keep'}",
    auth: "owner|admin|staff (hgos_session cookie)",
    description:
      "Server-side self-test: signs and posts a synthetic Twilio webhook to /api/ai-concierge/voice/incoming, then verifies TwiML + DB row.",
  });
}
