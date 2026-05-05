import { NextRequest, NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/get-owner-session";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getOwnerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const proposalId = String(body?.proposalId || "");
  if (!proposalId) return NextResponse.json({ error: "proposalId is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data: existing, error: existingError } = await supabase
    .from("treatment_proposals")
    .select("id, public_id")
    .eq("id", proposalId)
    .single();

  if (existingError || !existing) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });

  const publicId = existing.public_id || crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || SITE.url;
  const pdfUrl = `${baseUrl}/api/proposals/public/${publicId}/pdf`;

  const { data, error } = await supabase
    .from("treatment_proposals")
    .update({ public_id: publicId, pdf_url: pdfUrl, updated_at: new Date().toISOString() })
    .eq("id", proposalId)
    .select("id,pdf_url")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, proposal: data, pdfUrl });
}
