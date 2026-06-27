/**
 * Staff SMS when a patient starts GLP-1 refill checkout or payment completes.
 */

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { notifyOwnerFormSubmission } from "@/lib/notifications/form-alert";
import type { RxPaymentLedgerRow } from "@/lib/rx-payment-ledger";

type RefillContext = {
  patientName: string | null;
  patientPhone: string | null;
  medication: string | null;
};

async function lookupRefillByIntakeRef(reference: string): Promise<RefillContext | null> {
  const admin = getSupabaseAdminClient();
  if (!admin || !reference) return null;

  const prefix = reference.trim().toLowerCase();
  const { data } = await admin
    .from("hg_form_submissions")
    .select("signer_name, client_phone, responses_json")
    .ilike("access_token", `${prefix}%`)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  const responses = (data.responses_json as Record<string, unknown> | null) ?? {};
  return {
    patientName: data.signer_name ?? null,
    patientPhone: data.client_phone ?? null,
    medication: String(responses.current_medication || responses.refill_dose_tier || "") || null,
  };
}

export type Glp1RefillStaffSmsEvent = "checkout" | "autopay" | "paid";

function eventHeadline(event: Glp1RefillStaffSmsEvent): string {
  if (event === "paid") return "HG RX REFILL — PAID";
  if (event === "autopay") return "HG RX REFILL — AUTO-PAY SETUP";
  return "HG RX REFILL — CHECKOUT";
}

function eventDetail(event: Glp1RefillStaffSmsEvent): string {
  if (event === "paid") return "Square payment received — review in RX Ledger.";
  if (event === "autopay") return "Patient enrolling in monthly auto-pay on Square.";
  return "Patient opening Square checkout now.";
}

/** Fire-and-forget SMS to owner/staff cell. */
export function notifyStaffGlp1RefillPaymentEvent(opts: {
  event: Glp1RefillStaffSmsEvent;
  intakeRef?: string | null;
  templateName?: string | null;
  lineLabel?: string | null;
  amountUsd?: number | null;
  patientName?: string | null;
  patientPhone?: string | null;
  medication?: string | null;
}): void {
  const amount =
    opts.amountUsd != null && Number.isFinite(opts.amountUsd)
      ? `$${opts.amountUsd.toFixed(2)}`
      : null;

  const lines = [
    eventHeadline(opts.event),
    opts.patientName || "—",
    opts.patientPhone || "—",
    opts.medication || opts.templateName || opts.lineLabel || "GLP-1 refill",
    amount || "—",
    opts.intakeRef ? `Ref ${opts.intakeRef}` : null,
    eventDetail(opts.event),
  ].filter(Boolean);

  notifyOwnerFormSubmission({
    formName: eventHeadline(opts.event),
    lines: lines.slice(1),
  });
}

/** Checkout / auto-pay routes — enrich from intake ref when possible. */
export async function notifyStaffGlp1RefillCheckoutStarted(opts: {
  event: "checkout" | "autopay";
  intakeRef?: string | null;
  templateName?: string | null;
  lineLabel?: string | null;
  amountUsd?: number | null;
}): Promise<void> {
  let ctx: RefillContext | null = null;
  if (opts.intakeRef) {
    ctx = await lookupRefillByIntakeRef(opts.intakeRef);
  }

  notifyStaffGlp1RefillPaymentEvent({
    event: opts.event,
    intakeRef: opts.intakeRef,
    templateName: opts.templateName,
    lineLabel: opts.lineLabel,
    amountUsd: opts.amountUsd,
    patientName: ctx?.patientName,
    patientPhone: ctx?.patientPhone,
    medication: ctx?.medication,
  });
}

const GLP1_REFILL_PAYMENT_SOURCES = new Set(["glp1_checkout", "glp1_autopay"]);

/** After Square webhook marks ledger paid — one SMS per row (metadata guard). */
export async function notifyStaffGlp1RefillPaidFromLedger(
  row: Pick<
    RxPaymentLedgerRow,
    | "id"
    | "source"
    | "intake_ref"
    | "client_name"
    | "client_phone"
    | "template_name"
    | "line_label"
    | "amount_usd"
    | "metadata"
  >,
): Promise<boolean> {
  if (!GLP1_REFILL_PAYMENT_SOURCES.has(row.source)) return false;
  if (row.metadata?.staff_paid_sms_at) return false;

  let patientName = row.client_name;
  let patientPhone = row.client_phone;
  let medication: string | null = null;

  if (row.intake_ref && (!patientName || !patientPhone)) {
    const ctx = await lookupRefillByIntakeRef(row.intake_ref);
    if (ctx) {
      patientName = patientName || ctx.patientName;
      patientPhone = patientPhone || ctx.patientPhone;
      medication = ctx.medication;
    }
  }

  notifyStaffGlp1RefillPaymentEvent({
    event: "paid",
    intakeRef: row.intake_ref,
    templateName: row.template_name,
    lineLabel: row.line_label,
    amountUsd: row.amount_usd,
    patientName,
    patientPhone,
    medication,
  });

  const admin = getSupabaseAdminClient();
  if (admin) {
    await admin
      .from("hg_rx_payment_ledger")
      .update({
        metadata: { ...row.metadata, staff_paid_sms_at: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
  }

  return true;
}
