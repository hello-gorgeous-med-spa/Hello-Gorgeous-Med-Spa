import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  RX_INTAKE_SLUGS,
  buildCopyPackFromSubmission,
  defaultDispatchFromIntake,
  intakeTrackFromSlug,
  type RxDispatchStatus,
  type RxPharmacy,
  type RxShipTo,
} from "@/lib/rx-dispatch";
import { notifyPatientIntakeRxShipped } from "@/lib/rx-intake-ship-notify";
import { intakeRefFromToken } from "@/lib/rx-submission-context";

export const dynamic = "force-dynamic";

const VALID_STATUS = new Set<RxDispatchStatus>(["new", "reviewed", "approved", "sent"]);
const VALID_PHARMACY = new Set<RxPharmacy>(["formulation", "boomrx"]);
const VALID_SHIP = new Set<RxShipTo>(["patient", "clinic"]);

type RouteParams = { params: Promise<{ submissionId: string }> };

async function loadSubmission(
  admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>,
  submissionId: string,
) {
  const { data, error } = await admin
    .from("hg_form_submissions")
    .select(
      "id, signer_name, client_phone, access_token, responses_json, template:hg_form_templates(slug)",
    )
    .eq("id", submissionId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const slug = (data as { template?: { slug?: string } }).template?.slug ?? "";
  if (!RX_INTAKE_SLUGS.includes(slug as (typeof RX_INTAKE_SLUGS)[number])) {
    return null;
  }

  return {
    id: data.id as string,
    slug,
    signer_name: data.signer_name as string | null,
    client_phone: data.client_phone as string | null,
    access_token: data.access_token as string | null,
    responses_json: (data.responses_json ?? {}) as Record<string, unknown>,
  };
}

/** GET /api/admin/rx-dispatch/[submissionId]?portal=formulation|boomrx — copy pack text */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { submissionId } = await params;
  const portalRaw = req.nextUrl.searchParams.get("portal");
  const portal: RxPharmacy = portalRaw === "boomrx" ? "boomrx" : "formulation";

  let submission;
  try {
    submission = await loadSubmission(admin, submissionId);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  if (!submission) {
    return NextResponse.json({ error: "Intake not found" }, { status: 404 });
  }

  const { data: dispatchRow } = await admin
    .from("hg_rx_dispatch")
    .select("*")
    .eq("submission_id", submissionId)
    .maybeSingle();

  const defaults = defaultDispatchFromIntake({
    slug: submission.slug,
    signerName: submission.signer_name,
    responses: submission.responses_json,
  });

  const dispatch = dispatchRow ? { ...defaults, ...dispatchRow } : defaults;
  const intakeRef = submission.access_token?.slice(0, 8).toUpperCase();

  const text = buildCopyPackFromSubmission({
    slug: submission.slug,
    signerName: submission.signer_name,
    clientPhone: submission.client_phone,
    responses: submission.responses_json,
    dispatch,
    portal,
    intakeRef,
  });

  return NextResponse.json({ text, portal });
}

/** PATCH /api/admin/rx-dispatch/[submissionId] — save workflow + pharmacy fields */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { submissionId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let submission;
  try {
    submission = await loadSubmission(admin, submissionId);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  if (!submission) {
    return NextResponse.json({ error: "Intake not found" }, { status: 404 });
  }

  const { data: priorRow } = await admin
    .from("hg_rx_dispatch")
    .select("status, staff_notes")
    .eq("submission_id", submissionId)
    .maybeSingle();
  const priorStatus = priorRow?.status as RxDispatchStatus | undefined;

  const patch: Record<string, unknown> = {
    submission_id: submissionId,
    updated_at: new Date().toISOString(),
    updated_by: auth.user.email,
  };

  if (typeof body.status === "string" && VALID_STATUS.has(body.status as RxDispatchStatus)) {
    patch.status = body.status;
  }
  if (body.pharmacy === null) {
    patch.pharmacy = null;
  } else if (typeof body.pharmacy === "string" && VALID_PHARMACY.has(body.pharmacy as RxPharmacy)) {
    patch.pharmacy = body.pharmacy;
  }
  if (typeof body.ship_to === "string" && VALID_SHIP.has(body.ship_to as RxShipTo)) {
    patch.ship_to = body.ship_to;
  }

  for (const key of [
    "address_line1",
    "address_line2",
    "city",
    "state",
    "zip",
    "drug",
    "sig",
    "staff_notes",
  ] as const) {
    if (typeof body[key] === "string") {
      patch[key] = body[key];
    }
  }

  const { data, error } = await admin
    .from("hg_rx_dispatch")
    .upsert(patch, { onConflict: "submission_id" })
    .select("*")
    .single();

  if (error) {
    if (error.code === "42P01") {
      return NextResponse.json(
        {
          error:
            "RX Dispatch table not installed yet. Run the Supabase migration 20260624120000_rx_dispatch.sql.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const newStatus = data.status as RxDispatchStatus;
  if (newStatus === "sent" && priorStatus !== "sent") {
    const patientName =
      submission.signer_name ||
      glp1SignerNameFromResponses(submission.responses_json) ||
      "Patient";
    const phone =
      submission.client_phone ||
      String(submission.responses_json.phone || submission.responses_json.client_phone || "");
    void notifyPatientIntakeRxShipped({
      phone,
      patientName,
      intakeRef: intakeRefFromToken(submission.access_token),
      staffNotes: data.staff_notes as string | null,
      track: intakeTrackFromSlug(submission.slug),
    });
  }

  return NextResponse.json({ ok: true, dispatch: data });
}

function glp1SignerNameFromResponses(responses: Record<string, unknown>): string | null {
  const name = String(responses.full_name || responses.name || "").trim();
  return name || null;
}
