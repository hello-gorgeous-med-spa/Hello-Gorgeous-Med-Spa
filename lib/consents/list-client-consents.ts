import type { SupabaseClient } from "@supabase/supabase-js";

export type ClientConsentRecord = {
  id: string;
  source: "kiosk" | "wizard" | "portal" | "legacy";
  form_type: string;
  form_name: string;
  signed_at: string | null;
  status: string;
  has_signature: boolean;
  appointment_id: string | null;
};

function formIdFromContent(content: unknown): string | null {
  if (!content || typeof content !== "object") return null;
  const formId = (content as { formId?: unknown }).formId;
  return typeof formId === "string" ? formId : null;
}

function packetSource(content: unknown, eventsHint?: string | null): ClientConsentRecord["source"] {
  if (eventsHint === "kiosk") return "kiosk";
  if (eventsHint === "wizard") return "wizard";
  const src = content && typeof content === "object" ? (content as { source?: unknown }).source : null;
  if (src === "kiosk" || src === "kiosk_ipad") return "kiosk";
  return "wizard";
}

/**
 * Chart of record for signed consents. Kiosk / SMS wizard write consent_packets.
 * Portal / older flows may still sit on signed_consents or client_consents.
 */
export async function listSignedConsentsForClient(
  supabase: SupabaseClient,
  clientId: string,
): Promise<ClientConsentRecord[]> {
  const out: ClientConsentRecord[] = [];
  const seen = new Set<string>();

  const { data: packets } = await supabase
    .from("consent_packets")
    .select("id, template_name, template_content, status, signed_at, signature_image, appointment_id")
    .eq("client_id", clientId)
    .in("status", ["signed", "viewed", "sent", "draft"])
    .order("created_at", { ascending: false });

  for (const row of packets || []) {
    seen.add(`packet:${row.id}`);
    const formId = formIdFromContent(row.template_content);
    out.push({
      id: row.id,
      source: packetSource(row.template_content),
      form_type: formId || row.template_name || "consent",
      form_name: row.template_name || "Consent",
      signed_at: row.signed_at,
      status: row.status,
      has_signature: Boolean(row.signature_image) || row.status === "signed",
      appointment_id: row.appointment_id || null,
    });
  }

  const { data: signed } = await supabase
    .from("signed_consents")
    .select("id, form_type, form_name, signed_at, signature_image, status")
    .eq("client_id", clientId);

  for (const row of signed || []) {
    const key = `signed:${row.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      id: row.id,
      source: "portal",
      form_type: row.form_type || "consent",
      form_name: row.form_name || String(row.form_type || "Consent").replace(/_/g, " "),
      signed_at: row.signed_at,
      status: row.status || "signed",
      has_signature: Boolean(row.signature_image) || true,
      appointment_id: null,
    });
  }

  const { data: legacy } = await supabase
    .from("client_consents")
    .select("id, signed_at, signature_data, is_valid, consent_templates(name, slug)")
    .eq("client_id", clientId)
    .eq("is_valid", true);

  for (const row of legacy || []) {
    const key = `legacy:${row.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const template = Array.isArray(row.consent_templates)
      ? row.consent_templates[0]
      : row.consent_templates;
    out.push({
      id: row.id,
      source: "legacy",
      form_type: template?.slug || "consent",
      form_name: template?.name || "Consent",
      signed_at: row.signed_at,
      status: "signed",
      has_signature: Boolean(row.signature_data),
      appointment_id: null,
    });
  }

  return out.sort((a, b) => {
    const aTime = a.signed_at ? new Date(a.signed_at).getTime() : 0;
    const bTime = b.signed_at ? new Date(b.signed_at).getTime() : 0;
    return bTime - aTime;
  });
}
