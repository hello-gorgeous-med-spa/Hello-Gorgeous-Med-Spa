import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors when env vars aren't set
function getStripe() {
  const key = process.env.REGEN_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Stripe API key not configured');
  }
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const CONSULTATION_PRICE_USD = 99;
const DOXY_ME_LINK = 'https://doxy.me/ryankent';

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
    const existingCustomers = await getStripe().customers.list({ email, limit: 1 });
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await getStripe().customers.create({
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
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer: customer.id,
      payment_method_types: ['card'],
      allow_promotion_codes: true, // Enable promo codes like GORGEOUS20
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

    // Send notification emails (async, don't await)
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

    // Send confirmation email to patient
    sendPatientConfirmation({
      firstName,
      email,
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
    await getResend().emails.send({
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
        <p><strong>Doxy.me Room:</strong> <a href="${DOXY_ME_LINK}">${DOXY_ME_LINK}</a></p>
        <p style="color: #888;">Payment pending via Stripe checkout.</p>
      `,
    });
  } catch (error) {
    console.error('[regen-consult] Failed to send staff notification:', error);
  }
}

async function sendPatientConfirmation(data: {
  firstName: string;
  email: string;
  selectedDay: string;
  selectedTime: string;
}) {
  try {
    await getResend().emails.send({
      from: 'REGEN RX <noreply@tryregenrx.com>',
      to: [data.email],
      subject: `Your REGEN RX Consultation is Confirmed ✓`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0D9488 0%, #0D5C63 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Consultation Confirmed!</h1>
          </div>
          
          <div style="padding: 32px; background: #f9f9f9;">
            <p style="font-size: 16px; color: #333;">Hi ${data.firstName},</p>
            
            <p style="font-size: 16px; color: #333;">
              Your consultation with <strong>Ryan Kent, FNP-BC</strong> is confirmed!
            </p>
            
            <div style="background: white; border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #0D9488;">
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Appointment Details:</p>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: #0D9488;">
                ${data.selectedDay} at ${data.selectedTime} CT
              </p>
            </div>
            
            <div style="background: #0D9488; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
              <p style="margin: 0 0 12px 0; color: rgba(255,255,255,0.8); font-size: 14px;">Join your video call here:</p>
              <a href="${DOXY_ME_LINK}" style="display: inline-block; background: white; color: #0D9488; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px;">
                ${DOXY_ME_LINK}
              </a>
              <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.6); font-size: 12px;">
                Bookmark this link and join at your scheduled time
              </p>
            </div>
            
            <h3 style="color: #333; margin-top: 32px;">How to prepare:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Have your health history ready (medications, conditions)</li>
              <li>Write down your questions and goals</li>
              <li>Find a quiet, private space for your call</li>
              <li>Test your camera and microphone beforehand</li>
            </ul>
            
            <p style="font-size: 14px; color: #888; margin-top: 32px;">
              Your $99 consultation fee will be credited toward your first prescription order.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 32px 0;" />
            
            <p style="font-size: 14px; color: #888; text-align: center;">
              Questions? Call us at <a href="tel:6306366193" style="color: #0D9488;">630-636-6193</a>
            </p>
          </div>
          
          <div style="background: #1a1a1a; padding: 24px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              REGEN RX · tryregenrx.com
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('[regen-consult] Failed to send patient confirmation:', error);
  }
}
