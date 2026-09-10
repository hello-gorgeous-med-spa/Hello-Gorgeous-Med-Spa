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
  { id: 'b7e6f872-3628-418a-aefb-aca2101f7cb2', first_name: 'Danielle', last_name: 'Alcala', display_name: 'Danielle Alcala, RN-S', credentials: 'RN-S', color_hex: '#ec4899', active: true },
];

function hideDepartedProviders<T extends { slug?: string | null; first_name?: string | null; last_name?: string | null; display_name?: string | null }>(
  providers: T[],
): T[] {
  return providers.filter((p) => {
    const slug = String(p.slug || "").toLowerCase();
    const name = `${p.first_name || ""} ${p.last_name || ""} ${p.display_name || ""}`.toLowerCase();
    if (slug === "ryan" || slug.includes("ryan-kent")) return false;
    if (name.includes("ryan kent")) return false;
    return true;
  });
}

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

    return NextResponse.json({ providers: hideDepartedProviders(data) });
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
    
    // Generate UUID if not provided
    if (!body.id) {
      body.id = crypto.randomUUID();
    }
    
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

export async function PUT(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    
    const body = await req.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Provider ID required' }, { status: 400 });
    }
    
    // Check if provider exists in DB
    const { data: existing } = await supabase
      .from("providers")
      .select("id")
      .eq("id", id)
      .single();
    
    let data, error;
    
    if (!existing) {
      // Provider doesn't exist (might be a fallback) - insert it
      const fallbackProvider = FALLBACK_PROVIDERS.find(p => p.id === id);
      const insertData = fallbackProvider 
        ? { ...fallbackProvider, ...updateData }
        : { id, ...updateData };
      
      const result = await supabase
        .from("providers")
        .upsert(insertData, { onConflict: 'id' })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Update existing provider
      const result = await supabase
        .from("providers")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    return NextResponse.json({ success: true, provider: data });
  } catch (error: unknown) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update provider" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Provider ID required' }, { status: 400 });
    }
    
    // Soft delete - just set active to false
    const { error } = await supabase
      .from("providers")
      .update({ active: false })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting provider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete provider" },
      { status: 500 }
    );
  }
}
