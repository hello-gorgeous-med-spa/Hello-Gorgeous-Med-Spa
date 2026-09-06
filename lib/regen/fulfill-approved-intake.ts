import { getSupabase } from '@/lib/supabase-server';
import {
  enrichOrderItemsWithFormulationSku,
  resolveFormulationTicket,
} from '@/lib/regen/formulation-dispatch';
import { REGEN_DEFAULT_PHARMACY_SOURCE } from '@/lib/regen/pharmacy-placement';

function pharmacyErrorForTicket(ticket: ReturnType<typeof resolveFormulationTicket>): string {
  if (ticket.status === 'ready') {
    const skus = ticket.lines.map((line) => line.sku).filter(Boolean).join(', ');
    return `FormuConnect portal ticket ready — paste SKU ${skus}. Live API is off (RX_PHARMACY_API_ENABLED=false).`;
  }
  if (ticket.status === 'no_formulation_sku') {
    return ticket.notes[0] || 'No Formulation SKU — Ryan picks BoomRx or an alternate.';
  }
  return ticket.notes[0] || 'Ryan must pick the Formulation SKU before this is placed in FormuConnect.';
}

export async function fulfillApprovedIntake(intake: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  goal: string;
  patient_id?: string | null;
  amount_paid?: number | null;
  medical_history?: Record<string, unknown> | null;
  review_notes?: string | null;
}) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Database not configured');

  const history = (intake.medical_history || {}) as Record<string, unknown>;
  const ticket = resolveFormulationTicket({
    goal: intake.goal,
    customerName: intake.name,
    customerEmail: intake.email,
    customerPhone: intake.phone,
    medicalHistory: history,
  });

  const tirz = history.tirzepatide && typeof history.tirzepatide === 'object'
    ? (history.tirzepatide as Record<string, unknown>)
    : null;
  const primary = ticket.lines[0];
  const items = enrichOrderItemsWithFormulationSku(
    [{
      name: primary?.productName || ticket.program || intake.goal || 'REGEN RX Prescription',
      qty: Number(tirz?.vials || primary?.quantity || 1),
      goal: intake.goal,
      program: ticket.program,
      weeklyMg: tirz?.weeklyMg ?? null,
      termDays: tirz?.termDays ?? null,
      vials: tirz?.vials ?? null,
      formulationSku: primary?.sku ?? null,
    }],
    ticket,
  );

  const orderNumber = `RX-${Date.now().toString(36).toUpperCase()}`;
  const total = Number(intake.amount_paid || 0);
  const pharmacyError = pharmacyErrorForTicket(ticket);

  const { data: order, error: orderError } = await supabase
    .from('regen_orders')
    .insert({
      order_number: orderNumber,
      patient_id: intake.patient_id || null,
      intake_id: intake.id,
      pharmacy_name: ticket.pharmacy || REGEN_DEFAULT_PHARMACY_SOURCE,
      items,
      subtotal: total,
      shipping: 0,
      discount: 0,
      total,
      status: 'pending',
      pharmacy_error: pharmacyError,
    })
    .select()
    .single();

  if (orderError) {
    console.error('[fulfill] Failed to create order:', orderError);
    throw orderError;
  }

  await supabase.from('regen_order_status_history').insert({
    order_id: order.id,
    status: 'pending',
    actor_type: 'system',
    notes: pharmacyError,
    metadata: {
      formulationSku: primary?.sku ?? null,
      formulationStatus: ticket.status,
      pharmacy: ticket.pharmacy,
    },
  });

  return {
    orderId: order.id,
    orderNumber,
    pharmacyOrderId: null as string | null,
    pharmacyError,
    formulationTicket: {
      status: ticket.status,
      sku: primary?.sku ?? null,
      pharmacy: ticket.pharmacy,
      pasteText: ticket.pasteText,
    },
  };
}
