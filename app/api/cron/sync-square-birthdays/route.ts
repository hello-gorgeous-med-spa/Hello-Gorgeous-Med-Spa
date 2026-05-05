// ============================================================
// CRON: Sync Square Birthdays to Clients Table
// Pulls birthday data from Square Customer Directory
// Updates clients.birthday_month for the Birthday Agent
// Schedule: Weekly on Mondays at 5 AM CT (10 AM UTC)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { getAccessToken as getOauthAccessToken } from "@/lib/square/oauth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SQUARE_API_VERSION = "2025-04-16";

function getEnvironmentBaseUrl(): string {
  const env = (process.env.SQUARE_ENVIRONMENT ?? "").toLowerCase();
  return env === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

async function resolveAccessToken(): Promise<string | null> {
  try {
    const oauth = await getOauthAccessToken();
    if (oauth) return oauth;
  } catch {
    // Fall back to env
  }
  return process.env.SQUARE_ACCESS_TOKEN?.trim() || null;
}

type SquareCustomer = {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  birthday?: string; // YYYY-MM-DD
};

async function fetchSquareCustomersWithBirthdays(): Promise<SquareCustomer[]> {
  const token = await resolveAccessToken();
  if (!token) {
    throw new Error("Square access token not configured");
  }

  const customers: SquareCustomer[] = [];
  let cursor: string | undefined;
  let page = 0;

  do {
    page++;
    const qs = new URLSearchParams({ limit: "100" });
    if (cursor) qs.set("cursor", cursor);

    const res = await fetch(`${getEnvironmentBaseUrl()}/v2/customers?${qs.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Square-Version": SQUARE_API_VERSION,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Square API ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      customers?: SquareCustomer[];
      cursor?: string;
    };

    if (data.customers?.length) {
      // Only keep customers that have a birthday set
      const withBirthday = data.customers.filter((c) => c.birthday);
      customers.push(...withBirthday);
    }

    cursor = data.cursor;

    if (page > 200) {
      console.warn("[sync-birthdays] safety cap: stopping at 20,000 customers");
      break;
    }
  } while (cursor);

  return customers;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    // 1. Fetch all Square customers with birthdays
    const squareCustomers = await fetchSquareCustomersWithBirthdays();

    // 2. Get all clients from our DB that have a square_customer_id
    const { data: dbClients, error: fetchError } = await supabase
      .from("clients")
      .select("id, square_customer_id, birthday_month, email")
      .not("square_customer_id", "is", null);

    if (fetchError) {
      return NextResponse.json(
        { error: `Fetch error: ${fetchError.message}` },
        { status: 500 }
      );
    }

    // 3. Create lookup maps
    const squareMap = new Map<string, number>(); // square_customer_id -> birthday month
    for (const sc of squareCustomers) {
      if (sc.birthday) {
        const month = parseInt(sc.birthday.split("-")[1], 10);
        if (month >= 1 && month <= 12) {
          squareMap.set(sc.id, month);
        }
      }
    }

    // Also create email lookup for clients without square_customer_id
    const emailMap = new Map<string, number>();
    for (const sc of squareCustomers) {
      if (sc.birthday && sc.email_address) {
        const month = parseInt(sc.birthday.split("-")[1], 10);
        if (month >= 1 && month <= 12) {
          emailMap.set(sc.email_address.toLowerCase(), month);
        }
      }
    }

    // 4. Update clients with birthday_month where needed
    let updated = 0;
    let alreadySet = 0;
    let noMatch = 0;
    const errors: string[] = [];

    for (const client of dbClients || []) {
      const squareBirthMonth = client.square_customer_id
        ? squareMap.get(client.square_customer_id)
        : undefined;

      if (squareBirthMonth) {
        if (client.birthday_month !== squareBirthMonth) {
          const { error: updateError } = await supabase
            .from("clients")
            .update({ birthday_month: squareBirthMonth })
            .eq("id", client.id);

          if (updateError) {
            errors.push(`Update ${client.id}: ${updateError.message}`);
          } else {
            updated++;
          }
        } else {
          alreadySet++;
        }
      } else {
        noMatch++;
      }
    }

    // 5. Also try to match clients by email if they don't have square_customer_id
    const { data: clientsNoSquareId } = await supabase
      .from("clients")
      .select("id, email, birthday_month")
      .is("square_customer_id", null)
      .not("email", "is", null);

    let emailMatched = 0;
    for (const client of clientsNoSquareId || []) {
      if (!client.email) continue;
      const birthMonth = emailMap.get(client.email.toLowerCase());
      if (birthMonth && client.birthday_month !== birthMonth) {
        const { error: updateError } = await supabase
          .from("clients")
          .update({ birthday_month: birthMonth })
          .eq("id", client.id);

        if (!updateError) {
          emailMatched++;
          updated++;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      squareCustomersWithBirthdays: squareCustomers.length,
      dbClientsProcessed: (dbClients?.length || 0) + (clientsNoSquareId?.length || 0),
      updated,
      alreadySet,
      noMatch,
      emailMatched,
      errors: errors.slice(0, 10),
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
