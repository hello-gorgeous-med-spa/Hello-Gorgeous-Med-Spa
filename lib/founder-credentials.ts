/**
 * Canonical Dani & Ryan credential copy — source of truth for HG_DEV_014.
 * @see docs/HG_Dani_Ryan_Everywhere_Playbook.md (when added)
 */

import { SITE } from "@/lib/seo";

export const DANI_FULL_NAME = "Danielle Alcala-Glazier";
export const RYAN_FULL_NAME = "Ryan Kent, FNP-BC";

/** Service page slugs that use the prescription-focused credentials strip. */
export const PRESCRIPTION_SERVICE_SLUGS = new Set([
  "semaglutide-oswego",
  "tirzepatide-oswego",
  "glp-1-weight-loss-oswego",
  "biote-hormone-therapy-oswego",
  "testosterone-replacement-oswego",
  "peptide-therapy-oswego",
]);

export const FOOTER_CREDENTIALS_HEADLINE = "Hello Gorgeous Med Spa — Family-owned. NP-directed.";

export const FOOTER_CREDENTIALS_LINE =
  "Founder: Danielle Alcala-Glazier (Licensed Esthetician, Phlebotomist, CMAA, CNA) · Medical Director: Ryan Kent, FNP-BC (full prescriptive authority, on site 7 days a week)";

export const CREDENTIAL_STRIP_STANDARD = `Performed by our team. Medical oversight by Ryan Kent, FNP-BC (Board-Certified Family Nurse Practitioner, on site 7 days a week).

Owner & Founder: Danielle Alcala-Glazier — Licensed Esthetician, Phlebotomist, CMAA, CNA (RN in progress). 10+ years at this practice.`;

export const CREDENTIAL_STRIP_PRESCRIPTION = `Every prescription at Hello Gorgeous is written and supervised by Ryan Kent, FNP-BC — a Board-Certified Family Nurse Practitioner with full prescriptive authority in Illinois, on site 7 days a week. Owner & Founder: Danielle Alcala-Glazier — Licensed Esthetician, Phlebotomist, CMAA, CNA.`;

export const DANI_SHORT_BIO =
  "Danielle Alcala-Glazier — Licensed Esthetician, Phlebotomist, CMAA, CNA. Owner & Founder, Hello Gorgeous Med Spa.";

export const DANI_MEDIUM_BIO = `Danielle Alcala-Glazier is the founder and owner of Hello Gorgeous Med Spa in Oswego, IL. She is a Licensed Esthetician, Phlebotomist, Certified Medical Administrative Assistant (CMAA), and Certified Nursing Assistant (CNA), and is currently pursuing her RN degree. Dani opened Hello Gorgeous over 10 years ago after a lifelong passion for skincare and a personal journey with severe acne and Accutane. Her aunt — who raised her and used to call her "hello gorgeous" — funded her first chair. Today the practice holds Best of Oswego awards for #1 Med Spa, Best Skincare, and Best Weight Loss.`;

export const DANI_LONG_BIO = `Danielle Alcala-Glazier is the founder and owner of Hello Gorgeous Med Spa in Oswego, Illinois. Her path into aesthetics started at age 12 with severe acne that no over-the-counter product could touch. At 18 she went on Accutane and became obsessed with the science of skin. After having two sons, she enrolled in esthetic school and opened her own practice with funding from her aunt — the woman who raised her and used to call her "hello gorgeous." That phrase, and her aunt's belief in her, became the name and the foundation of everything.

Today, more than 10 years later, Dani is a Licensed Esthetician, Phlebotomist, CMAA, and CNA, currently pursuing her RN degree. She has built Hello Gorgeous from a single chair into the only practice in the western Chicago suburbs offering the complete InMode Trifecta — Morpheus8 Burst, Solaria CO₂, and Quantum RF — alongside injectables, medical weight loss, hormone therapy, peptides, IV therapy, and full medical aesthetics. The practice is recognized as #1 Best Med Spa in Oswego with multiple "Best of" awards.

Dani is still in the office every day. She still answers texts. She still orders the products. She still invests in the equipment. Hello Gorgeous is a family-owned practice, not a chain — and that's the whole point.`;

export const RYAN_SHORT_BIO =
  "Ryan Kent, FNP-BC — Medical Director, Hello Gorgeous Med Spa. Board-certified Family Nurse Practitioner with full prescriptive authority. On site 7 days a week.";

export const RYAN_MEDIUM_BIO = `Ryan Kent is a board-certified Family Nurse Practitioner (FNP-BC) and the Medical Director of Hello Gorgeous Med Spa. Ryan holds full prescriptive authority in Illinois, allowing him to independently prescribe medications, supervise medical aesthetic protocols, and direct all clinical care at the practice. Unlike many med spas that rely on a remote physician medical director signing off from another state, Ryan is on-site 7 days a week, personally overseeing every protocol — from Botox dosing to GLP-1 weight loss programs to hormone therapy to laser treatments. Every clinical decision at Hello Gorgeous goes through Ryan.`;

export const DANI_IMAGE = "/images/team/danielle.png";
export const RYAN_IMAGE = "/images/providers/ryan-kent-clinic.jpg";

export function credentialStripForSlug(slug: string): string {
  return PRESCRIPTION_SERVICE_SLUGS.has(slug) ? CREDENTIAL_STRIP_PRESCRIPTION : CREDENTIAL_STRIP_STANDARD;
}

export function isPrescriptionServicePage(slug: string): boolean {
  return PRESCRIPTION_SERVICE_SLUGS.has(slug);
}

/** Blog categories that are lifestyle-only (author byline, no medical reviewer). */
const LIFESTYLE_BLOG_CATEGORIES = new Set(["Results", "Our Story", "Spa News"]);

export function blogPostNeedsMedicalReviewer(category: string): boolean {
  return !LIFESTYLE_BLOG_CATEGORIES.has(category);
}

export function daniPersonJsonLd() {
  return {
    "@type": "Person",
    "@id": `${SITE.url}/about#dani`,
    name: DANI_FULL_NAME,
    jobTitle: "Owner & Founder",
    url: `${SITE.url}/about#dani`,
    worksFor: { "@id": `${SITE.url}/#organization` },
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "Licensed Esthetician" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "Phlebotomist" },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Certified Medical Administrative Assistant (CMAA)",
      },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "Certified Nursing Assistant (CNA)" },
    ],
  };
}

export function ryanPersonJsonLd() {
  return {
    "@type": "Person",
    "@id": `${SITE.url}/about#ryan`,
    name: "Ryan Kent",
    jobTitle: "Medical Director",
    url: `${SITE.url}/about#ryan`,
    worksFor: { "@id": `${SITE.url}/#organization` },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Family Nurse Practitioner, Board-Certified (FNP-BC)",
    },
  };
}

export function medicalWebPageJsonLd(opts: {
  url: string;
  name: string;
  lastReviewed: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: opts.name,
    url: opts.url,
    author: {
      "@type": "Person",
      name: DANI_FULL_NAME,
      url: `${SITE.url}/about#dani`,
    },
    reviewedBy: {
      "@type": "Person",
      name: RYAN_FULL_NAME,
      url: `${SITE.url}/about#ryan`,
    },
    lastReviewed: opts.lastReviewed,
  };
}
