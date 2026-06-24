import type { Metadata } from "next";

import { TrtReadinessQuiz } from "@/components/quiz/TrtReadinessQuiz";
import { QUIZ_HUB_PATH } from "@/lib/quiz-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PATH = "/quiz/trt-readiness";

export const metadata: Metadata = pageMetadata({
  title: "TRT Readiness Screener | Men's Testosterone Quiz | Hello Gorgeous Oswego",
  description:
    "2-minute TRT readiness screener — energy, libido, labs & safety flags for testosterone optimization. NP-supervised men's hormones in Oswego, IL. Educational only.",
  path: PATH,
});

export default function TrtReadinessQuizPage() {
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
              { name: "TRT Readiness", url: `${SITE.url}${PATH}` },
            ]),
          ),
        }}
      />
      <TrtReadinessQuiz />
    </>
  );
}
