/**
 * Server helpers for Hello Gorgeous RX™ secure messaging threads.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { notifyOwnerFormSubmission } from "@/lib/notifications/form-alert";
import { logRxMessageAudit } from "@/lib/rx-messaging/audit";
import { logRxMessageToChart, resolveThreadClientId } from "@/lib/rx-messaging/chart";
import { notifyPatientRxMessageAlert } from "@/lib/rx-messaging/notify";
import {
  normalizeIntakeRef,
  normalizePatientEmail,
  type RxMessageThread,
  type RxSecureMessage,
} from "@/lib/rx-secure-messages";

type SubmissionRow = {
  id: string;
  access_token: string | null;
  signer_name: string | null;
  client_phone: string | null;
  responses_json: Record<string, unknown> | null;
  template_id: string;
};

type ThreadRow = {
  id: string;
  submission_id: string | null;
  intake_ref: string;
  patient_email: string;
  patient_name: string | null;
  patient_phone: string | null;
  track: string | null;
  unread_staff_count: number;
  unread_patient_count: number;
  last_message_at: string | null;
  last_preview: string | null;
  created_at: string;
};

type MessageRow = {
  id: string;
  thread_id: string;
  sender_type: "patient" | "staff";
  body: string;
  sent_by: string | null;
  read_at: string | null;
  created_at: string;
};

function mapThread(row: ThreadRow): RxMessageThread {
  return {
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
}

function mapMessage(row: MessageRow): RxSecureMessage {
  return {
    id: row.id,
    threadId: row.thread_id,
    senderType: row.sender_type,
    body: row.body,
    sentBy: row.sent_by,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function verifyRxMessageAccess(
  admin: SupabaseClient,
  intakeRef: string,
  email: string,
): Promise<{ ok: true; submission: SubmissionRow } | { ok: false; error: string }> {
  const ref = normalizeIntakeRef(intakeRef);
  const patientEmail = normalizePatientEmail(email);
  if (!ref || ref.length < 6) return { ok: false, error: "Enter your reference code" };
  if (!patientEmail.includes("@")) return { ok: false, error: "Enter the email on your refill form" };

  const { data: rows, error } = await admin
    .from("hg_form_submissions")
    .select("id, access_token, signer_name, client_phone, responses_json, template_id")
    .ilike("access_token", `${ref.toLowerCase()}%`)
    .order("submitted_at", { ascending: false })
    .limit(20);

  if (error) return { ok: false, error: "Could not verify access" };

  const match = (rows as SubmissionRow[] | null)?.find((row) => {
    const responses = row.responses_json || {};
    const formEmail = normalizePatientEmail(String(responses.email || ""));
    return formEmail === patientEmail;
  });

  if (!match) {
    return { ok: false, error: "Reference and email do not match our records" };
  }

  return { ok: true, submission: match };
}

export async function getOrCreateRxMessageThread(
  admin: SupabaseClient,
  submission: SubmissionRow,
  intakeRef: string,
  email: string,
): Promise<RxMessageThread> {
  const ref = normalizeIntakeRef(intakeRef);
  const patientEmail = normalizePatientEmail(email);
  const responses = submission.responses_json || {};
  const track =
    typeof responses.current_medication === "string" ? "glp1" : "rx";

  const { data: existing } = await admin
    .from("hg_rx_message_threads")
    .select("*")
    .eq("intake_ref", ref)
    .eq("patient_email", patientEmail)
    .maybeSingle();

  if (existing) return mapThread(existing as ThreadRow);

  const clientId = await resolveThreadClientId(admin, submission.id, patientEmail);

  const { data: created, error } = await admin
    .from("hg_rx_message_threads")
    .insert({
      submission_id: submission.id,
      intake_ref: ref,
      patient_email: patientEmail,
      patient_name: submission.signer_name,
      patient_phone: submission.client_phone,
      client_id: clientId,
      track,
    })
    .select("*")
    .single();

  if (error || !created) throw new Error(error?.message || "Could not open message thread");
  return mapThread(created as ThreadRow);
}

export async function listRxThreadMessages(
  admin: SupabaseClient,
  threadId: string,
): Promise<RxSecureMessage[]> {
  const { data, error } = await admin
    .from("hg_rx_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) throw new Error(error.message);
  return ((data || []) as MessageRow[]).map(mapMessage);
}

export async function sendPatientRxMessage(
  admin: SupabaseClient,
  thread: RxMessageThread,
  body: string,
): Promise<RxSecureMessage> {
  const trimmed = body.trim().slice(0, 4000);
  if (!trimmed) throw new Error("Message required");

  const { data: msg, error } = await admin
    .from("hg_rx_messages")
    .insert({
      thread_id: thread.id,
      sender_type: "patient",
      body: trimmed,
    })
    .select("*")
    .single();

  if (error || !msg) throw new Error(error?.message || "Could not send message");

  const mapped = mapMessage(msg as MessageRow);

  await admin
    .from("hg_rx_message_threads")
    .update({
      unread_staff_count: (thread.unreadStaff || 0) + 1,
      last_message_at: new Date().toISOString(),
      last_preview: trimmed.slice(0, 160),
      updated_at: new Date().toISOString(),
    })
    .eq("id", thread.id);

  await logRxMessageAudit(
    {
      threadId: thread.id,
      messageId: mapped.id,
      action: "message_sent",
      actorType: "patient",
      detail: { preview: trimmed.slice(0, 120) },
    },
    admin,
  );

  void logRxMessageToChart(
    {
      thread,
      messageId: mapped.id,
      body: trimmed,
      senderType: "patient",
    },
    admin,
  );

  notifyOwnerFormSubmission({
    formName: "RX secure message",
    lines: [
      `Ref ${thread.intakeRef}`,
      thread.patientName || thread.patientEmail,
      trimmed.slice(0, 200),
      "Reply: /admin/rx-messages",
    ],
  });

  return mapped;
}

export async function sendStaffRxMessage(
  admin: SupabaseClient,
  threadId: string,
  body: string,
  sentBy?: string | null,
): Promise<RxSecureMessage> {
  const trimmed = body.trim().slice(0, 4000);
  if (!trimmed) throw new Error("Message required");

  const thread = await getRxMessageThread(threadId);
  if (!thread) throw new Error("Thread not found");

  const { data: msg, error } = await admin
    .from("hg_rx_messages")
    .insert({
      thread_id: threadId,
      sender_type: "staff",
      body: trimmed,
      sent_by: sentBy?.trim() || null,
    })
    .select("*")
    .single();

  if (error || !msg) throw new Error(error?.message || "Could not send message");

  const mapped = mapMessage(msg as MessageRow);

  await admin
    .from("hg_rx_message_threads")
    .update({
      last_message_at: new Date().toISOString(),
      last_preview: trimmed.slice(0, 160),
      updated_at: new Date().toISOString(),
    })
    .eq("id", threadId);

  const { data: threadRow } = await admin
    .from("hg_rx_message_threads")
    .select("unread_patient_count")
    .eq("id", threadId)
    .single();
  const currentUnread = (threadRow as { unread_patient_count?: number } | null)?.unread_patient_count ?? 0;
  await admin
    .from("hg_rx_message_threads")
    .update({ unread_patient_count: currentUnread + 1 })
    .eq("id", threadId);

  await logRxMessageAudit(
    {
      threadId,
      messageId: mapped.id,
      action: "message_sent",
      actorType: "staff",
      actorEmail: sentBy,
      detail: { preview: trimmed.slice(0, 120) },
    },
    admin,
  );

  void logRxMessageToChart(
    {
      thread,
      messageId: mapped.id,
      body: trimmed,
      senderType: "staff",
      sentBy,
    },
    admin,
  );

  void notifyPatientRxMessageAlert(thread, mapped.id, admin);

  return mapped;
}

export async function listRxMessageThreads(limit = 50): Promise<RxMessageThread[]> {
  const admin = getSupabaseAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("hg_rx_message_threads")
    .select("*")
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("[rx-messages] list threads", error.message);
    return [];
  }
  return ((data || []) as ThreadRow[]).map(mapThread);
}

export async function markRxMessagesRead(
  admin: SupabaseClient,
  threadId: string,
  reader: "patient" | "staff",
): Promise<void> {
  const senderType = reader === "patient" ? "staff" : "patient";
  await admin
    .from("hg_rx_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .eq("sender_type", senderType)
    .is("read_at", null);

  const patch =
    reader === "staff"
      ? { unread_staff_count: 0 }
      : { unread_patient_count: 0 };
  await admin.from("hg_rx_message_threads").update(patch).eq("id", threadId);

  await logRxMessageAudit(
    {
      threadId,
      action: "message_read",
      actorType: reader,
      detail: { reader },
    },
    admin,
  );
}

export async function getRxMessageThread(threadId: string): Promise<RxMessageThread | null> {
  const admin = getSupabaseAdminClient();
  if (!admin) return null;
  const { data } = await admin.from("hg_rx_message_threads").select("*").eq("id", threadId).maybeSingle();
  if (!data) return null;
  return mapThread(data as ThreadRow);
}
