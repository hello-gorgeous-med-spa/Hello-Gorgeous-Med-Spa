import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubApi } from "@/lib/hub-api-auth";
import { normalizeToE164 } from "@/lib/phone-e164";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { sendWhatsApp } from "@/lib/notifications/whatsapp-outbound";

export const dynamic = "force-dynamic";

type Channel = "sms" | "whatsapp";

function sentByFromBody(body: { user?: string; created_by?: string }): "dani" | "ryan" | null {
  const u = String(body?.user || body?.created_by || "dani").toLowerCase();
  return u === "ryan" ? "ryan" : "dani";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const gate = await requireHubApi(req, body);
  if (gate instanceof NextResponse) return gate;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const phoneRaw = String(body?.phone || "").trim();
  const text = String(body?.body || body?.text || "").trim();
  const channel = String(body?.channel || "sms").toLowerCase() as Channel;
  const hubClientId = body?.hub_client_id != null ? String(body.hub_client_id).trim() : null;

  if (!phoneRaw || !text) {
    return NextResponse.json({ error: "phone and body (or text) required" }, { status: 400 });
  }
  if (channel !== "sms" && channel !== "whatsapp") {
    return NextResponse.json({ error: "channel must be sms or whatsapp" }, { status: 400 });
  }

  const e164 = normalizeToE164(phoneRaw);
  if (!e164) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const sentBy = sentByFromBody(body);
  let externalId: string | null = null;
  let status = "sent";
  let errorMessage: string | null = null;

  if (channel === "sms") {
    const r = await sendSms(e164, text);
    if (r.success) externalId = r.providerMessageId;
    else {
      status = "failed";
      errorMessage = r.error || "SMS send failed";
    }
  } else {
    const r = await sendWhatsApp(e164, text);
    if (r.success) externalId = r.providerMessageId;
    else {
      status = "failed";
      errorMessage = r.error || "WhatsApp send failed";
    }
  }

  const { data: row, error: insErr } = await supabase
    .from("hg_messages")
    .insert({
      hub_client_id: hubClientId || null,
      client_phone: e164,
      direction: "outbound",
      channel,
      body: text,
      twilio_sid: externalId,
      status,
      error_message: errorMessage,
      sent_by: sentBy,
      sent_at: new Date().toISOString(),
    })
    .select(
      "id,hub_client_id,client_phone,direction,channel,body,sent_at,sent_by,twilio_sid,status,error_message",
    )
    .single();

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  return NextResponse.json({
    success: status === "sent",
    message: row,
    error: errorMessage,
  });
}
