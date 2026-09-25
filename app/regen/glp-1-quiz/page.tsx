import type { Metadata } from "next";

import { Glp1QuizPageContent } from "@/components/glp1-quiz/Glp1QuizPageContent";
import { GLP1_QUIZ_PATH } from "@/lib/glp1-quiz";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "GLP-1 quiz | REGEN RX",
    description:
      "Three-step GLP-1 screening for Illinois adults. Ryan reviews every request. Not a prescription.",
    path: `/regen${GLP1_QUIZ_PATH}`,
  }),
};

export default function RegenGlp1QuizPage() {
  return <Glp1QuizPageContent brand="regen" />;
}
