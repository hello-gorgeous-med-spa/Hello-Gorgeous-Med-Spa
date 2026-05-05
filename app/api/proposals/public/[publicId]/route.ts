import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const { publicId } = await context.params;
  if (!publicId) return NextResponse.json({ error: "publicId is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("treatment_proposals")
    .select("id,public_id,client_name,created_at,expires_at,status,concerns,options,pdf_url,view_count,viewed_at")
    .eq("public_id", publicId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });

  const expired = data.expires_at ? new Date(data.expires_at).getTime() < Date.now() : false;
  if (expired) return NextResponse.json({ error: "Proposal has expired." }, { status: 410 });

  const updatedViewCount = (data.view_count || 0) + 1;
  await supabase
    .from("treatment_proposals")
    .update({ viewed_at: new Date().toISOString(), view_count: updatedViewCount, status: data.status === "draft" ? "viewed" : data.status })
    .eq("id", data.id);

  return NextResponse.json({
    proposal: {
      id: data.id,
      public_id: data.public_id,
      client_name: data.client_name,
      created_at: data.created_at,
      expires_at: data.expires_at,
      status: data.status === "draft" ? "viewed" : data.status,
      concerns: data.concerns || [],
      options: data.options || [],
      pdf_url: data.pdf_url || null,
      view_count: updatedViewCount,
    },
  });
}
