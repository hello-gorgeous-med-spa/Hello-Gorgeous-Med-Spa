import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { requireMarketingAccess } from "@/lib/api-auth";
import { MEDSPA_OPS_EMAIL } from "@/lib/business-contact";
import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";
import { normalizeToE164 } from "@/lib/phone-e164";
import {
  BPC157_REFILL_CAMPAIGN,
  bpc157RedFlags,
  EMPTY_BPC157_REFILL,
  validateBpc157Refill,
  type Bpc157RefillForm,
} from "@/lib/regen/bpc-157-refill-screening";
import {
  formatRequestPrice,
  REGEN_REFILL_REQUEST_CAMPAIGN,
  regenRequestSkuById,
} from "@/lib/regen/refill-request-catalog";
import { getStaffPortalPin, pinMatches } from "@/lib/staff-session";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const OPS_INBOX = "hello@hellogorgeousmedspa.com";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function splitName(name: string): { first_name: string; last_name: string } {
  const parts = String(name || "").trim().split(/\s+/);
  return {
    first_name: parts[0] || name,
    last_name: parts.slice(1).join(" ") || "",
  };
}

function cleanForm(raw: unknown): Bpc157RefillForm {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const next = { ...EMPTY_BPC157_REFILL };
  for (const key of Object.keys(next) as Array<keyof Bpc157RefillForm>) {
    if (key === "ack") {
      next.ack = Boolean(r.ack);
      continue;
    }
    if (key === "improvement") {
      const n = Number(r.improvement);
      next.improvement = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
      continue;
    }
    if (key === "conditions") {
      next.conditions = Array.isArray(r.conditions)
        ? r.conditions.map((c) => String(c).slice(0, 40)).slice(0, 12)
        : [];
      continue;
    }
    next[key] = String(r[key] ?? "").slice(0, key === "signature" ? 80 : 500) as never;
  }
  return next;
}

function staffMayRead(request: NextRequest): boolean {
  const pin = getStaffPortalPin();
  const offered = request.headers.get("x-staff-pin")?.trim() || "";
  if (pin && offered && pinMatches(offered, pin)) return true;
  const auth = requireMarketingAccess(request);
  return !("error" in auth);
}

async function upsertPatient(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  form: Bpc157RefillForm,
  phone: string,
): Promise<string | null> {
  const { first_name, last_name } = splitName(form.fullName);
  const email = form.email.toLowerCase();
  const { data: existing } = await supabase
    .from("regen_patients")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing?.id) {
    await supabase
      .from("regen_patients")
      .update({
        first_name,
        last_name,
        phone,
        date_of_birth: form.dob || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    return existing.id;
  }
  const { data: created, error } = await supabase
    .from("regen_patients")
    .insert({
      email,
      first_name,
      last_name,
      phone,
      date_of_birth: form.dob || null,
      state: "IL",
    })
    .select("id")
    .single();
  if (error) {
    console.error("[regen/refill-screening] patient", error);
    return null;
  }
  return created?.id ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const form = cleanForm(await request.json().catch(() => null));
    const errors = validateBpc157Refill(form);
    const sku = regenRequestSkuById(form.skuId);
    if (!sku) errors.skuId = "Select a protocol";
    if (Object.keys(errors).length) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }
    if (!sku) {
      return NextResponse.json({ success: false, error: "Select a protocol." }, { status: 400 });
    }
    const phone = normalizeToE164(form.phone);
    if (!phone) {
      return NextResponse.json({ success: false, error: "Valid phone required." }, { status: 400 });
    }

    const flags = bpc157RedFlags(form);
    const intentLabel = form.requestIntent === "add" ? "add-on" : "refill";
    const priceLabel = formatRequestPrice(sku);
    const row = {
      ...form,
      phone,
      redFlags: flags,
      productName: sku.name,
      skuCode: sku.sku,
      priceLabel,
      submittedAt: new Date().toISOString(),
    };

    const supabase = getSupabase();
    let id = crypto.randomUUID();
    if (supabase) {
      const patientId = await upsertPatient(supabase, form, phone);

      const { data, error } = await supabase
        .from("vip_waitlist")
        .insert({
          campaign: REGEN_REFILL_REQUEST_CAMPAIGN,
          name: form.fullName,
          email: form.email.toLowerCase(),
          phone,
          concerns: flags,
          qualification_data: row,
          crm_tag: form.requestIntent === "add" ? "REGEN_ADD_REQUEST" : "REGEN_REFILL_REQUEST",
          status: "pending",
        })
        .select("id")
        .single();
      if (error) {
        console.error("[regen/refill-screening] db", error);
        return NextResponse.json({ success: false, error: "Could not save screening." }, { status: 500 });
      }
      id = data?.id ?? id;

      const { error: intakeError } = await supabase.from("regen_intakes").insert({
        patient_id: patientId,
        name: form.fullName,
        email: form.email.toLowerCase(),
        phone,
        goal: intentLabel,
        medical_history: {
          source: "regen_refill_request",
          requestIntent: form.requestIntent,
          skuId: sku.id,
          sku: sku.sku,
          productName: sku.name,
          pack: sku.pack,
          retailUsd: sku.retailUsd,
          shippingUsd: sku.shippingUsd,
          priceLabel,
          screening: row,
        },
        current_medications: form.newMeds ? [form.newMeds] : [],
        allergies: [],
        state: "IL",
        verified_illinois: true,
        amount_paid: 0,
        status: "pending",
      });
      if (intakeError) {
        console.error("[regen/refill-screening] intake", intakeError);
      }
    }

    void alertStaffOnFormSubmission({
      formName: `REGEN ${intentLabel} — ${sku.name}`,
      emailSubject: `${form.requestIntent === "add" ? "Add-on" : "Refill"} — ${sku.name} · ${form.fullName}${
        flags.length ? " · RED FLAGS" : ""
      }`,
      emailBody: [
        `Intent: ${intentLabel}`,
        `Protocol: ${sku.name}${sku.sku !== "review" ? ` · SKU ${sku.sku}` : ""}`,
        `Patient price: ${priceLabel}`,
        `Name: ${form.fullName}`,
        `DOB: ${form.dob}`,
        `Phone: ${phone}`,
        `Email: ${form.email}`,
        `Form: ${form.formType} · ${form.strength}`,
        `Improvement: ${form.improvement}%`,
        `Adherence: ${form.adherence}`,
        `Pregnant/TTC: ${form.pregnant}`,
        `New meds: ${form.newMeds}`,
        `Goal next cycle: ${form.nextGoal}`,
        flags.length ? `RED FLAGS: ${flags.join("; ")}` : "No red flags",
        `Queue: /regen/ops`,
      ].join("\n"),
      smsLines: [
        form.fullName,
        `${intentLabel} ${sku.name}`,
        priceLabel,
        flags.length ? `HOLD ${flags.length} flags` : "no flags",
        phone,
      ],
      replyTo: form.email,
      alsoTo: [MEDSPA_OPS_EMAIL, OPS_INBOX],
    });

    return NextResponse.json({ success: true, id, redFlags: flags });
  } catch (err) {
    console.error("[regen/refill-screening]", err);
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
    .select("id, name, email, phone, concerns, qualification_data, created_at, status")
    .in("campaign", [REGEN_REFILL_REQUEST_CAMPAIGN, BPC157_REFILL_CAMPAIGN])
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const entries = (data ?? []).map((row) => {
    const q = (row.qualification_data ?? {}) as Record<string, unknown>;
    return {
      id: row.id,
      createdAt: row.created_at,
      name: row.name,
      email: row.email,
      phone: row.phone,
      requestIntent: String(q.requestIntent ?? ""),
      skuName: String(q.productName ?? q.skuId ?? ""),
      priceLabel: String(q.priceLabel ?? ""),
      formType: String(q.formType ?? ""),
      strength: String(q.strength ?? ""),
      improvement: Number(q.improvement ?? 0),
      adherence: String(q.adherence ?? ""),
      pregnant: String(q.pregnant ?? ""),
      redFlags: Array.isArray(row.concerns) ? row.concerns : [],
      status: row.status,
    };
  });

  return NextResponse.json({ entries, total: entries.length });
}
