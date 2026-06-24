/** TRT readiness screener — men's testosterone optimization. */

import type { ScreenerAnswers, ScreenerQuizResult, ScreenerQuizStep } from "@/lib/quiz-screener";

export const TRT_READINESS_DISCLAIMER =
  "Educational screener only — not a diagnosis of low testosterone. Ryan Kent, FNP-BC reviews labs, symptoms, and safety before any TRT or hormone protocol.";

export const TRT_QUIZ_STEPS: ScreenerQuizStep[] = [
  {
    id: "age",
    question: "What's your age range?",
    options: [
      { id: "under-30", label: "Under 30", icon: "🌱" },
      { id: "30-39", label: "30 – 39", icon: "🌿" },
      { id: "40-49", label: "40 – 49", icon: "🌳" },
      { id: "50-59", label: "50 – 59", icon: "🍂" },
      { id: "60-plus", label: "60+", icon: "🌺" },
    ],
  },
  {
    id: "symptomLoad",
    question: "How many of these apply to you most days?",
    subtitle: "Low energy · low drive · brain fog · irritability · low libido · poor recovery · fat gain",
    options: [
      { id: "none-few", label: "None or just 1", icon: "○" },
      { id: "several", label: "2 – 4 symptoms", icon: "◐" },
      { id: "many", label: "5 or more", icon: "●" },
    ],
  },
  {
    id: "topConcern",
    question: "What's bothering you most right now?",
    options: [
      { id: "energy", label: "Energy & fatigue", icon: "⚡" },
      { id: "libido", label: "Libido & sexual function", icon: "💫" },
      { id: "muscle", label: "Strength, muscle & body comp", icon: "💪" },
      { id: "mood", label: "Mood, focus & irritability", icon: "🧠" },
      { id: "sleep", label: "Sleep & recovery", icon: "😴" },
    ],
  },
  {
    id: "recentLabs",
    question: "Have you had testosterone labs in the last 12 months?",
    options: [
      { id: "yes-low", label: "Yes — levels were low or borderline", icon: "📉" },
      { id: "yes-normal", label: "Yes — reported as normal", icon: "📊" },
      { id: "no", label: "No / not sure", icon: "?" },
    ],
  },
  {
    id: "currentTherapy",
    question: "Are you currently on TRT or hormone therapy?",
    options: [
      { id: "no", label: "No", icon: "🆕" },
      { id: "yes-optimize", label: "Yes — want to optimize or transfer care", icon: "↗️" },
      { id: "yes-unhappy", label: "Yes — not happy with current protocol", icon: "↩️" },
    ],
  },
  {
    id: "prostate",
    question: "History of prostate cancer or untreated elevated PSA?",
    options: [
      { id: "no", label: "No", icon: "✓" },
      { id: "not-sure", label: "Not sure", icon: "?" },
      { id: "yes", label: "Yes", icon: "!" },
    ],
  },
  {
    id: "delivery",
    question: "Preferred delivery method (if TRT is appropriate)?",
    subtitle: "We'll confirm what's best at consult — no wrong answer",
    options: [
      { id: "injections", label: "Weekly injections", icon: "💉" },
      { id: "pellets", label: "BioTE pellets (every 4–6 months)", icon: "◆" },
      { id: "cream", label: "Topical cream", icon: "🧴" },
      { id: "unsure", label: "Not sure — help me decide", icon: "💬" },
    ],
  },
];

export function scoreTrtReadiness(answers: ScreenerAnswers): ScreenerQuizResult {
  if (answers.prostate === "yes") {
    return {
      tier: "not_eligible",
      title: "Specialized NP review required",
      body: "TRT requires careful evaluation when there's prostate cancer history or significant PSA concerns. Ryan Kent, FNP-BC can review your records and map safe options — including whether TRT is appropriate at all.",
      ctaLabel: "Book hormone consult",
      ctaHref: "/book",
      secondaryHref: "/mens-hormones",
      secondaryLabel: "Men's hormone program →",
    };
  }

  const needsReview =
    answers.prostate === "not-sure" ||
    answers.symptomLoad === "none-few" ||
    (answers.age === "under-30" && answers.symptomLoad !== "many");

  if (needsReview) {
    return {
      tier: "review",
      title: "Labs + consult are the right next step",
      body:
        answers.symptomLoad === "none-few"
          ? "You may still benefit from a baseline hormone panel — many men feel 'normal' until they see their numbers. We never dose blind; Ryan reviews total & free testosterone, SHBG, and more before any TRT discussion."
          : "Your answers suggest hormone optimization could be worth exploring, but we need labs and a full history first. Injections, BioTE pellets, and topical options start with a ~$250–450 baseline panel.",
      ctaLabel: "Book free hormone consult",
      ctaHref: "/book",
      secondaryHref: "/testosterone-replacement-oswego",
      secondaryLabel: "TRT pricing overview →",
    };
  }

  return {
    tier: "strong",
    title: "You may be a strong TRT evaluation candidate",
    body: "Based on your symptoms and history, a comprehensive hormone panel and NP consult is a smart next move. Our men's programs include injections from $200–350/mo, BioTE pellets, and ongoing lab monitoring with Ryan on site 7 days a week.",
    ctaLabel: "Book free hormone consult",
    ctaHref: "/book",
    secondaryHref: "/mens-hormones",
    secondaryLabel: "Learn about men's hormones →",
  };
}
