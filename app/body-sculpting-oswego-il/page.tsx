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
  "Non-surgical body sculpting in Oswego, IL — RF body contouring with Morpheus8 Body and Quantum RF to tighten, tone & smooth the abdomen, thighs, arms & more. NP-led med spa serving Naperville, Aurora, Montgomery, Plainfield & Yorkville. Book a body consultation.";

export const metadata: Metadata = pageMetadata({
  title: "Body Sculpting Oswego IL | Non-Surgical Body Contouring | Hello Gorgeous",
  description: PAGE_DESCRIPTION,
  path: "/body-sculpting-oswego-il",
});

const PATH = "/body-sculpting-oswego-il";
const PAGE_URL = `${SITE.url}${PATH}`;

const BODY_SCULPTING_FAQS = [
  {
    question: "What is non-surgical body sculpting at Hello Gorgeous?",
    answer:
      "Body sculpting (body contouring) is a non-surgical way to tighten skin and refine the shape of areas like the abdomen, flanks, thighs, and arms. At Hello Gorgeous we use medical-grade radiofrequency technologies — Morpheus8 Body (RF microneedling) and Quantum RF — customized to your body after an in-person consultation.",
  },
  {
    question: "Which areas can you sculpt and contour?",
    answer:
      "Common areas include the abdomen, flanks (love handles), thighs, buttocks, upper arms, and the area under the chin. Your provider maps depth and energy settings to your tissue and goals.",
  },
  {
    question: "Is body sculpting surgery? Is there downtime?",
    answer:
      "No — these are non-surgical, minimally invasive RF treatments. Most clients return to normal activity quickly, with some temporary redness or swelling. Your exact experience depends on the treatment and area.",
  },
  {
    question: "How many sessions will I need and when will I see results?",
    answer:
      "Many clients do a short series spaced several weeks apart, with results that continue to improve as collagen rebuilds over the following weeks and months. Your plan is set during consultation.",
  },
  {
    question: "Do you offer body sculpting near Naperville and Aurora?",
    answer:
      "Yes. Our clinic is in Oswego, IL, convenient to Naperville, Aurora, Montgomery, Plainfield, Yorkville, and the wider Fox Valley.",
  },
];

export default function BodySculptingOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Body Sculpting", url: PAGE_URL },
  ];

  const therapyJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    "@id": `${PAGE_URL}#therapy`,
    name: "Non-Surgical Body Sculpting — RF Body Contouring in Oswego, IL",
    description:
      "Non-surgical body sculpting and contouring using Morpheus8 Body RF microneedling and Quantum RF skin tightening at Hello Gorgeous Med Spa.",
    alternateName: [
      "Body contouring Oswego IL",
      "Body sculpting Naperville IL",
      "Body sculpting Aurora IL",
      "Non-surgical body sculpting near me",
    ],
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
              title: "Body Sculpting Oswego IL | Hello Gorgeous Med Spa",
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
          __html: JSON.stringify(faqJsonLd(BODY_SCULPTING_FAQS, PAGE_URL)),
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
              Body · RF contouring · Oswego, IL
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Non-Surgical Body Sculpting in Oswego
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
              Tighten, tone, and refine your shape without surgery. Our NP-led team uses medical-grade
              RF technology — Morpheus8 Body and Quantum RF — to contour the abdomen, thighs, arms, and
              more, personalized for the western suburbs of Chicago.
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
                Morpheus8 Body details
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 max-w-3xl mx-auto px-4 prose prose-lg text-gray-700">
          <h2 className="text-2xl font-bold text-black">Medically guided body contouring</h2>
          <p>
            True body sculpting addresses both <strong>skin laxity</strong> and{" "}
            <strong>tissue tightening</strong> — which is why a medical, RF-based approach outperforms
            creams and gimmicks. At Hello Gorgeous we use <strong>InMode Morpheus8 Body</strong> (RF
            microneedling) and <strong>Quantum RF</strong> within customized plans for the abdomen,
            flanks, thighs, buttocks, and upper arms.
          </p>
          <p>
            As an <strong>NP-led medical spa</strong> with hundreds of five-star client experiences,
            your treatment is mapped to your body and goals — not a one-size template. Every plan starts
            with an in-person consultation.
          </p>
          <p>
            Serving <strong>Oswego</strong>, <strong>Naperville</strong>, <strong>Aurora</strong>,{" "}
            <strong>Montgomery</strong>, <strong>Plainfield</strong>, <strong>Yorkville</strong>, and{" "}
            <strong>Kane &amp; Kendall County</strong>.
          </p>
          <p className="not-prose flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
            <Link href="/services/morpheus8" className="font-semibold text-[#E6007E] hover:underline">
              Morpheus8 Burst &amp; Body →
            </Link>
            <Link href="/services/quantum-rf" className="font-semibold text-[#E6007E] hover:underline">
              Quantum RF skin tightening →
            </Link>
            <Link href="/cellulite-treatment-oswego-il" className="font-semibold text-[#E6007E] hover:underline">
              Cellulite treatment in Oswego →
            </Link>
          </p>
        </section>

        <section className="py-12 md:py-16 bg-neutral-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-black mb-6">Body sculpting FAQ</h2>
            <FAQAccordion items={BODY_SCULPTING_FAQS} />
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
            Book body sculpting consultation
          </a>
        </section>
      </main>
    </>
  );
}
