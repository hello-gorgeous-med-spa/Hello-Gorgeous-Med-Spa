/**
 * Phase 1 E2E pipeline health checks for RX operations.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export type RxE2eCheck = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  href?: string;
};

export type RxE2eReport = {
  checks: RxE2eCheck[];
  ready: boolean;
  generatedAt: string;
};

export async function buildRxE2eReport(admin?: SupabaseClient | null): Promise<RxE2eReport> {
  const client = admin ?? getSupabaseAdminClient();
  const checks: RxE2eCheck[] = [];
  const now = new Date().toISOString();

  if (!client) {
    return {
      checks: [
        {
          id: "db",
          label: "Database",
          status: "fail",
          detail: "Supabase admin client unavailable",
        },
      ],
      ready: false,
      generatedAt: now,
    };
  }

  const squareConnected = await client
    .from("square_connections")
    .select("id, status")
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  checks.push({
    id: "square",
    label: "Square OAuth connected",
    status: squareConnected.error
      ? "warn"
      : squareConnected.data
        ? "pass"
        : "fail",
    detail: squareConnected.data
      ? "Square account linked for checkout & webhooks"
      : "Connect Square at Settings → Payments",
    href: "/admin/settings/payments",
  });

  const tables = [
    { id: "ledger", label: "RX payment ledger", table: "hg_rx_payment_ledger" },
    { id: "dispatch", label: "RX dispatch", table: "hg_rx_dispatch" },
    { id: "reminders", label: "Refill reminders", table: "hg_rx_refill_reminders" },
  ] as const;

  for (const t of tables) {
    const { error } = await client.from(t.table).select("id").limit(1);
    checks.push({
      id: t.id,
      label: t.label,
      status: error?.code === "42P01" ? "fail" : "pass",
      detail:
        error?.code === "42P01"
          ? `Run migration for ${t.table}`
          : `${t.label} table ready`,
    });
  }

  const resendOk = Boolean(process.env.RESEND_API_KEY);
  checks.push({
    id: "resend",
    label: "Patient email (Resend)",
    status: resendOk ? "pass" : "warn",
    detail: resendOk ? "Magic links & refill emails enabled" : "RESEND_API_KEY not set",
  });

  const cronOk = Boolean(process.env.CRON_SECRET);
  checks.push({
    id: "cron",
    label: "Vercel cron secret",
    status: cronOk ? "pass" : "warn",
    detail: cronOk ? "Scheduled refill & checkout reminders secured" : "CRON_SECRET not set",
  });

  const webhookOk = Boolean(process.env.SQUARE_WEBHOOK_SIGNATURE_KEY);
  checks.push({
    id: "webhook",
    label: "Square webhook signature",
    status: webhookOk ? "pass" : "warn",
    detail: webhookOk
      ? "Payments auto-mark paid in RX ledger"
      : "Set SQUARE_WEBHOOK_SIGNATURE_KEY for auto-reconcile",
  });

  const vapidOk = Boolean(
    process.env.VAPID_SUBJECT &&
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY,
  );
  checks.push({
    id: "push",
    label: "RX refill push (VAPID)",
    status: vapidOk ? "pass" : "warn",
    detail: vapidOk
      ? "Refill due push notifications enabled"
      : "Set VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY",
  });

  const { count: pendingDispatch } = await client
    .from("hg_rx_dispatch")
    .select("submission_id", { count: "exact", head: true })
    .in("status", ["new", "reviewed", "approved"]);

  checks.push({
    id: "queue",
    label: "Dispatch queue",
    status: (pendingDispatch ?? 0) > 20 ? "warn" : "pass",
    detail: `${pendingDispatch ?? 0} orders awaiting pharmacy send`,
    href: "/admin/rx-dispatch",
  });

  const { count: pendingPay } = await client
    .from("hg_rx_payment_ledger")
    .select("id", { count: "exact", head: true })
    .eq("payment_status", "pending");

  checks.push({
    id: "pending-pay",
    label: "Pending RX payments",
    status: (pendingPay ?? 0) > 15 ? "warn" : "pass",
    detail: `${pendingPay ?? 0} unpaid checkout links`,
    href: "/admin/rx-ledger",
  });

  const ready = !checks.some((c) => c.status === "fail");

  return { checks, ready, generatedAt: now };
}
