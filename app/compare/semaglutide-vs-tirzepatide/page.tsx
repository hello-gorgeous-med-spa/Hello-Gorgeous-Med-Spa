import type { Metadata } from "next";
import Link from "next/link";
import { SEMA_VS_TIRZ_FAQS, SEMA_VS_TIRZ_ROWS } from "@/lib/glp1-sema-vs-tirz-compare";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  pageMetadata,
  SITE,
  siteJsonLd,
} from "@/lib/seo";

const PATH = "/compare/semaglutide-vs-tirzepatide";
const URL = `${SITE.url}${PATH}`;

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Semaglutide vs Tirzepatide Oswego IL | GLP-1 Comparison | Hello Gorgeous",
    description:
      "Compare semaglutide vs tirzepatide for medical weight loss in Oswego, IL — mechanism, side effects, candidacy, and Hello Gorgeous pricing. NP-supervised GLP-1 care for Fox Valley patients.",
    path: PATH,
  }),
  keywords: [
    "semaglutide vs tirzepatide",
    "semaglutide vs tirzepatide Oswego",
    "Ozempic vs Mounjaro Oswego",
    "Wegovy vs Zepbound Illinois",
    "GLP-1 comparison Oswego IL",
    "best GLP-1 for weight loss Oswego",
  ],
};

export default function SemaglutideVsTirzepatidePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Compare Treatments", url: `${SITE.url}/compare` },
    { name: "Semaglutide vs Tirzepatide", url: URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd([...SEMA_VS_TIRZ_FAQS], URL)) }}
      />
      <main className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
            Medical weight loss · Oswego, IL
          </p>
          <h1 className="mt-2 text-4xl font-black text-black md:text-5xl">
            Semaglutide vs Tirzepatide
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-black/80">
            A clear, clinic-side comparison for Fox Valley patients deciding between two
            leading GLP-1 options — without hype, and without naming other clinics.
            Hello Gorgeous Med Spa provides NP-directed care in Oswego.
          </p>

          <div className="mt-10 overflow-x-auto rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-white">
                <tr>
                  <th className="px-4 py-3 font-bold">Topic</th>
                  <th className="px-4 py-3 font-bold">Semaglutide</th>
                  <th className="px-4 py-3 font-bold">Tirzepatide</th>
                </tr>
              </thead>
              <tbody>
                {SEMA_VS_TIRZ_ROWS.map((row) => (
                  <tr key={row.label} className="border-t-2 border-black/10 odd:bg-rose-50/40">
                    <th className="px-4 py-3 align-top font-bold text-[#E6007E]">{row.label}</th>
                    <td className="px-4 py-3 align-top text-black/85">{row.semaglutide}</td>
                    <td className="px-4 py-3 align-top text-black/85">{row.tirzepatide}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="mt-12 space-y-6">
            <h2 className="text-2xl font-black text-black">Frequently asked questions</h2>
            {SEMA_VS_TIRZ_FAQS.map((faq) => (
              <article key={faq.question} className="rounded-2xl border-2 border-black bg-white p-5">
                <h3 className="font-bold text-[#E6007E]">▸ {faq.question}</h3>
                <p className="mt-2 text-black/85">{faq.answer}</p>
              </article>
            ))}
          </section>

          <p className="mt-8 text-sm text-black/60">
            Educational only — not a diagnosis or outcome guarantee. Brand names are
            trademarks of their owners and are referenced for patient familiarity.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/glp1-weight-loss"
              className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white"
            >
              Explore GLP-1 program
            </Link>
            <Link
              href={PRIMARY_BOOKING_CTA.href}
              className="rounded-lg border-2 border-black px-6 py-3 font-semibold text-black"
            >
              {PRIMARY_BOOKING_CTA.label}
            </Link>
            <Link
              href="/glp1-intake"
              className="rounded-lg border-2 border-[#E6007E] px-6 py-3 font-semibold text-[#E6007E]"
            >
              Start GLP-1 intake
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
