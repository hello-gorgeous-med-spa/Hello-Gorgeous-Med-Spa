import type { ScienceExplainerContent } from "./skin-101-types";

export const PEPTIDES_101_GUIDE: ScienceExplainerContent = {
  slug: "peptides-101",
  seriesLabel: "Patient Education Series",
  heroAccent: "Peptides 101",
  metaTitle: "Peptides 101 | What Peptides Are & Why Regulatory Status Matters | Hello Gorgeous Oswego IL",
  metaDescription:
    "Plain-language guide to what peptides are, how they work, three regulatory tiers (FDA, cosmetic, research-only), and smart questions to ask. Hello Gorgeous Med Spa Oswego, IL.",
  title: "Peptides 101",
  subtitle: "Know before you go",
  intro:
    "A plain-language guide to what peptides actually are, how they work in the body, and why this category of science is getting so much attention. Education only — no treatment claims.",
  hashtags: ["WhatArePeptides", "HowTheyWork", "TheCategories", "SmartQuestions", "KnowBeforeYouGo"],
  disclaimer:
    "\"Peptide\" is a category, not a single product — and the regulatory status varies enormously from one to the next. This page explains the science; it does not recommend, prescribe, or endorse any specific use.",
  stats: [
    { value: "2–50", label: "Amino acids in a typical peptide chain" },
    { value: "3 tiers", label: "FDA-approved · cosmetic · research-use-only" },
  ],
  pdfPath: "/handouts/education/peptides-101-guide.pdf",
  sections: [
    {
      id: "what-is",
      navLabel: "What is a peptide?",
      type: "prose",
      heading: "What Is A Peptide?",
      body: "A peptide is a short chain of amino acids — the same building blocks that make up proteins, just smaller. Where a protein might be hundreds of amino acids long, a peptide is usually only a handful (roughly 2–50). Your body makes thousands of them naturally; they act as messengers, telling cells what to do. Think \"key fitting a lock,\" not a sledgehammer.",
      stripe: "white",
    },
    {
      id: "how-they-work",
      navLabel: "How they work",
      type: "actives",
      heading: "How Peptides Work In The Body",
      stripe: "rose",
      cards: [
        {
          category: "Mechanism",
          title: "Signaling",
          bullets: [
            "Peptides bind to receptors on cells",
            "That binding sends an instruction",
            "Think \"key fitting a lock,\" not a sledgehammer",
          ],
          bestFor: "Precision messaging",
          frequency: "One pathway at a time",
          accent: "pink",
        },
        {
          category: "Mechanism",
          title: "Specificity",
          bullets: [
            "Each peptide tends to target one pathway",
            "Narrow focus — the research appeal",
            "Less \"everything everywhere\" than some drugs",
          ],
          bestFor: "Targeted research",
          frequency: "Pathway-specific",
          accent: "teal",
        },
        {
          category: "Mechanism",
          title: "Fragility",
          bullets: [
            "Stomach enzymes break them down",
            "That's why oral peptides are tricky",
            "Stability and delivery are major hurdles",
          ],
          bestFor: "Delivery science",
          frequency: "Often injectable in protocols",
          accent: "gold",
        },
        {
          category: "Mechanism",
          title: "Natural Origin",
          bullets: [
            "Insulin is a peptide — so is collagen signaling",
            "The body produces them constantly",
            "Synthetic versions mimic these signals",
          ],
          bestFor: "Understanding the category",
          frequency: "Body-native messengers",
          accent: "pink",
        },
      ],
    },
    {
      id: "categories",
      navLabel: "Categories",
      type: "actives",
      heading: "The Categories You'll Hear About",
      stripe: "white",
      cards: [
        {
          category: "Recovery",
          title: "Tissue Repair & Healing",
          bullets: ["Anti-inflammatory pathways", "Gut-lining and wound-healing studies"],
          bestFor: "Recovery research",
          frequency: "Often discussed with BPC-157",
          accent: "teal",
        },
        {
          category: "Aesthetics",
          title: "Skin & Collagen",
          bullets: ["Collagen & elastin signaling", "Some forms used topically in skincare"],
          bestFor: "GHK-Cu & topical science",
          frequency: "Cosmetic vs injectable differ",
          accent: "gold",
        },
        {
          category: "Metabolic",
          title: "Energy & Metabolism",
          bullets: ["Energy & mitochondrial research", "Includes the well-known GLP-1 class*"],
          bestFor: "Weight & metabolic health",
          frequency: "Separate regulatory world from GLP-1 Rx",
          accent: "pink",
        },
        {
          category: "Longevity",
          title: "Cellular Aging",
          bullets: ["Telomere & circadian-rhythm studies", "Mostly research-stage compounds"],
          bestFor: "Emerging science",
          frequency: "Ask what's established vs unknown",
          accent: "teal",
        },
      ],
    },
    {
      id: "glp1",
      navLabel: "GLP-1 note",
      type: "callout",
      heading: "A Note On GLP-1s",
      body: "The GLP-1 class (the family behind well-known FDA-approved weight and diabetes medications) is technically peptide-based — which is why you'll sometimes see it grouped here. But FDA-approved GLP-1 medications are an entirely different regulatory world from research peptides, and the two should never be treated as the same thing.",
      variant: "info",
      stripe: "rose",
    },
    {
      id: "regulatory",
      navLabel: "Regulatory tiers",
      type: "regulatory",
      heading: "Three Very Different Regulatory Worlds",
      subheading: "The most important thing to understand before anything else in this category.",
      stripe: "white",
      rows: [
        {
          tier: "FDA-Approved",
          meaning:
            "Reviewed for safety and effectiveness for a specific use. The highest bar.",
          recognize:
            "Has a brand name, a label, and an approved indication. Dispensed by a licensed pharmacy with a prescription.",
        },
        {
          tier: "Cosmetic / Topical",
          meaning: "Used on the surface of the skin in regulated skincare. Common and well understood.",
          recognize:
            "Found in serums and creams. Makes appearance-related claims, not internal medical ones.",
        },
        {
          tier: "Research-Use-Only",
          meaning: "Made for laboratory study. Not approved for use in people — labels often say exactly that.",
          recognize:
            "Sold to \"labs and researchers.\" Carries a \"not for human consumption\" disclaimer. No prescription workflow.",
        },
      ],
    },
    {
      id: "questions",
      navLabel: "Smart questions",
      type: "questions",
      heading: "Questions Worth Asking",
      subheading:
        "If you ever consider anything in this category, these are the questions that protect you. A trustworthy provider will answer all of them clearly and in writing.",
      stripe: "rose",
      groups: [
        {
          label: "The Source",
          asks: [
            "Where is this sourced from?",
            "Is it from a licensed pharmacy?",
            "Can I see the documentation?",
          ],
        },
        {
          label: "The Status",
          asks: [
            "Is this FDA-approved for this use?",
            "Or is it research-only?",
            "What does the label actually say?",
          ],
        },
        {
          label: "The Oversight",
          asks: [
            "Who is supervising this medically?",
            "What's the follow-up plan?",
            "What are the known risks?",
          ],
        },
        {
          label: "The Evidence",
          asks: [
            "What does the research actually show?",
            "In people, or only in labs?",
            "What's still unknown?",
          ],
        },
      ],
      greenFlags: [
        "Licensed pharmacy sourcing, prescription required, clear medical supervision",
        "Honest about what's known and unknown, willing to put answers in writing",
        "Realistic expectations",
      ],
      redFlags: [
        "\"Trust us\" instead of documentation, pressure to decide fast, miracle promises",
        "No prescription or supervision, \"research-use-only\" products offered for personal use",
        "Vague sourcing",
      ],
    },
    {
      id: "hg-peptides",
      navLabel: "At Hello Gorgeous",
      type: "callout",
      heading: "Curious About Peptide Therapy?",
      body: "Hello Gorgeous offers $49 NP-supervised peptide consults — BPC-157, Sermorelin, GHK-Cu, PT-141, NAD+ & more, sourced exclusively from licensed US compounding pharmacies. Never research-grade. Never gray-market.",
      variant: "tip",
      stripe: "white",
    },
  ],
  closingTitle: "The Hello Gorgeous Philosophy",
  closingBody:
    "We'd rather give you honest information than a quick sale. Peptide science is genuinely exciting, and it's also young, and full of products that haven't earned the safety record approved medications have. Knowing the difference is how you stay both hopeful and protected. If you ever have questions, bring them to us. We're still here, still learning, still in your corner.",
};
