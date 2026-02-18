import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    
    const { data: media, error } = await supabase
      .from("provider_media")
      .select("*")
      .eq("provider_id", id)
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ media: media || [] });
  } catch (error: unknown) {
    console.error("Error fetching provider media:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    const body = await req.json();
    
    const { data, error } = await supabase
      .from("provider_media")
      .insert({
        ...body,
        provider_id: id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ media: data });
  } catch (error: unknown) {
    console.error("Error creating provider media:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create media" },
      { status: 500 }
    );
  }
}
