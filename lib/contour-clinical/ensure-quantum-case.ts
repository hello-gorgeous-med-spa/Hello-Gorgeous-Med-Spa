import type { SupabaseClient } from "@supabase/supabase-js";
import { CL_PROCEDURE_TYPE } from "./form-versions";

const MODEL_DEFAULT = "2026-05-04";

type EnsureInput = {
  leadId: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  clientId?: string | null;
};

/**
 * One clinical case per lead (DB unique on lead_id). Idempotent: returns existing case if present.
 */
export async function ensureClQuantumCaseForContourLead(
  supabase: SupabaseClient,
  { leadId, email, fullName, phone, clientId }: EnsureInput
): Promise<{ caseId: string; created: boolean } | { error: string }> {
  const e = email.trim().toLowerCase();
  if (!e) return { error: "email required" };

  const { data: existing } = await supabase
    .from("cl_quantum_cases")
    .select("id")
    .eq("lead_id", leadId)
    .maybeSingle();
  if (existing?.id) {
    return { caseId: existing.id, created: false };
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("client_id, full_name, phone")
    .eq("id", leadId)
    .maybeSingle();
  const resolvedClient = (clientId ?? lead?.client_id) as string | null | undefined;
  const resolvedName = (fullName || lead?.full_name) as string | null;
  const resolvedPhone = (phone || lead?.phone) as string | null;

  const { data: row, error: ins } = await supabase
    .from("cl_quantum_cases")
    .insert({
      lead_id: leadId,
      client_id: resolvedClient || null,
      email: e,
      phone: (resolvedPhone || "").trim() || null,
      full_name: resolvedName?.trim() || null,
      status: "new_inquiry",
      procedure_type: CL_PROCEDURE_TYPE,
      model_event_date: MODEL_DEFAULT,
    })
    .select("id")
    .single();

  if (ins || !row) {
    if (String(ins?.code) === "23505") {
      const { data: again } = await supabase
        .from("cl_quantum_cases")
        .select("id")
        .eq("lead_id", leadId)
        .maybeSingle();
      if (again?.id) return { caseId: again.id, created: false };
    }
    return { error: ins?.message || "insert failed" };
  }
  return { caseId: row.id, created: true };
}
