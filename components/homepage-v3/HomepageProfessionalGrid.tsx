import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

/**
 * Four equal tiles replacing long stacked Experience / Innovation / AI / Philosophy / Our Story sections.
 */
export function HomepageProfessionalGrid() {
  return (
    <section
      className="bg-neutral-50 py-12 md:py-16 border-t border-black/8"
      aria-labelledby="professional-grid-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#E6007E] mb-2">
          Why Hello Gorgeous
        </p>
        <h2
          id="professional-grid-heading"
          className="text-2xl md:text-3xl font-semibold text-black text-center mb-10 md:mb-12"
        >
          Clinical excellence, personal care
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
          <article className="rounded-2xl border border-black/10 bg-white p-6 md:p-7 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-black mb-3">Our philosophy</h3>
            <p className="text-xl md:text-2xl font-semibold text-black leading-snug">
              Confidence should feel{" "}
              <span className="text-[#E6007E]">effortless.</span>
            </p>
            <p className="mt-4 text-sm text-black/70 leading-relaxed flex-1">
              True beauty is about enhancing what makes you uniquely you — with precision, intention,
              and care.
            </p>
            <div className="mt-5 w-12 h-0.5 bg-[#E6007E]" />
          </article>

          <article className="rounded-2xl border border-black/10 bg-white p-6 md:p-7 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-black mb-3">Our story</h3>
            <p className="text-sm text-black/75 leading-relaxed flex-1">
              Medical aesthetics should feel personal, safe, and aligned with how you want to look and
              feel. We combine clinical expertise with an artist&apos;s eye — results that look like
              you, elevated.
            </p>
            <p className="mt-3 text-sm text-black/75 leading-relaxed">
              Serving Oswego, Naperville, Aurora, and Plainfield with premium, natural-looking care.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="text-sm font-semibold text-[#E6007E] hover:underline inline-flex items-center gap-1"
              >
                Read our story
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/why-choose-us"
                className="text-sm font-semibold text-[#E6007E] hover:underline inline-flex items-center gap-1"
              >
                Why choose us
                <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-black/10 bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow sm:min-h-[280px]">
            <div className="relative h-36 sm:h-40 shrink-0">
              <Image
                src="/images/services/hg-consultation-setup.png"
                alt="Consultation experience at Hello Gorgeous Med Spa"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="p-6 md:p-7 flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-black mb-2">Your experience</h3>
              <p className="text-sm text-black/75 leading-relaxed flex-1">
                Precision and artistry in every treatment. Consultations are collaborative — we listen,
                assess, and build a plan that fits your goals.
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm font-semibold">
                <Link href={BOOKING_URL} className="text-[#E6007E] hover:underline">
                  Book a consultation →
                </Link>
                <Link href="/your-journey" className="text-black/80 hover:text-[#E6007E] hover:underline">
                  Explore your journey →
                </Link>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-black/15 bg-black text-white p-6 md:p-7 flex flex-col shadow-sm hover:shadow-md transition-shadow sm:min-h-[280px]">
            <h3 className="text-lg font-semibold text-white mb-2">Innovation &amp; AI</h3>
            <p className="text-sm text-white/75 leading-relaxed flex-1">
              Technology supports every treatment — from precision planning to secure virtual consults.
              Our AI guides answer questions by specialty (education only; not medical advice).
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li className="flex gap-2">
                <span className="text-[#E6007E]" aria-hidden>
                  ·
                </span>
                Dose planning, lip visualization, digital charting
              </li>
              <li className="flex gap-2">
                <span className="text-[#E6007E]" aria-hidden>
                  ·
                </span>
                On-demand mascot guides — tap the chat icon
              </li>
            </ul>
            <Link
              href="/care-engine"
              className="mt-5 inline-flex text-sm font-semibold text-[#E6007E] hover:text-white transition-colors"
            >
              Explore our technology →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
