"use client";

import { ReadinessScreener } from "@/components/quiz/ReadinessScreener";
import {
  TRT_QUIZ_STEPS,
  TRT_READINESS_DISCLAIMER,
  scoreTrtReadiness,
} from "@/lib/trt-readiness-quiz";

export function TrtReadinessQuiz() {
  return (
    <ReadinessScreener
      disclaimer={TRT_READINESS_DISCLAIMER}
      steps={TRT_QUIZ_STEPS}
      analyticsSource="trt-readiness"
      score={scoreTrtReadiness}
    />
  );
}
