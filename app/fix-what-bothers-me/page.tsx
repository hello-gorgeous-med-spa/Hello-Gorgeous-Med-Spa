import type { Metadata } from "next";
import { FixWhatBothersMeForm } from "./FixWhatBothersMeForm";
import { Section } from "@/components/Section";
import { FadeUp } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { pageMetadata, siteJsonLd, SITE, breadcrumbJsonLd } from "@/lib/seo";
import { getPrefillForConcern } from "@/lib/concerns";
import { BOOKING_URL } from "@/lib/flows";

export const metadata: Metadata = pageMetadata({
  title: "Fix What Bothers Me | Hello Gorgeous Med Spa",
  description:
    "Share what's on your mind—we'll match you with treatments that fit. Weight, skin, lines, energy, and more. Oswego, Naperville & surrounding areas.",
  path: "/fix-what-bothers-me",
});

type PageProps = { searchParams: { concern?: string } };

export default function FixWhatBothersMePage({ searchParams }: PageProps) {
  const concern = searchParams?.concern ?? null;
  const initialMessage = getPrefillForConcern(concern);

  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Fix What Bothers Me", url: `${SITE.url}/fix-what-bothers-me` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <div className="min-h-screen overflow-x-hidden bg-white">
        {/* Hero — black, white text, brand pink (Opus style) */}
        <div className="bg-black py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center px-6 md:px-12">
            <FadeUp>
              <p className="text-[#E6007E] text-sm font-semibold uppercase tracking-wider mb-4">
                Your space. No judgment.
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Fix what bothers me
              </h1>
              <p className="mt-6 text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                Whatever it is—weight, skin, lines, energy, or something you can&apos;t quite name—write it here.
                We&apos;ll read it, match you with options that fit, and reach out. Or you can book directly if we suggest a path.
              </p>
              <div className="mt-8">
                <CTA href={BOOKING_URL} variant="gradient" className="inline-flex">
                  Book directly →
                </CTA>
              </div>
            </FadeUp>
          </div>
        </div>

        <Section className="bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 text-center">
              <p className="text-black text-sm">
                Know what you want?{" "}
                <a href="/book" className="text-[#E6007E] hover:underline font-semibold">
                  Book directly →
                </a>
              </p>
            </div>
            <FixWhatBothersMeForm initialMessage={initialMessage} />
          </div>
        </Section>

        <Section className="bg-white border-t border-black/10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-black text-sm">
              This is private. We use it only to suggest treatments and follow up with you.
            </p>
            <p className="mt-2 text-black text-sm">
              Questions? <a href="/contact" className="text-[#E6007E] hover:underline">Contact us</a> or call (630) 636-6193.
            </p>
          </div>
        </Section>
      </div>
    </>
  );
}
