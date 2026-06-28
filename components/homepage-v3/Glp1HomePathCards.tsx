import Image from "next/image";
import Link from "next/link";

import { FadeUp } from "@/components/Section";
import { GLP1_INTAKE_PATH, GLP1_REFILL_PATH } from "@/lib/flows";
import { shopRxImageObjectClass } from "@/lib/shop-rx-product-images";

const GLP1_PATH_CARDS = [
  {
    id: "intake",
    label: "GLP-1 intake",
    tagline: "Start your weight loss journey the right way",
    href: GLP1_INTAKE_PATH,
    cta: "Book your consultation",
    image: "/images/shop-rx/glp1-intake-flyer.png",
    imageAlt: "GLP-1 intake — Hello Gorgeous RX medical weight loss screening",
  },
  {
    id: "refill",
    label: "GLP-1 refill",
    tagline: "Stay on track · ship to your door",
    href: GLP1_REFILL_PATH,
    cta: "Get your refill",
    image: "/images/shop-rx/glp1-refill-flyer.png",
    imageAlt: "GLP-1 refill — Hello Gorgeous RX home delivery",
  },
] as const;

export function Glp1HomePathCards() {
  return (
    <section
      id="glp1-paths"
      className="scroll-mt-24 border-b border-black/10 bg-[#FAF7F4] px-4 py-10 sm:py-12"
      aria-labelledby="glp1-paths-heading"
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#E6007E]">
            Hello Gorgeous RX™ · Weight loss
          </p>
          <h2
            id="glp1-paths-heading"
            className="mt-3 font-serif text-3xl font-normal text-black sm:text-4xl"
          >
            New patient or refill?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-black/55">
            Pick the path that fits — online screening for new GLP-1 patients, or a quick refill for
            existing Hello Gorgeous RX members.
          </p>
        </FadeUp>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {GLP1_PATH_CARDS.map((card, index) => {
            const imageClass = shopRxImageObjectClass(card.image, "featured");
            return (
              <FadeUp key={card.id} delayMs={80 + index * 60}>
                <Link
                  href={card.href}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:border-[#E6007E]/25 hover:shadow-[0_16px_48px_rgba(230,0,126,0.12)]"
                >
                  <div className="relative aspect-[2/3] max-h-[420px] w-full bg-gradient-to-br from-[#141010] to-[#2d1020] sm:max-h-[460px]">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className={`${imageClass} transition duration-300 group-hover:scale-[1.01]`}
                      sizes="(max-width:640px) 100vw, 480px"
                      priority={index === 0}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
                      {card.label}
                    </p>
                    <p className="mt-2 font-serif text-xl text-black group-hover:text-[#E6007E] sm:text-2xl">
                      {card.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#E6007E] group-hover:underline">
                      {card.cta} →
                    </span>
                  </div>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
