/**
 * Public “Build your treatment proposal” marketing tool.
 * Canonical: /build-your-proposal
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { CHERRY_PAY_URL } from "@/lib/flows";

export const BUILD_YOUR_PROPOSAL_PATH = "/build-your-proposal" as const;

export const BUILD_YOUR_PROPOSAL_NAV = {
  label: "Build your proposal",
  href: BUILD_YOUR_PROPOSAL_PATH,
  sub: "Packages, injectables, peptides & more — get a live estimate",
} as const;

export const BUILD_YOUR_PROPOSAL_MARKETING = {
  path: BUILD_YOUR_PROPOSAL_PATH,
  eyebrow: "Plan your visit · Oswego, IL",
  headline: "Build your treatment proposal",
  accent: "proposal",
  subhead:
    "Pick packages, Botox units, InMode treatments, peptides, or weight loss — see estimated Good / Better / Best plans, then send it to our team. We’ll refine medical fit at consult.",
  trustLine: "Educational estimate only · NP-directed care · Cherry financing available",
  bookHref: PRIMARY_BOOKING_CTA.href,
  cherryHref: CHERRY_PAY_URL,
  phoneDisplay: "(630) 636-6193",
  phoneHref: "tel:16306366193",
} as const;
