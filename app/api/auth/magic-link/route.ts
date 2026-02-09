// ============================================================
// API: REQUEST MAGIC LINK (Client login)
// Sends a one-time, time-limited login link via Supabase Auth.
// HIPAA: No PHI in email body/URL; link is single-use and short-lived.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const emailTrimmed = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!emailTrimmed) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
    }

    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const redirectTo = `${origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email: emailTrimmed,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: 'Could not send login link. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists for this email, you will receive a secure login link shortly.',
    });
  } catch (e) {
    console.error('Magic link error:', e);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
