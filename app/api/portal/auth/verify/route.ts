import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateSessionToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const { data: magicToken, error } = await supabase
      .from('magic_link_tokens')
      .select('*, client:clients(*)')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !magicToken) {
      return NextResponse.json({ error: 'Invalid or expired link.' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    await supabase.from('magic_link_tokens').update({ used_at: new Date().toISOString() }).eq('id', magicToken.id);

    const sessionToken = generateSessionToken();
    const refreshToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const { data: session, error: sessionError } = await supabase
      .from('client_sessions')
      .insert({
        client_id: magicToken.client_id,
        session_token: sessionToken,
        refresh_token: refreshToken,
        expires_at: expiresAt.toISOString(),
        ip_address: ip,
        user_agent: userAgent
      })
      .select()
      .single();

    if (sessionError) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    await supabase.from('portal_access_log').insert({
      client_id: magicToken.client_id,
      session_id: session.id,
      action: 'login_success',
      ip_address: ip,
      user_agent: userAgent
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: magicToken.client.id,
        email: magicToken.client.email,
        firstName: magicToken.client.first_name,
        lastName: magicToken.client.last_name
      }
    });

    response.cookies.set('portal_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
