// ============================================================
// API: SEND PORTAL INVITE (Post-booking magic link)
// Generates a one-time magic link and emails the client.
// HIPAA: No PHI in email subject or body; link is single-use and time-limited.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const emailTrimmed = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!emailTrimmed) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const admin = createAdminSupabaseClient();
    if (!admin) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
    }

    // Prefer canonical app URL for redirect (reliable when called server-side from booking API)
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || request.nextUrl?.origin || 'https://hellogorgeousmedspa.com').replace(/\/$/, '');
    const redirectTo = `${appUrl}/auth/callback`;

    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: emailTrimmed,
      options: { redirectTo },
    });

    if (linkError || !linkData) {
      return NextResponse.json(
        { error: 'Could not generate login link' },
        { status: 400 }
      );
    }

    const actionLink = (linkData as any).properties?.action_link ?? (linkData as any).action_link;
    if (!actionLink) {
      return NextResponse.json(
        { error: 'Could not generate login link' },
        { status: 400 }
      );
    }
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Hello Gorgeous <onboarding@resend.dev>';

    if (apiKey) {
      const appUrlBase = process.env.NEXT_PUBLIC_APP_URL || 'https://hellogorgeousmedspa.com';
      const getAppUrl = `${appUrlBase.replace(/\/$/, '')}/get-app`;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [emailTrimmed],
          subject: 'Access your secure client space',
          html: `
            <p>You can access your secure client space with the link below.</p>
            <p style="margin: 24px 0;">
              <a href="${actionLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #ec4899, #f43f5e); color: white; text-decoration: none; font-weight: 600; border-radius: 9999px;">Access My Client Space</a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">This link is single-use and expires soon. If you did not request it, you can ignore this email.</p>
            <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #374151;">Add Hello Gorgeous to your home screen for 1-tap booking: <a href="${getAppUrl}" style="color: #ec4899; font-weight: 600;">→ Go to get-app</a></p>
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[send-portal-invite] Resend error:', res.status, err);
        return NextResponse.json(
          { error: 'Failed to send portal invite email', resendError: err },
          { status: 502 }
        );
      }
      console.log('[send-portal-invite] Magic link email sent via Resend to', emailTrimmed);
    } else {
      console.warn('[send-portal-invite] RESEND_API_KEY not set - magic link email not sent');
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Send portal invite error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
