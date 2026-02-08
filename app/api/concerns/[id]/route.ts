import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { owner_notes, status } = body;

    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const updates: Record<string, unknown> = {};
    if (owner_notes !== undefined) updates.owner_notes = owner_notes;
    if (status !== undefined) updates.status = status;
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from("concern_submissions")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Concerns PATCH error:", error);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Concerns PATCH error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
