import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Telnyx Configuration
const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_PHONE_NUMBER = process.env.TELNYX_PHONE_NUMBER || '+13317177545';
const TELNYX_MESSAGING_PROFILE_ID = process.env.TELNYX_MESSAGING_PROFILE_ID || '40019c14-a962-41a6-8d90-976426c9299f';

/**
 * Send a single SMS message with TCPA compliance logging
 */
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  try {
    const body = await request.json();
    const { to, message, mediaUrl, messageType, clientId, clientName, sentBy } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    if (!TELNYX_API_KEY) {
      return NextResponse.json(
        { error: 'Telnyx API key not configured' },
        { status: 500 }
      );
    }

    // Format phone number
    let formattedPhone = to.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = `+1${formattedPhone}`;
    } else if (formattedPhone.length === 11 && formattedPhone.startsWith('1')) {
      formattedPhone = `+${formattedPhone}`;
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }

    // Check if phone is opted out (TCPA compliance)
    const { data: optOut } = await supabase
      .from('sms_opt_outs')
      .select('id')
      .eq('phone', formattedPhone)
      .is('resubscribed_at', null)
      .single();

    if (optOut) {
      // Log the blocked message attempt
      await supabase.from('sms_messages').insert({
        recipient_phone: formattedPhone,
        recipient_client_id: clientId,
        recipient_name: clientName,
        message_type: messageType || 'transactional',
        message_content: message,
        media_url: mediaUrl,
        sender_phone: TELNYX_PHONE_NUMBER,
        status: 'opted_out',
        had_consent: false,
        sent_by: sentBy,
      });

      return NextResponse.json(
        { error: 'Recipient has opted out of SMS messages', optedOut: true },
        { status: 400 }
      );
    }

    // Ensure message has opt-out language (TCPA requirement)
    let finalMessage = message;
    const optOutPhrases = ['reply stop', 'text stop', 'opt out', 'unsubscribe', 'stop to'];
    const hasOptOut = optOutPhrases.some(phrase => message.toLowerCase().includes(phrase));
    if (!hasOptOut) {
      finalMessage = message + '\n\nReply STOP to unsubscribe.';
    }

    // Send via Telnyx
    const telnyxResponse = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TELNYX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: TELNYX_PHONE_NUMBER,
        to: formattedPhone,
        text: finalMessage,
        messaging_profile_id: TELNYX_MESSAGING_PROFILE_ID,
        ...(mediaUrl && { media_urls: [mediaUrl] }),
      }),
    });

    const data = await telnyxResponse.json();

    // Log the message (success or failure)
    const messageLog = {
      recipient_phone: formattedPhone,
      recipient_client_id: clientId || null,
      recipient_name: clientName || null,
      message_type: messageType || 'transactional',
      message_content: finalMessage,
      media_url: mediaUrl || null,
      sender_phone: TELNYX_PHONE_NUMBER,
      telnyx_message_id: data.data?.id || null,
      status: telnyxResponse.ok ? 'sent' : 'failed',
      error_message: !telnyxResponse.ok ? (data.errors?.[0]?.detail || 'Unknown error') : null,
      had_consent: true,
      consent_type: messageType === 'marketing' ? 'marketing' : 'transactional',
      sent_at: telnyxResponse.ok ? new Date().toISOString() : null,
      sent_by: sentBy || null,
      sent_via: 'api',
    };

    await supabase.from('sms_messages').insert(messageLog);

    if (!telnyxResponse.ok) {
      console.error('Telnyx error:', data);
      return NextResponse.json(
        { error: data.errors?.[0]?.detail || 'Failed to send SMS' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data.data?.id,
      to: formattedPhone,
      logged: true,
    });

  } catch (error) {
    console.error('SMS send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
