import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { submitPharmacyOrder } from "@/lib/rx-pharmacy-fulfillment/adapters";
import { pharmacyLabelToVendorKey } from "@/lib/rx-pharmacy-fulfillment/pharmacy-key";
import type {
  EnqueuePharmacyShipmentInput,
  PharmacyShipmentRow,
  PharmacyShipmentStatus,
} from "@/lib/rx-pharmacy-fulfillment/types";

function mapRow(raw: Record<string, unknown>): PharmacyShipmentRow {
  return raw as unknown as PharmacyShipmentRow;
}

export async function enqueuePharmacyShipment(
  input: EnqueuePharmacyShipmentInput,
  client?: SupabaseClient | null,
): Promise<{ id: string } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };

  const pharmacyKey = pharmacyLabelToVendorKey(input.pharmacyLabel);
  const now = new Date().toISOString();

  const { data, error } = await admin
    .from("hg_rx_pharmacy_shipments")
    .upsert(
      {
        request_kind: input.requestKind,
        request_id: input.requestId,
        prescription_id: input.prescriptionId ?? null,
        patient_name: input.patientName,
        patient_email: input.patientEmail ?? null,
        patient_phone: input.patientPhone ?? null,
        pharmacy: input.pharmacyLabel,
        pharmacy_key: pharmacyKey,
        product_label: input.productLabel ?? null,
        compound: input.compound ?? null,
        sig: input.sig ?? null,
        ship_to: input.shipTo ?? null,
        status: "queued",
        updated_at: now,
      },
      { onConflict: "request_kind,request_id,pharmacy_key" },
    )
    .select("id")
    .single();

  if (error) {
    if (error.code === "42P01") {
      return { error: "Shipment table not installed — run migration 20260707160000_rx_pharmacy_shipments.sql" };
    }
    return { error: error.message };
  }

  return { id: String(data.id) };
}

export async function listPharmacyShipments(
  opts?: { status?: PharmacyShipmentStatus | "active"; limit?: number },
  client?: SupabaseClient | null,
): Promise<PharmacyShipmentRow[]> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return [];

  let query = admin
    .from("hg_rx_pharmacy_shipments")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(opts?.limit ?? 50);

  if (opts?.status === "active") {
    query = query.in("status", ["queued", "submitted", "processing", "failed"]);
  } else if (opts?.status) {
    query = query.eq("status", opts.status);
  }

  const { data, error } = await query;
  if (error?.code === "42P01") return [];
  if (error) {
    console.warn("[rx-pharmacy-fulfillment] list error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
}

export async function getPharmacyShipmentForRequest(
  requestKind: string,
  requestId: string,
  client?: SupabaseClient | null,
): Promise<PharmacyShipmentRow | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("hg_rx_pharmacy_shipments")
    .select("*")
    .eq("request_kind", requestKind)
    .eq("request_id", requestId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ? mapRow(data as Record<string, unknown>) : null;
}

export async function submitPharmacyShipment(
  shipmentId: string,
  actorEmail: string,
  client?: SupabaseClient | null,
): Promise<{ ok: true; row: PharmacyShipmentRow } | { ok: false; error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const { data: row, error } = await admin
    .from("hg_rx_pharmacy_shipments")
    .select("*")
    .eq("id", shipmentId)
    .maybeSingle();

  if (error || !row) return { ok: false, error: "Shipment not found" };

  const shipment = mapRow(row as Record<string, unknown>);
  const result = await submitPharmacyOrder(shipment);

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = {
    updated_at: now,
    last_sync_at: now,
    last_error: result.ok ? null : result.error,
  };

  if (result.ok) {
    updates.status = result.status ?? "submitted";
    updates.submitted_at = now;
    if (result.externalOrderId) updates.external_order_id = result.externalOrderId;
  } else {
    updates.status = "failed";
  }

  const { data: updated, error: updateErr } = await admin
    .from("hg_rx_pharmacy_shipments")
    .update(updates)
    .eq("id", shipmentId)
    .select("*")
    .single();

  if (updateErr || !updated) {
    return { ok: false, error: updateErr?.message || "Could not update shipment" };
  }

  if (!result.ok) return { ok: false, error: result.error };

  await admin.from("hg_rx_ops_audit_log").insert({
    request_kind: shipment.request_kind,
    request_id: shipment.request_id,
    action: "pharmacy_submit",
    actor_email: actorEmail,
    detail: { shipmentId, pharmacy: shipment.pharmacy_key, externalOrderId: result.externalOrderId },
  });

  return { ok: true, row: mapRow(updated as Record<string, unknown>) };
}

export async function markPharmacyShipmentShipped(
  shipmentId: string,
  patch: { trackingNumber?: string; carrier?: string; actorEmail?: string },
  client?: SupabaseClient | null,
): Promise<{ ok: boolean; error?: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const now = new Date().toISOString();
  const { data, error } = await admin
    .from("hg_rx_pharmacy_shipments")
    .update({
      status: "shipped",
      tracking_number: patch.trackingNumber?.trim() || null,
      carrier: patch.carrier?.trim() || null,
      shipped_at: now,
      updated_at: now,
      last_sync_at: now,
    })
    .eq("id", shipmentId)
    .select("request_kind, request_id")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };

  if (patch.actorEmail && data) {
    await admin.from("hg_rx_ops_audit_log").insert({
      request_kind: data.request_kind,
      request_id: data.request_id,
      action: "pharmacy_shipped",
      actor_email: patch.actorEmail,
      detail: { shipmentId, trackingNumber: patch.trackingNumber, carrier: patch.carrier },
    });
  }

  return { ok: true };
}
