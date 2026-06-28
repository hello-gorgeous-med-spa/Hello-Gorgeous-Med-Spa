/**
 * Hims-compete Phase 1 — longitudinal weight tracking for My RX.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { computeBmi } from "@/lib/glp1-intake";
import { normalizePatientEmail } from "@/lib/rx-secure-messages";

export type RxWeightLogSource = "intake" | "refill" | "portal" | "backfill";

export type RxWeightLogEntry = {
  id: string;
  weightLbs: number;
  recordedAt: string;
  source: RxWeightLogSource;
  bmi: number | null;
};

export type RxWeightProgress = {
  entries: RxWeightLogEntry[];
  startWeightLbs: number | null;
  currentWeightLbs: number | null;
  goalWeightLbs: number | null;
  changeLbs: number | null;
  entryCount: number;
};

function parseWeightLbs(raw: unknown): number | null {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 50 || n > 800) return null;
  return Math.round(n * 10) / 10;
}

function mapRow(row: {
  id: string;
  weight_lbs: number;
  recorded_at: string;
  source: string;
  bmi: number | null;
}): RxWeightLogEntry {
  return {
    id: row.id,
    weightLbs: Number(row.weight_lbs),
    recordedAt: row.recorded_at,
    source: row.source as RxWeightLogSource,
    bmi: row.bmi != null ? Number(row.bmi) : null,
  };
}

export async function recordRxWeightLog(
  admin: SupabaseClient,
  opts: {
    clientId?: string | null;
    patientEmail: string;
    weightLbs: number;
    source: RxWeightLogSource;
    submissionId?: string | null;
    heightFt?: unknown;
    heightIn?: unknown;
    bmi?: number | null;
    notes?: string | null;
    recordedAt?: string;
  },
): Promise<{ ok: boolean; error?: string }> {
  const email = normalizePatientEmail(opts.patientEmail);
  const weight = parseWeightLbs(opts.weightLbs);
  if (!email.includes("@") || weight == null) {
    return { ok: false, error: "Invalid weight or email" };
  }

  let bmi = opts.bmi ?? null;
  if (bmi == null && opts.heightFt != null) {
    bmi = computeBmi(
      Number(opts.heightFt),
      Number(opts.heightIn ?? 0),
      weight,
    );
  }

  const since = new Date(Date.now() - 86400000).toISOString();
  const dupQuery = admin
    .from("hg_rx_weight_logs")
    .select("id")
    .eq("patient_email", email)
    .eq("weight_lbs", weight)
    .eq("source", opts.source)
    .gte("recorded_at", since)
    .limit(1);

  if (opts.submissionId) {
    dupQuery.eq("submission_id", opts.submissionId);
  }

  const { data: dup } = await dupQuery;
  if (dup?.length) return { ok: true };

  const { error } = await admin.from("hg_rx_weight_logs").insert({
    client_id: opts.clientId || null,
    patient_email: email,
    weight_lbs: weight,
    source: opts.source,
    submission_id: opts.submissionId || null,
    bmi,
    notes: opts.notes?.trim() || null,
    recorded_at: opts.recordedAt || new Date().toISOString(),
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function recordRxWeightFromSubmission(
  admin: SupabaseClient,
  opts: {
    clientId?: string | null;
    submissionId: string;
    patientEmail: string;
    responses: Record<string, unknown>;
    source: "intake" | "refill";
    submittedAt?: string;
  },
): Promise<void> {
  const weight = parseWeightLbs(opts.responses.weight_lbs);
  if (weight == null) return;

  await recordRxWeightLog(admin, {
    clientId: opts.clientId,
    patientEmail: opts.patientEmail,
    weightLbs: weight,
    source: opts.source,
    submissionId: opts.submissionId,
    heightFt: opts.responses.height_ft,
    heightIn: opts.responses.height_in,
    bmi: parseWeightLbs(opts.responses.bmi) ?? null,
    recordedAt: opts.submittedAt,
  });
}

export async function loadRxWeightProgress(
  admin: SupabaseClient,
  clientId: string,
  patientEmail: string,
  limit = 24,
): Promise<RxWeightProgress> {
  const email = normalizePatientEmail(patientEmail);

  const { data: rows } = await admin
    .from("hg_rx_weight_logs")
    .select("id, weight_lbs, recorded_at, source, bmi")
    .or(`client_id.eq.${clientId},patient_email.eq.${email}`)
    .order("recorded_at", { ascending: true })
    .limit(limit);

  const entries = ((rows ?? []) as Parameters<typeof mapRow>[0][]).map(mapRow);
  const startWeightLbs = entries[0]?.weightLbs ?? null;
  const currentWeightLbs = entries.length ? entries[entries.length - 1].weightLbs : null;
  const changeLbs =
    startWeightLbs != null && currentWeightLbs != null
      ? Math.round((currentWeightLbs - startWeightLbs) * 10) / 10
      : null;

  const { data: goalRow } = await admin
    .from("hg_rx_weight_goals")
    .select("goal_weight_lbs")
    .eq("client_id", clientId)
    .maybeSingle();

  return {
    entries,
    startWeightLbs,
    currentWeightLbs,
    goalWeightLbs: goalRow?.goal_weight_lbs != null ? Number(goalRow.goal_weight_lbs) : null,
    changeLbs,
    entryCount: entries.length,
  };
}

export async function upsertRxWeightGoal(
  admin: SupabaseClient,
  clientId: string,
  goalWeightLbs: number,
): Promise<{ ok: boolean; error?: string }> {
  const goal = parseWeightLbs(goalWeightLbs);
  if (goal == null) return { ok: false, error: "Invalid goal weight" };

  const { error } = await admin.from("hg_rx_weight_goals").upsert({
    client_id: clientId,
    goal_weight_lbs: goal,
    updated_at: new Date().toISOString(),
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Seed logs from prior GLP-1 submissions when table is empty for this client. */
export async function backfillRxWeightLogsFromSubmissions(
  admin: SupabaseClient,
  clientId: string,
  patientEmail: string,
): Promise<void> {
  const email = normalizePatientEmail(patientEmail);

  const { count } = await admin
    .from("hg_rx_weight_logs")
    .select("id", { count: "exact", head: true })
    .or(`client_id.eq.${clientId},patient_email.eq.${email}`);

  if ((count ?? 0) > 0) return;

  const { data: templates } = await admin
    .from("hg_form_templates")
    .select("id, slug")
    .or("slug.eq.glp1-weight-loss-intake,slug.eq.glp1-refill-request");

  const templateIds = (templates ?? []).map((t) => t.id);
  if (!templateIds.length) return;

  const templateSlugById = new Map((templates ?? []).map((t) => [t.id, t.slug as string]));

  const { data: subs } = await admin
    .from("hg_form_submissions")
    .select("id, submitted_at, client_id, template_id, responses_json")
    .in("template_id", templateIds)
    .eq("client_id", clientId)
    .order("submitted_at", { ascending: true })
    .limit(40);

  for (const sub of subs ?? []) {
    const responses = (sub.responses_json as Record<string, unknown>) ?? {};
    const formEmail = normalizePatientEmail(String(responses.email || email));

    const slug = templateSlugById.get((sub as { template_id: string }).template_id) ?? "";
    const source = slug.includes("refill") ? "refill" : "intake";

    await recordRxWeightFromSubmission(admin, {
      clientId: sub.client_id ?? clientId,
      submissionId: sub.id as string,
      patientEmail: formEmail || email,
      responses,
      source,
      submittedAt: (sub as { submitted_at?: string }).submitted_at,
    });
  }
}
