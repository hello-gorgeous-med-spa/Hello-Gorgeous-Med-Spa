import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { logRxPatientAccess } from "@/lib/rx-patients/audit";
import { findDuplicatePatients } from "@/lib/rx-patients/search";
import {
  clientEmail,
  clientPhone,
  displayName,
  initialsFromName,
  loadClientWithUser,
} from "@/lib/rx-patients/resolve";
import type { RxPatientDetail } from "@/lib/rx-patients/types";
import { parseRxSupplyCycle } from "@/lib/rx-supply-cycle";

function formatAddress(client: Record<string, unknown>): string | null {
  const lines = [
    client.address_line1,
    client.address_line2,
    [client.city, client.state, client.postal_code].filter(Boolean).join(", "),
  ].filter(Boolean);
  return lines.length ? lines.map(String).join("\n") : null;
}

export async function getRxPatientDetail(
  clientId: string,
  actorEmail: string,
  client?: SupabaseClient | null,
): Promise<RxPatientDetail | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const loaded = await loadClientWithUser(admin, clientId);
  if (!loaded) return null;

  const { client: row, user } = loaded;
  const name = displayName(row, user);
  const email = clientEmail(row, user);
  const phone = clientPhone(row, user);

  const [plansRes, ledgerRes, shipmentsRes, notesRes, threadsRes, regenRes, encRes] =
    await Promise.all([
      admin
        .from("hg_rx_refill_plans")
        .select("*")
        .eq("client_id", clientId)
        .neq("status", "cancelled")
        .order("next_refill_at", { ascending: true })
        .limit(20),
      admin
        .from("hg_rx_payment_ledger")
        .select("id, line_label, template_name, payment_status, amount_usd, created_at, track")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(30),
      email
        ? admin
            .from("hg_rx_pharmacy_shipments")
            .select("id, product_label, status, updated_at, pharmacy")
            .ilike("patient_email", email)
            .order("updated_at", { ascending: false })
            .limit(20)
        : Promise.resolve({ data: [], error: null }),
      admin
        .from("chart_notes")
        .select("id, title, subjective, note_type, created_at, created_by")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(25),
      admin
        .from("hg_rx_message_threads")
        .select("id, intake_ref, last_preview, unread_staff_count")
        .eq("client_id", clientId)
        .order("last_message_at", { ascending: false })
        .limit(10),
      email
        ? admin
            .from("regen_orders")
            .select("reference, status, goal, subtotal_usd, created_at")
            .ilike("customer_email", email)
            .order("created_at", { ascending: false })
            .limit(20)
        : Promise.resolve({ data: [], error: null }),
      admin
        .from("hg_rx_clinic_encounters")
        .select("id, status, medication, dose_label, created_at, final_total_usd")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const activePlans = (plansRes.data ?? []).map((p) => ({
    id: String(p.id),
    medication: String(p.medication || "RX plan"),
    status: String(p.status),
    cadence: parseRxSupplyCycle(p.supply_cycle),
    nextRefill: String(p.next_refill_at || "").slice(0, 10),
    pharmacy: (p.pharmacy as string | null) ?? null,
  }));

  const orders: RxPatientDetail["orders"] = [];

  for (const row of ledgerRes.data ?? []) {
    orders.push({
      id: `ledger:${row.id}`,
      kind: "payment",
      label: String(row.line_label || row.template_name || row.track || "RX payment"),
      status: String(row.payment_status || "unknown"),
      date: String(row.created_at || ""),
      amountUsd: row.amount_usd != null ? Number(row.amount_usd) : null,
    });
  }

  for (const row of regenRes.data ?? []) {
    orders.push({
      id: `regen:${row.reference}`,
      kind: "regen",
      label: String(row.goal || "RE GEN order"),
      status: String(row.status || "unknown"),
      date: String(row.created_at || ""),
      amountUsd: row.subtotal_usd != null ? Number(row.subtotal_usd) : null,
    });
  }

  for (const row of encRes.data ?? []) {
    orders.push({
      id: `clinic:${row.id}`,
      kind: "clinic",
      label: String(row.medication || row.dose_label || "Clinic RX"),
      status: String(row.status || "unknown"),
      date: String(row.created_at || ""),
      amountUsd: row.final_total_usd != null ? Number(row.final_total_usd) : null,
    });
  }

  for (const row of shipmentsRes.data ?? []) {
    orders.push({
      id: `ship:${row.id}`,
      kind: "shipment",
      label: String(row.product_label || "Pharmacy shipment"),
      status: String(row.status || "unknown"),
      date: String(row.updated_at || ""),
      amountUsd: null,
    });
  }

  orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const notes = (notesRes.data ?? []).map((n) => ({
    id: String(n.id),
    title: String(n.title || "Clinical note"),
    body: String(n.subjective || ""),
    noteType: String(n.note_type || "note"),
    createdAt: String(n.created_at || ""),
    author: (n.created_by as string | null) ?? null,
  }));

  const messageThreads = (threadsRes.data ?? []).map((t) => ({
    id: String(t.id),
    intakeRef: String(t.intake_ref || ""),
    lastPreview: (t.last_preview as string | null) ?? null,
    unreadStaff: Number(t.unread_staff_count) || 0,
  }));

  const duplicateCandidates = await findDuplicatePatients(admin, clientId, email, phone);

  await logRxPatientAccess(
    { clientId, action: "patient_view", actorEmail },
    admin,
  );

  return {
    id: clientId,
    name,
    initials: initialsFromName(name),
    email,
    phone,
    dateOfBirth: (row.date_of_birth as string | null) ?? null,
    sex: (row.gender as string | null) ?? null,
    state: (row.state as string | null) ?? null,
    city: (row.city as string | null) ?? null,
    address: formatAddress(row),
    allergies: (row.allergies_summary as string | null) ?? null,
    medications: (row.medications_summary as string | null) ?? null,
    conditions: (row.medical_conditions_summary as string | null) ?? null,
    internalNotes: (row.internal_notes as string | null) ?? null,
    since: String(row.created_at || ""),
    activePlans,
    orders: orders.slice(0, 40),
    notes,
    messageThreads,
    duplicateCandidates,
  };
}

export async function updateRxPatientChart(
  clientId: string,
  patch: {
    allergies?: string | null;
    medications?: string | null;
    conditions?: string | null;
    internalNotes?: string | null;
    state?: string | null;
  },
  actorEmail: string,
  client?: SupabaseClient | null,
): Promise<{ ok: boolean; error?: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.allergies !== undefined) update.allergies_summary = patch.allergies;
  if (patch.medications !== undefined) update.medications_summary = patch.medications;
  if (patch.conditions !== undefined) update.medical_conditions_summary = patch.conditions;
  if (patch.internalNotes !== undefined) update.internal_notes = patch.internalNotes;
  if (patch.state !== undefined) update.state = patch.state?.trim().toUpperCase().slice(0, 2) || null;

  const { error } = await admin.from("clients").update(update).eq("id", clientId);
  if (error) return { ok: false, error: error.message };

  await logRxPatientAccess(
    {
      clientId,
      action: "patient_update",
      actorEmail,
      detail: { fields: Object.keys(patch) },
    },
    admin,
  );

  return { ok: true };
}
