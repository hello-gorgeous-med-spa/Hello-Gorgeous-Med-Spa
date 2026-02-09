// ============================================================
// API: CLIENT SESSION (Magic Link Callback)
// Verifies Supabase magic-link token, finds/creates user+client, sets session cookie.
// HIPAA: Audit log login; no PHI in response.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { ROLE_PERMISSIONS } from '@/lib/hgos/auth';
import { auditAuthLogin } from '@/lib/audit/middleware';

export const dynamic = 'force-dynamic';

function setClientSessionCookie(response: NextResponse, userId: string, email: string, clientId: string, expiresAt: number) {
  const cookieValue = JSON.stringify({
    userId,
    role: 'client',
    email,
    clientId,
  });
  const isProduction = process.env.NODE_ENV === 'production';
  response.cookies.set('hgos_session', encodeURIComponent(cookieValue), {
    path: '/',
    expires: new Date(expiresAt * 1000),
    httpOnly: false,
    secure: isProduction,
    sameSite: 'lax',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, refresh_token } = body;

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const admin = createAdminSupabaseClient();

    if (!supabase || !admin) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
    }

    // Verify the magic-link token and get Supabase auth user
    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(access_token);

    if (userError || !authUser?.email) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 401 });
    }

    const authId = authUser.id;
    const email = authUser.email.toLowerCase();

    // Find or create users row (link to Supabase auth)
    let userId: string;
    let clientId: string;
    let firstName = '';
    let lastName = '';

    let existingUser: { id: string; first_name: string | null; last_name: string | null; auth_id?: string | null } | null = null;
    const { data: byAuthId } = await admin.from('users').select('id, first_name, last_name, auth_id').eq('auth_id', authId).single();
    if (byAuthId) existingUser = byAuthId;
    if (!existingUser) {
      const { data: byEmail } = await admin.from('users').select('id, first_name, last_name, auth_id').eq('email', email).limit(1).single();
      if (byEmail) existingUser = byEmail;
    }

    if (existingUser) {
      userId = existingUser.id;
      firstName = existingUser.first_name || '';
      lastName = existingUser.last_name || '';
      if (!existingUser.auth_id) {
        await admin.from('users').update({ auth_id: authId }).eq('id', userId);
      }
    } else {
      const { data: newUser, error: insertUserError } = await admin
        .from('users')
        .insert({
          auth_id: authId,
          email,
          role: 'client',
          first_name: 'Client',
          last_name: '',
        })
        .select('id')
        .single();

      if (insertUserError || !newUser) {
        return NextResponse.json({ error: 'Could not create account' }, { status: 500 });
      }
      userId = newUser.id;
    }

    // Find or create client record
    const { data: existingClient } = await admin
      .from('clients')
      .select('id, first_name, last_name')
      .eq('user_id', userId)
      .single();

    if (existingClient) {
      clientId = existingClient.id;
      if (!firstName && existingClient.first_name) firstName = existingClient.first_name;
      if (!lastName && existingClient.last_name) lastName = existingClient.last_name;
    } else {
      const { data: newClient, error: insertClientError } = await admin
        .from('clients')
        .insert({
          user_id: userId,
          email,
          first_name: firstName || 'Client',
          last_name: lastName || '',
        })
        .select('id, first_name, last_name')
        .single();

      if (insertClientError || !newClient) {
        return NextResponse.json({ error: 'Could not create client record' }, { status: 500 });
      }
      clientId = newClient.id;
      firstName = newClient.first_name || firstName;
      lastName = newClient.last_name || lastName;
    }

    const expiresAt = authUser.exp ? authUser.exp : Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const user = {
      id: userId,
      email,
      role: 'client' as const,
      firstName,
      lastName,
      clientId,
      permissions: ROLE_PERMISSIONS.client,
      createdAt: authUser.created_at || new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      user,
      session: {
        access_token,
        refresh_token,
        expires_at: expiresAt,
      },
      redirect: '/portal',
    });

    setClientSessionCookie(response, userId, email, clientId, expiresAt);

    await auditAuthLogin(userId, email, true, request);

    return response;
  } catch (e) {
    console.error('Client session error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
