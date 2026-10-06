/**
 * Homepage medical-care band (below hero).
 */

import { LICENSED_CLINICIAN_PHRASE, MEDICAL_DIRECTOR } from "@/lib/medical-authority";
import { BOOKING_URL } from "@/lib/flows";

export const HOMEPAGE_RYAN_CARE = {
  image: MEDICAL_DIRECTOR.image,
  imageAlt:
    `${MEDICAL_DIRECTOR.displayName} at Hello Gorgeous Med Spa in Oswego, Illinois`,
  eyebrow: "RE GEN RX · Prescriber",
  headline: LICENSED_CLINICIAN_PHRASE,
  body:
    `a licensed Illinois clinician writes RE GEN RX prescriptions — GLP-1, hormones, and peptides — after a consult. Physician Medical Director ${MEDICAL_DIRECTOR.displayName} oversees the program.`,
  primaryCta: { label: "Meet the team", href: "/about" },
  secondaryCta: { label: "Book a visit", href: BOOKING_URL },
  tertiaryCta: { label: "Contact us", href: "/contact", external: false },
} as const;
