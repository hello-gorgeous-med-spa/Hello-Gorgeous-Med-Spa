import Image from "next/image";
import Link from "next/link";

import { SHOP_RX_HERO_IMAGE } from "@/lib/shop-rx-product-images";

export function ShopRxHero() {
  return (
    <section
      className="relative flex min-h-[min(72vh,640px)] items-center justify-center overflow-hidden bg-[#141010]"
      aria-labelledby="shop-rx-hero-heading"
    >
      <Image
        src={SHOP_RX_HERO_IMAGE}
        alt=""
        fill
        priority
        className="object-cover object-center opacity-50 saturate-[0.85]"
        sizes="100vw"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-[#141010]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,0,126,0.15)_0%,transparent_60%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/75">
          Hello Gorgeous RX™
        </p>
        <h2
          id="shop-rx-hero-heading"
          className="mt-5 font-serif text-4xl font-normal leading-[1.1] text-white sm:text-5xl md:text-[3.25rem]"
        >
          We&apos;re simplifying the path to feeling{" "}
          <span className="italic text-[#FFB8DC]">gorgeous</span>.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base font-light leading-relaxed text-white/75 md:text-lg">
          Medical weight loss, peptides, hormones &amp; more — supervised by Ryan Kent, FNP-BC.
          Ship to home across Illinois.
        </p>
        <Link
          href="#find-your-treatment"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-lg transition hover:bg-[#FFF0F7]"
        >
          <span aria-hidden>→</span>
          Find your treatment
        </Link>
      </div>
    </section>
  );
}
