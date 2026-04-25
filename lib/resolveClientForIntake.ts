import type { SupabaseClient } from "@supabase/supabase-js";
import { findClientsByPhoneLoose, phoneLast10 } from "@/lib/checkin-lookup";
import { normalizeToE164 } from "@/lib/phone-e164";

function splitName(signerName: string | null | undefined): { first: string; last: string } {
  const t = (signerName || "").trim();
  if (!t) return { first: "Intake", last: "Client" };
  const i = t.indexOf(" ");
  if (i === -1) return { first: t, last: "Client" };
  return {
    first: t.slice(0, i).trim() || "Intake",
    last: t.slice(i + 1).trim() || "Client",
  };
}

/**
 * Intake (HG_DEV_010): match existing `clients` by phone (Fresha + Hub imports
 * live here). If at least one match, attach the first. If none, create a new row.
 * Multiple matches: use the first (phone match is not unique in legacy data);
 * refine later with DOB/last-4.
 */
export async function resolveOrCreateClientForIntake(
  admin: SupabaseClient,
  params: { clientPhone: string | null; signerName: string | null; source: string }
): Promise<{ clientId: string | null; created: boolean; matchCount: number }> {
  const phone = params.clientPhone ? String(params.clientPhone).trim() : "";
  if (!phone) {
    return { clientId: null, created: false, matchCount: 0 };
  }

  const matches = await findClientsByPhoneLoose(admin, phone);
  if (matches.length > 0) {
    return { clientId: matches[0]!.id, created: false, matchCount: matches.length };
  }

  const e164 = normalizeToE164(phone);
  const { first, last } = splitName(params.signerName);
  const last10 = phoneLast10(phone);
  const displayPhone = e164 || (last10 ? `+1${last10}` : phone) || null;

  const { data: row, error } = await admin
    .from("clients")
    .insert({
      first_name: first,
      last_name: last,
      phone: displayPhone,
      full_name: [first, last].filter(Boolean).join(" ") || "Intake client",
      source: params.source,
      is_new_client: true,
    })
    .select("id")
    .single();

  if (error || !row) {
    return { clientId: null, created: false, matchCount: 0 };
  }
  return { clientId: row.id, created: true, matchCount: 0 };
}
