import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  fulfillmentFromIntakeResponses,
  computeGlp1VialFulfillment,
  isInjectableGlp1Medication,
  pharmacyOrderSheetTotals,
  rollupPharmacyVialOrders,
  type PharmacyOrderLine,
} from "@/lib/glp1-vial-fulfillment";
import { listClinicDispatchQueue } from "@/lib/rx-clinic-refill";
import {
  RX_INTAKE_SLUGS,
  intakeDisplayName,
  intakeTrackFromSlug,
} from "@/lib/rx-dispatch";

const RX_SLUG_SET = new Set<string>(RX_INTAKE_SLUGS);
const GLP1_REFILL_SLUG = "glp1-refill-request";

type TemplateRow = { id: string; slug: string; title: string };

type SubmissionRow = {
  id: string;
  submitted_at: string;
  signer_name: string | null;
  access_token: string | null;
  responses_json: Record<string, unknown> | null;
  template_id: string;
};

type DispatchRow = {
  submission_id: string;
  status: string;
};

function intakeRef(token: string | null): string {
  if (!token) return "";
  return token.slice(0, 8).toUpperCase();
}

function isPaidPaymentStatus(status: string | null | undefined): boolean {
  return status === "paid" || status === "completed";
}

export async function listPharmacyOrderLines(
  opts?: {
    includeShipped?: boolean;
    client?: SupabaseClient | null;
  },
): Promise<{
  lines: PharmacyOrderLine[];
  rollup: ReturnType<typeof rollupPharmacyVialOrders>;
  totals: ReturnType<typeof pharmacyOrderSheetTotals>;
  tableReady: boolean;
}> {
  const admin = opts?.client ?? getSupabaseAdminClient();
  if (!admin) {
    return {
      lines: [],
      rollup: [],
      totals: { orderCount: 0, totalVials: 0, totalWholesaleUsd: 0 },
      tableReady: false,
    };
  }

  const lines: PharmacyOrderLine[] = [];

  const { items: clinicItems, tableReady: clinicReady } = await listClinicDispatchQueue(
    undefined,
    admin,
  );

  for (const item of clinicItems) {
    if (!opts?.includeShipped && item.dispatchStatus === "shipped") continue;
    if (!isInjectableGlp1Medication(item.medication)) continue;

    const pharmacy = (item.pharmacy === "formulation" ? "formulation" : "boomrx") as const;
    const fulfillment = computeGlp1VialFulfillment(
      item.medication,
      item.doseTierId,
      item.supplyCycle,
      pharmacy,
    );

    lines.push({
      id: item.encounterId,
      source: "clinic",
      orderedAt: item.paidAt || item.submittedAt,
      patientName: item.patientName,
      intakeRef: item.intakeRef,
      medication: item.medication,
      doseTierId: item.doseTierId,
      doseLabel: item.doseLabel,
      supplyCycle: item.supplyCycle,
      pharmacy,
      dispatchStatus: item.dispatchStatus,
      paymentStatus: "paid",
      paymentAmountUsd: item.paymentAmountUsd,
      fulfillment,
      fulfillmentError: fulfillment ? undefined : "Missing or invalid dose tier",
    });
  }

  const { data: templates } = await admin
    .from("hg_form_templates")
    .select("id, slug, title")
    .in("slug", [...RX_INTAKE_SLUGS]);

  const templateById = new Map((templates as TemplateRow[] | null)?.map((t) => [t.id, t]) ?? []);
  const glp1TemplateIds = Array.from(templateById.entries())
    .filter(([, t]) => t.slug === GLP1_REFILL_SLUG)
    .map(([id]) => id);

  if (glp1TemplateIds.length > 0) {
    const { data: submissions } = await admin
      .from("hg_form_submissions")
      .select("id, submitted_at, signer_name, access_token, responses_json, template_id")
      .in("template_id", glp1TemplateIds)
      .order("submitted_at", { ascending: false })
      .limit(100);

    const submissionIds = ((submissions ?? []) as SubmissionRow[]).map((s) => s.id);
    let dispatchBySubmission = new Map<string, DispatchRow>();
    let ledgerPaid = new Map<string, { status: string; amountUsd: number }>();

    if (submissionIds.length > 0) {
      const [{ data: dispatchRows }, { data: ledgerRows }] = await Promise.all([
        admin.from("hg_rx_dispatch").select("submission_id, status").in("submission_id", submissionIds),
        admin
          .from("hg_rx_payment_ledger")
          .select("submission_id, payment_status, amount_usd")
          .in("submission_id", submissionIds),
      ]);

      dispatchBySubmission = new Map(
        ((dispatchRows ?? []) as DispatchRow[]).map((d) => [d.submission_id, d]),
      );

      for (const row of ledgerRows ?? []) {
        const sid = String(row.submission_id || "");
        if (sid && !ledgerPaid.has(sid)) {
          ledgerPaid.set(sid, {
            status: String(row.payment_status || ""),
            amountUsd: Number(row.amount_usd || 0),
          });
        }
      }
    }

    for (const row of (submissions ?? []) as SubmissionRow[]) {
      const template = templateById.get(row.template_id);
      const slug = template?.slug ?? "";
      if (slug !== GLP1_REFILL_SLUG || intakeTrackFromSlug(slug) !== "glp1") continue;

      const responses = row.responses_json ?? {};
      const med = String(responses.current_medication || "").trim();
      if (!isInjectableGlp1Medication(med)) continue;

      const payment = ledgerPaid.get(row.id);
      if (!isPaidPaymentStatus(payment?.status)) continue;

      const dispatch = dispatchBySubmission.get(row.id);
      const dispatchStatus = dispatch?.status ?? "new";
      if (!opts?.includeShipped && dispatchStatus === "shipped") continue;

      const fulfillment = fulfillmentFromIntakeResponses(responses, "boomrx");
      const tierId = String(responses.refill_dose_tier || responses.dose_tier || "").trim() || null;

      lines.push({
        id: row.id,
        source: "online",
        orderedAt: row.submitted_at,
        patientName: intakeDisplayName(slug, row.signer_name, responses),
        intakeRef: intakeRef(row.access_token),
        medication: med,
        doseTierId: tierId,
        doseLabel: fulfillment?.doseLabel ?? null,
        supplyCycle: fulfillment?.supplyCycle ?? "90-day",
        pharmacy: "boomrx",
        dispatchStatus,
        paymentStatus: payment?.status ?? null,
        paymentAmountUsd: payment?.amountUsd ?? null,
        fulfillment,
        fulfillmentError: fulfillment ? undefined : "Missing or invalid dose tier on refill",
      });
    }
  }

  lines.sort(
    (a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime(),
  );

  const rollup = rollupPharmacyVialOrders(lines);
  const totals = pharmacyOrderSheetTotals(lines);

  return { lines, rollup, totals, tableReady: clinicReady };
}
