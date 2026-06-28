/**
 * GLP-1 weight loss science hub — educational content (Hers-style /weight-loss/science).
 * Not prescribing or eligibility guidance; cites published trial literature.
 */

import { GLP1_INTAKE_PATH } from "@/lib/flows";

export const GLP1_WEIGHT_LOSS_SCIENCE_PATH = "/glp1-weight-loss/science" as const;

export const GLP1_SCIENCE_HERO = {
  eyebrow: "Hello Gorgeous RX™ · Medical weight loss",
  headline: "A new era in",
  headlineAccent: "weight loss science",
  subhead:
    "GLP-1 receptor agonists — and dual GLP-1/GIP pathways — work with your biology, not against it. Here’s how the science behind semaglutide and tirzepatide supports appetite, metabolism, and sustainable change.",
} as const;

export type Glp1ScienceMechanism = {
  id: string;
  title: string;
  body: string;
  chips: string[];
};

export const GLP1_SCIENCE_MECHANISMS: Glp1ScienceMechanism[] = [
  {
    id: "glp1-hormone",
    title: "What is GLP-1?",
    body:
      "Glucagon-like peptide-1 (GLP-1) is an incretin hormone your gut releases after eating. It helps signal fullness, supports insulin release when blood sugar rises, and slows how quickly food leaves the stomach. GLP-1 receptor agonists are lab-engineered molecules that activate those same receptors — often with a longer half-life than natural GLP-1.",
    chips: ["Incretin signaling", "Post-meal biology", "Receptor agonist"],
  },
  {
    id: "appetite",
    title: "Appetite & the brain",
    body:
      "Research suggests GLP-1 agonists influence appetite centers in the brain — reducing “food noise” and helping many people feel satisfied with smaller portions. This is biology, not willpower failure. Individual response varies; your provider screens for safety and sets expectations at consult.",
    chips: ["Satiety signals", "Craving reduction", "Individual response"],
  },
  {
    id: "gastric-emptying",
    title: "Slower gastric emptying",
    body:
      "GLP-1 agonists slow gastric emptying for many patients — food stays in the stomach longer, which can extend fullness after meals. That’s also why nausea can occur early in treatment and why dose titration matters.",
    chips: ["Fullness after meals", "Gradual titration", "Side-effect monitoring"],
  },
  {
    id: "dual-pathway",
    title: "Dual pathway: GLP-1 + GIP",
    body:
      "Tirzepatide activates both GLP-1 and GIP (glucose-dependent insulinotropic polypeptide) receptors — a dual incretin approach studied in SURMOUNT trials. Semaglutide is a selective GLP-1 receptor agonist studied extensively in STEP and other trials. Which option fits you is a clinical decision after screening.",
    chips: ["Semaglutide · GLP-1", "Tirzepatide · GLP-1 + GIP", "Provider-selected"],
  },
];

export type Glp1ScienceStat = {
  label: string;
  value: string;
  context: string;
  citationId?: string;
};

export const GLP1_SCIENCE_STATS: Glp1ScienceStat[] = [
  {
    label: "Semaglutide (STEP 1)",
    value: "~14.9%",
    context: "Mean body-weight reduction at 68 weeks vs placebo in adults with obesity (trial context).",
    citationId: "step1",
  },
  {
    label: "Tirzepatide (SURMOUNT-1)",
    value: "Up to ~20%+",
    context: "Mean weight reduction at highest studied doses vs placebo over ~72 weeks in obesity trials.",
    citationId: "surmount1",
  },
  {
    label: "Real-world use",
    value: "Millions",
    context: "GLP-1 class medications are widely used for type 2 diabetes and chronic weight management in the U.S.",
  },
  {
    label: "Hello Gorgeous care",
    value: "In-person",
    context: "NP-supervised programs in Oswego — compounded semaglutide & tirzepatide, titrated to you.",
  },
];

export type Glp1ScienceTreatment = {
  id: string;
  name: string;
  rx: true;
  tagline: string;
  href: string;
  moleculeNote: string;
};

export const GLP1_SCIENCE_TREATMENTS: Glp1ScienceTreatment[] = [
  {
    id: "semaglutide-glp1",
    name: "Compounded Semaglutide",
    rx: true,
    tagline: "GLP-1 receptor agonist · weekly injection",
    href: GLP1_INTAKE_PATH,
    moleculeNote: "Same medication class as Wegovy® & Ozempic® — compounded by a licensed pharmacy.",
  },
  {
    id: "tirzepatide-glp1",
    name: "Compounded Tirzepatide",
    rx: true,
    tagline: "Dual GLP-1 + GIP agonist · weekly injection",
    href: GLP1_INTAKE_PATH,
    moleculeNote: "Same medication class as Zepbound® & Mounjaro® — compounded by a licensed pharmacy.",
  },
];

export const GLP1_SCIENCE_LEARN_LINKS = [
  {
    label: "Medical weight loss overview",
    href: "/glp1-weight-loss",
    blurb: "Pricing, process & what to expect in Oswego",
  },
  {
    label: "GLP-1 vs traditional dieting",
    href: "/compare/glp1-vs-traditional-weight-loss",
    blurb: "How medication-supported care differs from diet-only approaches",
  },
  {
    label: "10-week tirzepatide program",
    href: "/tirzepatide-program",
    blurb: "$600 all-in starter plan with in-person training",
  },
  {
    label: "Weight loss + skin tightening",
    href: "/blog/weight-loss-skin-tightening-transformation-oswego-il",
    blurb: "When progress on the scale outpaces skin rebound",
  },
] as const;

export type Glp1ScienceCitation = {
  id: string;
  marker: string;
  text: string;
  href?: string;
};

export const GLP1_SCIENCE_CITATIONS: Glp1ScienceCitation[] = [
  {
    id: "step1",
    marker: "1",
    text: "Wilding JPH, et al. Once-Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1). N Engl J Med. 2021.",
    href: "https://pubmed.ncbi.nlm.nih.gov/33567185/",
  },
  {
    id: "surmount1",
    marker: "2",
    text: "Jastreboff AM, et al. Tirzepatide Once Weekly for the Treatment of Obesity (SURMOUNT-1). N Engl J Med. 2022.",
    href: "https://pubmed.ncbi.nlm.nih.gov/35658024/",
  },
  {
    id: "glp1-mechanism",
    marker: "3",
    text: "Drucker DJ. Mechanisms of Action and Therapeutic Application of Glucagon-like Peptide-1. Cell Metab. 2018.",
    href: "https://pubmed.ncbi.nlm.nih.gov/29617641/",
  },
  {
    id: "oral-sema",
    marker: "4",
    text: "Aroda VR, Blonde L, Pratley RE. SNAC and oral semaglutide development. Rev Endocr Metab Disord. 2022.",
    href: "https://pubmed.ncbi.nlm.nih.gov/35960387/",
  },
];

export const GLP1_SCIENCE_DISCLAIMER =
  "Educational content only — not medical advice, prescribing, or a guarantee of results. Compounded medications are prepared by licensed pharmacies; brand names (Wegovy®, Ozempic®, Zepbound®, Mounjaro®) are registered trademarks of their respective owners. Eligibility, dosing, and monitoring require an in-person or telehealth evaluation with a licensed prescriber.";
