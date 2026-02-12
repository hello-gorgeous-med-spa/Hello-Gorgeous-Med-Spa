// ============================================================
// DEBUG: Telnyx Direct SMS Test
// Sends a single test message and returns the FULL Telnyx API
// response including carrier error codes.
//
// GET  /api/debug/telnyx-direct-test?to=+1XXXXXXXXXX
// POST /api/debug/telnyx-direct-test  { "to": "+1XXXXXXXXXX" }
//
// DELETE THIS ROUTE AFTER TESTING
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_PHONE_NUMBER = process.env.TELNYX_PHONE_NUMBER || process.env.TELNYX_FROM_NUMBER;
const TELNYX_MESSAGING_PROFILE_ID = process.env.TELNYX_MESSAGING_PROFILE_ID;

async function runTest(toNumber: string) {
  // 1. Validate env vars
  const envCheck = {
    TELNYX_API_KEY: TELNYX_API_KEY ? `${TELNYX_API_KEY.substring(0, 8)}...` : 'MISSING',
    TELNYX_PHONE_NUMBER: TELNYX_PHONE_NUMBER || 'MISSING',
    TELNYX_MESSAGING_PROFILE_ID: TELNYX_MESSAGING_PROFILE_ID || 'MISSING',
  };

  if (!TELNYX_API_KEY || !TELNYX_PHONE_NUMBER) {
    return NextResponse.json({
      success: false,
      error: 'Missing env vars',
      envCheck,
    }, { status: 500 });
  }

  // 2. Normalize the to number
  let to = toNumber.replace(/[^\d+]/g, '');
  if (!to.startsWith('+')) {
    const digits = to.replace(/\D/g, '');
    if (digits.length === 10) to = `+1${digits}`;
    else if (digits.length === 11 && digits.startsWith('1')) to = `+${digits}`;
  }

  // 3. Build the request body
  const requestBody: Record<string, string> = {
    from: TELNYX_PHONE_NUMBER,
    to,
    text: `[TEST] Hello Gorgeous Med Spa direct Telnyx test - ${new Date().toISOString()}`,
  };

  // Include messaging_profile_id if set
  if (TELNYX_MESSAGING_PROFILE_ID) {
    requestBody.messaging_profile_id = TELNYX_MESSAGING_PROFILE_ID;
  }

  // 4. Send via Telnyx REST API
  try {
    const response = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TELNYX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      httpStatus: response.status,
      envCheck,
      requestSent: {
        from: requestBody.from,
        to: requestBody.to,
        messaging_profile_id: requestBody.messaging_profile_id || 'not set',
      },
      telnyxResponse: data,
      // Pull out key fields for easy reading
      summary: response.ok ? {
        messageId: data.data?.id,
        status: data.data?.to?.[0]?.status || data.data?.status,
        carrier: data.data?.to?.[0]?.carrier,
        lineType: data.data?.to?.[0]?.line_type,
        direction: data.data?.direction,
        type: data.data?.type,
      } : {
        errorCode: data.errors?.[0]?.code,
        errorTitle: data.errors?.[0]?.title,
        errorDetail: data.errors?.[0]?.detail,
        errorMeta: data.errors?.[0]?.meta,
      },
      timestamp: new Date().toISOString(),
      note: 'DELETE this debug route after testing is complete.',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      envCheck,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// GET /api/debug/telnyx-direct-test?to=+13125551234
export async function GET(request: NextRequest) {
  const to = new URL(request.url).searchParams.get('to');
  if (!to) {
    return NextResponse.json({
      error: 'Provide ?to=+1XXXXXXXXXX query param',
      usage: 'GET /api/debug/telnyx-direct-test?to=+13125551234',
    }, { status: 400 });
  }
  return runTest(to);
}

// POST /api/debug/telnyx-direct-test { "to": "+13125551234" }
export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.to) {
    return NextResponse.json({
      error: 'Provide "to" in request body',
      usage: 'POST { "to": "+13125551234" }',
    }, { status: 400 });
  }
  return runTest(body.to);
}
