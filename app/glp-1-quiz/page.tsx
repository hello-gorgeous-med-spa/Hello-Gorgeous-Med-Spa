import type { Metadata } from "next";

import { Glp1QuizPageContent } from "@/components/glp1-quiz/Glp1QuizPageContent";
import { GLP1_QUIZ_PATH } from "@/lib/glp1-quiz";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "GLP-1 quiz | Hello Gorgeous Med Spa",
  description:
    "Three-step GLP-1 screening for Illinois adults. A licensed clinician reviews every request. Not a prescription.",
  path: GLP1_QUIZ_PATH,
});

export default function HgGlp1QuizPage() {
  return <Glp1QuizPageContent brand="hg" />;
}
