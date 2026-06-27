// ============================================================
// API: SQUARE CUSTOMER SYNC
// Manual import of customers from Square → clients table
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { requireProviderAreaAccess } from "@/lib/api-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { resolveSquareAccessToken, squareApiFetch } from "@/lib/square/http";

export const dynamic = "force-dynamic";

type SquareCustomer = {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  created_at?: string;
};

export async function POST(request: NextRequest) {
  const auth = requireProviderAreaAccess(request);
  if ("error" in auth) return auth.error;

  try {
    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const token = await resolveSquareAccessToken();
    if (!token) {
      return NextResponse.json(
        { error: "Square not connected. Connect in Settings → Payments." },
        { status: 400 },
      );
    }

    let cursor: string | undefined;
    const allCustomers: SquareCustomer[] = [];

    do {
      const params = new URLSearchParams({ limit: "100" });
      if (cursor) params.set("cursor", cursor);
      const res = await squareApiFetch<{ customers?: SquareCustomer[]; cursor?: string }>(
        `/v2/customers?${params}`,
        { token },
      );
      if (!res.ok) {
        return NextResponse.json({ error: res.error }, { status: 502 });
      }
      allCustomers.push(...(res.data.customers ?? []));
      cursor = res.data.cursor;
    } while (cursor);

    let syncedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const customer of allCustomers) {
      if (!customer.email_address && !customer.phone_number && !customer.given_name) {
        skippedCount++;
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
        updatedCount++;
      } else {
        const { error: insertError } = await supabase.from("clients").insert({
          ...clientData,
          source: "square",
          created_at: customer.created_at || new Date().toISOString(),
        });
        if (!insertError) syncedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      updated: updatedCount,
      skipped: skippedCount,
      total: allCustomers.length,
      message: `Imported ${syncedCount} new, updated ${updatedCount}, skipped ${skippedCount}`,
    });
  } catch (error) {
    console.error("Customer sync error:", error);
    return NextResponse.json({ error: "Failed to sync customers" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = requireProviderAreaAccess(request);
  if ("error" in auth) return auth.error;

  const token = await resolveSquareAccessToken();
  if (!token) {
    return NextResponse.json({ connected: false, error: "Square not connected" });
  }

  const res = await squareApiFetch<{ customers?: unknown[] }>("/v2/customers?limit=1", { token });
  if (!res.ok) {
    return NextResponse.json({ connected: true, error: res.error });
  }

  return NextResponse.json({
    connected: true,
    message: "Square connected — ready to sync customers",
  });
}
