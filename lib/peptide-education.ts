/** Peptide-by-peptide education guides for /peptides */

export type PeptideCardVariant =
  | "copper"
  | "energy"
  | "b12"
  | "pink"
  | "teal"
  | "gold"
  | "purple"
  | "navy"
  | "green"
  | "blue"
  | "red";

export type RegulatoryStatusTag = "rx" | "cosmetic" | "research";

export type PeptideResearchCard = {
  category: string;
  title: string;
  bullets: string[];
  variant: PeptideCardVariant;
  lead?: string;
};

export type IntroBox = {
  title: string;
  body: string;
  variant?: "pink" | "teal";
};

export type RegulatoryTierRow = {
  tier: string;
  meaning: string;
  recognize: string;
};

export type ReferenceRow = {
  name: string;
  alt?: string;
  focus: string;
  statusTag: RegulatoryStatusTag;
  statusNote?: string;
};

export type ReferenceSection = {
  heading: string;
  rows: ReferenceRow[];
};

export type ReferenceLegendItem = {
  tag: RegulatoryStatusTag;
  label: string;
  description: string;
};

export type PeptideFitCard = {
  category: string;
  title: string;
  bullets: string[];
  variant: PeptideResearchCard["variant"];
};

export type PeptidePairingRow = {
  pairWith: string;
  why: string;
  smartMove: string;
};

export type PeptideCallout = {
  title: string;
  body: string;
  variant: "copper" | "energy" | "b12" | "pink" | "gold" | "red";
};

export type ExpectationsRow = {
  claim: string;
  honest: string;
};

export type DeepDiveSectionHeadings = {
  research?: string;
  topical?: string;
  fit?: string;
  pairing?: string;
  expectations?: string;
};

export type PeptideEducationContentType = "foundations" | "reference" | "best-fit" | "deep-dive";

export type BestUseCaseGoalRow = {
  priority: string;
  peptides: string;
  useCase: string;
};

export type BestUseCaseEntry = {
  name: string;
  composition?: string;
  category: string;
  benefits: string;
  bestUseCase: string;
  kind: "blend" | "single";
};

export type PeptideEducationGuide = {
  id: string;
  label: string;
  /** Shown in <select> */
  selectLabel: string;
  contentType?: PeptideEducationContentType;
  series: string;
  headline: string;
  headlineAccent?: string;
  subhead: string;
  pills: string[];
  image?: { src: string; alt: string };
  available: boolean;
  teaser?: string;
  /** Peptides 101 */
  introBoxes?: IntroBox[];
  mechanismCards?: PeptideResearchCard[];
  categoryOverviewCards?: PeptideResearchCard[];
  regulatoryTiers?: RegulatoryTierRow[];
  smartQuestionCards?: PeptideResearchCard[];
  flagCallouts?: { green: PeptideCallout; red: PeptideCallout };
  /** Reference list */
  referenceLegend?: ReferenceLegendItem[];
  referenceSections?: ReferenceSection[];
  /** Best-use case / goal matching */
  goalMatchRows?: BestUseCaseGoalRow[];
  blendEntries?: BestUseCaseEntry[];
  singleEntries?: BestUseCaseEntry[];
  accentTheme?: "copper" | "energy" | "b12";
  sectionHeadings?: DeepDiveSectionHeadings;
  expectationsTable?: ExpectationsRow[];
  hero?: {
    title: string;
    body: string;
    stats: { value: string; label: string }[];
  };
  researchCards?: PeptideResearchCard[];
  callouts?: PeptideCallout[];
  topicalSection?: { established: PeptideCallout; caution: PeptideCallout };
  fitCards?: PeptideFitCard[];
  pairingTable?: PeptidePairingRow[];
  closingCallouts?: PeptideCallout[];
};

export const PEPTIDE_EDUCATION_GUIDES: PeptideEducationGuide[] = [
  {
    id: "peptides-101",
    label: "Peptides 101",
    selectLabel: "Peptides 101 — Start here (patient education)",
    contentType: "foundations",
    series: "Hello Gorgeous · Patient Education Series",
    headline: "Peptides",
    headlineAccent: "101",
    subhead:
      "A plain-language guide to what peptides actually are, how they work in the body, and why this category of science is getting so much attention. Education only — no treatment claims.",
    pills: ["#WhatArePeptides", "#HowTheyWork", "#TheCategories", "#SmartQuestions", "#KnowBeforeYouGo"],
    image: {
      src: "/images/peptides/peptide-cheat-sheet.png",
      alt: "Peptide 101 cheat sheet — common peptides and categories",
    },
    available: true,
    introBoxes: [
      {
        title: "What Is a Peptide?",
        body:
          "A peptide is a short chain of amino acids — the same building blocks that make up proteins, just smaller. Where a protein might be hundreds of amino acids long, a peptide is usually only a handful (roughly 2–50). Your body makes thousands of them naturally; they act as messengers, telling cells what to do.",
        variant: "pink",
      },
      {
        title: "Why People Are Talking",
        body:
          "Because peptides are so specific, researchers study them as signals rather than blunt instruments. The interest in wellness and aesthetics comes from this precision — the idea that a small, targeted molecule could support a single pathway. The science is active and evolving, which is exactly why education matters before anything else.",
        variant: "teal",
      },
    ],
    callouts: [
      {
        title: "The most important thing to understand",
        variant: "pink",
        body:
          "\"Peptide\" is a category, not a single product — and the regulatory status varies enormously from one to the next. A few are FDA-approved medications. Some are common in cosmetics. Many are research compounds only, meaning they have not been approved for use in people. This sheet explains the science; it does not recommend, prescribe, or endorse any specific use.",
      },
    ],
    mechanismCards: [
      {
        category: "Mechanism",
        title: "Signaling",
        variant: "pink",
        lead: "The core idea",
        bullets: [
          "Peptides bind to receptors on cells",
          "That binding sends an instruction",
          "Think \"key fitting a lock,\" not a sledgehammer",
        ],
      },
      {
        category: "Mechanism",
        title: "Specificity",
        variant: "teal",
        lead: "Why they're interesting",
        bullets: [
          "Each peptide tends to target one pathway",
          "Narrow focus = the research appeal",
          "Less \"everything everywhere\" than some drugs",
        ],
      },
      {
        category: "Mechanism",
        title: "Fragility",
        variant: "gold",
        lead: "A real limitation",
        bullets: [
          "Stomach enzymes break them down",
          "That's why oral peptides are tricky",
          "Stability and delivery are major hurdles",
        ],
      },
      {
        category: "Mechanism",
        title: "Natural Origin",
        variant: "blue",
        lead: "Already inside you",
        bullets: [
          "Insulin is a peptide. So is collagen-related signaling",
          "The body produces them constantly",
          "Synthetic versions mimic these signals",
        ],
      },
    ],
    categoryOverviewCards: [
      {
        category: "Category",
        title: "Recovery",
        variant: "purple",
        lead: "Often discussed for",
        bullets: ["Tissue repair & healing research", "Anti-inflammatory pathways", "Gut-lining and wound-healing studies"],
      },
      {
        category: "Category",
        title: "Aesthetics",
        variant: "pink",
        lead: "Often discussed for",
        bullets: [
          "Collagen & elastin signaling",
          "Skin barrier and antioxidant research",
          "Some forms used topically in skincare",
        ],
      },
      {
        category: "Category",
        title: "Metabolic",
        variant: "green",
        lead: "Often discussed for",
        bullets: [
          "Energy & mitochondrial research",
          "Fat-metabolism pathway studies",
          "Includes the well-known GLP-1 class*",
        ],
      },
      {
        category: "Category",
        title: "Longevity",
        variant: "gold",
        lead: "Often discussed for",
        bullets: ["Cellular-aging research", "Telomere & circadian-rhythm studies", "Mostly research-stage compounds"],
      },
    ],
    regulatoryTiers: [
      {
        tier: "FDA-Approved",
        meaning: "Reviewed for safety and effectiveness for a specific use. The highest bar.",
        recognize:
          "Has a brand name, a label, and an approved indication. Dispensed by a licensed pharmacy with a prescription.",
      },
      {
        tier: "Cosmetic / Topical",
        meaning: "Used on the surface of the skin in regulated skincare. Common and well understood.",
        recognize: "Found in serums and creams. Makes appearance-related claims, not internal medical ones.",
      },
      {
        tier: "Research-Use-Only",
        meaning: "Made for laboratory study. Not approved for use in people — labels often say exactly that.",
        recognize:
          "Sold to \"labs and researchers.\" Carries a \"not for human consumption\" disclaimer. No prescription workflow.",
      },
    ],
    smartQuestionCards: [
      {
        category: "Ask",
        title: "The Source",
        variant: "navy",
        bullets: [
          "\"Where is this sourced from?\"",
          "\"Is it from a licensed pharmacy?\"",
          "\"Can I see the documentation?\"",
        ],
      },
      {
        category: "Ask",
        title: "The Status",
        variant: "red",
        bullets: [
          "\"Is this FDA-approved for this use?\"",
          "\"Or is it research-only?\"",
          "\"What does the label actually say?\"",
        ],
      },
      {
        category: "Ask",
        title: "The Oversight",
        variant: "teal",
        bullets: [
          "\"Who is supervising this medically?\"",
          "\"What's the follow-up plan?\"",
          "\"What are the known risks?\"",
        ],
      },
      {
        category: "Ask",
        title: "The Evidence",
        variant: "gold",
        bullets: [
          "\"What does the research actually show?\"",
          "\"In people, or only in labs?\"",
          "\"What's still unknown?\"",
        ],
      },
    ],
    flagCallouts: {
      green: {
        title: "Green flags ✓",
        variant: "pink",
        body:
          "Licensed pharmacy sourcing · prescription required · clear medical supervision · honest about what's known and unknown · willing to put answers in writing · realistic expectations.",
      },
      red: {
        title: "Red flags ✕",
        variant: "red",
        body:
          "\"Trust us\" instead of documentation · pressure to decide fast · miracle promises · no prescription or supervision · \"research-use-only\" products offered for personal use · vague sourcing.",
      },
    },
    closingCallouts: [
      {
        title: "A note on GLP-1s",
        variant: "gold",
        body:
          "The GLP-1 class (the family behind well-known FDA-approved weight and diabetes medications) is technically peptide-based — which is why you'll sometimes see it grouped here. But FDA-approved GLP-1 medications are an entirely different regulatory world from research peptides, and the two should never be treated as the same thing.",
      },
      {
        title: "The Hello Gorgeous philosophy",
        variant: "pink",
        body:
          "We'd rather give you honest information than a quick sale. Peptide science is genuinely exciting — and it's also young, and full of products that haven't earned the safety record approved medications have. Knowing the difference is how you stay both hopeful and protected. If you ever have questions, bring them to us.",
      },
    ],
  },
  {
    id: "best-use-case",
    label: "Best Use Case",
    selectLabel: "Best use case — match your goal to peptides & blends",
    contentType: "best-fit",
    series: "Hello Gorgeous · Hello Gorgeous RX™",
    headline: "Which Peptide",
    headlineAccent: "Fits Your Goal?",
    subhead:
      "Match recovery, skin, hormones, longevity, metabolism, sexual wellness, and focus to clinic blends and single peptides we discuss at Hello Gorgeous in Oswego — educational reference only, not a prescription.",
    pills: ["#Recovery", "#Aesthetics", "#HormoneOpt", "#Longevity", "#Metabolic", "#BestFit"],
    image: {
      src: "/images/peptides/peptide-cheat-sheet-full.png",
      alt: "Peptide best-use case cheat sheet — blends and singles",
    },
    available: true,
    goalMatchRows: [
      {
        priority: "Recovery after injury, surgery, or hard training",
        peptides: "HEAL (BPC-157 / TB-500 / KPV), WOLVERINE (BPC-157 / TB-500), BPC-157 solo",
        useCase: "Tissue repair, gut support, reduced inflammatory downtime, mobility",
      },
      {
        priority: "Skin, hair & post-procedure healing",
        peptides: "SKIN (GHK-Cu / KPV), GLOW (BPC-157 / TB-4 / GHK-Cu), GHK-Cu",
        useCase: "Collagen support, barrier repair — pairs with Morpheus8, laser, microneedling",
      },
      {
        priority: "Body composition & GH optimization",
        peptides: "TESA/IPA, CJC/IPA, Sermorelin, Tesamorelin, AOD-9604",
        useCase: "Lean mass, visceral fat, sleep, metabolic health — labs required",
      },
      {
        priority: "Longevity & cellular aging",
        peptides: "LONGEVITY (Epithalon / Thymalin / FOXO4-DRI), Epithalon, NAD+, MOTS-c",
        useCase: "Executive wellness, mitochondrial support, telomere conversation",
      },
      {
        priority: "Energy & vitality",
        peptides: "NAD+, MOTS-c, secretagogue stacks when appropriate",
        useCase: "IV-friendly programs, afternoon fatigue, performance",
      },
      {
        priority: "Sexual wellness",
        peptides: "PT-141, MT-II (Melanotan II)",
        useCase: "Central libido/arousal pathways — full hormone eval first",
      },
      {
        priority: "Stress, mood & focus",
        peptides: "Selank, Semax (often paired)",
        useCase: "Anxiolytic and cognitive wellness without sedative profile",
      },
    ],
    blendEntries: [
      {
        name: "HEAL",
        composition: "BPC-157 / TB-500 / KPV",
        category: "Recovery",
        kind: "blend",
        benefits:
          "Comprehensive tissue repair and recovery support. Anti-inflammatory support, gut lining support, immune modulation, angiogenesis, wound healing.",
        bestUseCase:
          "A well-rounded recovery option for post-procedure, wound care, gastrointestinal health, and injury recovery programs. Three complementary peptides in one protocol.",
      },
      {
        name: "SKIN",
        composition: "GHK-Cu / KPV",
        category: "Aesthetics",
        kind: "blend",
        benefits:
          "Collagen and skin health support. Skin barrier repair, wound healing support, anti-inflammatory properties, antioxidant activity, hair follicle support.",
        bestUseCase:
          "A natural fit for aesthetic and med spa programs — alongside post-procedure recovery (laser, filler, peel) and anti-aging skin menus.",
      },
      {
        name: "GLOW",
        composition: "BPC-157 / TB-4 / GHK-Cu",
        category: "Aesthetics",
        kind: "blend",
        benefits:
          "Skin regeneration and tissue health support. Collagen synthesis support, angiogenesis, immune modulation, post-procedure healing support, hair and follicle health support.",
        bestUseCase:
          "Well-suited for microneedling, laser, and IV therapy menus. The blend name supports patient-facing program branding within skin health offerings.",
      },
      {
        name: "WOLVERINE",
        composition: "BPC-157 / TB-500",
        category: "Recovery",
        kind: "blend",
        benefits:
          "Tissue regeneration and injury recovery support. Tendon, ligament, and muscle recovery support, reduced inflammatory downtime, improved flexibility and mobility.",
        bestUseCase:
          "Sports medicine, orthopedic recovery support, and active lifestyle programs. Consider HEAL when additional anti-inflammatory support may be appropriate.",
      },
      {
        name: "TESA/IPA",
        composition: "Tesamorelin / Ipamorelin",
        category: "Hormone optimization",
        kind: "blend",
        benefits:
          "GH optimization and body composition support. Visceral fat reduction support, lean mass support, lipid profile support, IGF-1 support, sleep quality support.",
        bestUseCase:
          "Hormone optimization, body recomposition, and anti-aging programs — two complementary GH release pathways.",
      },
      {
        name: "CJC/IPA",
        composition: "CJC-1295 No DAC / Ipamorelin",
        category: "Hormone optimization",
        kind: "blend",
        benefits:
          "GH optimization and anti-aging support. Lean mass support, body composition support, sleep quality support, IGF-1 support, recovery support.",
        bestUseCase:
          "One of the most widely referenced GH secretagogue combinations — a practical starting point for hormone optimization or long-term wellness protocols.",
      },
      {
        name: "LONGEVITY",
        composition: "Epithalon / Thymalin / FOXO4-DRI",
        category: "Longevity",
        kind: "blend",
        benefits:
          "Cellular aging and longevity support. Telomere length support, immune function support, senescent cell modulation, circadian regulation support, antioxidant properties.",
        bestUseCase:
          "Longevity-focused programs, concierge medicine, and executive wellness panels — three peptides addressing different aspects of cellular aging.",
      },
    ],
    singleEntries: [
      {
        name: "BPC-157",
        category: "Tissue repair",
        kind: "single",
        benefits:
          "Tissue healing and gut health support. Tendon, ligament, and muscle repair support, gastrointestinal mucosal support, angiogenesis, neuroprotective properties.",
        bestUseCase:
          "One of the most broadly applicable peptides — orthopedic recovery, GI health, sports medicine, and post-procedure support.",
      },
      {
        name: "GHK-Cu",
        category: "Regenerative",
        kind: "single",
        benefits:
          "Collagen production and skin health support. Elastin synthesis support, wound healing support, anti-inflammatory properties, hair follicle support, antioxidant activity.",
        bestUseCase:
          "Aesthetic, med spa, wound care, and hair restoration programs — standalone or inside SKIN or GLOW blends.",
      },
      {
        name: "AOD-9604",
        category: "Metabolic / fat loss",
        kind: "single",
        benefits:
          "Fat metabolism and body composition support. Selective lipolysis support, lipogenesis inhibition, no noted impact on blood glucose or IGF-1.",
        bestUseCase:
          "Weight management and body recomposition programs — GH fragment pathway without broader hormonal effects.",
      },
      {
        name: "MOTS-c",
        category: "Metabolic health",
        kind: "single",
        benefits:
          "Metabolic regulation and energy support. Mitochondrial biogenesis support, AMPK pathway activation, insulin sensitivity support, exercise performance support.",
        bestUseCase:
          "Metabolic health, sports performance, and longevity programs — mitochondrially-derived peptide with a compelling wellness narrative.",
      },
      {
        name: "Sermorelin",
        category: "Hormone optimization",
        kind: "single",
        benefits:
          "Natural GH stimulation and anti-aging support. Endogenous GH stimulation via pituitary, sleep quality support, lean muscle support, fat metabolism support.",
        bestUseCase:
          "A well-established starting point for clinics introducing GH secretagogue programs — practical entry-level option.",
      },
      {
        name: "Tesamorelin",
        category: "Hormone optimization",
        kind: "single",
        benefits:
          "Visceral fat reduction and GH axis support. IGF-1 support, cognitive wellness support, lipid profile improvement support, GH axis pulsatility support.",
        bestUseCase:
          "Body recomposition, metabolic health, and hormone optimization — among the most extensively researched GH-related peptides.",
      },
      {
        name: "Epithalon",
        category: "Longevity",
        kind: "single",
        benefits:
          "Telomere and longevity support. Telomerase activity support, melatonin and circadian rhythm regulation support, antioxidant properties, immune surveillance support.",
        bestUseCase:
          "Longevity, anti-aging, and executive wellness programs — extensively researched cellular aging narrative.",
      },
      {
        name: "NAD+",
        composition: "technically a coenzyme",
        category: "Cellular energy",
        kind: "single",
        benefits:
          "Cellular energy and vitality support. Sirtuin pathway activation, ATP production support, DNA repair support, mitochondrial function support, cognitive wellness support.",
        bestUseCase:
          "IV therapy, longevity, and energy wellness programs — strong patient awareness; pairs with Epithalon and MOTS-c.",
      },
      {
        name: "PT-141",
        composition: "Bremelanotide",
        category: "Sexual health",
        kind: "single",
        benefits:
          "Sexual arousal and libido support. CNS-mediated support for male and female patients, central mechanism independent of vascular pathways.",
        bestUseCase:
          "Sexual wellness and hormone optimization programs — best alongside a comprehensive hormonal wellness evaluation.",
      },
      {
        name: "MT-II",
        composition: "Melanotan II",
        category: "Sexual health",
        kind: "single",
        benefits:
          "Libido and sexual function support. Erectile function support via central melanocortin receptors, melanin stimulation, appetite modulation support.",
        bestUseCase:
          "Sexual wellness and men's health programs — operates through a central mechanism.",
      },
      {
        name: "Selank",
        category: "Mental wellness",
        kind: "single",
        benefits:
          "Stress and anxiety support. Anxiolytic properties without sedation or dependency profile, GABA-B modulation, memory support under stress, mood stabilization support.",
        bestUseCase:
          "Stress management, mood wellness, and integrative medicine programs — pairs well with Semax.",
      },
      {
        name: "Semax",
        category: "Cognitive health",
        kind: "single",
        benefits:
          "Cognitive wellness and focus support. BDNF upregulation support, dopaminergic and serotonergic modulation, neuroprotective properties, memory consolidation support.",
        bestUseCase:
          "Cognitive wellness, executive performance, and neurological rehabilitation support — intranasal delivery supports convenience.",
      },
    ],
    callouts: [
      {
        title: "Rule of thumb",
        variant: "pink",
        body:
          "If you cannot explain your goal in one sentence, book the consult first — Ryan Kent, FNP-BC will narrow the menu with you. Prescriptions are individual medical decisions after history, meds review, and labs when indicated.",
      },
    ],
    closingCallouts: [
      {
        title: "Educational reference only",
        variant: "gold",
        body:
          "This guide maps commonly discussed peptides and blends to best-fit use cases — not medical advice. No medical claims are made. Hello Gorgeous RX™ protocols are prescribed only when clinically appropriate after in-person evaluation.",
      },
    ],
  },
  {
    id: "reference-list",
    label: "Reference List",
    selectLabel: "Peptide reference list — categories & regulatory status",
    contentType: "reference",
    series: "Hello Gorgeous · Education Reference",
    headline: "Peptide",
    headlineAccent: "Reference List",
    subhead:
      "A categorized reference of commonly discussed peptides — what each one is, the research focus, and its regulatory status. Reference only. Not dosing or treatment guidance.",
    pills: ["#Recovery", "#Aesthetics", "#Metabolic", "#Hormone", "#Longevity", "#Cognitive", "#Sexual"],
    image: {
      src: "/images/peptides/peptide-cheat-sheet-full.png",
      alt: "Full peptide reference cheat sheet",
    },
    available: true,
    referenceLegend: [
      { tag: "rx", label: "FDA-Approved exists", description: "approved drug in this family" },
      { tag: "cosmetic", label: "Cosmetic / Topical", description: "used in skincare" },
      { tag: "research", label: "Research-Use-Only", description: "not approved for human use" },
    ],
    referenceSections: [
      {
        heading: "Recovery & Tissue Repair",
        rows: [
          {
            name: "BPC-157",
            alt: "Body Protection Compound",
            focus:
              "A synthetic peptide fragment studied for tissue repair, gut-lining support, and angiogenesis in lab/animal research.",
            statusTag: "research",
            statusNote: "FDA flagged as Category 2 (safety risk) for compounding",
          },
          {
            name: "TB-500 / TB-4",
            alt: "Thymosin Beta-4",
            focus:
              "A synthetic version of a naturally occurring protein, studied for tissue regeneration and flexibility/recovery research.",
            statusTag: "research",
          },
          {
            name: "KPV",
            alt: "α-MSH fragment",
            focus: "A tripeptide studied for anti-inflammatory and immune-modulation pathways.",
            statusTag: "research",
          },
        ],
      },
      {
        heading: "Aesthetics & Skin",
        rows: [
          {
            name: "GHK-Cu",
            alt: "Copper Tripeptide-1",
            focus:
              "A copper-binding peptide widely used in topical skincare; studied for collagen/elastin signaling, antioxidant activity, and skin-barrier support.",
            statusTag: "cosmetic",
            statusNote: "Common in serums; injectable use is research-only",
          },
          {
            name: "Palmitoyl peptides",
            alt: "e.g. Matrixyl / pentapeptides",
            focus:
              "A family of cosmetic peptides found in anti-aging skincare; marketed for the appearance of fine lines.",
            statusTag: "cosmetic",
          },
          {
            name: "Argireline",
            alt: "Acetyl Hexapeptide-8",
            focus: "A topical cosmetic peptide marketed for the look of expression lines.",
            statusTag: "cosmetic",
          },
        ],
      },
      {
        heading: "Metabolic & Weight",
        rows: [
          {
            name: "Semaglutide",
            alt: "GLP-1 receptor agonist",
            focus: "The peptide behind well-known FDA-approved diabetes and weight-management medications.",
            statusTag: "rx",
            statusNote: "Brand medications are approved; compounding now restricted",
          },
          {
            name: "Tirzepatide",
            alt: "GIP / GLP-1 agonist",
            focus: "A dual-pathway peptide behind FDA-approved diabetes and weight medications.",
            statusTag: "rx",
            statusNote: "Off shortage list since Oct 2024; compounding restricted",
          },
          {
            name: "AOD-9604",
            alt: "GH fragment 176-191",
            focus:
              "A fragment of growth hormone studied for fat-metabolism pathways without broader hormonal effects.",
            statusTag: "research",
          },
          {
            name: "MOTS-c",
            focus:
              "A mitochondrially-derived peptide studied for metabolic regulation, AMPK activation, and energy research.",
            statusTag: "research",
          },
        ],
      },
      {
        heading: "Hormone Optimization (GH Secretagogues)",
        rows: [
          {
            name: "Sermorelin",
            focus: "A growth-hormone-releasing hormone analog historically studied for endogenous GH stimulation.",
            statusTag: "rx",
            statusNote: "Previously approved; now primarily compounded",
          },
          {
            name: "Tesamorelin",
            focus:
              "A GHRH analog; an FDA-approved brand exists for a specific indication. Studied for body composition and lipid research.",
            statusTag: "rx",
          },
          {
            name: "CJC-1295",
            alt: 'often "No DAC"',
            focus: "A GHRH analog studied as a GH secretagogue in research settings.",
            statusTag: "research",
          },
          {
            name: "Ipamorelin",
            focus:
              "A selective GH secretagogue frequently referenced alongside CJC-1295 in optimization research.",
            statusTag: "research",
          },
        ],
      },
      {
        heading: "Longevity & Cellular Aging",
        rows: [
          {
            name: "Epithalon",
            alt: "Epitalon",
            focus: "A synthetic tetrapeptide studied for telomerase activity and circadian-rhythm research.",
            statusTag: "research",
          },
          {
            name: "Thymalin",
            focus: "A thymus-derived peptide preparation studied for immune-function research.",
            statusTag: "research",
          },
          {
            name: "FOXO4-DRI",
            focus:
              "A research peptide studied in the context of senescent-cell biology. Early-stage lab research only.",
            statusTag: "research",
          },
          {
            name: "NAD+",
            alt: "technically a coenzyme",
            focus:
              "Not a peptide, but frequently grouped with this category; studied for cellular energy and used in some IV wellness settings.",
            statusTag: "research",
            statusNote: "Status varies by form/route",
          },
        ],
      },
      {
        heading: "Cognitive, Mood & Sexual Wellness",
        rows: [
          {
            name: "Selank",
            focus: "A synthetic peptide studied for anxiolytic and stress-related pathways in research.",
            statusTag: "research",
          },
          {
            name: "Semax",
            focus: "A synthetic peptide studied for BDNF and cognitive/neuroprotective research.",
            statusTag: "research",
          },
          {
            name: "PT-141",
            alt: "Bremelanotide",
            focus: "A melanocortin peptide; an FDA-approved brand exists for a specific sexual-health indication.",
            statusTag: "rx",
          },
          {
            name: "MT-II",
            alt: "Melanotan II",
            focus: "A melanocortin peptide studied for melanin and appetite pathways.",
            statusTag: "research",
            statusNote: "FDA has warned about unapproved versions",
          },
        ],
      },
    ],
    callouts: [
      {
        title: "Reading the status column",
        variant: "pink",
        body:
          "Notice the pattern: the metabolic peptides people actually recognize (semaglutide, tirzepatide) come from the FDA-approved world and require a licensed pharmacy and a prescription. Most others on these lists are research-use-only — meaning the science is real but human use has not been approved.",
      },
      {
        title: "Before anything from this list goes near a patient",
        variant: "red",
        body:
          "Most of these are research-use-only and several are FDA Category-2 flagged, meaning even a licensed 503A pharmacy may not be permitted to compound them for human use. Any decision about what is appropriate to offer must be made by Ryan Kent, FNP-BC as the prescribing clinician, with product sourced from a licensed pharmacy and your malpractice carrier informed. This sheet is a reference, not a green light.",
      },
      {
        title: "The Hello Gorgeous way",
        variant: "pink",
        body:
          "Knowing the whole landscape is exactly how you stay the trusted expert. The categories with FDA-approved members are where a legitimate, insurable program lives. That's the lane that protects your license, your patients, and 10+ years of reputation.",
      },
    ],
  },
  {
    id: "ghk-cu",
    contentType: "deep-dive",
    accentTheme: "copper",
    label: "GHK-Cu",
    selectLabel: "GHK-Cu — Copper peptides & your skin",
    series: "Hello Gorgeous · Skincare Science Series",
    headline: "Copper Peptides",
    headlineAccent: "& Your Skin",
    subhead:
      "The story behind GHK-Cu — one of the most studied ingredients in skincare science — and why it keeps showing up in serums, post-treatment care, and the conversation about aging skin.",
    pills: ["#GHKCu", "#CopperPeptide", "#CollagenScience", "#SkinBarrier", "#PostTreatmentGlow"],
    image: {
      src: "/images/peptides/ghkcu-benefits.png",
      alt: "GHK-Cu copper peptide benefits — collagen, skin repair, wound healing",
    },
    available: true,
    hero: {
      title: "So What Is It, Really?",
      body:
        "GHK-Cu (you'll see it on ingredient labels as Copper Tripeptide-1) is a tiny peptide made of just three amino acids bound to a copper ion. Your body already makes it — first discovered in human blood plasma in 1973, where it helps signal skin to repair and renew. Natural levels drop steeply with age, which is right when skin starts to show it.",
      stats: [
        {
          value: "1973",
          label: "First isolated from human plasma — over five decades of research behind it",
        },
        {
          value: "~60%",
          label:
            "Estimated drop in the body's natural copper-peptide signaling from young adulthood toward age 60",
        },
      ],
    },
    researchCards: [
      {
        category: "Studied For",
        title: "Collagen",
        variant: "copper",
        bullets: [
          "Signals fibroblasts (your collagen-makers)",
          "Linked to collagen & elastin synthesis",
          "The firmness conversation starts here",
        ],
      },
      {
        category: "Studied For",
        title: "Barrier",
        variant: "pink",
        bullets: [
          "Supports the skin's protective barrier",
          "Researched for texture & hydration",
          "Why it feels \"smoothing\"",
        ],
      },
      {
        category: "Studied For",
        title: "Healing",
        variant: "teal",
        bullets: [
          "Decades of wound-healing research",
          "Studied for calming irritated skin",
          "Part of why it pairs with treatments",
        ],
      },
      {
        category: "Studied For",
        title: "Antioxidant",
        variant: "gold",
        bullets: [
          "Researched for antioxidant activity",
          "Helps the \"tired, dull\" conversation",
          "Supports overall skin resilience",
        ],
      },
    ],
    callouts: [
      {
        title: "Why the science nerds love it",
        variant: "copper",
        body:
          "GHK-Cu isn't a one-trick ingredient. Gene-expression studies have shown it influences a remarkably wide range of skin-remodeling pathways — unusual for such a small molecule, and a big reason it's one of the most-cited peptides in dermatology research.",
      },
    ],
    topicalSection: {
      established: {
        title: "What's well-established ✓",
        variant: "pink",
        body:
          "Topical GHK-Cu in quality skincare has a long, well-studied track record for the appearance of firmness, texture, and post-treatment comfort. This is the lane with the strongest, safest evidence — and the one we love for at-home care.",
      },
      caution: {
        title: "What deserves caution",
        variant: "gold",
        body:
          "You'll see GHK-Cu marketed in injectable and \"research\" forms online. Those are an entirely different regulatory and safety category from cosmetic topicals — not something to DIY. If you're curious about injectable protocols, that's a conversation for a licensed clinician, not a website cart.",
      },
    },
    fitCards: [
      {
        category: "Great Fit",
        title: "Maturing Skin",
        variant: "pink",
        bullets: [
          "Noticing firmness & texture changes",
          "Wants a research-backed active",
          "Building a serious routine",
        ],
      },
      {
        category: "Great Fit",
        title: "Post-Treatment",
        variant: "teal",
        bullets: [
          "After microneedling, laser, peels*",
          "Wants calm, supported recovery",
          "*Always per your provider's plan",
        ],
      },
      {
        category: "Great Fit",
        title: "Sensitive Types",
        variant: "gold",
        bullets: [
          "Finds retinol too harsh some nights",
          "Wants a gentler repair-focused step",
          "Looking to round out a routine",
        ],
      },
      {
        category: "Maybe Wait",
        title: "If This Is You",
        variant: "navy",
        bullets: [
          "Brand-new to actives (start simple)",
          "Mid-flare or very reactive right now",
          "Pregnant/nursing — ask first",
        ],
      },
    ],
    pairingTable: [
      {
        pairWith: "Hyaluronic Acid",
        why: "Hydration + repair signaling is a classic, comfortable combo.",
        smartMove: "Great daily layering partner.",
      },
      {
        pairWith: "Peptide / barrier moisturizers",
        why: 'Reinforces the same "support and repair" theme.',
        smartMove: "Seal it in at the end.",
      },
      {
        pairWith: "Vitamin C",
        why: "Some formulas don't love sharing a layer with copper.",
        smartMove: "Many split them — C in AM, copper in PM.",
      },
      {
        pairWith: "Strong exfoliating acids",
        why: "Stacking too many actives at once can overwhelm skin.",
        smartMove: "Alternate nights instead of piling on.",
      },
    ],
    closingCallouts: [
      {
        title: "The honest fine print",
        variant: "copper",
        body:
          "Skincare results are gradual and personal — topical actives are usually a \"weeks, consistently\" story, not overnight. More is not better with copper peptides; a well-formulated product used as directed beats overdoing it. Nothing in skincare replaces sunscreen — it's still the single most proven anti-aging step.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        variant: "pink",
        body:
          "We love copper peptides because the science is genuinely there — not because they're trendy. We'd rather walk you through what an ingredient actually does than sell you a miracle. If you want help fitting GHK-Cu into your routine, or pairing it with your treatment plan, that's exactly what we're here for.",
      },
    ],
  },
  {
    id: "nad-plus",
    contentType: "deep-dive",
    accentTheme: "energy",
    label: "NAD+",
    selectLabel: "NAD+ — Cellular energy & longevity",
    series: "Hello Gorgeous · Wellness Science Series",
    headline: "NAD+",
    headlineAccent: "& Cellular Energy",
    subhead:
      "The molecule behind the \"cellular energy\" conversation — what NAD+ actually is, why it's everywhere in wellness right now, and how to think about it like a smart, informed human.",
    pills: ["#NADplus", "#CellularEnergy", "#Mitochondria", "#HealthyAging", "#WellnessScience"],
    image: {
      src: "/images/nad-plus/peptide-science-hero.png",
      alt: "NAD+ cellular energy — mitochondria and wellness science",
    },
    available: true,
    sectionHeadings: {
      topical: "Ways you'll see it offered",
      fit: "Who tends to be curious about it",
      expectations: "Setting real expectations",
    },
    hero: {
      title: "So What Is It, Really?",
      body:
        "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme found in every living cell in your body. Think of it as a helper molecule your cells can't run without — it's central to turning the food you eat into usable energy (ATP), and it plays a role in DNA repair and cellular signaling. Research shows natural NAD+ levels decline as we age, which is part of the \"why am I more tired and slower to bounce back\" story.",
      stats: [
        {
          value: "Every Cell",
          label: "NAD+ is found in all living cells — it's foundational, not exotic",
        },
        {
          value: "↓ With Age",
          label: "Levels are understood to decline over time, which fuels the longevity research interest",
        },
      ],
    },
    researchCards: [
      {
        category: "Studied For",
        title: "Energy",
        variant: "energy",
        bullets: [
          "Helps convert nutrients into ATP",
          "Central to mitochondrial function",
          "The \"cellular fuel\" conversation",
        ],
      },
      {
        category: "Studied For",
        title: "Repair",
        variant: "pink",
        bullets: [
          "Involved in DNA repair pathways",
          "Researched for cellular maintenance",
          "Part of the \"healthy aging\" interest",
        ],
      },
      {
        category: "Studied For",
        title: "Brain",
        variant: "teal",
        bullets: [
          "Studied for focus & mental clarity",
          "Researched for neuroprotection",
          "Why people mention \"fog lifting\"",
        ],
      },
      {
        category: "Studied For",
        title: "Longevity",
        variant: "gold",
        bullets: [
          "Activates sirtuins (longevity proteins)",
          "A focus in longevity medicine",
          "The \"aging well\" research lane",
        ],
      },
    ],
    callouts: [
      {
        title: "The simplest way to picture it",
        variant: "energy",
        body:
          "Imagine your cells are tiny engines and NAD+ is the spark that helps them run. You can't see it or feel it directly — but when levels are healthy, the whole system tends to hum along better. The wellness interest is all about supporting that spark as we get older.",
      },
    ],
    topicalSection: {
      established: {
        title: "IV & injectable forms",
        variant: "pink",
        body:
          "Delivered directly so levels rise quickly. This is the form most associated with wellness clinics. Because it's administered, it's a medical service — meaning it should always involve a qualified provider, proper screening, and the right setting. Not a DIY situation.",
      },
      caution: {
        title: "Oral precursors (NMN / NR)",
        variant: "gold",
        body:
          "Supplements like nicotinamide riboside are \"precursors\" — building blocks the body converts toward NAD+. Convenient, but they travel through digestion first. Quality and regulation vary widely between brands, so this is a read-the-label category.",
      },
    },
    fitCards: [
      {
        category: "Common Goal",
        title: "Low Energy",
        variant: "energy",
        bullets: [
          "Feeling run-down or \"flat\"",
          "Wants a cellular-level approach",
          "Already dialed in sleep & basics",
        ],
      },
      {
        category: "Common Goal",
        title: "Brain Fog",
        variant: "pink",
        bullets: [
          "Mental clarity & focus goals",
          "Curious about longevity science",
          "Likes an evidence-informed plan",
        ],
      },
      {
        category: "Common Goal",
        title: "Recovery",
        variant: "gold",
        bullets: [
          "Active lifestyle, wants to bounce back",
          "Interested in healthy aging",
          "Building a wellness routine",
        ],
      },
      {
        category: "Talk First If",
        title: "This Is You",
        variant: "navy",
        bullets: [
          "Pregnant / nursing",
          "Any medical condition or medications",
          "Always get cleared by a provider",
        ],
      },
    ],
    expectationsTable: [
      {
        claim: "\"Instant energy boost\"",
        honest:
          "Some people report feeling refreshed; responses are individual and not guaranteed. It's a support tool, not a switch.",
      },
      {
        claim: "\"Reverses aging\"",
        honest:
          "The research is about supporting cellular processes — not turning back a clock. Be skeptical of anything that promises that.",
      },
      {
        claim: "\"Works for everyone\"",
        honest:
          "It doesn't. Results vary, and the fundamentals (sleep, nutrition, movement) still matter most.",
      },
      {
        claim: "\"More is better\"",
        honest:
          "No. Administered too fast, NAD+ infusions can feel uncomfortable — which is exactly why setting and supervision matter.",
      },
    ],
    closingCallouts: [
      {
        title: "The honest fine print",
        variant: "energy",
        body:
          "Much of the most exciting NAD+ research is still emerging, and a lot of it comes from early or preclinical studies. That doesn't mean it's not promising — it means honesty matters. Anyone who tells you it's a miracle is selling, not informing. The basics — sleep, nutrition, movement, sun protection — are still the foundation everything else sits on.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        variant: "pink",
        body:
          "We're genuinely excited about cellular-wellness science — and we're just as committed to being straight with you about what's known and what isn't. If NAD+ is something you're curious about, the right first step is a real conversation about your goals, your health history, and whether it even makes sense for you. No pressure, no miracle talk.",
      },
    ],
  },
  {
    id: "methyl-b12",
    contentType: "deep-dive",
    accentTheme: "b12",
    label: "Methyl B12",
    selectLabel: "Methyl B12 — Energy & wellness shots",
    series: "Hello Gorgeous · Wellness Science Series",
    headline: "Methyl B12",
    headlineAccent: "& Your Energy",
    subhead:
      "One of the most popular wellness shots there is — and one of the most well-understood. Here's what methylated B12 actually does, who tends to benefit, and how to think about it clearly.",
    pills: ["#MethylB12", "#Methylcobalamin", "#EnergySupport", "#NerveHealth", "#WellnessShot"],
    image: {
      src: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
      alt: "Methyl B12 wellness injection — energy and vitamin support at Hello Gorgeous",
    },
    available: true,
    sectionHeadings: {
      research: "What B12 supports in the body",
      topical: "Forms you'll see",
      fit: "Who tends to benefit most",
      expectations: "Setting real expectations",
    },
    hero: {
      title: "So What Is It, Really?",
      body:
        "Vitamin B12 is an essential nutrient your body needs for energy metabolism, healthy nerves, red blood cell formation, and DNA synthesis. Methylcobalamin (\"methyl B12\") is the active, ready-to-use form — your body can put it to work immediately without having to convert it first. That's why it's a favorite for injections: delivered into the muscle, it skips the digestive system entirely for reliable absorption.",
      stats: [
        {
          value: "Active Form",
          label: "Methylcobalamin is ready to use — no conversion step required",
        },
        {
          value: "~1 in 10",
          label:
            "Adults over 60 are estimated to be low in B12 — and many younger adults too, often from diet or absorption",
        },
      ],
    },
    researchCards: [
      {
        category: "Supports",
        title: "Energy",
        variant: "b12",
        bullets: [
          "Key role in energy metabolism",
          "Helps turn food into usable fuel",
          "The classic \"why am I so tired\" check",
        ],
      },
      {
        category: "Supports",
        title: "Nerves",
        variant: "pink",
        bullets: [
          "Essential for healthy nerve function",
          "Supports the protective nerve coating",
          "Tied to the \"tingling/numbness\" story",
        ],
      },
      {
        category: "Supports",
        title: "Mood & Focus",
        variant: "teal",
        bullets: [
          "Involved in neurotransmitter production",
          "Linked to mental clarity",
          "Why people mention \"less foggy\"",
        ],
      },
      {
        category: "Supports",
        title: "Blood & Cells",
        variant: "gold",
        bullets: [
          "Needed for red blood cell formation",
          "Part of healthy DNA synthesis",
          "Deficiency is linked to anemia",
        ],
      },
    ],
    callouts: [
      {
        title: "Why \"methylated\" matters to some people",
        variant: "b12",
        body:
          "Most B12 supplements use cyanocobalamin, which your body has to convert into the active form first. Methylcobalamin is already in that active form — which is appealing for people whose bodies don't convert as efficiently. Both forms work; methyl B12 just skips a step.",
      },
    ],
    topicalSection: {
      established: {
        title: "Injection (IM)",
        variant: "pink",
        body:
          "A quick intramuscular shot, the form most associated with med spas and wellness clinics. Bypasses digestion for dependable absorption — popular with people who want a simple, reliable B12 boost. Always given by a trained provider.",
      },
      caution: {
        title: "Oral & sublingual",
        variant: "gold",
        body:
          "Tablets, capsules, and under-the-tongue forms are convenient and widely available. They work for many people — though absorption can vary, especially for those with gut or absorption issues, which is part of why some prefer the shot.",
      },
    },
    fitCards: [
      {
        category: "Great Fit",
        title: "Plant-Based",
        variant: "b12",
        bullets: [
          "Vegetarian or vegan diets",
          "B12 is mostly in animal foods",
          "A common, sensible gap to fill",
        ],
      },
      {
        category: "Great Fit",
        title: "Low Energy",
        variant: "pink",
        bullets: [
          "Persistent fatigue or brain fog",
          "Wants to rule out a real deficiency",
          "Best paired with bloodwork",
        ],
      },
      {
        category: "Great Fit",
        title: "Absorption Issues",
        variant: "gold",
        bullets: [
          "Gut conditions, certain meds, age",
          "May not absorb oral B12 well",
          "Injection bypasses that hurdle",
        ],
      },
      {
        category: "Just So You Know",
        title: "If You're Full",
        variant: "navy",
        bullets: [
          "If your levels are already healthy",
          "Extra B12 is generally well tolerated",
          "But more isn't automatically \"better\"",
        ],
      },
    ],
    expectationsTable: [
      {
        claim: "\"B12 melts fat\"",
        honest:
          "B12 itself isn't a weight-loss drug. It can support energy and metabolism if you're low, but it's not a fat burner on its own — major medical groups are clear on this.",
      },
      {
        claim: "\"Instant energy for everyone\"",
        honest:
          "The lift is most noticeable in people who were actually deficient. If your levels are already good, you may not feel a dramatic change.",
      },
      {
        claim: "\"Replaces a healthy diet\"",
        honest: "Nope. It's a supplement to good nutrition, sleep, and movement — not a substitute for them.",
      },
      {
        claim: "\"You can't get too much\"",
        honest:
          "B12 is water-soluble and generally very safe, but dosing and frequency still deserve a provider's input — especially with other conditions.",
      },
    ],
    closingCallouts: [
      {
        title: "The honest fine print",
        variant: "b12",
        body:
          "B12 injections are one of the safest, most established offerings in wellness — but the most useful thing you can do is know your actual level. A simple blood test tells you whether you're topping off a tank that's already full or filling a real gap. That's the difference between feeling a genuine lift and just chasing a trend.",
      },
      {
        title: "How we think about it at Hello Gorgeous",
        variant: "pink",
        body:
          "We love B12 because it's simple, safe, and genuinely helpful for the right person — and we'd always rather help you figure out if you're that person than just sell you a shot. Curious whether it makes sense for you? Let's talk about your energy, your goals, and whether a quick level check is worth doing first.",
      },
    ],
  },
  {
    id: "bpc-157",
    label: "BPC-157",
    selectLabel: "BPC-157 — Healing & recovery (see best-use guide)",
    series: "Hello Gorgeous · Peptide Therapy Series",
    headline: "BPC-157",
    subhead: "Body Protection Compound — widely discussed for gut lining, tissue repair, and recovery support.",
    available: false,
    teaser:
      "BPC-157 is covered in our Best use case guide (HEAL and WOLVERINE blends) and goal-matching table. Book a Hello Gorgeous RX™ consult to discuss whether it fits your goals.",
  },
  {
    id: "sermorelin",
    label: "Sermorelin",
    selectLabel: "Sermorelin — Natural GH signaling (guide coming soon)",
    series: "Hello Gorgeous · Peptide Therapy Series",
    headline: "Sermorelin",
    subhead: "Growth hormone–releasing peptide analog — sleep, recovery, and body composition when clinically appropriate.",
    available: false,
    teaser:
      "Sermorelin is discussed in hormone optimization and anti-aging protocols after labs and history review. Full guide coming soon — start with our goal-based peptide fit article or book a consult.",
  },
];

export const DEFAULT_PEPTIDE_EDUCATION_ID = "peptides-101";

export function getPeptideEducationGuide(id: string): PeptideEducationGuide | undefined {
  return PEPTIDE_EDUCATION_GUIDES.find((g) => g.id === id);
}
