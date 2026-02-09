// ============================================================
// MARKETING CONTACT IMPORT API
// POST /api/marketing/import
// Body: { contacts: [{ email, first_name, last_name?, phone? }] }
// Creates/updates users and clients with referral_source 'marketing_import', sets marketing_preferences.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("placeholder")) return null;
  try {
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

function normalizeEmail(email: string): string | null {
  const e = (email || "").trim().toLowerCase();
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

function normalizePhone(phone: string): string | null {
  const p = (phone || "").replace(/\D/g, "");
  if (p.length >= 10) return p.length === 10 ? `+1${p}` : `+${p}`;
  return null;
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const raw = body.contacts;
    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json(
        { error: "Send a JSON body with contacts: [{ email, first_name, last_name?, phone? }]" },
        { status: 400 }
      );
    }

    const results = { imported: 0, updated: 0, skipped: 0, errors: [] as { row: number; email?: string; error: string }[] };

    for (let i = 0; i < raw.length; i++) {
      const row = raw[i] as Record<string, unknown>;
      const email = normalizeEmail(String(row.email ?? row.Email ?? ""));
      const first_name = String(row.first_name ?? row.firstName ?? row["First Name"] ?? "").trim() || "Subscriber";
      const last_name = String(row.last_name ?? row.lastName ?? row["Last Name"] ?? "").trim();
      const phone = normalizePhone(String(row.phone ?? row.Phone ?? row["Phone"] ?? ""));

      if (!email) {
        results.skipped++;
        continue;
      }

      try {
        const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single();
        let userId: string;

        if (existingUser?.id) {
          userId = existingUser.id;
          await supabase
            .from("users")
            .update({
              first_name: first_name || "Subscriber",
              last_name: last_name,
              phone: phone || null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
          const { data: existingClient } = await supabase.from("clients").select("id").eq("user_id", userId).single();
          if (!existingClient) {
            await supabase.from("clients").insert({
              user_id: userId,
              referral_source: "marketing_import",
              accepts_email_marketing: true,
              accepts_sms_marketing: !!phone,
            });
          }
          results.updated++;
        } else {
          const { data: newUser, error: userError } = await supabase
            .from("users")
            .insert({
              email,
              first_name: first_name || "Subscriber",
              last_name: last_name || "",
              phone: phone || null,
              role: "client",
            })
            .select("id")
            .single();

          if (userError) {
            results.errors.push({ row: i + 1, email, error: userError.message });
            continue;
          }
          userId = newUser.id;

          await supabase.from("clients").insert({
            user_id: userId,
            referral_source: "marketing_import",
            accepts_email_marketing: true,
            accepts_sms_marketing: !!phone,
          });
          results.imported++;
        }

        await supabase
          .from("marketing_preferences")
          .upsert(
            {
              user_id: userId,
              email_opt_in: true,
              sms_opt_in: !!phone,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );
      } catch (err: any) {
        results.errors.push({ row: i + 1, email, error: err?.message || "Unknown error" });
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error: any) {
    console.error("Marketing import error:", error);
    return NextResponse.json(
      { error: error?.message || "Import failed" },
      { status: 500 }
    );
  }
}
