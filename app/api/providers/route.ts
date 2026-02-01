// ============================================================
// API: GET ALL PROVIDERS (bypasses RLS with service role)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Define the ONLY active providers for Hello Gorgeous
// These are the real providers who should appear on calendars and booking
const ACTIVE_PROVIDER_NAMES = [
  { first: 'Danielle', lastMatch: ['Alcala', 'Glazier'] },  // Matches "Alcala", "Glazier-Alcala", etc.
  { first: 'Ryan', lastMatch: ['Kent'] },
];

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Fetch all providers with user info
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
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching providers:', error);
      
      // Return fallback providers
      return NextResponse.json({
        providers: [
          { id: 'danielle-001', first_name: 'Danielle', last_name: 'Alcala', credentials: 'Owner & Aesthetic Specialist', color_hex: '#EC4899' },
          { id: 'ryan-001', first_name: 'Ryan', last_name: 'Kent', credentials: 'APRN, FNP-BC', color_hex: '#8B5CF6' },
        ],
        fallback: true,
      });
    }

    // Flatten the data and FILTER to only show Ryan and Danielle
    const flatProviders = (providers || [])
      .map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        first_name: p.users?.first_name,
        last_name: p.users?.last_name,
        email: p.users?.email,
        credentials: p.credentials,
        color_hex: p.color_hex,
        is_active: p.is_active,
      }))
      .filter((p: any) => {
        // Only include providers whose names match our active list
        if (!p.first_name) return false;
        const firstName = p.first_name.toLowerCase();
        const lastName = (p.last_name || '').toLowerCase();
        
        return ACTIVE_PROVIDER_NAMES.some(active => {
          const firstMatch = firstName.includes(active.first.toLowerCase());
          const lastMatch = active.lastMatch.some(
            (lm: string) => lastName.includes(lm.toLowerCase())
          );
          return firstMatch && lastMatch;
        });
      });

    // If filtering resulted in no providers, return the fallback
    if (flatProviders.length === 0) {
      return NextResponse.json({
        providers: [
          { id: 'danielle-001', first_name: 'Danielle', last_name: 'Alcala', credentials: 'Owner & Aesthetic Specialist', color_hex: '#EC4899' },
          { id: 'ryan-001', first_name: 'Ryan', last_name: 'Kent', credentials: 'APRN, FNP-BC', color_hex: '#8B5CF6' },
        ],
        fallback: true,
      });
    }

    return NextResponse.json({ providers: flatProviders });
  } catch (error) {
    console.error('Providers API error:', error);
    
    // Return fallback on any error
    return NextResponse.json({
      providers: [
        { id: 'danielle-001', first_name: 'Danielle', last_name: 'Alcala', credentials: 'Owner & Aesthetic Specialist', color_hex: '#EC4899' },
        { id: 'ryan-001', first_name: 'Ryan', last_name: 'Kent', credentials: 'APRN, FNP-BC', color_hex: '#8B5CF6' },
      ],
      fallback: true,
    });
  }
}
