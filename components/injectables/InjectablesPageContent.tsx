"use client";

import Image from "next/image";
import Link from "next/link";

import { FAQAccordion } from "@/components/FAQAccordion";
import { CTA } from "@/components/CTA";
import { InjectablesEducationGallery } from "@/components/injectables/InjectablesEducationGallery";
import { InjectablesTreatPicker } from "@/components/injectables/InjectablesTreatPicker";
import { FadeUp, Section } from "@/components/Section";
import {
  INJECTABLES_FAQS,
  INJECTABLES_FILLER_PACKAGES,
  INJECTABLES_MARKETING,
  INJECTABLES_PAGE_NAV,
  INJECTABLES_STEPS,
  INJECTABLES_TREATMENT_AREAS,
} from "@/lib/injectables-marketing";
import { INJECTABLES_BRAND_CARDS } from "@/lib/injectables-treat-goals";

const BRAND = { pink: "#E6007E", pinkHot: "#FF2D8E", rose: "#FFF0F7", dark: "#0a0a0a" };

export function InjectablesPageContent() {
  const { images } = INJECTABLES_MARKETING;

  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}22 0%, transparent 55%),
            radial-gradient(ellipse 50% 35% at 100% 20%, ${BRAND.pinkHot}14 0%, transparent 50%),
            linear-gradient(180deg, #ffffff 0%, ${BRAND.rose} 40%, #ffffff 100%)
          `,
        }}
      />

      <main className="min-w-0">
        {/* Mockup-style conversion hero — no FadeUp (opacity:0 hides LCP hero) */}
        <Section className="border-b-4 border-black !bg-transparent py-10 lg:py-14">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8">
            <div className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.28)] sm:min-h-[520px]">
              <Image
                src={images.hero}
                alt="Botox and fillers — medical aesthetics at Hello Gorgeous Med Spa Oswego"
                fill
                priority
                className="object-cover object-[center_28%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <span className="inline-flex w-fit rounded-full bg-[#E6007E] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  Medical aesthetics
                </span>
                <h1 className="mt-4 font-serif text-4xl font-black leading-[1.05] text-white sm:text-5xl">
                  Botox & Fillers
                </h1>
                <p className="mt-3 text-lg font-bold text-white">
                  Botox from $10/unit · Half syringe $300 · Filler $599
                </p>
                <p className="mt-1 text-sm font-medium text-white/80">
                  Buy 2 syringes, save $100 · custom plan at your free consult.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <CTA href="#pricing" variant="gradient">
                    Get pricing →
                  </CTA>
                  <CTA
                    href={INJECTABLES_MARKETING.bookHref}
                    variant="outline"
                    className="!border-white !text-white hover:!bg-white/10"
                  >
                    Book free consult
                  </CTA>
                </div>
              </div>
            </div>
            <InjectablesTreatPicker />
          </div>
        </Section>

        <nav className="sticky top-0 z-20 border-b-4 border-black bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {INJECTABLES_PAGE_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-xs font-bold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Clinic video + stills from the Botox landing build */}
        <Section id="clinic" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">In our Oswego clinic</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">See the experience</h2>
            <p className="mt-3 max-w-2xl font-medium text-black/70">
              Silent HD clinic footage from real Hello Gorgeous visits — the same care behind every neurotoxin and filler appointment.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <FadeUp>
              <div className="overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <video
                  className="aspect-[9/16] max-h-[70vh] w-full object-cover md:aspect-video md:max-h-none"
                  controls
                  playsInline
                  preload="metadata"
                  poster="/videos/botox/botox-clinic-slideshow-poster.jpg"
                >
                  <source src="/videos/botox/botox-clinic-slideshow.mp4" type="video/mp4" />
                </video>
              </div>
            </FadeUp>
            <FadeUp delayMs={60}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                  >
                    <Image
                      src={`/images/botox/slideshow/0${n}.jpg`}
                      alt={`Botox clinic still ${n} — Hello Gorgeous Med Spa Oswego`}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-medium text-black/60">
                NP-directed · authentic product · you approve every unit and syringe.
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* Brand subpages — matches All 5 brands PDF */}
        <Section id="brands" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Neurotoxin brands</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">
              All 5 brands{" "}
              <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text italic text-transparent">
                we offer
              </span>
            </h2>
            <p className="mt-3 max-w-2xl font-medium text-black/70">
              Every wrinkle-relaxer under one roof. Pick a brand to learn more — or share your goals and our NP will
              recommend the best fit at your free consult.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INJECTABLES_BRAND_CARDS.map((brand, i) => {
              const onsetFilled = brand.onset;
              const durFilled = Math.round(brand.durMonths);
              return (
                <FadeUp key={brand.id} delayMs={i * 40}>
                  <Link
                    href={brand.href}
                    className="group flex h-full flex-col overflow-hidden rounded-[22px] border-2 border-black bg-white shadow-[6px_6px_0_0_rgba(255,45,142,0.35)] transition hover:-translate-y-0.5"
                  >
                    <div className="relative h-44 overflow-hidden bg-[#f0ebe8] sm:h-[184px]">
                      <Image
                        src={brand.image}
                        alt={brand.imageAlt}
                        fill
                        className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                      />
                      <span className="absolute left-3.5 top-3.5 rounded-full bg-[#111] px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] text-white">
                        {brand.chip}
                      </span>
                      <span className="absolute right-3.5 top-3.5 rounded-full bg-[#FF2D8E]/95 px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-white">
                        {brand.priceTag}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF2D8E]">Neurotoxin</p>
                      <h3 className="mt-1.5 font-serif text-[26px] font-bold leading-tight text-black">{brand.name}</h3>
                      <p className="mt-2.5 flex items-baseline gap-2">
                        <span className="font-serif text-[30px] font-extrabold text-[#FF2D8E]">{brand.price}</span>
                        {brand.unit ? <span className="text-sm font-semibold text-black/55">{brand.unit}</span> : null}
                      </p>
                      <p className="mt-1 min-h-[18px] text-[13px] text-black/50">{brand.note}</p>

                      <div className="mt-4 flex gap-6">
                        <div>
                          <p className="mb-1.5 text-[10px] font-bold tracking-[0.14em] text-black/45">ONSET</p>
                          <div className="flex gap-1">
                            {[0, 1, 2].map((pip) => (
                              <span
                                key={`onset-${pip}`}
                                className={`h-1.5 w-4 rounded-full ${
                                  pip < onsetFilled ? "bg-[#FF2D8E]" : "bg-black/12"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-1.5 text-[10px] font-bold tracking-[0.14em] text-black/45">
                            LASTS · {brand.durLabel}
                          </p>
                          <div className="flex gap-1">
                            {[0, 1, 2, 3, 4, 5].map((pip) => (
                              <span
                                key={`dur-${pip}`}
                                className={`h-1.5 w-[11px] rounded-full ${
                                  pip < durFilled ? "bg-black/55" : "bg-black/12"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[#222]">{brand.blurb}</p>
                      <span className="mt-5 text-[15px] font-bold text-[#E6007E]">Learn more →</span>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
          <FadeUp delayMs={120}>
            <div className="mt-10 rounded-[22px] border-2 border-black bg-[#FFF0F7] px-6 py-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.22)] sm:px-8">
              <p className="font-serif text-2xl font-bold text-black">Not sure which is right for you?</p>
              <p className="mt-2 max-w-2xl text-sm font-medium text-black/70 sm:text-base">
                We screen you like a medical practice, because we are one. Your NP will match the brand to your goals.
              </p>
              <Link
                href={INJECTABLES_MARKETING.bookHref}
                className="mt-4 inline-flex rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-extrabold text-white"
              >
                Book free consult →
              </Link>
            </div>
          </FadeUp>
        </Section>

        <Section id="fillers" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <FadeUp>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Dermal & lip fillers</p>
              <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Volume, definition & balance</h2>
              <p className="mt-3 max-w-xl font-medium text-black/75">
                Premium HA fillers for lips, cheeks, jawline & more — with Lip Studio AI preview and 2-week follow-up included.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {INJECTABLES_TREATMENT_AREAS.slice(0, 8).map((area) => (
                  <span
                    key={area}
                    className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_rgba(230,0,126,0.25)]"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={INJECTABLES_MARKETING.lipFillerHref}
                  className="inline-flex rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-extrabold text-white"
                >
                  Lip filler →
                </Link>
                <Link
                  href={INJECTABLES_MARKETING.dermalFillersHref}
                  className="inline-flex rounded-full border-2 border-black px-6 py-3 text-sm font-extrabold hover:border-[#E6007E] hover:text-[#E6007E]"
                >
                  Dermal fillers →
                </Link>
                <Link
                  href={INJECTABLES_MARKETING.lipStudioHref}
                  className="inline-flex rounded-full border-2 border-[#E6007E] px-6 py-3 text-sm font-extrabold text-[#E6007E]"
                >
                  Lip Studio preview →
                </Link>
              </div>
            </FadeUp>
            <FadeUp delayMs={60}>
              <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={images.lipPromo}
                  alt="Lip filler at Hello Gorgeous Med Spa — natural enhancement Oswego IL"
                  width={900}
                  height={1100}
                  className="h-auto w-full"
                />
              </div>
            </FadeUp>
          </div>
        </Section>

        <InjectablesEducationGallery audience="both" />

        <Section id="how" className="scroll-mt-24 border-b-4 border-black bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">How it works</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Consult to gorgeous</h2>
          </FadeUp>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {INJECTABLES_STEPS.map((step) => (
              <li
                key={step.step}
                className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
              >
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#E6007E]">▸ {step.title}</h3>
                    <p className="mt-1 text-sm font-medium text-black/80">{step.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="pricing" className="scroll-mt-24 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">Pricing</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Honest menu · free consult first</h2>
            <p className="mt-3 max-w-2xl font-medium text-black/65">
              Lip & dermal filler packages — see the look, then book a free consult for your custom map.
            </p>
          </FadeUp>

          {/* Visual strip — art from your injectables shoot */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              {
                src: images.glamPortrait,
                alt: "Glowing skin — injectables aesthetic at Hello Gorgeous",
                label: "Natural glow",
                pos: "object-[center_28%]",
              },
              {
                src: images.lipPromo,
                alt: "½ syringe lip filler art — Hello Gorgeous Med Spa",
                label: "½ syringe available",
                pos: "object-cover",
              },
              {
                src: images.chinGlove,
                alt: "Medical injector consult — Hello Gorgeous Oswego",
                label: "NP-directed care",
                pos: "object-[center_42%]",
              },
            ].map((shot) => (
              <div
                key={shot.src}
                className="relative aspect-[5/3] overflow-hidden rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(230,0,126,0.28)]"
              >
                <Image src={shot.src} alt={shot.alt} fill className={`object-cover ${shot.pos}`} sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                  {shot.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INJECTABLES_FILLER_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`group flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.28)] transition hover:-translate-y-0.5 ${
                  "highlight" in pkg && pkg.highlight ? "ring-4 ring-[#E6007E]/30" : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-black">
                  <Image
                    src={pkg.image}
                    alt={pkg.imageAlt}
                    fill
                    className={`object-cover transition duration-500 group-hover:scale-[1.04] ${pkg.imagePosition}`}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <p className="absolute bottom-3 left-3 font-serif text-2xl font-black text-white drop-shadow">
                    {pkg.price}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-[#E6007E]">▸ {pkg.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-black/55">{pkg.detail}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm font-medium text-black/80">
                    {pkg.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                  <Link
                    href={pkg.href}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Learn more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section className="border-b-4 border-black bg-black py-12 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FFB8DC]">Pair with advanced skin</p>
          <h2 className="mt-3 font-serif text-2xl font-black sm:text-3xl">Injectables + InMode Trifecta</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Volume and lines from fillers & Botox — texture and tightening from Morpheus8 & Solaria CO₂.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={INJECTABLES_MARKETING.morpheus8Href}
              className="rounded-full border-2 border-white px-6 py-3 font-bold hover:bg-white hover:text-black"
            >
              Explore Morpheus8
            </Link>
            <Link
              href="/services/solaria-co2"
              className="rounded-full bg-[#E6007E] px-6 py-3 font-bold hover:bg-[#FF2D8E]"
            >
              Solaria CO₂
            </Link>
          </div>
        </Section>

        <Section id="faq" className="scroll-mt-24 bg-white py-14">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E6007E]">FAQ</p>
            <h2 className="mt-2 font-serif text-3xl font-black sm:text-4xl">Injectables questions</h2>
          </FadeUp>
          <div className="mt-8 max-w-3xl">
            <FAQAccordion items={INJECTABLES_FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
          </div>
        </Section>

        <Section className="border-t-4 border-black bg-gradient-to-r from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] py-14 text-center text-white">
          <h2 className="font-serif text-3xl font-black">Ready for your consult?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Botox $10/unit · half syringe $300 · filler $599 · NP-led · Oswego IL
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTA
              href={INJECTABLES_MARKETING.bookHref}
              variant="outline"
              className="!border-white !bg-white !text-[#E6007E]"
            >
              Book free consult
            </CTA>
            <a
              href={INJECTABLES_MARKETING.phoneHref}
              className="inline-flex items-center rounded-full border-2 border-white px-6 py-3 font-bold"
            >
              Call {INJECTABLES_MARKETING.phoneDisplay}
            </a>
          </div>
        </Section>
      </main>
    </div>
  );
}
