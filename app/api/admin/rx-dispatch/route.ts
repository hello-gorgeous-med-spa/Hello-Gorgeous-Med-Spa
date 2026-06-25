import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  RX_INTAKE_SLUGS,
  defaultDispatchFromIntake,
  intakeDisplayName,
  intakeSummaryLines,
  intakeTrackFromSlug,
  type RxDispatchRecord,
} from "@/lib/rx-dispatch";

export const dynamic = "force-dynamic";

const RX_SLUG_SET = new Set<string>(RX_INTAKE_SLUGS);

type TemplateRow = { id: string; slug: string; title: string };

type SubmissionRow = {
  id: string;
  submitted_at: string;
  signer_name: string | null;
  client_phone: string | null;
  client_id: string | null;
  access_token: string | null;
  responses_json: Record<string, unknown> | null;
  template_id: string;
};

type DispatchRow = RxDispatchRecord;

function intakeRef(token: string | null): string {
  if (!token) return "";
  return token.slice(0, 8).toUpperCase();
}

/** GET /api/admin/rx-dispatch — peptide + GLP-1 intake queue */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const statusFilter = req.nextUrl.searchParams.get("status");
  const limit = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") || "50", 10)));

  const { data: templates, error: tmplErr } = await admin
    .from("hg_form_templates")
    .select("id, slug, title")
    .in("slug", [...RX_INTAKE_SLUGS]);

  if (tmplErr) {
    return NextResponse.json({ error: tmplErr.message }, { status: 500 });
  }

  const templateById = new Map((templates as TemplateRow[]).map((t) => [t.id, t]));
  const templateIds = Array.from(templateById.keys());
  if (templateIds.length === 0) {
    return NextResponse.json({ items: [], templates: [] });
  }

  const { data: submissions, error: subErr } = await admin
    .from("hg_form_submissions")
    .select(
      "id, submitted_at, signer_name, client_phone, client_id, access_token, responses_json, template_id",
    )
    .in("template_id", templateIds)
    .order("submitted_at", { ascending: false })
    .limit(limit);

  if (subErr) {
    return NextResponse.json({ error: subErr.message }, { status: 500 });
  }

  const rows = (submissions ?? []) as SubmissionRow[];
  const submissionIds = rows.map((r) => r.id);

  let dispatchBySubmission = new Map<string, DispatchRow>();
  if (submissionIds.length > 0) {
    const { data: dispatchRows, error: dispErr } = await admin
      .from("hg_rx_dispatch")
      .select("*")
      .in("submission_id", submissionIds);

    if (dispErr && dispErr.code !== "42P01") {
      console.error("[rx-dispatch] load dispatch", dispErr.message);
    } else if (dispatchRows) {
      dispatchBySubmission = new Map(
        (dispatchRows as DispatchRow[]).map((d) => [d.submission_id, d]),
      );
    }
  }

  const items = rows
    .map((row) => {
      const template = templateById.get(row.template_id);
      const slug = template?.slug ?? "";
      if (!RX_SLUG_SET.has(slug)) return null;

      const responses = row.responses_json ?? {};
      const existing = dispatchBySubmission.get(row.id);
      const defaults = defaultDispatchFromIntake({
        slug,
        signerName: row.signer_name,
        responses,
      });
      const dispatch = existing
        ? { ...defaults, ...existing, submission_id: row.id }
        : { ...defaults, submission_id: row.id };

      return {
        submissionId: row.id,
        submittedAt: row.submitted_at,
        intakeRef: intakeRef(row.access_token),
        slug,
        templateTitle: template?.title ?? slug,
        track: intakeTrackFromSlug(slug),
        patientName: intakeDisplayName(slug, row.signer_name, responses),
        phone: row.client_phone || String(responses.phone || "") || null,
        email: String(responses.email || "") || null,
        qualified: responses.qualified === true,
        summary: intakeSummaryLines(slug, responses),
        responses,
        dispatch,
      };
    })
    .filter(Boolean) as Array<{
    submissionId: string;
    dispatch: RxDispatchRecord;
    [key: string]: unknown;
  }>;

  const filtered =
    statusFilter && statusFilter !== "all"
      ? items.filter((i) => i.dispatch.status === statusFilter)
      : items;

  return NextResponse.json({
    items: filtered,
    dispatchTableReady: dispatchBySubmission.size > 0 || submissionIds.length === 0,
  });
}
