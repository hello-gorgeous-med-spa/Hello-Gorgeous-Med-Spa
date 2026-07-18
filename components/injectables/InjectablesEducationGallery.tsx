"use client";

import Image from "next/image";
import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import {
  educationCardsFor,
  type InjectablesEducationAudience,
} from "@/lib/injectables-education";

type Props = {
  audience?: InjectablesEducationAudience;
  /** Section anchor id */
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
};

export function InjectablesEducationGallery({
  audience = "both",
  id = "learn",
  eyebrow = "Learn & prep",
  title = "Botox & filler education",
  intro = "Real talk before your visit — what to expect, how to bruise less, and what to tell your injector.",
}: Props) {
  const cards = educationCardsFor(audience);

  return (
    <Section id={id} className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
      <FadeUp>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl font-medium text-black/70">{intro}</p>
      </FadeUp>

      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {cards.map((card, i) => {
          const inner = (
            <>
              <div className="relative aspect-square overflow-hidden bg-[#f7f2f0]">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-contain p-1 transition duration-500 group-hover:scale-[1.02] sm:p-1.5"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                />
              </div>
              <div className="border-t-2 border-black bg-white px-3 py-2.5 sm:px-4">
                <p className="text-xs font-bold leading-snug text-[#E6007E] sm:text-sm">▸ {card.title}</p>
                {card.href ? (
                  <p className="mt-0.5 text-[11px] font-semibold text-black/50">Tap to learn more →</p>
                ) : null}
              </div>
            </>
          );

          const className =
            "group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.25)] transition hover:-translate-y-0.5";

          return (
            <FadeUp key={card.id} delayMs={Math.min(i * 35, 180)}>
              {card.href ? (
                <Link href={card.href} className={className}>
                  {inner}
                </Link>
              ) : (
                <article className={className}>{inner}</article>
              )}
            </FadeUp>
          );
        })}
      </div>
    </Section>
  );
}
