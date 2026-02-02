import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';
import { getConsentForm, ConsentFormType } from '@/lib/hgos/consent-forms';

// POST /api/consents/sign - Sign a consent form
export async function POST(request: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      clientId,
      formType,
      signatureData,
      signatureType,
      witnessName,
      witnessSignature,
    } = body;

    // Validate required fields
    if (!clientId || !formType || !signatureData || !signatureType) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, formType, signatureData, signatureType' },
        { status: 400 }
      );
    }

    // Validate form type exists
    const form = getConsentForm(formType as ConsentFormType);
    if (!form) {
      return NextResponse.json(
        { error: `Invalid form type: ${formType}` },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Calculate expiration date if applicable
    let expiresAt = null;
    if (form.expiresAfterDays) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + form.expiresAfterDays);
      expiresAt = expDate.toISOString();
    }

    const supabase = createAdminSupabaseClient();

    // First, expire any existing signed consent for this form type
    await supabase
      .from('signed_consents')
      .update({ status: 'expired' })
      .eq('client_id', clientId)
      .eq('form_type', formType)
      .eq('status', 'signed');

    // Insert new signed consent
    const { data, error } = await supabase
      .from('signed_consents')
      .insert({
        client_id: clientId,
        form_type: formType,
        form_version: form.version,
        signature_data: signatureData,
        signature_type: signatureType,
        ip_address: ipAddress,
        user_agent: userAgent,
        witness_name: witnessName || null,
        witness_signature: witnessSignature || null,
        expires_at: expiresAt,
        status: 'signed',
      })
      .select()
      .single();

    if (error) {
      console.error('Error signing consent:', error);
      return NextResponse.json(
        { error: 'Failed to save consent signature' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      consent: data,
      message: `${form.name} signed successfully`,
    });

  } catch (error) {
    console.error('Consent signing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/consents/sign?clientId=xxx - Get all signed consents for a client
export async function GET(request: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from('signed_consents')
      .select('*')
      .eq('client_id', clientId)
      .order('signed_at', { ascending: false });

    if (error) {
      console.error('Error fetching consents:', error);
      return NextResponse.json(
        { error: 'Failed to fetch consents' },
        { status: 500 }
      );
    }

    return NextResponse.json({ consents: data });

  } catch (error) {
    console.error('Consent fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
