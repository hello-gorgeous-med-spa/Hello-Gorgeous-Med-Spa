/**
 * POST — one-tap SMS to a warm RX lead from Oswego command center.
 */

import { NextRequest, NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { sendSms } from "@/lib/notifications/sms-outbound";
import {
  firstNameFromPatient,
  warmLeadSmsMessage,
  type WarmLeadSmsTrack,
} from "@/lib/oswego-warm-lead-sms";
import {
  RX_INTAKE_SLUGS,
  intakeDisplayName,
  intakeTrackFromSlug,
} from "@/lib/rx-dispatch";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { submissionId?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const submissionId = String(body.submissionId || "").trim();
  if (!submissionId) {
    return NextResponse.json({ error: "submissionId required" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { data: submission, error: subErr } = await admin
    .from("hg_form_submissions")
    .select("id, signer_name, client_phone, responses_json, template_id")
    .eq("id", submissionId)
    .maybeSingle();

  if (subErr || !submission) {
    return NextResponse.json({ error: "Intake not found" }, { status: 404 });
  }

  const { data: template } = await admin
    .from("hg_form_templates")
    .select("slug")
    .eq("id", submission.template_id)
    .maybeSingle();

  const slug = template?.slug ?? "";
  if (!RX_INTAKE_SLUGS.includes(slug as (typeof RX_INTAKE_SLUGS)[number])) {
    return NextResponse.json({ error: "Not an RX intake submission" }, { status: 400 });
  }

  const responses = (submission.responses_json ?? {}) as Record<string, unknown>;
  const phone =
    String(body.phone || "").trim() ||
    submission.client_phone ||
    String(responses.phone || "").trim();

  if (!phone) {
    return NextResponse.json({ error: "No phone number on file" }, { status: 400 });
  }

  const patientName = intakeDisplayName(slug, submission.signer_name, responses);
  const track = intakeTrackFromSlug(slug) as WarmLeadSmsTrack;
  const message = warmLeadSmsMessage(firstNameFromPatient(patientName), track);
  const result = await sendSms(phone, message);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "SMS failed", configured: false },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    to: result.to,
    track,
    messagePreview: message.slice(0, 120) + "…",
  });
}
