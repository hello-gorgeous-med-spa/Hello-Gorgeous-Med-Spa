#!/usr/bin/env npx tsx
/**
 * Diagnose RE GEN order payment vs Square — read-only.
 *   node --env-file=.env.local scripts/diagnose-regen-payment.ts RG-MR4DJTYJ RG-MR4B66VT
 */

import { getSupabaseAdminClient } from "../lib/hgos/supabase-admin";
import { getAccessToken } from "../lib/square/oauth";

async function main() {
  const refs = process.argv.slice(2).filter(Boolean);
  if (!refs.length) {
    console.error("Usage: node --env-file=.env.local scripts/diagnose-regen-payment.ts <ref> [...]");
    process.exit(1);
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    console.error("Supabase admin not configured");
    process.exit(1);
  }

  const { data, error } = await admin
    .from("regen_orders")
    .select(
      "reference, status, paid_at, payment_id, square_order_id, square_payment_link_id, subtotal_usd, shipping_usd, customer_name, customer_email, created_at, owner_notified_at, items",
    )
    .in("reference", refs);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  const squareEnv =
    process.env.SQUARE_ENVIRONMENT === "production" || process.env.SQUARE_ENV === "production"
      ? "production"
      : "sandbox";
  const host =
    squareEnv === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";
  const token = (await getAccessToken().catch(() => null)) || process.env.SQUARE_ACCESS_TOKEN || null;

  console.log(`Square environment: ${squareEnv}`);
  console.log(`Square token available: ${Boolean(token)}\n`);

  for (const row of data ?? []) {
    const subtotal = Number(row.subtotal_usd) || 0;
    const shipping = Number(row.shipping_usd) || 30;
    const total = Math.round((subtotal + shipping) * 100) / 100;
    const items = Array.isArray(row.items) ? row.items : [];

    console.log("═".repeat(60));
    console.log(`Order: ${row.reference}`);
    console.log(`Patient: ${row.customer_name} <${row.customer_email}>`);
    console.log(`Created: ${row.created_at}`);
    console.log(`DB status: ${row.status}`);
    console.log(`paid_at: ${row.paid_at ?? "(null)"}`);
    console.log(`payment_id: ${row.payment_id ?? "(null)"}`);
    console.log(`square_order_id: ${row.square_order_id ?? "(null)"}`);
    console.log(`square_payment_link_id: ${row.square_payment_link_id ?? "(null)"}`);
    console.log(`Computed total: $${total} (subtotal $${subtotal} + ship $${shipping})`);
    console.log(`Items: ${items.length ? JSON.stringify(items.map((i: { name?: string; priceUsd?: number }) => ({ name: i.name, price: i.priceUsd }))) : "[]"}`);

    const dbSaysPaid = row.status !== "pending_payment" || Boolean(row.paid_at);
    const hasSquarePaymentId = Boolean(row.payment_id);

    if (!row.square_order_id) {
      console.log("⚠️  No square_order_id — checkout may not have linked to Square");
    }

    if (dbSaysPaid && !hasSquarePaymentId) {
      console.log("🚨 LIKELY FALSE PAID: DB marked paid but payment_id is empty (no Square payment recorded)");
    }

    if (!token || !row.square_order_id) continue;

    const res = await fetch(`${host}/v2/orders/${encodeURIComponent(row.square_order_id)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Square-Version": "2024-12-18",
        Accept: "application/json",
      },
    });

    const body = (await res.json().catch(() => ({}))) as {
      order?: {
        state?: string;
        reference_id?: string;
        total_money?: { amount?: number };
        tenders?: Array<{ type?: string; payment_id?: string }>;
      };
      errors?: unknown;
    };

    if (!res.ok) {
      console.log(`Square order lookup: HTTP ${res.status}`, body.errors ?? "");
      continue;
    }

    const order = body.order;
    const tenders = order?.tenders ?? [];
    const totalCents = order?.total_money?.amount ?? 0;
    console.log(`Square order state: ${order?.state}`);
    console.log(`Square reference_id: ${order?.reference_id}`);
    console.log(`Square total: $${(totalCents / 100).toFixed(2)}`);
    console.log(`Square tenders: ${tenders.length}`);

    if (tenders.length === 0) {
      console.log("🚨 Square order has NO tenders — payment was NOT completed in Square");
    } else {
      for (const t of tenders) {
        if (!t.payment_id) continue;
        const payRes = await fetch(`${host}/v2/payments/${encodeURIComponent(t.payment_id)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Square-Version": "2024-12-18",
            Accept: "application/json",
          },
        });
        const payBody = (await payRes.json().catch(() => ({}))) as {
          payment?: { status?: string; amount_money?: { amount?: number }; created_at?: string };
        };
        const p = payBody.payment;
        console.log(`  Payment ${t.payment_id}: status=${p?.status}, amount=$${((p?.amount_money?.amount ?? 0) / 100).toFixed(2)}, at=${p?.created_at}`);
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
