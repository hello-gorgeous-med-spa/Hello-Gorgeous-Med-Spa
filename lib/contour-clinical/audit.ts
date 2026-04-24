import type { SupabaseClient } from "@supabase/supabase-js";

type AuditInput = {
  caseId: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  actorUserId: string;
  /** No PHI — ids, flags, form versions only */
  summary?: Record<string, string | number | boolean | null>;
};

export async function logClinicalAudit(
  supabase: SupabaseClient,
  { caseId, action, entityType, entityId, actorUserId, summary }: AuditInput
): Promise<void> {
  try {
    await supabase.from("cl_clinical_audit_log").insert({
      case_id: caseId,
      action: action.slice(0, 80),
      entity_type: entityType.slice(0, 64),
      entity_id: entityId ?? null,
      actor_user_id: actorUserId,
      summary: summary ?? null,
    });
  } catch {
    /* non-fatal */
  }
}
