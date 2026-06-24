/** GLP-1 readiness screener — educational only, not eligibility determination. */

export const GLP1_READINESS_DISCLAIMER =
  "Educational screener only — not medical advice or a guarantee of treatment. A licensed NP must evaluate your full history, labs, and goals before any GLP-1 prescription.";

export type Glp1QuizAnswers = {
  goal?: string;
  bmiRange?: string;
  priorGlp1?: string;
  pregnant?: string;
  pancreatitis?: string;
  men2?: string;
  monthlyFollowUp?: string;
};

export type Glp1QuizResult = {
  tier: "strong" | "review" | "not_eligible";
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export const GLP1_QUIZ_STEPS = [
  {
    id: "goal" as const,
    question: "What's your primary goal?",
    options: [
      { id: "weight", label: "Lose weight & reduce appetite", icon: "⚖️" },
      { id: "metabolic", label: "Blood sugar & metabolic health", icon: "🩺" },
      { id: "both", label: "Both weight and metabolic support", icon: "✨" },
    ],
  },
  {
    id: "bmiRange" as const,
    question: "Which BMI range best describes you today?",
    subtitle: "Self-reported estimate — we confirm at consult",
    options: [
      { id: "under-27", label: "Under 27", icon: "📊" },
      { id: "27-30", label: "27 – 30", icon: "📊" },
      { id: "30-35", label: "30 – 35", icon: "📊" },
      { id: "35-plus", label: "35+", icon: "📊" },
    ],
  },
  {
    id: "priorGlp1" as const,
    question: "Have you used GLP-1 medication before?",
    options: [
      { id: "never", label: "No, never", icon: "🆕" },
      { id: "semaglutide", label: "Yes — semaglutide (Ozempic / Wegovy)", icon: "💉" },
      { id: "tirzepatide", label: "Yes — tirzepatide (Mounjaro / Zepbound)", icon: "💉" },
      { id: "stopped", label: "Yes — stopped due to side effects or cost", icon: "↩️" },
    ],
  },
  {
    id: "pregnant" as const,
    question: "Are you pregnant, breastfeeding, or planning pregnancy in the next 6 months?",
    options: [
      { id: "no", label: "No", icon: "✓" },
      { id: "yes", label: "Yes", icon: "!" },
    ],
  },
  {
    id: "pancreatitis" as const,
    question: "History of pancreatitis or severe ongoing GI disease?",
    options: [
      { id: "no", label: "No", icon: "✓" },
      { id: "not-sure", label: "Not sure", icon: "?" },
      { id: "yes", label: "Yes", icon: "!" },
    ],
  },
  {
    id: "men2" as const,
    question: "Personal or family history of medullary thyroid cancer or MEN2 syndrome?",
    options: [
      { id: "no", label: "No", icon: "✓" },
      { id: "not-sure", label: "Not sure", icon: "?" },
      { id: "yes", label: "Yes", icon: "!" },
    ],
  },
  {
    id: "monthlyFollowUp" as const,
    question: "Our GLP-1 programs include monthly NP check-ins. Is that workable for you?",
    options: [
      { id: "yes", label: "Yes — I want medical oversight", icon: "👍" },
      { id: "no", label: "I prefer minimal follow-up", icon: "—" },
    ],
  },
];

export function scoreGlp1Readiness(answers: Glp1QuizAnswers): Glp1QuizResult {
  if (answers.pregnant === "yes") {
    return {
      tier: "not_eligible",
      title: "Speak with our NP first",
      body: "GLP-1 medications are not used during pregnancy or breastfeeding. If weight or metabolic support is still a goal, Ryan Kent, FNP-BC can discuss safe options at a consult.",
      ctaLabel: "Call our office",
      ctaHref: "tel:630-636-6193",
      secondaryHref: "/glp-1-weight-loss-oswego",
      secondaryLabel: "Learn about our GLP-1 program →",
    };
  }

  if (answers.pancreatitis === "yes" || answers.men2 === "yes") {
    return {
      tier: "not_eligible",
      title: "In-person medical review required",
      body: "Based on your answers, GLP-1 therapy needs a careful NP review before starting. Book a free consult — we'll map safe options, including whether GLP-1 is appropriate.",
      ctaLabel: "Book free GLP-1 consult",
      ctaHref: "/book",
      secondaryHref: "/glp-1-weight-loss-oswego",
      secondaryLabel: "Program overview →",
    };
  }

  const needsReview =
    answers.pancreatitis === "not-sure" ||
    answers.men2 === "not-sure" ||
    answers.monthlyFollowUp === "no" ||
    answers.bmiRange === "under-27";

  if (needsReview) {
    return {
      tier: "review",
      title: "Good next step: NP consultation",
      body: answers.bmiRange === "under-27"
        ? "GLP-1 is often discussed for BMI 27+ with comorbidities, but many clients still benefit from a personalized metabolic plan. Ryan will review your history and labs at a free consult."
        : "Your answers suggest GLP-1 could be worth exploring — but a few items need NP review. Our semaglutide and tirzepatide programs include medication, titration, and monthly check-ins.",
      ctaLabel: "Book free GLP-1 consult",
      ctaHref: "/book",
      secondaryHref: "/glp-1-weight-loss-oswego",
      secondaryLabel: "See pricing & program details →",
    };
  }

  return {
    tier: "strong",
    title: "You may be a strong GLP-1 candidate",
    body: "Based on your screener answers, our NP-supervised semaglutide or tirzepatide program may be a fit. Next step: free consult with labs and candidacy review — no obligation to start.",
    ctaLabel: "Book free GLP-1 consult",
    ctaHref: "/book",
    secondaryHref: "/glp-1-weight-loss-oswego",
    secondaryLabel: "See program pricing →",
  };
}
