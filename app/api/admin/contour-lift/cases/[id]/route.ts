import { NextRequest, NextResponse } from "next/server";
import { withAnyPermission } from "@/lib/api-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { logClinicalAudit } from "@/lib/contour-clinical/audit";
import { isClQuantumStatus } from "@/lib/contour-clinical/case-status";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = withAnyPermission(request, ["clients.view"]);
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { data: c, error: ce } = await supabase.from("cl_quantum_cases").select("*").eq("id", id).single();
  if (ce || !c) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [intake, consents, treatments, photos, postcare, leadRes] = await Promise.all([
    supabase
      .from("cl_intake_forms")
      .select(
        "id, form_version, answers, contraindication_yes_list, requires_provider_review, submitted_at, submitted_by_client, created_at"
      )
      .eq("case_id", id)
      .order("submitted_at", { ascending: false, nullsFirst: false })
      .limit(5),
    supabase
      .from("cl_consent_records")
      .select("id, consent_type, form_version, patient_signed_at, created_at")
      .eq("case_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("cl_treatment_records")
      .select("id, record_type, form_version, completed_at, created_at")
      .eq("case_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("cl_procedure_photos")
      .select("id, category, taken_at, internal_only, marketing_approved, created_at")
      .eq("case_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("cl_postcare_deliveries")
      .select("id, channel, sent_at, template_version, created_at")
      .eq("case_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
    c.lead_id
      ? supabase
          .from("leads")
          .select("id, source, lead_type, metadata, created_at, utm_source, utm_medium, utm_campaign")
          .eq("id", c.lead_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return NextResponse.json({
    case: c,
    lead: leadRes.data,
    intake: intake.data ?? [],
    consents: consents.data ?? [],
    treatments: treatments.data ?? [],
    photos: photos.data ?? [],
    postcare: postcare.data ?? [],
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = withAnyPermission(request, ["clients.edit"]);
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.status === "string" && isClQuantumStatus(body.status)) {
    updates.status = body.status;
  }
  if (body.scheduled_at === null) updates.scheduled_at = null;
  if (typeof body.scheduled_at === "string") updates.scheduled_at = body.scheduled_at;
  if (typeof body.admin_notes_internal === "string") updates.admin_notes_internal = body.admin_notes_internal;
  if (typeof body.client_id === "string" || body.client_id === null) {
    updates.client_id = body.client_id;
  }
  if (typeof body.model_event_date === "string" || body.model_event_date === null) {
    updates.model_event_date = body.model_event_date;
  }

  const { data, error } = await supabase
    .from("cl_quantum_cases")
    .update(updates)
    .eq("id", id)
    .select("id, status, updated_at, scheduled_at, client_id, admin_notes_internal")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await logClinicalAudit(supabase, {
    caseId: id,
    action: "case.update",
    entityType: "cl_quantum_cases",
    entityId: id,
    actorUserId: auth.user.id,
    summary: { fields: Object.keys(updates) },
  });

  return NextResponse.json({ case: data });
}
