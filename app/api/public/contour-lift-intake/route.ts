import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { CL_INTAKE_VERSION } from "@/lib/contour-clinical/form-versions";
import { clIntakeAnswersV1Schema } from "@/lib/contour-clinical/intake-answers.zod";
import { collectContraindicationYesList } from "@/lib/contour-clinical/intake-contraindications";
import { hashIntakeRequestMeta, verifyClIntakeToken } from "@/lib/contour-clinical/intake-hmac";
import { logClinicalAudit } from "@/lib/contour-clinical/audit";
import type { ClQuantumStatus } from "@/lib/contour-clinical/case-status";

export const dynamic = "force-dynamic";

function clientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "";
  return request.headers.get("x-real-ip") || "";
}

function nextStatusAfterIntake(
  current: string,
  requiresReview: boolean
): ClQuantumStatus | null {
  const keep: ClQuantumStatus[] = [
    "consent_signed",
    "scheduled",
    "treated",
    "followup_needed",
    "completed",
  ];
  if (keep.includes(current as ClQuantumStatus)) return null;
  if (requiresReview) return "needs_review";
  return "candidate";
}

/**
 * GET — validate signed link; return prefill + whether intake already submitted.
 * Query: case, exp, sig
 */
export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get("case");
  const exp = searchParams.get("exp");
  const sig = searchParams.get("sig");
  if (!caseId || !exp || !sig) {
    return NextResponse.json({ error: "Missing case, exp, or sig" }, { status: 400 });
  }
  const expN = Number(exp);
  if (!Number.isFinite(expN) || !verifyClIntakeToken(caseId, expN, sig)) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }

  const { data: row, error } = await supabase
    .from("cl_quantum_cases")
    .select("id, email, full_name, phone, status")
    .eq("id", caseId)
    .maybeSingle();
  if (error || !row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: submitted } = await supabase
    .from("cl_intake_forms")
    .select("id, submitted_at, requires_provider_review")
    .eq("case_id", caseId)
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    case: {
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      phone: row.phone,
      status: row.status,
    },
    already_submitted: Boolean(submitted?.submitted_at),
    intake_flags: submitted
      ? {
          requires_provider_review: submitted.requires_provider_review,
          submitted_at: submitted.submitted_at,
        }
      : null,
  });
}

/**
 * POST — submit clinical intake (signed link required).
 */
export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as
    | { case?: string; exp?: number | string; sig?: string; answers?: unknown }
    | null;
  if (!body?.case || body.exp == null || !body.sig || !body.answers) {
    return NextResponse.json({ error: "case, exp, sig, and answers are required" }, { status: 400 });
  }

  const caseId = String(body.case);
  const expN = Number(body.exp);
  if (!verifyClIntakeToken(caseId, expN, String(body.sig))) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
  }

  const parsed = clIntakeAnswersV1Schema.safeParse(body.answers);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid intake data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const answers = parsed.data;

  const { data: caseRow, error: ce } = await supabase
    .from("cl_quantum_cases")
    .select("id, email, client_id, lead_id, status")
    .eq("id", caseId)
    .single();
  if (ce || !caseRow) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const caseEmail = String(caseRow.email).trim().toLowerCase();
  if (answers.email !== caseEmail) {
    return NextResponse.json(
      { error: "Email must match the care team link; use the email on file for this request." },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("cl_intake_forms")
    .select("id")
    .eq("case_id", caseId)
    .not("submitted_at", "is", null)
    .limit(1)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "Intake was already submitted for this case" }, { status: 409 });
  }

  const { list, requiresProviderReview } = collectContraindicationYesList(answers as Record<string, unknown>);
  const now = new Date().toISOString();
  const ip = clientIp(request);
  const ua = (request.headers.get("user-agent") || "").slice(0, 512);
  const { ip_hash: ipHash, user_agent_hash: uaHash } = hashIntakeRequestMeta(ip, ua);

  let clientId: string | null = (caseRow.client_id as string | null) || null;
  if (!clientId) {
    const { data: clientMatch } = await supabase
      .from("clients")
      .select("id")
      .ilike("email", caseEmail)
      .limit(1)
      .maybeSingle();
    if (clientMatch?.id) clientId = clientMatch.id as string;
  }

  const { data: intakeRow, error: insE } = await supabase
    .from("cl_intake_forms")
    .insert({
      case_id: caseId,
      form_version: CL_INTAKE_VERSION,
      answers: answers as unknown as Record<string, unknown>,
      contraindication_yes_list: list,
      requires_provider_review: requiresProviderReview,
      submitted_at: now,
      submitted_by_client: true,
      ip_hash: ipHash,
      user_agent_hash: uaHash,
    })
    .select("id")
    .single();

  if (insE || !intakeRow) {
    console.error("[contour-lift-intake]", insE);
    return NextResponse.json({ error: "Failed to save intake" }, { status: 500 });
  }

  const nextSt = nextStatusAfterIntake(String(caseRow.status), requiresProviderReview);
  const caseUpdates: Record<string, unknown> = {
    updated_at: now,
    full_name: answers.full_name,
    phone: answers.phone,
  };
  if (clientId) {
    caseUpdates.client_id = clientId;
  }
  if (nextSt) {
    caseUpdates.status = nextSt;
  }

  const { error: upE } = await supabase.from("cl_quantum_cases").update(caseUpdates).eq("id", caseId);
  if (upE) {
    console.error("[contour-lift-intake] case update", upE);
  }

  const leadId = (caseRow as { lead_id?: string | null }).lead_id;
  if (leadId && clientId) {
    await supabase
      .from("leads")
      .update({ client_id: clientId, converted_to_client: true })
      .eq("id", leadId);
  }

  await logClinicalAudit(supabase, {
    caseId,
    action: "intake.submitted",
    entityType: "cl_intake_forms",
    entityId: intakeRow.id,
    actorUserId: "public_intake",
    summary: {
      form_version: CL_INTAKE_VERSION,
      requires_provider_review: requiresProviderReview,
      contraindication_hits: list.length,
    },
  });

  return NextResponse.json({
    ok: true,
    requires_provider_review: requiresProviderReview,
  });
}
