// ============================================================
// API: VERIFY CONSENT STATUS
// Check if client has all required consents before treatment
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

// Required consents for treatment
const REQUIRED_CONSENTS = ['hipaa', 'treatment_consent'];

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const appointmentId = searchParams.get('appointmentId');

    if (!clientId && !appointmentId) {
      return NextResponse.json(
        { error: 'clientId or appointmentId required' },
        { status: 400 }
      );
    }

    let targetClientId = clientId;

    // If appointmentId provided, get clientId from appointment
    if (appointmentId && !clientId) {
      const { data: appointment } = await supabase
        .from('appointments')
        .select('client_id')
        .eq('id', appointmentId)
        .single();

      if (!appointment) {
        return NextResponse.json(
          { error: 'Appointment not found' },
          { status: 404 }
        );
      }
      targetClientId = appointment.client_id;
    }

    // Get all valid signed consents for this client
    const { data: signedConsents, error } = await supabase
      .from('signed_consents')
      .select('*')
      .eq('client_id', targetClientId)
      .eq('status', 'signed')
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (error) {
      console.error('Error fetching consents:', error);
      return NextResponse.json(
        { error: 'Failed to verify consents' },
        { status: 500 }
      );
    }

    // Check which required consents are signed
    const signedTypes = (signedConsents || []).map(c => c.form_type);
    const missingConsents = REQUIRED_CONSENTS.filter(r => !signedTypes.includes(r));
    const hasAllRequired = missingConsents.length === 0;

    // Get consent details for display
    const consentDetails = REQUIRED_CONSENTS.map(type => {
      const signed = signedConsents?.find(c => c.form_type === type);
      return {
        type,
        name: getConsentName(type),
        signed: !!signed,
        signedAt: signed?.signed_at || null,
        expiresAt: signed?.expires_at || null,
      };
    });

    return NextResponse.json({
      clientId: targetClientId,
      hasAllRequired,
      missingConsents,
      consentDetails,
      totalSigned: signedConsents?.length || 0,
      canProceed: hasAllRequired,
      message: hasAllRequired 
        ? 'All required consents are signed' 
        : `Missing consents: ${missingConsents.map(getConsentName).join(', ')}`,
    });

  } catch (error) {
    console.error('Consent verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getConsentName(type: string): string {
  const names: Record<string, string> = {
    hipaa: 'HIPAA Acknowledgment',
    treatment_consent: 'Treatment Consent',
    financial_policy: 'Financial Policy',
    photo_release: 'Photo/Media Release',
    arbitration: 'Arbitration Agreement',
  };
  return names[type] || type;
}
