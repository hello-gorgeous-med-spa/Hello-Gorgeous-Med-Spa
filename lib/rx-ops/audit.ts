import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import type { RxOpsRequestKind } from "@/lib/rx-ops/types";

export type RxOpsAuditAction =
  | "clinical_approve"
  | "clinical_decline"
  | "clinical_info_requested"
  | "prescription_signed"
  | "invoice_sent"
  | "invoice_resent"
  | "payment_refunded"
  | "telehealth_completed";

export async function logRxOpsAudit(
  input: {
    requestKind: RxOpsRequestKind;
    requestId: string;
    action: RxOpsAuditAction;
    actorEmail: string;
    detail?: Record<string, unknown>;
  },
  client?: SupabaseClient | null,
): Promise<void> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return;

  const { error } = await admin.from("hg_rx_ops_audit_log").insert({
    request_kind: input.requestKind,
    request_id: input.requestId,
    action: input.action,
    actor_email: input.actorEmail,
    detail: input.detail ?? {},
  });

  if (error?.code === "42P01") return;
  if (error) {
    console.warn("[rx-ops/audit] insert failed:", error.message);
  }
}
