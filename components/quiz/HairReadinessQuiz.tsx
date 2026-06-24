"use client";

import { ReadinessScreener } from "@/components/quiz/ReadinessScreener";
import {
  HAIR_QUIZ_STEPS,
  HAIR_READINESS_DISCLAIMER,
  scoreHairReadiness,
} from "@/lib/hair-readiness-quiz";

export function HairReadinessQuiz() {
  return (
    <ReadinessScreener
      disclaimer={HAIR_READINESS_DISCLAIMER}
      steps={HAIR_QUIZ_STEPS}
      analyticsSource="hair-readiness"
      score={scoreHairReadiness}
    />
  );
}
