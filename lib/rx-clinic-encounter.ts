/**
 * In-person GLP-1 clinic encounters — consult, consistent pricing, ship-to-home.
 * No clinic drug inventory; payment via terminal or cash with full audit trail.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { computeGlp1RefillQuote, type Glp1RefillQuote } from "@/lib/glp1-refill-pricing";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { computeGlp1VialFulfillment } from "@/lib/glp1-vial-fulfillment";
import { notifyPatientClinicRxShipped } from "@/lib/rx-clinic-ship-notify";
import {
  insertRxPaymentLedger,
  updateRxPaymentLedger,
  type RxLedgerSource,
} from "@/lib/rx-payment-ledger";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type RxClinicEncounterType = "new_consult" | "refill" | "dose_change";

export type RxClinicEncounterStatus =
  | "draft"
  | "awaiting_payment"
  | "paid"
  | "ready_to_ship"
  | "shipped"
  | "complete"
  | "cancelled";

export type RxClinicDispatchStatus = "new" | "reviewed" | "sent" | "shipped";

export type RxClinicPaymentMethod = "terminal" | "payment_link" | "cash" | "other";

export type RxClinicPharmacy = "formulation" | "boomrx";

export type RxClinicClinical = {
  allergiesReviewed?: boolean;
  currentMedicationsReviewed?: boolean;
  weightLbs?: number | null;
  goalWeightLbs?: number | null;
  titrationNote?: string;
  nextTelehealthDue?: string | null;
  labsOnFile?: boolean;
  contraindicationsNone?: boolean;
};

export type RxClinicPricingSnapshot = {
  quote: Glp1RefillQuote | null;
  consultFeeUsd: number;
  listTotalUsd: number;
  discountUsd: number;
  discountReason?: string | null;
  discountAuthorizedBy?: string | null;
  finalTotalUsd: number;
};

export type RxClinicEncounterRow = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  created_by: string | null;
  encounter_type: RxClinicEncounterType;
  medication: string;
  dose_tier_id: string;
  dose_label: string | null;
  supply_cycle: RxSupplyCycleId;
  list_total_usd: number;
  consult_fee_usd: number;
  discount_usd: number;
  discount_reason: string | null;
  discount_authorized_by: string | null;
  final_total_usd: number;
  pricing_snapshot: RxClinicPricingSnapshot;
  ship_address_line1: string | null;
  ship_address_line2: string | null;
  ship_city: string | null;
  ship_state: string | null;
  ship_zip: string | null;
  pharmacy: RxClinicPharmacy | null;
  dispatch_status: RxClinicDispatchStatus;
  sig: string | null;
  clinical: RxClinicClinical;
  staff_notes: string | null;
  status: RxClinicEncounterStatus;
  payment_method: RxClinicPaymentMethod | null;
  sale_id: string | null;
  ledger_id: string | null;
  square_order_id: string | null;
  square_payment_id: string | null;
  paid_at: string | null;
  chart_note_id: string | null;
  tracking_number: string | null;
  carrier: string | null;
  shipped_at: string | null;
  appointment_id: string | null;
  autopay_status: "none" | "pending" | "active" | "cancelled";
  autopay_payment_url: string | null;
  autopay_ledger_id: string | null;
  autopay_enrolled_at: string | null;
};

export type ComputeClinicSaleInput = {
  medication: string;
  doseTierId: string;
  supplyCycle: RxSupplyCycleId;
  consultFeeUsd?: number;
  discountUsd?: number;
  discountReason?: string | null;
  discountAuthorizedBy?: string | null;
};

export type SaveClinicEncounterInput = ComputeClinicSaleInput & {
  clientId: string;
  createdBy?: string | null;
  encounterType: RxClinicEncounterType;
  shipAddressLine1?: string | null;
  shipAddressLine2?: string | null;
  shipCity?: string | null;
  shipState?: string | null;
  shipZip?: string | null;
  pharmacy?: RxClinicPharmacy | null;
  sig?: string | null;
  clinical?: RxClinicClinical;
  staffNotes?: string | null;
  status?: RxClinicEncounterStatus;
  appointmentId?: string | null;
};

export const RX_CLINIC_ENCOUNTER_TYPES: { id: RxClinicEncounterType; label: string }[] = [
  { id: "new_consult", label: "New weight loss consult" },
  { id: "refill", label: "Refill — same dose" },
  { id: "dose_change", label: "Dose change / titration" },
];

export const RX_CLINIC_TITRATION_PRESETS = [
  "Continue current dose",
  "Titrate up per HG protocol",
  "Hold dose — side effects",
  "Reduce dose — tolerability",
] as const;

function roundUsd(n: number): number {
  return Math.round(n * 100) / 100;
}

function mapRow(raw: Record<string, unknown>): RxClinicEncounterRow {
  return {
    id: String(raw.id),
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
    client_id: String(raw.client_id),
    created_by: (raw.created_by as string | null) ?? null,
    encounter_type: raw.encounter_type as RxClinicEncounterType,
    medication: String(raw.medication),
    dose_tier_id: String(raw.dose_tier_id),
    dose_label: (raw.dose_label as string | null) ?? null,
    supply_cycle: raw.supply_cycle as RxSupplyCycleId,
    list_total_usd: Number(raw.list_total_usd),
    consult_fee_usd: Number(raw.consult_fee_usd),
    discount_usd: Number(raw.discount_usd),
    discount_reason: (raw.discount_reason as string | null) ?? null,
    discount_authorized_by: (raw.discount_authorized_by as string | null) ?? null,
    final_total_usd: Number(raw.final_total_usd),
    pricing_snapshot: (raw.pricing_snapshot as RxClinicPricingSnapshot) ?? {},
    ship_address_line1: (raw.ship_address_line1 as string | null) ?? null,
    ship_address_line2: (raw.ship_address_line2 as string | null) ?? null,
    ship_city: (raw.ship_city as string | null) ?? null,
    ship_state: (raw.ship_state as string | null) ?? null,
    ship_zip: (raw.ship_zip as string | null) ?? null,
    pharmacy: (raw.pharmacy as RxClinicPharmacy | null) ?? null,
    dispatch_status: (raw.dispatch_status as RxClinicDispatchStatus) ?? "new",
    sig: (raw.sig as string | null) ?? null,
    clinical: (raw.clinical as RxClinicClinical) ?? {},
    staff_notes: (raw.staff_notes as string | null) ?? null,
    status: raw.status as RxClinicEncounterStatus,
    payment_method: (raw.payment_method as RxClinicPaymentMethod | null) ?? null,
    sale_id: (raw.sale_id as string | null) ?? null,
    ledger_id: (raw.ledger_id as string | null) ?? null,
    square_order_id: (raw.square_order_id as string | null) ?? null,
    square_payment_id: (raw.square_payment_id as string | null) ?? null,
    paid_at: (raw.paid_at as string | null) ?? null,
    chart_note_id: (raw.chart_note_id as string | null) ?? null,
    tracking_number: (raw.tracking_number as string | null) ?? null,
    carrier: (raw.carrier as string | null) ?? null,
    shipped_at: (raw.shipped_at as string | null) ?? null,
    appointment_id: (raw.appointment_id as string | null) ?? null,
    autopay_status: (raw.autopay_status as RxClinicEncounterRow["autopay_status"]) ?? "none",
    autopay_payment_url: (raw.autopay_payment_url as string | null) ?? null,
    autopay_ledger_id: (raw.autopay_ledger_id as string | null) ?? null,
    autopay_enrolled_at: (raw.autopay_enrolled_at as string | null) ?? null,
  };
}

export function computeClinicSalePricing(input: ComputeClinicSaleInput): {
  quote: Glp1RefillQuote;
  snapshot: RxClinicPricingSnapshot;
} | { error: string } {
  const quote = computeGlp1RefillQuote(
    input.medication,
    input.doseTierId,
    input.supplyCycle,
  );
  if (!quote) return { error: "Invalid medication or dose tier" };

  const consultFeeUsd = roundUsd(Math.max(0, input.consultFeeUsd ?? 0));
  const listTotalUsd = roundUsd(quote.priceUsd + consultFeeUsd);
  const discountUsd = roundUsd(Math.max(0, input.discountUsd ?? 0));

  if (discountUsd > listTotalUsd) {
    return { error: "Discount cannot exceed list total" };
  }
  if (discountUsd > 0 && !String(input.discountReason || "").trim()) {
    return { error: "Discount reason is required for owner override" };
  }

  const finalTotalUsd = roundUsd(listTotalUsd - discountUsd);
  const snapshot: RxClinicPricingSnapshot = {
    quote,
    consultFeeUsd,
    listTotalUsd,
    discountUsd,
    discountReason: input.discountReason?.trim() || null,
    discountAuthorizedBy: input.discountAuthorizedBy?.trim() || null,
    finalTotalUsd,
  };

  return { quote, snapshot };
}

export function formatClinicDispatchPreview(row: RxClinicEncounterRow, clientName: string): string {
  const fulfillment = computeGlp1VialFulfillment(
    row.medication,
    row.dose_tier_id,
    row.supply_cycle,
    row.pharmacy === "formulation" ? "formulation" : "boomrx",
  );
  const lines = [
    `Patient: ${clientName}`,
    `Medication: ${row.medication} — ${row.dose_label || row.dose_tier_id}`,
    `Supply: ${row.supply_cycle}`,
    fulfillment
      ? fulfillment.pharmacySku
        ? `Formulation SKU ${fulfillment.pharmacySku} — ${fulfillment.vialsToOrder} vial${fulfillment.vialsToOrder === 1 ? "" : "s"} · $${fulfillment.totalWholesaleUsd} wholesale · ❄ cold ship`
        : `Vials to order: ${fulfillment.vialsToOrder} ($${fulfillment.totalWholesaleUsd} wholesale)`
      : null,
    `Ship to: ${row.ship_address_line1 || ""}${row.ship_address_line2 ? `, ${row.ship_address_line2}` : ""}`,
    `${row.ship_city || ""}, ${row.ship_state || "IL"} ${row.ship_zip || ""}`.trim(),
    row.sig ? `Sig: ${row.sig}` : "",
    row.staff_notes ? `Notes: ${row.staff_notes}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}

export async function insertClinicEncounter(
  input: SaveClinicEncounterInput,
  client?: SupabaseClient | null,
): Promise<{ row: RxClinicEncounterRow } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };

  const pricing = computeClinicSalePricing(input);
  if ("error" in pricing) return { error: pricing.error };

  const row = {
    client_id: input.clientId,
    created_by: input.createdBy?.trim() || null,
    encounter_type: input.encounterType,
    medication: input.medication,
    dose_tier_id: input.doseTierId,
    dose_label: pricing.quote.doseLabel,
    supply_cycle: input.supplyCycle,
    list_total_usd: pricing.snapshot.listTotalUsd,
    consult_fee_usd: pricing.snapshot.consultFeeUsd,
    discount_usd: pricing.snapshot.discountUsd,
    discount_reason: pricing.snapshot.discountReason,
    discount_authorized_by: pricing.snapshot.discountAuthorizedBy,
    final_total_usd: pricing.snapshot.finalTotalUsd,
    pricing_snapshot: pricing.snapshot,
    ship_address_line1: input.shipAddressLine1?.trim() || null,
    ship_address_line2: input.shipAddressLine2?.trim() || null,
    ship_city: input.shipCity?.trim() || null,
    ship_state: input.shipState?.trim() || "IL",
    ship_zip: input.shipZip?.trim() || null,
    pharmacy: input.pharmacy ?? null,
    sig: input.sig?.trim() || null,
    clinical: input.clinical ?? {},
    staff_notes: input.staffNotes?.trim() || null,
    appointment_id: input.appointmentId ?? null,
    status: input.status ?? "draft",
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin
    .from("hg_rx_clinic_encounters")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    if (error.code === "42P01") return { error: "Clinic encounters table not migrated yet" };
    return { error: error.message };
  }

  const row = mapRow(data as Record<string, unknown>);
  await createClinicEncounterChartNote(row, input.createdBy, admin);

  const withChart = (await getClinicEncounter(row.id, admin)) ?? row;
  return { row: withChart };
}

export async function updateClinicEncounter(
  id: string,
  patch: Partial<SaveClinicEncounterInput> & {
    status?: RxClinicEncounterStatus;
    dispatchStatus?: RxClinicDispatchStatus;
    paymentMethod?: RxClinicPaymentMethod | null;
    saleId?: string | null;
    ledgerId?: string | null;
    squareOrderId?: string | null;
    squarePaymentId?: string | null;
    paidAt?: string | null;
    chartNoteId?: string | null;
    trackingNumber?: string | null;
    carrier?: string | null;
    shippedAt?: string | null;
    appointmentId?: string | null;
    autopayStatus?: RxClinicEncounterRow["autopay_status"];
    autopayPaymentUrl?: string | null;
    autopayLedgerId?: string | null;
    autopayEnrolledAt?: string | null;
  },
  client?: SupabaseClient | null,
): Promise<{ row: RxClinicEncounterRow } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };

  const { data: existingRaw, error: fetchErr } = await admin
    .from("hg_rx_clinic_encounters")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !existingRaw) return { error: "Encounter not found" };
  const existing = mapRow(existingRaw as Record<string, unknown>);

  const reprice =
    patch.medication != null ||
    patch.doseTierId != null ||
    patch.supplyCycle != null ||
    patch.consultFeeUsd != null ||
    patch.discountUsd != null ||
    patch.discountReason != null;

  let pricingFields: Record<string, unknown> = {};
  if (reprice) {
    const pricing = computeClinicSalePricing({
      medication: patch.medication ?? existing.medication,
      doseTierId: patch.doseTierId ?? existing.dose_tier_id,
      supplyCycle: patch.supplyCycle ?? existing.supply_cycle,
      consultFeeUsd: patch.consultFeeUsd ?? existing.consult_fee_usd,
      discountUsd: patch.discountUsd ?? existing.discount_usd,
      discountReason: patch.discountReason ?? existing.discount_reason,
      discountAuthorizedBy:
        patch.discountAuthorizedBy ?? existing.discount_authorized_by,
    });
    if ("error" in pricing) return { error: pricing.error };
    pricingFields = {
      dose_label: pricing.quote.doseLabel,
      list_total_usd: pricing.snapshot.listTotalUsd,
      consult_fee_usd: pricing.snapshot.consultFeeUsd,
      discount_usd: pricing.snapshot.discountUsd,
      discount_reason: pricing.snapshot.discountReason,
      discount_authorized_by: pricing.snapshot.discountAuthorizedBy,
      final_total_usd: pricing.snapshot.finalTotalUsd,
      pricing_snapshot: pricing.snapshot,
    };
  }

  const updateRow: Record<string, unknown> = {
    ...pricingFields,
    updated_at: new Date().toISOString(),
  };

  if (patch.encounterType != null) updateRow.encounter_type = patch.encounterType;
  if (patch.medication != null) updateRow.medication = patch.medication;
  if (patch.doseTierId != null) updateRow.dose_tier_id = patch.doseTierId;
  if (patch.supplyCycle != null) updateRow.supply_cycle = patch.supplyCycle;
  if (patch.shipAddressLine1 != null) updateRow.ship_address_line1 = patch.shipAddressLine1.trim() || null;
  if (patch.shipAddressLine2 != null) updateRow.ship_address_line2 = patch.shipAddressLine2.trim() || null;
  if (patch.shipCity != null) updateRow.ship_city = patch.shipCity.trim() || null;
  if (patch.shipState != null) updateRow.ship_state = patch.shipState.trim() || "IL";
  if (patch.shipZip != null) updateRow.ship_zip = patch.shipZip.trim() || null;
  if (patch.pharmacy !== undefined) updateRow.pharmacy = patch.pharmacy;
  if (patch.sig != null) updateRow.sig = patch.sig.trim() || null;
  if (patch.clinical != null) updateRow.clinical = patch.clinical;
  if (patch.staffNotes != null) updateRow.staff_notes = patch.staffNotes.trim() || null;
  if (patch.status != null) updateRow.status = patch.status;
  if (patch.dispatchStatus != null) updateRow.dispatch_status = patch.dispatchStatus;
  if (patch.paymentMethod !== undefined) updateRow.payment_method = patch.paymentMethod;
  if (patch.saleId !== undefined) updateRow.sale_id = patch.saleId;
  if (patch.ledgerId !== undefined) updateRow.ledger_id = patch.ledgerId;
  if (patch.squareOrderId !== undefined) updateRow.square_order_id = patch.squareOrderId;
  if (patch.squarePaymentId !== undefined) updateRow.square_payment_id = patch.squarePaymentId;
  if (patch.paidAt !== undefined) updateRow.paid_at = patch.paidAt;
  if (patch.chartNoteId !== undefined) updateRow.chart_note_id = patch.chartNoteId;
  if (patch.trackingNumber !== undefined) updateRow.tracking_number = patch.trackingNumber?.trim() || null;
  if (patch.carrier !== undefined) updateRow.carrier = patch.carrier?.trim() || null;
  if (patch.shippedAt !== undefined) updateRow.shipped_at = patch.shippedAt;
  if (patch.appointmentId !== undefined) updateRow.appointment_id = patch.appointmentId;
  if (patch.autopayStatus !== undefined) updateRow.autopay_status = patch.autopayStatus;
  if (patch.autopayPaymentUrl !== undefined) updateRow.autopay_payment_url = patch.autopayPaymentUrl;
  if (patch.autopayLedgerId !== undefined) updateRow.autopay_ledger_id = patch.autopayLedgerId;
  if (patch.autopayEnrolledAt !== undefined) updateRow.autopay_enrolled_at = patch.autopayEnrolledAt;

  const { data, error } = await admin
    .from("hg_rx_clinic_encounters")
    .update(updateRow)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { error: error.message };
  return { row: mapRow(data as Record<string, unknown>) };
}

export async function getClinicEncounter(
  id: string,
  client?: SupabaseClient | null,
): Promise<RxClinicEncounterRow | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("hg_rx_clinic_encounters")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function listClinicEncounters(
  filters: { clientId?: string; status?: RxClinicEncounterStatus | "all"; limit?: number } = {},
  client?: SupabaseClient | null,
): Promise<{ rows: RxClinicEncounterRow[]; tableReady: boolean }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { rows: [], tableReady: false };

  const limit = Math.min(100, Math.max(1, filters.limit ?? 30));
  let query = admin
    .from("hg_rx_clinic_encounters")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.clientId) query = query.eq("client_id", filters.clientId);
  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) {
    if (error.code === "42P01") return { rows: [], tableReady: false };
    return { rows: [], tableReady: true };
  }

  return {
    rows: (data ?? []).map((r) => mapRow(r as Record<string, unknown>)),
    tableReady: true,
  };
}

export async function ensureClinicEncounterLedger(
  encounter: RxClinicEncounterRow,
  clientInfo: { name: string; email?: string | null; phone?: string | null },
  sentBy: string,
  source: RxLedgerSource = "clinic_terminal",
  client?: SupabaseClient | null,
): Promise<string | null> {
  if (encounter.ledger_id) return encounter.ledger_id;

  const quote = encounter.pricing_snapshot?.quote;
  const discountNote =
    encounter.discount_usd > 0
      ? `Owner discount $${encounter.discount_usd.toFixed(2)} — ${encounter.discount_reason} (${encounter.discount_authorized_by})`
      : null;

  const ledger = await insertRxPaymentLedger(
    {
      clientId: encounter.client_id,
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      source,
      templateId: quote?.invoiceTemplateId,
      templateName: `${encounter.medication} ${encounter.dose_label || encounter.dose_tier_id}`,
      track: "weight-loss",
      lineLabel: quote?.lineLabel ?? encounter.medication,
      amountUsd: encounter.final_total_usd,
      paymentStatus: "pending",
      sentBy,
      staffNote: discountNote ?? undefined,
      chartNote: encounter.staff_notes ?? undefined,
      metadata: {
        clinicEncounterId: encounter.id,
        encounterType: encounter.encounter_type,
        supplyCycle: encounter.supply_cycle,
        listTotalUsd: encounter.list_total_usd,
        discountUsd: encounter.discount_usd,
        shipToHome: true,
      },
    },
    client,
  );

  if (!ledger) return null;

  await updateClinicEncounter(
    encounter.id,
    { ledgerId: ledger.id },
    client,
  );

  return ledger.id;
}

export async function markClinicEncounterPaid(
  encounterId: string,
  opts: {
    paymentMethod: RxClinicPaymentMethod;
    squareOrderId?: string | null;
    squarePaymentId?: string | null;
    sentBy: string;
  },
  client?: SupabaseClient | null,
): Promise<{ row: RxClinicEncounterRow } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  const encounter = await getClinicEncounter(encounterId, client);
  if (!encounter) return { error: "Encounter not found" };

  const paidAt = new Date().toISOString();
  const source: RxLedgerSource =
    opts.paymentMethod === "cash" ? "clinic_cash" : "clinic_terminal";

  if (!encounter.ledger_id && admin) {
    const { data: clientRow } = await admin
      .from("clients")
      .select("first_name, last_name, email, phone")
      .eq("id", encounter.client_id)
      .maybeSingle();
    const clientName = clientRow
      ? `${clientRow.first_name || ""} ${clientRow.last_name || ""}`.trim()
      : "Client";
    await ensureClinicEncounterLedger(
      encounter,
      { name: clientName, email: clientRow?.email, phone: clientRow?.phone },
      opts.sentBy,
      source,
      admin,
    );
  }

  const refreshed = (await getClinicEncounter(encounterId, client)) ?? encounter;

  if (refreshed.ledger_id) {
    await updateRxPaymentLedger(
      refreshed.ledger_id,
      {
        paymentStatus: "paid",
        paidAt,
        squareOrderId: opts.squareOrderId ?? undefined,
        squarePaymentId: opts.squarePaymentId ?? undefined,
      },
      client,
    );
  }

  return updateClinicEncounter(
    encounterId,
    {
      status: "paid",
      dispatchStatus: "new",
      paymentMethod: opts.paymentMethod,
      squareOrderId: opts.squareOrderId ?? null,
      squarePaymentId: opts.squarePaymentId ?? null,
      paidAt,
    },
    client,
  ).then(async (result) => {
    if ("error" in result) return result;
    if (!result.row.chart_note_id) {
      await createClinicEncounterChartNote(result.row, opts.sentBy, client);
      const refreshed = await getClinicEncounter(encounterId, client);
      if (refreshed) return { row: refreshed };
    }
    return result;
  });
}

/** Auto-create hormone-style chart note so Ryan/Danielle stay in sync. */
export async function createClinicEncounterChartNote(
  encounter: RxClinicEncounterRow,
  createdByEmail?: string | null,
  client?: SupabaseClient | null,
): Promise<string | null> {
  if (encounter.chart_note_id) return encounter.chart_note_id;

  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const encounterLabel =
    RX_CLINIC_ENCOUNTER_TYPES.find((t) => t.id === encounter.encounter_type)?.label ??
    "Clinic visit";
  const clinical = encounter.clinical ?? {};

  const subjective = [
    clinical.allergiesReviewed ? "Allergies reviewed." : null,
    clinical.currentMedicationsReviewed ? "Current medications reviewed." : null,
    clinical.contraindicationsNone ? "No contraindications noted." : null,
    clinical.labsOnFile ? "Labs on file." : null,
  ]
    .filter(Boolean)
    .join(" ");

  const objectiveParts: string[] = [];
  if (clinical.weightLbs) objectiveParts.push(`Weight: ${clinical.weightLbs} lbs`);
  if (clinical.goalWeightLbs) objectiveParts.push(`Goal weight: ${clinical.goalWeightLbs} lbs`);
  const objective = objectiveParts.join(". ");

  const assessment = `${encounter.medication} ${encounter.dose_label || encounter.dose_tier_id} — ${encounter.supply_cycle} supply (ship to home)`;

  const plan = [
    clinical.titrationNote,
    encounter.sig ? `Sig: ${encounter.sig}` : null,
    `Pharmacy: ${encounter.pharmacy || "TBD"}. Medication ships to patient — not held at clinic.`,
    clinical.nextTelehealthDue
      ? `Next telehealth due: ${clinical.nextTelehealthDue}`
      : "Telehealth every 90 days per Hello Gorgeous RX protocol.",
    encounter.staff_notes ? `Staff notes: ${encounter.staff_notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const procedureDetails = {
    source: "rx_clinic_encounter",
    clinicEncounterId: encounter.id,
    medication: encounter.medication,
    doseTierId: encounter.dose_tier_id,
    doseLabel: encounter.dose_label,
    supplyCycle: encounter.supply_cycle,
    pharmacy: encounter.pharmacy,
    shipToHome: true,
    shipAddress: {
      line1: encounter.ship_address_line1,
      line2: encounter.ship_address_line2,
      city: encounter.ship_city,
      state: encounter.ship_state,
      zip: encounter.ship_zip,
    },
    clinical,
    pricing: encounter.pricing_snapshot,
    createdByEmail: createdByEmail ?? null,
  };

  const { data, error } = await admin
    .from("chart_notes")
    .insert({
      client_id: encounter.client_id,
      note_type: "consult",
      title: `GLP-1 ${encounterLabel} — ${encounter.medication}`,
      status: "final",
      subjective: subjective || null,
      objective: objective || null,
      assessment,
      plan,
      procedure_details: procedureDetails,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[rx-clinic-encounter] chart note", error.message);
    return null;
  }

  const chartNoteId = String(data.id);
  await updateClinicEncounter(encounter.id, { chartNoteId }, admin);
  return chartNoteId;
}

export async function updateClinicEncounterDispatch(
  id: string,
  patch: {
    dispatchStatus?: RxClinicDispatchStatus;
    trackingNumber?: string | null;
    carrier?: string | null;
  },
  client?: SupabaseClient | null,
): Promise<{ row: RxClinicEncounterRow } | { error: string }> {
  const encounter = await getClinicEncounter(id, client);
  if (!encounter) return { error: "Encounter not found" };

  const dispatchStatus = patch.dispatchStatus ?? encounter.dispatch_status;
  const shippedAt =
    dispatchStatus === "shipped" && !encounter.shipped_at
      ? new Date().toISOString()
      : encounter.shipped_at;

  let status = encounter.status;
  if (dispatchStatus === "sent" && encounter.status === "paid") {
    status = "ready_to_ship";
  }
  if (dispatchStatus === "shipped") {
    status = "shipped";
  }

  const result = await updateClinicEncounter(
    id,
    {
      dispatchStatus,
      trackingNumber: patch.trackingNumber,
      carrier: patch.carrier,
      shippedAt,
      status,
    },
    client,
  );

  if ("error" in result) return result;

  if (
    dispatchStatus === "shipped" &&
    encounter.dispatch_status !== "shipped"
  ) {
    const admin = client ?? getSupabaseAdminClient();
    if (admin) {
      const { data: clientRow } = await admin
        .from("clients")
        .select("first_name, last_name, phone")
        .eq("id", result.row.client_id)
        .maybeSingle();
      const patientName = clientRow
        ? `${clientRow.first_name || ""} ${clientRow.last_name || ""}`.trim()
        : "Patient";
      await notifyPatientClinicRxShipped({
        phone: clientRow?.phone,
        patientName,
        carrier: result.row.carrier,
        trackingNumber: result.row.tracking_number,
        encounter: result.row,
      });
    }
  }

  return result;
}

export type RxClinicEncounterWithClient = RxClinicEncounterRow & {
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
};

export async function listClinicEncountersWithClient(
  filters: { clientId?: string; status?: RxClinicEncounterStatus | "all"; limit?: number } = {},
  client?: SupabaseClient | null,
): Promise<{ rows: RxClinicEncounterWithClient[]; tableReady: boolean }> {
  const { rows, tableReady } = await listClinicEncounters(filters, client);
  if (!rows.length) return { rows: [], tableReady };

  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { rows: rows.map((r) => ({ ...r, client_name: null, client_phone: null, client_email: null })), tableReady };

  const clientIds = [...new Set(rows.map((r) => r.client_id))];
  const { data: clients } = await admin
    .from("clients")
    .select("id, first_name, last_name, phone, email")
    .in("id", clientIds);

  const clientMap = new Map(
    (clients ?? []).map((c) => [
      String(c.id),
      {
        name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
        phone: c.phone as string | null,
        email: c.email as string | null,
      },
    ]),
  );

  return {
    rows: rows.map((r) => {
      const c = clientMap.get(r.client_id);
      return {
        ...r,
        client_name: c?.name ?? null,
        client_phone: c?.phone ?? null,
        client_email: c?.email ?? null,
      };
    }),
    tableReady,
  };
}
