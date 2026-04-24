import { NextRequest, NextResponse } from "next/server";
import { withAnyPermission } from "@/lib/api-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { logClinicalAudit } from "@/lib/contour-clinical/audit";
import { CL_PROCEDURE_TYPE } from "@/lib/contour-clinical/form-versions";
/**
 * GET — list Contour/Quantum cases (leads in pipeline)
 * POST — create case from lead_id, or manual email/name
 */
export async function GET(request: NextRequest) {
  const auth = withAnyPermission(request, ["clients.view"]);
  if ("error" in auth) return auth.error;

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  let query = supabase
    .from("cl_quantum_cases")
    .select(
      "id, created_at, updated_at, lead_id, client_id, email, phone, full_name, status, scheduled_at, model_event_date, admin_notes_internal"
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) {
    query = query.eq("status", status);
  }
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const cases = data ?? [];
  const ids = cases.map((c) => c.id);
  const intakeByCase: Record<
    string,
    { has_submission: boolean; requires_provider_review: boolean | null; submitted_at: string | null }
  > = {};
  if (ids.length > 0) {
    const { data: intakes } = await supabase
      .from("cl_intake_forms")
      .select("case_id, submitted_at, requires_provider_review, created_at")
      .in("case_id", ids);
    for (const row of intakes || []) {
      const cid = row.case_id as string;
      const prev = intakeByCase[cid];
      const st = row.submitted_at as string | null;
      if (!st) continue;
      if (!prev || st > (prev.submitted_at || "")) {
        intakeByCase[cid] = {
          has_submission: true,
          requires_provider_review: row.requires_provider_review as boolean,
          submitted_at: st,
        };
      }
    }
  }
  return NextResponse.json({
    cases: cases.map((c) => ({
      ...c,
      intake: intakeByCase[c.id] ?? { has_submission: false, requires_provider_review: null, submitted_at: null },
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = withAnyPermission(request, ["clients.edit"]);
  if ("error" in auth) return auth.error;

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as
    | { lead_id?: string; client_id?: string; email?: string; full_name?: string; phone?: string }
    | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let email = (body.email || "").trim().toLowerCase();
  let fullName = (body.full_name || "").trim() || null;
  let phone = (body.phone || "").trim() || null;
  let leadId: string | null = body.lead_id || null;
  let clientId: string | null = body.client_id || null;

  if (leadId) {
    const { data: lead, error: le } = await supabase.from("leads").select("*").eq("id", leadId).single();
    if (le || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    const { data: dupe } = await supabase
      .from("cl_quantum_cases")
      .select("id")
      .eq("lead_id", leadId)
      .maybeSingle();
    if (dupe) {
      return NextResponse.json({ error: "Case already exists for this lead", case_id: dupe.id }, { status: 409 });
    }
    email = (lead.email as string).toLowerCase();
    fullName = (lead.full_name as string) || fullName;
    phone = (lead.phone as string) || phone;
    clientId = (lead.client_id as string) || clientId;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const { data: row, error: ins } = await supabase
    .from("cl_quantum_cases")
    .insert({
      lead_id: leadId,
      client_id: clientId,
      email,
      phone,
      full_name: fullName,
      status: "new_inquiry",
      procedure_type: CL_PROCEDURE_TYPE,
      model_event_date: "2026-05-04",
      created_by_user_id: auth.user.id,
    })
    .select("id, created_at, status, email, lead_id, client_id")
    .single();

  if (ins) {
    return NextResponse.json({ error: ins.message }, { status: 500 });
  }

  await logClinicalAudit(supabase, {
    caseId: row.id,
    action: "case.create",
    entityType: "cl_quantum_cases",
    entityId: row.id,
    actorUserId: auth.user.id,
    summary: { lead_id: leadId ?? null },
  });

  return NextResponse.json({ case: row });
}
