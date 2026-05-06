import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PATH = "/compare/quantum-rf-vs-facelift";
const URL = `${SITE.url}${PATH}`;

const FAQS = [
  {
    question: "Is Quantum RF the same as a facelift?",
    answer:
      "No. A facelift is a surgical procedure with incisions and longer recovery. Quantum RF is minimally invasive and suited for selected patients looking for meaningful tightening without full excisional surgery.",
  },
  {
    question: "Who is best for each option?",
    answer:
      "Patients with severe skin excess or advanced structural descent may still be better surgical candidates. Patients with mild-to-moderate laxity often explore Quantum RF first.",
  },
  {
    question: "How do downtime and recovery compare?",
    answer:
      "Facelift recovery is longer and more intensive. Quantum RF recovery is generally shorter, though bruising/swelling can still occur.",
  },
  {
    question: "How should patients think about cost value?",
    answer:
      "Value comes from matching intervention level to your anatomy and goals. We discuss where minimally invasive treatment is realistic and where surgery may be the better long-term decision.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Quantum RF vs Facelift | Hello Gorgeous Med Spa",
  description:
    "Compare Quantum RF and facelift options by candidacy, recovery, timeline, and value framing with clinical guidance from Hello Gorgeous Med Spa.",
  path: PATH,
});

export default function QuantumVsFaceliftPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Compare Treatments", url: `${SITE.url}/compare` },
    { name: "Quantum RF vs Facelift", url: URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS, URL)) }} />
      <main className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-4xl font-black text-black">Quantum RF vs Facelift</h1>
          <p className="mt-4 text-black/80">
            This comparison is about matching the right level of intervention to your anatomy. Quantum RF is minimally invasive; facelift surgery is more comprehensive and more invasive.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Plain-English difference</h2>
              <p className="mt-2 text-black/80">Quantum RF delivers subdermal RF through tiny access points. Facelift repositions tissue surgically with incisions.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Best-fit candidacy</h2>
              <p className="mt-2 text-black/80">Mild-to-moderate laxity often explores Quantum RF. Significant excess skin may still require surgical consultation.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Recovery + timeline</h2>
              <p className="mt-2 text-black/80">Quantum RF usually has shorter downtime; facelift has longer recovery but may deliver stronger correction for advanced cases.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Clinical notes from Hello Gorgeous</h2>
              <p className="mt-2 text-black/80">We do not force non-surgical options when surgery is the better fit. We help you understand tradeoffs honestly before you commit.</p>
            </article>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/services/quantum-rf" className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">Explore Quantum RF</Link>
            <Link href="/book?service=quantum-rf" className="rounded-lg border-2 border-black px-6 py-3 font-semibold text-black">Book consultation</Link>
          </div>
        </div>
      </main>
    </>
  );
}
