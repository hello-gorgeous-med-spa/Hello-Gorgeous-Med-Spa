import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  REGEN_BROCHURE_PRINT_PATH,
  REGEN_BROCHURE_THUMBNAIL,
} from "@/lib/regen-brochure";
import { REGEN_BRAND, REGEN_LAUNCH_PRICING } from "@/lib/regen-brand";

export function RegenBrochureSharePage() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(230,0,126,0.12), transparent), linear-gradient(180deg, #FFF0F7 0%, #fff 45%, #f9fafb 100%)",
        }}
      />

      <Section className="border-b-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#2d1020] to-black py-14 md:py-20">
        <FadeUp className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">
            {REGEN_BRAND.fullName}
          </p>
          <h1 className="font-black text-3xl text-white md:text-5xl">
            Your{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              RE GEN brochure
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/80 md:text-lg">
            Weight loss, peptides, hormones &amp; wellness — NP-directed care from Hello Gorgeous
            Med Spa. View online or print double-sided for your visit.
          </p>
        </FadeUp>
      </Section>

      <Section className="py-12 md:py-16">
        <FadeUp className="mx-auto max-w-lg px-4">
          <Link
            href={REGEN_BROCHURE_PRINT_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <div className="relative aspect-[3/4] w-full bg-black">
              <Image
                src={REGEN_BROCHURE_THUMBNAIL}
                alt="RE GEN brochure preview — medical weight loss, peptides and hormones"
                fill
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 480px"
                priority
              />
            </div>
            <div className="border-t-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-4 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-white">
                Tap to open &amp; print →
              </p>
            </div>
          </Link>

          <ul className="mt-8 space-y-2 text-sm font-medium text-black/80">
            <li>
              <span className="font-bold text-[#E6007E]">✦</span> GLP-1 weight loss{" "}
              {REGEN_LAUNCH_PRICING.glp1}
            </li>
            <li>
              <span className="font-bold text-[#E6007E]">✦</span> Peptides{" "}
              {REGEN_LAUNCH_PRICING.peptides}
            </li>
            <li>
              <span className="font-bold text-[#E6007E]">✦</span> NAD+ {REGEN_LAUNCH_PRICING.nad}
            </li>
            <li>
              <span className="font-bold text-[#E6007E]">✦</span> Hormones{" "}
              {REGEN_LAUNCH_PRICING.hormones}
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CTA href={REGEN_BROCHURE_PRINT_PATH} variant="gradient">
              Open brochure
            </CTA>
            <CTA href="/rx" variant="outline">
              Start intake
            </CTA>
          </div>

          <p className="mt-6 text-center text-xs text-black/50">
            Print tip: 8.5×11 paper, double-sided, flip on long edge.
          </p>
        </FadeUp>
      </Section>
    </>
  );
}
