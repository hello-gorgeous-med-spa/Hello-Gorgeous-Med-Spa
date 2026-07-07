import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { logRxPatientAccess } from "@/lib/rx-patients/audit";

export async function addRxPatientClinicalNote(
  input: {
    clientId: string;
    body: string;
    actorEmail: string;
    title?: string;
  },
  client?: SupabaseClient | null,
): Promise<{ ok: true; noteId: string } | { ok: false; error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const trimmed = input.body.trim().slice(0, 8000);
  if (!trimmed) return { ok: false, error: "Note required" };

  const { data, error } = await admin
    .from("chart_notes")
    .insert({
      client_id: input.clientId,
      note_type: "progress",
      title: input.title?.trim() || "RX Ops clinical note",
      status: "final",
      subjective: trimmed,
      plan: "Documented from Hello Gorgeous RX Ops patient chart.",
      procedure_details: {
        source: "rx_ops_patient_chart",
        actorEmail: input.actorEmail,
      },
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  await logRxPatientAccess(
    {
      clientId: input.clientId,
      action: "clinical_note_added",
      actorEmail: input.actorEmail,
      detail: { chartNoteId: data.id },
    },
    admin,
  );

  return { ok: true, noteId: String(data.id) };
}
