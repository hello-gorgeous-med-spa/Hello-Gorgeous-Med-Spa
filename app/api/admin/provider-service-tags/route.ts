import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from("provider_service_tags")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ tags: data || [] });
  } catch (error: unknown) {
    console.error("Error fetching service tags:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
