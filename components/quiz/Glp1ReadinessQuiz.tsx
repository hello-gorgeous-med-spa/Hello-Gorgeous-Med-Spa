"use client";

import { ReadinessScreener } from "@/components/quiz/ReadinessScreener";
import {
  GLP1_QUIZ_STEPS,
  GLP1_READINESS_DISCLAIMER,
  scoreGlp1Readiness,
} from "@/lib/glp1-readiness-quiz";

export function Glp1ReadinessQuiz() {
  return (
    <ReadinessScreener
      disclaimer={GLP1_READINESS_DISCLAIMER}
      steps={GLP1_QUIZ_STEPS}
      analyticsSource="glp1-readiness"
      score={scoreGlp1Readiness}
    />
  );
}
