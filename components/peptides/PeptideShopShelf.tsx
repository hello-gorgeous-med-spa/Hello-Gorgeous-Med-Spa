import Image from "next/image";
import Link from "next/link";

import { JourneyPinkBtn } from "@/components/marketing/JourneyPageUi";
import {
  PEPTIDE_SHOP_BEFORE,
  PEPTIDE_SHOP_FAQS,
  PEPTIDE_SHOP_NAV,
  PEPTIDE_SHOP_SECTIONS,
  type PeptideShopCard,
} from "@/lib/peptide-shop-shelf";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

function ShopCard({ card }: { card: PeptideShopCard }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border-2 border-black bg-white p-[22px] transition hover:-translate-y-1 hover:border-[#FF2D8E] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
      <div className="relative mb-3.5 aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-black">
        <Image src={card.image} alt={card.imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      {card.tag ? (
        <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#FF2D8E]">{card.tag}</p>
      ) : null}
      <h3 className="mb-2 flex-1 font-serif text-[17px] font-bold text-black">{card.name}</h3>
      <p className="mb-3.5 text-[12.5px] text-black/60">{card.spec}</p>
      <details className="mb-3">
        <summary className="cursor-pointer list-none text-[11.5px] font-bold text-[#FF2D8E]">Learn More ›</summary>
        <p className="mt-2 text-xs leading-relaxed text-black/70">
          <strong>What to expect:</strong> {card.expect}
        </p>
      </details>
      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="font-serif text-base font-bold text-black">
          {card.pricedAtConsult ? (
            "Priced at consult"
          ) : (
            <>
              From ${card.fromUsd}
              <span className="ml-1 text-xs font-semibold text-black/45">/mo</span>
            </>
          )}
        </span>
        <JourneyPinkBtn href={card.href} className="!px-4 !py-2 !text-[13px]">
          Start intake
        </JourneyPinkBtn>
      </div>
      {card.learnHref ? (
        <Link href={card.learnHref} className="mt-2 text-xs font-bold text-[#FF2D8E] hover:text-black">
          How it works →
        </Link>
      ) : null}
    </article>
  );
}

/** White peptide shop shelf — standalone RE GEN shop mock, on the /rx landing. */
export function PeptideShopShelf() {
  return (
    <section id="shop" className="scroll-mt-24 bg-white text-black">
      <div className="border-b border-black/10 bg-black px-6 py-4">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[13px] text-white">
          {PEPTIDE_SHOP_NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-[#FF2D8E]">
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-black px-6 py-16 text-center">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#FF2D8E]">
          The Peptide Shop
        </p>
        <h2 className="mt-4 font-serif text-[32px] font-bold tracking-tight text-white lg:text-[50px]">
          Compounded vials, <span className="text-[#FF2D8E]">provider-reviewed</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[600px] text-[15.5px] leading-relaxed text-white/70">
          Every order is screened by Ryan Kent, FNP-BC under the medical oversight of Dr. Arora, MD —
          nothing ships without approval.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-10 border-b border-black/10 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#FF2D8E]">A Smarter Approach</p>
          <h3 className="mt-2.5 font-serif text-[30px] font-bold tracking-tight">What Are Peptides?</h3>
          <p className="mt-4 text-[14.5px] leading-relaxed text-black/80">
            Peptides are short chains of amino acids that act as signaling molecules — they tell specific
            cells what to do, whether that&apos;s repairing tissue, releasing growth hormone, or regulating
            appetite. Because they&apos;re recognized by receptors your body already has, they work with
            your biology rather than overriding it.
          </p>
          <p className="mt-3.5 text-[14.5px] leading-relaxed text-black/80">
            Every vial on this page is compounded and reviewed under medical supervision. Your provider
            matches the peptide, dose, and cycle length to your labs and goals — nothing here is a fixed,
            one-size-fits-all protocol.
          </p>
        </div>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#FF2D8E]">Before You Order</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-black/85">
            {PEPTIDE_SHOP_BEFORE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {PEPTIDE_SHOP_SECTIONS.map((section) => (
        <div
          key={section.id}
          id={section.id}
          className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-12 first:pt-8 last:pb-16"
        >
          <h3 className="border-l-4 border-[#FF2D8E] pl-3.5 font-serif text-[22px] font-bold">{section.title}</h3>
          <p className="mt-2.5 max-w-xl pl-3.5 text-[13.5px] leading-relaxed text-black/55">{section.intro}</p>
          <div
            className={`mt-7 grid gap-5 ${
              section.cards.length === 1
                ? "max-w-md sm:grid-cols-2"
                : section.cards.length <= 3
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {section.cards.map((card) => (
              <ShopCard key={card.name} card={card} />
            ))}
          </div>
        </div>
      ))}

      <div className="mx-auto max-w-[800px] px-6 py-16">
        <p className="text-center text-[12px] font-bold uppercase tracking-[0.16em] text-[#FF2D8E]">Questions</p>
        <h3 className="mt-2.5 text-center font-serif text-[30px] font-bold tracking-tight">Peptide Basics</h3>
        <div className="mt-10 flex flex-col gap-3">
          {PEPTIDE_SHOP_FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-[14px] border-2 border-black bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-serif text-lg font-bold marker:content-none group-open:text-[#FF2D8E]">
                {faq.q}
                <span className="text-2xl font-normal text-[#FF2D8E]">+</span>
              </summary>
              <p className="px-6 pb-5 text-[15px] leading-relaxed text-black/70">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="bg-[#FF2D8E] px-6 py-16 text-center">
        <h3 className="font-serif text-[28px] font-bold text-white">Not sure what&apos;s right for you?</h3>
        <p className="mx-auto mt-4 max-w-lg text-[14.5px] text-white/90">
          Start with a consult — your provider matches the right protocol to your labs and goals.
        </p>
        <div className="mt-6">
          <JourneyPinkBtn href={PRIMARY_BOOKING_CTA.href} className="!bg-white hover:!bg-black hover:!text-white">
            {PRIMARY_BOOKING_CTA.label}
          </JourneyPinkBtn>
        </div>
      </div>
    </section>
  );
}
