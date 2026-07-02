/**
 * Mascot Educational Content
 * Short explanations from each mascot about their specialty products
 */

export type MascotExplanation = {
  product: string;
  mascot: "peppy" | "slim-t" | "harmony";
  headline: string;
  explanation: string;
  benefits: string[];
  funFact?: string;
};

// ============================================
// PEPPY - Peptide Therapy
// ============================================
export const PEPPY_EXPLAINS: MascotExplanation[] = [
  {
    product: "BPC-157",
    mascot: "peppy",
    headline: "The Body's Repair Signal",
    explanation: "BPC-157 is a peptide naturally found in gastric juice. It's like your body's own repair crew, supporting tissue healing and gut health. Athletes and biohackers love it for recovery!",
    benefits: ["Supports tissue repair", "Gut health support", "Recovery from training"],
    funFact: "BPC stands for 'Body Protection Compound' — how cool is that?",
  },
  {
    product: "TB-500",
    mascot: "peppy",
    headline: "The Mobility Molecule",
    explanation: "TB-500 (Thymosin Beta-4) is naturally produced in your thymus. It's all about flexibility and tissue repair — think of it as WD-40 for your joints and muscles!",
    benefits: ["Mobility support", "Tissue flexibility", "Recovery enhancement"],
    funFact: "Thymosin Beta-4 was first discovered in horse racing for injury recovery!",
  },
  {
    product: "Wolverine Stack",
    mascot: "peppy",
    headline: "The Ultimate Recovery Duo",
    explanation: "BPC-157 + TB-500 together? That's the Wolverine Stack! Named after everyone's favorite regenerating mutant, this combo is the gold standard for recovery support.",
    benefits: ["Comprehensive recovery", "Synergistic effects", "Popular with athletes"],
    funFact: "Clients call it the Wolverine Stack because of the regeneration association!",
  },
  {
    product: "KLOW",
    mascot: "peppy",
    headline: "The Premium 4-in-1 Blend",
    explanation: "KLOW combines BPC-157, TB-500, GHK-Cu, AND KPV in one vial. It's our most advanced recovery and skin-support stack — the whole peptide party in one injection!",
    benefits: ["4 peptides in 1", "Recovery + skin support", "Anti-inflammatory"],
    funFact: "KPV is an anti-inflammatory peptide fragment that adds extra healing support!",
  },
  {
    product: "NAD+",
    mascot: "peppy",
    headline: "The Cellular Energy Currency",
    explanation: "NAD+ is a coenzyme in every cell of your body. It's essential for energy production and cellular repair. As we age, NAD+ levels drop — supplementing can help restore that cellular vitality!",
    benefits: ["Cellular energy", "Healthy aging support", "Mental clarity"],
    funFact: "Your NAD+ levels drop by about 50% between ages 40 and 60!",
  },
  {
    product: "Sermorelin",
    mascot: "peppy",
    headline: "The Sleep & Recovery Peptide",
    explanation: "Sermorelin tells your pituitary gland to produce more growth hormone naturally. Better sleep, improved recovery, and that 'I feel younger' effect — all without synthetic GH!",
    benefits: ["Better sleep quality", "Natural GH support", "Recovery enhancement"],
    funFact: "Growth hormone is released in pulses during deep sleep — Sermorelin enhances this!",
  },
  {
    product: "Methylene Blue",
    mascot: "peppy",
    headline: "The Cognitive Enhancer",
    explanation: "Don't let the blue color fool you — Methylene Blue is a powerful mitochondrial support compound. It's been studied for cognitive enhancement and anti-aging properties!",
    benefits: ["Cognitive support", "Mitochondrial health", "Anti-aging research"],
    funFact: "Methylene Blue was the first synthetic drug ever used in medicine — in 1891!",
  },
];

// ============================================
// SLIM-T - Weight Loss
// ============================================
export const SLIM_T_EXPLAINS: MascotExplanation[] = [
  {
    product: "Semaglutide",
    mascot: "slim-t",
    headline: "The Game-Changer",
    explanation: "Semaglutide is a GLP-1 receptor agonist that mimics a hormone your gut naturally produces. It slows digestion, reduces appetite, and helps your body respond better to insulin. This is the real deal!",
    benefits: ["Appetite reduction", "Blood sugar control", "Proven weight loss"],
    funFact: "GLP-1 medications were originally developed for diabetes before weight loss benefits were discovered!",
  },
  {
    product: "Tirzepatide",
    mascot: "slim-t",
    headline: "The Dual-Action Powerhouse",
    explanation: "Tirzepatide hits TWO receptors — GLP-1 AND GIP. That dual action means potentially greater results for many people. It's the newest player and it's making waves!",
    benefits: ["Dual receptor action", "Enhanced results", "Blood sugar support"],
    funFact: "Clinical trials showed average weight loss of 20%+ body weight with tirzepatide!",
  },
  {
    product: "Lipo-Mino",
    mascot: "slim-t",
    headline: "The Metabolism Booster",
    explanation: "Lipo-Mino is a lipotropic injection with B12 and amino acids that support fat metabolism. Think of it as fuel for your fat-burning engine. Great as a standalone or paired with GLP-1s!",
    benefits: ["Metabolism support", "Energy boost", "B12 benefits"],
    funFact: "Lipotropic means 'fat-loving' — these compounds help mobilize fat from the liver!",
  },
];

// ============================================
// HARMONY - Hormones
// ============================================
export const HARMONY_EXPLAINS: MascotExplanation[] = [
  {
    product: "Testosterone Cypionate",
    mascot: "harmony",
    headline: "The Foundation of Male Vitality",
    explanation: "Testosterone is the primary male hormone, but it declines with age. TRT (Testosterone Replacement Therapy) restores optimal levels — think energy, mood, muscle, and drive. It's about feeling like yourself again.",
    benefits: ["Energy restoration", "Mood improvement", "Muscle support", "Libido enhancement"],
    funFact: "Testosterone levels in men decline about 1% per year after age 30!",
  },
  {
    product: "Bi-Est Cream",
    mascot: "harmony",
    headline: "Bioidentical Estrogen Balance",
    explanation: "Bi-Est combines estriol and estradiol in an 80/20 ratio — a gentle, bioidentical approach to estrogen replacement. Applied topically, it's absorbed through the skin for steady hormone levels.",
    benefits: ["Hot flash relief", "Mood stability", "Skin health", "Bone support"],
    funFact: "Bioidentical means the molecular structure is identical to what your body naturally produces!",
  },
  {
    product: "Progesterone",
    mascot: "harmony",
    headline: "The Calming Hormone",
    explanation: "Progesterone balances estrogen and supports sleep, mood, and bone health. Many women describe it as their 'calm' hormone. It's essential for complete hormone balance in women.",
    benefits: ["Better sleep", "Mood balance", "Estrogen balance", "Bone health"],
    funFact: "Progesterone is also called the 'pregnancy hormone' — it prepares the uterus for pregnancy!",
  },
  {
    product: "Clomiphene",
    mascot: "harmony",
    headline: "The Natural T Booster",
    explanation: "Clomiphene stimulates your body to produce more testosterone naturally — great for men who want to boost T without shutting down their own production. It's fertility-friendly too!",
    benefits: ["Natural T production", "Fertility preservation", "LH/FSH stimulation"],
    funFact: "Clomiphene was originally developed as a fertility medication for women!",
  },
];

// Combined exports
export const ALL_MASCOT_EXPLANATIONS = [
  ...PEPPY_EXPLAINS,
  ...SLIM_T_EXPLAINS,
  ...HARMONY_EXPLAINS,
];

export function getExplanationsByMascot(mascot: "peppy" | "slim-t" | "harmony"): MascotExplanation[] {
  return ALL_MASCOT_EXPLANATIONS.filter((e) => e.mascot === mascot);
}

export function getExplanationByProduct(product: string): MascotExplanation | undefined {
  return ALL_MASCOT_EXPLANATIONS.find(
    (e) => e.product.toLowerCase() === product.toLowerCase()
  );
}
