import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const resend = new Resend(process.env.RESEND_API_KEY);

const CONSULTATION_PRICE_USD = 99;

/**
 * POST /api/regen/consult
 * Book a consultation with Ryan Kent and process payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      goal, 
      questions, 
      selectedDay, 
      selectedTime 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !goal || !selectedDay || !selectedTime) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer: Stripe.Customer;
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name: `${firstName} ${lastName}`,
        phone,
        metadata: { 
          source: 'regen-rx-consultation',
          goal,
        },
      });
    }

    // Create checkout session for consultation
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: CONSULTATION_PRICE_USD * 100,
            product_data: {
              name: 'Expert Consultation with Ryan Kent, FNP-BC',
              description: `30-minute video consultation - ${selectedDay} at ${selectedTime} CT`,
              metadata: {
                type: 'consultation',
                provider: 'ryan-kent',
              },
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tryregenrx.com'}/consult/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tryregenrx.com'}/consult`,
      metadata: {
        type: 'consultation',
        patient_name: `${firstName} ${lastName}`,
        patient_email: email,
        patient_phone: phone,
        goal,
        questions: questions || '',
        appointment_day: selectedDay,
        appointment_time: selectedTime,
      },
    });

    // Send notification email to staff (async, don't await)
    sendStaffNotification({
      firstName,
      lastName,
      email,
      phone,
      goal,
      questions,
      selectedDay,
      selectedTime,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[regen-consult] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to book consultation' },
      { status: 500 }
    );
  }
}

async function sendStaffNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  goal: string;
  questions?: string;
  selectedDay: string;
  selectedTime: string;
}) {
  try {
    await resend.emails.send({
      from: 'REGEN RX <noreply@tryregenrx.com>',
      to: ['info@hellogorgeousmedspa.com'],
      subject: `📅 New Consultation Booking: ${data.firstName} ${data.lastName}`,
      html: `
        <h2>New Consultation Booking</h2>
        <p><strong>Patient:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Interest:</strong> ${data.goal}</p>
        <p><strong>Appointment:</strong> ${data.selectedDay} at ${data.selectedTime} CT</p>
        ${data.questions ? `<p><strong>Questions:</strong> ${data.questions}</p>` : ''}
        <hr />
        <p style="color: #888;">Payment pending via Stripe checkout.</p>
      `,
    });
  } catch (error) {
    console.error('[regen-consult] Failed to send staff notification:', error);
  }
}
