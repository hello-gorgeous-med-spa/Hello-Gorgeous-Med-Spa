import { NextRequest, NextResponse } from "next/server";
import { requireHubApi } from "@/lib/hub-api-auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/hub/whatsapp — send a WhatsApp message (Twilio).
 * Body: { user, phone, hub_client_id?, body | text }
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const gate = await requireHubApi(req, body);
  if (gate instanceof NextResponse) return gate;

  const cookie = req.headers.get("cookie") || "";
  const url = new URL("/api/hub/messages/send", req.nextUrl.origin);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ ...body, channel: "whatsapp" }),
  });
  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}
