import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { buildProposalPdf } from "@/lib/proposals/pdf";
import type { TreatmentProposalRecord } from "@/lib/proposals/types";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const { publicId } = await context.params;
  if (!publicId) return NextResponse.json({ error: "publicId is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data, error } = await supabase.from("treatment_proposals").select("*").eq("public_id", publicId).single();
  if (error || !data) return NextResponse.json({ error: "Proposal not found." }, { status: 404 });

  const expired = data.expires_at ? new Date(data.expires_at).getTime() < Date.now() : false;
  if (expired) return NextResponse.json({ error: "Proposal has expired." }, { status: 410 });

  const proposal = data as TreatmentProposalRecord;
  const bytes = buildProposalPdf(proposal);
  const fileName = `hello-gorgeous-treatment-plan-${proposal.client_name
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
