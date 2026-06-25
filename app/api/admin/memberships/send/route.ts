import { NextRequest, NextResponse } from "next/server";

import {
  getAdminMembership,
  membershipCheckoutEligible,
} from "@/lib/admin-memberships-catalog";
import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  emailClientMembershipLink,
  smsClientMembershipLink,
} from "@/lib/membership-notify";
import { CLIENT_APP } from "@/lib/client-app";
import { SITE } from "@/lib/seo";
import { createMembershipCheckoutUrl } from "@/lib/square/membership-checkout";

export const dynamic = "force-dynamic";

type Delivery = "link" | "email" | "sms" | "both";

function parseDelivery(raw: unknown): Delivery {
  if (raw === "email" || raw === "sms" || raw === "both") return raw;
  return "link";
}

/**
 * POST /api/admin/memberships/send
 * Return a Square membership checkout URL and optionally email/text the client.
 */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  let body: {
    membershipId?: string;
    clientName?: string;
    email?: string;
    phone?: string;
    delivery?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const membershipId = String(body.membershipId || "").trim();
  const plan = getAdminMembership(membershipId);
  if (!plan) {
    return NextResponse.json({ error: "Unknown membership plan" }, { status: 404 });
  }

  if (plan.inactive) {
    return NextResponse.json({ error: "This membership is not active on the site yet" }, { status: 400 });
  }

  if (plan.consultFirst) {
    return NextResponse.json(
      {
        error: "This plan requires an NP consult before enrollment.",
        bookHref: plan.bookHref,
        learnMoreHref: plan.learnMoreHref,
      },
      { status: 400 },
    );
  }

  const clientName = String(body.clientName || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const delivery = parseDelivery(body.delivery);

  if (delivery === "email" || delivery === "both") {
    if (!email) {
      return NextResponse.json({ error: "Client email is required to send by email" }, { status: 400 });
    }
  }
  if (delivery === "sms" || delivery === "both") {
    if (!phone) {
      return NextResponse.json({ error: "Client phone is required to send by text" }, { status: 400 });
    }
  }

  let url: string;
  let mode: "static" | "subscription";

  if (plan.squarePayUrl) {
    url = plan.squarePayUrl;
    mode = "static";
  } else if (membershipCheckoutEligible(plan)) {
    try {
      const result = await createMembershipCheckoutUrl({
        membershipId: plan.id,
        name: plan.name,
        priceDollars: plan.pricePerMonth,
        redirectUrl: `${SITE.url}${CLIENT_APP.path}?membership=success`,
      });
      url = result.url;
      mode = "subscription";
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[admin/memberships/send]", msg);
      return NextResponse.json(
        { error: "Could not create Square membership checkout. Connect Square or paste a payment link in catalog." },
        { status: 503 },
      );
    }
  } else {
    return NextResponse.json({ error: "This plan is not available for self-serve checkout" }, { status: 400 });
  }

  const notify: { email?: { ok: boolean; error?: string }; sms?: { ok: boolean; error?: string } } = {};

  if (delivery === "email" || delivery === "both") {
    notify.email = await emailClientMembershipLink({
      to: email,
      clientName,
      planName: plan.name,
      priceLabel: plan.priceLabel,
      url,
    });
  }

  if (delivery === "sms" || delivery === "both") {
    notify.sms = await smsClientMembershipLink({
      phone,
      clientName,
      planName: plan.name,
      priceLabel: plan.priceLabel,
      url,
    });
  }

  const deliveryFailed =
    (notify.email && !notify.email.ok) || (notify.sms && !notify.sms.ok);

  return NextResponse.json({
    ok: !deliveryFailed || delivery === "link",
    url,
    mode,
    plan: {
      id: plan.id,
      name: plan.name,
      priceLabel: plan.priceLabel,
      category: plan.category,
    },
    notify,
    sentBy: auth.user.email,
    sentAt: new Date().toISOString(),
  });
}
