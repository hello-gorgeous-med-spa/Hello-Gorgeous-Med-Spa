import type { Metadata } from "next";

import { HairReadinessQuiz } from "@/components/quiz/HairReadinessQuiz";
import { QUIZ_HUB_PATH } from "@/lib/quiz-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PATH = "/quiz/hair-readiness";

export const metadata: Metadata = pageMetadata({
  title: "Hair Restoration Readiness Screener | AnteAGE MDX & Men's Hair Quiz | Hello Gorgeous Oswego",
  description:
    "2-minute hair restoration readiness screener — thinning pattern, TRT/DHT, AnteAGE MDX biosomes from $499, Rx & PRF options. NP-supervised in Oswego, IL. Educational only.",
  path: PATH,
});

export default function HairReadinessQuizPage() {
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
              { name: "Hair Readiness", url: `${SITE.url}${PATH}` },
            ]),
          ),
        }}
      />
      <HairReadinessQuiz />
    </>
  );
}
