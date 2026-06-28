/**
 * Phase 4A — Square auto-pay renewal → auto-queue pharmacy dispatch.
 * When a subscription charge hits, clone the patient's last protocol,
 * mark paid, and open dispatch as approved (ready for BoomRx).
 */

import { randomBytes } from "crypto";

import type { SupabaseClient } from "@supabase/supabase-js";

import { glp1TelehealthWaivedForOrder } from "@/lib/glp1-telehealth-policy";
import { notifyStaffRxAutopayRenewal } from "@/lib/glp1-refill-staff-sms";
import {
  defaultDispatchFromIntake,
  intakeTrackFromSlug,
  type RxDispatchStatus,
} from "@/lib/rx-dispatch";
import { ensureRxDispatchForSubmission } from "@/lib/rx-dispatch-auto";
import type { SquarePaymentLike } from "@/lib/hg-rewards/credit-from-square-payment";
import { findHgClientForSquareCustomer } from "@/lib/hg-rewards/credit-from-square-payment";
import {
  getClinicEncounter,
  insertClinicEncounter,
  listClinicEncountersWithClient,
  updateClinicEncounter,
  type RxClinicEncounterRow,
} from "@/lib/rx-clinic-encounter";
import { prepareRefillFromEncounter, pickLastRefillableEncounter } from "@/lib/rx-clinic-refill";
import {
  insertRxPaymentLedger,
  type RxLedgerSource,
  type RxPaymentLedgerRow,
} from "@/lib/rx-payment-ledger";
import { loadSubmissionById } from "@/lib/rx-submission-context";
import { intakeRefFromToken } from "@/lib/rx-submission-context";

export type SquareRxPayment = SquarePaymentLike & {
  order_id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

const AUTOPAY_SOURCES: RxLedgerSource[] = ["glp1_autopay", "clinic_autopay"];

function paymentAmountUsd(payment: SquareRxPayment): number {
  const cents = Number(payment.total_money?.amount ?? payment.amount_money?.amount ?? 0);
  return Math.round(cents) / 100;
}

function paidAtFromPayment(payment: SquareRxPayment): string {
  return payment.updated_at || payment.created_at || new Date().toISOString();
}

async function ledgerExistsForSquarePayment(
  admin: SupabaseClient,
  squarePaymentId: string,
): Promise<boolean> {
  const { data } = await admin
    .from("hg_rx_payment_ledger")
    .select("id")
    .eq("square_payment_id", squarePaymentId)
    .limit(1);
  return (data?.length ?? 0) > 0;
}

async function loadEnrollmentLedger(
  admin: SupabaseClient,
  clientId: string,
): Promise<RxPaymentLedgerRow | null> {
  const { data } = await admin
    .from("hg_rx_payment_ledger")
    .select("*")
    .eq("client_id", clientId)
    .in("source", AUTOPAY_SOURCES)
    .eq("payment_status", "paid")
    .eq("metadata->>autopay_enrollment", "active")
    .order("paid_at", { ascending: false })
    .limit(1);

  const row = data?.[0];
  return row ? (row as unknown as RxPaymentLedgerRow) : null;
}

/** Mark enrollment active when the first auto-pay checkout payment clears. */
export async function activateRxAutopayEnrollment(
  admin: SupabaseClient,
  ledgerId: string,
  payment: SquareRxPayment,
): Promise<void> {
  const { data: row } = await admin
    .from("hg_rx_payment_ledger")
    .select("*")
    .eq("id", ledgerId)
    .maybeSingle();

  if (!row) return;
  if (!AUTOPAY_SOURCES.includes(row.source as RxLedgerSource)) return;

  const meta = (row.metadata as Record<string, unknown>) ?? {};
  if (meta.autopay_enrollment === "active") return;

  const squareCustomerId = payment.customer_id?.trim() || null;
  const nextMeta = {
    ...meta,
    autopay_enrollment: "active",
    autopay_enrolled_at: new Date().toISOString(),
    ...(squareCustomerId ? { square_customer_id: squareCustomerId } : {}),
  };

  await admin
    .from("hg_rx_payment_ledger")
    .update({ metadata: nextMeta, updated_at: new Date().toISOString() })
    .eq("id", ledgerId);

  if (squareCustomerId && row.client_id) {
    await admin
      .from("clients")
      .update({ square_customer_id: squareCustomerId, updated_at: new Date().toISOString() })
      .eq("id", row.client_id)
      .is("square_customer_id", null);
  }

  if (row.source === "clinic_autopay") {
    const encounterId = String(meta.clinicEncounterId || "");
    if (encounterId) {
      await updateClinicEncounter(
        encounterId,
        {
          autopayStatus: "active",
          autopayLedgerId: ledgerId,
          autopayEnrolledAt: new Date().toISOString(),
        },
        admin,
      );
    }
  }
}

async function cloneIntakeSubmissionForRenewal(
  admin: SupabaseClient,
  sourceSubmissionId: string,
  priorIntakeRef: string | null,
): Promise<{ submissionId: string; intakeRef: string; slug: string; responses: Record<string, unknown> } | null> {
  const ctx = await loadSubmissionById(admin, sourceSubmissionId);
  if (!ctx?.slug) return null;

  const { data: tmpl } = await admin
    .from("hg_form_templates")
    .select("id")
    .eq("slug", ctx.slug)
    .maybeSingle();
  if (!tmpl?.id) return null;

  const token = randomBytes(24).toString("hex");
  const responses: Record<string, unknown> = {
    ...ctx.responses,
    autopay_renewal: true,
    prior_intake_ref: priorIntakeRef || ctx.intakeRef,
    monthly_autopay_commitment: true,
    qualified: ctx.responses.qualified !== false,
  };

  const { data: row, error } = await admin
    .from("hg_form_submissions")
    .insert({
      template_id: tmpl.id,
      client_id: ctx.clientId,
      access_token: token,
      responses_json: responses,
      signer_name: ctx.clientName,
      client_phone: ctx.clientPhone,
    })
    .select("id")
    .single();

  if (error || !row) return null;

  return {
    submissionId: row.id as string,
    intakeRef: intakeRefFromToken(token),
    slug: ctx.slug,
    responses,
  };
}

async function queueIntakeRenewalDispatch(
  admin: SupabaseClient,
  opts: {
    submissionId: string;
    slug: string;
    signerName: string | null;
    responses: Record<string, unknown>;
    priorIntakeRef: string | null;
    paidAt: string;
  },
): Promise<void> {
  await ensureRxDispatchForSubmission(admin, opts.submissionId);

  const defaults = defaultDispatchFromIntake({
    slug: opts.slug,
    signerName: opts.signerName,
    responses: opts.responses,
  });

  const telehealthWaived = glp1TelehealthWaivedForOrder({
    supplyCycleRaw: opts.responses.supply_cycle,
    monthlyAutopayCommitment: true,
  });

  const status: RxDispatchStatus = telehealthWaived ? "approved" : "reviewed";
  const staffNotes = [
    `Auto-pay renewal ${new Date(opts.paidAt).toLocaleDateString()}.`,
    opts.priorIntakeRef ? `Prior ref ${opts.priorIntakeRef}.` : null,
    telehealthWaived
      ? "Telehealth waived (monthly auto-pay)."
      : "Review telehealth before ship.",
    "Ship same dose unless clinical note says otherwise.",
  ]
    .filter(Boolean)
    .join(" ");

  await admin.from("hg_rx_dispatch").upsert(
    {
      submission_id: opts.submissionId,
      ...defaults,
      status,
      staff_notes: staffNotes,
      updated_at: new Date().toISOString(),
      updated_by: "system:autopay-renewal",
    },
    { onConflict: "submission_id" },
  );
}

async function processIntakeAutopayRenewal(
  admin: SupabaseClient,
  enrollment: RxPaymentLedgerRow,
  payment: SquareRxPayment,
): Promise<{ ok: boolean; intakeRef?: string; error?: string }> {
  const sourceSubmissionId = enrollment.submission_id;
  if (!sourceSubmissionId) {
    return { ok: false, error: "Enrollment missing submission_id" };
  }

  const cloned = await cloneIntakeSubmissionForRenewal(
    admin,
    sourceSubmissionId,
    enrollment.intake_ref,
  );
  if (!cloned) return { ok: false, error: "Could not clone intake submission" };

  const amountUsd = paymentAmountUsd(payment) || enrollment.amount_usd;
  const paidAt = paidAtFromPayment(payment);

  await insertRxPaymentLedger(
    {
      submissionId: cloned.submissionId,
      intakeRef: cloned.intakeRef,
      clientId: enrollment.client_id,
      clientName: enrollment.client_name,
      clientEmail: enrollment.client_email,
      clientPhone: enrollment.client_phone,
      source: "glp1_autopay",
      templateId: enrollment.template_id,
      templateName: enrollment.template_name,
      track: enrollment.track,
      lineLabel: enrollment.line_label || `${enrollment.template_name || "GLP-1"} renewal`,
      amountUsd,
      paymentStatus: "paid",
      squareOrderId: payment.order_id ?? null,
      squarePaymentId: payment.id,
      paidAt,
      deliveryMethod: "patient_portal",
      metadata: {
        autopay_renewal: true,
        parent_ledger_id: enrollment.id,
        parent_intake_ref: enrollment.intake_ref,
        supply_cycle: enrollment.metadata?.supply_cycle,
      },
    },
    admin,
  );

  await queueIntakeRenewalDispatch(admin, {
    submissionId: cloned.submissionId,
    slug: cloned.slug,
    signerName: enrollment.client_name,
    responses: cloned.responses,
    priorIntakeRef: enrollment.intake_ref,
    paidAt,
  });

  void notifyStaffRxAutopayRenewal({
    kind: "intake",
    intakeRef: cloned.intakeRef,
    patientName: enrollment.client_name,
    patientPhone: enrollment.client_phone,
    amountUsd,
    lineLabel: enrollment.line_label,
  });

  return { ok: true, intakeRef: cloned.intakeRef };
}

async function processClinicAutopayRenewal(
  admin: SupabaseClient,
  enrollment: RxPaymentLedgerRow,
  payment: SquareRxPayment,
): Promise<{ ok: boolean; error?: string }> {
  const meta = enrollment.metadata ?? {};
  let sourceEncounter: RxClinicEncounterRow | null = null;

  const encounterId = String(meta.clinicEncounterId || "");
  if (encounterId) {
    sourceEncounter = await getClinicEncounter(encounterId, admin);
  }

  if (!sourceEncounter && enrollment.client_id) {
    const { rows } = await listClinicEncountersWithClient(
      { clientId: enrollment.client_id, limit: 30 },
      admin,
    );
    sourceEncounter = pickLastRefillableEncounter(rows);
  }

  if (!sourceEncounter) {
    return { ok: false, error: "No clinic encounter to renew from" };
  }

  const prep = prepareRefillFromEncounter(sourceEncounter, "system:autopay");
  if ("error" in prep) return { ok: false, error: prep.error };

  const inserted = await insertClinicEncounter(
    {
      ...prep.prefill,
      createdBy: "system:autopay",
      staffNotes: `Auto-pay monthly renewal. Source encounter ${sourceEncounter.id.slice(0, 8)}.`,
    },
    admin,
  );
  if ("error" in inserted) return { ok: false, error: inserted.error };

  const amountUsd = paymentAmountUsd(payment) || enrollment.amount_usd;
  const paidAt = paidAtFromPayment(payment);

  const ledger = await insertRxPaymentLedger(
    {
      clientId: enrollment.client_id,
      clientName: enrollment.client_name,
      clientEmail: enrollment.client_email,
      clientPhone: enrollment.client_phone,
      source: "clinic_autopay",
      templateId: enrollment.template_id,
      templateName: enrollment.template_name,
      track: "weight-loss",
      lineLabel: prep.snapshot.quote?.lineLabel || enrollment.line_label,
      amountUsd,
      paymentStatus: "paid",
      squareOrderId: payment.order_id ?? null,
      squarePaymentId: payment.id,
      paidAt,
      metadata: {
        autopay_renewal: true,
        parent_ledger_id: enrollment.id,
        clinicEncounterId: inserted.row.id,
        sourceEncounterId: sourceEncounter.id,
      },
    },
    admin,
  );

  await updateClinicEncounter(
    inserted.row.id,
    {
      ledgerId: ledger?.id ?? null,
      status: "paid",
      dispatchStatus: "approved",
      paymentMethod: "other",
      squareOrderId: payment.order_id ?? null,
      squarePaymentId: payment.id,
      paidAt,
      staffNotes: inserted.row.staff_notes,
    },
    admin,
  );

  void notifyStaffRxAutopayRenewal({
    kind: "clinic",
    intakeRef: `CL-${inserted.row.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    patientName: enrollment.client_name,
    patientPhone: enrollment.client_phone,
    amountUsd,
    lineLabel: prep.snapshot.quote?.lineLabel ?? undefined,
  });

  return { ok: true };
}

export type RxAutopayRenewalResult = {
  processed: boolean;
  reason?: string;
  intakeRef?: string;
};

/**
 * Handle recurring Square subscription charges after standard ledger reconcile.
 * Skips first enrollment payment (handled by reconcile + activateRxAutopayEnrollment).
 */
export async function processRxAutopayRenewalFromSquarePayment(
  admin: SupabaseClient,
  payment: SquareRxPayment,
  opts?: { reconciledLedgerIds?: string[] },
): Promise<RxAutopayRenewalResult> {
  if (String(payment.status || "").toUpperCase() !== "COMPLETED") {
    return { processed: false, reason: "payment not completed" };
  }
  if (!payment.id) return { processed: false, reason: "missing payment id" };

  if (await ledgerExistsForSquarePayment(admin, payment.id)) {
    return { processed: false, reason: "already recorded" };
  }

  const reconciledIds = opts?.reconciledLedgerIds ?? [];
  if (reconciledIds.length) {
    for (const ledgerId of reconciledIds) {
      await activateRxAutopayEnrollment(admin, ledgerId, payment);
    }
    return { processed: false, reason: "enrollment payment reconciled" };
  }

  const squareCustomerId = payment.customer_id?.trim();
  if (!squareCustomerId) {
    return { processed: false, reason: "no square customer on payment" };
  }

  const hgClient = await findHgClientForSquareCustomer(admin, { squareCustomerId });
  if (!hgClient) {
    return { processed: false, reason: "no HG client for square customer" };
  }

  const enrollment = await loadEnrollmentLedger(admin, hgClient.id);
  if (!enrollment) {
    return { processed: false, reason: "no active autopay enrollment" };
  }

  const paidUsd = paymentAmountUsd(payment);
  if (paidUsd > 0 && Math.abs(paidUsd - enrollment.amount_usd) > 2) {
    return {
      processed: false,
      reason: `amount mismatch (${paidUsd} vs ${enrollment.amount_usd})`,
    };
  }

  if (enrollment.source === "clinic_autopay") {
    const result = await processClinicAutopayRenewal(admin, enrollment, payment);
    return result.ok
      ? { processed: true }
      : { processed: false, reason: result.error };
  }

  if (enrollment.source === "glp1_autopay") {
    const result = await processIntakeAutopayRenewal(admin, enrollment, payment);
    return result.ok
      ? { processed: true, intakeRef: result.intakeRef }
      : { processed: false, reason: result.error };
  }

  return { processed: false, reason: "unsupported enrollment source" };
}
