/**
 * Phase 6 — Illinois market positioning & conversion hierarchy.
 * Use on heroes, trust bands, and closing CTAs — not stuffed into metadata.
 */

import { PRIMARY_BOOKING_CTA, SECONDARY_PATIENT_ACTIONS } from "@/lib/primary-cta";

export const ILLINOIS_EXCELLENCE = {
  eyebrow: "Fox Valley · Chicagoland",
  headline: "Built to be Illinois's most trusted med spa",
  subline:
    "NP on site 7 days a week. Medical programs with real labs — not cookie-cutter aesthetics. Oswego roots, statewide telehealth RX.",
  proofChips: [
    "NP-supervised prescriptions",
    "4.4★ Google · 5.0★ Fresha",
    "Ship-to-home RX · In-clinic aesthetics",
    "Serving Oswego to Naperville & beyond",
  ] as const,
} as const;

/** Sitewide conversion order — primary booking first, account actions second. */
export const CONVERSION_HIERARCHY = {
  primary: PRIMARY_BOOKING_CTA,
  secondary: SECONDARY_PATIENT_ACTIONS,
  rxCatalog: { label: "Browse RX catalog", href: "/rx/catalog" as const },
  exploreCare: { label: "Explore care", href: "/explore-care" as const },
} as const;
