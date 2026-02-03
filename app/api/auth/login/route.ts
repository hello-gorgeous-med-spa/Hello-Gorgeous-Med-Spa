// ============================================================
// LOGIN API ROUTE
// Handle authentication requests
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { ROLE_PERMISSIONS, type AuthUser, type UserRole } from '@/lib/hgos/auth';

// Demo accounts for development
const DEMO_ACCOUNTS: Record<string, { password: string; role: UserRole; firstName: string; lastName: string }> = {
  'admin@hellogorgeousmedspa.com': {
    password: 'admin123',
    role: 'admin',
    firstName: 'Danielle',
    lastName: 'Glazier-Alcala',
  },
  'owner@hellogorgeousmedspa.com': {
    password: 'owner123',
    role: 'owner',
    firstName: 'Danielle',
    lastName: 'Glazier-Alcala',
  },
  'provider@hellogorgeousmedspa.com': {
    password: 'provider123',
    role: 'provider',
    firstName: 'Ryan',
    lastName: 'Kent',
  },
  'staff@hellogorgeousmedspa.com': {
    password: 'staff123',
    role: 'staff',
    firstName: 'Staff',
    lastName: 'Member',
  },
  'client@example.com': {
    password: 'client123',
    role: 'client',
    firstName: 'Jennifer',
    lastName: 'Martinez',
  },
};

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

    // Try Supabase auth first
    const supabase = createServerSupabaseClient();
    
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (!error && data.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

          const user: AuthUser = {
            id: data.user.id,
            email: data.user.email || normalizedEmail,
            role: profile?.role || 'client',
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            avatarUrl: profile?.avatar_url,
            staffId: profile?.staff_id,
            clientId: profile?.client_id,
            providerId: profile?.provider_id,
            permissions: ROLE_PERMISSIONS[profile?.role || 'client'],
            createdAt: data.user.created_at,
            lastLoginAt: new Date().toISOString(),
          };

          return NextResponse.json({
            success: true,
            user,
            session: {
              access_token: data.session?.access_token,
              refresh_token: data.session?.refresh_token,
              expires_at: data.session?.expires_at,
            },
          });
        }
      } catch (supabaseError) {
        console.log('Supabase auth failed, falling back to demo accounts');
      }
    }

    // Fall back to demo accounts
    const demoAccount = DEMO_ACCOUNTS[normalizedEmail];
    
    if (!demoAccount || demoAccount.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user: AuthUser = {
      id: `demo-${demoAccount.role}-${Date.now()}`,
      email: normalizedEmail,
      role: demoAccount.role,
      firstName: demoAccount.firstName,
      lastName: demoAccount.lastName,
      permissions: ROLE_PERMISSIONS[demoAccount.role],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      user,
      session: {
        access_token: `demo_token_${Date.now()}`,
        expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
