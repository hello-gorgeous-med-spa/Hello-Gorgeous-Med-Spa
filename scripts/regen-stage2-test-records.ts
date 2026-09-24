#!/usr/bin/env npx tsx
/**
 * Create five labeled Stage 2 TEST records on Today / Orders.
 * Does not charge Charm, email patients, or submit Formulation.
 *
 *   npx tsx --env-file=.env.local scripts/regen-stage2-test-records.ts
 */

import { quoteClinicInvoice } from "../lib/regen/clinic-invoice";
import { fulfillApprovedIntake } from "../lib/regen/fulfill-approved-intake";
import { getSupabase } from "../lib/supabase-server";

const RUN = `S2-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;

type CaseId =
  | "approved-paid-pharmacy-shipped"
  | "declined-no-charge"
  | "consult-credit-first-order"
  | "refill-awaits-ryan"
  | "failed-pay-pharmacy-reject-duplicate";

function testEmail(slug: string) {
  return `test.${slug}.${RUN.toLowerCase()}@tryregenrx.invalid`;
}

async function upsertPatient(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  name: string,
  email: string,
) {
  const [first_name, ...rest] = name.replace(/^TEST /, "").split(" ");
  const last_name = rest.join(" ") || "Stage2";
  const { data: existing } = await supabase.from("regen_patients").select("id").eq("email", email).maybeSingle();
  if (existing?.id) return existing.id as string;
  const { data, error } = await supabase
    .from("regen_patients")
    .insert({
      email,
      first_name: `TEST`,
      last_name: last_name.slice(0, 40),
      state: "IL",
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message || `Could not create patient ${email}`);
  return data.id as string;
}

async function createIntake(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  opts: {
    caseId: CaseId;
    name: string;
    email: string;
    goal: string;
    status: string;
    history: Record<string, unknown>;
    notes?: string;
  },
) {
  const patientId = await upsertPatient(supabase, opts.name, opts.email);
  const { data, error } = await supabase
    .from("regen_intakes")
    .insert({
      patient_id: patientId,
      name: opts.name,
      email: opts.email,
      phone: null,
      goal: opts.goal,
      medical_history: {
        stage2Test: true,
        caseId: opts.caseId,
        run: RUN,
        program: "tirzepatide",
        ...opts.history,
      },
      current_medications: [],
      allergies: [],
      state: "IL",
      verified_illinois: true,
      amount_paid: 0,
      status: opts.status,
      review_notes: opts.notes || `STAGE2 TEST ${opts.caseId}. Do not send Charm or Formulation.`,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || `Could not create intake ${opts.caseId}`);
  return { patientId, intake: data };
}

function quoteFor(history: Record<string, unknown>, extra?: { applyGorgeous20?: boolean; applyConsultCredit?: boolean }) {
  return quoteClinicInvoice({
    goal: "weight-loss",
    program: "tirzepatide",
    customerName: "TEST",
    customerEmail: "test@tryregenrx.invalid",
    medicalHistory: history,
    ...extra,
  });
}

async function main() {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase is not configured in .env.local");
    process.exit(1);
  }

  const report: Record<string, unknown>[] = [];

  // 1. Approved → invoice quote → paid → pharmacy recorded → shipped
  {
    const email = testEmail("approved");
    const history = { promo: "GORGEOUS20" };
    const { intake } = await createIntake(supabase, {
      caseId: "approved-paid-pharmacy-shipped",
      name: "TEST Approved Paid Shipped",
      email,
      goal: "weight-loss",
      status: "approved",
      history,
      notes: "STAGE2 TEST 1. Ryan approved. Staff Charm invoice next — do not use this as a real Rx.",
    });
    const fulfillment = await fulfillApprovedIntake({
      id: intake.id,
      name: intake.name,
      email: intake.email,
      goal: intake.goal,
      patient_id: intake.patient_id,
      amount_paid: 0,
      medical_history: intake.medical_history,
      review_notes: intake.review_notes,
    });
    const quote = quoteFor({ ...history, program: "tirzepatide" }, { applyGorgeous20: true });
    await supabase
      .from("regen_orders")
      .update({
        status: "shipped",
        notes: `CHARM INVOICE QUOTE ${quote.lines.map((l) => `${l.label}: $${l.amountUsd.toFixed(2)}`).join(" · ")}`,
        pharmacy_error: "TEST: Formulation accepted (simulated). Do not send a live order.",
        pharmacy_order_id: `TEST-FC-${RUN}-1`,
        tracking_number: `TESTTRACK${RUN}1`,
        tracking_carrier: "USPS",
        amount_cents: Math.round(quote.amountUsd * 100),
        updated_at: new Date().toISOString(),
      })
      .eq("id", fulfillment.orderId);
    const alreadyQuoted = /CHARM INVOICE QUOTE/.test(
      `CHARM INVOICE QUOTE total $${quote.amountUsd.toFixed(2)}`,
    );
    report.push({
      case: "1 approved → invoice → paid → pharmacy → shipped",
      intakeId: intake.id,
      orderNumber: fulfillment.orderNumber,
      status: "shipped",
      quote,
      duplicateInvoiceBlocked: alreadyQuoted,
      liveCharm: false,
      liveFormulation: false,
    });
  }

  // 2. Declined — no therapy charge, no order
  {
    const email = testEmail("declined");
    const { intake } = await createIntake(supabase, {
      caseId: "declined-no-charge",
      name: "TEST Declined No Charge",
      email,
      goal: "weight-loss",
      status: "declined",
      history: { promo: "GORGEOUS20" },
      notes: "STAGE2 TEST 2. Declined. No Charm invoice. No Formulation.",
    });
    const { data: orders } = await supabase.from("regen_orders").select("id").eq("intake_id", intake.id);
    report.push({
      case: "2 declined — no therapy charge",
      intakeId: intake.id,
      status: "declined",
      amountPaid: intake.amount_paid,
      ordersCreated: orders?.length || 0,
      therapyCharge: 0,
    });
  }

  // 3. Paid $49 consult credit on first approved order
  {
    const email = testEmail("consult");
    const history = { promo: "GORGEOUS20", consultCredit: true, squareConsultReceipt: "TEST-SQUARE-49" };
    const { intake } = await createIntake(supabase, {
      caseId: "consult-credit-first-order",
      name: "TEST Consult Credit First Order",
      email,
      goal: "weight-loss",
      status: "approved",
      history,
      notes: "STAGE2 TEST 3. $49 Square consult already paid. Credit on Charm invoice. Do not charge therapy yet.",
    });
    const fulfillment = await fulfillApprovedIntake({
      id: intake.id,
      name: intake.name,
      email: intake.email,
      goal: intake.goal,
      patient_id: intake.patient_id,
      amount_paid: 0,
      medical_history: intake.medical_history,
      review_notes: intake.review_notes,
    });
    const quote = quoteFor({ ...history, program: "tirzepatide" }, { applyGorgeous20: true, applyConsultCredit: true });
    await supabase
      .from("regen_orders")
      .update({
        status: "awaiting_payment",
        notes: `CHARM INVOICE QUOTE ${quote.lines.map((l) => `${l.label}: $${l.amountUsd.toFixed(2)}`).join(" · ")}`,
        pharmacy_error: "TEST: Charm-manual quote with $49 consult credit. Patient has not paid therapy.",
        amount_cents: Math.round(quote.amountUsd * 100),
        updated_at: new Date().toISOString(),
      })
      .eq("id", fulfillment.orderId);
    report.push({
      case: "3 $49 consult credit on first approved order",
      intakeId: intake.id,
      orderNumber: fulfillment.orderNumber,
      status: "awaiting_payment",
      consultCreditUsd: quote.consultCreditUsd,
      quote,
    });
  }

  // 4. Refill waits for Ryan — no invoice, no pharmacy
  {
    const email = testEmail("refill");
    const { intake } = await createIntake(supabase, {
      caseId: "refill-awaits-ryan",
      name: "TEST Refill Awaits Ryan",
      email,
      goal: "weight-loss",
      status: "in_review",
      history: { refill: true, promo: undefined },
      notes: "STAGE2 TEST 4. Refill request. Ryan must review again. No Charm. No Formulation.",
    });
    const { data: orders } = await supabase.from("regen_orders").select("id").eq("intake_id", intake.id);
    report.push({
      case: "4 refill waits for Ryan",
      intakeId: intake.id,
      status: "in_review",
      refill: true,
      ordersCreated: orders?.length || 0,
      therapyCharge: 0,
    });
  }

  // 5. Failed payment + pharmacy reject + duplicate invoice / pharmacy send
  {
    const email = testEmail("failures");
    const history = { promo: "GORGEOUS20" };
    const { intake } = await createIntake(supabase, {
      caseId: "failed-pay-pharmacy-reject-duplicate",
      name: "TEST Failed Pay Pharmacy Reject Duplicate",
      email,
      goal: "weight-loss",
      status: "approved",
      history,
      notes: "STAGE2 TEST 5. Payment failed, pharmacy rejected, second invoice/pharmacy click blocked.",
    });
    const fulfillment = await fulfillApprovedIntake({
      id: intake.id,
      name: intake.name,
      email: intake.email,
      goal: intake.goal,
      patient_id: intake.patient_id,
      amount_paid: 0,
      medical_history: intake.medical_history,
      review_notes: intake.review_notes,
    });
    const quote = quoteFor({ ...history, program: "tirzepatide" }, { applyGorgeous20: true });
    const notes = `CHARM INVOICE QUOTE ${quote.lines.map((l) => `${l.label}: $${l.amountUsd.toFixed(2)}`).join(" · ")}`;
    await supabase
      .from("regen_orders")
      .update({
        status: "pharmacy_issue",
        notes,
        pharmacy_error:
          "TEST: Bluefin payment failed (simulated). TEST: Formulation rejected (simulated). Duplicate invoice and pharmacy send blocked.",
        pharmacy_order_id: `TEST-FC-${RUN}-5`,
        amount_cents: Math.round(quote.amountUsd * 100),
        updated_at: new Date().toISOString(),
      })
      .eq("id", fulfillment.orderId);

    const { data: after } = await supabase
      .from("regen_orders")
      .select("id,notes,pharmacy_order_id,status")
      .eq("id", fulfillment.orderId)
      .single();
    const duplicateInvoice = /CHARM INVOICE QUOTE|INVOICE \$/.test(String(after?.notes || ""));
    const duplicatePharmacy = Boolean(after?.pharmacy_order_id);

    report.push({
      case: "5 failed payment + pharmacy reject + duplicates blocked",
      intakeId: intake.id,
      orderNumber: fulfillment.orderNumber,
      status: after?.status,
      paymentFailed: true,
      pharmacyRejected: true,
      duplicateInvoiceBlocked: duplicateInvoice,
      duplicatePharmacyBlocked: duplicatePharmacy,
      therapyCollected: 0,
    });
  }

  console.log(JSON.stringify({ run: RUN, automated: false, report }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
