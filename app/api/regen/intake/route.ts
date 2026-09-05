import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { sendRegenNotification } from '@/lib/regen/notifications';
import {
  CONSENT_VERSION,
  generateConsentDocument,
  getTreatmentCategory,
} from '@/lib/regen/informed-consent';

function splitName(name: string): { first_name: string; last_name: string } {
  const parts = String(name || '').trim().split(/\s+/);
  return {
    first_name: parts[0] || name,
    last_name: parts.slice(1).join(' ') || '',
  };
}

/**
 * POST /api/regen/intake
 * Creates patient + intake in Supabase before Stripe checkout.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();

    const {
      name,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zip,
      goal,
      medicalHistory,
      currentMedications,
      allergies,
      age,
      weight,
      height,
      hipaaConsent,
      telehealthConsent,
      treatmentConsent,
      stripePaymentIntentId,
      amountPaid,
    } = body;

    if (!email || !name || !goal) {
      return NextResponse.json(
        { error: 'Name, email, and goal are required' },
        { status: 400 }
      );
    }

    if (state && state !== 'IL') {
      return NextResponse.json(
        { error: 'REGEN RX currently only serves Illinois residents' },
        { status: 400 }
      );
    }

    const { first_name, last_name } = splitName(name);
    let patientId: string | null = null;

    const { data: existingPatient } = await supabase
      .from('regen_patients')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingPatient?.id) {
      patientId = existingPatient.id;
      await supabase
        .from('regen_patients')
        .update({
          first_name,
          last_name,
          phone,
          date_of_birth: dateOfBirth || null,
          address_line1: address || undefined,
          city: city || undefined,
          state: state || 'IL',
          zip: zip || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', patientId);
    } else {
      const { data: newPatient, error: patientError } = await supabase
        .from('regen_patients')
        .insert({
          email: email.toLowerCase(),
          first_name,
          last_name,
          phone,
          date_of_birth: dateOfBirth || null,
          address_line1: address || null,
          city: city || null,
          state: state || 'IL',
          zip: zip || null,
        })
        .select('id')
        .single();

      if (patientError) {
        console.error('Failed to create patient:', patientError);
      } else {
        patientId = newPatient.id;
      }
    }

    const { data: intake, error: intakeError } = await supabase
      .from('regen_intakes')
      .insert({
        patient_id: patientId,
        name,
        email: email.toLowerCase(),
        phone,
        goal,
        medical_history: medicalHistory || {},
        current_medications: currentMedications || [],
        allergies: allergies || [],
        age,
        weight,
        height,
        state: state || 'IL',
        verified_illinois: state === 'IL',
        hipaa_consent_at: hipaaConsent ? new Date().toISOString() : null,
        telehealth_consent_at: telehealthConsent ? new Date().toISOString() : null,
        treatment_consent_at: treatmentConsent ? new Date().toISOString() : null,
        stripe_payment_intent_id: stripePaymentIntentId,
        amount_paid: amountPaid,
        status: amountPaid ? 'pending' : 'awaiting_payment',
      })
      .select()
      .single();

    if (intakeError) {
      console.error('Failed to create intake:', intakeError);
      return NextResponse.json(
        { error: intakeError.message || 'Failed to save intake' },
        { status: 500 }
      );
    }

    try {
      const category = getTreatmentCategory(goal);
      const signedAt = new Date().toISOString();
      await supabase.from('regen_signed_consents').insert({
        patient_id: patientId,
        patient_name: name,
        patient_email: email.toLowerCase(),
        patient_dob: dateOfBirth || '1990-01-01',
        treatment_category: category,
        program_id: goal,
        consent_version: CONSENT_VERSION,
        consent_document: generateConsentDocument({
          treatmentCategory: category,
          patientName: name,
          patientEmail: email,
          patientDob: dateOfBirth || '',
          signedAt,
          ipAddress: request.headers.get('x-forwarded-for') || '',
          userAgent: request.headers.get('user-agent') || '',
          consentVersion: CONSENT_VERSION,
          acknowledgedRisks: [],
          acknowledgedAlternatives: !!treatmentConsent,
          acknowledgedNoGuarantees: true,
        }),
        signed_at: signedAt,
        ip_address: request.headers.get('x-forwarded-for') || '',
        user_agent: request.headers.get('user-agent') || '',
        acknowledged_risks: !!treatmentConsent,
        acknowledged_alternatives: !!treatmentConsent,
        acknowledged_no_guarantees: true,
      });
    } catch (consentError) {
      console.error('Failed to store signed consent:', consentError);
    }

    try {
      await sendRegenNotification({
        type: 'welcome',
        patient: { name, email, phone },
        intake: { id: intake.id, goal },
      });
      await sendRegenNotification({
        type: 'new_intake',
        patient: { name, email, phone },
        intake: { id: intake.id, goal },
      });
    } catch (notifyError) {
      console.error('Failed to send notification:', notifyError);
    }

    await supabase.from('regen_audit_log').insert({
      action: 'intake_created',
      resource_type: 'intake',
      resource_id: intake.id,
      actor_type: 'patient',
      actor_email: email,
      details: { goal, has_payment: !!amountPaid },
    });

    return NextResponse.json({
      success: true,
      patientId,
      intakeId: intake.id,
      status: intake.status,
    });
  } catch (error) {
    console.error('Intake submission error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit intake' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const intakeId = searchParams.get('id');

    if (!intakeId) {
      return NextResponse.json({ error: 'Intake ID required' }, { status: 400 });
    }

    const { data: intake, error } = await supabase
      .from('regen_intakes')
      .select('id, status, goal, created_at, reviewed_at')
      .eq('id', intakeId)
      .single();

    if (error || !intake) {
      return NextResponse.json({ error: 'Intake not found' }, { status: 404 });
    }

    return NextResponse.json({ intake });
  } catch (error) {
    console.error('Get intake error:', error);
    return NextResponse.json({ error: 'Failed to get intake' }, { status: 500 });
  }
}
