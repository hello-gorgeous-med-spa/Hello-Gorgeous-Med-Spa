import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { normalizeToE164 } from "@/lib/phone-e164";

export type TranscriptTurn = { role: "user" | "assistant"; content: string };

export function parseTranscript(raw: string | null | undefined): TranscriptTurn[] {
  if (!raw || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: TranscriptTurn[] = [];
    for (const row of parsed) {
      if (
        row &&
        typeof row === "object" &&
        "role" in row &&
        "content" in row &&
        (row.role === "user" || row.role === "assistant") &&
        typeof row.content === "string"
      ) {
        out.push({ role: row.role, content: row.content });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function stringifyTranscript(turns: TranscriptTurn[]): string {
  return JSON.stringify(turns);
}

export type BookingToolInput = {
  client_name: string;
  client_phone: string;
  service: string;
  preferred_date?: string;
  preferred_time?: string;
  is_new_client?: boolean;
};

export async function saveBookingRequest(callSid: string, bookingInfo: BookingToolInput): Promise<{ ok: boolean; bookingRequestId?: string; error?: string }> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Supabase admin not configured" };

  const phoneE164 = normalizeToE164(bookingInfo.client_phone) ?? bookingInfo.client_phone.trim();

  const { data, error } = await admin
    .from("booking_requests")
    .insert({
      call_sid: callSid,
      client_name: bookingInfo.client_name.trim(),
      client_phone: phoneE164,
      service_requested: bookingInfo.service.trim(),
      preferred_date: bookingInfo.preferred_date ?? null,
      preferred_time: bookingInfo.preferred_time ?? null,
      is_new_client: bookingInfo.is_new_client ?? true,
      status: "pending",
    })
    .select("id")
    .maybeSingle();

  if (error || !data?.id) {
    console.error("[ai-concierge] booking_requests insert:", error?.message);
    return { ok: false, error: error?.message ?? "insert failed" };
  }

  await admin
    .from("ai_concierge_calls")
    .update({
      booking_request_id: data.id,
      action_taken: "collected_booking_info",
      summary: `Booking request: ${bookingInfo.service} for ${bookingInfo.client_name}`,
    })
    .eq("call_sid", callSid);

  return { ok: true, bookingRequestId: data.id };
}

export async function updateCallTranscript(callSid: string, turns: TranscriptTurn[], patch?: { action_taken?: string; summary?: string }) {
  const admin = getSupabaseAdminClient();
  if (!admin) return;
  await admin
    .from("ai_concierge_calls")
    .update({
      transcript: stringifyTranscript(turns),
      ...(patch?.action_taken ? { action_taken: patch.action_taken } : {}),
      ...(patch?.summary ? { summary: patch.summary } : {}),
    })
    .eq("call_sid", callSid);
}

/** Load enabled FAQs for the system prompt (truncated). */
export async function loadKnowledgeSnippets(): Promise<string> {
  const admin = getSupabaseAdminClient();
  if (!admin) return "";

  const { data, error } = await admin
    .from("ai_concierge_knowledge")
    .select("question,answer,category")
    .eq("enabled", true)
    .order("category");

  if (error || !data?.length) return "";

  const lines = data.map((row) => `Q (${row.category}): ${row.question}\nA: ${row.answer}`);
  const joined = lines.join("\n\n");
  return joined.length > 12000 ? `${joined.slice(0, 12000)}\n…` : joined;
}
