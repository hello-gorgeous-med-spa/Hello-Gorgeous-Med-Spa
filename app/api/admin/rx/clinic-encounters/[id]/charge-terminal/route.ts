import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  ensureClinicEncounterLedger,
  getClinicEncounter,
  updateClinicEncounter,
} from "@/lib/rx-clinic-encounter";
import type { RxClinicLineItem } from "@/lib/rx-clinic-regen-sale";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { dollarsToCents } from "@/lib/square/client";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/rx/clinic-encounters/[id]/charge-terminal
 * Creates a POS sale + pending ledger row for Square terminal checkout.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const encounter = await getClinicEncounter(id);
  if (!encounter) {
    return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
  }

  if (encounter.final_total_usd <= 0) {
    return NextResponse.json({ error: "Nothing to charge" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { data: clientRow } = await admin
    .from("clients")
    .select("first_name, last_name, email, phone")
    .eq("id", encounter.client_id)
    .maybeSingle();

  const clientName = clientRow
    ? `${clientRow.first_name || ""} ${clientRow.last_name || ""}`.trim()
    : "Client";

  const refreshed = (await getClinicEncounter(id, admin)) ?? encounter;

  await ensureClinicEncounterLedger(
    refreshed,
    {
      name: clientName,
      email: clientRow?.email,
      phone: clientRow?.phone,
    },
    auth.user.email,
    "clinic_terminal",
    admin,
  );

  const lineItems = (refreshed.line_items ?? []) as RxClinicLineItem[];
  const isRegen = refreshed.sale_mode === "regen_catalog";

  const items = isRegen && lineItems.length
    ? [
        ...lineItems.map((li) => ({
          type: "product" as const,
          name: li.name,
          unit_price: li.lineTotalUsd,
          quantity: 1,
        })),
        ...(refreshed.shipping_usd > 0
          ? [{ type: "service" as const, name: "RE GEN shipping", unit_price: refreshed.shipping_usd, quantity: 1 }]
          : []),
      ]
    : [
        {
          type: "service" as const,
          name: isRegen ? "RE GEN in-clinic sale" : "Clinical RX service",
          unit_price: refreshed.final_total_usd,
          quantity: 1,
        },
      ];

  const subtotalCents = dollarsToCents(refreshed.final_total_usd);
  const grossTotal = subtotalCents;

  const { data: sale, error: saleError } = await admin
    .from("sales")
    .insert({
      client_id: refreshed.client_id,
      sale_type: "service",
      status: "draft",
      subtotal: subtotalCents,
      discount_total: 0,
      discount_type: null,
      discount_reason: refreshed.discount_reason || null,
      tax_total: 0,
      tax_rate: 0,
      tip_total: 0,
      gross_total: grossTotal,
      net_total: grossTotal,
      amount_paid: 0,
      balance_due: grossTotal,
      internal_notes: `RX clinic encounter ${refreshed.id}`,
    })
    .select()
    .single();

  if (saleError || !sale) {
    return NextResponse.json(
      { error: saleError?.message || "Failed to create sale" },
      { status: 500 },
    );
  }

  const saleItems = items.map((item) => ({
    sale_id: sale.id,
    item_type: item.type,
    item_name: item.name,
    quantity: item.quantity,
    unit_price: dollarsToCents(item.unit_price),
    discount_amount: 0,
    tax_amount: 0,
    total_price: dollarsToCents(item.unit_price) * item.quantity,
  }));

  await admin.from("sale_items").insert(saleItems);

  const updateResult = await updateClinicEncounter(
    id,
    {
      saleId: sale.id,
      status: "awaiting_payment",
      paymentMethod: "terminal",
    },
    admin,
  );

  if ("error" in updateResult) {
    return NextResponse.json({ error: updateResult.error }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    saleId: sale.id,
    saleNumber: sale.sale_number,
    amountUsd: refreshed.final_total_usd,
    encounter: updateResult.row,
  });
}
