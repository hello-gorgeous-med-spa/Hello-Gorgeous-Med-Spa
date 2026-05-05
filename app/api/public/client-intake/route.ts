import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { getUTMFromRequest, recordLead } from "@/lib/leads";
import { HELLO_GORGEOUS_SERVICES } from "@/lib/proposals/seed-services";
import { autoGenerateOptions, type ProposalService } from "@/lib/proposals/utils";

export const dynamic = "force-dynamic";

type IntakePayload = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  dob?: unknown;
  contactMethod?: unknown;
  aestheticGoals?: unknown;
  treatments?: unknown;
  areas?: unknown;
  conditions?: unknown;
  allergies?: unknown;
  budget?: unknown;
  timeline?: unknown;
  financing?: unknown;
  referralSource?: unknown;
  referredBy?: unknown;
  additionalNotes?: unknown;
  consentPrivacy?: unknown;
  consentCommunication?: unknown;
  consentMedicalAccuracy?: unknown;
  hp?: unknown;
};

function text(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function arr(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean)
    .slice(0, 50);
}

function bool(value: unknown): boolean {
  return value === true;
}

function mapTreatmentsToServices(treatments: string[]): ProposalService[] {
  const map: Record<string, string> = {
    morpheus8: "morpheus8-face",
    co2: "solaria-co2-full",
    rf: "quantum-rf",
    weightloss: "glp1-semaglutide",
    botox: "botox",
    filler: "dermal-filler",
    prp: "prp-facial",
    facial: "hydrafacial",
    "chemical-peel": "ipl-photofacial",
    microneedling: "morpheus8-face",
  };

  return treatments
    .map((slug) => map[slug])
    .filter(Boolean)
    .map((id) => HELLO_GORGEOUS_SERVICES.find((service) => service.id === id))
    .filter((service): service is (typeof HELLO_GORGEOUS_SERVICES)[number] => Boolean(service))
    .reduce<ProposalService[]>((acc, service) => {
      if (acc.some((s) => s.id === service.id)) return acc;
      acc.push({ ...service, quantity: 1 });
      return acc;
    }, []);
}

function createPublicId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as IntakePayload | null;
    if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

    // Honeypot spam field. Silent success blocks bot retries.
    if (text(body.hp, 200)) return NextResponse.json({ success: true });

    const firstName = text(body.firstName, 120);
    const lastName = text(body.lastName, 120);
    const fullName = `${firstName} ${lastName}`.trim();
    const email = text(body.email, 220).toLowerCase();
    const phone = text(body.phone, 40);
    const dob = text(body.dob, 40);
    const contactMethod = text(body.contactMethod, 40);
    const goals = text(body.aestheticGoals, 4000);
    const treatments = arr(body.treatments);
    const areas = arr(body.areas);
    const conditions = arr(body.conditions);
    const allergies = text(body.allergies, 1500);
    const budget = text(body.budget, 80);
    const timeline = text(body.timeline, 80);
    const financing = text(body.financing, 80);
    const referralSource = text(body.referralSource, 120);
    const referredBy = text(body.referredBy, 200);
    const additionalNotes = text(body.additionalNotes, 4000);

    const consentPrivacy = bool(body.consentPrivacy);
    const consentCommunication = bool(body.consentCommunication);
    const consentMedicalAccuracy = bool(body.consentMedicalAccuracy);

    if (!firstName || !lastName || !email || !phone || !dob || !goals) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
    }
    if (!treatments.length) {
      return NextResponse.json({ error: "Please choose at least one treatment of interest." }, { status: 400 });
    }
    if (!consentPrivacy || !consentCommunication || !consentMedicalAccuracy) {
      return NextResponse.json({ error: "Please accept all required consent statements." }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const utm = getUTMFromRequest(request.url || "", request.headers.get("referer"));
    await recordLead(supabase, {
      email,
      phone,
      full_name: fullName,
      source: "website",
      lead_type: "contact_form",
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      referrer: utm.referrer,
      metadata: {
        intake_form: "enhanced_client_intake_v1",
        contact_method: contactMethod || null,
        treatments,
        areas,
        conditions,
        budget: budget || null,
        timeline: timeline || null,
        financing: financing || null,
        referral_source: referralSource || null,
      },
    });

    const selectedServices = mapTreatmentsToServices(treatments);
    const options = selectedServices.length
      ? autoGenerateOptions(selectedServices)
      : [
          {
            name: "Consultation Plan",
            services: [],
            discountType: "package" as const,
            discountValue: 0,
            timeline: [],
          },
        ];

    const internalNotes = [
      `DOB: ${dob}`,
      `Preferred contact: ${contactMethod || "not specified"}`,
      `Areas: ${areas.join(", ") || "not specified"}`,
      `Conditions: ${conditions.join(", ") || "none selected"}`,
      `Allergies: ${allergies || "none provided"}`,
      `Budget: ${budget || "not specified"}`,
      `Timeline: ${timeline || "not specified"}`,
      `Financing: ${financing || "not specified"}`,
      `Referral source: ${referralSource || "not specified"}`,
      `Referred by: ${referredBy || "n/a"}`,
      `Additional notes: ${additionalNotes || "none"}`,
      "",
      `Intake goals: ${goals}`,
    ].join("\n");

    const concerns = Array.from(new Set([...areas, ...treatments]));

    const { data: proposal, error: proposalError } = await supabase
      .from("treatment_proposals")
      .insert({
        public_id: createPublicId(),
        client_name: fullName,
        client_email: email,
        client_phone: phone,
        concerns,
        options,
        internal_notes: internalNotes,
        created_by: "public-intake",
        status: "draft",
      })
      .select("id")
      .single();

    if (proposalError) {
      console.error("[public-client-intake] proposal create error", proposalError);
      return NextResponse.json({ error: "Could not save intake right now. Please call us." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      proposalId: proposal.id,
    });
  } catch (error) {
    console.error("[public-client-intake]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
