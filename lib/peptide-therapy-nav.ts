/** Peptides & Wellness — main nav clusters & topic links (HG_DEV_011). */

import type { PeptideTopic } from "@/data/peptides";
import { PEPTIDE_HANDOUTS_PATH } from "@/lib/peptide-handouts";
import {
  getPeptideTopicsByCategory,
  PEPTIDES_HUB_PATH,
  peptideTopicHref,
  tierBadge,
} from "@/lib/peptides-hub";

export { PEPTIDES_HUB_PATH as PEPTIDE_THERAPY_PATH, peptideTopicHref as peptideEducationHref };

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

function topicNavLink(topic: PeptideTopic): PeptideTherapyNavLink {
  return {
    label: topic.name,
    href: peptideTopicHref(topic.slug),
    sub: topic.tagline,
    badge: tierBadge(topic.tier),
  };
}

const topicGroups = getPeptideTopicsByCategory();

export const PEPTIDE_THERAPY_NAV: {
  label: string;
  href: string;
  sections: PeptideTherapyNavSection[];
} = {
  label: "Peptides & Wellness",
  href: PEPTIDES_HUB_PATH,
  sections: [
    {
      heading: "Hello Gorgeous RX™",
      links: [
        {
          label: "Peptides & Wellness Hub",
          href: PEPTIDES_HUB_PATH,
          sub: "Browse all education topics · Oswego, IL",
          badge: "HUB",
        },
        {
          label: "Printable HTML Handouts",
          href: `${PEPTIDES_HUB_PATH}#patient-handouts`,
          sub: "Danielle's original designed patient guides",
        },
        {
          label: "Hello Gorgeous RX Products",
          href: "/products-we-offer",
          sub: "Compounded peptides & wellness Rx catalog",
        },
      ],
    },
    ...topicGroups.map((group) => ({
      heading: group.category,
      links: group.topics.map(topicNavLink),
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
          href: `${PEPTIDES_HUB_PATH}#peptide-education`,
          sub: "Dropdown guides on the peptide hub page",
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

/** Paths that should highlight the Peptides & Wellness nav tab. */
export const PEPTIDE_THERAPY_ACTIVE_PREFIXES = [
  PEPTIDES_HUB_PATH,
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
