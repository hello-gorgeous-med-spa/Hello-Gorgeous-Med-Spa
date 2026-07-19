// ============================================================
// SQUARE MEMBERSHIP CHECKOUT — subscription plans + payment links
// Creates/upserts catalog subscription plans, then returns a hosted
// Square checkout URL for recurring billing.
// ============================================================

import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getAccessToken } from "@/lib/square/oauth";
import { getSquareLocationIdAsync, getLocationsApiAsync } from "@/lib/square/client";
import type { PeptideSubscriptionPlanIds, PeptideSubscriptionPlanMap } from "@/lib/regen/peptide-subscription-plans";

const SQUARE_API_HOST =
  process.env.SQUARE_ENVIRONMENT === "production" || process.env.SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

const SQUARE_API_VERSION = "2025-04-16";

function idempotencyKey(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Pre-created RE GEN peptide plans from scripts/square-upsert-peptide-subscription-plans.mjs */
function loadPeptideSubscriptionPlanMap(): PeptideSubscriptionPlanMap {
  try {
    const raw = readFileSync(join(process.cwd(), "data/peptide-subscription-plans.json"), "utf8");
    const parsed = JSON.parse(raw) as { plans?: PeptideSubscriptionPlanMap };
    return parsed.plans && typeof parsed.plans === "object" ? parsed.plans : {};
  } catch {
    return {};
  }
}

function lookupCachedPlan(
  membershipId: string,
  priceCents?: number,
): PeptideSubscriptionPlanIds | null {
  const map = loadPeptideSubscriptionPlanMap();
  const hit = map[membershipId];
  if (!hit?.planId || !hit?.variationId || hit.planId.startsWith("#")) return null;
  if (priceCents != null && Math.abs(hit.priceCents - priceCents) > 100) return null;
  return hit;
}

async function squareFetch<T>(
  path: string,
  init: RequestInit & { body?: unknown } = {},
): Promise<T> {
  const token = (await getAccessToken()) || process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error("Square is not connected");

  const { body, ...rest } = init;
  const res = await fetch(`${SQUARE_API_HOST}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as T & {
    errors?: Array<{ detail?: string; code?: string }>;
  };
  if (!res.ok) {
    const msg =
      data.errors?.map((e) => e.detail || e.code).join("; ") ||
      `Square API ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function resolveSquareLocationId(): Promise<string> {
  // Try env var first (fastest, most reliable)
  const envLocationId = process.env.SQUARE_LOCATION_ID;
  if (envLocationId) return envLocationId;

  try {
    const locationId = await getSquareLocationIdAsync();
    if (locationId) return locationId;

    const locationsApi = await getLocationsApiAsync();
    const res = await locationsApi?.listLocations?.();
    const locations =
      (res as { result?: { locations?: Array<{ id?: string; status?: string }> } })?.result
        ?.locations ??
      (res as { locations?: Array<{ id?: string; status?: string }> })?.locations ??
      [];
    const active = locations.find((l) => l?.status === "ACTIVE") ?? locations[0];
    if (!active?.id) throw new Error("No Square location configured");
    return active.id;
  } catch (err) {
    console.error("[Square] Failed to resolve location ID:", err);
    throw new Error("No Square location configured - set SQUARE_LOCATION_ID env var");
  }
}

type PlanIds = { planId: string; variationId: string };

/** Upsert a monthly subscription plan in Square Catalog (correct nested variation shape). */
async function ensureSubscriptionPlan(
  membershipId: string,
  name: string,
  priceCents: number,
): Promise<PlanIds> {
  const cached = lookupCachedPlan(membershipId, priceCents);
  if (cached) {
    return { planId: cached.planId, variationId: cached.variationId };
  }

  const tempPlanId = `#hg-membership-${membershipId}`.slice(0, 46);
  const tempVarId = `#hg-membership-${membershipId}-mo`.slice(0, 46);
  const planName = name.startsWith("RE GEN") || name.startsWith("Hello Gorgeous")
    ? name
    : `Hello Gorgeous — ${name}`;

  const body = {
    idempotency_key: idempotencyKey(`plan-${membershipId}`),
    object: {
      type: "SUBSCRIPTION_PLAN",
      id: tempPlanId,
      subscription_plan_data: {
        name: planName,
        subscription_plan_variations: [
          {
            type: "SUBSCRIPTION_PLAN_VARIATION",
            id: tempVarId,
            subscription_plan_variation_data: {
              name: "Monthly",
              phases: [
                {
                  cadence: "MONTHLY",
                  ordinal: 0,
                  pricing: {
                    type: "STATIC",
                    price_money: { amount: priceCents, currency: "USD" },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  };

  const data = await squareFetch<{
    catalog_object?: {
      id: string;
      subscription_plan_data?: {
        subscription_plan_variations?: Array<{ id: string }>;
      };
    };
  }>("/v2/catalog/object", { method: "POST", body });

  const obj = data.catalog_object;
  if (!obj?.id) throw new Error("Failed to create subscription plan");

  const variationId =
    obj.subscription_plan_data?.subscription_plan_variations?.[0]?.id ?? tempVarId;

  return { planId: obj.id, variationId };
}

/** First-month one-time payment when subscription API isn't authorized yet. */
async function createFirstMonthCheckoutUrl(opts: {
  membershipId: string;
  name: string;
  priceDollars: number;
  redirectUrl: string;
}): Promise<MembershipCheckoutResult> {
  const locationId = await resolveSquareLocationId();
  const linkData = await squareFetch<{
    payment_link?: {
      id?: string;
      order_id?: string;
      url?: string;
      long_url?: string;
    };
  }>("/v2/online-checkout/payment-links", {
    method: "POST",
    body: {
      idempotency_key: idempotencyKey(`m1-${opts.membershipId}`),
      quick_pay: {
        name: `${opts.name} — first month`,
        price_money: {
          amount: Math.round(opts.priceDollars * 100),
          currency: "USD",
        },
        location_id: locationId,
      },
      checkout_options: {
        redirect_url: opts.redirectUrl,
        ask_for_shipping_address: false,
      },
      description: `Hello Gorgeous membership — ${opts.name} (month 1). Recurring billing set up at your visit.`,
    },
  });

  const url = linkData.payment_link?.url || linkData.payment_link?.long_url;
  if (!url) throw new Error("Could not create first-month checkout link");
  return {
    url,
    mode: "first_month",
    paymentLinkId: linkData.payment_link?.id,
    orderId: linkData.payment_link?.order_id,
  };
}

export type MembershipCheckoutResult = {
  url: string;
  /** subscription = recurring Square billing; first_month = one-time until Square scopes updated */
  mode: "subscription" | "first_month";
  paymentLinkId?: string;
  orderId?: string;
};

/** Create a Square hosted checkout URL for a monthly membership. */
export async function createMembershipCheckoutUrl(opts: {
  membershipId: string;
  name: string;
  priceDollars: number;
  redirectUrl: string;
}): Promise<MembershipCheckoutResult> {
  const priceCents = Math.round(opts.priceDollars * 100);
  try {
    const { variationId } = await ensureSubscriptionPlan(
      opts.membershipId,
      opts.name,
      priceCents,
    );

    const locationId = await resolveSquareLocationId();

    // Square Checkout API: checkout_options.subscription_plan_id must be the
    // SUBSCRIPTION_PLAN_VARIATION id (naming is confusing). quick_pay is required
    // and should match the variation's phase price.
    const linkData = await squareFetch<{
      payment_link?: {
        id?: string;
        order_id?: string;
        url?: string;
        long_url?: string;
      };
    }>("/v2/online-checkout/payment-links", {
      method: "POST",
      body: {
        idempotency_key: idempotencyKey(`mlink-${opts.membershipId}`),
        quick_pay: {
          name: opts.name,
          price_money: { amount: priceCents, currency: "USD" },
          location_id: locationId,
        },
        checkout_options: {
          subscription_plan_id: variationId,
          redirect_url: opts.redirectUrl,
          ask_for_shipping_address: false,
        },
        description: `Hello Gorgeous RX — ${opts.name} · recurring monthly after NP approval`,
      },
    });

    const url = linkData.payment_link?.url || linkData.payment_link?.long_url;
    if (!url) throw new Error("Could not create membership checkout link");
    return {
      url,
      mode: "subscription",
      paymentLinkId: linkData.payment_link?.id,
      orderId: linkData.payment_link?.order_id,
    };
  } catch (subErr) {
    console.warn(
      "[membership-checkout] Subscription flow unavailable, using first-month payment:",
      subErr instanceof Error ? subErr.message : subErr,
    );
    const url = await createFirstMonthCheckoutUrl(opts);
    return url;
  }
}
