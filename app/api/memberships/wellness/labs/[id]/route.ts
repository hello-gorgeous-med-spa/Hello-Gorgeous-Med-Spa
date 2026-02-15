// ============================================================
// GET SINGLE LAB - Fetch insights for display/PDF
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    if (!supabase || !id) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const email = req.nextUrl.searchParams.get("email");
    if (!email?.trim()) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!client) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: lab, error } = await supabase
      .from("member_lab_uploads")
      .select("id, file_name, uploaded_at, ai_insights_markdown")
      .eq("id", id)
      .eq("client_id", client.id)
      .is("deleted_at", null)
      .single();

    if (error || !lab) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({
      id: lab.id,
      fileName: lab.file_name,
      uploadedAt: lab.uploaded_at,
      insights: lab.ai_insights_markdown,
    });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
