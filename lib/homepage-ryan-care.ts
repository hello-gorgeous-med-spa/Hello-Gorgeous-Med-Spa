/**
 * Homepage medical-care band (below hero).
 */

import { RYAN_FULL_NAME, RYAN_IMAGE } from "@/lib/founder-credentials";
import { BOOKING_URL } from "@/lib/flows";
import { MEDICAL_DIRECTOR } from "@/lib/medical-authority";

export const HOMEPAGE_RYAN_CARE = {
  image: RYAN_IMAGE,
  imageAlt:
    `${RYAN_FULL_NAME} at Hello Gorgeous Med Spa in Oswego, Illinois`,
  eyebrow: "RE GEN RX · Prescriber",
  headline: RYAN_FULL_NAME,
  body:
    `Ryan Kent, FNP-BC writes RE GEN RX prescriptions — GLP-1, hormones, and peptides — after a consult. Physician Medical Director ${MEDICAL_DIRECTOR.displayName} oversees the program.`,
  primaryCta: { label: "Meet the team", href: "/about" },
  secondaryCta: { label: "Book a visit", href: BOOKING_URL },
  tertiaryCta: { label: "Contact us", href: "/contact", external: false },
} as const;
