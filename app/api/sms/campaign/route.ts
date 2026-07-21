// ============================================================
// API: SMS Campaign — enqueue only (Text Studio / legacy clients)
// Delegates to /api/campaigns/send durable queue. No sync blast.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import { requireMarketingAccess } from "@/lib/api-auth";
import { isTwilioConfigured } from "@/lib/hgos/twilio-config";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  if (!isTwilioConfigured()) {
    return NextResponse.json(
      {
        error:
          "Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_MESSAGING_SERVICE_SID.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const message = body?.message?.trim();
    const sendToAll = !!body?.sendToAll;
    const recipientsInput = Array.isArray(body?.recipients) ? body.recipients : [];
    const name = (body?.name as string)?.trim() || "Text Studio campaign";

    if (!message) {
      return NextResponse.json({ error: 'Missing "message".' }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const cookie = request.headers.get("cookie") || "";

    const enqueueBody: Record<string, unknown> = {
      name,
      channel: "sms",
      smsContent: message,
      audienceSegment: sendToAll ? "sms-opt-in" : "custom",
    };
    if (!sendToAll) {
      enqueueBody.customPhones = recipientsInput.map((r: string) => String(r || "").trim()).filter(Boolean);
    }

    const res = await fetch(`${origin}/api/campaigns/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify(enqueueBody),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({
      ...data,
      sent: data.firstBatch?.smsSent ?? 0,
      failed: data.firstBatch?.smsFailed ?? 0,
      total: data.totalRecipients ?? 0,
      totalRecipients: data.totalRecipients ?? 0,
      queued: true,
    });
  } catch (e) {
    console.error("[sms/campaign]", e);
    return NextResponse.json(
      { error: "Campaign enqueue failed", sent: 0, failed: 0, total: 0 },
      { status: 500 },
    );
  }
}
