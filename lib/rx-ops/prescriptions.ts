import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import type { ClinicalAction } from "@/lib/rx-ops/state-machine";
import type { RxOpsRequestKind } from "@/lib/rx-ops/types";

export type RxPrescriptionDecision = "approved" | "declined" | "info_requested";

function decisionFromAction(action: ClinicalAction): RxPrescriptionDecision {
  if (action === "approve") return "approved";
  if (action === "decline") return "declined";
  return "info_requested";
}

export async function recordRxPrescription(
  input: {
    requestKind: RxOpsRequestKind;
    requestId: string;
    patientName: string;
    compound: string | null;
    productLabel: string | null;
    pharmacy: string | null;
    sig: string | null;
    action: ClinicalAction;
    signedByName: string;
    signedByEmail: string;
    metadata?: Record<string, unknown>;
  },
  client?: SupabaseClient | null,
): Promise<{ id: string } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };

  const decision = decisionFromAction(input.action);

  const { data, error } = await admin
    .from("hg_rx_prescriptions")
    .insert({
      request_kind: input.requestKind,
      request_id: input.requestId,
      patient_name: input.patientName,
      compound: input.compound,
      product_label: input.productLabel,
      pharmacy: input.pharmacy,
      sig: input.sig,
      decision,
      signed_by_name: input.signedByName,
      signed_by_email: input.signedByEmail,
      metadata: input.metadata ?? {},
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "42P01") {
      return { error: "Prescriptions table not installed — run migration 20260707143000_rx_ops_m3.sql" };
    }
    if (error.code === "23505" && decision === "approved") {
      return { error: "This request was already approved and signed" };
    }
    return { error: error.message };
  }

  return { id: String(data.id) };
}
