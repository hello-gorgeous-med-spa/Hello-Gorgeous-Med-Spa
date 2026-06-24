/** Perimenopause & menopause readiness screener — women's BioTE / BHRT. */

import type { ScreenerAnswers, ScreenerQuizResult, ScreenerQuizStep } from "@/lib/quiz-screener";

export const PERIMENOPAUSE_READINESS_DISCLAIMER =
  "Educational screener only — not a diagnosis of perimenopause or menopause. Ryan Kent, FNP-BC reviews symptoms, cycle history, and labs before any bioidentical hormone therapy.";

export const PERIMENOPAUSE_QUIZ_STEPS: ScreenerQuizStep[] = [
  {
    id: "age",
    question: "What's your age range?",
    options: [
      { id: "under-35", label: "Under 35", icon: "🌱" },
      { id: "35-39", label: "35 – 39", icon: "🌿" },
      { id: "40-44", label: "40 – 44", icon: "🌳" },
      { id: "45-49", label: "45 – 49", icon: "🍂" },
      { id: "50-plus", label: "50+", icon: "🌺" },
    ],
  },
  {
    id: "cycle",
    question: "How would you describe your cycles lately?",
    options: [
      { id: "regular", label: "Mostly regular", icon: "📅" },
      { id: "irregular", label: "Irregular, shorter, or heavier", icon: "〰️" },
      { id: "stopped", label: "No period for 12+ months", icon: "⏸️" },
      { id: "surgical", label: "Surgical menopause / hysterectomy", icon: "🏥" },
    ],
  },
  {
    id: "symptomLoad",
    question: "How many of these bother you regularly?",
    subtitle: "Hot flashes · sleep · mood · anxiety · libido · weight · brain fog · fatigue",
    options: [
      { id: "none-few", label: "None or just 1", icon: "○" },
      { id: "several", label: "2 – 4 symptoms", icon: "◐" },
      { id: "many", label: "5 or more", icon: "●" },
    ],
  },
  {
    id: "topConcern",
    question: "What's your biggest concern right now?",
    options: [
      { id: "hot-flashes", label: "Hot flashes & night sweats", icon: "🔥" },
      { id: "sleep", label: "Sleep & night waking", icon: "😴" },
      { id: "mood", label: "Mood, anxiety & irritability", icon: "🎭" },
      { id: "libido", label: "Libido & vaginal comfort", icon: "💫" },
      { id: "energy", label: "Energy, weight & brain fog", icon: "⚡" },
    ],
  },
  {
    id: "priorHrt",
    question: "Have you tried hormone therapy before?",
    options: [
      { id: "never", label: "No, never", icon: "🆕" },
      { id: "stopped", label: "Yes — stopped (side effects or didn't help)", icon: "↩️" },
      { id: "current", label: "Yes — currently on HRT elsewhere", icon: "💊" },
    ],
  },
  {
    id: "breastHistory",
    question: "Personal history of estrogen-sensitive breast cancer?",
    options: [
      { id: "no", label: "No", icon: "✓" },
      { id: "not-sure", label: "Not sure / need to discuss", icon: "?" },
      { id: "yes", label: "Yes", icon: "!" },
    ],
  },
  {
    id: "interest",
    question: "Interested in BioTE pellet therapy at Hello Gorgeous?",
    subtitle: "Custom-compounded pellets · typically every 3–5 months",
    options: [
      { id: "yes", label: "Yes — tell me more", icon: "👍" },
      { id: "learn", label: "Open to options — not sure yet", icon: "💬" },
      { id: "labs-first", label: "I want labs & NP review first", icon: "🩺" },
    ],
  },
];

export function scorePerimenopauseReadiness(answers: ScreenerAnswers): ScreenerQuizResult {
  if (answers.breastHistory === "yes") {
    return {
      tier: "not_eligible",
      title: "Individualized NP review required",
      body: "Hormone therapy after estrogen-sensitive breast cancer requires specialized review. Ryan Kent, FNP-BC can discuss your history, current guidelines, and whether any hormone options are appropriate — or alternative symptom support.",
      ctaLabel: "Book hormone consult",
      ctaHref: "/book",
      secondaryHref: "/biote-hormone-therapy-oswego",
      secondaryLabel: "BioTE program overview →",
    };
  }

  const needsReview =
    answers.breastHistory === "not-sure" ||
    answers.symptomLoad === "none-few" ||
    (answers.age === "under-35" && answers.cycle === "regular");

  if (needsReview) {
    return {
      tier: "review",
      title: "Consult + labs make sense",
      body:
        answers.symptomLoad === "none-few"
          ? "Even subtle cycle changes can reflect shifting hormones in your 30s and 40s. A baseline panel (~$200–400) plus symptom review helps decide if BioTE pellets, creams, or non-hormonal support fits."
          : "Your answers suggest hormone evaluation could help — Ryan will review cycle history, symptoms, and safety factors before recommending BioTE or other BHRT.",
      ctaLabel: "Book free hormone consult",
      ctaHref: "/book",
      secondaryHref: "/services/biote-hormone-therapy",
      secondaryLabel: "Harmony AI™ + BioTE info →",
    };
  }

  return {
    tier: "strong",
    title: "You may benefit from a hormone evaluation",
    body: "Based on your age, cycle pattern, and symptoms, our BioTE-certified women's hormone program may be a fit. Women's pellet insertion typically runs $400–650 with baseline labs — transparent pricing at your free consult.",
    ctaLabel: "Book free hormone consult",
    ctaHref: "/book",
    secondaryHref: "/biote-hormone-therapy-oswego",
    secondaryLabel: "Women's BioTE menu →",
  };
}
