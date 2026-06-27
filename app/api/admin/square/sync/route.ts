import { NextRequest, NextResponse } from "next/server";
import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getActiveConnection } from "@/lib/square/oauth";
import { getSquarePaymentSyncStatus, syncSquarePayments } from "@/lib/square/sync-payments";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { getSquareApiHost, squareApiFetch } from "@/lib/square/http";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type SquareCustomer = {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  created_at?: string;
};

async function syncCustomersFromSquare() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return { ok: false as const, error: "Database not configured" };

  let cursor: string | undefined;
  const allCustomers: SquareCustomer[] = [];

  for (;;) {
    const params = new URLSearchParams({ limit: "100" });
    if (cursor) params.set("cursor", cursor);
    const res = await squareApiFetch<{ customers?: SquareCustomer[]; cursor?: string }>(
      `/v2/customers?${params}`,
    );
    if (!res.ok) return { ok: false as const, error: res.error };
    allCustomers.push(...(res.data.customers ?? []));
    cursor = res.data.cursor;
    if (!cursor) break;
  }

  let synced = 0;
  let updated = 0;
  let skipped = 0;

  for (const customer of allCustomers) {
    if (!customer.email_address && !customer.phone_number && !customer.given_name) {
      skipped++;
      continue;
    }

    let existingClient: { id: string } | null = null;

    const { data: bySquareId } = await supabase
      .from("clients")
      .select("id")
      .eq("square_customer_id", customer.id)
      .maybeSingle();
    if (bySquareId) {
      existingClient = bySquareId;
    } else if (customer.email_address) {
      const { data: byEmail } = await supabase
        .from("clients")
        .select("id")
        .eq("email", customer.email_address.toLowerCase())
        .maybeSingle();
      if (byEmail) existingClient = byEmail;
    }

    const clientData: Record<string, unknown> = {
      square_customer_id: customer.id,
      first_name: customer.given_name || "",
      last_name: customer.family_name || "",
      email: customer.email_address?.toLowerCase() || null,
      phone: customer.phone_number?.replace(/\D/g, "") || null,
      updated_at: new Date().toISOString(),
    };

    if (existingClient) {
      await supabase.from("clients").update(clientData).eq("id", existingClient.id);
      updated++;
    } else {
      const { error } = await supabase.from("clients").insert({
        ...clientData,
        source: "square",
        created_at: customer.created_at || new Date().toISOString(),
      });
      if (!error) synced++;
    }
  }

  return {
    ok: true as const,
    synced,
    updated,
    skipped,
    total: allCustomers.length,
  };
}

/** GET — connection + cached payment stats */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const connection = await getActiveConnection();
  const paymentStats = await getSquarePaymentSyncStatus();

  return NextResponse.json({
    connected: !!connection,
    connection: connection
      ? {
          business_name: connection.business_name,
          merchant_id: connection.merchant_id,
          environment: connection.environment,
          location_name: connection.location_name,
          connected_at: connection.connected_at,
        }
      : null,
    apiHost: getSquareApiHost(),
    payments: paymentStats,
  });
}

/** POST — sync payments and/or customers from Square */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const type = String(body.type || "payments");
  const days = parseInt(String(body.days ?? "30"), 10);

  if (type === "customers") {
    const result = await syncCustomersFromSquare();
    if (!result.ok) {
      return NextResponse.json(result, { status: 502 });
    }
    return NextResponse.json({ ok: true, type: "customers", ...result });
  }

  if (type === "payments" || type === "all") {
    const result = await syncSquarePayments({ days });
    if (!result.ok) {
      return NextResponse.json(result, { status: 502 });
    }

    if (type === "all") {
      const customers = await syncCustomersFromSquare();
      return NextResponse.json({
        ok: true,
        type: "all",
        payments: result,
        customers: customers.ok ? customers : { error: customers.error },
      });
    }

    return NextResponse.json({ ok: true, type: "payments", ...result });
  }

  return NextResponse.json({ error: "Invalid type — use payments, customers, or all" }, { status: 400 });
}
