// ============================================================
// REQUEST REFILL - Set refill_status to pending
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    if (!supabase || !id) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const body = await req.json();
    const email = body.email;

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email required." }, { status: 401 });
    }

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!client) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const { error } = await supabase
      .from("member_medications")
      .update({
        refill_status: "pending",
        refill_requested_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("client_id", client.id);

    if (error) {
      return NextResponse.json({ error: "Failed to request refill." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Refill requested." });
  } catch {
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
