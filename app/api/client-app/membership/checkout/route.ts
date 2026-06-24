// POST { membershipId } — Square recurring membership checkout
import { NextRequest, NextResponse } from "next/server";

import { CLIENT_APP } from "@/lib/client-app";
import { SITE } from "@/lib/seo";
import { createMembershipCheckoutUrl } from "@/lib/square/membership-checkout";
import { findWellnessMembershipPlan } from "@/lib/wellness-memberships";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { membershipId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const membershipId = String(body?.membershipId || "").trim();
  if (!membershipId) {
    return NextResponse.json({ error: "membershipId is required" }, { status: 400 });
  }

  const plan = findWellnessMembershipPlan(membershipId);
  if (!plan) {
    return NextResponse.json({ error: "Unknown membership" }, { status: 404 });
  }

  if (plan.consultFirst) {
    return NextResponse.json(
      {
        error: "This plan requires a consult before enrollment.",
        bookUrl: plan.bookHref,
        learnMoreUrl: plan.learnMoreHref,
      },
      { status: 400 },
    );
  }

  if (plan.squarePayUrl) {
    return NextResponse.json({ url: plan.squarePayUrl, mode: "square_link" });
  }

  try {
    const result = await createMembershipCheckoutUrl({
      membershipId: plan.id,
      name: plan.name,
      priceDollars: plan.pricePerMonth,
      redirectUrl: `${SITE.url}${CLIENT_APP.path}?membership=success`,
    });
    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[client-app/membership/checkout]", msg);
    return NextResponse.json(
      { error: "Could not start membership checkout. Please call us to join." },
      { status: 500 },
    );
  }
}
