"use client";

import { ReadinessScreener } from "@/components/quiz/ReadinessScreener";
import {
  PERIMENOPAUSE_QUIZ_STEPS,
  PERIMENOPAUSE_READINESS_DISCLAIMER,
  scorePerimenopauseReadiness,
} from "@/lib/perimenopause-readiness-quiz";

export function PerimenopauseReadinessQuiz() {
  return (
    <ReadinessScreener
      disclaimer={PERIMENOPAUSE_READINESS_DISCLAIMER}
      steps={PERIMENOPAUSE_QUIZ_STEPS}
      analyticsSource="perimenopause-readiness"
      score={scorePerimenopauseReadiness}
    />
  );
}
