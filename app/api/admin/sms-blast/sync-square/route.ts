import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { squareApiFetch } from "@/lib/square/http";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for large customer lists

interface SquareCustomer {
  id: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  preferences?: {
    email_unsubscribed?: boolean;
  };
  created_at?: string;
}

interface SquareListCustomersResponse {
  customers?: SquareCustomer[];
  cursor?: string;
}

/**
 * POST /api/admin/sms-blast/sync-square
 * Pull all customers from Square and import into sms_contacts
 */
export async function POST() {
  try {
    const supabase = await createServerClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = { imported: 0, skipped: 0, total: 0 };
    let cursor: string | undefined;

    // Paginate through all customers
    do {
      const path = cursor
        ? `/v2/customers?limit=100&cursor=${cursor}`
        : `/v2/customers?limit=100`;

      const res = await squareApiFetch<SquareListCustomersResponse>(path);

      if (!res.ok) {
        return NextResponse.json(
          { error: `Square API error: ${res.error}` },
          { status: 500 }
        );
      }

      const customers = res.data.customers || [];
      results.total += customers.length;

      for (const customer of customers) {
        // Normalize phone
        const phone = normalizePhone(customer.phone_number);
        if (!phone) {
          results.skipped++;
          continue;
        }

        // Skip if email unsubscribed (proxy for SMS consent in Square)
        if (customer.preferences?.email_unsubscribed) {
          results.skipped++;
          continue;
        }

        // Upsert contact
        const { error } = await supabase.from("sms_contacts").upsert(
          {
            phone,
            first_name: customer.given_name || null,
            last_name: customer.family_name || null,
            email: customer.email_address || null,
            square_customer_id: customer.id,
            consent_date: customer.created_at || new Date().toISOString(),
            consent_source: "square_api",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "phone" }
        );

        if (error) {
          console.error("Upsert error:", error.message);
          results.skipped++;
        } else {
          results.imported++;
        }
      }

      cursor = res.data.cursor;
    } while (cursor);

    return NextResponse.json({
      success: true,
      imported: results.imported,
      skipped: results.skipped,
      total: results.total,
    });
  } catch (error) {
    console.error("Square sync error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** Normalize phone to E.164 format */
function normalizePhone(raw: string | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}
