import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  FEATURED_CLINIC_PEPTIDES,
  getPeptideThumbnail,
  PEPTIDE_CONSULT_SPECIAL,
} from "@/lib/peptide-featured";
import { peptideTopicHref } from "@/lib/peptides-hub";

export function FeaturedPeptidesSection() {
  return (
    <Section
      id="featured-peptides"
      className="border-t-4 border-black bg-gradient-to-b from-[#FFF0F7] via-white to-white"
    >
      <FadeUp>
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6007E] text-white border-2 border-black mb-4">
            <span className="text-sm font-bold uppercase tracking-wider">
              {PEPTIDE_CONSULT_SPECIAL.price} consultation special
            </span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-black">
            The peptides our clients{" "}
            <span className="text-[#E6007E]">request most</span>
          </h2>
          <p className="mt-4 text-black/75 max-w-2xl mx-auto text-lg leading-relaxed">
            Prescribed through <strong>Hello Gorgeous RX™</strong> after an NP-led evaluation — not a
            supplement aisle guess. {PEPTIDE_CONSULT_SPECIAL.detail}.
          </p>
        </div>
      </FadeUp>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {FEATURED_CLINIC_PEPTIDES.map((peptide, idx) => {
          const thumbnail = getPeptideThumbnail(peptide.slug);
          return (
            <FadeUp key={peptide.slug} delayMs={idx * 40}>
              <Link
                href={peptideTopicHref(peptide.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.3)] transition hover:border-[#E6007E] hover:shadow-[10px_10px_0_0_rgba(230,0,126,0.4)]"
              >
                {thumbnail ? (
                  <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-black">
                    <Image
                      src={thumbnail.src}
                      alt={thumbnail.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span
                      className="absolute top-3 right-3 rounded-full border-2 border-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                      style={{ background: peptide.accent }}
                    >
                      Learn more
                    </span>
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-black text-black group-hover:text-[#E6007E]">
                    {peptide.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-black/75">{peptide.benefit}</p>
                  <p className="mt-4 text-sm font-bold text-[#E6007E]">What it does & how we use it →</p>
                </div>
              </Link>
            </FadeUp>
          );
        })}
      </div>

      <FadeUp delayMs={280}>
        <div className="mt-12 max-w-3xl mx-auto rounded-3xl border-4 border-black bg-gradient-to-r from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] p-8 text-center text-white shadow-[8px_8px_0_0_rgba(0,0,0,0.2)]">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFB8DC]">
            Limited-time offer
          </p>
          <p className="mt-2 text-4xl md:text-5xl font-black">{PEPTIDE_CONSULT_SPECIAL.price}</p>
          <p className="text-lg font-semibold">Peptide consultation · Oswego, IL</p>
          <p className="mt-3 text-sm text-white/85">{PEPTIDE_CONSULT_SPECIAL.detail}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <CTA
              href={BOOKING_URL}
              variant="outline"
              className="min-h-[48px] border-2 border-white text-white hover:bg-white hover:text-[#E6007E]"
            >
              Book {PEPTIDE_CONSULT_SPECIAL.price} consult
            </CTA>
            <Link
              href={PEPTIDE_CONSULT_SPECIAL.blogHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/60 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Read full peptide guide
            </Link>
          </div>
        </div>
      </FadeUp>
    </Section>
  );
}
