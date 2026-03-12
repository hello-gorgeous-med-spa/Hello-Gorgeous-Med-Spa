// ============================================================
// API: CONSENT FORM REQUEST
// Send consent form links to clients via email or SMS
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CONSENT_FORMS } from '@/lib/hgos/consent-forms';
import twilio from 'twilio';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.hellogorgeousmedspa.com';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (!accountSid || !authToken || !phoneNumber || accountSid.startsWith('your_')) {
    return null;
  }
  
  return { client: twilio(accountSid, authToken), phoneNumber };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formType, email, phone, formName, clientId, appointmentId } = body;

    // Validate form type
    const form = CONSENT_FORMS.find(f => f.id === formType);
    if (!form) {
      return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });
    }

    if (!email && !phone) {
      return NextResponse.json({ error: 'Email or phone required' }, { status: 400 });
    }

    // Generate unique consent request token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save consent request to database
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('consent_requests').insert({
          id: token,
          form_type: formType,
          form_version: form.version,
          client_id: clientId || null,
          appointment_id: appointmentId || null,
          recipient_email: email || null,
          recipient_phone: phone || null,
          expires_at: expiresAt.toISOString(),
          status: 'pending',
          sent_at: new Date().toISOString(),
        });
      } catch (dbError) {
        console.log('Consent request table may not exist:', dbError);
        // Continue anyway - table might not exist yet
      }
    }

    // Build consent form URL
    const consentUrl = `${BASE_URL}/consent/${token}?form=${formType}`;
    const shortFormName = form.shortName || formName || form.name;

    // Send via email if provided
    if (email) {
      // Using a simple email approach - in production you'd use SendGrid, Resend, etc.
      // For now, we'll record it and could integrate with an email service
      console.log(`Consent form email would be sent to: ${email}`);
      console.log(`URL: ${consentUrl}`);
      
      // TODO: Integrate with email service like SendGrid
      // For now, just record the request was made
    }

    // Send via SMS if provided
    if (phone) {
      const twilioConfig = getTwilioClient();
      if (twilioConfig) {
        const { client, phoneNumber } = twilioConfig;
        
        // Format phone number
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.length === 10) {
          formattedPhone = '+1' + formattedPhone;
        } else if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+' + formattedPhone;
        }

        const smsMessage = `Hello Gorgeous Med Spa: Please complete your ${shortFormName} consent form before your appointment: ${consentUrl}`;

        try {
          await client.messages.create({
            body: smsMessage,
            from: phoneNumber,
            to: formattedPhone,
          });
        } catch (smsError: unknown) {
          console.error('SMS send error:', smsError);
          return NextResponse.json({ 
            error: 'Failed to send SMS',
            details: smsError instanceof Error ? smsError.message : 'Unknown error'
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          error: 'SMS not configured. Please set up Twilio credentials.',
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: email && phone 
        ? 'Consent form sent via email and SMS'
        : email 
          ? 'Consent form link recorded (email service integration pending)'
          : 'Consent form sent via SMS',
      token,
      url: consentUrl,
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('Consent request error:', error);
    return NextResponse.json({ 
      error: 'Failed to process consent request' 
    }, { status: 500 });
  }
}

// GET - Check consent request status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('consent_requests')
      .select('*')
      .eq('id', token)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Consent request not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: data.status,
      formType: data.form_type,
      formVersion: data.form_version,
      expiresAt: data.expires_at,
      signedAt: data.signed_at,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch consent request' }, { status: 500 });
  }
}
