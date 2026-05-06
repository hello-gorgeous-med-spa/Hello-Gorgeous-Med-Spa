export type ContentType =
  | "provider-insight"
  | "treatment-update"
  | "faq-update"
  | "case-study"
  | "educational-article"
  | "video-transcript"
  | "comparison-update";

export type ContentStatus = "draft" | "review" | "published" | "archived";

export type ContentEntry = {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  summary: string;
  body: string;
  tags: string[];
  relatedTreatments: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export const CONTENT_COLLECTIONS: ContentEntry[] = [
  {
    id: "insight-morpheus8-staging",
    title: "Provider Insight: Staging Morpheus8 with resurfacing",
    type: "provider-insight",
    status: "published",
    summary: "How we decide sequencing when patients need both tightening and resurfacing.",
    body: "Educational content placeholder. Replace with approved provider narrative.",
    tags: ["morpheus8", "solaria-co2", "skin-tightening"],
    relatedTreatments: ["/services/morpheus8", "/services/solaria-co2"],
    author: "clinical-team",
    createdAt: "2026-05-06T00:00:00.000Z",
    updatedAt: "2026-05-06T00:00:00.000Z",
    publishedAt: "2026-05-06T00:00:00.000Z",
  },
  {
    id: "faq-quantum-rf-candidacy",
    title: "FAQ Update: Quantum RF candidacy clarifications",
    type: "faq-update",
    status: "published",
    summary: "Clarifies who may benefit from minimally invasive contouring and when surgery referral is appropriate.",
    body: "Educational content placeholder. Replace with approved FAQ update details.",
    tags: ["quantum-rf", "jowls", "neck-tightening"],
    relatedTreatments: ["/services/quantum-rf", "/compare/quantum-rf-vs-facelift"],
    author: "seo-team",
    createdAt: "2026-05-06T00:00:00.000Z",
    updatedAt: "2026-05-06T00:00:00.000Z",
    publishedAt: "2026-05-06T00:00:00.000Z",
  },
];

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  "provider-insight": "Provider Insight",
  "treatment-update": "Treatment Update",
  "faq-update": "FAQ Update",
  "case-study": "Case Study",
  "educational-article": "Educational Article",
  "video-transcript": "Video Transcript",
  "comparison-update": "Comparison Update",
};
