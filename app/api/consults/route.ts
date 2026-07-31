import { NextRequest, NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { createPublicConsultId, getConsultPack } from "@/lib/consults";
import type { ConsultVertical } from "@/lib/consults/types";

export const dynamic = "force-dynamic";

const VERTICALS: ConsultVertical[] = ["weight_loss", "injectables", "morpheus8", "other"];

export async function GET(request: NextRequest) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const vertical = request.nextUrl.searchParams.get("vertical");
  const status = request.nextUrl.searchParams.get("status");

  let query = supabase
    .from("treatment_consults")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (vertical && VERTICALS.includes(vertical as ConsultVertical)) {
    query = query.eq("vertical", vertical);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ consults: data ?? [] });
}

export async function POST(request: NextRequest) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const clientName = String(body.clientName || "").trim();
  const vertical = (VERTICALS.includes(body.vertical) ? body.vertical : "weight_loss") as ConsultVertical;

  if (!clientName) {
    return NextResponse.json({ error: "Client name is required." }, { status: 400 });
  }

  const pack = getConsultPack(vertical);
  const concernTags = Array.isArray(body.concernTags)
    ? body.concernTags.map(String)
    : pack.concernDefaults;

  const { data, error } = await supabase
    .from("treatment_consults")
    .insert({
      public_id: createPublicConsultId(),
      client_name: clientName,
      client_email: body.clientEmail || null,
      client_phone: body.clientPhone || null,
      client_id: body.clientId || null,
      vertical,
      status: "open",
      concern_tags: concernTags,
      screening: {},
      education_progress: { coveredSlideIds: [], currentSlideId: pack.slides[0]?.id },
      recommendation: {},
      internal_notes: typeof body.internalNotes === "string" ? body.internalNotes.trim() || null : null,
      created_by: session.email || "owner",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ consult: data });
}
