import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PATH = "/compare/solaria-co2-vs-traditional-co2";
const URL = `${SITE.url}${PATH}`;

const FAQS = [
  {
    question: "How is Solaria CO2 different from older traditional CO2 resurfacing?",
    answer:
      "Both are ablative CO2 resurfacing approaches. The practical difference is usually in platform controls, treatment planning, and provider protocol, not a magic 'different laser physics' claim.",
  },
  {
    question: "Is downtime still required with Solaria?",
    answer:
      "Yes. Patients should still plan visible recovery. Recovery details vary by settings, treatment depth, and individual healing response.",
  },
  {
    question: "Who is this best for?",
    answer:
      "Patients with texture, sun damage, acne scarring, and deeper wrinkle concerns who want high-impact resurfacing and accept downtime.",
  },
  {
    question: "Can Solaria be paired with other treatments?",
    answer:
      "Yes, sequencing with injectables or RF treatments may be recommended based on goals and skin status.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Solaria CO2 vs Traditional CO2 Laser | Hello Gorgeous Med Spa",
  description:
    "Understand Solaria CO2 vs traditional CO2 resurfacing: candidacy, downtime, timeline, and treatment strategy at Hello Gorgeous Med Spa.",
  path: PATH,
});

export default function SolariaComparePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Compare Treatments", url: `${SITE.url}/compare` },
    { name: "Solaria CO2 vs Traditional CO2", url: URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS, URL)) }} />
      <main className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-4xl font-black text-black">Solaria CO2 vs Traditional CO2 Laser Resurfacing</h1>
          <p className="mt-4 text-black/80">
            The better question is less "which label is better?" and more "which protocol fits your skin, risk profile, and downtime tolerance?"
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Plain-English explanation</h2>
              <p className="mt-2 text-black/80">Both are CO2 resurfacing approaches. Outcomes depend heavily on settings, provider technique, and post-care compliance.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Downtime and timeline</h2>
              <p className="mt-2 text-black/80">Expect social downtime and staged healing. Early changes appear first; collagen remodeling continues over months.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Cost and value framing</h2>
              <p className="mt-2 text-black/80">The right value is a treatment depth and plan that matches your concern severity without over-treating.</p>
            </article>
            <article className="rounded-2xl border-2 border-black p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Clinical notes from Hello Gorgeous</h2>
              <p className="mt-2 text-black/80">We emphasize candidacy screening, realistic healing expectations, and detailed aftercare to protect results.</p>
            </article>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/services/solaria-co2" className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">Explore Solaria CO2</Link>
            <Link href="/book?service=solaria-co2" className="rounded-lg border-2 border-black px-6 py-3 font-semibold text-black">Book consultation</Link>
          </div>
        </div>
      </main>
    </>
  );
}
