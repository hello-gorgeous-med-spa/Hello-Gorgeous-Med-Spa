// ============================================================
// Review request enqueue helper
// ============================================================
// Single source of truth for adding a row to `review_requests_pending`.
// Centralizes the cooldown rules so we never spam a customer:
//   - 60-day per-client cooldown (looks at review_requests_sent)
//   - Skip if there's already a pending request for the same client
//   - Honor REVIEW_REQUESTS_ENABLED kill switch
// Used by Square webhook (Square-only checkout flow) and HG OS appointments.
// ============================================================

import type { SupabaseClient } from "@supabase/supabase-js";

export type ReviewSource = "appointment_completed" | "square_payment" | "manual";

export interface EnqueueReviewArgs {
  clientId: string;
  appointmentId?: string | null;
  source: ReviewSource;
  /** Hours to delay before SMS/email is sent. Defaults to 24. */
  delayHours?: number;
}

export interface EnqueueReviewResult {
  ok: boolean;
  reason?:
    | "disabled"
    | "cooldown_60d"
    | "already_pending"
    | "missing_client_id"
    | "duplicate_appointment"
    | "db_error";
  detail?: string;
}

const COOLDOWN_DAYS = 60;

export async function enqueueReviewRequest(
  supabase: SupabaseClient | null,
  args: EnqueueReviewArgs,
): Promise<EnqueueReviewResult> {
  if (!supabase) {
    return { ok: false, reason: "db_error", detail: "supabase client unavailable" };
  }
  if (process.env.REVIEW_REQUESTS_ENABLED === "false") {
    return { ok: false, reason: "disabled" };
  }

  const { clientId, appointmentId = null, source, delayHours = 24 } = args;
  if (!clientId) return { ok: false, reason: "missing_client_id" };

  // 60-day per-client cooldown to avoid review fatigue.
  const cooldownCutoff = new Date(
    Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  const { data: recentSent } = await supabase
    .from("review_requests_sent")
    .select("id")
    .eq("client_id", clientId)
    .gte("created_at", cooldownCutoff)
    .limit(1);
  if (recentSent && recentSent.length > 0) {
    return { ok: false, reason: "cooldown_60d" };
  }

  // If an identical appointment-level row already exists, partial-unique index
  // will reject it. Catch the conflict explicitly so callers don't see DB errors.
  if (appointmentId) {
    const { data: existing } = await supabase
      .from("review_requests_pending")
      .select("id")
      .eq("appointment_id", appointmentId)
      .limit(1);
    if (existing && existing.length > 0) {
      return { ok: false, reason: "duplicate_appointment" };
    }
  } else {
    // No appointment context — dedupe by client to avoid stacking many
    // square_payment rows for the same person.
    const { data: pending } = await supabase
      .from("review_requests_pending")
      .select("id")
      .eq("client_id", clientId)
      .is("appointment_id", null)
      .limit(1);
    if (pending && pending.length > 0) {
      return { ok: false, reason: "already_pending" };
    }
  }

  const scheduledFor = new Date(
    Date.now() + delayHours * 60 * 60 * 1000,
  ).toISOString();

  const { error } = await supabase.from("review_requests_pending").insert({
    appointment_id: appointmentId,
    client_id: clientId,
    scheduled_for: scheduledFor,
    source,
  });

  if (error) {
    return { ok: false, reason: "db_error", detail: error.message };
  }
  return { ok: true };
}
