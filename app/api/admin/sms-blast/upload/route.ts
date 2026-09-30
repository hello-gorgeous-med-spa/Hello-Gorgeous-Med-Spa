import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/sms-blast/upload
 * Upload Square CSV to populate sms_contacts
 * 
 * Expected CSV columns:
 * - Customer ID, First Name, Last Name, Email Address, Phone Number
 * - Creation Date, Total Spent, Visit Count
 * - Marketing Emails Subscribed (Yes/No for consent)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV is empty or invalid" }, { status: 400 });
    }

    // Parse header
    const header = parseCSVLine(lines[0]);
    const phoneIdx = findColumnIndex(header, ["phone", "phone number", "mobile"]);
    const firstNameIdx = findColumnIndex(header, ["first name", "firstname", "first"]);
    const lastNameIdx = findColumnIndex(header, ["last name", "lastname", "last"]);
    const emailIdx = findColumnIndex(header, ["email", "email address"]);
    const customerIdIdx = findColumnIndex(header, ["customer id", "id"]);
    const totalSpentIdx = findColumnIndex(header, ["total spent", "lifetime value", "spent"]);
    const consentIdx = findColumnIndex(header, ["marketing", "subscribed", "consent", "opt-in"]);

    if (phoneIdx === -1) {
      return NextResponse.json({ error: "Phone column not found in CSV" }, { status: 400 });
    }

    const results = { imported: 0, skipped: 0, errors: [] as string[] };

    // Process rows
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      const phone = normalizePhone(row[phoneIdx]);

      if (!phone) {
        results.skipped++;
        continue;
      }

      // Check consent (if column exists)
      let hasConsent = true;
      if (consentIdx !== -1) {
        const consentValue = (row[consentIdx] || "").toLowerCase().trim();
        hasConsent = consentValue === "yes" || consentValue === "true" || consentValue === "1";
      }

      if (!hasConsent) {
        results.skipped++;
        continue;
      }

      const firstName = row[firstNameIdx] || null;
      const lastName = row[lastNameIdx] || null;
      const email = row[emailIdx] || null;
      const customerId = row[customerIdIdx] || null;
      const totalSpent = parseFloat(row[totalSpentIdx]) || 0;

      // Upsert contact
      const { error } = await supabase
        .from("sms_contacts")
        .upsert(
          {
            phone,
            first_name: firstName,
            last_name: lastName,
            email,
            square_customer_id: customerId,
            lifetime_value: totalSpent,
            consent_date: new Date().toISOString(),
            consent_source: "square_csv",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "phone" }
        );

      if (error) {
        if (results.errors.length < 5) {
          results.errors.push(`Row ${i + 1}: ${error.message}`);
        }
      } else {
        results.imported++;
      }
    }

    return NextResponse.json({
      success: true,
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors,
    });
  } catch (error) {
    console.error("CSV upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** Parse a single CSV line, handling quoted fields */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/** Find column index by possible names */
function findColumnIndex(header: string[], possibleNames: string[]): number {
  const lower = header.map((h) => h.toLowerCase().trim());
  for (const name of possibleNames) {
    const idx = lower.indexOf(name);
    if (idx !== -1) return idx;
  }
  return -1;
}

/** Normalize phone to E.164 format */
function normalizePhone(raw: string | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}
