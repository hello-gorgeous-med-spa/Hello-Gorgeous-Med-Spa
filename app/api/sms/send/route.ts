import { NextRequest, NextResponse } from 'next/server';

// Telnyx Configuration
const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_PHONE_NUMBER = process.env.TELNYX_PHONE_NUMBER || '+13317177545';
const TELNYX_MESSAGING_PROFILE_ID = process.env.TELNYX_MESSAGING_PROFILE_ID || '40019c14-a962-41a6-8d90-976426c9299f';

/**
 * Send a single SMS message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, mediaUrl } = body;

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

    // Ensure message has opt-out language
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
    });

  } catch (error) {
    console.error('SMS send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
