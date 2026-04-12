import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ submissions: [] });

  const limit = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "30", 10)));

  const { data, error } = await admin
    .from("hg_form_submissions")
    .select(
      "id, submitted_at, signer_name, client_phone, responses_json, hg_form_templates(title, slug)",
    )
    .order("submitted_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ submissions: data || [] });
}
