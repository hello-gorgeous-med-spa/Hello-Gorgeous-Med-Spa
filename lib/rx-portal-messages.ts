/**
 * Hims-compete Phase 3 — portal-session RX messaging (My RX care team).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { RX_INTAKE_SLUGS } from "@/lib/rx-dispatch";
import {
  getOrCreateRxMessageThread,
  listRxThreadMessages,
  markRxMessagesRead,
  sendPatientRxMessage,
} from "@/lib/rx-secure-messages-server";
import { normalizePatientEmail, type RxMessageThread, type RxSecureMessage } from "@/lib/rx-secure-messages";
import { intakeRefFromToken } from "@/lib/rx-submission-context";

export type PortalRxMessageSummary = {
  unreadTotal: number;
  threads: Array<{
    threadId: string;
    intakeRef: string;
    track: string | null;
    lastPreview: string | null;
    lastMessageAt: string | null;
    unreadPatient: number;
  }>;
  primaryThreadId: string | null;
};

type SubRow = {
  id: string;
  access_token: string | null;
  signer_name: string | null;
  client_phone: string | null;
  responses_json: Record<string, unknown> | null;
  template_id: string;
  submitted_at: string;
};

export async function loadPortalRxMessageSummary(
  admin: SupabaseClient,
  clientId: string,
  patientEmail: string,
): Promise<PortalRxMessageSummary> {
  const email = normalizePatientEmail(patientEmail);

  const { data: templates } = await admin
    .from("hg_form_templates")
    .select("id")
    .in("slug", [...RX_INTAKE_SLUGS]);

  const templateIds = (templates ?? []).map((t) => t.id);
  if (!templateIds.length) {
    return { unreadTotal: 0, threads: [], primaryThreadId: null };
  }

  const { data: byClient } = await admin
    .from("hg_form_submissions")
    .select("id, access_token, signer_name, client_phone, responses_json, template_id, submitted_at")
    .in("template_id", templateIds)
    .eq("client_id", clientId)
    .order("submitted_at", { ascending: false })
    .limit(12);

  const submissions = [...((byClient ?? []) as SubRow[])];

  const { data: threadRows } = await admin
    .from("hg_rx_message_threads")
    .select("*")
    .eq("patient_email", email)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(12);

  const threads = (threadRows ?? []).map((row) => ({
    threadId: row.id as string,
    intakeRef: row.intake_ref as string,
    track: (row.track as string | null) ?? null,
    lastPreview: (row.last_preview as string | null) ?? null,
    lastMessageAt: (row.last_message_at as string | null) ?? null,
    unreadPatient: Number(row.unread_patient_count ?? 0),
  }));

  const unreadTotal = threads.reduce((sum, t) => sum + t.unreadPatient, 0);

  return {
    unreadTotal,
    threads,
    primaryThreadId: threads[0]?.threadId ?? null,
  };
}

export async function resolvePortalPrimaryThread(
  admin: SupabaseClient,
  clientId: string,
  patientEmail: string,
): Promise<{ thread: RxMessageThread; submissionId: string } | null> {
  const email = normalizePatientEmail(patientEmail);

  const { data: templates } = await admin
    .from("hg_form_templates")
    .select("id")
    .in("slug", [...RX_INTAKE_SLUGS]);

  const templateIds = (templates ?? []).map((t) => t.id);
  if (!templateIds.length) return null;

  const { data: sub } = await admin
    .from("hg_form_submissions")
    .select("id, access_token, signer_name, client_phone, responses_json, template_id, submitted_at")
    .in("template_id", templateIds)
    .eq("client_id", clientId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub) return null;

  const row = sub as SubRow;
  const intakeRef = intakeRefFromToken(row.access_token);
  const thread = await getOrCreateRxMessageThread(admin, row, intakeRef, email);

  return { thread, submissionId: row.id };
}

export async function loadPortalRxThreadMessages(
  admin: SupabaseClient,
  threadId: string,
  patientEmail: string,
): Promise<{ thread: RxMessageThread; messages: RxSecureMessage[] } | null> {
  const email = normalizePatientEmail(patientEmail);

  const { data: row } = await admin
    .from("hg_rx_message_threads")
    .select("*")
    .eq("id", threadId)
    .eq("patient_email", email)
    .maybeSingle();

  if (!row) return null;

  const thread: RxMessageThread = {
    id: row.id,
    submissionId: row.submission_id,
    intakeRef: row.intake_ref,
    patientEmail: row.patient_email,
    patientName: row.patient_name,
    patientPhone: row.patient_phone,
    track: row.track,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
    unreadStaff: row.unread_staff_count,
    unreadPatient: row.unread_patient_count,
    lastPreview: row.last_preview,
  };

  const messages = await listRxThreadMessages(admin, threadId);
  await markRxMessagesRead(admin, threadId, "patient");

  return { thread, messages };
}

export async function sendPortalRxMessage(
  admin: SupabaseClient,
  clientId: string,
  patientEmail: string,
  body: string,
  threadId?: string | null,
): Promise<{ message: RxSecureMessage; threadId: string }> {
  let thread: RxMessageThread;

  if (threadId) {
    const loaded = await loadPortalRxThreadMessages(admin, threadId, patientEmail);
    if (!loaded) throw new Error("Thread not found");
    thread = loaded.thread;
  } else {
    const primary = await resolvePortalPrimaryThread(admin, clientId, patientEmail);
    if (!primary) throw new Error("No RX order found — submit a refill first");
    thread = primary.thread;
  }

  const message = await sendPatientRxMessage(admin, thread, body);
  return { message, threadId: thread.id };
}

export type PortalRxAutopayStatus = {
  active: boolean;
  source: string | null;
  lineLabel: string | null;
  amountUsd: number | null;
  track: string | null;
};

export async function loadPortalRxAutopayStatus(
  admin: SupabaseClient,
  clientId: string,
): Promise<PortalRxAutopayStatus> {
  const { data } = await admin
    .from("hg_rx_payment_ledger")
    .select("source, line_label, amount_usd, track")
    .eq("client_id", clientId)
    .in("source", ["glp1_autopay", "peptide_autopay", "clinic_autopay"])
    .eq("payment_status", "paid")
    .eq("metadata->>autopay_enrollment", "active")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return { active: false, source: null, lineLabel: null, amountUsd: null, track: null };
  }

  return {
    active: true,
    source: data.source as string,
    lineLabel: (data.line_label as string | null) ?? null,
    amountUsd: data.amount_usd != null ? Number(data.amount_usd) : null,
    track: (data.track as string | null) ?? null,
  };
}
