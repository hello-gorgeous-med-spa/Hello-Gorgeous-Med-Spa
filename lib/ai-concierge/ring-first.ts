// Ring-First (Pattern B) settings.
//
// "When a call comes in, ring the staff cell first; if no-answer / busy / fail,
// hand off to Sarah." Owner controls live via /admin/ai-concierge/settings.
//
// Resolution: ai_concierge_settings.ring_first.{enabled,timeout,number} →
// env (AI_CONCIERGE_RING_FIRST_*) → defaults. number falls back to the
// transfer target when omitted, so most spas only configure one number.

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getConciergeTransferE164Async } from "@/lib/ai-concierge/constants";
import { normalizeToE164 } from "@/lib/phone-e164";

export const RING_FIRST_DEFAULT_TIMEOUT_SECONDS = 20;
const RING_FIRST_MIN_TIMEOUT = 5;
const RING_FIRST_MAX_TIMEOUT = 60;

export type RingFirstConfig = {
  enabled: boolean;
  timeoutSeconds: number;
  /** E.164. May equal the transfer target — that's the common case. */
  ringE164: string;
  source: "settings" | "env" | "default";
};

function clampTimeout(n: number | null | undefined): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return RING_FIRST_DEFAULT_TIMEOUT_SECONDS;
  return Math.min(Math.max(Math.round(n), RING_FIRST_MIN_TIMEOUT), RING_FIRST_MAX_TIMEOUT);
}

function envTimeout(): number | null {
  const raw = process.env.AI_CONCIERGE_RING_FIRST_TIMEOUT?.trim();
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? clampTimeout(n) : null;
}

function envEnabled(): boolean | null {
  const raw = process.env.AI_CONCIERGE_RING_FIRST_ENABLED?.trim().toLowerCase();
  if (!raw) return null;
  if (["1", "true", "yes", "on"].includes(raw)) return true;
  if (["0", "false", "no", "off"].includes(raw)) return false;
  return null;
}

/**
 * Read ring-first config. Always returns something safe — the AI flow must
 * never crash because of a missing settings row.
 */
export async function getRingFirstConfig(): Promise<RingFirstConfig> {
  const admin = getSupabaseAdminClient();

  let enabled: boolean | null = null;
  let timeoutSeconds: number | null = null;
  let ringE164: string | null = null;
  let source: RingFirstConfig["source"] = "default";

  if (admin) {
    try {
      const { data } = await admin
        .from("ai_concierge_settings")
        .select("setting_value")
        .eq("setting_key", "ring_first")
        .maybeSingle();
      const v = data?.setting_value as
        | { enabled?: unknown; timeout?: unknown; timeout_seconds?: unknown; number?: unknown }
        | null;
      if (v) {
        if (typeof v.enabled === "boolean") {
          enabled = v.enabled;
          source = "settings";
        }
        const t = typeof v.timeout === "number" ? v.timeout : typeof v.timeout_seconds === "number" ? v.timeout_seconds : null;
        if (t != null) {
          timeoutSeconds = clampTimeout(t);
          source = "settings";
        }
        if (typeof v.number === "string" && v.number.trim()) {
          const norm = normalizeToE164(v.number.trim());
          if (norm) {
            ringE164 = norm;
            source = "settings";
          }
        }
      }
    } catch (err) {
      console.warn("[ai-concierge] ring_first settings lookup failed:", err);
    }
  }

  if (enabled == null) {
    const e = envEnabled();
    if (e != null) {
      enabled = e;
      if (source === "default") source = "env";
    }
  }
  if (timeoutSeconds == null) {
    const t = envTimeout();
    if (t != null) {
      timeoutSeconds = t;
      if (source === "default") source = "env";
    }
  }
  if (!ringE164) {
    const fromEnv = process.env.AI_CONCIERGE_RING_FIRST_E164?.trim();
    if (fromEnv) {
      const norm = normalizeToE164(fromEnv);
      if (norm) {
        ringE164 = norm;
        if (source === "default") source = "env";
      }
    }
  }

  if (!ringE164) {
    ringE164 = await getConciergeTransferE164Async();
  }

  return {
    enabled: enabled ?? true,
    timeoutSeconds: timeoutSeconds ?? RING_FIRST_DEFAULT_TIMEOUT_SECONDS,
    ringE164,
    source,
  };
}
