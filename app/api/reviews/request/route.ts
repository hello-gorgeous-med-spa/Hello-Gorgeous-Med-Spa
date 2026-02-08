// ============================================================
// REVIEW REQUEST API
// Auto-send review request SMS after checkout
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_PHONE = process.env.TELNYX_PHONE_NUMBER;
const TELNYX_PROFILE = process.env.TELNYX_MESSAGING_PROFILE_ID;

// Review link: use HG OS / your reviews page when set (NEXT_PUBLIC_REVIEWS_URL), else fallback to Google
const GOOGLE_REVIEW_URL = 'https://g.page/r/CRV4K5dQ4KANEAE/review';
function getReviewUrl(): string {
  return process.env.NEXT_PUBLIC_REVIEWS_URL || GOOGLE_REVIEW_URL;
}

// Delay before sending review request (in milliseconds)
const REVIEW_REQUEST_DELAY = 2 * 60 * 60 * 1000; // 2 hours after checkout

interface ReviewRequest {
  client_id: string;
  client_name: string;
  client_phone: string;
  appointment_id?: string;
  service_name?: string;
}

// Store for tracking sent requests (prevent duplicates)
const sentRequests: Map<string, Date> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body: ReviewRequest = await request.json();
    const { client_id, client_name, client_phone, service_name } = body;

    if (!client_phone) {
      return NextResponse.json(
        { error: 'Client phone number required' },
        { status: 400 }
      );
    }

    if (!TELNYX_API_KEY || !TELNYX_PHONE) {
      return NextResponse.json(
        { error: 'SMS not configured', queued: true },
        { status: 200 }
      );
    }

    // Check if we already sent a request to this client recently (within 7 days)
    const lastSent = sentRequests.get(client_id);
    if (lastSent) {
      const daysSince = (Date.now() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        return NextResponse.json({
          success: false,
          message: 'Review request already sent within 7 days',
          lastSent: lastSent.toISOString(),
        });
      }
    }

    // Format phone number
    let phone = client_phone.replace(/\D/g, '');
    if (phone.length === 10) phone = `+1${phone}`;
    else if (phone.length === 11 && phone.startsWith('1')) phone = `+${phone}`;
    else if (!phone.startsWith('+')) phone = `+${phone}`;

    // Create personalized message
    const reviewUrl = getReviewUrl();
    const firstName = client_name.split(' ')[0];
    const message = service_name
      ? `Hi ${firstName}! 💕 Thank you for visiting Hello Gorgeous Med Spa today for your ${service_name}! We'd love to hear about your experience. Would you mind leaving us a quick review? ${reviewUrl}\n\nReply STOP to opt out.`
      : `Hi ${firstName}! 💕 Thank you for visiting Hello Gorgeous Med Spa today! We'd love to hear about your experience. Would you mind leaving us a quick review? ${reviewUrl}\n\nReply STOP to opt out.`;

    // Send SMS via Telnyx
    const smsBody: any = {
      from: TELNYX_PHONE,
      to: phone,
      text: message,
    };

    if (TELNYX_PROFILE) {
      smsBody.messaging_profile_id = TELNYX_PROFILE;
    }

    const response = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TELNYX_API_KEY}`,
      },
      body: JSON.stringify(smsBody),
    });

    const result = await response.json();

    if (response.ok) {
      // Track that we sent this request
      sentRequests.set(client_id, new Date());

      return NextResponse.json({
        success: true,
        message: 'Review request sent',
        sms_id: result.data?.id,
      });
    } else {
      console.error('SMS send failed:', result);
      return NextResponse.json({
        success: false,
        error: result.errors?.[0]?.detail || 'Failed to send SMS',
      });
    }
  } catch (error) {
    console.error('Review request error:', error);
    return NextResponse.json(
      { error: 'Failed to send review request' },
      { status: 500 }
    );
  }
}

// GET - Check status or get review link
export async function GET() {
  return NextResponse.json({
    review_url: getReviewUrl(),
    google_review_url: GOOGLE_REVIEW_URL,
    configured: !!(TELNYX_API_KEY && TELNYX_PHONE),
    recent_requests: sentRequests.size,
  });
}
