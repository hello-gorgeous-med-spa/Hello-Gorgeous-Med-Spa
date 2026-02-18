import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  try {
    const { mediaId } = await params;
    const supabase = createServerSupabaseClient();
    const body = await req.json();
    
    // Validate consent before publishing before_after
    if (body.status === "published") {
      const { data: existing } = await supabase
        .from("provider_media")
        .select("type, consent_confirmed")
        .eq("id", mediaId)
        .single();
      
      if (existing?.type === "before_after" && !existing?.consent_confirmed && !body.consent_confirmed) {
        return NextResponse.json(
          { error: "Consent must be confirmed before publishing before/after photos" },
          { status: 400 }
        );
      }
    }
    
    const { data, error } = await supabase
      .from("provider_media")
      .update(body)
      .eq("id", mediaId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ media: data });
  } catch (error: unknown) {
    console.error("Error updating provider media:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update media" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  try {
    const { mediaId } = await params;
    const supabase = createServerSupabaseClient();
    
    const { error } = await supabase
      .from("provider_media")
      .delete()
      .eq("id", mediaId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting provider media:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete media" },
      { status: 500 }
    );
  }
}
