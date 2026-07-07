import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { logRxMessageAudit } from "@/lib/rx-messaging/audit";
import type { RxMessageThread } from "@/lib/rx-secure-messages";

export async function resolveThreadClientId(
  admin: SupabaseClient,
  submissionId: string | null,
  patientEmail: string,
): Promise<string | null> {
  if (submissionId) {
    const { data: sub } = await admin
      .from("hg_form_submissions")
      .select("client_id")
      .eq("id", submissionId)
      .maybeSingle();
    if (sub?.client_id) return String(sub.client_id);
  }

  const email = patientEmail.trim().toLowerCase();
  if (!email) return null;

  const { data: client } = await admin
    .from("clients")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  return client?.id ? String(client.id) : null;
}

export async function logRxMessageToChart(
  input: {
    thread: RxMessageThread;
    messageId: string;
    body: string;
    senderType: "patient" | "staff";
    sentBy?: string | null;
    clientId?: string | null;
  },
  client?: SupabaseClient | null,
): Promise<string | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const clientId =
    input.clientId ??
    (await resolveThreadClientId(admin, input.thread.submissionId, input.thread.patientEmail));
  if (!clientId) return null;

  const who =
    input.senderType === "staff"
      ? input.sentBy || "Hello Gorgeous RX staff"
      : input.thread.patientName || "Patient";

  const { data, error } = await admin
    .from("chart_notes")
    .insert({
      client_id: clientId,
      note_type: "phone",
      title: `RX secure message · Ref ${input.thread.intakeRef}`,
      status: "final",
      subjective: `${who} (${input.senderType}): ${input.body.slice(0, 2000)}`,
      plan: "Logged automatically from Hello Gorgeous RX secure messaging.",
      procedure_details: {
        source: "rx_secure_message",
        threadId: input.thread.id,
        messageId: input.messageId,
        intakeRef: input.thread.intakeRef,
        senderType: input.senderType,
      },
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "42P01") return null;
    console.warn("[rx-messaging/chart]", error.message);
    return null;
  }

  await admin
    .from("hg_rx_messages")
    .update({ chart_note_id: data.id })
    .eq("id", input.messageId);

  await logRxMessageAudit(
    {
      threadId: input.thread.id,
      messageId: input.messageId,
      action: "chart_logged",
      actorType: "system",
      detail: { chartNoteId: data.id },
    },
    admin,
  );

  return String(data.id);
}
