// ============================================================
// EMAIL STATUS API
// Check if email marketing is configured
// ============================================================

import { NextResponse } from 'next/server';

export async function GET() {
  // Check for Mailchimp or Klaviyo API keys
  const mailchimpKey = process.env.MAILCHIMP_API_KEY;
  const klaviyoKey = process.env.KLAVIYO_API_KEY;
  
  const connected = !!(mailchimpKey || klaviyoKey);
  const provider = mailchimpKey ? 'mailchimp' : klaviyoKey ? 'klaviyo' : null;

  return NextResponse.json({
    connected,
    provider,
  });
}
