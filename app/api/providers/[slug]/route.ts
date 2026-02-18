import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();
    
    const { data: provider, error } = await supabase
      .from("providers")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (error || !provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    // Get provider media
    const { data: media } = await supabase
      .from("provider_media")
      .select("*")
      .eq("provider_id", provider.id)
      .eq("status", "published")
      .eq("consent_confirmed", true)
      .order("featured", { ascending: false })
      .order("display_order", { ascending: true });

    return NextResponse.json({ 
      provider,
      media: media || []
    });
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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createServerSupabaseClient();
    const body = await req.json();
    
    const { data, error } = await supabase
      .from("providers")
      .update(body)
      .eq("slug", slug)
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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from("providers")
      .delete()
      .eq("slug", slug);

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
