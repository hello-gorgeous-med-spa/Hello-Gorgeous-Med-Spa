// ============================================================
// API: BOOKING RESCHEDULE (for AI receptionist + voice)
// Reschedules an appointment to a new date/time. Used by chat/voice front desk.
// See docs/AI_RECEPTIONIST_INITIATIVE.md
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient, isAdminConfigured } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

function parseTimeToISO(dateStr: string, timeStr: string): string | null {
  try {
    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date.getTime())) return null;
    const match = String(timeStr).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i) ?? String(timeStr).match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (!match) return null;
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2] || "0", 10);
    const period = (match[3] || "").toUpperCase();
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const appointmentId = body.appointment_id ?? body.appointmentId;
    const newDate = body.new_date ?? body.date;
    const newTime = body.new_time ?? body.time;
    const startsAt = body.starts_at;

    if (!appointmentId) {
      return NextResponse.json({ error: "appointment_id required" }, { status: 400 });
    }

    let newStartsAt: string | null = null;
    if (startsAt) {
      const d = new Date(startsAt);
      newStartsAt = isNaN(d.getTime()) ? null : d.toISOString();
    } else if (newDate && newTime) {
      newStartsAt = parseTimeToISO(newDate, newTime);
    }
    if (!newStartsAt) {
      return NextResponse.json(
        { error: "Provide starts_at (ISO) or new_date + new_time (e.g. 10:30 AM)" },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase || !isAdminConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { data: apt } = await supabase
      .from("appointments")
      .select("duration_minutes, starts_at")
      .eq("id", appointmentId)
      .single();
    const duration = apt?.duration_minutes ?? 30;
    const start = new Date(newStartsAt);
    const end = new Date(start.getTime() + duration * 60 * 1000);

    const { data, error } = await supabase
      .from("appointments")
      .update({
        starts_at: newStartsAt,
        ends_at: end.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId)
      .select("id, starts_at, ends_at")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Appointment rescheduled",
      appointment: data,
    });
  } catch (e) {
    console.error("Booking reschedule error:", e);
    return NextResponse.json({ error: "Failed to reschedule appointment" }, { status: 500 });
  }
}
