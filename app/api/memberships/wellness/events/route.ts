// ============================================================
// WELLNESS MEMBERSHIP EVENTS (Analytics)
// Track: signup, lab_upload, pdf_download, visit_booked
// Integrate with Google Analytics / CRM as needed
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

const ALLOWED_EVENTS = ["signup", "lab_upload", "pdf_download", "visit_booked", "refill_requested", "message_sent"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, clientId, email, metadata } = body;

    if (!event || !ALLOWED_EVENTS.includes(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    // Log server-side for analytics pipeline
    if (process.env.NODE_ENV === "production") {
      // Could send to GA4, Mixpanel, or internal analytics DB
      console.info("[wellness-event]", { event, clientId, email, ts: new Date().toISOString(), metadata });
    }

    // Optionally persist to member_audit_log for compliance
    const supabase = createServerSupabaseClient();
    if (supabase && (clientId || email)) {
      let resolvedClientId = clientId;
      if (!resolvedClientId && email?.trim()) {
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("email", email.toLowerCase().trim())
          .single();
        resolvedClientId = client?.id;
      }
      if (resolvedClientId) {
        await supabase.from("member_audit_log").insert({
          client_id: resolvedClientId,
          action: `wellness_${event}`,
          resource_type: "event",
          metadata: metadata || {},
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
