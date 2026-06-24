/** Men's hair restoration readiness screener — AnteAGE MDX, Rx & PRF. */

import type { ScreenerAnswers, ScreenerQuizResult, ScreenerQuizStep } from "@/lib/quiz-screener";

export const HAIR_READINESS_DISCLAIMER =
  "Educational screener only — not a diagnosis of hair loss. Ryan Kent, FNP-BC reviews pattern, scalp health, meds, and TRT/DHT interactions before any AnteAGE MDX, Rx, or PRF protocol.";

export const HAIR_QUIZ_STEPS: ScreenerQuizStep[] = [
  {
    id: "sex",
    question: "Who is this screener for?",
    options: [
      { id: "man", label: "Man — thinning, shedding, or receding", icon: "👨" },
      { id: "woman", label: "Woman — diffuse thinning or shedding", icon: "👩" },
      { id: "other", label: "Prefer not to say / exploring for someone else", icon: "💬" },
    ],
  },
  {
    id: "age",
    question: "What's your age range?",
    options: [
      { id: "under-25", label: "Under 25", icon: "🌱" },
      { id: "25-34", label: "25 – 34", icon: "🌿" },
      { id: "35-44", label: "35 – 44", icon: "🌳" },
      { id: "45-54", label: "45 – 54", icon: "🍂" },
      { id: "55-plus", label: "55+", icon: "🌺" },
    ],
  },
  {
    id: "pattern",
    question: "Where do you notice loss or thinning most?",
    options: [
      { id: "hairline", label: "Receding hairline / temples", icon: "↗️" },
      { id: "crown", label: "Crown / vertex", icon: "⭕" },
      { id: "diffuse", label: "Overall thinning / shedding", icon: "〰️" },
      { id: "patchy", label: "Patchy bald spots", icon: "◻️" },
    ],
  },
  {
    id: "duration",
    question: "How long have you noticed changes?",
    options: [
      { id: "under-6mo", label: "Less than 6 months", icon: "🆕" },
      { id: "6-24mo", label: "6 – 24 months", icon: "📅" },
      { id: "2-plus-yr", label: "2+ years", icon: "📆" },
      { id: "years-stable", label: "Years — mostly stable now", icon: "⏸️" },
    ],
  },
  {
    id: "symptomLoad",
    question: "How much is it affecting you?",
    subtitle: "Shower shedding · visible scalp · styling cover-ups · confidence",
    options: [
      { id: "mild", label: "Mild — early or occasional", icon: "○" },
      { id: "moderate", label: "Moderate — noticeable most days", icon: "◐" },
      { id: "significant", label: "Significant — daily concern", icon: "●" },
    ],
  },
  {
    id: "currentTherapy",
    question: "Current hair treatments?",
    options: [
      { id: "none", label: "None yet", icon: "🆕" },
      { id: "otc", label: "OTC minoxidil / supplements only", icon: "🧴" },
      { id: "rx", label: "Rx finasteride, dutasteride, or compounded topicals", icon: "💊" },
      { id: "procedures", label: "In-office PRP/PRF or exosomes elsewhere", icon: "💉" },
    ],
  },
  {
    id: "trtStatus",
    question: "Testosterone / TRT status?",
    subtitle: "DHT matters for many hair plans — we map hormones + scalp together",
    options: [
      { id: "no", label: "Not on TRT", icon: "✓" },
      { id: "considering", label: "Considering or starting TRT soon", icon: "↗️" },
      { id: "on-trt", label: "Currently on TRT", icon: "💉" },
    ],
  },
  {
    id: "interest",
    question: "What sounds most interesting right now?",
    options: [
      { id: "anteage", label: "AnteAGE MDX biosomes / exosomes", icon: "🧬" },
      { id: "rx", label: "Rx DHT blockers + peptide topicals", icon: "💊" },
      { id: "prf", label: "PRF scalp series", icon: "🩸" },
      { id: "stack", label: "Full stack — regenerative + Rx when appropriate", icon: "🔗" },
      { id: "unsure", label: "Not sure — help me decide at consult", icon: "💬" },
    ],
  },
];

export function scoreHairReadiness(answers: ScreenerAnswers): ScreenerQuizResult {
  if (answers.pattern === "patchy") {
    return {
      tier: "not_eligible",
      title: "Patchy loss needs scalp evaluation first",
      body: "Sudden or patchy bald spots can signal alopecia areata, scarring alopecia, or other conditions that need an in-person scalp exam before AnteAGE, Rx, or PRF. Ryan Kent, FNP-BC can assess pattern, rule out red flags, and map the right next step.",
      ctaLabel: "Book scalp consult",
      ctaHref: "/book",
      secondaryHref: "/gentlemens-club#hair",
      secondaryLabel: "Men's hair menu →",
    };
  }

  const needsReview =
    answers.symptomLoad === "mild" ||
    answers.duration === "under-6mo" ||
    (answers.age === "under-25" && answers.symptomLoad !== "significant");

  if (needsReview) {
    const body =
      answers.symptomLoad === "mild"
        ? "Early thinning is the best time to baseline your plan — but results still take months. A consult helps decide whether AnteAGE MDX from $499/session, Rx topicals, or watchful waiting makes sense."
        : answers.duration === "under-6mo"
          ? "Recent shedding can reflect stress, illness, meds, or early androgenetic change. We review timeline, labs when needed, and whether regenerative or Rx support fits before you invest in a series."
          : "Your answers suggest a consult is worthwhile — we'll review pattern, family history, and whether AnteAGE MDX, finasteride/dutasteride, or PRF belongs in your stack.";

    return {
      tier: "review",
      title: "Consult + pattern review recommended",
      body,
      ctaLabel: "Book hair consult",
      ctaHref: "/book",
      secondaryHref: "/services/hair-restoration-exosomes",
      secondaryLabel: "AnteAGE MDX menu →",
    };
  }

  const anteageLead =
    answers.interest === "anteage" || answers.interest === "stack" || answers.interest === "prf";

  return {
    tier: "strong",
    title: anteageLead
      ? "You may be a strong AnteAGE MDX evaluation candidate"
      : "You may be a strong hair restoration evaluation candidate",
    body: anteageLead
      ? "Based on your pattern and goals, AnteAGE MDX hair biosomes or exosomes from $499/session — often stacked with Rx DHT support or PRF when appropriate — is worth exploring. Ryan maps TRT/DHT interactions and a realistic timeline at consult."
      : "Based on your thinning pattern and treatment history, a Gentlemen's Club hair consult makes sense — Rx DHT blockers, GHK-Cu topicals, AnteAGE MDX from $499/session, and PRF from $600/session can be combined when clinically appropriate.",
    ctaLabel: "Book hair consult",
    ctaHref: "/book",
    secondaryHref: "/gentlemens-club#hair",
    secondaryLabel: "Full men's hair menu →",
  };
}
