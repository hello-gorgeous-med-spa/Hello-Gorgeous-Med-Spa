/**
 * Resolve RX form submission context for checkout, ledger, and status.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { normalizeIntakeRef, normalizePatientEmail } from "@/lib/rx-secure-messages";

export type RxSubmissionContext = {
  submissionId: string;
  intakeRef: string;
  accessToken: string | null;
  clientId: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  slug: string | null;
  responses: Record<string, unknown>;
  submittedAt: string;
};

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

export function intakeRefFromToken(token: string | null | undefined): string {
  if (!token) return "";
  return token.slice(0, 8).toUpperCase();
}

export async function loadSubmissionById(
  admin: SupabaseClient,
  submissionId: string,
): Promise<RxSubmissionContext | null> {
  const id = submissionId.trim();
  if (!id) return null;

  const { data: row } = await admin
    .from("hg_form_submissions")
    .select(
      "id, submitted_at, signer_name, client_phone, client_id, access_token, responses_json, template_id",
    )
    .eq("id", id)
    .maybeSingle();

  if (!row) return null;
  const slug = await templateSlug(admin, row.template_id);
  return mapSubmission(row as SubmissionRow, slug);
}

export async function loadSubmissionByIntakeRef(
  admin: SupabaseClient,
  intakeRef: string,
  email?: string,
): Promise<RxSubmissionContext | null> {
  const ref = normalizeIntakeRef(intakeRef);
  if (!ref || ref.length < 6) return null;

  const { data: rows } = await admin
    .from("hg_form_submissions")
    .select(
      "id, submitted_at, signer_name, client_phone, client_id, access_token, responses_json, template_id",
    )
    .ilike("access_token", `${ref.toLowerCase()}%`)
    .order("submitted_at", { ascending: false })
    .limit(20);

  if (!rows?.length) return null;

  const patientEmail = email ? normalizePatientEmail(email) : null;
  const match =
    patientEmail != null
      ? (rows as SubmissionRow[]).find((row) => {
          const formEmail = normalizePatientEmail(String(row.responses_json?.email || ""));
          return formEmail === patientEmail;
        })
      : ((rows as SubmissionRow[])[0] ?? null);

  if (!match) return null;

  const slug = await templateSlug(admin, match.template_id);
  return mapSubmission(match, slug);
}

async function templateSlug(admin: SupabaseClient, templateId: string): Promise<string | null> {
  const { data } = await admin
    .from("hg_form_templates")
    .select("slug")
    .eq("id", templateId)
    .maybeSingle();
  return data?.slug ?? null;
}

function mapSubmission(
  row: SubmissionRow,
  slug: string | null,
): RxSubmissionContext {
  const responses = row.responses_json ?? {};
  return {
    submissionId: row.id,
    intakeRef: intakeRefFromToken(row.access_token),
    accessToken: row.access_token,
    clientId: row.client_id,
    clientName: row.signer_name,
    clientEmail: String(responses.email || "").trim() || null,
    clientPhone: row.client_phone || String(responses.phone || "").trim() || null,
    slug,
    responses,
    submittedAt: row.submitted_at,
  };
}

export async function resolveRxSubmissionContext(
  admin: SupabaseClient,
  opts: { submissionId?: string | null; intakeRef?: string | null; email?: string | null },
): Promise<RxSubmissionContext | null> {
  if (opts.submissionId?.trim()) {
    return loadSubmissionById(admin, opts.submissionId);
  }
  if (opts.intakeRef?.trim()) {
    return loadSubmissionByIntakeRef(admin, opts.intakeRef, opts.email ?? undefined);
  }
  return null;
}
