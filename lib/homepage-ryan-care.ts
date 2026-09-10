/**
 * Homepage medical-care band (below hero).
 */

import { DANI_FULL_NAME, ABOUT_DANI_IMAGE } from "@/lib/founder-credentials";
import { BOOKING_URL } from "@/lib/flows";
import { MEDICAL_DIRECTOR } from "@/lib/medical-authority";

export const HOMEPAGE_RYAN_CARE = {
  image: ABOUT_DANI_IMAGE,
  imageAlt:
    `${DANI_FULL_NAME} at Hello Gorgeous Med Spa in Oswego, Illinois`,
  eyebrow: "MD Oversight · Illinois clinician review",
  headline: MEDICAL_DIRECTOR.displayName,
  body:
    "Physician Medical Director for Hello Gorgeous. GLP-1, hormones, peptides, injectables, and telehealth — prescribed only after a licensed Illinois clinician reviews your request.",
  primaryCta: { label: "Meet the team", href: "/about" },
  secondaryCta: { label: "Book a visit", href: BOOKING_URL },
  tertiaryCta: { label: "Contact us", href: "/contact", external: false },
} as const;
