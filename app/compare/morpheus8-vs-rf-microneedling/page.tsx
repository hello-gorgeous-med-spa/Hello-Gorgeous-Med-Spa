import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PATH = "/compare/morpheus8-vs-rf-microneedling";
const URL = `${SITE.url}${PATH}`;

const FAQS = [
  {
    question: "What is the biggest difference between Morpheus8 and standard RF microneedling?",
    answer:
      "Morpheus8 reaches deeper tissue planes and can address both texture and contour goals. Standard RF microneedling is often more surface-focused and usually used for milder texture concerns.",
  },
  {
    question: "Who is a better candidate for Morpheus8?",
    answer:
      "Patients with laxity, deeper crepe texture, or combined face/body tightening goals are often stronger Morpheus8 candidates after in-person assessment.",
  },
  {
    question: "Is downtime different?",
    answer:
      "Both require recovery, but Morpheus8 can involve more swelling or redness depending on depth and treatment zone.",
  },
  {
    question: "When do results show?",
    answer:
      "Early changes may show in weeks, with peak collagen remodeling typically progressing over 3-6 months.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Morpheus8 vs RF Microneedling | Hello Gorgeous Med Spa",
  description:
    "Compare Morpheus8 vs traditional RF microneedling for downtime, results timeline, candidacy, and value at Hello Gorgeous Med Spa in Oswego, IL.",
  path: PATH,
});

export default function MorpheusComparePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Compare Treatments", url: `${SITE.url}/compare` },
    { name: "Morpheus8 vs RF Microneedling", url: URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS, URL)) }} />
      <main className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-4xl font-black text-black">Morpheus8 vs Traditional RF Microneedling</h1>
          <p className="mt-4 text-black/80">
            Both treatments use radiofrequency and microneedling, but they are not interchangeable. Morpheus8 is typically chosen when you need deeper remodeling and
            stronger skin-tightening potential.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Best fit</h2>
              <p className="mt-2 text-black/80">Traditional RF microneedling is often suitable for mild texture, pores, and early fine-line support.</p>
              <p className="mt-2 text-black/80">Morpheus8 is typically better for laxity, deeper crepey texture, and more visible contour-focused outcomes.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Downtime + timeline</h2>
              <p className="mt-2 text-black/80">Most patients plan a few recovery days. Full collagen remodeling continues for months after treatment.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Cost and value framing</h2>
              <p className="mt-2 text-black/80">Lower-cost treatment is not always better value if it cannot reach your target outcome. We match device depth to your actual goal.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Clinical notes from Hello Gorgeous</h2>
              <p className="mt-2 text-black/80">We often combine Morpheus8 planning with texture-focused care to avoid over- or under-treating. Assessment always comes before device selection.</p>
            </article>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/services/morpheus8" className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">Explore Morpheus8</Link>
            <Link href="/book?service=morpheus8" className="rounded-lg border-2 border-black px-6 py-3 font-semibold text-black">Book consultation</Link>
          </div>
        </div>
      </main>
    </>
  );
}
