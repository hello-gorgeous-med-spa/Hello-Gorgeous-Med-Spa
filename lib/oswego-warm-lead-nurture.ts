/**
 * Auto-nurture warm RX leads at 24h and 72h if not yet dispatched.
 */

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { sendSms } from "@/lib/notifications/sms-outbound";
import {
  firstNameFromPatient,
  warmLeadNurtureMessage,
  type WarmLeadNurtureStage,
  type WarmLeadSmsTrack,
} from "@/lib/oswego-warm-lead-sms";
import {
  RX_INTAKE_SLUGS,
  intakeDisplayName,
  intakeTrackFromSlug,
  type RxDispatchStatus,
} from "@/lib/rx-dispatch";

export type WarmLeadNurtureResult = {
  ok: boolean;
  dryRun: boolean;
  sent24h: number;
  sent72h: number;
  skipped: number;
  failed: number;
  errors: string[];
  runAt: string;
};

type Candidate = {
  submissionId: string;
  phone: string;
  patientName: string;
  track: WarmLeadSmsTrack;
  stage: WarmLeadNurtureStage;
  submittedAt: Date;
};

function hoursSince(date: Date): number {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60);
}

export async function runWarmLeadNurture(options?: { dryRun?: boolean }): Promise<WarmLeadNurtureResult> {
  const dryRun = options?.dryRun ?? false;
  const result: WarmLeadNurtureResult = {
    ok: false,
    dryRun,
    sent24h: 0,
    sent72h: 0,
    skipped: 0,
    failed: 0,
    errors: [],
    runAt: new Date().toISOString(),
  };

  const admin = createAdminSupabaseClient();
  if (!admin) {
    result.errors.push("Supabase not configured");
    return result;
  }

  const since14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data: templates } = await admin
    .from("hg_form_templates")
    .select("id, slug")
    .in("slug", [...RX_INTAKE_SLUGS]);

  const templateIds = (templates ?? []).map((t: { id: string }) => t.id);
  if (templateIds.length === 0) {
    result.ok = true;
    return result;
  }

  const slugByTemplate = new Map(
    (templates ?? []).map((t: { id: string; slug: string }) => [t.id, t.slug]),
  );

  const { data: submissions } = await admin
    .from("hg_form_submissions")
    .select("id, submitted_at, signer_name, client_phone, responses_json, template_id")
    .in("template_id", templateIds)
    .gte("submitted_at", since14)
    .order("submitted_at", { ascending: true });

  const rows = submissions ?? [];
  if (rows.length === 0) {
    result.ok = true;
    return result;
  }

  const ids = rows.map((r: { id: string }) => r.id);

  const [{ data: dispatchRows }, { data: nurtureLogs }] = await Promise.all([
    admin.from("hg_rx_dispatch").select("submission_id, status").in("submission_id", ids),
    admin.from("hg_warm_lead_nurture_log").select("submission_id, stage").in("submission_id", ids),
  ]);

  const dispatchMap = new Map(
    (dispatchRows ?? []).map((d: { submission_id: string; status: RxDispatchStatus }) => [
      d.submission_id,
      d.status,
    ]),
  );

  const sentStages = new Set(
    (nurtureLogs ?? []).map(
      (n: { submission_id: string; stage: string }) => `${n.submission_id}:${n.stage}`,
    ),
  );

  const candidates: Candidate[] = [];

  for (const row of rows as Array<{
    id: string;
    submitted_at: string;
    signer_name: string | null;
    client_phone: string | null;
    responses_json: Record<string, unknown> | null;
    template_id: string;
  }>) {
    const status = dispatchMap.get(row.id) ?? "new";
    if (status === "sent") continue;

    const responses = row.responses_json ?? {};
    const phone =
      row.client_phone?.trim() || String(responses.phone || "").trim() || "";
    if (!phone) {
      result.skipped++;
      continue;
    }

    const submittedAt = new Date(row.submitted_at);
    const hours = hoursSince(submittedAt);
    const slug = slugByTemplate.get(row.template_id) ?? "";
    const track = intakeTrackFromSlug(slug) as WarmLeadSmsTrack;
    const patientName = intakeDisplayName(slug, row.signer_name, responses);

    if (hours >= 24 && hours < 48 && !sentStages.has(`${row.id}:24h`)) {
      candidates.push({
        submissionId: row.id,
        phone,
        patientName,
        track,
        stage: "24h",
        submittedAt,
      });
    } else if (hours >= 72 && !sentStages.has(`${row.id}:72h`)) {
      candidates.push({
        submissionId: row.id,
        phone,
        patientName,
        track,
        stage: "72h",
        submittedAt,
      });
    }
  }

  for (const c of candidates) {
    const message = warmLeadNurtureMessage(firstNameFromPatient(c.patientName), c.track, c.stage);

    if (dryRun) {
      if (c.stage === "24h") result.sent24h++;
      else result.sent72h++;
      continue;
    }

    const smsResult = await sendSms(c.phone, message);

    const { error: logErr } = await admin.from("hg_warm_lead_nurture_log").insert({
      submission_id: c.submissionId,
      stage: c.stage,
      sms_success: smsResult.success,
      phone: smsResult.to ?? c.phone,
    });

    if (logErr && !logErr.message.includes("duplicate")) {
      result.errors.push(logErr.message);
    }

    await admin.from("automation_logs").insert({
      automation_type: "warm_lead_nurture",
      success: smsResult.success,
      metadata: {
        submission_id: c.submissionId,
        stage: c.stage,
        track: c.track,
      },
    });

    if (smsResult.success) {
      if (c.stage === "24h") result.sent24h++;
      else result.sent72h++;
    } else {
      result.failed++;
      result.errors.push(`${c.phone}: ${smsResult.error}`);
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  result.ok = result.errors.length === 0 || result.sent24h + result.sent72h > 0;
  return result;
}
