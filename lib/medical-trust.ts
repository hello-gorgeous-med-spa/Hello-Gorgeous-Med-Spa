import { DANI_FULL_NAME, RYAN_FULL_NAME } from "@/lib/founder-credentials";
import { MEDICAL_TEAM_QUOTE } from "@/lib/medical-optimization";

export const DR_ARORA_FULL_NAME = "Dr. Mukesh Arora, MD";

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
    role: "Owner & Founder · Clinical leadership",
    detail: "RN-S · CNA · CMAA · Licensed Phlebotomist · Licensed Esthetician",
    image: "/images/team/danielle.png",
    imageAlt: `${DANI_FULL_NAME}, Owner & Founder of Hello Gorgeous Med Spa`,
    badge: "Owner · in clinic daily",
  },
  {
    name: DR_ARORA_FULL_NAME,
    role: "Medical Director · Internal Medicine",
    detail: "30+ years · physician Medical Director for Hello Gorgeous",
    image: "/images/providers/dr-mukesh-arora.jpg",
    imageAlt: `${DR_ARORA_FULL_NAME}, Medical Director at Hello Gorgeous Med Spa`,
    badge: "Medical Director",
  },
  {
    name: RYAN_FULL_NAME,
    role: "On-Site Nurse Practitioner · FNP-BC",
    detail: "Full prescriptive authority · on site daily",
    image: "/images/providers/ryan-kent-clinic.jpg",
    imageAlt: `${RYAN_FULL_NAME}, Board-Certified Family Nurse Practitioner at Hello Gorgeous Med Spa`,
    badge: "On site daily",
  },
] as const;

/** Full medical leadership trio on the homepage MD-oversight band. */
export const MD_OVERSIGHT_TEAM = MEDICAL_TRUST_PROVIDERS;

/** @deprecated Prefer MD_OVERSIGHT_TEAM — includes Dani, Medical Director Arora, and Ryan FNP-BC. */
export const MD_OVERSIGHT_PAIR = MEDICAL_TRUST_PROVIDERS;

export const DR_ARORA_PROFILE = {
  name: DR_ARORA_FULL_NAME,
  credentialsLine: "Medical Director · Internal Medicine · 30+ years of experience",
  graduated: "Ggs Medical College, 1991",
  affiliations: [
    "Advocate Good Shepherd Hospital",
    "Northwestern Medicine McHenry Hospital",
  ] as const,
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
  "FNP-BC on site",
  "Owner · RN-S · CNA · CMAA",
  "Licensed phlebotomist & esthetician",
  "NP reviews every RX order",
  "Illinois telehealth licensed",
] as const;

/** Crawlable / AEO blurb — keep in HTML even when UI uses a Learn more modal. */
export const DR_ARORA_SEO_BLURB =
  "Dr. Mukesh Arora, MD is Medical Director of Hello Gorgeous Med Spa in Oswego, Illinois. Internal Medicine with 30+ years of experience. Graduated Ggs Medical College, 1991. Affiliated with Advocate Good Shepherd Hospital and Northwestern Medicine McHenry Hospital. Hello Gorgeous chose Dr. Arora as Medical Director for patient-first leadership: unhurried visits, clear communication, and long-term trust. On-site nurse practitioner care is provided by Ryan Kent, FNP-BC, with full Illinois prescriptive authority; the practice is owned by Danielle Alcala-Glazier.";

/** Person schema for Google — URL inlined to avoid circular import with lib/seo. */
export function aroraPersonJsonLd(siteUrl = "https://www.hellogorgeousmedspa.com") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#dr-mukesh-arora`,
    name: "Mukesh Arora, MD",
    honorificPrefix: "Dr.",
    jobTitle: "Medical Director",
    url: `${siteUrl}/#dr-mukesh-arora`,
    image: `${siteUrl}/images/providers/dr-mukesh-arora.jpg`,
    description: DR_ARORA_SEO_BLURB,
    knowsAbout: [
      "Internal Medicine",
      "Medical Director",
      "Physician medical oversight",
      "Medical aesthetics collaboration",
      "Patient-centered care",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Ggs Medical College",
    },
    worksFor: { "@id": `${siteUrl}/#organization` },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Doctor of Medicine (MD) · Internal Medicine",
    },
  };
}

/** Storefront plaque copy + asset — keep site and door sign aligned. */
export const STOREFRONT_TRUST_SIGN = {
  image: "/images/storefront/md-oversight-sign.png",
  line1: "MD OVERSIGHT",
  line2: "Nurse Practitioner On Site (FNP-BC)",
  line3: "Come in — we're friendly",
  alt: "Hello Gorgeous Med Spa: MD Oversight, Nurse Practitioner On Site (FNP-BC). Come in — we're friendly.",
} as const;

export { MEDICAL_TEAM_QUOTE };
