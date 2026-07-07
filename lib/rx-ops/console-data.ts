import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { loadRxOpsFormulary } from "@/lib/rx-ops/formulary";
import {
  initialsFromName,
  mapToOpsStage,
  relativeSubmittedLabel,
} from "@/lib/rx-ops/stages";
import type {
  RxOpsConsolePayload,
  RxOpsPaymentRow,
  RxOpsRefillRow,
  RxOpsRequest,
  RxOpsRequestKind,
} from "@/lib/rx-ops/types";
import { regenClinicPrimaryTrack } from "@/lib/rx-clinic-regen-sale";
import { listClinicEncountersWithClient } from "@/lib/rx-clinic-encounter";
import {
  RX_INTAKE_SLUGS,
  defaultDispatchFromIntake,
  intakeDisplayName,
  intakeTrackFromSlug,
  type RxDispatchRecord,
} from "@/lib/rx-dispatch";
import { mapRegenOrderToAdminItem, type RegenOrderRecord } from "@/lib/regen/order-patient-status";
import { regenOrderNeedsReview } from "@/lib/regen/order-fulfillment";
import { listRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { listAllRefillCadence } from "@/lib/rx-refill-cadence";
import { intakeRefFromToken } from "@/lib/rx-submission-context";
import { listPharmacyShipments } from "@/lib/rx-pharmacy-fulfillment/shipments";
import { PHARMACY_SHIPMENT_STATUS_LABELS } from "@/lib/rx-pharmacy-fulfillment/types";

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

function requestKey(kind: RxOpsRequestKind, id: string) {
  return `${kind}:${id}`;
}

function productLabelFromItem(item: {
  kind: RxOpsRequestKind;
  templateTitle: string;
  track: string;
  slug: string;
}): { compound: string; product: string; reason: string } {
  if (item.kind === "regen") {
    return {
      compound: item.track === "glp1" ? "GLP-1" : "Peptide protocol",
      product: "RE GEN online order",
      reason: item.templateTitle,
    };
  }
  if (item.slug.includes("refill")) {
    return {
      compound: item.track === "glp1" ? "GLP-1" : "Peptide",
      product: item.templateTitle,
      reason: "Refill request",
    };
  }
  return {
    compound: item.track === "glp1" ? "GLP-1" : "Peptide",
    product: item.templateTitle,
    reason: "New protocol intake",
  };
}

function mapIntakeToRequest(
  row: SubmissionRow,
  template: TemplateRow | undefined,
  dispatch: RxDispatchRecord | undefined,
  paymentStatus: string | null,
  paymentAmountUsd: number | null,
): RxOpsRequest {
  const slug = template?.slug ?? "";
  const responses = row.responses_json ?? {};
  const ref = intakeRefFromToken(row.access_token);
  const defaults = defaultDispatchFromIntake({
    slug,
    signerName: row.signer_name,
    responses,
  });
  const dispatchStatus = dispatch?.status ?? defaults.status;
  const track = intakeTrackFromSlug(slug);
  const patientName = intakeDisplayName(slug, row.signer_name, responses);
  const stage = mapToOpsStage({
    kind: "intake",
    dispatchStatus,
    paymentStatus,
  });
  const { compound, product, reason } = productLabelFromItem({
    kind: "intake",
    templateTitle: template?.title ?? slug,
    track,
    slug,
  });

  return {
    id: requestKey("intake", row.id),
    kind: "intake",
    patientName,
    initials: initialsFromName(patientName),
    meta: ref || "Intake",
    compound,
    product,
    reason,
    stage,
    submittedAt: row.submitted_at,
    submittedLabel: relativeSubmittedLabel(row.submitted_at),
    track,
    phone: row.client_phone || String(responses.phone || "") || null,
    email: String(responses.email || "") || null,
    paymentStatus,
    paymentAmountUsd,
    intakeRef: ref,
    detailHref: `/admin/rx-dispatch?submission=${row.id}`,
    actionHref: `/admin/rx-dispatch?submission=${row.id}`,
  };
}

function mapClinicToRequest(row: Awaited<ReturnType<typeof listClinicEncountersWithClient>>["rows"][0]): RxOpsRequest {
  const isRegen = row.sale_mode === "regen_catalog";
  const lineItems = row.line_items ?? [];
  const track = isRegen ? regenClinicPrimaryTrack(lineItems) : "glp1";
  const paymentStatus =
    row.status === "paid" || row.status === "ready_to_ship" || row.status === "shipped" || row.status === "complete"
      ? "paid"
      : row.status === "awaiting_payment"
        ? "pending"
        : null;
  const stage = mapToOpsStage({
    kind: "clinic",
    dispatchStatus: row.dispatch_status,
    paymentStatus,
    encounterStatus: row.status,
    shipped: row.status === "shipped" || row.status === "complete",
  });
  const patientName = row.client_name || "Client";
  const firstLine = lineItems[0];
  const product = isRegen
    ? firstLine?.name || "RE GEN in-clinic sale"
    : `${row.medication || "GLP-1"}${row.dose_label ? ` · ${row.dose_label}` : ""}`;

  return {
    id: requestKey("clinic", row.id),
    kind: "clinic",
    patientName,
    initials: initialsFromName(patientName),
    meta: row.client_phone || "In-clinic",
    compound: track === "glp1" ? "GLP-1" : "Peptide",
    product,
    reason: isRegen ? "RE GEN in-clinic sale" : "Clinic GLP-1 sale",
    stage,
    submittedAt: row.created_at,
    submittedLabel: relativeSubmittedLabel(row.created_at),
    track,
    phone: row.client_phone,
    email: row.client_email,
    paymentStatus,
    paymentAmountUsd: row.final_total_usd,
    intakeRef: `CL-${row.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    detailHref: `/admin/rx/clinic-sale?encounter=${row.id}`,
    actionHref: `/admin/rx/clinic-sale?encounter=${row.id}`,
  };
}

function mapRegenToRequest(
  order: RegenOrderRecord,
  needsReview: boolean,
): RxOpsRequest {
  const item = mapRegenOrderToAdminItem(order);
  const items = Array.isArray(order.items) ? (order.items as Array<{ name?: string }>) : [];
  const names = items.map((i) => i.name).filter(Boolean);
  const product = names.length ? names.join(", ") : "RE GEN order";
  const paid = item.paymentStatus === "paid";
  const stage = mapToOpsStage({
    kind: "regen",
    dispatchStatus: item.dispatchStatus,
    paymentStatus: item.paymentStatus,
    regenStatus: order.status,
    paid,
    intakeComplete: Boolean(order.intake_completed_at),
    telehealthComplete:
      order.telehealth_required === false ? true : Boolean(order.telehealth_completed_at),
    npApproved: Boolean(order.np_approved_at),
    shipped: Boolean(order.shipped_at) || order.status === "shipped" || order.status === "delivered",
  });

  return {
    id: requestKey("regen", order.reference),
    kind: "regen",
    patientName: item.patientName,
    initials: initialsFromName(item.patientName),
    meta: order.customer_phone || order.customer_email || order.reference,
    compound: item.track === "glp1" ? "GLP-1" : "Peptide",
    product,
    reason: order.goal?.replace(/-/g, " ") || "RE GEN online",
    stage: needsReview && stage !== "Shipped" ? "Clinical review" : stage,
    submittedAt: order.created_at,
    submittedLabel: relativeSubmittedLabel(order.created_at),
    track: item.track,
    phone: order.customer_phone,
    email: order.customer_email,
    paymentStatus: item.paymentStatus,
    paymentAmountUsd: item.paymentAmountUsd,
    intakeRef: order.reference,
    detailHref: `/admin/rx/regen-orders/${encodeURIComponent(order.reference)}`,
    actionHref: `/admin/rx/ops?review=${encodeURIComponent(order.reference)}`,
  };
}

export async function buildRxOpsConsolePayload(
  admin?: SupabaseClient | null,
): Promise<RxOpsConsolePayload> {
  const db = admin ?? getSupabaseAdminClient();
  const formulary = loadRxOpsFormulary();
  const requests: RxOpsRequest[] = [];

  if (db) {
    const { rows: clinicRows } = await listClinicEncountersWithClient({ limit: 80 });
    requests.push(...clinicRows.map(mapClinicToRequest));

    const { data: regenRowsRaw } = await db
      .from("regen_orders")
      .select(
        "reference, created_at, status, customer_name, customer_email, customer_phone, goal, items, subtotal_usd, shipping_usd, paid_at, payment_id, intake_completed_at, telehealth_required, telehealth_completed_at, np_approved_at, shipped_at, tracking_number",
      )
      .not("status", "eq", "cancelled")
      .order("created_at", { ascending: false })
      .limit(80);

    for (const order of (regenRowsRaw ?? []) as RegenOrderRecord[]) {
      const needsReview = regenOrderNeedsReview(order as Parameters<typeof regenOrderNeedsReview>[0]);
      requests.push(mapRegenToRequest(order, needsReview));
    }

    const { data: templates } = await db
      .from("hg_form_templates")
      .select("id, slug, title")
      .in("slug", [...RX_INTAKE_SLUGS]);
    const templateById = new Map((templates as TemplateRow[] | null)?.map((t) => [t.id, t]) ?? []);
    const templateIds = Array.from(templateById.keys());

    if (templateIds.length) {
      const { data: submissions } = await db
        .from("hg_form_submissions")
        .select(
          "id, submitted_at, signer_name, client_phone, client_id, access_token, responses_json, template_id",
        )
        .in("template_id", templateIds)
        .order("submitted_at", { ascending: false })
        .limit(80);

      const rows = (submissions ?? []) as SubmissionRow[];
      const submissionIds = rows.map((r) => r.id);

      let dispatchBySubmission = new Map<string, RxDispatchRecord>();
      if (submissionIds.length) {
        const { data: dispatchRows } = await db
          .from("hg_rx_dispatch")
          .select("*")
          .in("submission_id", submissionIds);
        if (dispatchRows) {
          dispatchBySubmission = new Map(
            (dispatchRows as RxDispatchRecord[]).map((d) => [d.submission_id, d]),
          );
        }
      }

      let ledgerBySubmission = new Map<string, { status: string | null; amount: number | null }>();
      if (submissionIds.length) {
        const { data: ledgerRows } = await db
          .from("hg_rx_payment_ledger")
          .select("submission_id, payment_status, amount_usd")
          .in("submission_id", submissionIds)
          .order("created_at", { ascending: false });
        for (const row of ledgerRows ?? []) {
          if (!ledgerBySubmission.has(String(row.submission_id))) {
            ledgerBySubmission.set(String(row.submission_id), {
              status: row.payment_status as string | null,
              amount: row.amount_usd != null ? Number(row.amount_usd) : null,
            });
          }
        }
      }

      for (const row of rows) {
        const template = templateById.get(row.template_id);
        if (!template || !RX_SLUG_SET.has(template.slug)) continue;
        const ledger = ledgerBySubmission.get(row.id);
        requests.push(
          mapIntakeToRequest(
            row,
            template,
            dispatchBySubmission.get(row.id),
            ledger?.status ?? null,
            ledger?.amount ?? null,
          ),
        );
      }
    }
  }

  requests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const refills: RxOpsRefillRow[] = [];
  const payments: RxOpsPaymentRow[] = [];
  const threads: RxOpsConsolePayload["threads"] = [];
  const shipments: RxOpsConsolePayload["shipments"] = [];

  if (db) {
    const { items: cadenceItems } = await listAllRefillCadence(db, { limit: 40 });
    for (const c of cadenceItems) {
      refills.push({
        patientName: c.clientName || "Client",
        plan: `${c.medication}${c.doseLabel ? ` · ${c.doseLabel}` : ""}`,
        pharmacy: "—",
        cadence: c.supplyCycle,
        nextRefill: new Date(c.dueAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        nextSoon: c.urgency === "due_soon" || c.urgency === "overdue",
        price: null,
        status: c.urgency === "overdue" ? "Due" : "Active",
        reorderHref: c.reorderHref,
      });
    }

    const { data: threadRows } = await db
      .from("hg_rx_message_threads")
      .select("id, intake_ref, patient_name, last_preview, last_message_at, unread_staff_count")
      .order("last_message_at", { ascending: false })
      .limit(30);

    for (const t of threadRows ?? []) {
      const name = String(t.patient_name || "Patient");
      threads.push({
        id: String(t.id),
        patientName: name,
        initials: initialsFromName(name),
        preview: String(t.last_preview || "—"),
        time: t.last_message_at
          ? relativeSubmittedLabel(String(t.last_message_at))
          : "—",
        unread: Number(t.unread_staff_count) > 0,
        intakeRef: String(t.intake_ref || ""),
      });
    }

    const shipmentRows = await listPharmacyShipments({ status: "active", limit: 40 }, db);
    for (const s of shipmentRows) {
      shipments.push({
        id: s.id,
        patientName: s.patient_name,
        pharmacy: s.pharmacy,
        product: s.product_label || s.compound || "RX order",
        status: s.status,
        statusLabel: PHARMACY_SHIPMENT_STATUS_LABELS[s.status],
        requestKind: s.request_kind,
        requestId: s.request_id,
        trackingNumber: s.tracking_number,
        carrier: s.carrier,
        updatedLabel: relativeSubmittedLabel(s.updated_at),
      });
    }
  }

  try {
    const { rows: ledgerRows } = await listRxPaymentLedger({
      status: "all",
      limit: 25,
      offset: 0,
    });
    for (const row of ledgerRows) {
      payments.push({
        date: new Date(row.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        patientName: row.client_name || "Patient",
        forLabel: row.line_label || row.template_name || row.intake_ref || "RX payment",
        method: row.source?.replace(/_/g, " ") || "Square",
        amountUsd: Number(row.amount_usd) || 0,
        status: row.payment_status,
      });
    }
  } catch {
    // ledger optional at build time
  }

  const patientSet = new Set<string>();
  for (const r of requests) {
    const key = `${r.patientName}|${r.email || r.phone || ""}`.toLowerCase();
    patientSet.add(key);
  }

  const overview = {
    requestsToReview: requests.filter((r) => r.stage === "Clinical review").length,
    revenue30dUsd: payments.length
      ? payments.reduce((sum, p) => sum + (p.status === "paid" ? p.amountUsd : 0), 0)
      : null,
    activeRefillPlans: refills.filter((r) => r.status === "Active").length,
    totalPatients: patientSet.size,
    awaitingShipment: shipments.length || requests.filter((r) => r.stage === "Approved").length,
    formularySkuCount: formulary.length,
  };

  const squareConnected = Boolean(process.env.SQUARE_ACCESS_TOKEN);

  return {
    generatedAt: new Date().toISOString(),
    requests,
    formulary,
    refills,
    payments,
    threads,
    shipments,
    overview,
    squareConnected,
  };
}

export function parseRxOpsRequestId(compositeId: string): { kind: RxOpsRequestKind; id: string } | null {
  const idx = compositeId.indexOf(":");
  if (idx < 1) return null;
  const kind = compositeId.slice(0, idx) as RxOpsRequestKind;
  if (kind !== "intake" && kind !== "clinic" && kind !== "regen") return null;
  return { kind, id: compositeId.slice(idx + 1) };
}
