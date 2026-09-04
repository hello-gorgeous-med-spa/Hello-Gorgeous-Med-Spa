/**
 * REGEN RX Signup API
 * Uses Supabase Admin API to create pre-confirmed users
 * (Bypasses the email confirmation requirement since dashboard is frozen)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client with service role key (bypasses RLS and email confirmation)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin
      .from('regen_patients')
      .select('id')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 400 }
      );
    }

    // Create auth user with email_confirm: true (pre-confirmed!)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true, // This is the magic - user is pre-confirmed!
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: phone?.replace(/\D/g, '') || null,
        source: 'regen_portal',
      },
    });

    if (authError) {
      console.error('[regen/auth/signup] Auth error:', authError);
      
      // Handle specific error cases
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: authError.message || 'Failed to create account' },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Create patient record
    const { error: patientError } = await supabaseAdmin
      .from('regen_patients')
      .insert({
        user_id: authData.user.id,
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        phone: phone?.replace(/\D/g, '') || null,
        status: 'active',
      });

    if (patientError) {
      console.error('[regen/auth/signup] Patient record error:', patientError);
      // Don't fail signup if patient record fails - we can create it later
    }

    // Return success - user can now sign in immediately!
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      userId: authData.user.id,
    });

  } catch (error) {
    console.error('[regen/auth/signup] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
