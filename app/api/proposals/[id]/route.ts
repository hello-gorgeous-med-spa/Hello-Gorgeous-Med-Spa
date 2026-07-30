import { NextRequest, NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Proposal id is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data, error } = await supabase.from("treatment_proposals").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  return NextResponse.json({ proposal: data });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Proposal id is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const clientName = String(body.clientName || "").trim();
  const options = body.options;

  if (!clientName) {
    return NextResponse.json({ error: "Client name is required." }, { status: 400 });
  }
  if (!Array.isArray(options) || options.length === 0) {
    return NextResponse.json({ error: "Proposal options are required." }, { status: 400 });
  }

  const media = Array.isArray(body.media)
    ? body.media.filter(
        (item: { id?: string; kind?: string; url?: string }) =>
          item && typeof item.url === "string" && item.url.startsWith("http")
      )
    : [];

  const { data, error } = await supabase
    .from("treatment_proposals")
    .update({
      client_name: clientName,
      client_email: body.clientEmail || null,
      client_phone: body.clientPhone || null,
      concerns: Array.isArray(body.concerns) ? body.concerns : [],
      options,
      internal_notes: body.internalNotes || null,
      client_instructions:
        typeof body.clientInstructions === "string" ? body.clientInstructions.trim() || null : null,
      media,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });

  return NextResponse.json({ proposal: data });
}
