import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { requireMarketingAccess } from "@/lib/api-auth";
import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";
import { normalizeToE164 } from "@/lib/phone-e164";
import { getStaffPortalPin, pinMatches } from "@/lib/staff-session";
import {
  countIvBags,
  EMPTY_VIP_GLOW_DETAILS,
  formatGlowGoals,
  VIP_GLOW_CAMPAIGN,
  VIP_GLOW_SLOTS,
  VIP_GLOW_TREATMENTS,
  type VipGlowDetails,
  type VipGlowTreatmentId,
} from "@/lib/vip-glow-night";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const TREATMENT_IDS = new Set(VIP_GLOW_TREATMENTS.map((t) => t.id));
const SLOT_SET = new Set<string>(VIP_GLOW_SLOTS);

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function cleanDetails(raw: unknown): VipGlowDetails {
  const d = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    botoxUnits: String(d.botoxUnits ?? "").trim().slice(0, 12),
    ivChoice: String(d.ivChoice ?? "").trim().slice(0, 40),
    vitaminChoice: String(d.vitaminChoice ?? "").trim().slice(0, 40),
    fillerArea: String(d.fillerArea ?? "").trim().slice(0, 40),
    browStyle: String(d.browStyle ?? "").trim().slice(0, 40),
  };
}

function cleanTreatments(raw: unknown): VipGlowTreatmentId[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((id) => String(id))
    .filter((id): id is VipGlowTreatmentId => TREATMENT_IDS.has(id as VipGlowTreatmentId));
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
    const phoneRaw = String(body?.phone ?? "").trim();
    const email = String(body?.email ?? "").trim().slice(0, 120).toLowerCase();
    const timeSlot = String(body?.timeSlot ?? "").trim();
    const treatments = cleanTreatments(body?.treatments);
    const details = cleanDetails(body?.details);
    const bringingGuest = Boolean(body?.bringingGuest);
    const guestName = String(body?.guestName ?? "").trim().slice(0, 80);
    const guestPhone = String(body?.guestPhone ?? "").trim();
    const guestEmail = String(body?.guestEmail ?? "").trim().slice(0, 120);
    const guestTreatments = bringingGuest ? cleanTreatments(body?.guestTreatments) : [];
    const guestDetails = bringingGuest ? cleanDetails(body?.guestDetails) : { ...EMPTY_VIP_GLOW_DETAILS };

    const phone = normalizeToE164(phoneRaw);
    if (!name || !phone || !SLOT_SET.has(timeSlot) || treatments.length === 0) {
      return NextResponse.json(
        { success: false, error: "Add your name, phone, time slot, and at least one glow goal." },
        { status: 400 },
      );
    }
    if (bringingGuest && (!guestName || !normalizeToE164(guestPhone))) {
      return NextResponse.json(
        { success: false, error: "Add guest name & phone or set guest to No." },
        { status: 400 },
      );
    }

    const qualification = {
      timeSlot,
      clientTreatments: treatments,
      clientDetails: details,
      bringingGuest,
      guestName: bringingGuest ? guestName : undefined,
      guestPhone: bringingGuest ? normalizeToE164(guestPhone) : undefined,
      guestEmail: bringingGuest && guestEmail ? guestEmail : undefined,
      guestTreatments: bringingGuest ? guestTreatments : undefined,
      guestDetails: bringingGuest ? guestDetails : undefined,
    };

    const row = {
      id: crypto.randomUUID(),
      time: timeSlot,
      clientName: name,
      clientPhone: phone,
      clientEmail: email || undefined,
      clientTreatments: treatments,
      clientDetails: details,
      guestName: qualification.guestName,
      guestPhone: qualification.guestPhone,
      guestEmail: qualification.guestEmail,
      guestTreatments: qualification.guestTreatments,
      guestDetails: qualification.guestDetails,
      createdAt: new Date().toISOString(),
    };

    const supabase = getSupabase();
    let savedId = row.id;
    if (supabase) {
      const { data, error } = await supabase
        .from("vip_waitlist")
        .insert({
          campaign: VIP_GLOW_CAMPAIGN,
          name,
          email: email || `${phone.replace(/\D/g, "")}@rsvp.local`,
          phone,
          concerns: treatments,
          qualification_data: qualification,
          crm_tag: "VIP_GLOW_NIGHT",
          status: "pending",
        })
        .select("id")
        .single();
      if (error) {
        console.error("[vip-glow/rsvp] db", error);
        return NextResponse.json({ success: false, error: "Could not save RSVP. Please try again." }, { status: 500 });
      }
      savedId = data?.id ?? savedId;
    }

    const guestWants = formatGlowGoals(guestTreatments, guestDetails);
    const clientWants = formatGlowGoals(treatments, details);
    const ivBags = countIvBags(treatments, guestTreatments);

    void alertStaffOnFormSubmission({
      formName: "VIP Glow Night RSVP",
      emailSubject: `VIP Glow RSVP — ${name} · ${timeSlot}`,
      emailBody: [
        `Time: ${timeSlot}`,
        `Client: ${name} · ${phone}${email ? ` · ${email}` : ""}`,
        `Wants: ${clientWants}`,
        bringingGuest ? `Guest: ${guestName} · ${qualification.guestPhone ?? ""}` : "Guest: no",
        bringingGuest ? `Guest wants: ${guestWants || "—"}` : null,
        `IV bags to make: ${ivBags}`,
      ]
        .filter(Boolean)
        .join("\n"),
      smsLines: [timeSlot, name, clientWants, bringingGuest ? `+ ${guestName}` : "solo", `IV ${ivBags}`],
      replyTo: email || undefined,
    });

    return NextResponse.json({ success: true, id: savedId, rsvp: { ...row, id: savedId } });
  } catch (err) {
    console.error("[vip-glow/rsvp]", err);
    return NextResponse.json({ success: false, error: "Something went wrong. Call 630-636-6193." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!staffMayRead(request)) {
    return NextResponse.json({ error: "Staff access required" }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ entries: [], source: "local" });
  }

  const { data, error } = await supabase
    .from("vip_waitlist")
    .select("id, name, email, phone, concerns, qualification_data, created_at")
    .eq("campaign", VIP_GLOW_CAMPAIGN)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[vip-glow/rsvp] list", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const entries = (data ?? []).map((row) => {
    const q = (row.qualification_data ?? {}) as Record<string, unknown>;
    const clientTreatments = Array.isArray(q.clientTreatments)
      ? (q.clientTreatments as string[])
      : Array.isArray(row.concerns)
        ? row.concerns
        : [];
    const guestTreatments = Array.isArray(q.guestTreatments) ? (q.guestTreatments as string[]) : [];
    const clientDetails = (q.clientDetails ?? {}) as VipGlowDetails;
    const guestDetails = (q.guestDetails ?? {}) as VipGlowDetails;
    return {
      id: row.id,
      time: String(q.timeSlot ?? ""),
      clientName: row.name,
      clientPhone: row.phone,
      clientEmail: row.email,
      clientWants: formatGlowGoals(clientTreatments, clientDetails),
      guestName: typeof q.guestName === "string" ? q.guestName : "",
      guestWants: formatGlowGoals(guestTreatments, guestDetails),
      ivBags: countIvBags(clientTreatments, guestTreatments),
      createdAt: row.created_at,
    };
  });

  return NextResponse.json({ entries, total: entries.length });
}
