// ============================================================
// EMAIL STATUS API
// Check if email marketing is configured (Resend)
// ============================================================

import { NextResponse } from 'next/server';

export async function GET() {
  const resendKey = process.env.RESEND_API_KEY;
  const connected = !!resendKey;

  return NextResponse.json({
    connected,
    provider: connected ? 'resend' : null,
    fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    note: connected
      ? 'Resend configured. First 3,000 emails/month are free.'
      : 'Add RESEND_API_KEY to enable email campaigns. Sign up at resend.com (free tier: 3,000/month).',
  });
}
