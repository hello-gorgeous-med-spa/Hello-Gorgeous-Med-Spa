export const runtime = "nodejs";

/**
 * POST /api/app/aftercare/trigger
 * Schedule aftercare push notifications for a client after a treatment.
 * Call this from admin when marking an appointment complete.
 *
 * Body: { clientId, treatmentKey, appointmentId? }
 * treatmentKey: "botox" | "filler" | "morpheus8" | "co2" | "hydrafacial" |
 *               "laser-hair" | "vitamin" | "glp1"
 *
 * Auth: Bearer hgos-push-2026 (same as push/send)
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

function isAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  return token === process.env.ADMIN_PUSH_SECRET || token === "hgos-push-2026";
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientId, treatmentKey, appointmentId } = await req.json();
  if (!clientId || !treatmentKey) {
    return NextResponse.json({ error: "clientId and treatmentKey required" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  // Get templates for this treatment
  const { data: templates } = await supabase
    .from("app_aftercare_templates")
    .select("day_offset")
    .eq("treatment_key", treatmentKey)
    .eq("is_active", true);

  if (!templates?.length) {
    return NextResponse.json({ error: `No templates found for treatment: ${treatmentKey}` }, { status: 404 });
  }

  const now = new Date();
  const schedules = templates.map((t) => {
    const scheduledFor = new Date(now);
    scheduledFor.setDate(scheduledFor.getDate() + t.day_offset);
    // Send at 10am client time (approximate — use noon UTC)
    scheduledFor.setUTCHours(16, 0, 0, 0);
    return {
      client_id: clientId,
      appointment_id: appointmentId ?? null,
      treatment_key: treatmentKey,
      day_offset: t.day_offset,
      scheduled_for: scheduledFor.toISOString(),
      status: "pending",
    };
  });

  const { error } = await supabase.from("app_aftercare_schedules").insert(schedules);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ scheduled: schedules.length, treatmentKey, clientId });
}
