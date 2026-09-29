import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { requireMarketingAccess } from "@/lib/api-auth";
import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";
import { normalizeToE164 } from "@/lib/phone-e164";
import { getStaffPortalPin, pinMatches } from "@/lib/staff-session";
import { UPNEEQ_CAMPAIGN } from "@/lib/upneeq-marketing";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function staffMayRead(request: NextRequest): boolean {
  const pin = getStaffPortalPin();
  const offered = request.headers.get("x-staff-pin")?.trim() || "";
  if (pin && offered && pinMatches(offered, pin)) return true;
  const auth = requireMarketingAccess(request);
  return !("error" in auth);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const name = String(body?.name ?? "").trim().slice(0, 80);
    const email = String(body?.email ?? "").trim().slice(0, 120).toLowerCase();
    const phone = normalizeToE164(String(body?.phone ?? "").trim());
    const brand = body?.brand === "regen" ? "regen" : "hg";
    const consent = Boolean(body?.consent);

    if (!name || !phone || !email || !email.includes("@") || !consent) {
      return NextResponse.json(
        { success: false, error: "Add your name, phone, email, and check the consult box." },
        { status: 400 },
      );
    }

    const qualification = {
      brand,
      consent: true,
      source: brand === "regen" ? "tryregenrx.com/upneeq" : "hellogorgeousmedspa.com/upneeq",
      submittedAt: new Date().toISOString(),
    };

    const supabase = getSupabase();
    let savedId = crypto.randomUUID();
    if (supabase) {
      const { data, error } = await supabase
        .from("vip_waitlist")
        .insert({
          campaign: UPNEEQ_CAMPAIGN,
          name,
          email,
          phone,
          concerns: ["upneeq"],
          qualification_data: qualification,
          crm_tag: "UPNEEQ_WAITLIST",
          status: "pending",
        })
        .select("id")
        .single();
      if (error) {
        console.error("[upneeq-waitlist] db", error);
        return NextResponse.json({ success: false, error: "Could not save. Please try again." }, { status: 500 });
      }
      savedId = data?.id ?? savedId;
    }

    void alertStaffOnFormSubmission({
      formName: "Upneeq waitlist",
      emailSubject: `Upneeq waitlist — ${name} · ${brand}`,
      emailBody: [`Name: ${name}`, `Phone: ${phone}`, `Email: ${email}`, `Door: ${brand}`].join("\n"),
      smsLines: [name, phone, brand],
      replyTo: email,
    });

    return NextResponse.json({ success: true, id: savedId });
  } catch (err) {
    console.error("[upneeq-waitlist]", err);
    return NextResponse.json({ success: false, error: "Something went wrong. Call 630-636-6193." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!staffMayRead(request)) {
    return NextResponse.json({ error: "Staff access required" }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ entries: [] });

  const { data, error } = await supabase
    .from("vip_waitlist")
    .select("id, name, email, phone, qualification_data, created_at, status")
    .eq("campaign", UPNEEQ_CAMPAIGN)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    entries: (data ?? []).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      name: row.name,
      email: row.email,
      phone: row.phone,
      brand: (row.qualification_data as { brand?: string } | null)?.brand ?? "hg",
      status: row.status,
    })),
  });
}
