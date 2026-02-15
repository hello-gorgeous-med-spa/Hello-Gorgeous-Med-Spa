// ============================================================
// MEMBER LABS API - List lab uploads for client
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ labs: [] });
    }

    const email = req.nextUrl.searchParams.get("email");
    if (!email?.trim()) {
      return NextResponse.json({ labs: [] });
    }

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!client) {
      return NextResponse.json({ labs: [] });
    }

    const { data: labs, error } = await supabase
      .from("member_lab_uploads")
      .select("id, file_name, uploaded_at, processed_at, ai_insights_markdown")
      .eq("client_id", client.id)
      .is("deleted_at", null)
      .order("uploaded_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ labs: [] });
    }

    return NextResponse.json({
      labs: (labs || []).map((l) => ({
        id: l.id,
        fileName: l.file_name,
        uploadedAt: l.uploaded_at,
        processedAt: l.processed_at,
        hasInsights: !!l.ai_insights_markdown,
      })),
    });
  } catch {
    return NextResponse.json({ labs: [] });
  }
}
