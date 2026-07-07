import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { loadRxOpsFormulary } from "@/lib/rx-ops/formulary";
import {
  getControlledSubstanceConfig,
  listRxLicensedStates,
} from "@/lib/rx-compliance/store";
import type { RxOpsRequestKind } from "@/lib/rx-ops/types";
import { getClinicEncounter } from "@/lib/rx-clinic-encounter";
import { fetchRegenFulfillmentOrder } from "@/lib/regen/order-fulfillment";

const US_STATE_CODES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
  "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
  "WI", "WY", "DC",
]);

export function normalizeStateCode(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const code = raw.trim().toUpperCase().slice(0, 2);
  return US_STATE_CODES.has(code) ? code : null;
}

export function compoundIsControlled(compound: string): boolean {
  const needle = compound.trim().toLowerCase();
  if (!needle) return false;
  const formulary = loadRxOpsFormulary();
  return formulary.some(
    (row) =>
      row.controlled &&
      (row.compound.toLowerCase() === needle ||
        row.product.toLowerCase().includes(needle) ||
        needle.includes(row.compound.toLowerCase().slice(0, 8))),
  );
}

export async function resolvePatientShipState(
  kind: RxOpsRequestKind,
  id: string,
  client?: SupabaseClient | null,
): Promise<string | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  if (kind === "regen") {
    const order = await fetchRegenFulfillmentOrder(admin, id);
    if (!order) return null;
    const addr = order.shipping_address as { administrative_district_level_1?: string } | null;
    return normalizeStateCode(addr?.administrative_district_level_1);
  }

  if (kind === "clinic") {
    const encounter = await getClinicEncounter(id, admin);
    return normalizeStateCode(encounter?.ship_state);
  }

  const { data: submission } = await admin
    .from("hg_form_submissions")
    .select("responses_json")
    .eq("id", id)
    .maybeSingle();

  const responses = (submission?.responses_json || {}) as Record<string, unknown>;
  const fromResponses =
    responses.shipping_state ||
    responses.state ||
    responses.patient_state ||
    responses.ship_state;

  if (typeof fromResponses === "string") {
    const normalized = normalizeStateCode(fromResponses);
    if (normalized) return normalized;
  }

  const { data: dispatch } = await admin
    .from("hg_rx_dispatch")
    .select("state")
    .eq("submission_id", id)
    .maybeSingle();

  return normalizeStateCode(dispatch?.state as string | undefined);
}

export async function assertRxLicensingGate(input: {
  kind: RxOpsRequestKind;
  id: string;
  compound: string;
  action: "approve";
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const patientState = await resolvePatientShipState(input.kind, input.id, admin);
  if (!patientState) {
    return {
      ok: false,
      error: "Patient ship-to state is required before approval (HGRX-102 / HGRX-022)",
    };
  }

  const licensed = await listRxLicensedStates(admin);
  const allowed = licensed.filter((s) => s.licensed).map((s) => s.stateCode);
  if (!allowed.includes(patientState)) {
    return {
      ok: false,
      error: `Provider is not licensed in ${patientState}. Update licensed states in Go-Live checklist.`,
    };
  }

  if (compoundIsControlled(input.compound)) {
    const cfg = await getControlledSubstanceConfig(admin);
    if (!cfg.deaVerified || !cfg.pmpEnabled) {
      return {
        ok: false,
        error:
          "Controlled substance — verify DEA registration and PMP reporting in Go-Live checklist before approving.",
      };
    }
  }

  return { ok: true };
}
