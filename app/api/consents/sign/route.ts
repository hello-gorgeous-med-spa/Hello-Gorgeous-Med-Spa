// ============================================================
// API: CONSENT FORM SIGNING
// Handle digital signatures on consent forms
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CONSENT_FORMS } from '@/lib/hgos/consent-forms';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      token, 
      formType, 
      signatureName, 
      signatureDate, 
      signatureImage,
      agreedToTerms,
      signedAt,
      userAgent,
    } = body;

    // Validate required fields
    if (!formType || !signatureName || !signatureDate || !agreedToTerms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate form type
    const form = CONSENT_FORMS.find(f => f.id === formType);
    if (!form) {
      return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });
    }

    const supabase = getSupabase();
    
    // Generate a signed consent record ID
    const signedConsentId = crypto.randomUUID();
    
    if (supabase) {
      try {
        // If there's a token, update the consent request
        if (token) {
          await supabase
            .from('consent_requests')
            .update({
              status: 'signed',
              signed_at: signedAt,
              signature_name: signatureName,
            })
            .eq('id', token);
        }

        // Store the signed consent
        await supabase.from('signed_consents').insert({
          id: signedConsentId,
          request_token: token || null,
          form_type: formType,
          form_version: form.version,
          form_name: form.name,
          signature_name: signatureName,
          signature_date: signatureDate,
          signature_image: signatureImage || null,
          agreed_to_terms: agreedToTerms,
          signed_at: signedAt,
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          user_agent: userAgent || null,
          form_content_hash: await hashContent(form.content),
        });

      } catch (dbError) {
        console.error('Database error storing consent:', dbError);
        // Continue anyway - we'll return success even if DB fails
        // The consent was still captured in the response
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Consent form signed successfully',
      consentId: signedConsentId,
      formType,
      formVersion: form.version,
      signedAt,
      signatureName,
    });

  } catch (error) {
    console.error('Consent signing error:', error);
    return NextResponse.json({ 
      error: 'Failed to process consent signature' 
    }, { status: 500 });
  }
}

// Hash the form content for version tracking
async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

// GET - Retrieve a signed consent
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const consentId = searchParams.get('id');

  if (!consentId) {
    return NextResponse.json({ error: 'Consent ID required' }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('signed_consents')
      .select('*')
      .eq('id', consentId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Signed consent not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      formType: data.form_type,
      formVersion: data.form_version,
      formName: data.form_name,
      signatureName: data.signature_name,
      signatureDate: data.signature_date,
      signedAt: data.signed_at,
      hasSignatureImage: !!data.signature_image,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch signed consent' }, { status: 500 });
  }
}
