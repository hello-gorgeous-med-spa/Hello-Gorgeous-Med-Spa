/** Peptides & Wellness — main nav clusters & topic links (HG_DEV_011). */

import type { PeptideTopic } from "@/data/peptides";
import { PEPTIDE_HANDOUTS_PATH } from "@/lib/peptide-handouts";
import {
  featuredPeptideNavLinks,
  PEPTIDE_CONSULT_SPECIAL,
} from "@/lib/peptide-featured";
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
      heading: "Book & special",
      links: [
        {
          label: `${PEPTIDE_CONSULT_SPECIAL.price} Peptide Consultation`,
          href: "/book",
          sub: PEPTIDE_CONSULT_SPECIAL.detail,
          badge: "OFFER",
        },
        {
          label: "Peptides & Wellness Hub",
          href: PEPTIDES_HUB_PATH,
          sub: "What each peptide does & how we help · Oswego, IL",
          badge: "HUB",
        },
        {
          label: "Injection Menu",
          href: "/injection-menu",
          sub: "In-spa peptide & vitamin shot menu — PDF download",
          badge: "MENU",
        },
        {
          label: "Top peptides guide (blog)",
          href: PEPTIDE_CONSULT_SPECIAL.blogHref,
          sub: "BPC-157, Sermorelin, GHK-Cu, PT-141, Tesamorelin, NAD+",
        },
      ],
    },
    {
      heading: "Most requested at Hello Gorgeous",
      links: featuredPeptideNavLinks(),
    },
    ...topicGroups
      .filter((g) => g.category !== "Recovery & Healing" && g.category !== "Hormone Support" && g.category !== "Energy & Wellness")
      .map((group) => ({
        heading: group.category,
        links: group.topics.map(topicNavLink),
      })),
    {
      heading: "More topics",
      links: [
        {
          label: "Which Peptide Fits Your Goals?",
          href: "/blog/which-peptide-is-right-for-you-oswego-il",
          sub: "Goal-based fit guide",
        },
        {
          label: "Hello Gorgeous RX Products",
          href: "/products-we-offer",
          sub: "Full compounded Rx catalog",
        },
        {
          label: "NAD+ Injections",
          href: "/services/nad-plus-injections-oswego-il",
          sub: "In-office cellular energy visits",
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
  "/blog/top-peptides-bpc157-sermorelin-ghk-cu-pt141-nad-49-consult-oswego-il",
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
