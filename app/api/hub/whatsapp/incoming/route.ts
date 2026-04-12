// Twilio WhatsApp inbound webhook — configure in Twilio: WhatsApp sender → "When a message comes in"
// POST application/x-www-form-urlencoded. Validates X-Twilio-Signature unless TWILIO_WEBHOOK_SKIP_SIGNATURE=1

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { normalizeToE164 } from "@/lib/phone-e164";
import { twilioSignatureValid } from "@/lib/twilio-webhook";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const form = new URLSearchParams(raw);
  const formObject = Object.fromEntries(form.entries());

  if (!twilioSignatureValid(request, raw, formObject)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const messageSid = form.get("MessageSid") || form.get("SmsSid");
  const messageStatus = form.get("MessageStatus") || form.get("SmsStatus");
  const bodyText = form.get("Body") ?? "";
  const fromRaw = form.get("From");
  const hasInboundBody = form.has("Body");

  if (messageStatus && messageSid && !hasInboundBody) {
    return NextResponse.json({ received: true, kind: "status" });
  }

  if (!hasInboundBody) {
    return NextResponse.json({ received: true, kind: "ignored" });
  }

  let fromPhone = fromRaw || "";
  if (fromPhone.toLowerCase().startsWith("whatsapp:")) {
    fromPhone = fromPhone.slice("whatsapp:".length);
  }
  const e164 = normalizeToE164(fromPhone);
  if (!e164) {
    return NextResponse.json({ error: "Invalid From" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (admin && messageSid) {
    const { data: existing } = await admin.from("hg_messages").select("id").eq("twilio_sid", messageSid).maybeSingle();
    if (!existing) {
      await admin.from("hg_messages").insert({
        client_phone: e164,
        direction: "inbound",
        channel: "whatsapp",
        body: bodyText,
        twilio_sid: messageSid,
        status: "received",
        sent_at: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ received: true, kind: "inbound" });
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Twilio WhatsApp inbound webhook — POST form-urlencoded from Twilio only",
  });
}
