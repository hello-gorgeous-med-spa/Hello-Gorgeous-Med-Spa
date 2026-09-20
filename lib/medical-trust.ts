import { DANI_FULL_NAME, DANI_IMAGE, RYAN_FULL_NAME, RYAN_IMAGE } from "@/lib/founder-credentials";
import { KRISTINA_FULL_NAME, KRISTINA_IMAGE } from "@/lib/kristina-huda";
import {
  MEDICAL_DIRECTOR,
  MEDICAL_DIRECTOR_AFFILIATIONS,
  MEDICAL_DIRECTOR_GRADUATED,
  MEDICAL_DIRECTOR_SPECIALTY,
  PRESCRIBING_NP,
  medicalDirectorPersonJsonLd,
} from "@/lib/medical-authority";
import { MEDICAL_TEAM_QUOTE } from "@/lib/medical-optimization";

/** Canonical Medical Director name — owned by `lib/medical-authority`. */
export const DR_ARORA_FULL_NAME = MEDICAL_DIRECTOR.displayName;

/** Dani’s clinical + ownership credentials — listed on the medical trust surface. */
export const DANI_CLINICAL_CREDENTIALS = [
  "Owner & Founder",
  "RN-S",
  "CNA",
  "CMAA",
  "Licensed Phlebotomist",
  "Licensed Esthetician",
] as const;

export const MEDICAL_TRUST_PROVIDERS = [
  {
    name: DANI_FULL_NAME,
    role: "Owner & Founder · Practice leadership",
    detail: "RN-S · CNA · CMAA · Licensed Phlebotomist · Licensed Esthetician",
    image: DANI_IMAGE,
    imageAlt: `${DANI_FULL_NAME}, Owner & Founder of Hello Gorgeous Med Spa, in clinic with Solaria`,
    badge: "Owner · in clinic daily",
    href: "/about",
  },
  {
    name: RYAN_FULL_NAME,
    role: "Prescriber · RE GEN RX",
    detail: "FNP-BC · intakes, labs, and prescription protocols",
    image: RYAN_IMAGE,
    imageAlt: `${RYAN_FULL_NAME}, RE GEN RX prescriber at Hello Gorgeous Med Spa`,
    badge: "RE GEN RX · prescriber",
    href: PRESCRIBING_NP.profilePath,
  },
  {
    name: KRISTINA_FULL_NAME,
    role: "RN Injector",
    detail: "Neuromodulators · fillers · IVs · wellness support",
    image: KRISTINA_IMAGE,
    imageAlt: `${KRISTINA_FULL_NAME}, RN injector at Hello Gorgeous Med Spa`,
    badge: "RN injector",
    href: "/meet-the-team#kristina-huda",
  },
  {
    name: DR_ARORA_FULL_NAME,
    role: `Medical Director · ${MEDICAL_DIRECTOR_SPECIALTY}`,
    detail: "30+ years · physician Medical Director for Hello Gorgeous",
    image: MEDICAL_DIRECTOR.image,
    imageAlt: `${DR_ARORA_FULL_NAME}, Medical Director at Hello Gorgeous Med Spa`,
    badge: "Medical Director",
    href: MEDICAL_DIRECTOR.profilePath,
  },
] as const;

/** Full medical leadership row — Danielle, Ryan, Kristina, Dr. Arora. */
export const MD_OVERSIGHT_TEAM = MEDICAL_TRUST_PROVIDERS;

/** @deprecated Prefer MD_OVERSIGHT_TEAM. */
export const MD_OVERSIGHT_PAIR = MEDICAL_TRUST_PROVIDERS;

export const DR_ARORA_PROFILE = {
  name: DR_ARORA_FULL_NAME,
  credentialsLine: `Medical Director · ${MEDICAL_DIRECTOR_SPECIALTY} · 30+ years of experience`,
  graduated: MEDICAL_DIRECTOR_GRADUATED,
  affiliations: MEDICAL_DIRECTOR_AFFILIATIONS,
  whyWeChoseHim: [
    "Patients describe him as a provider who takes time — never rushed.",
    "Strong listening and clear communication come up again and again.",
    "Long-term relationships spanning decades speak to reliability and care.",
    "That patient-first style is exactly the Medical Director culture we want behind Hello Gorgeous.",
  ] as const,
  patientThemes: [
    {
      title: "Never rushed",
      body: "Patients say he takes time with them and never makes them feel hurried through a visit.",
    },
    {
      title: "Excellent listener",
      body: "Reviewers highlight listening and communication — questions answered, concerns heard.",
    },
    {
      title: "Decades of trust",
      body: "Several note long-term relationships spanning decades, praising a caring, reliable approach.",
    },
  ] as const,
} as const;

export const MEDICAL_TRUST_BADGES = [
  "MD Medical Director",
  "Ryan Kent, FNP-BC · RE GEN RX",
  "Kristina Huda, BSN, RN · injector",
  "Owner · RN-S · CNA · CMAA",
  "Consult-first RX",
  "Illinois telehealth licensed",
] as const;

/** Crawlable / AEO blurb — keep in HTML even when UI uses a Learn more modal. */
export const DR_ARORA_SEO_BLURB =
  "Dr. Mukesh Arora, MD is Medical Director of Hello Gorgeous Med Spa in Oswego, Illinois. Internal Medicine with 30+ years of experience. Graduated Ggs Medical College, 1991. Affiliated with Advocate Good Shepherd Hospital and Northwestern Medicine McHenry Hospital. Hello Gorgeous chose Dr. Arora as Medical Director for patient-first leadership: unhurried visits, clear communication, and long-term trust. Prescriptions are written by Ryan Kent, FNP-BC; the practice is owned by Danielle Alcala-Glazier.";

/**
 * Standalone `Person` schema for Google. Identity and credentials come from
 * `lib/medical-authority`; the AEO blurb replaces the factual description because
 * this node is emitted on marketing surfaces.
 */
export function aroraPersonJsonLd(siteUrl = "https://www.hellogorgeousmedspa.com") {
  return {
    "@context": "https://schema.org",
    ...medicalDirectorPersonJsonLd(siteUrl),
    description: DR_ARORA_SEO_BLURB,
  };
}

/** Ryan in-clinic clips — family, not patient marketing. */
export const RYAN_CLINIC_VIDEOS = [
  {
    src: "/videos/team/ryan-clinic-consult.mp4",
    poster: "/images/team/ryan-clinic-consult-poster.jpg",
    label: "Ryan Kent, FNP-BC in the Oswego clinic",
    caption: "In clinic",
    aspectClassName: "aspect-video",
  },
  {
    src: "/videos/team/ryan-clinic-family.mp4",
    poster: "/images/team/ryan-clinic-family-poster.jpg",
    label: "Ryan Kent, FNP-BC in the Hello Gorgeous clinic",
    caption: "This is us",
    aspectClassName: "aspect-[9/16]",
  },
] as const;

/** Storefront plaque copy + asset — keep site and door sign aligned. */
export const STOREFRONT_TRUST_SIGN = {
  image: "/images/storefront/md-oversight-sign.png",
  line1: "MD OVERSIGHT",
  line2: "Physician-directed medical spa",
  line3: "Come in — we're friendly",
  alt: "Hello Gorgeous Med Spa: MD Oversight. Come in — we're friendly.",
} as const;

export { MEDICAL_TEAM_QUOTE };
