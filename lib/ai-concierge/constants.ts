import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { normalizeToE164 } from "@/lib/phone-e164";

const FALLBACK_TRANSFER_E164 = "+16308813398";

/**
 * Sync transfer-target lookup. Prefers env over the historical hardcoded fallback.
 * Used by code paths that don't have async / DB context (e.g. legacy callers).
 */
export function getConciergeTransferE164(): string {
  const raw =
    process.env.AI_CONCIERGE_TRANSFER_E164?.trim() ||
    process.env.AI_CONCIERGE_TRANSFER_PHONE?.trim() ||
    FALLBACK_TRANSFER_E164;
  return normalizeToE164(raw) ?? FALLBACK_TRANSFER_E164;
}

/**
 * Async transfer-target lookup with full precedence:
 *   1. `ai_concierge_settings.transfer_e164.number` (settings UI / admin override)
 *   2. `AI_CONCIERGE_TRANSFER_E164` / `AI_CONCIERGE_TRANSFER_PHONE` env vars
 *   3. Hardcoded `FALLBACK_TRANSFER_E164` (so we never `<Dial>` an empty string)
 *
 * The Supabase read uses the service-role admin client; if it fails we fall through
 * to env so a brief DB outage cannot dead-end a live call.
 */
export async function getConciergeTransferE164Async(): Promise<string> {
  const admin = getSupabaseAdminClient();
  if (admin) {
    try {
      const { data } = await admin
        .from("ai_concierge_settings")
        .select("setting_value")
        .eq("setting_key", "transfer_e164")
        .maybeSingle();
      const value = data?.setting_value as { number?: string } | null;
      const fromDb = value?.number?.trim();
      if (fromDb) {
        const normalized = normalizeToE164(fromDb);
        if (normalized) return normalized;
      }
    } catch (err) {
      console.warn("[ai-concierge] transfer_e164 settings lookup failed:", err);
    }
  }
  return getConciergeTransferE164();
}
