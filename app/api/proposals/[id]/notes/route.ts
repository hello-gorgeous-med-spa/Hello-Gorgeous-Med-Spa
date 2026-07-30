import { NextRequest, NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * POST /api/proposals/[id]/notes
 * Append a staff reference note to the proposal and, when a matching client exists,
 * also write a general chart note for clinical reference.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Proposal id is required." }, { status: 400 });

  const body = await request.json().catch(() => ({}));
  const note = String(body.note || "").trim();
  if (!note) return NextResponse.json({ error: "Note is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data: proposal, error: loadError } = await supabase
    .from("treatment_proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (loadError || !proposal) {
    return NextResponse.json({ error: loadError?.message || "Proposal not found." }, { status: 404 });
  }

  const stamp = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const author = session.email || "staff";
  const stamped = `[${stamp} · ${author}]\n${note}`;
  const nextInternal = proposal.internal_notes
    ? `${String(proposal.internal_notes).trim()}\n\n———\n${stamped}`
    : stamped;

  let clientId: string | null =
    typeof proposal.client_id === "string" && proposal.client_id ? proposal.client_id : null;

  if (!clientId && proposal.client_email) {
    const email = String(proposal.client_email).trim();
    const { data: byEmail } = await supabase
      .from("clients")
      .select("id")
      .ilike("email", email)
      .limit(1)
      .maybeSingle();
    if (byEmail?.id) clientId = String(byEmail.id);
  }

  if (!clientId && proposal.client_phone) {
    const phoneDigits = digitsOnly(String(proposal.client_phone));
    if (phoneDigits.length >= 7) {
      const { data: phoneRows } = await supabase
        .from("clients")
        .select("id, phone")
        .not("phone", "is", null)
        .limit(200);
      const match = (phoneRows || []).find((row) => {
        const rowDigits = digitsOnly(String(row.phone || ""));
        return (
          rowDigits === phoneDigits ||
          rowDigits.endsWith(phoneDigits.slice(-10)) ||
          phoneDigits.endsWith(rowDigits.slice(-10))
        );
      });
      if (match?.id) clientId = String(match.id);
    }
  }

  const { data: updated, error: updateError } = await supabase
    .from("treatment_proposals")
    .update({
      internal_notes: nextInternal,
      client_id: clientId || proposal.client_id || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: updateError?.message || "Failed to save note." }, { status: 500 });
  }

  let chartNoteId: string | null = null;
  if (clientId) {
    const { data: chartNote, error: chartError } = await supabase
      .from("chart_notes")
      .insert({
        client_id: clientId,
        note_type: "general",
        title: `Proposal reference — ${proposal.client_name || "Client"}`,
        status: "draft",
        subjective: note,
        plan: `Linked treatment proposal ${proposal.public_id || id}. Staff reference note for consult follow-up.`,
        created_by: session.email || null,
      })
      .select("id")
      .single();

    if (!chartError && chartNote?.id) {
      chartNoteId = String(chartNote.id);
    }
  }

  return NextResponse.json({
    proposal: updated,
    clientId,
    chartNoteId,
    charted: Boolean(chartNoteId),
  });
}
