/** Helpers for the Peptides & Wellness education hub (HG_DEV_011). */

import {
  PEPTIDE_CATEGORIES,
  PEPTIDE_TOPICS,
  type PeptideCategory,
  type PeptideTier,
  type PeptideTopic,
} from "@/data/peptides";

export const PEPTIDES_HUB_PATH = "/peptides";

export function getPeptideTopicBySlug(slug: string): PeptideTopic | undefined {
  return PEPTIDE_TOPICS.find((t) => t.slug === slug);
}

export function getPublishedPeptideTopics(): PeptideTopic[] {
  return PEPTIDE_TOPICS.filter((t) => t.published).sort(
    (a, b) => a.category.localeCompare(b.category) || a.order - b.order,
  );
}

export function getPeptideTopicsByCategory(): Array<{
  category: PeptideCategory;
  topics: PeptideTopic[];
}> {
  return PEPTIDE_CATEGORIES.map((category) => ({
    category,
    topics: getPublishedPeptideTopics().filter((t) => t.category === category),
  })).filter((group) => group.topics.length > 0);
}

export function peptideTopicHref(slug: string): string {
  return `${PEPTIDES_HUB_PATH}/${slug}`;
}

export function tierBadge(tier: PeptideTier): string | undefined {
  if (tier === "prescription") return "Rx · consult";
  if (tier === "education") return "Learn more";
  return undefined;
}

export function tierCta(tier: PeptideTier): { label: string; href: string } {
  if (tier === "patient") {
    return { label: "Book a consult", href: "/book" };
  }
  if (tier === "prescription") {
    return { label: "Talk to our provider", href: "/contact" };
  }
  return { label: "Have questions? Ask us", href: "/contact" };
}
