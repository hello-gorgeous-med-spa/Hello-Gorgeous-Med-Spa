import { NextRequest, NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/get-owner-session";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

function createPublicId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
}

export async function GET() {
  const session = await getOwnerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("treatment_proposals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ proposals: data ?? [] });
}

export async function POST(request: NextRequest) {
  const session = await getOwnerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await request.json();
  const clientName = String(body.clientName || "").trim();
  const options = body.options;

  if (!clientName) {
    return NextResponse.json({ error: "Client name is required." }, { status: 400 });
  }
  if (!Array.isArray(options) || options.length === 0) {
    return NextResponse.json({ error: "Proposal options are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("treatment_proposals")
    .insert({
      public_id: createPublicId(),
      client_name: clientName,
      client_email: body.clientEmail || null,
      client_phone: body.clientPhone || null,
      concerns: Array.isArray(body.concerns) ? body.concerns : [],
      options,
      internal_notes: body.internalNotes || null,
      created_by: session.email || "owner",
      status: "draft",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ proposal: data });
}
