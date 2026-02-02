import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';
import { ConsentFormType, getConsentForm } from '@/lib/hgos/consent-forms';
import { randomBytes } from 'crypto';

// POST /api/consents/request - Send consent form request to client
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
      formTypes,
      appointmentId,
      sendVia = 'email',
    } = body;

    // Validate
    if (!clientId || !formTypes || !Array.isArray(formTypes) || formTypes.length === 0) {
      return NextResponse.json(
        { error: 'clientId and formTypes array are required' },
        { status: 400 }
      );
    }

    // Validate all form types
    for (const formType of formTypes) {
      if (!getConsentForm(formType as ConsentFormType)) {
        return NextResponse.json(
          { error: `Invalid form type: ${formType}` },
          { status: 400 }
        );
      }
    }

    const supabase = createAdminSupabaseClient();

    // Get client info
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, user_id, users(email, first_name, last_name, phone)')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Generate unique token
    const token = randomBytes(32).toString('hex');
    
    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Determine send destination
    const user = client.users as any;
    const sentTo = sendVia === 'sms' ? user.phone : user.email;

    if (!sentTo) {
      return NextResponse.json(
        { error: `Client has no ${sendVia === 'sms' ? 'phone number' : 'email address'}` },
        { status: 400 }
      );
    }

    // Create consent request record
    const { data: consentRequest, error: insertError } = await supabase
      .from('consent_requests')
      .insert({
        client_id: clientId,
        form_types: formTypes,
        appointment_id: appointmentId || null,
        sent_via: sendVia,
        sent_to: sentTo,
        token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating consent request:', insertError);
      return NextResponse.json(
        { error: 'Failed to create consent request' },
        { status: 500 }
      );
    }

    // Generate consent link
    const baseUrl = process.env.NEXTAUTH_URL || 'https://hellogorgeousmedspa.com';
    const consentLink = `${baseUrl}/consent/${token}`;

    const formNames = formTypes.map((ft: ConsentFormType) => getConsentForm(ft)?.shortName).join(', ');

    // SEND SMS via Telnyx
    if (sendVia === 'sms' || sendVia === 'both') {
      try {
        const telnyxApiKey = process.env.TELNYX_API_KEY;
        const telnyxFromNumber = process.env.TELNYX_PHONE_NUMBER;
        
        if (telnyxApiKey && telnyxFromNumber && user.phone) {
          const smsMessage = `Hello Gorgeous Med Spa: Hi ${user.first_name}! Please complete your consent forms before your appointment: ${consentLink} - Required forms: ${formNames}`;
          
          await fetch('https://api.telnyx.com/v2/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${telnyxApiKey}`,
            },
            body: JSON.stringify({
              from: telnyxFromNumber,
              to: user.phone,
              text: smsMessage,
            }),
          });
          console.log('📱 Consent SMS sent to:', user.phone);
        }
      } catch (smsErr) {
        console.error('SMS send error:', smsErr);
        // Don't fail if SMS fails
      }
    }

    // SEND EMAIL (basic transactional email)
    if (sendVia === 'email' || sendVia === 'both') {
      try {
        // Log for now - in production, integrate with SendGrid/Resend/etc.
        console.log(`
📧 CONSENT EMAIL READY TO SEND:
To: ${user.first_name} ${user.last_name} <${user.email}>
Subject: Please Complete Your Consent Forms - Hello Gorgeous Med Spa

Dear ${user.first_name},

Thank you for booking with Hello Gorgeous Med Spa!

Before your appointment, please complete the following required consent forms:
${formNames}

Click here to sign your forms: ${consentLink}

This link will expire on ${expiresAt.toLocaleDateString()}.

If you have any questions, please call us at (630) 636-6193.

See you soon!
Hello Gorgeous Med Spa
74 W. Washington St, Oswego, IL 60543
        `);
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    console.log(`📋 Consent request created for ${user.first_name} ${user.last_name}`);

    return NextResponse.json({
      success: true,
      consentRequest,
      consentLink,
      message: `Consent request sent to ${sentTo}`,
      formNames,
    });

  } catch (error) {
    console.error('Consent request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/consents/request?token=xxx - Get consent request by token (for public signing page)
export async function GET(request: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from('consent_requests')
      .select(`
        *,
        clients(
          id,
          users(first_name, last_name, email)
        )
      `)
      .eq('token', token)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Consent request not found' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Consent request has expired' },
        { status: 410 }
      );
    }

    // Check if already completed
    if (data.completed_at) {
      return NextResponse.json(
        { error: 'Consent forms have already been signed' },
        { status: 409 }
      );
    }

    // Get form details
    const forms = (data.form_types as ConsentFormType[]).map(ft => getConsentForm(ft)).filter(Boolean);

    return NextResponse.json({
      consentRequest: data,
      forms,
      client: data.clients,
    });

  } catch (error) {
    console.error('Consent request fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
