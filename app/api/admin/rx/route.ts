import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import type { RxPaymentLedgerRow } from "@/lib/rx-payment-ledger";
import {
  RX_INTAKE_SLUGS,
  defaultDispatchFromIntake,
  intakeDisplayName,
  intakeTrackFromSlug,
  type RxDispatchRecord,
} from "@/lib/rx-dispatch";
import {
  listClinicEncountersWithClient,
  type RxClinicEncounterWithClient,
} from "@/lib/rx-clinic-encounter";
import { regenClinicPrimaryTrack } from "@/lib/rx-clinic-regen-sale";
import {
  mapRegenOrderToAdminItem,
  type RegenOrderRecord,
} from "@/lib/regen/order-patient-status";
import { listAllRefillCadence } from "@/lib/rx-refill-cadence";
import { intakeRefFromToken } from "@/lib/rx-submission-context";

export const dynamic = "force-dynamic";

const RX_SLUG_SET = new Set<string>(RX_INTAKE_SLUGS);

type TemplateRow = { id: string; slug: string; title: string };

type SubmissionRow = {
  id: string;
  submitted_at: string;
  signer_name: string | null;
  client_phone: string | null;
  client_id: string | null;
  access_token: string | null;
  responses_json: Record<string, unknown> | null;
  template_id: string;
};

export type RxCommandCenterItem = {
  kind: "intake" | "clinic" | "regen";
  id: string;
  submissionId: string;
  submittedAt: string;
  intakeRef: string;
  slug: string;
  templateTitle: string;
  track: "peptide" | "glp1" | "unknown";
  patientName: string;
  phone: string | null;
  email: string | null;
  qualified: boolean;
  dispatchStatus: string;
  paymentStatus: string | null;
  paymentAmountUsd: number | null;
  paymentUrl: string | null;
  templateId: string | null;
  ledgerId: string | null;
  unreadMessages: number;
  clientId?: string | null;
  encounterStatus?: string | null;
  trackingNumber?: string | null;
};

function mapLedger(raw: Record<string, unknown>): RxPaymentLedgerRow {
  return raw as unknown as RxPaymentLedgerRow;
}

function clinicRef(id: string): string {
  return `CL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function paymentStatusFromEncounter(row: RxClinicEncounterWithClient): string {
  if (row.status === "paid" || row.status === "ready_to_ship" || row.status === "shipped" || row.status === "complete") {
    return "paid";
  }
  if (row.status === "awaiting_payment") return "pending";
  if (row.status === "cancelled") return "failed";
  return "pending";
}

function mapClinicToCommandItem(row: RxClinicEncounterWithClient): RxCommandCenterItem {
  const quote = row.pricing_snapshot?.quote;
  const isRegen = row.sale_mode === "regen_catalog";
  const lineItems = row.line_items ?? [];
  return {
    kind: "clinic",
    id: row.id,
    submissionId: row.id,
    submittedAt: row.created_at,
    intakeRef: clinicRef(row.id),
    slug: isRegen ? "clinic-regen-sale" : "clinic-sale",
    templateTitle: isRegen ? "RE GEN in-clinic sale" : "In-person clinic sale",
    track: isRegen ? regenClinicPrimaryTrack(lineItems) : "glp1",
    patientName: row.client_name || "Client",
    phone: row.client_phone,
    email: row.client_email,
    qualified: true,
    dispatchStatus: row.dispatch_status,
    paymentStatus: paymentStatusFromEncounter(row),
    paymentAmountUsd: row.final_total_usd,
    paymentUrl: null,
    templateId: quote?.invoiceTemplateId ?? null,
    ledgerId: row.ledger_id,
    unreadMessages: 0,
    clientId: row.client_id,
    encounterStatus: row.status,
    trackingNumber: row.tracking_number,
  };
}
function pickLedgerForSubmission(
  submissionId: string,
  intakeRef: string,
  rows: RxPaymentLedgerRow[],
): RxPaymentLedgerRow | null {
  const matches = rows.filter(
    (r) =>
      r.submission_id === submissionId ||
      (intakeRef && r.intake_ref?.toUpperCase().startsWith(intakeRef.toUpperCase())),
  );
  if (!matches.length) return null;
  return matches.find((r) => r.payment_status === "paid") ?? matches[0];
}

/** GET /api/admin/rx — unified RX command center queue */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  const limit = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "40", 10)));

  const { data: templates } = await admin
    .from("hg_form_templates")
    .select("id, slug, title")
    .in("slug", [...RX_INTAKE_SLUGS]);

  const templateById = new Map((templates as TemplateRow[] | null)?.map((t) => [t.id, t]) ?? []);
  const templateIds = Array.from(templateById.keys());

  const { rows: clinicRows } = await listClinicEncountersWithClient({ limit });

  async function fetchRegenAdminItems() {
    const { data: regenRowsRaw } = await admin
      .from("regen_orders")
      .select(
        "reference, created_at, status, customer_name, customer_email, customer_phone, goal, items, subtotal_usd, shipping_usd, paid_at, intake_completed_at, telehealth_required, telehealth_completed_at, np_approved_at, shipped_at, tracking_number",
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    return ((regenRowsRaw ?? []) as RegenOrderRecord[]).map(mapRegenOrderToAdminItem);
  }

  if (!templateIds.length) {
    const clinicItems = clinicRows.map(mapClinicToCommandItem);
    const regenItems = await fetchRegenAdminItems();
    const mergedEarly = [...clinicItems, ...regenItems];
    mergedEarly.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
    const { items: dueRefills, tableReady: dueTableReady } = await listDueClinicRefills({
      limit: 20,
    });
    return NextResponse.json({
      items: mergedEarly.slice(0, limit),
      dueRefills,
      dueTableReady,
      dueCounts: {
        overdue: dueRefills.filter((d) => d.urgency === "overdue").length,
        dueSoon: dueRefills.filter((d) => d.urgency === "due_soon").length,
      },
    });
  }

  const { data: submissions } = await admin
    .from("hg_form_submissions")
    .select(
      "id, submitted_at, signer_name, client_phone, client_id, access_token, responses_json, template_id",
    )
    .in("template_id", templateIds)
    .order("submitted_at", { ascending: false })
    .limit(limit);

  const rows = (submissions ?? []) as SubmissionRow[];
  const submissionIds = rows.map((r) => r.id);
  const intakeRefs = rows.map((r) => intakeRefFromToken(r.access_token)).filter(Boolean);

  let dispatchBySubmission = new Map<string, RxDispatchRecord>();
  if (submissionIds.length) {
    const { data: dispatchRows } = await admin
      .from("hg_rx_dispatch")
      .select("*")
      .in("submission_id", submissionIds);
    if (dispatchRows) {
      dispatchBySubmission = new Map(
        (dispatchRows as RxDispatchRecord[]).map((d) => [d.submission_id, d]),
      );
    }
  }

  let ledgerRows: RxPaymentLedgerRow[] = [];
  if (submissionIds.length) {
    const { data: bySubmission } = await admin
      .from("hg_rx_payment_ledger")
      .select("*")
      .in("submission_id", submissionIds)
      .order("created_at", { ascending: false });
    ledgerRows = ((bySubmission ?? []) as Record<string, unknown>[]).map(mapLedger);
  }
  if (intakeRefs.length) {
    const { data: byRef } = await admin
      .from("hg_rx_payment_ledger")
      .select("*")
      .in("intake_ref", intakeRefs)
      .order("created_at", { ascending: false });
    const extra = ((byRef ?? []) as Record<string, unknown>[]).map(mapLedger);
    ledgerRows = [...ledgerRows, ...extra];
  }

  let unreadByRef = new Map<string, number>();
  if (intakeRefs.length) {
    const { data: threads } = await admin
      .from("hg_rx_message_threads")
      .select("intake_ref, unread_staff_count")
      .in("intake_ref", intakeRefs);
    for (const t of threads ?? []) {
      unreadByRef.set(String(t.intake_ref).toUpperCase(), Number(t.unread_staff_count) || 0);
    }
  }

  const items: RxCommandCenterItem[] = rows
    .map((row) => {
      const template = templateById.get(row.template_id);
      const slug = template?.slug ?? "";
      if (!RX_SLUG_SET.has(slug)) return null;

      const responses = row.responses_json ?? {};
      const ref = intakeRefFromToken(row.access_token);
      const dispatch = dispatchBySubmission.get(row.id);
      const defaults = defaultDispatchFromIntake({
        slug,
        signerName: row.signer_name,
        responses,
      });
      const dispatchStatus = dispatch?.status ?? defaults.status;
      const ledger = pickLedgerForSubmission(row.id, ref, ledgerRows);

      return {
        kind: "intake" as const,
        id: row.id,
        submissionId: row.id,
        submittedAt: row.submitted_at,
        intakeRef: ref,
        slug,
        templateTitle: template?.title ?? slug,
        track: intakeTrackFromSlug(slug),
        patientName: intakeDisplayName(slug, row.signer_name, responses),
        phone: row.client_phone || String(responses.phone || "") || null,
        email: String(responses.email || "") || null,
        qualified: responses.qualified === true,
        dispatchStatus,
        paymentStatus: ledger?.payment_status ?? null,
        paymentAmountUsd: ledger?.amount_usd ?? null,
        paymentUrl: ledger?.payment_url ?? null,
        templateId: ledger?.template_id ?? null,
        ledgerId: ledger?.id ?? null,
        unreadMessages: unreadByRef.get(ref) ?? 0,
        clientId: row.client_id,
      };
    })
    .filter(Boolean) as RxCommandCenterItem[];

  const clinicItems = clinicRows.map(mapClinicToCommandItem);
  const regenItems = await fetchRegenAdminItems();

  const merged = [...items, ...clinicItems, ...regenItems];
  merged.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  const { items: cadenceItems, counts: dueCounts, tableReady: dueTableReady } =
    await listAllRefillCadence(admin, { limit: 20 });

  const dueRefills = cadenceItems.map((c) => ({
    clientId: c.clientId,
    clientName: c.clientName,
    medication: c.medication,
    doseLabel: c.doseLabel,
    supplyCycle: c.supplyCycle,
    urgency: c.urgency,
    daysUntilDue: c.daysUntilDue,
    dueAt: c.dueAt,
    source: c.source,
  }));

  return NextResponse.json({
    items: merged.slice(0, limit),
    dueRefills,
    dueTableReady,
    dueCounts,
  });
}
