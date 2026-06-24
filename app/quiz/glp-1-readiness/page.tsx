import type { Metadata } from "next";

import { Glp1ReadinessQuiz } from "@/components/quiz/Glp1ReadinessQuiz";
import { QUIZ_HUB_PATH } from "@/lib/quiz-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PATH = "/quiz/glp-1-readiness";

export const metadata: Metadata = pageMetadata({
  title: "GLP-1 Readiness Screener | Medical Weight Loss Quiz | Hello Gorgeous Oswego",
  description:
    "2-minute GLP-1 readiness screener — see if semaglutide or tirzepatide may fit your goals. NP-supervised programs in Oswego, IL. Educational only; free consult required.",
  path: PATH,
});

export default function Glp1ReadinessQuizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Quizzes", url: `${SITE.url}${QUIZ_HUB_PATH}` },
              { name: "GLP-1 Readiness", url: `${SITE.url}${PATH}` },
            ]),
          ),
        }}
      />
      <Glp1ReadinessQuiz />
    </>
  );
}
