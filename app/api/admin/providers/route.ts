import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ providers: data || [] });
  } catch (error: unknown) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
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
