import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export type RxPatientAuditAction =
  | "patient_list"
  | "patient_view"
  | "patient_update"
  | "clinical_note_added";

export async function logRxPatientAccess(
  input: {
    clientId: string;
    action: RxPatientAuditAction;
    actorEmail: string;
    detail?: Record<string, unknown>;
  },
  client?: SupabaseClient | null,
): Promise<void> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return;

  const { error } = await admin.from("hg_rx_ops_audit_log").insert({
    request_kind: "patient",
    request_id: input.clientId,
    action: input.action,
    actor_email: input.actorEmail,
    detail: input.detail ?? {},
  });

  if (error?.code === "42P01") return;
  if (error) console.warn("[rx-patients/audit]", error.message);
}
