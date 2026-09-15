/**
 * VIP model program is filled. Fall follow-on: $500 off any area
 * when purchased in September or October 2026. Cherry 0% for qualified clients.
 */

import { CHERRY_PAY_URL } from "@/lib/flows";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export const VIP_500_OFF_USD = 500;

export const VIP_500_OFF_CAMPAIGN = {
  name: "VIP model spots filled — $500 off any area",
  badge: "Spots filled",
  path: "/vip-model" as const,
  validThrough: "October 31, 2026",
  validUntilIso: "2026-10-31",
  bookHref: PRIMARY_BOOKING_CTA.href,
  cherryHref: `${CHERRY_PAY_URL}${CHERRY_PAY_URL.includes("?") ? "&" : "?"}utm_campaign=vip_500_off_fall_2026`,
} as const;

export const VIP_500_OFF_COPY = {
  banner: "All 20 VIP model spots are filled — thank you",
  eyebrow: "September & October",
  headline: "$500 off any area",
  subhead:
    "Our VIP model program is complete. If you purchase any treatment area in September or October, you get $500 off. 0% financing available through Cherry for qualified clients.",
  offerNote: "Must be purchased in September or October 2026. Consult required. Results vary.",
  cherryLabel: "Apply with Cherry — 0% financing",
  bookLabel: "Book a consult",
} as const;
