// ============================================================
// MARKETING SUBSCRIBE API
// Handle new marketing sign-ups and loyalty enrollments
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, marketingConsent, loyaltyEnroll, smsConsent } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'First name, last name, and email are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    if (!supabase) {
      // Return success even without DB for demo purposes
      return NextResponse.json({ 
        success: true, 
        message: 'Thank you for signing up!',
        source: 'demo'
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    let userId = existingUser?.id;

    if (!userId) {
      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase().trim(),
          phone: phone || null,
          role: 'client',
        })
        .select('id')
        .single();

      if (userError) {
        console.error('User creation error:', userError);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
      }

      userId = newUser.id;

      // Create client record
      await supabase
        .from('clients')
        .insert({
          user_id: userId,
          referral_source: 'marketing_signup',
        });
    }

    // Update or create marketing preferences
    const { error: prefError } = await supabase
      .from('marketing_preferences')
      .upsert({
        user_id: userId,
        email_opt_in: marketingConsent,
        sms_opt_in: smsConsent && !!phone,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (prefError) {
      console.error('Marketing preferences error:', prefError);
      // Don't fail the request, just log
    }

    // Enroll in loyalty if requested
    if (loyaltyEnroll) {
      // Check if already enrolled
      const { data: existingLoyalty } = await supabase
        .from('loyalty_accounts')
        .select('id')
        .eq('client_id', userId)
        .single();

      if (!existingLoyalty) {
        await supabase
          .from('loyalty_accounts')
          .insert({
            client_id: userId,
            points_balance: 100, // Welcome bonus!
            tier: 'bronze',
            enrolled_at: new Date().toISOString(),
          });
      }
    }

    // Log the signup for analytics
    await supabase
      .from('marketing_events')
      .insert({
        user_id: userId,
        event_type: 'signup',
        channel: 'web_form',
        metadata: {
          loyalty_enrolled: loyaltyEnroll,
          email_opt_in: marketingConsent,
          sms_opt_in: smsConsent,
        },
      }).catch(() => {}); // Ignore if table doesn't exist

    return NextResponse.json({
      success: true,
      message: 'Welcome to Hello Gorgeous!',
      loyaltyEnrolled: loyaltyEnroll,
    });

  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
