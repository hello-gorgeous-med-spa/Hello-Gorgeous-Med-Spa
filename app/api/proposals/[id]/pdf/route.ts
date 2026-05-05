import { NextRequest, NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { buildProposalPdf } from "@/lib/proposals/pdf";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";

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
  if (error || !data) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });

  const proposal = data as TreatmentProposalRecord;
  const bytes = buildProposalPdf(proposal);
  const fileName = `hello-gorgeous-proposal-${proposal.client_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
