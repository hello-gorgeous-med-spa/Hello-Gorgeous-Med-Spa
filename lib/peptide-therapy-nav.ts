/** Peptide Therapy — main nav clusters & education deep links. */

import { peptideEducationHref, PEPTIDE_THERAPY_PATH } from "./peptide-education";

export { PEPTIDE_THERAPY_PATH, peptideEducationHref };

export type PeptideTherapyNavLink = {
  label: string;
  href: string;
  sub: string;
  badge?: string;
};

export type PeptideTherapyNavSection = {
  heading: string;
  links: PeptideTherapyNavLink[];
};

export const PEPTIDE_THERAPY_NAV: {
  label: string;
  href: string;
  sections: PeptideTherapyNavSection[];
} = {
  label: "Peptide Therapy",
  href: PEPTIDE_THERAPY_PATH,
  sections: [
    {
      heading: "Hello Gorgeous RX™",
      links: [
        {
          label: "Peptide Therapy Hub",
          href: PEPTIDE_THERAPY_PATH,
          sub: "Treatment overview · same-day consults often available · Oswego",
          badge: "HUB",
        },
        {
          label: "Hello Gorgeous RX Products",
          href: "/products-we-offer",
          sub: "Compounded peptides & wellness Rx catalog",
        },
        {
          label: "Regenerative Medicine Hub",
          href: "/regenerative-medicine-oswego-il",
          sub: "PRF, AnteAGE, NAD+ & cellular wellness",
        },
      ],
    },
    {
      heading: "Education Center",
      links: [
        {
          label: "Peptides 101",
          href: peptideEducationHref("peptides-101"),
          sub: "Start here — what peptides are & how they work",
          badge: "START",
        },
        {
          label: "Best Use Case Guide",
          href: peptideEducationHref("best-use-case"),
          sub: "Match your goal to clinic blends & singles",
        },
        {
          label: "Peptide Reference List",
          href: peptideEducationHref("reference-list"),
          sub: "Categories & regulatory status — education only",
        },
        {
          label: "GHK-Cu · Copper Peptides",
          href: peptideEducationHref("ghk-cu"),
          sub: "Skin, collagen & post-treatment care",
        },
        {
          label: "NAD+ · Cellular Energy",
          href: peptideEducationHref("nad-plus"),
          sub: "Mitochondria, longevity & IV wellness",
        },
        {
          label: "Methyl B12 · Energy",
          href: peptideEducationHref("methyl-b12"),
          sub: "Wellness shots & methylcobalamin",
        },
      ],
    },
    {
      heading: "Related",
      links: [
        {
          label: "Which Peptide Fits Your Goals?",
          href: "/blog/which-peptide-is-right-for-you-oswego-il",
          sub: "Blog — goal-based fit guide for Oswego",
        },
        {
          label: "Peptide Therapy Overview",
          href: "/blog/peptide-therapy-regenerative-medicine-hello-gorgeous-rx-oswego-il",
          sub: "Hello Gorgeous RX™ & popular peptide names",
        },
        {
          label: "NAD+ Injections",
          href: "/services/nad-plus-injections-oswego-il",
          sub: "Cellular energy · $40 per visit · Oswego",
          badge: "NEW",
        },
        {
          label: "Vitamin Injections",
          href: "/vitamin-injections-oswego",
          sub: "B12, Lipo-C & wellness shots",
        },
      ],
    },
  ],
};

/** Flat list for mobile nav accordion. */
export const PEPTIDE_THERAPY_NAV_FLAT_LINKS: PeptideTherapyNavLink[] =
  PEPTIDE_THERAPY_NAV.sections.flatMap((s) => s.links);

/** Paths that should highlight the Peptide Therapy nav tab. */
export const PEPTIDE_THERAPY_ACTIVE_PREFIXES = [
  PEPTIDE_THERAPY_PATH,
  "/rx/peptides",
  "/blog/which-peptide-is-right-for-you-oswego-il",
  "/blog/peptide-therapy-regenerative-medicine-hello-gorgeous-rx-oswego-il",
] as const;

export function isPeptideTherapyNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  if (PEPTIDE_THERAPY_ACTIVE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  return PEPTIDE_THERAPY_NAV_FLAT_LINKS.some((link) => {
    const base = link.href.split("#")[0].split("?")[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}
