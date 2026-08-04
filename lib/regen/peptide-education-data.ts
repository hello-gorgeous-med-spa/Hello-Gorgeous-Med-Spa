/**
 * Peptide Education Hub — learning modules and evidence tier data.
 * Public-facing educational content for Hello Gorgeous RX.
 */

export interface EducationModule {
  n: string;
  time: string;
  title: string;
  body: string;
  href?: string;
}

export const EDUCATION_MODULES: EducationModule[] = [
  {
    n: "01",
    time: "6 min",
    title: "Peptide basics",
    body: "What a peptide is, how it differs from a protein, and why the order of amino acids changes everything.",
    href: "/regen-science/education/peptide-basics",
  },
  {
    n: "02",
    time: "7 min",
    title: "Peptides & your body",
    body: "The peptides you already make and what they regulate — sleep, hunger, growth, repair, arousal.",
    href: "/regen-science/education/peptides-and-your-body",
  },
  {
    n: "03",
    time: "8 min",
    title: "How peptides work",
    body: "Receptor binding, signal cascades, half-life, and why some need injection while others work topically.",
    href: "/regen-science/education/how-peptides-work",
  },
  {
    n: "04",
    time: "9 min",
    title: "Reading the evidence",
    body: "Trials without the headline: effect size, controls, dropouts, and what statistical significance is not.",
    href: "/regen-science/education/reading-the-evidence",
  },
  {
    n: "05",
    time: "6 min",
    title: "From reading to a plan",
    body: "How our NPs turn labs, history, and goals into a protocol — and the reasons we say no.",
    href: "/regen-science/education/from-reading-to-a-plan",
  },
];

export interface LearningStage {
  n: string;
  title: string;
  body: string;
}

export const LEARNING_STAGES: LearningStage[] = [
  {
    n: "1",
    title: "Foundations",
    body: "Amino acids, signaling, and how peptides actually move through the body.",
  },
  {
    n: "2",
    title: "Research literacy",
    body: "How we weigh cell-line, animal, and human trial data — and why it matters.",
  },
  {
    n: "3",
    title: "Molecule deep-dives",
    body: "Mechanism plus trial evidence for the peptides patients ask us about most.",
  },
  {
    n: "4",
    title: "Safety & risk",
    body: "Side effects, contraindications, sourcing, and reading a certificate of analysis.",
  },
  {
    n: "5",
    title: "Your consult",
    body: "What labs we run, what we screen for, and how a protocol is actually built.",
  },
];

export interface EvidenceTier {
  n: string;
  title: string;
  body: string;
  fill: number;
}

export const EVIDENCE_TIERS: EvidenceTier[] = [
  { n: "1", title: "Phase 3 / meta-analysis", body: "Large, randomized, human", fill: 5 },
  { n: "2", title: "Phase 2 / smaller RCT", body: "Human, limited size or duration", fill: 4 },
  { n: "3", title: "Observational / open-label", body: "Human, no proper control group", fill: 3 },
  { n: "4", title: "Animal models", body: "Rodent or larger, not yet human", fill: 2 },
  { n: "5", title: "Cell line / in vitro", body: "Mechanism only, no organism", fill: 1 },
];

export const TIER_COLORS: Record<string, string> = {
  "1": "#E6007E",
  "2": "#FF2D8E",
  "3": "#FF5FB1",
  "4": "#FFC1E2",
  "5": "#FFE0F0",
};

export interface HypeClaimQuiz {
  n: string;
  claim: string;
  tier: number;
  verdict: string;
  answer: string;
}

export const HYPE_CLAIMS: HypeClaimQuiz[] = [
  {
    n: "01",
    claim: "Semaglutide produces around 15% average body-weight loss.",
    tier: 1,
    verdict: "Tier 1 — strongest",
    answer:
      "Backed by a multi-trial program of large, randomized, placebo-controlled human studies. About as strong as peptide evidence gets — which is why it is FDA-approved and why we prescribe it.",
  },
  {
    n: "02",
    claim: "BPC-157 heals tendon and ligament injuries.",
    tier: 4,
    verdict: "Tier 4 — animal data",
    answer:
      "The healing data is almost entirely rodent studies, with no completed human trials. The headline runs well ahead of the evidence, and we say so before anyone spends money on it.",
  },
  {
    n: "03",
    claim: "Copper peptides reverse skin aging at the gene level.",
    tier: 5,
    verdict: "Tier 5, with some Tier 3",
    answer:
      "The dramatic gene-level claim comes from cell-culture work. Topical human evidence exists and is genuinely useful post-procedure, but it is modest — the in-vitro finding is the part that gets quoted.",
  },
];

export interface PeptideCategory {
  title: string;
  sub: string;
  items: {
    name: string;
    tier: string;
    tone: "black" | "pink" | "outline" | "gold" | "amber";
    note: string;
    href?: string;
  }[];
}

export const PEPTIDE_CATEGORIES: PeptideCategory[] = [
  {
    title: "Weight & metabolism",
    sub: "GLP-1 and dual agonists",
    items: [
      {
        name: "Semaglutide",
        tier: "Tier 1",
        tone: "black",
        note: "GLP-1 agonist. Large phase 3 program. FDA-approved and prescribed here.",
        href: "/glp1-weight-loss",
      },
      {
        name: "Tirzepatide",
        tier: "Tier 1",
        tone: "black",
        note: "Dual GIP/GLP-1. Larger average reduction in head-to-head trials.",
        href: "/glp1-weight-loss",
      },
      {
        name: "Tesamorelin",
        tier: "Tier 3",
        tone: "outline",
        note: "Approved for a narrow indication; visceral-fat use beyond it is off-label.",
      },
    ],
  },
  {
    title: "Repair & recovery",
    sub: "Tendon, gut, soft tissue",
    items: [
      {
        name: "BPC-157",
        tier: "Tier 4",
        tone: "gold",
        note: "Strong animal repair data, no human efficacy trials. Not prescribed here.",
      },
      {
        name: "TB-500",
        tier: "Tier 4",
        tone: "gold",
        note: "Thymosin beta-4 fragment, animal-stage only. On the WADA prohibited list.",
      },
      {
        name: "Ipamorelin",
        tier: "Tier 3",
        tone: "outline",
        note: "Selective secretagogue that pulses your own growth hormone. Labs required.",
      },
    ],
  },
  {
    title: "Skin & aesthetics",
    sub: "Copper peptides, antioxidants",
    items: [
      {
        name: "GHK-Cu",
        tier: "Tier 3",
        tone: "outline",
        note: "Copper tripeptide. Striking in-vitro data, modest but real topical results.",
      },
      {
        name: "Glutathione",
        tier: "Tier 3",
        tone: "outline",
        note: "Best evidence is skin tone and brightness. Broader detox claims outrun it.",
      },
      {
        name: "Melanotan II",
        tier: "Tier 4",
        tone: "amber",
        note: "Unregulated tanning peptide with notable safety flags. We do not offer it.",
      },
    ],
  },
  {
    title: "Hormones & vitality",
    sub: "HRT, arousal, energy",
    items: [
      {
        name: "Testosterone",
        tier: "Tier 1",
        tone: "black",
        note: "Established therapy for lab-confirmed deficiency. Repeat morning draws required.",
        href: "/rx/hormones",
      },
      {
        name: "Estradiol",
        tier: "Tier 1",
        tone: "black",
        note: "Extensive menopause literature. Paired with progesterone where indicated.",
        href: "/rx/hormones",
      },
      {
        name: "PT-141",
        tier: "Tier 2",
        tone: "pink",
        note: "Central arousal pathway. Approved for HSDD; blood pressure screened first.",
        href: "/rx/sexual-health",
      },
    ],
  },
];

export interface SafetyTopic {
  h: string;
  b: string;
}

export const SAFETY_TOPICS: SafetyTopic[] = [
  {
    h: "Side-effect frequency",
    b: 'Not "may cause" — the share of trial participants who actually reported it, so you can weigh it honestly.',
  },
  {
    h: "Contraindications",
    b: "The conditions and medications a peptide should never be combined with, checked against your full list.",
  },
  {
    h: "Excluded populations",
    b: "Who the trials never enrolled — pregnancy, certain cancers, organ disease — and why that changes the answer for you.",
  },
  {
    h: "Reading a CoA",
    b: "Purity, mass-spec identity verification, and the honest limits of what those numbers can prove.",
  },
  {
    h: "Regulatory status",
    b: 'FDA-approved, compounded by a licensed pharmacy, or "research use only." We name which one, every time.',
  },
];

export interface ChainNode {
  label: string;
  kind: "aa" | "bond";
}

export const PEPTIDE_CHAIN: ChainNode[] = [
  { label: "Ala", kind: "aa" },
  { label: "—", kind: "bond" },
  { label: "Gly", kind: "aa" },
  { label: "—", kind: "bond" },
  { label: "Lys", kind: "aa" },
  { label: "—", kind: "bond" },
  { label: "Pro", kind: "aa" },
];

export const CHAIN_COPY: Record<string, { title: string; body: string }> = {
  aa: {
    title: "Amino acid",
    body: "One building block. Twenty of them, in different orders, make up every peptide and protein in your body. Which ones and in what sequence is what gives a molecule its job.",
  },
  bond: {
    title: "Peptide bond",
    body: "The link between two amino acids. Short chains — roughly 2 to 50 links — are peptides. Longer chains fold into proteins. That length is why most peptides are injected: your stomach would digest them like food.",
  },
  none: {
    title: "A peptide",
    body: "A short chain of amino acids linked by peptide bonds — a signaling molecule that tells cells to do something they already know how to do. Not a hormone replacement, not magic. Tap a piece above to break it down.",
  },
};

export interface PeptideEducationFaq {
  question: string;
  answer: string;
}

export const PEPTIDE_EDUCATION_FAQS: PeptideEducationFaq[] = [
  {
    question: "Who is this education for?",
    answer:
      'Anyone deciding whether the science supports what they are being sold — including our own patients. If you want to understand peptides at a research level rather than a "what should I stack?" level, start at module 1.',
  },
  {
    question: "Are the modules really free?",
    answer:
      "Yes. All five foundation modules are open with no account, payment, or email. Reading them before your consult means we spend the visit on your labs and history instead of definitions.",
  },
  {
    question: "You prescribe peptides — how is this education neutral?",
    answer:
      'We tag every claim with the evidence tier the underlying study supports, including for products we sell, and we name the ones we will not prescribe. If the honest answer is "not enough data yet," that is what the page says.',
  },
  {
    question: "Why won't you publish dosing?",
    answer:
      "Because dosing is a medical decision that depends on your labs, weight, medications, and tolerance. Published numbers get copied out of context, and that is where people get hurt. Dosing happens in a visit.",
  },
  {
    question: "Can I bring peptides I bought online?",
    answer:
      "Bring the certificate of analysis and we will read it with you. We cannot prescribe, administer, or supervise use of unverified research-supplier vials, but we can discuss a pharmacy-sourced alternative.",
  },
  {
    question: "How often is this content reviewed?",
    answer:
      "Content is re-checked against current literature on a monthly cadence, and our medical director signs off on changes. When a new trial moves a claim up or down a tier, the page changes.",
  },
];
