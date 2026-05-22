/** Peptide Therapy — main nav clusters & handout links. */

import {
  PEPTIDE_HANDOUT_CATEGORIES,
  PEPTIDE_HANDOUTS,
  PEPTIDE_HANDOUTS_PATH,
  peptideHandoutHref,
} from "./peptide-handouts";
import { PEPTIDE_THERAPY_PATH } from "./peptide-education";

export { PEPTIDE_THERAPY_PATH, PEPTIDE_HANDOUTS_PATH, peptideHandoutHref };

export type PeptideTherapyNavLink = {
  label: string;
  href: string;
  sub: string;
  badge?: string;
  external?: boolean;
};

export type PeptideTherapyNavSection = {
  heading: string;
  links: PeptideTherapyNavLink[];
};

const handoutById = Object.fromEntries(PEPTIDE_HANDOUTS.map((h) => [h.id, h]));

function handoutNavLink(id: string): PeptideTherapyNavLink {
  const h = handoutById[id];
  if (!h) {
    return { label: id, href: PEPTIDE_THERAPY_PATH, sub: "" };
  }
  return {
    label: h.title,
    href: peptideHandoutHref(h.filename),
    sub: `${h.series} · ${h.pages} pages · printable HTML`,
    badge: h.badge,
    external: true,
  };
}

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
          label: "All Printable Handouts",
          href: `${PEPTIDE_THERAPY_PATH}#patient-handouts`,
          sub: "Full library of Danielle's HTML patient guides",
        },
        {
          label: "Hello Gorgeous RX Products",
          href: "/products-we-offer",
          sub: "Compounded peptides & wellness Rx catalog",
        },
      ],
    },
    ...PEPTIDE_HANDOUT_CATEGORIES.map((cat) => ({
      heading: cat.heading,
      links: cat.handoutIds.map(handoutNavLink),
    })),
    {
      heading: "Related",
      links: [
        {
          label: "Which Peptide Fits Your Goals?",
          href: "/blog/which-peptide-is-right-for-you-oswego-il",
          sub: "Blog — goal-based fit guide for Oswego",
        },
        {
          label: "Interactive Education Center",
          href: `${PEPTIDE_THERAPY_PATH}#peptide-education`,
          sub: "Web version of select guides on the peptide page",
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
  PEPTIDE_HANDOUTS_PATH,
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
