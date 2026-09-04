import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabase } from '@/lib/supabase-server';
import { getPanel } from '@/lib/fullscript/lab-panels';

// Lazy initialization to avoid build-time errors
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { panelId, panelName, price, patient, returnUrl } = body;

    // Validate panel exists
    const panel = getPanel(panelId);
    if (!panel) {
      return NextResponse.json({ error: 'Invalid lab panel' }, { status: 400 });
    }

    // Validate required fields
    if (!patient?.email || !patient?.firstName || !patient?.lastName || !patient?.dob) {
      return NextResponse.json({ error: 'Missing required patient information' }, { status: 400 });
    }

    const stripe = getStripe();

    // Determine base URL
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://tryregenrx.com'
      : 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: patient.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: panelName || panel.name,
              description: `Lab Panel - Results in ${panel.turnaroundDays} days`,
              metadata: {
                panel_id: panelId,
                type: 'lab_panel',
              },
            },
            unit_amount: Math.round((price || panel.price) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'lab_order',
        panel_id: panelId,
        patient_email: patient.email,
        patient_name: `${patient.firstName} ${patient.lastName}`,
        patient_dob: patient.dob,
        patient_gender: patient.gender,
        patient_phone: patient.phone,
        patient_address: JSON.stringify({
          street: patient.street,
          city: patient.city,
          state: patient.state,
          zip: patient.zip,
        }),
        return_url: returnUrl || '/start',
      },
      success_url: `${baseUrl}/labs/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/labs?panel=${panelId}`,
    });

    // Store pending lab order in database
    const supabase = getSupabase();
    await supabase.from('regen_lab_requirements').insert({
      patient_email: patient.email,
      patient_name: `${patient.firstName} ${patient.lastName}`,
      lab_type: panel.name,
      required_for: 'intake',
      status: 'pending_payment',
      stripe_session_id: session.id,
      panel_id: panelId,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Lab checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
