import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { getUTMFromRequest, recordLead } from "@/lib/leads";
import { alertStaffOnFormSubmission } from "@/lib/notifications/form-alert";
import { HELLO_GORGEOUS_SERVICES } from "@/lib/proposals/seed-services";
import {
  autoGenerateOptions,
  calculateTotal,
  defaultQuantityForService,
  hasRxConsultServices,
  type ProposalService,
} from "@/lib/proposals/utils";
import { SITE } from "@/lib/seo";
import { BUILD_YOUR_PROPOSAL_PATH } from "@/lib/build-your-proposal-marketing";

export const dynamic = "force-dynamic";

function text(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function arr(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean)
    .slice(0, 40);
}

function createPublicId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
}

/** Re-price from catalog — never trust client-sent dollar amounts. */
function hydrateServices(raw: unknown): ProposalService[] {
  if (!Array.isArray(raw)) return [];
  const out: ProposalService[] = [];
  for (const item of raw.slice(0, 40)) {
    if (!item || typeof item !== "object") continue;
    const id = text((item as { id?: unknown }).id, 80);
    const catalog = HELLO_GORGEOUS_SERVICES.find((service) => service.id === id);
    if (!catalog) continue;
    if (out.some((s) => s.id === id)) continue;
    const qtyRaw = Number((item as { quantity?: unknown }).quantity);
    const quantity = Number.isFinite(qtyRaw)
      ? Math.max(1, Math.min(500, Math.round(qtyRaw)))
      : defaultQuantityForService(catalog);
    out.push({ ...catalog, quantity });
  }
  return out;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

    if (text(body.hp, 200)) return NextResponse.json({ success: true });

    const clientName = text(body.clientName, 160);
    const email = text(body.email, 220).toLowerCase();
    const phone = text(body.phone, 40);
    const concerns = arr(body.concerns);
    const notes = text(body.notes, 4000);
    const consent = body.consent === true;
    const selectedServices = hydrateServices(body.services);

    if (!clientName || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
    }
    if (!selectedServices.length) {
      return NextResponse.json({ error: "Add at least one treatment or package." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json(
        { error: "Please confirm this is an educational estimate and you’ll book a consult." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });

    const options = autoGenerateOptions(selectedServices);
    const publicId = createPublicId();
    const recommended = options[1] || options[0];
    const recommendedTotal = recommended ? calculateTotal(recommended) : 0;

    const utm = getUTMFromRequest(request.url || "", request.headers.get("referer"));
    await recordLead(supabase, {
      email,
      phone,
      full_name: clientName,
      source: "website",
      lead_type: "contact_form",
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      referrer: utm.referrer,
      metadata: {
        form: "build_your_proposal_v1",
        service_ids: selectedServices.map((s) => s.id),
        recommended_total: recommendedTotal,
      },
    });

    const rxConsultRequired = hasRxConsultServices(selectedServices);

    const { data: proposal, error: proposalError } = await supabase
      .from("treatment_proposals")
      .insert({
        public_id: publicId,
        client_name: clientName,
        client_email: email,
        client_phone: phone,
        concerns,
        options,
        client_instructions: notes || null,
        internal_notes: rxConsultRequired
          ? `[RX] Public builder submission from ${BUILD_YOUR_PROPOSAL_PATH} — consult required before payment`
          : `Public builder submission from ${BUILD_YOUR_PROPOSAL_PATH}`,
        created_by: "public-builder",
        status: "sent",
        sent_at: new Date().toISOString(),
        rx_requires_consult: rxConsultRequired,
      })
      .select("id,public_id")
      .single();

    if (proposalError || !proposal) {
      console.error("[public/build-proposal]", proposalError);
      return NextResponse.json({ error: "Could not save your proposal. Please call us." }, { status: 500 });
    }

    const proposalUrl = `${SITE.url}/proposals/${proposal.public_id}`;
    const serviceSummary = selectedServices
      .map((s) => `${s.name}${s.quantity > 1 ? ` ×${s.quantity}` : ""}`)
      .join(", ");

    void alertStaffOnFormSubmission({
      formName: "Build your treatment proposal",
      emailSubject: rxConsultRequired
        ? `🩺 [RX CONSULT] New proposal — ${clientName} (~$${recommendedTotal.toFixed(0)})`
        : `New website proposal — ${clientName} (~$${recommendedTotal.toFixed(0)})`,
      emailBody: [
        `${clientName} built a treatment proposal on the website.`,
        rxConsultRequired
          ? "⚠️ RX ITEMS INCLUDED — CONSULT REQUIRED before payment link / checkout."
          : "",
        `Recommended estimate: $${recommendedTotal.toFixed(2)}`,
        `Services: ${serviceSummary}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        notes ? `Notes: ${notes}` : "",
        `Share link: ${proposalUrl}`,
        `Admin: ${SITE.url}/admin/proposals/${proposal.id}/preview`,
      ]
        .filter(Boolean)
        .join("\n"),
      smsLines: [
        rxConsultRequired ? "🩺 RX CONSULT" : "",
        clientName,
        `~$${recommendedTotal.toFixed(0)}`,
        phone,
        serviceSummary.slice(0, 80),
      ].filter(Boolean),
      replyTo: email,
    });

    return NextResponse.json({
      success: true,
      proposalUrl,
      publicId: proposal.public_id,
      recommendedTotal,
    });
  } catch (error) {
    console.error("[public/build-proposal]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
