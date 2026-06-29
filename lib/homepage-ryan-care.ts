/**
 * Homepage band — Ryan with patient (below hero).
 * @see public/images/team/ryan-kent.png
 */

import { RYAN_FULL_NAME, RYAN_PATIENT_CARE_IMAGE } from "@/lib/founder-credentials";
import { BOOKING_URL, HG_RX_TELEHEALTH_BOOKING_URL } from "@/lib/flows";

export const HOMEPAGE_RYAN_CARE = {
  image: RYAN_PATIENT_CARE_IMAGE,
  imageAlt:
    "Ryan Kent, FNP-BC examining a young patient at Hello Gorgeous Med Spa in Oswego, Illinois",
  eyebrow: "Medical Director · On site 7 days a week",
  headline: RYAN_FULL_NAME,
  body:
    "Board-certified Family Nurse Practitioner with full prescriptive authority in Illinois. GLP-1, hormones, peptides, injectables, and telehealth — supervised in person, not from a remote letterhead.",
  primaryCta: { label: "Meet Ryan", href: "/about#ryan" },
  secondaryCta: { label: "Book a visit", href: BOOKING_URL },
  tertiaryCta: { label: "Telehealth", href: HG_RX_TELEHEALTH_BOOKING_URL, external: true },
} as const;
