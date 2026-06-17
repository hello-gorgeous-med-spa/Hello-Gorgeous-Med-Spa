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

export const DANI_MEDIUM_BIO = `Danielle Alcala-Glazier is a Licensed Esthetician, Phlebotomist, Certified Medical Administrative Assistant (CMAA), and Certified Nursing Assistant (CNA), and is currently pursuing her RN degree. She is the Owner and Founder of Hello Gorgeous Med Spa in Oswego, Illinois.

Danielle's path into medical aesthetics began at age twelve, when severe acne led her down a years-long journey through every product, peel, and treatment she could find — including Accutane at eighteen. That struggle did not end with clearer skin; it became a lifelong obsession with how skin actually heals, what ingredients and devices truly change outcomes, and why so many people waste money on treatments that never deliver.`;

export const DANI_LONG_BIO = `After becoming a mother to two sons, Danielle completed esthetic school and opened Hello Gorgeous with support from the aunt who raised her — the woman who used to greet her with "Hello gorgeous" and told her, "Go for it, honey." That name became the foundation of a family-owned practice, not a corporate med spa chain.

More than a decade later, Danielle still works in the office every day — performing brow permanent makeup (microblading, powder, combo, and nano brows), advanced skin treatments, and the hands-on care that built her reputation across Oswego, Naperville, Aurora, Plainfield, Yorkville, and the Fox Valley. She has invested heavily in technology most local practices do not offer, including the complete InMode Trifecta: Morpheus8 Burst, Quantum RF, and Solaria CO₂ laser — alongside injectables, IV therapy, peptides, and full medical aesthetics supervised on site by a board-certified nurse practitioner.

Hello Gorgeous has been recognized in the community with Best of Oswego honors, including #1 Med Spa, Best Skincare, and Best Weight Loss. Danielle's philosophy is simple: your money should buy results you can see in the mirror — honest recommendations, personalized plans, and providers who remember your name, your skin history, and what actually worked for you last time.

She believes confidence should feel natural, earned, and yours — not oversold, not rushed, and never treated like a number.

Dani is still in the office every day. She still answers texts. She still orders the products. She still invests in the equipment. Hello Gorgeous is a family-owned practice, not a chain — and that's the whole point.`;

/** Full bio for provider profiles and GBP paste blocks. */
export const DANI_PROVIDER_BIO = `${DANI_MEDIUM_BIO}\n\n${DANI_LONG_BIO}`;

export const RYAN_SHORT_BIO =
  "Ryan Kent, FNP-BC — Medical Director, Hello Gorgeous Med Spa. Board-certified Family Nurse Practitioner with full prescriptive authority. On site 7 days a week.";

export const RYAN_MEDIUM_BIO = `Ryan Kent, FNP-BC, is a board-certified Family Nurse Practitioner and the Medical Director of Hello Gorgeous Med Spa in Oswego, Illinois.

Ryan holds full prescriptive authority in Illinois, allowing him to independently prescribe medications, direct medical aesthetic protocols, and oversee clinical care across injectables, GLP-1 medical weight loss (Semaglutide and Tirzepatide), hormone optimization, peptides, IV therapy, and advanced energy-based treatments including Morpheus8 Burst, Quantum RF, and Solaria CO₂.`;

export const RYAN_LONG_BIO = `Unlike many med spas that rely on a remote physician signing charts from another state, Ryan is on site seven days a week at Hello Gorgeous's downtown Oswego location. Every clinical decision — from Botox dosing to weight-loss protocols to laser settings — goes through him personally. His approach is data-driven and safety-first: labs, medical history, informed consent, and follow-up built into every plan.

Ryan partners with Danielle Alcala-Glazier to deliver continuity of care — the same providers, the same chart, the same honest conversation visit after visit. For patients across Oswego and the western Chicago suburbs, that means medical aesthetics with a real nurse practitioner in the building, not just on a letterhead.`;

/** Full bio for Ryan's provider profile page. */
export const RYAN_PROVIDER_BIO = `${RYAN_MEDIUM_BIO}\n\n${RYAN_LONG_BIO}`;

export const ABOUT_PAGE_SEO_DESCRIPTION =
  "Meet Danielle Alcala-Glazier — Licensed Esthetician and founder of Hello Gorgeous Med Spa in Oswego, IL. 10+ years serving Naperville, Aurora & Plainfield. Morpheus8, Solaria, Botox, brows & more. Ryan Kent, FNP-BC on site 7 days.";

export const DANI_IMAGE = "/images/team/danielle-alcala-glazier-portrait.png";
/** Primary Dani portrait on /about — clinic setting with InMode equipment visible */
export const ABOUT_DANI_IMAGE = "/images/team/danielle-alcala-glazier-about.png";
export const RYAN_IMAGE = "/images/providers/ryan-kent-clinic.jpg";
export const TEAM_FOUNDERS_IMAGE = "/images/team/dani-ryan-about-neon.png";
export const SOLARIA_DANI_DEVICE_IMAGE = "/images/solaria/danielle-solaria-inmode-clinic.png";
export const SOLARIA_TREATMENT_IMAGE = "/images/solaria/solaria-co2-treatment-oswego.png";
export const SOLARIA_DECOLLETE_TREATMENT_IMAGE = "/images/solaria/solaria-co2-decollete-treatment-oswego.png";
export const SOLARIA_SCANNER_CLOSEUP_IMAGE = "/images/solaria/solaria-co2-inmode-scanner-closeup-oswego.png";

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
    image: `${SITE.url}${DANI_IMAGE}`,
    description: DANI_MEDIUM_BIO.replace(/\n\n/g, " "),
    knowsAbout: [
      "Medical aesthetics",
      "Permanent makeup",
      "Skincare",
      "Morpheus8 Burst",
      "Quantum RF",
      "Solaria CO₂ laser",
    ],
    worksFor: { "@id": `${SITE.url}/#organization` },
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "Licensed Esthetician" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "Phlebotomist" },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Certified Medical Administrative Assistant (CMAA)",
      },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "Certified Nursing Assistant (CNA)" },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "InMode Luxora — Morpheus8 Deep, Quantum RF (Certificate of Attendance, May 2026)",
      },
    ],
  };
}

export function ryanPersonJsonLd(opts?: { profileUrl?: string }) {
  const profileUrl = opts?.profileUrl ?? `${SITE.url}/about#ryan`;
  return {
    "@type": "Person",
    "@id": profileUrl,
    name: "Ryan Kent",
    jobTitle: "Medical Director",
    url: profileUrl,
    image: `${SITE.url}${RYAN_IMAGE}`,
    description: RYAN_MEDIUM_BIO.replace(/\n\n/g, " "),
    knowsAbout: [
      "Family Nurse Practitioner",
      "Medical weight loss",
      "GLP-1 therapy",
      "Hormone optimization",
      "Medical aesthetics",
    ],
    worksFor: { "@id": `${SITE.url}/#organization` },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Family Nurse Practitioner, Board-Certified (FNP-BC)",
    },
  };
}

export function aboutPageJsonLd() {
  return {
    "@type": "AboutPage",
    "@id": `${SITE.url}/about`,
    url: `${SITE.url}/about`,
    name: "About Dani & Ryan | Hello Gorgeous Med Spa Oswego IL",
    description: ABOUT_PAGE_SEO_DESCRIPTION,
    mainEntity: [{ "@id": `${SITE.url}/about#dani` }, { "@id": `${SITE.url}/about#ryan` }],
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: [{ "@id": `${SITE.url}/#organization` }],
  };
}

export function aboutPageGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      aboutPageJsonLd(),
      daniPersonJsonLd(),
      ryanPersonJsonLd({ profileUrl: `${SITE.url}/about#ryan` }),
    ],
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
