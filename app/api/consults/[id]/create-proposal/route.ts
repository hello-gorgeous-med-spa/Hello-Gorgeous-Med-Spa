import { NextRequest, NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { createPublicConsultId, getConsultPack, optionsFromServiceIds } from "@/lib/consults";
import { screeningAllowsPropose } from "@/lib/consults/screening";
import type { ConsultRecommendation, ConsultScreening, TreatmentConsultRecord } from "@/lib/consults/types";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function createPublicProposalId(): string {
  return createPublicConsultId();
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Consult id is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data: consult, error: loadError } = await supabase
    .from("treatment_consults")
    .select("*")
    .eq("id", id)
    .single();

  if (loadError || !consult) {
    return NextResponse.json({ error: loadError?.message || "Consult not found." }, { status: 404 });
  }

  const record = consult as TreatmentConsultRecord;

  if (record.proposal_id) {
    return NextResponse.json({
      proposalId: record.proposal_id,
      alreadyLinked: true,
    });
  }

  const body = await request.json().catch(() => ({}));
  const screening = (record.screening || {}) as ConsultScreening;
  const allow =
    screeningAllowsPropose(screening) ||
    (Boolean(body.forceOverride) && Boolean(String(body.overrideNote || screening.staffOverrideNote || "").trim()));

  if (!allow) {
    return NextResponse.json(
      {
        error:
          "Screening is not clear. Complete screening, or set a staff override with a clinical note before creating a proposal.",
      },
      { status: 400 }
    );
  }

  const pack = getConsultPack(record.vertical);
  const recommendation = (record.recommendation || {}) as ConsultRecommendation;
  let serviceIds = Array.isArray(recommendation.serviceIds) ? recommendation.serviceIds : [];

  if (body.pathId) {
    const path = pack.paths.find((p) => p.id === body.pathId);
    if (path) {
      serviceIds = path.serviceIds;
    }
  }
  if (!serviceIds.length && pack.paths[0]) {
    serviceIds = pack.paths[0].serviceIds;
  }

  const options = optionsFromServiceIds(serviceIds);
  const pathLabel =
    recommendation.pathLabel ||
    pack.paths.find((p) => p.id === recommendation.pathId)?.label ||
    pack.paths.find((p) => p.id === body.pathId)?.label ||
    pack.title;

  const notesParts = [
    `Created from consult ${record.id} (${pack.title}).`,
    pathLabel ? `Path: ${pathLabel}.` : null,
    recommendation.notes ? `Staff note: ${recommendation.notes}` : null,
    screening.staffOverride
      ? `Screening override: ${screening.staffOverrideNote || "documented"}`
      : null,
    record.internal_notes ? `Consult notes: ${record.internal_notes}` : null,
  ].filter(Boolean);

  const { data: proposal, error: insertError } = await supabase
    .from("treatment_proposals")
    .insert({
      public_id: createPublicProposalId(),
      client_name: record.client_name,
      client_email: record.client_email,
      client_phone: record.client_phone,
      client_id: record.client_id || null,
      concerns: record.concern_tags || [],
      options,
      internal_notes: notesParts.join(" "),
      created_by: session.email || "owner",
      status: "draft",
    })
    .select("*")
    .single();

  if (insertError || !proposal) {
    return NextResponse.json({ error: insertError?.message || "Failed to create proposal." }, { status: 500 });
  }

  const nextRecommendation: ConsultRecommendation = {
    ...recommendation,
    pathId: recommendation.pathId || body.pathId || pack.paths[0]?.id,
    pathLabel,
    serviceIds,
  };

  const { data: updatedConsult, error: linkError } = await supabase
    .from("treatment_consults")
    .update({
      proposal_id: proposal.id,
      status: "proposed",
      recommendation: nextRecommendation,
      screening:
        body.forceOverride && !screeningAllowsPropose(screening)
          ? {
              ...screening,
              staffOverride: true,
              staffOverrideNote: String(body.overrideNote || screening.staffOverrideNote || "Forced at propose").trim(),
            }
          : screening,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (linkError) {
    return NextResponse.json(
      {
        error: `Proposal created but consult link failed: ${linkError.message}`,
        proposalId: proposal.id,
        proposal,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    proposalId: proposal.id,
    proposal,
    consult: updatedConsult,
  });
}
