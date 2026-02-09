// ============================================================
// Hello Gorgeous AI Receptionist — Role, actions, watchdog logging
// Single source of truth for the Mini-Me front-desk agent.
// See docs/AI_RECEPTIONIST_INITIATIVE.md
// ============================================================

export const AI_RECEPTIONIST_ROLE = "hello_gorgeous_ai_receptionist" as const;
export const AI_RECEPTIONIST_AUTHORITY = "primary" as const;

export type ReceptionistChannel = "chat" | "voice";
export type ReceptionistAction =
  | "booking"
  | "cancel"
  | "reschedule"
  | "info"
  | "escalation"
  | "feedback"
  | "forms";
export type ReceptionistConfidence = "high" | "medium" | "low";

export interface WatchdogLogPayload {
  channel: ReceptionistChannel;
  action: ReceptionistAction;
  confidence: ReceptionistConfidence;
  request_summary: string;
  response_summary: string;
  full_response_preview?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an AI receptionist action to the watchdog (audit + compliance).
 * Call from chat widget API and (future) voice webhook.
 * Fire-and-forget; never throws to caller.
 */
export async function logReceptionistAction(
  payload: WatchdogLogPayload,
  supabase: unknown
): Promise<void> {
  if (!supabase || typeof (supabase as { from?: unknown }).from !== "function") return;
  try {
    const row = {
      source: AI_RECEPTIONIST_ROLE,
      channel: payload.channel,
      request_summary: payload.request_summary.slice(0, 500),
      response_summary: payload.response_summary.slice(0, 500),
      full_response_preview:
        typeof payload.full_response_preview === "string"
          ? payload.full_response_preview.slice(0, 500)
          : null,
      flagged: false,
      flag_reason: null,
      metadata: {
        action: payload.action,
        confidence: payload.confidence,
        ...payload.metadata,
      },
    };
    const sb = supabase as { from: (t: string) => { insert: (r: object) => { select: (s: string) => { single: () => Promise<unknown> } } } };
    await sb.from("ai_watchdog_logs").insert(row).select("id").single();
  } catch {
    // Do not throw; logging must not break the request
  }
}

/** Infer action from widget response (for logging). */
export function inferActionFromReply(
  reply: string,
  hadBookingUrl?: boolean,
  hadNeedsFeedback?: boolean
): ReceptionistAction {
  if (hadNeedsFeedback) return "feedback";
  if (hadBookingUrl && /book|schedule|appointment/i.test(reply)) return "booking";
  if (/cancel|reschedule|change.*appointment/i.test(reply)) return "info";
  if (/danielle|owner|connect you|escalat/i.test(reply)) return "escalation";
  if (/form|consent|intake|paperwork/i.test(reply)) return "forms";
  return "info";
}
