import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Check current session
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('portal_session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { data: session } = await supabase
      .from('client_sessions')
      .select('*, client:clients(*)')
      .eq('session_token', sessionToken)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!session) {
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      response.cookies.delete('portal_session');
      return response;
    }

    // Update last activity
    await supabase
      .from('client_sessions')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', session.id);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.client.id,
        email: session.client.email,
        firstName: session.client.first_name,
        lastName: session.client.last_name,
        phone: session.client.phone
      },
      sessionId: session.id
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// DELETE - Logout
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('portal_session')?.value;

    if (sessionToken) {
      const { data: session } = await supabase
        .from('client_sessions')
        .select('id, client_id')
        .eq('session_token', sessionToken)
        .single();

      if (session) {
        await supabase
          .from('client_sessions')
          .update({ revoked_at: new Date().toISOString() })
          .eq('id', session.id);

        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        await supabase.from('portal_access_log').insert({
          client_id: session.client_id,
          session_id: session.id,
          action: 'logout',
          ip_address: ip
        });
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('portal_session');
    response.cookies.delete('portal_refresh');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
