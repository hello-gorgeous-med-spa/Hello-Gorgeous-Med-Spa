/**
 * Phase 7 — local SEO + Google Maps behavior signals (reviews, directions, book).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const LOCAL_DOMINANCE_ACTIONS = [
  {
    id: "book",
    label: PRIMARY_BOOKING_CTA.label,
    href: PRIMARY_BOOKING_CTA.href,
    external: false,
    primary: true,
  },
  {
    id: "directions",
    label: "Get directions",
    href: SITE.googleBusinessUrl,
    external: true,
    primary: false,
  },
  {
    id: "review",
    label: "Review us on Google",
    href: SITE.googleReviewUrl,
    external: true,
    primary: false,
  },
  {
    id: "call",
    label: `Call ${SITE.phone}`,
    href: `tel:${SITE.phone.replace(/\D/g, "")}`,
    external: false,
    primary: false,
  },
] as const;

export const LOCAL_DOMINANCE_TAGLINE =
  "Downtown Oswego — clients drive from Naperville, Aurora, Plainfield, Yorkville & across Illinois.";
