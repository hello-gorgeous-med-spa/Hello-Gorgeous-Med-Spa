"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { Section } from "@/components/Section";
import {
  BIOSTIMULATORS_AREAS,
  BIOSTIMULATORS_BENEFITS,
  BIOSTIMULATORS_COMPARE_CARDS,
  BIOSTIMULATORS_COMPARE_INTRO,
  BIOSTIMULATORS_COMPARE_ROWS,
  BIOSTIMULATORS_FAQ,
  BIOSTIMULATORS_IMAGES,
  BIOSTIMULATORS_PAGE_NAV,
  BIOSTIMULATORS_SEO,
  BIOSTIMULATORS_STEPS,
  RADIESSE_LEARN_MORE,
  SCULPTRA_LEARN_MORE,
} from "@/lib/biostimulators-marketing";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

function PhotoSlot({
  id,
  label,
  src,
  className = "",
}: {
  id: string;
  label: string;
  src?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-3xl border-4 border-black ${className}`}>
        <Image src={src} alt={label} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
    );
  }
  return (
    <div
      id={id}
      className={`flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-4 border-dashed border-black/30 bg-gradient-to-br from-[#FFF0F7] to-white px-6 text-center ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Photo slot</p>
      <p className="mt-2 font-black text-black">{label}</p>
      <p className="mt-1 text-sm font-medium text-black/55">Drop your picture here — we’ll place it as soon as you send it.</p>
    </div>
  );
}

export function BiostimulatorsPageContent() {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 70%, ${BRAND.pink}18 0%, transparent 45%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main className="min-w-0">
        <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, ${BRAND.pink}33 0%, transparent 35%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
                Collagen biostimulators
              </div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#FFB8DC]">
                Oswego · Naperville · Aurora · Yorkville
              </p>
              <h1 className="mb-6 text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl">
                Sculptra{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  &amp; Radiesse
                </span>
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/85">
                Rebuild your own collagen — not just add gel. We screen you like a medical practice because we are one.
                Mapping, vial plan, and VIP aftercare at Hello Gorgeous.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <CTA href={PRIMARY_BOOKING_CTA.href} variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                  Book a free consult
                </CTA>
                <CTA
                  href={`tel:${SITE.phone.replace(/\D/g, "")}`}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black"
                >
                  Call {SITE.phone}
                </CTA>
              </div>
              <p className="mt-5 text-sm font-medium text-white/80">
                Client education:{" "}
                <a
                  href={RADIESSE_LEARN_MORE.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FFB8DC] underline decoration-[#E6007E] underline-offset-4"
                >
                  Learn more at Radiesse.com
                </a>
              </p>
            </div>
            <PhotoSlot id="photo-hero" label="Hero / cheek collagen" src={BIOSTIMULATORS_IMAGES.hero} className="min-h-[320px] md:min-h-[420px]" />
          </div>
        </Section>

        <Section className="!py-8 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="On this page" className="mx-auto flex max-w-5xl flex-wrap gap-2 px-4 md:px-6">
            {BIOSTIMULATORS_PAGE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Section>

        <Section id="why" className="scroll-mt-28 border-b-4 border-black bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
                01
              </span>
              <h2 className="text-3xl font-black text-black md:text-4xl">Why clients choose biostimulators</h2>
            </div>
            <div className="rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <p className="text-lg font-medium leading-relaxed text-black/85">
                HA filler is instant gel. Sculptra® and Radiesse® are collagen biostimulators — they treat volume loss
                and laxity where filler alone can look overfilled. Medical-grade consult. No rushed injects. Arnica
                aftercare included. Individual results vary.
              </p>
            </div>
          </div>
        </Section>

        <Section id="compare" className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
                02
              </span>
              <h2 className="text-3xl font-black text-black md:text-4xl">Sculptra® vs Radiesse®</h2>
            </div>
            <p className="mb-8 max-w-3xl text-lg font-medium leading-relaxed text-black/80">{BIOSTIMULATORS_COMPARE_INTRO}</p>
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {BIOSTIMULATORS_COMPARE_CARDS.map((card) => (
                <div key={card.name} className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">{card.tag}</p>
                  <h3 className="mt-2 text-2xl font-black text-black">{card.name}</h3>
                  <p className="mt-3 font-medium leading-relaxed text-black/80">{card.body}</p>
                  <ul className="mt-4 space-y-2">
                    {card.points.map((point) => (
                      <li key={point} className="font-medium text-black/75">
                        ▸ {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white">
                    <tr>
                      <th className="px-4 py-3 font-black">At consult we compare</th>
                      <th className="px-4 py-3 font-black">Radiesse®</th>
                      <th className="px-4 py-3 font-black">Sculptra®</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BIOSTIMULATORS_COMPARE_ROWS.map((row, i) => (
                      <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-[#FFF0F7]"}>
                        <th className="px-4 py-3 align-top font-black text-[#E6007E]">{row.feature}</th>
                        <td className="px-4 py-3 font-medium text-black/85">{row.radiesse}</td>
                        <td className="px-4 py-3 font-medium text-black/85">{row.sculptra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-black/60">
              Education only — not a promise that one product is better. Your map decides. Full RADIESSE® indications and
              safety:{" "}
              <a href={RADIESSE_LEARN_MORE.href} target="_blank" rel="noopener noreferrer" className="font-bold text-[#E6007E] underline">
                radiesse.com
              </a>
              .
            </p>
          </div>
        </Section>

        <Section id="benefits" className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
                03
              </span>
              <h2 className="text-3xl font-black text-black md:text-4xl">Benefits of Sculptra® and Radiesse®</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {BIOSTIMULATORS_BENEFITS.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">0{i + 1}</p>
                  <h3 className="mt-2 text-xl font-black text-black">{item.title}</h3>
                  <p className="mt-3 font-medium leading-relaxed text-black/80">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="areas" className="scroll-mt-28 border-b-4 border-black bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
                04
              </span>
              <h2 className="text-3xl font-black text-black md:text-4xl">What Sculptra &amp; Radiesse treat</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {BIOSTIMULATORS_AREAS.map((area) => (
                <div key={area.name} className="rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  <h3 className="font-black text-[#E6007E]">▸ {area.name}</h3>
                  <p className="mt-1 font-medium text-black/80">{area.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="process" className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
                05
              </span>
              <h2 className="text-3xl font-black text-black md:text-4xl">Our process</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {BIOSTIMULATORS_STEPS.map((step, i) => (
                  <div key={step.title} className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Step {i + 1}</p>
                    <h3 className="mt-1 text-xl font-black text-black">{step.title}</h3>
                    <p className="mt-2 font-medium leading-relaxed text-black/80">{step.body}</p>
                  </div>
                ))}
              </div>
              <PhotoSlot id="photo-process" label="Treatment / mapping photo" src={BIOSTIMULATORS_IMAGES.process} className="min-h-[360px]" />
            </div>
          </div>
        </Section>

        <Section id="photos" className="scroll-mt-28 border-b-4 border-black bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
                06
              </span>
              <h2 className="text-3xl font-black text-black md:text-4xl">Results gallery</h2>
            </div>
            <p className="mb-6 font-medium text-black/70">Before/after mapping included at your visit. Send photos and we drop them into these frames.</p>
            <div className="grid gap-6 md:grid-cols-2">
              <PhotoSlot id="photo-cheeks" label="Cheek / midface result" src={BIOSTIMULATORS_IMAGES.cheeks} className="min-h-[260px]" />
              <PhotoSlot id="photo-mapping" label="Before / after mapping" src={BIOSTIMULATORS_IMAGES.mapping} className="min-h-[260px]" />
            </div>
          </div>
        </Section>

        <Section id="learn" className="scroll-mt-28 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
                07
              </span>
              <h2 className="text-3xl font-black text-black md:text-4xl">Learn more from the manufacturers</h2>
            </div>
            <p className="mb-6 max-w-3xl font-medium text-black/75">
              These are the official product sites — science, indications, and safety in the manufacturer’s words. Then
              book with us to see which map fits your face.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <a
                href={RADIESSE_LEARN_MORE.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Official · Merz</p>
                <h3 className="mt-2 text-2xl font-black text-black">RADIESSE®</h3>
                <p className="mt-3 font-medium leading-relaxed text-black/80">{RADIESSE_LEARN_MORE.blurb}</p>
                <p className="mt-4 font-black text-[#E6007E] underline">{RADIESSE_LEARN_MORE.label} ↗</p>
              </a>
              <a
                href={SCULPTRA_LEARN_MORE.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Official · Galderma</p>
                <h3 className="mt-2 text-2xl font-black text-black">Sculptra®</h3>
                <p className="mt-3 font-medium leading-relaxed text-black/80">{SCULPTRA_LEARN_MORE.blurb}</p>
                <p className="mt-4 font-black text-[#E6007E] underline">{SCULPTRA_LEARN_MORE.label} ↗</p>
              </a>
            </div>
          </div>
        </Section>

        <Section id="faq" className="scroll-mt-28 border-b-4 border-black bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 inline-flex items-center gap-3">
              <span className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-sm font-black text-white">
                08
              </span>
              <h2 className="text-3xl font-black text-black md:text-4xl">Real questions</h2>
            </div>
            <div className="space-y-4">
              {BIOSTIMULATORS_FAQ.map((item) => (
                <div key={item.question} className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  <h3 className="font-bold text-[#E6007E]">▸ {item.question}</h3>
                  <p className="mt-2 font-medium leading-relaxed text-black/85">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="relative overflow-hidden border-t-4 border-black py-16 !px-0">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)" }}
          />
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white md:px-6">
            <h2 className="text-3xl font-black md:text-5xl">Schedule Sculptra® &amp; Radiesse in Oswego</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-white/90">
              Hello Gorgeous Med Spa · 74 W Washington St. A consult is not a guaranteed prescription or a promised look.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <CTA href={BIOSTIMULATORS_SEO.bookHref} variant="outline" className="border-2 border-white bg-white text-black hover:bg-black hover:text-white">
                Book a free consult
              </CTA>
              <CTA href="/services/injectables" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black">
                Botox &amp; fillers
              </CTA>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
