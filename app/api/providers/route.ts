// ============================================================
// API: GET ALL PROVIDERS (bypasses RLS with service role)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Fetch all active providers with user info
    const { data: providers, error } = await supabase
      .from('providers')
      .select(`
        id,
        user_id,
        credentials,
        color_hex,
        is_active,
        users!inner(first_name, last_name, email)
      `)
      .eq('is_active', true)
      .order('users(last_name)');

    if (error) {
      console.error('Error fetching providers:', error);
      
      // Return fallback providers
      return NextResponse.json({
        providers: [
          { id: 'danielle-001', first_name: 'Danielle', last_name: 'Glazier-Alcala', credentials: 'Owner & Aesthetic Specialist', color_hex: '#EC4899' },
          { id: 'ryan-001', first_name: 'Ryan', last_name: 'Kent', credentials: 'APRN, FNP-BC', color_hex: '#8B5CF6' },
        ],
        fallback: true,
      });
    }

    // Flatten the data
    const flatProviders = (providers || []).map((p: any) => ({
      id: p.id,
      user_id: p.user_id,
      first_name: p.users?.first_name,
      last_name: p.users?.last_name,
      email: p.users?.email,
      credentials: p.credentials,
      color_hex: p.color_hex,
      is_active: p.is_active,
    }));

    return NextResponse.json({ providers: flatProviders });
  } catch (error) {
    console.error('Providers API error:', error);
    
    // Return fallback on any error
    return NextResponse.json({
      providers: [
        { id: 'danielle-001', first_name: 'Danielle', last_name: 'Glazier-Alcala', credentials: 'Owner & Aesthetic Specialist', color_hex: '#EC4899' },
        { id: 'ryan-001', first_name: 'Ryan', last_name: 'Kent', credentials: 'APRN, FNP-BC', color_hex: '#8B5CF6' },
      ],
      fallback: true,
    });
  }
}
