import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { CONVERSION_HIERARCHY } from "@/lib/illinois-excellence";
import { STOREFRONT_TRUST_SIGN } from "@/lib/medical-trust";

type Props = {
  className?: string;
};

/** Homepage / marketing band — matches the door plaque (MD oversight + FNP-BC + come in). */
export function MdOversightWelcomeBand({ className = "" }: Props) {
  const sign = STOREFRONT_TRUST_SIGN;

  return (
    <section
      className={`border-b-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#1a0a14] to-[#2d1020] ${className}`}
      aria-labelledby="md-oversight-welcome-heading"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-10 text-center sm:py-12 md:px-6 md:py-14">
        <FadeUp>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
            Hello Gorgeous Med Spa · Oswego
          </p>
          <h2 id="md-oversight-welcome-heading" className="sr-only">
            {sign.line1}. {sign.line2}. {sign.line3}
          </h2>
          <div className="mx-auto mt-6 w-full max-w-xl">
            <div className="overflow-hidden rounded-2xl border-2 border-white/20 bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <Image
                src={sign.image}
                alt={sign.alt}
                width={1200}
                height={480}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
            Real medical oversight. A board-certified nurse practitioner on site. And a front door
            that actually means it — come say hi.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <CTA href={CONVERSION_HIERARCHY.primary.href} variant="gradient">
              {CONVERSION_HIERARCHY.primary.label}
            </CTA>
            <Link
              href="/providers"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FFB8DC]"
            >
              Meet the team →
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
