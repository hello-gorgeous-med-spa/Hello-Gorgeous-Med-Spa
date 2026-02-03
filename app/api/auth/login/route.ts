// ============================================================
// LOGIN API ROUTE
// Handle authentication requests
// SECURITY: Demo accounts disabled in production
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ROLE_PERMISSIONS, type AuthUser, type UserRole } from '@/lib/hgos/auth';

// Force dynamic for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ============================================================
    // TRY SUPABASE AUTH (REQUIRED IN PRODUCTION)
    // ============================================================
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Debug: Check if env vars are set
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase env vars:', { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseAnonKey 
      });
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        console.log('Supabase auth error:', error.message, error.status);
        return NextResponse.json(
          { error: error.message || 'Invalid email or password' },
          { status: 401 }
        );
      }

      if (!data.user || !data.session) {
        return NextResponse.json(
          { error: 'Authentication failed - no session created' },
          { status: 401 }
        );
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        console.log('Profile fetch error:', profileError.message);
        // User authenticated but no profile - create default
      }

      const userRole = (profile?.role as UserRole) || 'client';
      
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || normalizedEmail,
        role: userRole,
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        avatarUrl: profile?.avatar_url,
        staffId: profile?.staff_id,
        clientId: profile?.client_id,
        providerId: profile?.provider_id,
        permissions: ROLE_PERMISSIONS[userRole],
        createdAt: data.user.created_at,
        lastLoginAt: new Date().toISOString(),
      };

      // Create response with session cookie
      const response = NextResponse.json({
        success: true,
        user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      });

      return response;
      
    } catch (supabaseError: any) {
      console.error('Supabase auth exception:', supabaseError);
      return NextResponse.json(
        { error: supabaseError?.message || 'Authentication service error' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
