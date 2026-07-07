import type { SupabaseClient } from "@supabase/supabase-js";

import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import {
  defaultInvoiceTemplateForTrack,
  getRxInvoiceTemplate,
  resolveTemplateAmountUsd,
  templateRequiresShippingAddress,
} from "@/lib/rx-invoice-templates";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { REFILL_DUE_SOON_DAYS } from "@/lib/rx-clinic-refill";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { GLP1_REFILL_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import {
  attachDraftLedgerToPlan,
  listRefillPlans,
  syncRefillPlansFromCadence,
} from "@/lib/rx-refill-plans/plans";
import { getTelehealthRecheckStatus } from "@/lib/rx-telehealth/recheck";
import { daysUntilDue, refillUrgencyForDue } from "@/lib/rx-clinic-refill";

export type RefillDraftTriggerResult = {
  scanned: number;
  draftsCreated: number;
  skippedRecheck: number;
  skippedHasDraft: number;
  errors: string[];
};

function reorderPath(track: string): string {
  if (track === "peptide") return PEPTIDE_REQUEST_PATH;
  return GLP1_REFILL_PATH;
}

/**
 * HGRX-071 — create pending Square invoice drafts for upcoming active refill plans.
 * Skips when telehealth recheck is due (HGRX-061).
 */
export async function processRefillPlanDraftInvoices(
  admin?: SupabaseClient | null,
): Promise<RefillDraftTriggerResult> {
  const db = admin ?? getSupabaseAdminClient();
  const result: RefillDraftTriggerResult = {
    scanned: 0,
    draftsCreated: 0,
    skippedRecheck: 0,
    skippedHasDraft: 0,
    errors: [],
  };

  if (!db) {
    result.errors.push("database unavailable");
    return result;
  }

  if (process.env.RX_REFILL_DRAFT_CRON_ENABLED === "false") {
    result.errors.push("disabled");
    return result;
  }

  await syncRefillPlansFromCadence(db);
  const { rows: plans, tableReady } = await listRefillPlans({ status: "active", limit: 40 }, db);
  if (!tableReady) {
    result.errors.push("plans table not ready");
    return result;
  }

  const now = new Date();
  for (const plan of plans) {
    const due = new Date(plan.next_refill_at);
    const urgency = refillUrgencyForDue(due, now);
    if (urgency === "ok") continue;

    result.scanned += 1;
    if (plan.draft_ledger_id) {
      result.skippedHasDraft += 1;
      continue;
    }

    const recheck = await getTelehealthRecheckStatus(plan.client_id, db);
    if (recheck.due) {
      result.skippedRecheck += 1;
      continue;
    }

    const track = plan.track === "glp1" ? "glp1" : plan.track === "peptide" ? "peptide" : "unknown";
    const templateId = defaultInvoiceTemplateForTrack(track);
    const template = getRxInvoiceTemplate(templateId);
    if (!template) {
      result.errors.push(`${plan.id}: no template`);
      continue;
    }

    const amountUsd =
      plan.price_usd && plan.price_usd > 0
        ? plan.price_usd
        : resolveTemplateAmountUsd(template);
    if (amountUsd == null || amountUsd <= 0) {
      result.errors.push(`${plan.id}: invalid amount`);
      continue;
    }

    const clientLabel = plan.client_name || plan.client_email || plan.client_phone || "Client";
    const lineLabel = `${plan.medication}${plan.dose_label ? ` · ${plan.dose_label}` : ""} refill`;

    const link = await createRxPaymentLink({
      squareName: template.squareName,
      amountUsd,
      clientLabel,
      description: `${lineLabel} · Refill plan ${plan.id.slice(0, 8)}`,
      askForShippingAddress: templateRequiresShippingAddress(template),
    });

    if (!link.ok) {
      result.errors.push(`${plan.id}: ${link.error}`);
      continue;
    }

    const ledger = await insertRxPaymentLedger(
      {
        clientId: plan.client_id,
        clientName: clientLabel,
        clientEmail: plan.client_email,
        clientPhone: plan.client_phone,
        source: "staff_invoice",
        templateId: template.id,
        templateName: template.name,
        track: template.track,
        lineLabel,
        amountUsd,
        paymentUrl: link.url,
        squarePaymentLinkId: link.paymentLinkId,
        squareOrderId: link.orderId,
        deliveryMethod: "link",
        sentBy: "system:refill-draft",
        staffNote: `Auto draft · due in ${daysUntilDue(due, now)}d`,
        metadata: {
          refill_plan_id: plan.id,
          draft_refill: true,
          reorder_href: reorderPath(plan.track),
        },
      },
      db,
    );

    if (!ledger) {
      result.errors.push(`${plan.id}: ledger insert failed`);
      continue;
    }

    await attachDraftLedgerToPlan(plan.id, ledger.id, db);
    result.draftsCreated += 1;
  }

  return result;
}

export { REFILL_DUE_SOON_DAYS };
