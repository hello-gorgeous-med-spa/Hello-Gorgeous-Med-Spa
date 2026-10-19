import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  GOLDEN_TICKET_CAMPAIGN,
  GOLDEN_TICKET_CRM_TAG,
  GOLDEN_TICKET_PACKAGES,
  type GoldenTicketPackageId,
} from "@/lib/campaigns/golden-ticket-2026";
import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";
import { normalizeToE164 } from "@/lib/phone-e164";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const PACKAGE_IDS = new Set(GOLDEN_TICKET_PACKAGES.map((p) => p.id));

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const name = String(body?.name ?? "").trim().slice(0, 80);
    const email = String(body?.email ?? "").trim().slice(0, 120).toLowerCase();
    const phone = normalizeToE164(String(body?.phone ?? "").trim());
    const packageId = String(body?.packageId ?? "").trim() as GoldenTicketPackageId;
    const notes = String(body?.notes ?? "").trim().slice(0, 500);

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Add your name and a valid phone number." },
        { status: 400 },
      );
    }
    if (!PACKAGE_IDS.has(packageId)) {
      return NextResponse.json(
        { success: false, error: "Choose a Golden Ticket package." },
        { status: 400 },
      );
    }

    const pkg = GOLDEN_TICKET_PACKAGES.find((p) => p.id === packageId)!;

    const supabase = getSupabase();
    let savedId = crypto.randomUUID();
    if (supabase) {
      const { data, error } = await supabase
        .from("vip_waitlist")
        .insert({
          campaign: GOLDEN_TICKET_CAMPAIGN,
          name,
          email: email || `${phone.replace(/\D/g, "")}@request.local`,
          phone,
          concerns: [pkg.flyerName],
          qualification_data: {
            packageId,
            ticketPriceUsd: pkg.ticketPriceUsd,
            containsMedication: pkg.containsMedication,
            notes: notes || undefined,
            source: "golden-ticket-page",
          },
          crm_tag: GOLDEN_TICKET_CRM_TAG,
          status: "pending",
        })
        .select("id")
        .single();
      if (error) {
        console.error("[golden-ticket/request] db", error);
        return NextResponse.json(
          { success: false, error: "Could not save your request. Call (630) 636-6193." },
          { status: 500 },
        );
      }
      savedId = data?.id ?? savedId;
    }

    void alertStaffOnFormSubmission({
      formName: "Golden Ticket request",
      emailSubject: `Golden Ticket — ${pkg.shortName} · ${name}`,
      emailBody: [
        `Package: ${pkg.flyerName} ($${pkg.ticketPriceUsd.toLocaleString()})`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        notes ? `Notes: ${notes}` : null,
        pkg.containsMedication
          ? "Medication-related collection — consult first, no online checkout."
          : "Face collection — Square checkout is live.",
      ]
        .filter(Boolean)
        .join("\n"),
      smsLines: [pkg.shortName, `$${pkg.ticketPriceUsd}`, name, phone],
      replyTo: email || undefined,
    });

    return NextResponse.json({ success: true, id: savedId, packageId });
  } catch (err) {
    console.error("[golden-ticket/request]", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Call (630) 636-6193." },
      { status: 500 },
    );
  }
}
