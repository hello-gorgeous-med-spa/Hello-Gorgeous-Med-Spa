/**
 * After Ryan approves a /ops intake, create the pharmacy order row.
 * Production regen_orders is a mixed schema — insert the columns that
 * always exist, then patch fulfillment columns when present.
 */

import { getSupabase } from "@/lib/supabase-server";
import { quoteClinicInvoice } from "@/lib/regen/clinic-invoice";
import {
  enrichOrderItemsWithFormulationSku,
  resolveFormulationTicket,
} from "@/lib/regen/formulation-dispatch";
import { REGEN_DEFAULT_PHARMACY_SOURCE } from "@/lib/regen/pharmacy-placement";

function pharmacyErrorForTicket(ticket: ReturnType<typeof resolveFormulationTicket>): string {
  if (ticket.status === "ready") {
    const skus = ticket.lines.map((line) => line.sku).filter(Boolean).join(", ");
    return `FormuConnect ticket ready — SKU ${skus}. After the Bluefin invoice posts, Send to Formulation on the order.`;
  }
  if (ticket.status === "no_formulation_sku") {
    return ticket.notes[0] || "No Formulation SKU — Ryan picks BoomRx or an alternate.";
  }
  return ticket.notes[0] || "Ryan must pick the Formulation SKU before this is placed in FormuConnect.";
}

export type ApprovedIntakeInput = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  goal: string;
  patient_id?: string | null;
  amount_paid?: number | null;
  medical_history?: Record<string, unknown> | null;
  review_notes?: string | null;
};

function intakeTag(id: string) {
  return `INTAKE ${id}`;
}

export async function fulfillApprovedIntake(intake: ApprovedIntakeInput) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Database not configured");

  const existing = await findOrderForIntake(supabase, intake.id);
  if (existing) {
    return existing;
  }

  const history = (intake.medical_history || {}) as Record<string, unknown>;
  const ticket = resolveFormulationTicket({
    goal: intake.goal,
    customerName: intake.name,
    customerEmail: intake.email,
    customerPhone: intake.phone,
    medicalHistory: history,
  });

  const tirz =
    history.tirzepatide && typeof history.tirzepatide === "object"
      ? (history.tirzepatide as Record<string, unknown>)
      : null;
  const primary = ticket.lines[0];
  const items = enrichOrderItemsWithFormulationSku(
    [
      {
        name: primary?.productName || ticket.program || intake.goal || "REGEN RX Prescription",
        qty: Number(tirz?.vials || primary?.quantity || 1),
        goal: intake.goal,
        program: ticket.program,
        weeklyMg: tirz?.weeklyMg ?? null,
        termDays: tirz?.termDays ?? null,
        vials: tirz?.vials ?? null,
        formulationSku: primary?.sku ?? null,
      },
    ],
    ticket,
  );

  const orderNumber = `RX-${Date.now().toString(36).toUpperCase()}`;
  const quote = quoteClinicInvoice({
    goal: intake.goal,
    program: ticket.program,
    customerName: intake.name,
    customerEmail: intake.email,
    customerPhone: intake.phone,
    amountPaid: intake.amount_paid,
    medicalHistory: history,
  });
  const total = quote.ready ? quote.amountUsd : Number(intake.amount_paid || 0);
  const pharmacyError = pharmacyErrorForTicket(ticket);
  const now = new Date().toISOString();
  const program = String(intake.goal || ticket.program || "regen").slice(0, 80) || "regen";

  const core: Record<string, unknown> = {
    order_number: orderNumber,
    patient_id: intake.patient_id || null,
    status: "pending",
    program,
    medication: primary?.productName || ticket.program || program,
    notes: `${intakeTag(intake.id)} · ${intake.name} · ${intake.email} · ${pharmacyError}`.slice(0, 1800),
    pharmacy_error: pharmacyError,
    amount_cents: Math.round(total * 100),
    updated_at: now,
  };

  const { data: order, error: orderError } = await supabase
    .from("regen_orders")
    .insert(core)
    .select("*")
    .single();

  if (orderError || !order) {
    console.error("[fulfill] Failed to create order:", orderError);
    throw orderError || new Error("Could not create the pharmacy order");
  }

  const extras: Record<string, unknown> = {
    reference: orderNumber,
    intake_id: intake.id,
    customer_name: intake.name,
    customer_email: intake.email,
    customer_phone: intake.phone || null,
    goal: intake.goal,
    items,
    subtotal: total,
    shipping: quote.ready ? quote.shippingUsd : 0,
    discount: 0,
    total,
    subtotal_usd: quote.ready ? quote.productUsd : total,
    shipping_usd: quote.ready ? quote.shippingUsd : 0,
    pharmacy_name: ticket.pharmacy || REGEN_DEFAULT_PHARMACY_SOURCE,
    pharmacy_source: ticket.pharmacy || REGEN_DEFAULT_PHARMACY_SOURCE,
    np_approved_at: now,
    np_notes: intake.review_notes || null,
    intake_completed_at: now,
    intake_data: history,
  };
  const extra = await supabase.from("regen_orders").update(extras).eq("id", order.id);
  if (extra.error) {
    console.warn("[fulfill] extras patch skipped:", extra.error.message);
  }

  await supabase.from("regen_order_status_history").insert({
    order_id: order.id,
    status: "pending",
    actor_type: "system",
    notes: pharmacyError,
    metadata: {
      formulationSku: primary?.sku ?? null,
      formulationStatus: ticket.status,
      pharmacy: ticket.pharmacy,
      intakeId: intake.id,
    },
  });

  return {
    orderId: order.id as string,
    orderNumber,
    pharmacyOrderId: null as string | null,
    pharmacyError,
    formulationTicket: {
      status: ticket.status,
      sku: primary?.sku ?? null,
      pharmacy: ticket.pharmacy,
      pasteText: ticket.pasteText,
    },
    invoiceQuote: quote,
  };
}

async function findOrderForIntake(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  intakeId: string,
) {
  const byIntake = await supabase
    .from("regen_orders")
    .select("id, order_number, pharmacy_error, pharmacy_order_id")
    .eq("intake_id", intakeId)
    .maybeSingle();
  if (byIntake.error && /intake_id/.test(byIntake.error.message)) {
    // column not migrated yet
  } else if (byIntake.data) {
    return {
      orderId: byIntake.data.id as string,
      orderNumber: String(byIntake.data.order_number),
      pharmacyOrderId: (byIntake.data.pharmacy_order_id as string | null) || null,
      pharmacyError: (byIntake.data.pharmacy_error as string | null) || null,
      alreadyExisted: true,
    };
  }

  const byNotes = await supabase
    .from("regen_orders")
    .select("id, order_number, pharmacy_error, pharmacy_order_id")
    .ilike("notes", `%${intakeTag(intakeId)}%`)
    .maybeSingle();
  if (byNotes.data) {
    return {
      orderId: byNotes.data.id as string,
      orderNumber: String(byNotes.data.order_number),
      pharmacyOrderId: (byNotes.data.pharmacy_order_id as string | null) || null,
      pharmacyError: (byNotes.data.pharmacy_error as string | null) || null,
      alreadyExisted: true,
    };
  }
  return null;
}

export async function ensureOrdersForApprovedIntakes(): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;
  const { data: intakes, error } = await supabase
    .from("regen_intakes")
    .select("id, name, email, phone, goal, patient_id, amount_paid, medical_history, review_notes")
    .eq("status", "approved")
    .order("updated_at", { ascending: false })
    .limit(40);
  if (error || !intakes?.length) return 0;

  let created = 0;
  for (const row of intakes) {
    try {
      const result = await fulfillApprovedIntake(row as ApprovedIntakeInput);
      if (!("alreadyExisted" in result && result.alreadyExisted)) created += 1;
    } catch (err) {
      console.error("[fulfill] backfill failed for intake", row.id, err);
    }
  }
  return created;
}
