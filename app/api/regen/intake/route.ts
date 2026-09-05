import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { sendRegenNotification } from '@/lib/regen/notifications';

/**
 * POST /api/regen/intake
 * 
 * Creates a patient record and intake submission in Supabase.
 * Called before Stripe checkout to ensure we have the medical data.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const {
      // Patient info
      name,
      email,
      phone,
      dateOfBirth,
      
      // Address
      address,
      city,
      state,
      zip,
      
      // Program/goal
      goal,
      
      // Medical screening
      medicalHistory,
      currentMedications,
      allergies,
      
      // Physical info
      age,
      weight,
      height,
      
      // Consents
      hipaaConsent,
      telehealthConsent,
      treatmentConsent,
      
      // Payment intent (if already created)
      stripePaymentIntentId,
      amountPaid,
    } = body;

    // Validate required fields
    if (!email || !name || !goal) {
      return NextResponse.json(
        { error: 'Name, email, and goal are required' },
        { status: 400 }
      );
    }

    // Validate Illinois
    if (state && state !== 'IL') {
      return NextResponse.json(
        { error: 'REGEN RX currently only serves Illinois residents' },
        { status: 400 }
      );
    }

    // Check for existing patient by email
    let { data: existingPatient } = await supabase
      .from('regen_patients')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    let patientId: string;

    if (existingPatient) {
      patientId = existingPatient.id;
      
      // Update patient info
      await supabase
        .from('regen_patients')
        .update({
          name,
          phone,
          date_of_birth: dateOfBirth,
          address: address ? { street: address, city, state: state || 'IL', zip } : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', patientId);
    } else {
      // Create new patient
      const { data: newPatient, error: patientError } = await supabase
        .from('regen_patients')
        .insert({
          email: email.toLowerCase(),
          name,
          phone,
          date_of_birth: dateOfBirth,
          state: state || 'IL',
          address: address ? { street: address, city, state: state || 'IL', zip } : undefined,
        })
        .select()
        .single();

      if (patientError) {
        console.error('Failed to create patient:', patientError);
        throw patientError;
      }

      patientId = newPatient.id;
    }

    // Create intake record
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
      throw intakeError;
    }

    // Email patient immediately + alert staff
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

    // Log the action
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
      { error: 'Failed to submit intake' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/regen/intake?id=xxx
 * 
 * Get intake status (for patient to check their submission)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
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
