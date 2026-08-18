// ============================================================
// API: KIOSK CONSENT - Sign packet from kiosk
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function clientIp(request: NextRequest): string {
  const raw =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "";
  return raw || "0.0.0.0";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { token } = await params;
    const body = await request.json();
    const { packet_id, signature_image } = body as {
      packet_id?: string;
      signature_image?: string;
    };

    if (!packet_id || !signature_image) {
      return NextResponse.json(
        { error: "packet_id and signature_image are required" },
        { status: 400 },
      );
    }

    const { data: tokenRecord, error: tokenError } = await supabase
      .from("appointment_consent_tokens")
      .select("*")
      .eq("token", token)
      .eq("token_type", "kiosk")
      .eq("is_valid", true)
      .single();

    if (tokenError || !tokenRecord) {
      return NextResponse.json({ error: "Invalid kiosk session" }, { status: 404 });
    }

    if (new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: "Kiosk session expired" }, { status: 410 });
    }

    const { data: packet, error: packetError } = await supabase
      .from("consent_packets")
      .select("id, appointment_id, status")
      .eq("id", packet_id)
      .single();

    if (packetError || !packet) {
      return NextResponse.json({ error: "Consent not found" }, { status: 404 });
    }

    if (packet.appointment_id !== tokenRecord.appointment_id) {
      return NextResponse.json({ error: "Consent does not match session" }, { status: 403 });
    }

    if (packet.status === "signed") {
      return NextResponse.json({ error: "Already signed" }, { status: 400 });
    }

    const ip = clientIp(request);
    const userAgent = (request.headers.get("user-agent") || "kiosk").slice(0, 500);
    const signedAt = new Date().toISOString();

    const attempts: Record<string, unknown>[] = [
      {
        status: "signed",
        signed_at: signedAt,
        signature_image,
        signature_ip: ip,
        signature_user_agent: userAgent,
      },
      {
        status: "signed",
        signed_at: signedAt,
        signature_image,
      },
      {
        status: "signed",
        signed_at: signedAt,
      },
    ];

    let lastError: { message?: string } | null = null;
    let saved = false;
    for (const patch of attempts) {
      const { error: updateError } = await supabase
        .from("consent_packets")
        .update(patch)
        .eq("id", packet_id);
      if (!updateError) {
        saved = true;
        break;
      }
      lastError = updateError;
      console.error("[kiosk-sign] packet update failed", updateError.message);
    }

    if (!saved) {
      return NextResponse.json(
        { error: lastError?.message || "Failed to save signature" },
        { status: 500 },
      );
    }

    await supabase.from("consent_events").insert({
      packet_id,
      event: "signed",
      actor_type: "client",
      ip_address: ip,
      user_agent: userAgent,
      meta: { source: "kiosk", kiosk_token: token },
    });

    const { data: remainingPackets } = await supabase
      .from("consent_packets")
      .select("id")
      .eq("appointment_id", tokenRecord.appointment_id)
      .in("status", ["draft", "sent", "viewed"]);

    if (!remainingPackets || remainingPackets.length === 0) {
      await supabase
        .from("appointment_consent_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("token", token);
    }

    return NextResponse.json({
      success: true,
      message: "Consent signed successfully",
    });
  } catch (error) {
    console.error("Kiosk sign error:", error);
    return NextResponse.json({ error: "Failed to sign consent" }, { status: 500 });
  }
}
