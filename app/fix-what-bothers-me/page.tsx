import type { Metadata } from "next";
import { FixWhatBothersMeForm } from "./FixWhatBothersMeForm";
import { Section } from "@/components/Section";
import { pageMetadata } from "@/lib/seo";
import { getPrefillForConcern } from "@/lib/concerns";

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

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-950/20 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 py-12 md:py-16">
          <p className="text-pink-400 text-sm font-semibold uppercase tracking-wider mb-4">
            Your space. No judgment.
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            Fix what bothers me
          </h1>
          <p className="mt-6 text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Whatever it is—weight, skin, lines, energy, or something you can't quite name—write it here.
            We'll read it, match you with options that fit, and reach out. Or you can book directly if we suggest a path.
          </p>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <p className="text-gray-400 text-sm">
              Know what you want?{" "}
              <a href="/book" className="text-hg-pink hover:text-hg-pinkDeep font-semibold underline underline-offset-2">
                Book directly →
              </a>
            </p>
          </div>
          <FixWhatBothersMeForm initialMessage={initialMessage} />
        </div>
      </Section>

      <Section className="relative border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            This is private. We use it only to suggest treatments and follow up with you.
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            Questions? <a href="/contact" className="text-pink-400 hover:text-pink-300">Contact us</a> or call (630) 636-6193.
          </p>
        </div>
      </Section>
    </div>
  );
}
