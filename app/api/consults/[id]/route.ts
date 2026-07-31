import { NextRequest, NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { evaluateConsultScreening } from "@/lib/consults/screening";
import type {
  ConsultEducationProgress,
  ConsultRecommendation,
  ConsultScreening,
  ConsultStatus,
  ConsultVertical,
} from "@/lib/consults/types";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const STATUSES: ConsultStatus[] = [
  "open",
  "screening",
  "educated",
  "proposed",
  "closed",
  "disqualified",
];

export async function GET(_: NextRequest, context: RouteContext) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Consult id is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data, error } = await supabase.from("treatment_consults").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  return NextResponse.json({ consult: data });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Consult id is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data: existing, error: loadError } = await supabase
    .from("treatment_consults")
    .select("*")
    .eq("id", id)
    .single();
  if (loadError || !existing) {
    return NextResponse.json({ error: loadError?.message || "Consult not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};

  if (typeof body.clientName === "string" && body.clientName.trim()) {
    patch.client_name = body.clientName.trim();
  }
  if (body.clientEmail !== undefined) {
    patch.client_email = body.clientEmail ? String(body.clientEmail).trim() : null;
  }
  if (body.clientPhone !== undefined) {
    patch.client_phone = body.clientPhone ? String(body.clientPhone).trim() : null;
  }
  if (Array.isArray(body.concernTags)) {
    patch.concern_tags = body.concernTags.map(String);
  }
  if (typeof body.internalNotes === "string") {
    patch.internal_notes = body.internalNotes.trim() || null;
  }
  if (body.status && STATUSES.includes(body.status)) {
    patch.status = body.status;
  }

  if (body.screening && typeof body.screening === "object") {
    const incoming = body.screening as ConsultScreening;
    const answers = (incoming.answers || {}) as Record<string, unknown>;
    const result = evaluateConsultScreening(existing.vertical as ConsultVertical, answers);
    const screening: ConsultScreening = {
      answers,
      result,
      staffOverride: Boolean(incoming.staffOverride),
      staffOverrideNote:
        typeof incoming.staffOverrideNote === "string" ? incoming.staffOverrideNote.trim() : undefined,
      completedAt: new Date().toISOString(),
    };
    patch.screening = screening;

    if (!screening.result?.qualified && !screening.staffOverride) {
      patch.status = "disqualified";
    } else if (existing.status === "open" || existing.status === "disqualified") {
      patch.status = "screening";
    }
  }

  if (body.educationProgress && typeof body.educationProgress === "object") {
    const edu = body.educationProgress as ConsultEducationProgress;
    patch.education_progress = {
      coveredSlideIds: Array.isArray(edu.coveredSlideIds) ? edu.coveredSlideIds.map(String) : [],
      currentSlideId: edu.currentSlideId ? String(edu.currentSlideId) : undefined,
      completedAt: edu.completedAt || undefined,
    };
    if (
      Array.isArray(edu.coveredSlideIds) &&
      edu.coveredSlideIds.length > 0 &&
      (existing.status === "screening" || existing.status === "open")
    ) {
      patch.status = "educated";
    }
  }

  if (body.recommendation && typeof body.recommendation === "object") {
    const rec = body.recommendation as ConsultRecommendation;
    patch.recommendation = {
      pathId: rec.pathId ? String(rec.pathId) : undefined,
      pathLabel: rec.pathLabel ? String(rec.pathLabel) : undefined,
      notes: typeof rec.notes === "string" ? rec.notes.trim() : undefined,
      serviceIds: Array.isArray(rec.serviceIds) ? rec.serviceIds.map(String) : [],
    };
  }

  if (!Object.keys(patch).length) {
    return NextResponse.json({ consult: existing });
  }

  const { data, error } = await supabase
    .from("treatment_consults")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ consult: data });
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Consult id is required." }, { status: 400 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { error } = await supabase.from("treatment_consults").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
