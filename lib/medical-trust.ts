import { DANI_FULL_NAME, RYAN_FULL_NAME } from "@/lib/founder-credentials";
import { MEDICAL_TEAM_QUOTE } from "@/lib/medical-optimization";

export const MEDICAL_TRUST_PROVIDERS = [
  {
    name: RYAN_FULL_NAME,
    role: "Medical Director · FNP-BC",
    detail: "Full prescriptive authority · on site daily",
    image: "/images/providers/ryan-kent-clinic.jpg",
    imageAlt: `${RYAN_FULL_NAME}, Medical Director at Hello Gorgeous Med Spa`,
  },
  {
    name: DANI_FULL_NAME,
    role: "Founder · Clinical aesthetics",
    detail: "Patient-first care · 7-day downtown Oswego",
    image: "/images/team/danielle.png",
    imageAlt: `${DANI_FULL_NAME}, Founder of Hello Gorgeous Med Spa`,
  },
] as const;

export const MEDICAL_TRUST_BADGES = [
  "MD oversight",
  "FNP-BC on site",
  "NP reviews every RX order",
  "Illinois telehealth licensed",
  "Labs before hormones",
  "No separate RX membership fee",
] as const;

/** Storefront plaque copy + asset — keep site and door sign aligned. */
export const STOREFRONT_TRUST_SIGN = {
  image: "/images/storefront/md-oversight-sign.png",
  line1: "MD OVERSIGHT",
  line2: "Nurse Practitioner On Site (FNP-BC)",
  line3: "Come in — we're friendly",
  alt: "Hello Gorgeous Med Spa: MD Oversight, Nurse Practitioner On Site (FNP-BC). Come in — we're friendly.",
} as const;

export { MEDICAL_TEAM_QUOTE };
