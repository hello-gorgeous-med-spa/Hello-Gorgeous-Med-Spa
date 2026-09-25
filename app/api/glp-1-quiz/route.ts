import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { requireMarketingAccess } from "@/lib/api-auth";
import { MEDSPA_OPS_EMAIL } from "@/lib/business-contact";
import {
  EMPTY_GLP1_QUIZ,
  GLP1_QUIZ_CAMPAIGN,
  absoluteYesFlags,
  bmiLabel,
  computeBmi,
  quizStatus,
  reviewYesFlags,
  validateGlp1Quiz,
  type Glp1QuizForm,
} from "@/lib/glp1-quiz";
import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";
import { normalizeToE164 } from "@/lib/phone-e164";
import { getStaffPortalPin, pinMatches } from "@/lib/staff-session";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function cleanForm(raw: unknown): Glp1QuizForm {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const next = { ...EMPTY_GLP1_QUIZ };
  for (const key of Object.keys(next) as Array<keyof Glp1QuizForm>) {
    if (key.startsWith("ack")) {
      next[key] = Boolean(r[key]) as never;
      continue;
    }
    next[key] = String(r[key] ?? "").slice(0, key === "goals" || key === "meds" ? 800 : 200) as never;
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

function splitName(name: string): { first_name: string; last_name: string } {
  const parts = String(name || "").trim().split(/\s+/);
  return { first_name: parts[0] || name, last_name: parts.slice(1).join(" ") || "" };
}

export async function POST(request: NextRequest) {
  try {
    const form = cleanForm(await request.json().catch(() => null));
    const errors = validateGlp1Quiz(form);
    if (Object.keys(errors).length) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }
    const phone = normalizeToE164(form.phone);
    if (!phone) {
      return NextResponse.json({ success: false, error: "Valid phone required." }, { status: 400 });
    }

    const bmi = computeBmi(form.heightFt, form.heightIn, form.weightLbs);
    const status = quizStatus(form);
    const hard = absoluteYesFlags(form);
    const review = reviewYesFlags(form);
    const brand = request.headers.get("x-regen-host") === "1" ? "regen" : "hg";

    const row = {
      ...form,
      phone,
      bmi,
      bmiLabel: bmiLabel(bmi),
      status,
      hardFlags: hard,
      reviewFlags: review,
      brand,
      submittedAt: new Date().toISOString(),
    };

    const supabase = getSupabase();
    let id = crypto.randomUUID();
    if (supabase) {
      const { first_name, last_name } = splitName(form.fullName);
      const email = form.email.toLowerCase();
      const { data: existing } = await supabase.from("regen_patients").select("id").eq("email", email).maybeSingle();
      let patientId = existing?.id ?? null;
      if (patientId) {
        await supabase
          .from("regen_patients")
          .update({ first_name, last_name, phone, date_of_birth: form.dob || null, updated_at: new Date().toISOString() })
          .eq("id", patientId);
      } else {
        const { data: created } = await supabase
          .from("regen_patients")
          .insert({
            email,
            first_name,
            last_name,
            phone,
            date_of_birth: form.dob || null,
            state: form.state.toUpperCase().slice(0, 2),
          })
          .select("id")
          .single();
        patientId = created?.id ?? null;
      }

      const { data, error } = await supabase
        .from("vip_waitlist")
        .insert({
          campaign: GLP1_QUIZ_CAMPAIGN,
          name: form.fullName,
          email,
          phone,
          concerns: [...hard, ...review],
          qualification_data: row,
          crm_tag:
            status === "disqualified"
              ? "GLP1_QUIZ_DQ"
              : status === "needs_review"
                ? "GLP1_QUIZ_REVIEW"
                : "GLP1_QUIZ_OK",
          status: "pending",
        })
        .select("id")
        .single();
      if (error) {
        console.error("[glp-1-quiz] db", error);
        return NextResponse.json({ success: false, error: "Could not save screening." }, { status: 500 });
      }
      id = data?.id ?? id;

      const { error: intakeError } = await supabase.from("regen_intakes").insert({
        patient_id: patientId,
        name: form.fullName,
        email,
        phone,
        goal: "weight-loss",
        medical_history: {
          source: GLP1_QUIZ_CAMPAIGN,
          glpType: form.glpType,
          reason: form.reason,
          bmi,
          status,
          screening: row,
        },
        current_medications: form.meds ? [form.meds] : [],
        allergies: form.allergies ? [form.allergies] : [],
        state: form.state.toUpperCase().slice(0, 2),
        verified_illinois: form.state.trim().toUpperCase() === "IL",
        amount_paid: 0,
        status: "pending",
      });
      if (intakeError) console.error("[glp-1-quiz] intake", intakeError);
    }

    void alertStaffOnFormSubmission({
      formName: `GLP-1 quiz — ${status}`,
      emailSubject: `GLP-1 quiz · ${status.replace("_", " ")} · ${form.fullName}${hard.length ? " · HOLD" : ""}`,
      emailBody: [
        `Status: ${status}`,
        `Wanted: ${form.glpType} · ${form.reason}`,
        `BMI: ${bmi ?? "—"} ${bmiLabel(bmi)}`,
        `Name: ${form.fullName}`,
        `DOB: ${form.dob}`,
        `Phone: ${phone}`,
        `Email: ${form.email}`,
        `State: ${form.state}`,
        hard.length ? `DISQUALIFY: ${hard.join("; ")}` : "No absolute flags",
        review.length ? `REVIEW: ${review.join("; ")}` : "No review flags",
        `Queue: /regen/ops`,
      ].join("\n"),
      smsLines: [form.fullName, status, form.glpType, bmi ? `BMI ${bmi}` : "", phone],
      replyTo: form.email,
      alsoTo: [MEDSPA_OPS_EMAIL],
    });

    return NextResponse.json({
      success: true,
      id,
      status,
      hardFlags: hard,
      reviewFlags: review,
      bmi,
    });
  } catch (err) {
    console.error("[glp-1-quiz]", err);
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
    .eq("campaign", GLP1_QUIZ_CAMPAIGN)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const entries = (data ?? []).map((row) => {
    const q = (row.qualification_data ?? {}) as Record<string, unknown>;
    return {
      id: row.id,
      createdAt: row.created_at,
      name: row.name,
      email: row.email,
      phone: row.phone,
      bmi: q.bmi,
      glpType: q.glpType,
      quizStatus: q.status,
      mtc: q.mtc,
      men2: q.men2,
      pancreatitis: q.pancreatitis,
      pregnant: q.pregnant,
      redFlags: Array.isArray(row.concerns) ? row.concerns : [],
      status: row.status,
    };
  });

  return NextResponse.json({ entries, total: entries.length });
}
