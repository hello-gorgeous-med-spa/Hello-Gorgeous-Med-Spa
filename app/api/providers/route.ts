import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Increase max duration for this function
export const maxDuration = 15;
export const dynamic = 'force-dynamic';

// Timeout for database operations
const DB_TIMEOUT_MS = 10000;

// Helper to wrap promises with timeout
function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(errorMsg)), ms)
    ),
  ]);
}

// Fallback providers when DB is unavailable
const FALLBACK_PROVIDERS = [
  { id: '47ab9361-4a68-4ab8-a860-c9c9fd64d26c', first_name: 'Ryan', last_name: 'Kent', display_name: 'Ryan Kent, FNP-BC', credentials: 'FNP-BC', color_hex: '#3b82f6', active: true },
  { id: 'b7e6f872-3628-418a-aefb-aca2101f7cb2', first_name: 'Danielle', last_name: 'Alcala', display_name: 'Danielle Alcala, RN-S', credentials: 'RN-S', color_hex: '#ec4899', active: true },
];

// Create supabase client inline (not from shared module to avoid issues)
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      console.log('Providers: Supabase not configured, returning fallback');
      return NextResponse.json({ providers: FALLBACK_PROVIDERS, source: 'fallback' });
    }
    
    const { data, error } = await withTimeout(
      supabase
        .from("providers")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true }),
      DB_TIMEOUT_MS,
      'Database timeout'
    );

    if (error) {
      console.log('Providers DB error, using fallback:', error.message);
      return NextResponse.json({ providers: FALLBACK_PROVIDERS, source: 'fallback' });
    }

    // If no providers in DB, return fallback
    if (!data || data.length === 0) {
      return NextResponse.json({ providers: FALLBACK_PROVIDERS, source: 'fallback' });
    }

    return NextResponse.json({ providers: data });
  } catch (error: unknown) {
    console.error("Error fetching providers:", error);
    // ALWAYS return fallback - never fail
    return NextResponse.json({ 
      providers: FALLBACK_PROVIDERS,
      source: 'fallback',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    
    const body = await req.json();
    
    const { data, error } = await supabase
      .from("providers")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ provider: data });
  } catch (error: unknown) {
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create provider" },
      { status: 500 }
    );
  }
}
