import { getSupabase } from '@/lib/supabase-server';
import { isFormuConnectConfigured, submitFormuConnectOrder } from '@/lib/formuconnect';

const GOAL_PRODUCT: Record<string, { productId: string; productName: string; sig: string }> = {
  'weight-loss': { productId: 'glp1-sema', productName: 'Semaglutide', sig: 'Use as directed by your REGEN RX provider' },
  glp1: { productId: 'glp1-sema', productName: 'Semaglutide', sig: 'Use as directed by your REGEN RX provider' },
  hormones: { productId: 'hrt', productName: 'Hormone Therapy', sig: 'Use as directed by your REGEN RX provider' },
  hrt: { productId: 'hrt', productName: 'Hormone Therapy', sig: 'Use as directed by your REGEN RX provider' },
  peptides: { productId: 'peptide', productName: 'Peptide Therapy', sig: 'Use as directed by your REGEN RX provider' },
  'sexual-health': { productId: 'sexual-health', productName: 'Sexual Health Therapy', sig: 'Use as directed by your REGEN RX provider' },
  hair: { productId: 'hair', productName: 'Hair Restoration', sig: 'Use as directed by your REGEN RX provider' },
  skincare: { productId: 'skincare', productName: 'Prescription Skincare', sig: 'Use as directed by your REGEN RX provider' },
  vitamins: { productId: 'vitamins', productName: 'Vitamin Injectable', sig: 'Use as directed by your REGEN RX provider' },
};

function splitName(name: string) {
  const parts = String(name || '').trim().split(/\s+/);
  return { firstName: parts[0] || name || 'Patient', lastName: parts.slice(1).join(' ') || 'Unknown' };
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

  const product = GOAL_PRODUCT[intake.goal] || {
    productId: intake.goal || 'regen-rx',
    productName: intake.goal || 'REGEN RX Prescription',
    sig: 'Use as directed by your REGEN RX provider',
  };

  const history = (intake.medical_history || {}) as Record<string, unknown>;
  const shipping = (history.shipping || {}) as Record<string, string>;
  const { firstName, lastName } = splitName(intake.name);
  const orderNumber = `RX-${Date.now().toString(36).toUpperCase()}`;
  const total = Number(intake.amount_paid || 0);

  const { data: order, error: orderError } = await supabase
    .from('regen_orders')
    .insert({
      order_number: orderNumber,
      patient_id: intake.patient_id || null,
      intake_id: intake.id,
      pharmacy_name: 'Formulation Rx',
      items: [{ name: product.productName, qty: 1, goal: intake.goal }],
      subtotal: total,
      shipping: 0,
      discount: 0,
      total,
      status: 'pending',
    })
    .select()
    .single();

  if (orderError) {
    console.error('[fulfill] Failed to create order:', orderError);
    throw orderError;
  }

  let pharmacyOrderId: string | null = null;
  let pharmacyError: string | null = null;

  if (!isFormuConnectConfigured()) {
    pharmacyError = 'FORMUCONNECT_API_KEY missing in production';
  } else if (!shipping.street1 || !shipping.city || !shipping.zip) {
    pharmacyError = 'Patient shipping address missing — order saved locally; send in Formulation by hand';
  } else {
    try {
      const result = await submitFormuConnectOrder({
        patient: {
          firstName,
          lastName,
          dateOfBirth: String(history.dob || history.dateOfBirth || ''),
          email: intake.email,
          phone: intake.phone || undefined,
          address: {
            street1: shipping.street1,
            street2: shipping.street2,
            city: shipping.city,
            state: shipping.state || 'IL',
            zip: shipping.zip,
          },
        },
        prescriptions: [{
          productId: product.productId,
          productName: product.productName,
          quantity: 1,
          sig: product.sig,
          daysSupply: 30,
        }],
        notes: intake.review_notes || undefined,
        metadata: {
          regenOrderId: order.id,
          orderNumber,
          intakeId: intake.id,
        },
      });
      pharmacyOrderId = result.orderId || null;
      if (!result.success && !pharmacyOrderId) {
        pharmacyError = result.message || 'FormuConnect did not return an order id';
      }
    } catch (err) {
      pharmacyError = err instanceof Error ? err.message : 'FormuConnect submit failed';
      console.error('[fulfill] FormuConnect error:', err);
    }
  }

  if (pharmacyOrderId || pharmacyError) {
    await supabase
      .from('regen_orders')
      .update({
        pharmacy_order_id: pharmacyOrderId,
        status: pharmacyOrderId ? 'processing' : 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    await supabase.from('regen_order_status_history').insert({
      order_id: order.id,
      status: pharmacyOrderId ? 'processing' : 'pending',
      actor_type: 'system',
      notes: pharmacyError || 'Submitted to Formulation Rx',
      metadata: { pharmacyOrderId, pharmacyError },
    });
  }

  return {
    orderId: order.id,
    orderNumber,
    pharmacyOrderId,
    pharmacyError,
  };
}
