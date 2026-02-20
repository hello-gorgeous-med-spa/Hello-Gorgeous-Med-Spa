import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Timeout for database operations (8 seconds)
const DB_TIMEOUT_MS = 8000;

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

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await withTimeout(
      supabase
        .from("providers")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true }),
      DB_TIMEOUT_MS,
      'Database timeout'
    );

    if (error) throw error;

    return NextResponse.json({ providers: data || [] });
  } catch (error: unknown) {
    console.error("Error fetching providers:", error);
    // Return fallback providers on timeout so admin still works
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    if (errorMsg.includes('timeout')) {
      return NextResponse.json({ 
        providers: FALLBACK_PROVIDERS,
        source: 'fallback',
        warning: 'Database timeout - using cached provider data',
      });
    }
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
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
