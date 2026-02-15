import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getClientFromSession(request: NextRequest) {
  const sessionToken = request.cookies.get('portal_session')?.value;
  if (!sessionToken) return null;

  const { data: session } = await supabase
    .from('client_sessions')
    .select('client_id')
    .eq('session_token', sessionToken)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  return session?.client_id || null;
}

// GET - List consent forms (pending and signed)
export async function GET(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get consent forms
    const { data: consents } = await supabase
      .from('consent_submissions')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    // Get available consent form templates (from consent_forms table if exists)
    const { data: templates } = await supabase
      .from('consent_forms')
      .select('id, name, type, description, is_required')
      .eq('is_active', true);

    return NextResponse.json({
      consents: (consents || []).map(c => ({
        id: c.id,
        formType: c.form_type,
        status: c.status,
        signedAt: c.signed_at,
        expiresAt: c.expires_at,
        pdfUrl: c.pdf_url
      })),
      templates: templates || []
    });
  } catch (error) {
    console.error('Consents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Sign consent form
export async function POST(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { consentFormId, formType, formData, signatureData, signatureTyped } = await request.json();

    if (!formType || (!signatureData && !signatureTyped)) {
      return NextResponse.json({ error: 'Form type and signature required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    const { data: consent, error } = await supabase
      .from('consent_submissions')
      .insert({
        client_id: clientId,
        consent_form_id: consentFormId || '00000000-0000-0000-0000-000000000000',
        form_type: formType,
        form_data: formData || {},
        signature_data: signatureData,
        signature_typed: signatureTyped,
        signed_at: new Date().toISOString(),
        signature_ip: ip,
        status: 'signed'
      })
      .select()
      .single();

    if (error) {
      console.error('Consent submission error:', error);
      return NextResponse.json({ error: 'Failed to submit consent' }, { status: 500 });
    }

    // Log signing
    await supabase.from('portal_access_log').insert({
      client_id: clientId,
      action: 'sign_consent',
      resource_type: 'consent',
      resource_id: consent.id,
      ip_address: ip,
      user_agent: userAgent,
      metadata: { form_type: formType }
    });

    return NextResponse.json({ success: true, consent });
  } catch (error) {
    console.error('Consent sign error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
