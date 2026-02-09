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

    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const redirectTo = `${origin}/auth/callback`;

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
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Resend portal invite error:', res.status, err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Send portal invite error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
