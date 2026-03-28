import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE,
  pageMetadata,
  siteJsonLd,
  mainLocalBusinessJsonLd,
  breadcrumbJsonLd,
  webPageJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { FAQAccordion } from "@/components/FAQAccordion";
import { BOOKING_URL } from "@/lib/flows";

const PAGE_DESCRIPTION =
  "Cellulite treatment in Oswego, IL — Morpheus8 Body RF microneedling and Quantum RF for smoother thighs, buttocks & abdomen. Same-day consults when schedule allows. Naperville, Aurora, Plainfield. NP-led med spa. Book consultation.";

export const metadata: Metadata = pageMetadata({
  title: "Cellulite Treatment Oswego IL | Morpheus8 Body & Quantum RF | Hello Gorgeous",
  description: PAGE_DESCRIPTION,
  path: "/cellulite-treatment-oswego-il",
});

const PATH = "/cellulite-treatment-oswego-il";
const PAGE_URL = `${SITE.url}${PATH}`;

const CELLULITE_FAQS = [
  {
    question: "What is the best treatment for cellulite at Hello Gorgeous?",
    answer:
      "We often combine advanced RF technologies such as Morpheus8 Body (RF microneedling) and Quantum RF skin tightening, customized to your skin, depth, and area. Your plan is set after an in-person consultation.",
  },
  {
    question: "Which body areas can you treat for cellulite?",
    answer:
      "Common areas include thighs, buttocks, hips, and abdomen. We map depth and energy settings to your tissue and goals.",
  },
  {
    question: "How many sessions are typical?",
    answer:
      "Many patients benefit from a series of treatments spaced several weeks apart. Exact count depends on severity, area size, and combination therapies.",
  },
  {
    question: "Is cellulite treatment available near Naperville and Aurora?",
    answer:
      "Yes. Our clinic is in Oswego, IL, convenient to Naperville, Aurora, Plainfield, Yorkville, and the Fox Valley.",
  },
];

export default function CelluliteTreatmentOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Cellulite Treatment", url: PAGE_URL },
  ];

  const therapyJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    "@id": `${PAGE_URL}#therapy`,
    name: "Cellulite Treatment — RF Body Contouring in Oswego, IL",
    description:
      "Non-surgical cellulite improvement using Morpheus8 Body RF microneedling and Quantum RF tightening at Hello Gorgeous Med Spa.",
    alternateName: ["Cellulite treatment Naperville IL", "Cellulite treatment Aurora IL", "RF cellulite Oswego"],
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: "Cellulite Treatment Oswego IL | Hello Gorgeous Med Spa",
              description: PAGE_DESCRIPTION,
              path: PATH,
              image: "/images/home/morpheus8-body-burst-technology-inmode.png",
              dateModified: new Date().toISOString().split("T")[0],
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(CELLULITE_FAQS, PAGE_URL)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(therapyJsonLd) }}
      />

      <main className="bg-white">
        <section className="bg-black text-white py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-3">
              Body · RF technology · Oswego, IL
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Cellulite Treatment in Oswego — Morpheus8 Body &amp; Quantum RF
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
              Improve the look of dimpled skin on thighs, buttocks, and abdomen with medical-grade RF
              protocols — personalized by our team for the western suburbs of Chicago.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href={BOOKING_URL}
                className="inline-flex justify-center rounded-lg bg-[#E6007E] px-8 py-3.5 font-semibold text-white hover:bg-[#c9006e] transition"
              >
                Book body consultation
              </a>
              <Link
                href="/services/morpheus8"
                className="inline-flex justify-center rounded-lg border-2 border-white px-8 py-3.5 font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Morpheus8 details
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 max-w-3xl mx-auto px-4 prose prose-lg text-gray-700">
          <h2 className="text-2xl font-bold text-black">Smoother-looking skin, medically guided</h2>
          <p>
            Cellulite is influenced by fibrous bands, fat lobules, and skin laxity — so effective treatment
            usually means addressing <strong>texture and tightening</strong>, not creams alone. At Hello
            Gorgeous we use <strong>InMode Morpheus8 Body</strong> (RF microneedling) and{" "}
            <strong>Quantum RF</strong> as part of customized plans for the hips, thighs, buttocks, and
            abdomen.
          </p>
          <p>
            Serving <strong>Oswego</strong>, <strong>Naperville</strong>, <strong>Aurora</strong>,{" "}
            <strong>Plainfield</strong>, <strong>Yorkville</strong>, <strong>Montgomery</strong>, and{" "}
            <strong>Kane &amp; Kendall County</strong>.
          </p>
          <p className="not-prose flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/services/morpheus8" className="font-semibold text-[#E6007E] hover:underline">
              Morpheus8 Burst &amp; Body →
            </Link>
            <Link href="/services/quantum-rf" className="font-semibold text-[#E6007E] hover:underline">
              Quantum RF skin tightening →
            </Link>
            <Link href="/morpheus8-burst-oswego-il" className="font-semibold text-[#E6007E] hover:underline">
              Morpheus8 in Oswego →
            </Link>
          </p>
        </section>

        <section className="py-12 md:py-16 bg-neutral-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-black mb-6">Cellulite treatment FAQ</h2>
            <FAQAccordion items={CELLULITE_FAQS} />
          </div>
        </section>

        <section className="py-12 bg-black text-white text-center px-4">
          <p className="text-white/80 text-sm mb-4">
            {SITE.name} · {SITE.address.addressLocality}, {SITE.address.addressRegion} · {SITE.phone}
          </p>
          <a
            href={BOOKING_URL}
            className="inline-flex rounded-lg bg-[#E6007E] px-8 py-3.5 font-semibold text-white hover:bg-[#c9006e] transition"
          >
            Book cellulite consultation
          </a>
        </section>
      </main>
    </>
  );
}
