// ============================================================
// SESSION API ROUTE
// Get current user session
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { ROLE_PERMISSIONS, type AuthUser } from '@/lib/hgos/auth';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ user: null, session: null });
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ user: null, session: null });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    const user: AuthUser = {
      id: session.user.id,
      email: session.user.email || '',
      role: profile?.role || 'client',
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      avatarUrl: profile?.avatar_url,
      staffId: profile?.staff_id,
      clientId: profile?.client_id,
      providerId: profile?.provider_id,
      permissions: ROLE_PERMISSIONS[profile?.role || 'client'],
      createdAt: session.user.created_at,
    };

    return NextResponse.json({
      user,
      session: {
        access_token: session.access_token,
        expires_at: session.expires_at,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null, session: null });
  }
}
