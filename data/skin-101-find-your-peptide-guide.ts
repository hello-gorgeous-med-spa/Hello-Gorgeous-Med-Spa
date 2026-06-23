/** Find Your Peptide — goal-based matcher guide (Skin 101 / Hello Gorgeous RX™) */

export type PeptideGoalCard = {
  icon: string;
  name: string;
  description: string;
  peptides: string[];
};

export type PeptideProfile = {
  name: string;
  subtitle: string;
  description: string;
  bestFor: string;
  dosing: string;
  href?: string;
};

export type PeptideCompareRow = {
  peptide: string;
  skinHair: boolean;
  recovery: boolean;
  energy: boolean;
  weight: boolean;
  sleep: boolean;
  brain: boolean;
  immune: boolean;
  rxRequired: boolean;
};

export type PeptideExpectItem = {
  icon: string;
  label: string;
  detail: string;
};

export type PeptideNote = {
  title: string;
  text: string;
};

export type FindYourPeptideGuide = {
  slug: string;
  seriesLabel: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  intro: string;
  stats: { value: string; label: string }[];
  disclaimer: string;
  howToSteps: { step: number; title: string; body: string }[];
  goals: PeptideGoalCard[];
  profiles: PeptideProfile[];
  compareRows: PeptideCompareRow[];
  compareColumns: string[];
  expectItems: PeptideExpectItem[];
  notes: PeptideNote[];
  closingTitle: string;
  closingBody: string;
  handoutPath: string;
  featuredImage: { src: string; alt: string };
};

export const FIND_YOUR_PEPTIDE_GUIDE: FindYourPeptideGuide = {
  slug: "find-your-peptide",
  seriesLabel: "Hello Gorgeous RX™ · Patient Education",
  metaTitle:
    "Find Your Peptide | Goal-Based Peptide Guide Oswego IL | BPC-157, Sermorelin, NAD+, GHK-Cu | Hello Gorgeous",
  metaDescription:
    "Which peptide is right for you? Match your goals — skin, recovery, energy, weight, sleep, brain health & more — to BPC-157, Sermorelin, NAD+, GHK-Cu, PT-141 & others. NP-led $49 consult in Oswego, IL.",
  title: "Find Your Peptide",
  subtitle: "Which peptide is right for you?",
  intro:
    "Not every peptide is for everyone — and that's the point. This guide helps you match your health goals to the compounds our NP-led team most commonly discusses. Bring it to your consultation and let's build your Hello Gorgeous RX™ plan together.",
  stats: [
    { value: "9", label: "Wellness goal categories" },
    { value: "12+", label: "Peptide profiles explained" },
    { value: "$49", label: "Peptide consult · Oswego" },
  ],
  disclaimer:
    "Educational content only — not medical advice, diagnosis, or treatment. Many peptides discussed here are research-grade or require prescription oversight. All protocols require medical evaluation and provider guidance. Results vary.",
  howToSteps: [
    {
      step: 1,
      title: "Identify Your Goals",
      body: 'Find your primary focus in the "Start With Your Goal" section below.',
    },
    {
      step: 2,
      title: "Explore Your Options",
      body: "Read the peptide profiles that match — each one does something specific.",
    },
    {
      step: 3,
      title: "Book a Consultation",
      body: "Our NP-led team will review your history and create your personalized protocol.",
    },
  ],
  goals: [
    {
      icon: "✨",
      name: "Skin, Hair & Anti-Aging",
      description:
        "Improving skin firmness, radiance, fine lines, hair thickness, and overall glow from within.",
      peptides: ["GHK-Cu", "Glutathione", "NAD+", "K-Glow", "Epithalon"],
    },
    {
      icon: "🏃",
      name: "Recovery & Healing",
      description:
        "Faster recovery from workouts, injuries, surgery, or chronic tissue discomfort.",
      peptides: ["BPC-157", "TB-500", "HEAL Blend", "Amino Blend"],
    },
    {
      icon: "⚡",
      name: "Energy & Longevity",
      description:
        "More sustained energy, mental clarity, cellular health, and slowing the aging process.",
      peptides: ["NAD+", "MOTS-c", "Epithalon", "Sermorelin"],
    },
    {
      icon: "⚖️",
      name: "Weight & Body Composition",
      description:
        "Reducing excess fat, building lean muscle, and improving metabolic health markers.",
      peptides: ["Tirzepatide", "Tesamorelin", "AOD-9604", "Sermorelin", "Ipamorelin"],
    },
    {
      icon: "🧠",
      name: "Focus & Brain Health",
      description: "Mental clarity, reduced brain fog, cognitive sharpness, and mood stability.",
      peptides: ["NAD+", "Semax", "Selank", "Sermorelin"],
    },
    {
      icon: "🛡️",
      name: "Immune & Inflammation",
      description:
        "Managing chronic inflammation, autoimmune support, and strengthening immune response.",
      peptides: ["Low-Dose Naltrexone", "Glutathione", "BPC-157", "TB-500"],
    },
    {
      icon: "🌙",
      name: "Sleep & Restoration",
      description: "Deeper, more restorative sleep and improved overnight recovery and repair.",
      peptides: ["Sermorelin", "Ipamorelin", "CJC-1295", "Epithalon"],
    },
    {
      icon: "💪",
      name: "Gut Health & Digestion",
      description:
        "Supporting gut lining integrity, reducing digestive discomfort, and gut-immune connection.",
      peptides: ["BPC-157", "Low-Dose Naltrexone", "Glutathione"],
    },
    {
      icon: "💫",
      name: "Intimacy & Vitality",
      description: "Supporting sexual wellness, desire, confidence, and overall quality of life.",
      peptides: ["PT-141", "NAD+", "Sermorelin"],
    },
  ],
  profiles: [
    {
      name: "GHK-Cu",
      subtitle: "The Copper Peptide",
      description:
        "A naturally occurring copper-binding peptide that supports collagen signaling, skin renewal, scalp health, and antioxidant defense.",
      bestFor: "Skin firmness, fine lines, hair thinning, post-procedure healing",
      dosing: "Topical or injectable · 1–2 mg/day",
      href: "/peptides/ghk-cu-injectable",
    },
    {
      name: "BPC-157",
      subtitle: "Body Protection Compound",
      description:
        "A synthetic peptide derived from a gastric protein. Studied for tissue repair, gut lining support, tendon and ligament recovery, and inflammation modulation.",
      bestFor: "Injury recovery, gut health, joint discomfort, post-surgical healing",
      dosing: "Injectable · 250–500 mcg/day",
      href: "/peptides/bpc-157",
    },
    {
      name: "TB-500",
      subtitle: "Thymosin Beta-4 analogue",
      description:
        "A synthetic version of Thymosin Beta-4. Promotes cell migration to injured areas, reduces inflammation, and supports new blood vessel formation for whole-body healing.",
      bestFor: "Muscle tears, chronic injury, athletic performance, vascular health",
      dosing: "Injectable · 2–5 mg/week",
    },
    {
      name: "NAD+",
      subtitle: "Cellular Energy & Longevity",
      description:
        "A coenzyme central to mitochondrial function, DNA repair, and cellular aging. Levels decline with age; replenishment supports energy, brain function, and resilience.",
      bestFor: "Energy, brain fog, healthy aging, metabolism, recovery",
      dosing: "IV or injection · 250–500 mg/day",
      href: "/peptides/nad-plus",
    },
    {
      name: "Glutathione",
      subtitle: "The Master Antioxidant",
      description:
        "The body's primary antioxidant, made from three amino acids. Essential for detoxification, immune defense, skin brightness, and reducing oxidative stress at the cellular level.",
      bestFor: "Skin radiance, detox, immune support, anti-aging",
      dosing: "IV, injection, or oral · 100–300 mg/day",
    },
    {
      name: "Sermorelin",
      subtitle: "Growth Hormone Support",
      description:
        "A synthetic GHRH analogue that stimulates the pituitary to release growth hormone naturally — supporting sleep, body composition, recovery, and vitality.",
      bestFor: "Sleep quality, lean muscle, energy, healthy aging",
      dosing: "Injectable · Provider-directed dosing",
      href: "/peptides/sermorelin",
    },
    {
      name: "Tirzepatide",
      subtitle: "Metabolic Wellness Support",
      description:
        "An incretin-based prescription medication that regulates appetite and glucose metabolism. Used in medically supervised weight management and metabolic wellness programs.",
      bestFor: "Weight loss, appetite control, metabolic health",
      dosing: "Injectable · Prescription only",
    },
    {
      name: "Tesamorelin",
      subtitle: "Body Composition Support",
      description:
        "A GHRH analogue that stimulates growth hormone release. FDA-approved in specific populations and used in provider-guided settings for visceral fat and metabolic goals.",
      bestFor: "Visceral fat, body composition, metabolic wellness",
      dosing: "Injectable · Provider-directed dosing",
      href: "/peptides/tesamorelin",
    },
    {
      name: "Low-Dose Naltrexone",
      subtitle: "Immune Modulation",
      description:
        "At micro-doses, temporarily blocks opioid receptors triggering a rebound in endorphins and immune regulation. Used off-label for chronic inflammation and autoimmune support.",
      bestFor: "Inflammation, autoimmune conditions, pain, mood, gut health",
      dosing: "Oral capsule · 1.5–4.5 mg/day",
    },
    {
      name: "Ipamorelin / CJC-1295",
      subtitle: "GH Signaling Stack",
      description:
        "Often combined: Ipamorelin mimics ghrelin to pulse GH release, while CJC-1295 extends the signal. Together they support sleep, lean muscle, and recovery.",
      bestFor: "Sleep, muscle recovery, body composition, performance",
      dosing: "Injectable · Provider-directed dosing",
    },
    {
      name: "Semax & Selank",
      subtitle: "Cognitive Wellness",
      description:
        "Neuropeptide analogues studied for cognitive support and stress-response signaling. Semax targets focus and mental performance; Selank targets calm and resilience.",
      bestFor: "Brain fog, focus, stress, mental clarity",
      dosing: "Nasal or injectable · Provider-directed",
    },
    {
      name: "PT-141",
      subtitle: "Sexual Wellness Support",
      description:
        "Bremelanotide — a peptide that acts on melanocortin receptors in the brain involved in sexual desire and arousal. Non-hormonal option for intimacy support.",
      bestFor: "Libido, intimacy, sexual wellness (men & women)",
      dosing: "Subcutaneous injection · Provider-directed",
      href: "/peptides/pt-141",
    },
  ],
  compareColumns: ["Skin/Hair", "Recovery", "Energy", "Weight", "Sleep", "Brain", "Immune", "Rx Required"],
  compareRows: [
    { peptide: "GHK-Cu", skinHair: true, recovery: true, energy: false, weight: false, sleep: false, brain: false, immune: false, rxRequired: false },
    { peptide: "BPC-157", skinHair: false, recovery: true, energy: false, weight: false, sleep: false, brain: false, immune: true, rxRequired: false },
    { peptide: "TB-500", skinHair: false, recovery: true, energy: false, weight: false, sleep: false, brain: false, immune: true, rxRequired: false },
    { peptide: "NAD+", skinHair: true, recovery: true, energy: true, weight: false, sleep: false, brain: true, immune: false, rxRequired: false },
    { peptide: "Glutathione", skinHair: true, recovery: false, energy: true, weight: false, sleep: false, brain: false, immune: true, rxRequired: false },
    { peptide: "Sermorelin", skinHair: true, recovery: true, energy: true, weight: true, sleep: true, brain: false, immune: false, rxRequired: true },
    { peptide: "Ipamorelin/CJC", skinHair: false, recovery: true, energy: true, weight: true, sleep: true, brain: false, immune: false, rxRequired: true },
    { peptide: "Tirzepatide", skinHair: false, recovery: false, energy: false, weight: true, sleep: false, brain: false, immune: false, rxRequired: true },
    { peptide: "Tesamorelin", skinHair: false, recovery: false, energy: false, weight: true, sleep: false, brain: false, immune: false, rxRequired: true },
    { peptide: "Low-Dose Naltrexone", skinHair: false, recovery: false, energy: true, weight: false, sleep: true, brain: false, immune: true, rxRequired: true },
    { peptide: "Semax / Selank", skinHair: false, recovery: false, energy: true, weight: false, sleep: false, brain: true, immune: false, rxRequired: true },
    { peptide: "PT-141", skinHair: false, recovery: false, energy: false, weight: false, sleep: false, brain: false, immune: false, rxRequired: true },
  ],
  expectItems: [
    {
      icon: "🩺",
      label: "Consultation",
      detail: "A thorough review of your health history, goals, and labs before any protocol begins",
    },
    {
      icon: "📋",
      label: "Your Protocol",
      detail: "A personalized plan tailored to your unique needs — not a one-size-fits-all package",
    },
    {
      icon: "⏱️",
      label: "Timeline",
      detail: "Most peptides work over weeks to months. Consistency and patience are key to results",
    },
    {
      icon: "🔄",
      label: "Follow-Up",
      detail: "Regular monitoring ensures your plan evolves as your body responds and goals shift",
    },
  ],
  notes: [
    {
      title: "Research Grade",
      text: "Many peptides are for research use only and not FDA-approved. Our team will guide you through what this means for your care and ensure appropriate use.",
    },
    {
      title: "Not One Size Fits All",
      text: "Peptides are not appropriate for everyone. Medical history, current medications, allergies, and lifestyle all factor into what's right for you.",
    },
    {
      title: "Pregnancy & Breastfeeding",
      text: "Most peptides discussed here are not appropriate during pregnancy or breastfeeding. Always disclose your status to your provider.",
    },
    {
      title: "Individual Results Vary",
      text: "Results depend on your unique biology, consistency, lifestyle factors, and adherence to your provider-guided plan. No outcomes are guaranteed.",
    },
  ],
  closingTitle: "Ready to Find Your Protocol?",
  closingBody:
    "Your wellness journey is unique. Book a $49 peptide consultation with our NP-led team in downtown Oswego — we'll review your goals, medical history, and build a Hello Gorgeous RX™ plan that's built around you.",
  handoutPath: "/handouts/peptide-therapy/find-your-peptide.html",
  featuredImage: {
    src: "/images/peptides/peptide-cheat-sheet-full.png",
    alt: "Hello Gorgeous peptide cheat sheet — goal-based peptide reference guide",
  },
};
