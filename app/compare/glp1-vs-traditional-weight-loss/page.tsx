import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PATH = "/compare/glp1-vs-traditional-weight-loss";
const URL = `${SITE.url}${PATH}`;

const FAQS = [
  {
    question: "Does GLP-1 replace nutrition and exercise?",
    answer:
      "No. GLP-1 therapy is a medical tool that works best when paired with protein-focused nutrition, activity, sleep, and consistent follow-up.",
  },
  {
    question: "Who is a better fit for traditional programs alone?",
    answer:
      "Patients with lower metabolic complexity or those who are not medication candidates may still do well with structured lifestyle-only coaching.",
  },
  {
    question: "How do timelines compare?",
    answer:
      "Both require consistency over months. GLP-1 programs may provide stronger appetite and adherence support for eligible patients, but still require behavior and routine changes.",
  },
  {
    question: "How should patients evaluate cost vs value?",
    answer:
      "Value includes safety oversight, sustainability, and total outcome quality, not just monthly medication cost.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "GLP-1 vs Traditional Weight Loss Programs | Hello Gorgeous Med Spa",
  description:
    "Compare GLP-1 medical weight loss vs traditional programs by candidacy, timeline, recovery demands, and long-term value.",
  path: PATH,
});

export default function Glp1ComparePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Compare Treatments", url: `${SITE.url}/compare` },
    { name: "GLP-1 vs Traditional Weight Loss", url: URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS, URL)) }} />
      <main className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-4xl font-black text-black">GLP-1 Weight Loss vs Traditional Programs</h1>
          <p className="mt-4 text-black/80">
            This comparison helps patients understand when medication-assisted care may add value and when lifestyle-only plans may still be enough.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Who each option is best for</h2>
              <p className="mt-2 text-black/80">Traditional programs can work for many patients. GLP-1 is often considered when appetite regulation and adherence barriers are major factors.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Effort and recovery demands</h2>
              <p className="mt-2 text-black/80">Neither route is passive. Both require consistency, follow-up, and behavior change over time.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Results timeline</h2>
              <p className="mt-2 text-black/80">Meaningful changes are measured in months. We focus on sustainability and body-composition quality, not crash-weight targets.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Clinical notes from Hello Gorgeous</h2>
              <p className="mt-2 text-black/80">Our team evaluates candidacy, response, and side-effect tolerance before every major adjustment. Safety and long-term adherence lead strategy.</p>
            </article>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/services/weight-loss" className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">Explore Weight Loss Program</Link>
            <Link href="/book?service=weight-loss-therapy" className="rounded-lg border-2 border-black px-6 py-3 font-semibold text-black">Book consultation</Link>
          </div>
        </div>
      </main>
    </>
  );
}
