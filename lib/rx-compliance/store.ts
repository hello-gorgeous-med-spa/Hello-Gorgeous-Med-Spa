import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import type {
  RxControlledSubstanceConfig,
  RxLicensedState,
  RxSecurityReview,
  RxUatSignoff,
  RxVendorBaa,
} from "@/lib/rx-compliance/types";

type VendorRow = {
  id: string;
  vendor_key: string;
  vendor_name: string;
  category: string;
  touches_phi: boolean;
  status: RxVendorBaa["status"];
  signed_at: string | null;
  renewal_due: string | null;
  document_url: string | null;
  notes: string | null;
};

function mapVendor(row: VendorRow): RxVendorBaa {
  return {
    id: row.id,
    vendorKey: row.vendor_key,
    vendorName: row.vendor_name,
    category: row.category,
    touchesPhi: row.touches_phi,
    status: row.status,
    signedAt: row.signed_at,
    renewalDue: row.renewal_due,
    documentUrl: row.document_url,
    notes: row.notes,
  };
}

export async function listRxVendorBaas(client?: SupabaseClient | null): Promise<RxVendorBaa[]> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("hg_rx_vendor_baas")
    .select("*")
    .order("category")
    .order("vendor_name");

  if (error?.code === "42P01") return [];
  if (error) {
    console.warn("[rx-compliance] vendor baas", error.message);
    return [];
  }

  return ((data || []) as VendorRow[]).map(mapVendor);
}

export async function updateRxVendorBaa(
  input: {
    id: string;
    status?: RxVendorBaa["status"];
    signedAt?: string | null;
    renewalDue?: string | null;
    documentUrl?: string | null;
    notes?: string | null;
  },
  client?: SupabaseClient | null,
): Promise<{ ok: boolean; error?: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.status) patch.status = input.status;
  if (input.signedAt !== undefined) patch.signed_at = input.signedAt;
  if (input.renewalDue !== undefined) patch.renewal_due = input.renewalDue;
  if (input.documentUrl !== undefined) patch.document_url = input.documentUrl;
  if (input.notes !== undefined) patch.notes = input.notes;

  const { error } = await admin.from("hg_rx_vendor_baas").update(patch).eq("id", input.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function listRxSecurityReviews(
  client?: SupabaseClient | null,
): Promise<RxSecurityReview[]> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return [];

  const { data, error } = await admin.from("hg_rx_security_reviews").select("*").order("title");
  if (error?.code === "42P01") return [];
  if (error) return [];

  return (data || []).map((row) => ({
    id: row.id,
    reviewKey: row.review_key,
    title: row.title,
    status: row.status,
    completedAt: row.completed_at,
    vendorName: row.vendor_name,
    criticalOpen: row.critical_open ?? 0,
    highOpen: row.high_open ?? 0,
    reportUrl: row.report_url,
    notes: row.notes,
  }));
}

export async function updateRxSecurityReview(
  input: {
    id: string;
    status?: RxSecurityReview["status"];
    completedAt?: string | null;
    vendorName?: string | null;
    criticalOpen?: number;
    highOpen?: number;
    reportUrl?: string | null;
    notes?: string | null;
  },
  client?: SupabaseClient | null,
): Promise<{ ok: boolean; error?: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.status) patch.status = input.status;
  if (input.completedAt !== undefined) patch.completed_at = input.completedAt;
  if (input.vendorName !== undefined) patch.vendor_name = input.vendorName;
  if (input.criticalOpen !== undefined) patch.critical_open = input.criticalOpen;
  if (input.highOpen !== undefined) patch.high_open = input.highOpen;
  if (input.reportUrl !== undefined) patch.report_url = input.reportUrl;
  if (input.notes !== undefined) patch.notes = input.notes;

  const { error } = await admin.from("hg_rx_security_reviews").update(patch).eq("id", input.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function listRxLicensedStates(
  client?: SupabaseClient | null,
): Promise<RxLicensedState[]> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("hg_rx_licensed_states")
    .select("*")
    .order("state_code");

  if (error?.code === "42P01") return [];
  if (error) return [];

  return (data || []).map((row) => ({
    stateCode: row.state_code,
    licensed: row.licensed,
    providerName: row.provider_name,
    licenseNumber: row.license_number,
    expiresAt: row.expires_at,
    notes: row.notes,
  }));
}

export async function upsertRxLicensedState(
  input: RxLicensedState,
  client?: SupabaseClient | null,
): Promise<{ ok: boolean; error?: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const code = input.stateCode.trim().toUpperCase().slice(0, 2);
  if (code.length !== 2) return { ok: false, error: "Invalid state code" };

  const { error } = await admin.from("hg_rx_licensed_states").upsert(
    {
      state_code: code,
      licensed: input.licensed,
      provider_name: input.providerName,
      license_number: input.licenseNumber,
      expires_at: input.expiresAt,
      notes: input.notes,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "state_code" },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function listRxUatSignoffs(client?: SupabaseClient | null): Promise<RxUatSignoff[]> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return [];

  const { data, error } = await admin.from("hg_rx_uat_signoffs").select("*").order("role");
  if (error?.code === "42P01") return [];
  if (error) return [];

  return (data || []).map((row) => ({
    role: row.role,
    signedByEmail: row.signed_by_email,
    signedByName: row.signed_by_name,
    signedAt: row.signed_at,
    notes: row.notes,
  }));
}

export async function recordRxUatSignoff(
  input: {
    role: RxUatSignoff["role"];
    signedByEmail: string;
    signedByName?: string | null;
    notes?: string | null;
  },
  client?: SupabaseClient | null,
): Promise<{ ok: boolean; error?: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const { error } = await admin.from("hg_rx_uat_signoffs").upsert(
    {
      role: input.role,
      signed_by_email: input.signedByEmail,
      signed_by_name: input.signedByName ?? null,
      signed_at: new Date().toISOString(),
      notes: input.notes ?? null,
    },
    { onConflict: "role" },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getControlledSubstanceConfig(
  client?: SupabaseClient | null,
): Promise<RxControlledSubstanceConfig> {
  const admin = client ?? getSupabaseAdminClient();
  const fallback = { deaVerified: false, pmpEnabled: false };
  if (!admin) return fallback;

  const { data, error } = await admin
    .from("hg_rx_ops_config")
    .select("value")
    .eq("key", "controlled_substances")
    .maybeSingle();

  if (error?.code === "42P01" || !data?.value) return fallback;

  const v = data.value as { dea_verified?: boolean; pmp_enabled?: boolean };
  return {
    deaVerified: Boolean(v.dea_verified),
    pmpEnabled: Boolean(v.pmp_enabled),
  };
}

export async function updateControlledSubstanceConfig(
  input: Partial<RxControlledSubstanceConfig>,
  client?: SupabaseClient | null,
): Promise<{ ok: boolean; error?: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const current = await getControlledSubstanceConfig(admin);
  const next = {
    dea_verified: input.deaVerified ?? current.deaVerified,
    pmp_enabled: input.pmpEnabled ?? current.pmpEnabled,
  };

  const { error } = await admin.from("hg_rx_ops_config").upsert(
    {
      key: "controlled_substances",
      value: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
