/**
 * Ping the credited staff member when their RE GEN sale is paid —
 * small win-loop that keeps sellers engaged with their book.
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getResendFromAddress } from "@/lib/resend-config";
import {
  estimateRegenCommissionUsd,
  regenCommissionRateForPlan,
  resolvePayrollPlanForStaff,
} from "@/lib/payroll/staff-user-link";
import { listSalesStaffOptions } from "@/lib/regen/sales-attribution";
import { SITE } from "@/lib/seo";

export async function notifyStaffSaleCredited(
  admin: SupabaseClient,
  opts: {
    soldByUserId?: string | null;
    soldByEmail?: string | null;
    orderRef: string;
    customerName?: string | null;
    totalUsd: number;
  },
): Promise<{ ok: boolean; skipped?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: "email not configured" };

  const staffOptions = await listSalesStaffOptions(admin);
  const staff =
    (opts.soldByUserId && staffOptions.find((s) => s.userId === opts.soldByUserId)) ||
    (opts.soldByEmail &&
      staffOptions.find((s) => s.email.toLowerCase() === opts.soldByEmail!.toLowerCase())) ||
    null;

  if (!staff || !staff.email) return { ok: false, skipped: "no attributed staff" };

  const plan = resolvePayrollPlanForStaff(staff);
  const rate = plan ? regenCommissionRateForPlan(plan) : null;
  const commission = estimateRegenCommissionUsd(opts.totalUsd, rate);

  const firstName = staff.firstName || staff.displayName.split(/\s+/)[0] || "there";
  const total = `$${opts.totalUsd.toFixed(2)}`;
  const bookUrl = `${SITE.url.replace(/\/$/, "")}/admin/rx/my-book`;

  const commissionLine =
    commission != null
      ? `Estimated commission: $${commission.toFixed(2)} (${((rate ?? 0) * 100).toFixed(0)}% on collected)`
      : null;

  const text = [
    `Nice work, ${firstName} — a RE GEN sale was just credited to you.`,
    "",
    `Order: ${opts.orderRef}`,
    opts.customerName ? `Patient: ${opts.customerName}` : "",
    `Collected: ${total}`,
    commissionLine || "",
    "",
    `See your book of business: ${bookUrl}`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">Sale credited to you</h1>
        <p style="margin: 6px 0 0; font-size: 12px; letter-spacing: 0.15em; color: #FF2D8E;">RE GEN · HELLO GORGEOUS RX</p>
      </div>
      <div style="padding: 28px 22px;">
        <p>Nice work, ${firstName}!</p>
        <div style="background: #FFF0F7; border-radius: 12px; padding: 18px; margin: 18px 0;">
          <p style="margin: 4px 0;"><strong>Order:</strong> <span style="font-family: monospace;">${opts.orderRef}</span></p>
          ${opts.customerName ? `<p style="margin: 4px 0;"><strong>Patient:</strong> ${opts.customerName}</p>` : ""}
          <p style="margin: 4px 0; font-size: 18px;"><strong>Collected:</strong> ${total}</p>
          ${commissionLine ? `<p style="margin: 4px 0; color: #E6007E;"><strong>${commissionLine}</strong></p>` : ""}
        </div>
        <p style="text-align: center;">
          <a href="${bookUrl}" style="display: inline-block; background: #FF2D8E; color: #fff; text-decoration: none; padding: 12px 26px; border-radius: 30px; font-weight: bold;">Open my book of business</a>
        </p>
      </div>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: getResendFromAddress(),
      to: [staff.email],
      subject: `Sale credited — ${opts.orderRef} (${total})`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[regen/staff-sale-notify] Resend failed:", res.status, err);
    return { ok: false };
  }
  return { ok: true };
}
