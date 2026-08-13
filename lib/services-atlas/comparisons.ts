export type ComparisonId =
  | "botox-vs-dysport-vs-jeuveau"
  | "prp-vs-exosomes"
  | "glp1-sema-vs-tirz-vs-reta"
  | "microneedling-good-better-best";

export type Comparison = {
  id: ComparisonId;
  title: string;
  disclaimer: string;
  columns: string[];
  rows: Array<{ label: string; values: string[] }>;
};

export const COMPARISONS: readonly Comparison[] = [
  {
    id: "botox-vs-dysport-vs-jeuveau",
    title: "Botox vs Dysport vs Jeuveau (education-only)",
    disclaimer:
      "We do not recommend a specific product for you online. Selection requires an in-person consultation.",
    columns: ["Botox", "Dysport", "Jeuveau"],
    rows: [
      { label: "What they are", values: ["Neuromodulator", "Neuromodulator", "Neuromodulator"] },
      {
        label: "What they commonly help with",
        values: ["Expression lines (education)", "Expression lines (education)", "Expression lines (education)"],
      },
      {
        label: "How they differ (high-level)",
        values: [
          "Formulation/brand differences",
          "Formulation/brand differences",
          "Formulation/brand differences",
        ],
      },
      {
        label: "What matters most",
        values: [
          "Assessment + technique + expectations",
          "Assessment + technique + expectations",
          "Assessment + technique + expectations",
        ],
      },
    ],
  },
  {
    id: "prp-vs-exosomes",
    title: "PRP vs Exosomes (education-only)",
    disclaimer:
      "We can explain differences at a high level, but we don’t select a protocol for you online.",
    columns: ["PRP", "Exosomes"],
    rows: [
      {
        label: "What it is (high-level)",
        values: ["Uses your own blood-derived components", "Biologic-derived products; protocols vary"],
      },
      {
        label: "What people explore it for",
        values: ["Skin/hair regenerative support (education)", "Skin/hair regenerative support (education)"],
      },
      {
        label: "Key safety note",
        values: [
          "Still requires screening and proper handling",
          "Source/handling and protocols matter; consult required",
        ],
      },
    ],
  },
  {
    id: "glp1-sema-vs-tirz-vs-reta",
    title: "Semaglutide vs Tirzepatide vs Retatrutide (education-only)",
    disclaimer:
      "No prescribing or eligibility decisions online. Some options may be investigational or not appropriate for everyone. Consult required.",
    columns: ["Semaglutide", "Tirzepatide", "Retatrutide"],
    rows: [
      {
        label: "What it is (high-level)",
        values: [
          "Medication class used for metabolic/weight goals",
          "Medication class used for metabolic/weight goals",
          "Investigational — not FDA-approved and not offered here",
        ],
      },
      {
        label: "What matters most",
        values: ["Safety screening + monitoring", "Safety screening + monitoring", "Safety + current evidence"],
      },
      {
        label: "What we can do here",
        values: ["Education + questions to ask", "Education + questions to ask", "Education + questions to ask"],
      },
    ],
  },
  {
    id: "microneedling-good-better-best",
    title: "Microneedling tiers (Good / Better / Best) — expectation setting",
    disclaimer:
      "This is conceptual. We do not recommend a tier online. Your provider will advise the safest option in consult.",
    columns: ["Good", "Better", "Best"],
    rows: [
      {
        label: "Concept",
        values: ["Basic skin refresh", "Collagen support + texture", "Comprehensive skin quality plan"],
      },
      {
        label: "Commitment",
        values: ["Maintenance", "Maintenance / series", "Program-based (series + maintenance)"],
      },
      {
        label: "Key note",
        values: [
          "Start gentle",
          "Expect gradual change",
          "Consistency + safety-first decision-making",
        ],
      },
    ],
  },
] as const;

