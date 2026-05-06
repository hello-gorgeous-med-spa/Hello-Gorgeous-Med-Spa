export type TopicEntry = {
  slug: string;
  title: string;
  description: string;
  relatedLinks: { label: string; href: string }[];
};

export const AREA_PAGES: TopicEntry[] = [
  {
    slug: "under-eyes",
    title: "Under-Eyes",
    description: "Guidance for texture, crepiness, and lower-lid rejuvenation pathways.",
    relatedLinks: [
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Dermal Fillers", href: "/services/dermal-fillers" },
    ],
  },
  {
    slug: "jawline",
    title: "Jawline",
    description: "Jawline contour support strategies across injectables and device-based tightening.",
    relatedLinks: [
      { label: "Quantum RF", href: "/services/quantum-rf" },
      { label: "Morpheus8", href: "/services/morpheus8" },
    ],
  },
];

export const RECOVERY_PAGES: TopicEntry[] = [
  {
    slug: "morpheus8",
    title: "Morpheus8 Recovery Timeline",
    description: "Expected healing milestones, comfort planning, and when to reassess outcomes.",
    relatedLinks: [{ label: "Morpheus8 Service", href: "/services/morpheus8" }],
  },
  {
    slug: "quantum-rf",
    title: "Quantum RF Recovery Timeline",
    description: "Recovery expectations and staged result evaluation guidance.",
    relatedLinks: [{ label: "Quantum RF Service", href: "/services/quantum-rf" }],
  },
];

export const FAQ_CLUSTER_PAGES: TopicEntry[] = [
  {
    slug: "quantum-rf",
    title: "Quantum RF FAQ Cluster",
    description: "Condensed FAQ index for candidacy, downtime, comparison, and timeline topics.",
    relatedLinks: [
      { label: "Quantum RF Service", href: "/services/quantum-rf" },
      { label: "Quantum RF Hub", href: "/quantum-rf" },
    ],
  },
];

export function getTopicBySlug(collection: TopicEntry[], slug: string): TopicEntry | undefined {
  return collection.find((entry) => entry.slug === slug);
}
