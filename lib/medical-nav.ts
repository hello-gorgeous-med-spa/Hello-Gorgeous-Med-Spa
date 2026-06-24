/**
 * Top-level Medical nav — Moonshot-style flat dropdown (/medical hub).
 * Only list routes we actually offer; omit DEXA / bone-density screeners.
 */

import { BOOKING_URL } from "@/lib/flows";
import { PEPTIDE_CONSULT_SPECIAL } from "@/lib/peptide-featured";
import { MEDICAL_OPTIMIZATION_PATH } from "@/lib/medical-optimization";

export type MedicalNavLink = {
  label: string;
  href: string;
  sub?: string;
  badge?: string;
  external?: boolean;
  /** First item style — OVERVIEW */
  overview?: boolean;
  /** Thin rule above this item */
  dividerBefore?: boolean;
};

export const MEDICAL_NAV = {
  label: "Medical",
  href: MEDICAL_OPTIMIZATION_PATH,
  links: [
    {
      label: "Overview",
      href: MEDICAL_OPTIMIZATION_PATH,
      sub: "Hormones · GLP-1 · peptides · IV — NP-supervised",
      overview: true,
    },
    {
      label: "Hormone & Lab Panels",
      href: "/biote-hormone-therapy-oswego",
      sub: "BioTE baseline labs & hormone optimization",
      dividerBefore: true,
    },
    {
      label: "Lab & Body Guide",
      href: "/understand-your-body",
      sub: "Persona-guided education before you book",
    },
    {
      label: "Men's Hormones / TRT",
      href: "/mens-hormones",
      sub: "Testosterone replacement & optimization",
    },
    {
      label: "Men's Wellness",
      href: "/mens-wellness",
      sub: "TRT, peptides, weight loss & performance",
    },
    {
      label: "Women's Hormones",
      href: "/biote-hormone-therapy-oswego",
      sub: "BioTE pellets · perimenopause & menopause",
    },
    {
      label: "Medical Weight Loss",
      href: "/glp-1-weight-loss-oswego",
      sub: "Semaglutide & tirzepatide programs",
      dividerBefore: true,
    },
    {
      label: "Peptide Therapy",
      href: "/peptides",
      sub: "Pricing, protocols & FAQs",
      badge: "Rx",
    },
    {
      label: "IV Therapy & NAD+",
      href: "/iv-shots",
      sub: "Drips, vitamin shots & NAD+",
    },
    {
      label: "Hello Gorgeous RX™",
      href: "/rx",
      sub: "Prescription hub — hormones, GLP-1, peptides",
    },
    {
      label: "Sexual Wellness",
      href: "/rx/sexual-health",
      sub: "Libido, ED & hormone-supported care",
      dividerBefore: true,
    },
    {
      label: `${PEPTIDE_CONSULT_SPECIAL.price} Peptide Consult`,
      href: BOOKING_URL,
      sub: PEPTIDE_CONSULT_SPECIAL.detail,
      badge: "OFFER",
      dividerBefore: true,
    },
  ] satisfies MedicalNavLink[],
};

export const MEDICAL_NAV_FLAT_HREFS = MEDICAL_NAV.links.map((l) => l.href.split("#")[0]);

/** Paths that highlight the Medical nav tab */
export const MEDICAL_ACTIVE_PREFIXES = [
  MEDICAL_OPTIMIZATION_PATH,
  "/rx",
  "/peptides",
  "/iv-shots",
  "/mens-hormones",
  "/mens-wellness",
  "/glp-1-weight-loss-oswego",
  "/glp1-weight-loss",
  "/biote-hormone-therapy-oswego",
  "/peptide-therapy-oswego",
  "/semaglutide-oswego",
  "/tirzepatide-oswego",
  "/understand-your-body",
  "/hello-gorgeous-rx",
] as const;

export function isMedicalNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  if (MEDICAL_ACTIVE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  return MEDICAL_NAV.links.some((link) => {
    if (link.external) return false;
    const base = link.href.split("#")[0].split("?")[0];
    if (base === BOOKING_URL) return false;
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}
