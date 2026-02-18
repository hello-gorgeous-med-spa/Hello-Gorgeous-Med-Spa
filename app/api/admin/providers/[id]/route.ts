import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    
    const { data: provider, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ provider });
  } catch (error: unknown) {
    console.error("Error fetching provider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch provider" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    const body = await req.json();
    
    const { data, error } = await supabase
      .from("providers")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ provider: data });
  } catch (error: unknown) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update provider" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from("providers")
      .delete()
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
