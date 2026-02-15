import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data: client } = await supabase
      .from('clients')
      .select('id, email, first_name, last_name, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!client || client.status === 'inactive' || client.status === 'blocked') {
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

    console.log('Magic link for', email, ':', magicLink);

    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ success: true, message: 'Login link sent.', _dev_link: magicLink });
    }

    return NextResponse.json({ success: true, message: 'If an account exists, a login link will be sent.' });
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
