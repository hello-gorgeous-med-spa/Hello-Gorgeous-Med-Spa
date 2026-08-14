/**
 * Clinical authority — the single source of truth for who is medically responsible
 * at Hello Gorgeous Med Spa.
 *
 * Every surface that names the prescribing nurse practitioner or the physician
 * Medical Director should read from here: trust bands, clinical review bylines,
 * provider profiles, and `Person` / `MedicalWebPage` structured data. Nothing in
 * this file may be softened, upgraded, or embellished — it is the factual record
 * the rest of the site is checked against.
 *
 * This module is deliberately dependency-free (no `lib/seo`, no
 * `lib/founder-credentials`) so it can be imported from anywhere, including the
 * modules that own site metadata, without an import cycle.
 */

/** Kept local so this stays a leaf module; mirrors `SITE.url` in `lib/seo.ts`. */
const SITE_ORIGIN = "https://www.hellogorgeousmedspa.com";

/** How many days a week the nurse practitioner is physically in the Oswego clinic. */
export const NP_ON_SITE_DAYS_PER_WEEK = 6;

/** Prose form — use in sentences. */
export const NP_ON_SITE_PHRASE = "on site six days a week";

/** Compact form — use in chips, badges, and price-list notes. */
export const NP_ON_SITE_SHORT = "On site 6 days";

/**
 * Date the clinical content owned by this authority layer was last reviewed.
 * Bump this when the NP re-reads the clinical surfaces, not on every deploy.
 */
export const CLINICAL_REVIEW_DATE = "2026-08-01";

export type ClinicianAuthority = {
  /** Display name including credential suffix, e.g. "Ryan Kent, FNP-BC". */
  displayName: string;
  /** Legal name without honorifics — used for schema `name`. */
  schemaName: string;
  honorificPrefix?: string;
  honorificSuffix: string;
  jobTitle: string;
  /** One-line role summary for bylines and cards. */
  roleLine: string;
  /** Schema `hasCredential` categories — credentials only, never inferred. */
  credentials: readonly string[];
  profilePath: string;
  image: string;
  imageAlt: string;
  /** Stable JSON-LD node id fragment. */
  schemaId: string;
};

/** The prescriber. Every prescription and medical protocol runs through him. */
export const PRESCRIBING_NP: ClinicianAuthority = {
  displayName: "Ryan Kent, FNP-BC",
  schemaName: "Ryan Kent",
  honorificSuffix: "FNP-BC",
  jobTitle: "Board-Certified Family Nurse Practitioner",
  roleLine: "On-Site Nurse Practitioner · Full Illinois prescriptive authority",
  credentials: ["Family Nurse Practitioner, Board-Certified (FNP-BC)"],
  profilePath: "/providers/ryan",
  image: "/images/providers/ryan-kent-clinic.jpg",
  imageAlt:
    "Ryan Kent, FNP-BC, Board-Certified Family Nurse Practitioner at Hello Gorgeous Med Spa in Oswego, IL",
  schemaId: "#ryan-kent-fnp-bc",
};

/** The physician Medical Director. Oversight of the medical program, not day-to-day visits. */
export const MEDICAL_DIRECTOR: ClinicianAuthority = {
  displayName: "Dr. Mukesh Arora, MD",
  schemaName: "Mukesh Arora, MD",
  honorificPrefix: "Dr.",
  honorificSuffix: "MD",
  jobTitle: "Medical Director",
  roleLine: "Medical Director · Internal Medicine",
  credentials: ["Doctor of Medicine (MD) · Internal Medicine"],
  profilePath: "/providers/dr-arora",
  image: "/images/providers/dr-mukesh-arora.jpg",
  imageAlt: "Dr. Mukesh Arora, MD, Medical Director at Hello Gorgeous Med Spa in Oswego, IL",
  schemaId: "#dr-mukesh-arora",
};

/** Medical specialty of the Medical Director. */
export const MEDICAL_DIRECTOR_SPECIALTY = "Internal Medicine";

/** Experience claim already published for the Medical Director. */
export const MEDICAL_DIRECTOR_EXPERIENCE = "30+ years in medicine";

/** Medical school on record for the Medical Director. */
export const MEDICAL_DIRECTOR_ALUMNI_OF = "Ggs Medical College";
export const MEDICAL_DIRECTOR_GRADUATED = "Ggs Medical College, 1991";

/** Hospital affiliations on record for the Medical Director. */
export const MEDICAL_DIRECTOR_AFFILIATIONS = [
  "Advocate Good Shepherd Hospital",
  "Northwestern Medicine McHenry Hospital",
] as const;

/** Scope of practice the NP personally directs — mirrors the published service menu. */
export const NP_SCOPE_OF_PRACTICE = [
  "Medical weight loss with GLP-1 medications (semaglutide, tirzepatide)",
  "Hormone therapy — testosterone replacement and bioidentical hormone therapy",
  "Prescription peptide protocols",
  "Injectables — neurotoxin and dermal filler treatment planning",
  "IV therapy and vitamin injections",
  "Energy-based device protocols — Morpheus8 Burst, Quantum RF, Solaria CO₂",
  "Lab ordering, interpretation, and follow-up monitoring",
] as const;

/** Licensure and authority facts. Nothing here is inferred. */
export const NP_LICENSURE_FACTS = [
  "Board-certified Family Nurse Practitioner (FNP-BC)",
  "Full prescriptive authority in Illinois",
  `Physically on site at 74 W. Washington Street, Oswego, ${NP_ON_SITE_DAYS_PER_WEEK} days a week`,
  "Reviews every Hello Gorgeous RX order before it is filled",
] as const;

/** How oversight actually works between the NP and the physician Medical Director. */
export const OVERSIGHT_MODEL = [
  {
    title: "The nurse practitioner evaluates and prescribes",
    body: "Ryan Kent, FNP-BC holds full prescriptive authority in Illinois. He reviews your intake and history, orders and interprets labs where indicated, decides whether a medication or protocol is appropriate, and sets the plan — in person in Oswego or by telehealth for Illinois patients.",
  },
  {
    title: "A physician Medical Director stands behind the practice",
    body: "Dr. Mukesh Arora, MD — Internal Medicine — serves as Medical Director of Hello Gorgeous Med Spa. He is the physician accountable for medical oversight of the practice's clinical program rather than a name used for paperwork alone.",
  },
  {
    title: "The prescriber is in the building",
    body: `Ryan is ${NP_ON_SITE_PHRASE} at the Oswego clinic, so questions between visits, dose reviews, and side-effect concerns go to the same provider who wrote the plan.`,
  },
  {
    title: "Nothing is filled without provider review",
    body: "Hello Gorgeous RX is consult-first. Intake, provider review, and approval come before any prescription is prepared or shipped, and pricing is confirmed before you commit.",
  },
] as const;

/** Byline copy defaults for the ClinicalReview component. */
export const CLINICAL_REVIEW_COPY = {
  reviewerLabel: "Clinically reviewed by",
  reviewerCredentialLine: "Full Illinois prescriptive authority",
  oversightLabel: "Medical oversight",
  oversightCredentialLine: MEDICAL_DIRECTOR_SPECIALTY,
  disclaimer:
    "Educational information only — not medical advice, diagnosis, or a treatment plan. Prescriptions require a provider evaluation.",
} as const;

/** "August 2026" — how review dates read in bylines. */
export function formatReviewMonth(isoDate: string = CLINICAL_REVIEW_DATE): string {
  const parsed = new Date(`${isoDate}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Plain-text authority sentence for metadata, AI answers, and llms.txt-style surfaces. */
export const CLINICAL_AUTHORITY_SUMMARY = `Clinical care at Hello Gorgeous Med Spa is directed by ${PRESCRIBING_NP.displayName}, a board-certified Family Nurse Practitioner with full Illinois prescriptive authority who is ${NP_ON_SITE_PHRASE} in Oswego, under Medical Director ${MEDICAL_DIRECTOR.displayName} (${MEDICAL_DIRECTOR_SPECIALTY}).`;

function credentialNodes(credentials: readonly string[]) {
  return credentials.map((credentialCategory) => ({
    "@type": "EducationalOccupationalCredential" as const,
    credentialCategory,
  }));
}

/**
 * `Person` node for the prescribing NP — affiliated with the practice organization.
 * `@id` is stable sitewide so every page references the same person; `profileUrl`
 * only changes which page is cited as his profile.
 */
export function prescribingNpPersonJsonLd(
  siteUrl: string = SITE_ORIGIN,
  opts?: { profileUrl?: string },
) {
  return {
    "@type": "Person" as const,
    "@id": `${siteUrl}/${PRESCRIBING_NP.schemaId}`,
    name: PRESCRIBING_NP.schemaName,
    honorificSuffix: PRESCRIBING_NP.honorificSuffix,
    jobTitle: PRESCRIBING_NP.jobTitle,
    url: opts?.profileUrl ?? `${siteUrl}${PRESCRIBING_NP.profilePath}`,
    image: `${siteUrl}${PRESCRIBING_NP.image}`,
    description: `${PRESCRIBING_NP.displayName} is the on-site nurse practitioner at Hello Gorgeous Med Spa in Oswego, Illinois. He holds full Illinois prescriptive authority, is ${NP_ON_SITE_PHRASE}, and practices under Medical Director ${MEDICAL_DIRECTOR.displayName}.`,
    knowsAbout: [
      "Medical weight loss",
      "GLP-1 therapy",
      "Hormone therapy",
      "Peptide therapy",
      "Medical aesthetics",
      "IV therapy",
    ],
    worksFor: { "@id": `${siteUrl}/#organization` },
    affiliation: { "@id": `${siteUrl}/#organization` },
    hasCredential: credentialNodes(PRESCRIBING_NP.credentials),
  };
}

/** `Person` node for the physician Medical Director. */
export function medicalDirectorPersonJsonLd(siteUrl: string = SITE_ORIGIN) {
  return {
    "@type": "Person" as const,
    "@id": `${siteUrl}/${MEDICAL_DIRECTOR.schemaId}`,
    name: MEDICAL_DIRECTOR.schemaName,
    honorificPrefix: MEDICAL_DIRECTOR.honorificPrefix,
    honorificSuffix: MEDICAL_DIRECTOR.honorificSuffix,
    jobTitle: MEDICAL_DIRECTOR.jobTitle,
    url: `${siteUrl}${MEDICAL_DIRECTOR.profilePath}`,
    image: `${siteUrl}${MEDICAL_DIRECTOR.image}`,
    description: `${MEDICAL_DIRECTOR.displayName} is Medical Director of Hello Gorgeous Med Spa in Oswego, Illinois. ${MEDICAL_DIRECTOR_SPECIALTY} with ${MEDICAL_DIRECTOR_EXPERIENCE}. Graduated ${MEDICAL_DIRECTOR_GRADUATED}. Affiliated with ${MEDICAL_DIRECTOR_AFFILIATIONS.join(" and ")}.`,
    knowsAbout: [
      MEDICAL_DIRECTOR_SPECIALTY,
      "Physician medical oversight",
      "Medical Director",
      "Patient-centered care",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity" as const,
      name: MEDICAL_DIRECTOR_ALUMNI_OF,
    },
    worksFor: { "@id": `${siteUrl}/#organization` },
    affiliation: { "@id": `${siteUrl}/#organization` },
    hasCredential: credentialNodes(MEDICAL_DIRECTOR.credentials),
  };
}

export type ClinicalPageSchemaOptions = {
  /** Absolute page URL. */
  url: string;
  /** Page name / headline. */
  name: string;
  description?: string;
  /** ISO date the page's clinical content was last reviewed. */
  lastReviewed?: string;
  /** Extra nodes (breadcrumb, FAQ, ItemList) to fold into the same graph. */
  extraNodes?: Array<Record<string, unknown>>;
  siteUrl?: string;
};

/**
 * `MedicalWebPage` + both `Person` nodes in one graph, with `reviewedBy` pointing
 * at the prescriber and `lastReviewed` matching what the byline shows patients.
 */
export function clinicalPageJsonLd(opts: ClinicalPageSchemaOptions) {
  const siteUrl = opts.siteUrl ?? SITE_ORIGIN;
  const reviewer = prescribingNpPersonJsonLd(siteUrl);
  const director = medicalDirectorPersonJsonLd(siteUrl);

  // Same `@id` convention as `webPageJsonLd` so a page emitting both ends up as one
  // merged entity rather than two competing descriptions of the same URL.
  const medicalWebPage: Record<string, unknown> = {
    "@type": "MedicalWebPage",
    "@id": `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    lastReviewed: opts.lastReviewed ?? CLINICAL_REVIEW_DATE,
    reviewedBy: { "@id": reviewer["@id"] },
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  if (opts.description) medicalWebPage.description = opts.description;

  return {
    "@context": "https://schema.org",
    "@graph": [medicalWebPage, reviewer, director, ...(opts.extraNodes ?? [])],
  };
}
