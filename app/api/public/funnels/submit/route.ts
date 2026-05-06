import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { getUTMFromRequest, recordLead } from "@/lib/leads";
import { inferNurtureWorkflowIds } from "@/lib/nurture-workflows";

type FunnelPayload = {
  funnel?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  concernType?: unknown;
  treatmentInterest?: unknown;
  urgency?: unknown;
  budgetRange?: unknown;
  contactPreference?: unknown;
};

function text(value: unknown, max = 200): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as FunnelPayload | null;
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const funnel = text(body.funnel, 80);
  const name = text(body.name, 160);
  const email = text(body.email, 200).toLowerCase();
  const phone = text(body.phone, 40);
  const concernType = text(body.concernType, 120);
  const treatmentInterest = text(body.treatmentInterest, 120);
  const urgency = text(body.urgency, 40);
  const budgetRange = text(body.budgetRange, 40);
  const contactPreference = text(body.contactPreference, 40);
  const nurtureWorkflowIds = inferNurtureWorkflowIds(concernType, treatmentInterest);

  if (!funnel || !name || !email || !phone || !concernType || !treatmentInterest || !urgency || !budgetRange || !contactPreference) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });

  const utm = getUTMFromRequest(request.url || "", request.headers.get("referer"));

  await recordLead(supabase, {
    email,
    phone,
    full_name: name,
    source: "website",
    lead_type: "consultation_funnel",
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    referrer: utm.referrer,
    metadata: {
      funnel,
      concern_type: concernType,
      treatment_interest: treatmentInterest,
      urgency,
      budget_range: budgetRange,
      contact_preference: contactPreference,
        nurture_workflow_ids: nurtureWorkflowIds,
      routing: {
        booking: "/book",
        sms_followup: true,
        email_automation: true,
        consultation_workflow: true,
      },
    },
  });

  return NextResponse.json({ success: true });
}
