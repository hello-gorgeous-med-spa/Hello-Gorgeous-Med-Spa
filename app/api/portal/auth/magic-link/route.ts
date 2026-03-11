import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';
import crypto from 'crypto';

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Portal login is temporarily unavailable. Please try again later or call (630) 636-6193.' },
        { status: 503 }
      );
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();

    // Find client: first by clients.email, then by users.email (email is often on users table)
    let client: { id: string; email: string | null; first_name: string | null; last_name: string | null; status?: string } | null = null;

    const { data: byClientEmail } = await supabase
      .from('clients')
      .select('id, email, first_name, last_name, status')
      .eq('email', emailNorm)
      .maybeSingle();
    if (byClientEmail) client = byClientEmail as typeof client;

    if (!client) {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', emailNorm)
        .maybeSingle();
      if (user?.id) {
        const { data: byUserId } = await supabase
          .from('clients')
          .select('id, email, first_name, last_name, status')
          .eq('user_id', user.id)
          .maybeSingle();
        if (byUserId) client = byUserId as typeof client;
      }
    }

    const status = (client as { status?: string } | null)?.status;
    if (!client || status === 'inactive' || status === 'blocked') {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a login link will be sent.'
      });
    }

    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    await supabase.from('magic_link_tokens').delete().eq('client_id', client.id).is('used_at', null);

    await supabase.from('magic_link_tokens').insert({
      client_id: client.id,
      token,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
      ip_address: ip,
      user_agent: userAgent
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.hellogorgeousmedspa.com';
    const magicLink = `${baseUrl}/portal/verify?token=${token}`;

    await supabase.from('portal_access_log').insert({
      client_id: client.id,
      action: 'magic_link_requested',
      ip_address: ip,
      user_agent: userAgent
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[portal/magic-link] Dev mode - link:', magicLink);
      return NextResponse.json({ success: true, message: 'Login link sent.', _dev_link: magicLink });
    }

    // Send magic link email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Hello Gorgeous <onboarding@resend.dev>';
        const toEmail = (client as { email?: string | null }).email || emailNorm;
        const firstName = (client as { first_name?: string | null }).first_name || 'there';
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject: 'Your Hello Gorgeous Portal Login Link',
            html: `
              <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <p>Hi ${firstName},</p>
                <p>Click the link below to sign in to your Hello Gorgeous patient portal. This link expires in 15 minutes.</p>
                <p><a href="${magicLink}" style="display: inline-block; background: #FF2D8E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Sign In to Portal</a></p>
                <p>If you did not request this link, you can safely ignore this email.</p>
                <p style="color: #666; font-size: 12px;">Hello Gorgeous Med Spa | 74 W. Washington St, Oswego, IL</p>
              </div>
            `,
          }),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          console.error('[portal/magic-link] Resend failed', res.status, errBody);
        }
      } catch (emailErr) {
        console.error('[portal/magic-link] Email send error', emailErr);
      }
    }

    return NextResponse.json({ success: true, message: 'If an account exists, a login link will be sent.' });
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
