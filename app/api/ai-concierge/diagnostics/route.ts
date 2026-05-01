// AI Concierge — diagnostics summary for /admin/ai-concierge/health.
// Reports env-var presence (without leaking values), DB readiness, the canonical
// Twilio webhook URL, and the resolved transfer target. Owner|admin|staff only.

import { NextRequest, NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { getConciergeTransferE164Async } from "@/lib/ai-concierge/constants";
import { canonicalWebhookUrl } from "@/lib/ai-concierge/webhook-url";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export const dynamic = "force-dynamic";

type EnvFlag = { name: string; required: boolean; set: boolean; note?: string };

function flag(name: string, required: boolean, note?: string): EnvFlag {
  const raw = process.env[name];
  return { name, required, set: !!raw && raw.trim() !== "", note };
}

function maskNumber(n: string | undefined | null): string | null {
  if (!n) return null;
  const digits = n.replace(/[^\d]/g, "");
  if (digits.length < 4) return n;
  const last4 = digits.slice(-4);
  return `… ${last4}`;
}

async function dbHealth(): Promise<{
  reachable: boolean;
  callsCount: number | null;
  bookingRequestsCount: number | null;
  knowledgeCount: number | null;
  settingsCount: number | null;
  error?: string;
}> {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return {
      reachable: false,
      callsCount: null,
      bookingRequestsCount: null,
      knowledgeCount: null,
      settingsCount: null,
      error: "Supabase admin client not configured",
    };
  }
  try {
    const [calls, bookings, kb, settings] = await Promise.all([
      admin.from("ai_concierge_calls").select("call_sid", { count: "exact", head: true }),
      admin.from("booking_requests").select("id", { count: "exact", head: true }),
      admin.from("ai_concierge_knowledge").select("id", { count: "exact", head: true }),
      admin.from("ai_concierge_settings").select("setting_key", { count: "exact", head: true }),
    ]);
    return {
      reachable: !calls.error && !bookings.error && !kb.error && !settings.error,
      callsCount: calls.count ?? null,
      bookingRequestsCount: bookings.count ?? null,
      knowledgeCount: kb.count ?? null,
      settingsCount: settings.count ?? null,
      error:
        calls.error?.message ||
        bookings.error?.message ||
        kb.error?.message ||
        settings.error?.message,
    };
  } catch (e) {
    return {
      reachable: false,
      callsCount: null,
      bookingRequestsCount: null,
      knowledgeCount: null,
      settingsCount: null,
      error: e instanceof Error ? e.message : "Unknown DB error",
    };
  }
}

export async function GET(request: NextRequest) {
  const session = await getAiConciergeStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const env: EnvFlag[] = [
    flag("TWILIO_ACCOUNT_SID", true, "Required: Twilio webhook signature + REST"),
    flag("TWILIO_AUTH_TOKEN", true, "Required: validates X-Twilio-Signature"),
    flag("TWILIO_PHONE_NUMBER", true, "E.164 inbound number — caller-facing"),
    flag("ANTHROPIC_API_KEY", true, "Required for Sarah's brain (Claude)"),
    flag("ANTHROPIC_MODEL", false, "Optional override; defaults to claude-sonnet-4"),
    flag("NEXT_PUBLIC_SUPABASE_URL", true, "Required: call logging + booking inserts"),
    flag("SUPABASE_SERVICE_ROLE_KEY", true, "Required: server-side DB inserts"),
    flag("AI_CONCIERGE_TRANSFER_E164", false, "Override transfer line; settings UI takes priority"),
    flag("AI_CONCIERGE_STAFF_PHONE_E164", false, "Where booking-summary SMS lands"),
    flag("AI_CONCIERGE_STAFF_EMAIL", false, "Override Resend recipient for booking emails"),
    flag("RESEND_API_KEY", false, "Required for booking emails to staff"),
    flag("TWILIO_WEBHOOK_SKIP_SIGNATURE", false, "Local-only; must be UNSET in production"),
  ];

  const requiredMissing = env.filter((f) => f.required && !f.set).map((f) => f.name);
  const skipSignatureLeaked =
    process.env.NODE_ENV === "production" && process.env.TWILIO_WEBHOOK_SKIP_SIGNATURE === "1";

  const transfer = await getConciergeTransferE164Async();
  const db = await dbHealth();

  return NextResponse.json({
    ok: requiredMissing.length === 0 && db.reachable && !skipSignatureLeaked,
    generatedAt: new Date().toISOString(),
    requestedBy: { role: session.role, email: session.email ?? null },
    webhookUrl: canonicalWebhookUrl(request),
    twilioPhoneNumberMasked: maskNumber(process.env.TWILIO_PHONE_NUMBER),
    transferTarget: { e164: transfer, masked: maskNumber(transfer) },
    env,
    requiredMissing,
    warnings: skipSignatureLeaked
      ? ["TWILIO_WEBHOOK_SKIP_SIGNATURE=1 in production — disable immediately."]
      : [],
    db,
  });
}
