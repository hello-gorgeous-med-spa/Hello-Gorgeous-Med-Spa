import { CONCERN_PAGES } from "@/lib/concern-pages";
import { TREATMENT_HUBS } from "@/lib/treatment-hubs";
import { VIDEO_LIBRARY } from "@/lib/video-library";
import { SERVICES } from "@/lib/seo";

export type SearchDocType = "service" | "concern" | "hub" | "video" | "comparison" | "faq" | "case-study";

export type SearchDoc = {
  id: string;
  type: SearchDocType;
  title: string;
  summary: string;
  href: string;
  tags: string[];
};

const COMPARISON_DOCS: SearchDoc[] = [
  {
    id: "cmp-m8-rf",
    type: "comparison",
    title: "Morpheus8 vs RF Microneedling",
    summary: "Depth, downtime, and candidacy comparison.",
    href: "/compare/morpheus8-vs-rf-microneedling",
    tags: ["morpheus8", "rf-microneedling", "skin-tightening"],
  },
  {
    id: "cmp-quantum-facelift",
    type: "comparison",
    title: "Quantum RF vs Facelift",
    summary: "Minimally invasive contouring versus surgical correction context.",
    href: "/compare/quantum-rf-vs-facelift",
    tags: ["quantum-rf", "facelift", "jowls", "neck-tightening"],
  },
  {
    id: "cmp-solaria-co2",
    type: "comparison",
    title: "Solaria CO2 vs Traditional CO2",
    summary: "Resurfacing protocol and recovery comparison guide.",
    href: "/compare/solaria-co2-vs-traditional-co2",
    tags: ["solaria-co2", "acne-scars", "resurfacing"],
  },
  {
    id: "cmp-glp1-traditional",
    type: "comparison",
    title: "GLP-1 vs Traditional Weight Loss",
    summary: "Medication-assisted versus lifestyle-only pathways.",
    href: "/compare/glp1-vs-traditional-weight-loss",
    tags: ["weight-loss", "glp-1"],
  },
];

const FAQ_DOCS: SearchDoc[] = [
  {
    id: "faq-quantum-rf-cluster",
    type: "faq",
    title: "Quantum RF FAQ Cluster",
    summary: "High-intent questions around candidacy, downtime, and timeline.",
    href: "/faq/quantum-rf",
    tags: ["quantum-rf", "faq", "downtime", "candidacy"],
  },
];

const CASE_STUDY_DOCS: SearchDoc[] = [
  {
    id: "case-study-template",
    type: "case-study",
    title: "Case Study Template",
    summary: "Reusable educational before/after case architecture.",
    href: "/case-studies/template",
    tags: ["case-study", "before-after", "education"],
  },
];

export const SEARCH_DOCS: SearchDoc[] = [
  ...SERVICES.map((service) => ({
    id: `service-${service.slug}`,
    type: "service" as const,
    title: service.name,
    summary: service.short,
    href: service.publicPath ?? `/services/${service.slug}`,
    tags: [service.slug, service.category.toLowerCase()],
  })),
  ...Object.values(TREATMENT_HUBS).map((hub) => ({
    id: `hub-${hub.slug}`,
    type: "hub" as const,
    title: hub.title,
    summary: hub.summary,
    href: `/${hub.slug}`,
    tags: [hub.slug, ...hub.treatmentAreas.map((item) => item.toLowerCase())],
  })),
  ...CONCERN_PAGES.map((concern) => ({
    id: `concern-${concern.slug}`,
    type: "concern" as const,
    title: concern.title,
    summary: concern.concernOverview,
    href: `/concerns/${concern.slug}`,
    tags: [concern.slug, ...concern.serviceLinks.map((item) => item.label.toLowerCase())],
  })),
  ...VIDEO_LIBRARY.map((video) => ({
    id: `video-${video.id}`,
    type: "video" as const,
    title: video.title,
    summary: video.summary,
    href: "/videos",
    tags: [video.service, ...video.concernTags, video.category],
  })),
  ...COMPARISON_DOCS,
  ...FAQ_DOCS,
  ...CASE_STUDY_DOCS,
];

const SYNONYMS: Record<string, string[]> = {
  facelift: ["jowls", "neck-tightening", "quantum-rf"],
  loose: ["sagging-skin", "skin-tightening"],
  acne: ["acne-scars", "solaria-co2", "morpheus8"],
  weight: ["weight-loss", "glp-1"],
};

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function searchDocs(query: string, limit = 20): SearchDoc[] {
  const tokens = tokenize(query);
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const synonym of SYNONYMS[token] ?? []) expanded.add(synonym);
  }
  const expandedTokens = [...expanded];

  const scored = SEARCH_DOCS.map((doc) => {
    const haystack = `${doc.title} ${doc.summary} ${doc.tags.join(" ")}`.toLowerCase();
    let score = 0;
    for (const token of expandedTokens) {
      if (doc.title.toLowerCase().includes(token)) score += 5;
      if (doc.tags.some((tag) => tag.includes(token))) score += 3;
      if (haystack.includes(token)) score += 1;
    }
    return { doc, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.doc);

  return scored;
}

export function getRelatedContent(seedTags: string[], limit = 6): SearchDoc[] {
  const normalized = seedTags.map((tag) => tag.toLowerCase());
  return SEARCH_DOCS.map((doc) => {
    const overlap = doc.tags.filter((tag) => normalized.some((seed) => tag.includes(seed) || seed.includes(tag))).length;
    return { doc, overlap };
  })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((item) => item.doc);
}
