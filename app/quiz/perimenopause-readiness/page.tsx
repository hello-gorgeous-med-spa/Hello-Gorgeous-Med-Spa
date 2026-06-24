import type { Metadata } from "next";

import { PerimenopauseReadinessQuiz } from "@/components/quiz/PerimenopauseReadinessQuiz";
import { QUIZ_HUB_PATH } from "@/lib/quiz-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PATH = "/quiz/perimenopause-readiness";

export const metadata: Metadata = pageMetadata({
  title: "Perimenopause Readiness Screener | Women's Hormone Quiz | Hello Gorgeous Oswego",
  description:
    "2-minute perimenopause & menopause screener — hot flashes, sleep, cycles & BioTE candidacy. NP-supervised women's hormones in Oswego, IL. Educational only.",
  path: PATH,
});

export default function PerimenopauseReadinessQuizPage() {
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
              { name: "Perimenopause Readiness", url: `${SITE.url}${PATH}` },
            ]),
          ),
        }}
      />
      <PerimenopauseReadinessQuiz />
    </>
  );
}
