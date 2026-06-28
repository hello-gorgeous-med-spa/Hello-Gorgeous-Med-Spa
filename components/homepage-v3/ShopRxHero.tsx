import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/images/rx-care/square/glp1-hero.jpg";

export function ShopRxHero() {
  return (
    <section
      className="relative flex min-h-[min(82vh,760px)] items-center justify-center overflow-hidden"
      aria-labelledby="shop-rx-hero-heading"
    >
      <Image
        src={HERO_IMAGE}
        alt="Hello Gorgeous RX — medical weight loss and wellness programs, ship to home"
        fill
        priority
        className="object-cover object-[center_40%]"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,0,126,0.12)_0%,transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/80">
          Hello Gorgeous RX™
        </p>
        <h2
          id="shop-rx-hero-heading"
          className="mt-5 font-serif text-4xl font-normal leading-[1.08] text-white sm:text-5xl md:text-6xl"
        >
          We&apos;re simplifying the path to feeling{" "}
          <span className="italic text-[#FFB8DC]">gorgeous</span>.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-white/80 md:text-lg">
          Medical weight loss, peptides, hormones &amp; more — supervised by Ryan Kent, FNP-BC.
          Ship to home across Illinois.
        </p>
        <Link
          href="#find-your-treatment"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#2a2a2a]/90 px-8 py-3.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-black"
        >
          <span aria-hidden>→</span>
          Find your treatment
        </Link>
      </div>
    </section>
  );
}
