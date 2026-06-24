/**
 * /mens-hormones — Moonshot-style men's TRT landing.
 * Pricing aligned with lib/oswego-wellness-menus.ts (TRT_OSWEGO_MENU).
 */

import type { FAQ } from "@/lib/seo";
import { GLP1_RETAIL_PROGRAM } from "@/lib/peptide-retail-pricing";
import { GENTLEMENS_CLUB_TIERS } from "@/lib/gentlemens-club";

export const MENS_HORMONES_PATH = "/mens-hormones";

export const MENS_HORMONES_HERO_IMAGE = "/images/rx/rx-hormone-vial.png";

export type LowTSymptom = {
  title: string;
  description: string;
  icon: string;
};

export const LOW_T_SYMPTOMS: LowTSymptom[] = [
  {
    icon: "😴",
    title: "Fatigue",
    description: "Persistent tiredness despite adequate sleep",
  },
  {
    icon: "💫",
    title: "Low Libido",
    description: "Decreased interest in sex or erectile issues",
  },
  {
    icon: "🧠",
    title: "Brain Fog",
    description: "Difficulty concentrating, poor memory",
  },
  {
    icon: "🎭",
    title: "Mood Changes",
    description: "Irritability, depression, lack of motivation",
  },
  {
    icon: "💪",
    title: "Muscle Loss",
    description: "Difficulty building or maintaining muscle",
  },
  {
    icon: "⚖️",
    title: "Weight Gain",
    description: "Increased body fat, especially abdominal — often paired with our GLP-1 program",
  },
  {
    icon: "🌙",
    title: "Poor Sleep",
    description: "Insomnia or unrefreshing sleep",
  },
  {
    icon: "⚡",
    title: "Low Energy",
    description: "Decreased stamina and endurance",
  },
];

export const MENS_HORMONES_QUICK_FACTS = [
  { label: "Starting cost", value: "$200/mo", note: "Weekly injections, all-inclusive" },
  { label: "Baseline labs", value: "$250–450", note: "Before any TRT starts" },
  { label: "Lab monitoring", value: "Every 3–6 mo", note: "PSA, hematocrit & more" },
  { label: "Delivery options", value: "3 methods", note: "Injections · BioTE pellets · cream" },
] as const;

export const MENS_HORMONES_INCLUDED = {
  oversight: {
    title: "Medical oversight",
    bullets: [
      "Ongoing NP supervision by Ryan Kent, FNP-BC",
      "Personalized protocol design",
      "Dosing adjustments as needed",
      "Direct access for questions between visits",
    ],
  },
  program: {
    title: "Program includes",
    bullets: [
      "Comprehensive baseline hormone panel",
      "Follow-up labs at 6–8 weeks, then quarterly",
      "Fertility implications discussed before you start",
      "HSA/FSA-compatible receipts on request",
      "Gentlemen's Club member pricing available",
    ],
  },
} as const;

export const MENS_HORMONES_RELATED_LINKS = [
  { label: "Full TRT pricing & delivery comparison", href: "/testosterone-replacement-oswego" },
  { label: "TRT Readiness Screener (2 min)", href: "/quiz/trt-readiness" },
  { label: "Men's wellness hub — Brotox, peptides & more", href: "/mens-wellness" },
  { label: "BioTE pellet therapy menu", href: "/biote-hormone-therapy-oswego" },
  { label: "Peptide therapy for recovery & performance", href: "/peptide-therapy-men" },
  { label: "GLP-1 medical weight loss", href: "/glp-1-weight-loss-oswego" },
  { label: "The Gentlemen's Club membership", href: "/gentlemens-club" },
] as const;

export const MENS_HORMONES_FAQS: FAQ[] = [
  {
    question: "Is TRT safe?",
    answer:
      "When properly monitored by a licensed NP, testosterone therapy has a strong safety profile for appropriate candidates. We track PSA, hematocrit, estradiol, and other key markers at regular intervals and adjust protocols as needed.",
  },
  {
    question: "Will I need to be on this forever?",
    answer:
      "It depends on your goals and biology. Some men use TRT long-term; others optimize while making lifestyle changes. We discuss timeline, expectations, and alternatives at your consult — no pressure to start.",
  },
  {
    question: "What about fertility?",
    answer:
      "Standard TRT can affect fertility. If preserving fertility matters, we discuss options like HCG or enclomiphene before starting — and we never dose blind without that conversation.",
  },
  {
    question: "Am I a candidate for hormone optimization?",
    answer:
      "Symptoms plus labs tell the story — not age alone. If several low-T symptoms apply, take our TRT Readiness Screener, then book a free consult. Ryan Kent, FNP-BC reviews your full picture before any prescription.",
  },
  {
    question: "How is this different from what my GP does?",
    answer:
      "Most GPs test total testosterone against population ranges and may miss men who are symptomatic but technically 'in range.' We evaluate free testosterone, SHBG, and the full clinical picture. Optimization is the goal — not just checking a box.",
  },
  {
    question: "How long until I feel results?",
    answer:
      "Many men notice improved energy and mood within 3–6 weeks. Body composition, libido, and full benefits often develop over 3–6 months with consistent monitoring — this is optimization, not a quick fix.",
  },
  {
    question: "What does it cost?",
    answer:
      "Weekly injection programs typically run $200–350/mo all-inclusive. BioTE pellets are $750–1,200 per insertion every 4–6 months. Topical creams $150–300/mo. Baseline labs ~$250–450. We quote transparently at consult — see our full TRT menu for details.",
  },
];

export const MENS_HORMONES_GLP1_STACK = {
  semaglutideFrom: GLP1_RETAIL_PROGRAM.semaglutideFromUsd,
  tirzepatideFrom: GLP1_RETAIL_PROGRAM.tirzepatideFromUsd,
};

export const MENS_HORMONES_MEMBERSHIP_FROM = GENTLEMENS_CLUB_TIERS[0]?.pricePerMonth ?? 99;

export const MENS_HORMONES_APPROACH_COPY =
  "We don't prescribe testosterone to everyone who walks in the door. We start with comprehensive testing to understand your full hormonal picture — total and free testosterone, SHBG, thyroid markers, and more.";

export const MENS_HORMONES_APPROACH_COPY_2 =
  "If you're trying to decide whether your symptoms even justify the labs, our 2-minute TRT Readiness Screener helps you see whether a clinical evaluation makes sense. If optimization is appropriate, we build a personalized protocol based on your labs, symptoms, and goals — then monitor closely and adjust. This isn't anti-aging marketing. It's evidence-based medicine focused on helping you feel and perform your best.";
