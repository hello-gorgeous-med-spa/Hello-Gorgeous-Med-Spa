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
  "Trigger point injections in Oswego, IL for muscle knots, tension headaches, neck and back pain, and TMJ. Medical providers serving Naperville, Aurora, Plainfield & Kendall County. Book consultation.";

export const metadata: Metadata = pageMetadata({
  title: "Trigger Point Injections Oswego IL | Neck, Back, TMJ Pain Relief | Hello Gorgeous",
  description: PAGE_DESCRIPTION,
  path: "/trigger-point-injections-oswego-il",
});

const PATH = "/trigger-point-injections-oswego-il";
const PAGE_URL = `${SITE.url}${PATH}`;

const TRIGGER_POINT_FAQS = [
  {
    question: "What are trigger point injections?",
    answer:
      "They are targeted injections into tight bands of muscle (knots) to reduce pain, spasm, and referred pain. Your provider selects sites based on your exam and symptoms.",
  },
  {
    question: "What conditions do trigger point injections help?",
    answer:
      "Common uses include chronic neck and shoulder tension, upper and lower back pain, tension headaches, hip and glute pain, and jaw muscle tension related to clenching or TMJ discomfort.",
  },
  {
    question: "How long does an appointment take?",
    answer:
      "Most visits are about 15–30 minutes depending on how many areas are treated. Many patients return to usual activities the same day.",
  },
  {
    question: "Do you serve Naperville and Plainfield for trigger point therapy?",
    answer:
      "Yes. Hello Gorgeous Med Spa is in Oswego with easy access for Naperville, Aurora, Plainfield, Yorkville, Montgomery, and the Fox Valley.",
  },
];

export default function TriggerPointInjectionsOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Trigger Point Injections", url: PAGE_URL },
  ];

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${PAGE_URL}#procedure`,
    name: "Trigger Point Injections in Oswego, IL",
    description:
      "Targeted trigger point injections for muscle knots, chronic tension, and referred pain. Licensed medical providers at Hello Gorgeous Med Spa.",
    procedureType: "PercutaneousProcedure",
    howPerformed:
      "After assessment, medication is delivered into identified trigger points in muscle to reduce spasm and pain.",
    status: "EventScheduled",
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
              title: "Trigger Point Injections Oswego IL | Hello Gorgeous Med Spa",
              description: PAGE_DESCRIPTION,
              path: PATH,
              image: "/images/services/hg-botox-syringes.png",
              dateModified: new Date().toISOString().split("T")[0],
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(TRIGGER_POINT_FAQS, PAGE_URL)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
      />

      <main className="bg-white">
        <section className="bg-black text-white py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-3">
              Pain relief · Oswego, IL
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Trigger Point Injections in Oswego &amp; the Western Suburbs
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
              Fast, targeted relief for muscle knots, tension headaches, and chronic neck and back pain —
              performed by licensed medical providers at Hello Gorgeous Med Spa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href={BOOKING_URL}
                className="inline-flex justify-center rounded-lg bg-[#E6007E] px-8 py-3.5 font-semibold text-white hover:bg-[#c9006e] transition"
              >
                Book consultation
              </a>
              <a
                href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex justify-center rounded-lg border-2 border-white px-8 py-3.5 font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 max-w-3xl mx-auto px-4 prose prose-lg text-gray-700">
          <h2 className="text-2xl font-bold text-black">Why patients choose us for trigger points</h2>
          <p>
            Trigger points are tight, irritable spots in muscle that can cause local pain or refer pain
            elsewhere (including tension headaches). Our team evaluates your pattern of pain and treats
            the areas that match your goals — whether that&apos;s desk-related neck tension, post-workout
            tightness, or chronic upper-back pain.
          </p>
          <p>
            We welcome clients from <strong>Oswego</strong>, <strong>Naperville</strong>,{" "}
            <strong>Aurora</strong>, <strong>Plainfield</strong>, <strong>Yorkville</strong>,{" "}
            <strong>Montgomery</strong>, and <strong>Kendall County</strong>.
          </p>
          <ul className="list-none pl-0 space-y-2 not-prose">
            {["Neck & shoulders", "Upper & lower back", "Hips & glutes", "Jaw / TMJ-related muscle tension", "Headache trigger points"].map((item) => (
              <li key={item} className="flex gap-2 text-black/80">
                <span className="text-[#E6007E]">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="not-prose pt-4">
            <Link href="/pre-post-care/trigger-point" className="font-semibold text-[#E6007E] hover:underline">
              Pre &amp; post care for trigger point injections →
            </Link>
          </p>
        </section>

        <section className="py-12 md:py-16 bg-neutral-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-black mb-6">Trigger point FAQ</h2>
            <FAQAccordion items={TRIGGER_POINT_FAQS} />
          </div>
        </section>

        <section className="py-12 bg-black text-white text-center px-4">
          <p className="text-white/80 text-sm mb-4">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
            {SITE.address.postalCode}
          </p>
          <a
            href={BOOKING_URL}
            className="inline-flex rounded-lg bg-[#E6007E] px-8 py-3.5 font-semibold text-white hover:bg-[#c9006e] transition"
          >
            Schedule trigger point consultation
          </a>
        </section>
      </main>
    </>
  );
}
