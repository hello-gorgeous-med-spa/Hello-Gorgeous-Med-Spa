/**
 * Phase 6 — Illinois market positioning & conversion hierarchy.
 * Use on heroes, trust bands, and closing CTAs — not stuffed into metadata.
 */

import { PRIMARY_BOOKING_CTA, SECONDARY_PATIENT_ACTIONS } from "@/lib/primary-cta";

export const ILLINOIS_EXCELLENCE = {
  eyebrow: "Fox Valley · Chicagoland",
  headline: "Built to be Illinois's most trusted med spa",
  subline:
    "MD oversight · FNP-BC on site. Medical programs with real labs — not cookie-cutter aesthetics. Oswego roots, statewide telehealth RX.",
  proofChips: [
    "MD oversight · FNP-BC on site",
    "NP-supervised prescriptions",
    "4.4★ Google · 5.0★ Fresha",
    "Ship-to-home RX · In-clinic aesthetics",
  ] as const,
} as const;

/** Sitewide conversion order — primary booking first, account actions second. */
export const CONVERSION_HIERARCHY = {
  primary: PRIMARY_BOOKING_CTA,
  secondary: SECONDARY_PATIENT_ACTIONS,
  rxCatalog: { label: "Shop RE GEN", href: "/rx" as const },
  exploreCare: { label: "Explore care", href: "/explore-care" as const },
} as const;
