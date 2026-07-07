import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export type RxMessageAuditAction =
  | "thread_opened"
  | "message_sent"
  | "message_read"
  | "chart_logged";

export async function logRxMessageAudit(
  input: {
    threadId: string;
    messageId?: string | null;
    action: RxMessageAuditAction;
    actorType: "patient" | "staff" | "system";
    actorEmail?: string | null;
    detail?: Record<string, unknown>;
  },
  client?: SupabaseClient | null,
): Promise<void> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return;

  const { error } = await admin.from("hg_rx_message_audit_log").insert({
    thread_id: input.threadId,
    message_id: input.messageId ?? null,
    action: input.action,
    actor_type: input.actorType,
    actor_email: input.actorEmail ?? null,
    detail: input.detail ?? {},
  });

  if (error?.code === "42P01") return;
  if (error) console.warn("[rx-messaging/audit]", error.message);
}
