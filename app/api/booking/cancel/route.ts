// ============================================================
// API: BOOKING CANCEL (for AI receptionist + voice)
// Cancels an appointment by id. Used by chat/voice front desk.
// This system is the canonical source for appointments. No Fresha lookups.
// See docs/AI_RECEPTIONIST_INITIATIVE.md and docs/BOOKING.md
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient, isAdminConfigured } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const appointmentId = body.appointment_id ?? body.appointmentId;
    const reason = body.reason ?? body.cancellation_reason ?? null;

    if (!appointmentId) {
      return NextResponse.json({ error: "appointment_id required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase || !isAdminConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const updates: Record<string, unknown> = {
      status: "cancelled",
      updated_at: new Date().toISOString(),
    };
    if (reason) {
      updates.cancellation_reason = reason;
      updates.cancel_reason = reason;
    }

    const { data, error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", appointmentId)
      .select("id, status")
      .single();

    if (error) {
      console.error("[booking/cancel] Error:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[booking/cancel] Success", { appointmentId, reason: reason ?? "none" });

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled",
      appointment: data,
    });
  } catch (e) {
    console.error("Booking cancel error:", e);
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
  }
}
