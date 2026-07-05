/**
 * Public FlowWave landing-page intake → clients + hg_flowwave_intakes + staff alerts.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";
import {
  evaluateFlowWaveScreening,
  type FlowWaveIntakeData,
} from "@/lib/flowwave-focus";
import { insertFlowWaveIntake } from "@/lib/flowwave-intake";
import { notifyFlowWaveLeadFollowUp } from "@/lib/flowwave-intake-followup";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { resolveOrCreateClientForIntake } from "@/lib/resolveClientForIntake";
import { normalizeToE164 } from "@/lib/phone-e164";

export type FlowWavePublicIntakePayload = {
  fullName: string;
  phone: string;
  email: string;
  preferredLocation?: string;
  treatmentAreas?: string[];
  screeningFlags?: string[];
  notes?: string;
  consent?: boolean;
  hp?: string;
};

const SCREENING_MAP: Record<string, Partial<FlowWaveIntakeData>> = {
  pacemaker: { contra_pacemaker: true, contra_device: true },
  pregnant: { contra_pregnant: true },
  metal: { contra_metal: true },
  blood_thinners: { caut_bleed: true },
  cancer: { contra_cancer: true },
};

function text(v: unknown, max: number): string {
  return String(v ?? "")
    .trim()
    .slice(0, max);
}

function arr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => text(x, 120)).filter(Boolean);
}

export function parseFlowWavePublicIntake(body: unknown): FlowWavePublicIntakePayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const fullName = text(b.fullName, 160);
  const phone = text(b.phone, 40);
  const email = text(b.email, 220).toLowerCase();
  if (!fullName || !phone || !email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (b.consent !== true) return null;
  return {
    fullName,
    phone,
    email,
    preferredLocation: text(b.preferredLocation, 80) || undefined,
    treatmentAreas: arr(b.treatmentAreas),
    screeningFlags: arr(b.screeningFlags),
    notes: text(b.notes, 4000) || undefined,
    consent: true,
    hp: text(b.hp, 200) || undefined,
  };
}

export function buildFlowWaveIntakeData(payload: FlowWavePublicIntakePayload): FlowWaveIntakeData {
  const intakeData: FlowWaveIntakeData = {
    source: "public_landing",
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    preferred_location: payload.preferredLocation ?? "Oswego",
    treatment_areas: payload.treatmentAreas ?? [],
    complaint: payload.notes ?? "",
    session_notes: payload.notes ?? "",
    public_consent_at: new Date().toISOString(),
  };

  const areas = payload.treatmentAreas ?? [];
  intakeData.treatment_area =
    areas.length > 1 ? "Multiple areas" : areas[0] ?? null;

  for (const flag of payload.screeningFlags ?? []) {
    const mapped = SCREENING_MAP[flag];
    if (mapped) Object.assign(intakeData, mapped);
  }

  return intakeData;
}

async function upsertClientEmail(
  admin: SupabaseClient,
  clientId: string,
  email: string,
): Promise<void> {
  if (!email) return;
  await admin.from("clients").update({ email, updated_at: new Date().toISOString() }).eq("id", clientId);
}

export async function submitFlowWavePublicIntake(
  payload: FlowWavePublicIntakePayload,
): Promise<
  | { ok: true; intakeId: string; screening: string; clientId: string }
  | { ok: false; error: string; status: number }
> {
  if (payload.hp) {
    return { ok: true, intakeId: "spam", screening: "pending", clientId: "" };
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return { ok: false, error: "Service temporarily unavailable.", status: 503 };
  }

  const intakeData = buildFlowWaveIntakeData(payload);
  const screening = evaluateFlowWaveScreening(intakeData);

  const { clientId } = await resolveOrCreateClientForIntake(admin, {
    clientPhone: payload.phone,
    signerName: payload.fullName,
    source: "flowwave_landing",
  });

  if (!clientId) {
    return { ok: false, error: "Could not save your request. Please call us.", status: 500 };
  }

  await upsertClientEmail(admin, clientId, payload.email);

  const result = await insertFlowWaveIntake(
    {
      clientId,
      intakeData,
      status: screening.status === "draft" ? "cleared" : screening.status,
    },
    admin,
  );

  if ("error" in result) {
    return { ok: false, error: result.error, status: 500 };
  }

  const areas = (payload.treatmentAreas ?? []).join(", ") || "Not specified";
  const flags = (payload.screeningFlags ?? []).join(", ") || "None flagged";

  void alertStaffOnFormSubmission({
    formName: "FlowWave landing intake",
    emailSubject: `FlowWave screening — ${payload.fullName} (${screening.screeningResult})`,
    emailBody: [
      `New FlowWave intake from the public landing page.`,
      ``,
      `Name: ${payload.fullName}`,
      `Phone: ${normalizeToE164(payload.phone) || payload.phone}`,
      `Email: ${payload.email}`,
      `Location: ${payload.preferredLocation ?? "Oswego"}`,
      `Areas: ${areas}`,
      `Screening flags: ${flags}`,
      `Result: ${screening.screeningResult}`,
      `Notes: ${payload.notes || "—"}`,
      ``,
      `Admin: https://www.hellogorgeousmedspa.com/admin/flowwave/intake?client=${clientId}&intake=${result.row.id}`,
    ].join("\n"),
    smsLines: [
      payload.fullName,
      payload.phone,
      `Areas: ${areas}`,
      `Screen: ${screening.screeningResult}`,
      `Admin: /admin/flowwave`,
    ],
    replyTo: payload.email,
  });

  notifyFlowWaveLeadFollowUp({
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
  });

  return {
    ok: true,
    intakeId: result.row.id,
    screening: screening.screeningResult,
    clientId,
  };
}
