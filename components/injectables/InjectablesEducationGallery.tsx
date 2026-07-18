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
    <Section id={id} className="scroll-mt-24 border-b-4 border-black bg-white py-14">
      <FadeUp>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl font-medium text-black/70">{intro}</p>
      </FadeUp>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => {
          const inner = (
            <>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="border-t-4 border-black bg-white px-4 py-3">
                <p className="text-sm font-bold text-[#E6007E]">▸ {card.title}</p>
                {card.href ? (
                  <p className="mt-1 text-xs font-semibold text-black/50">Tap to learn more →</p>
                ) : null}
              </div>
            </>
          );

          const className =
            "group flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.28)] transition hover:-translate-y-0.5";

          return (
            <FadeUp key={card.id} delayMs={Math.min(i * 40, 200)}>
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
