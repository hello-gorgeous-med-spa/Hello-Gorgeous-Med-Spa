"use client";

import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  BIOSTIMULATORS_BENEFITS,
  BIOSTIMULATORS_COMPARE_ROWS,
  BIOSTIMULATORS_FAQ,
  BIOSTIMULATORS_IMAGES,
  BIOSTIMULATORS_MAPS,
  BIOSTIMULATORS_PAGE_NAV,
  BIOSTIMULATORS_STEPS,
  BIOSTIMULATORS_TREATS,
  RADIESSE_LEARN_MORE,
  SCULPTRA_LEARN_MORE,
} from "@/lib/biostimulators-marketing";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const serif = cormorant.className;

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function SparkleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .29-.9l5.17-.76a2.12 2.12 0 0 0 1.6-1.16z" />
    </svg>
  );
}

export function BiostimulatorsPageContent() {
  const [openFaq, setOpenFaq] = useState(0);
  const tel = `tel:${SITE.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      <div className="flex w-full select-none items-center justify-center gap-4 bg-black py-3 text-[10px] uppercase tracking-[0.22em] text-white/80 md:py-3.5 md:text-[11px]">
        <span className="hidden h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF6B9D] md:inline-block" />
        <span>We Screen You Like A Medical Practice Because We Are One</span>
        <span className="mx-2 hidden opacity-20 md:inline">·</span>
        <a href={tel} className="hidden text-[#D4A373] transition hover:text-white md:inline">
          {SITE.phone}
        </a>
      </div>

      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-14 md:grid-cols-2 md:px-8 md:py-20 lg:gap-16">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              <SparkleIcon className="h-3 w-3 text-[#D4A373]" />
              Sculptra® + Radiesse® · Collagen Biostimulator Experts · Oswego, IL
            </p>
            <h1 className={`${serif} text-[36px] leading-[0.95] tracking-[-0.02em] text-black md:text-[52px] lg:text-[60px]`}>
              Sculptra® Injections{" "}
              <span className="font-light text-zinc-400">in</span> Oswego, IL{" "}
              <span className={`${serif} text-[26px] font-normal tracking-[0.08em] text-zinc-400 md:text-[34px]`}>
                | Hello Gorgeous Medical Spa
              </span>
            </h1>
            <h2 className={`${serif} mt-6 max-w-[560px] text-[20px] leading-[1.25] text-zinc-700 md:text-[24px]`}>
              Restore Facial Volume and Rebuild Collagen Naturally with{" "}
              <span className="font-medium text-black">Sculptra®</span> and{" "}
              <span className="font-medium text-black">Radiesse®</span>
            </h2>
            <p className="mt-6 max-w-[560px] text-[15px] leading-[1.75] text-zinc-600">
              Sculptra® is a unique injectable treatment that restores lost facial volume caused by aging or illness.
              Unlike traditional fillers, Sculptra stimulates collagen production over time rather than providing
              immediate results. Its key component, poly-L-lactic acid (PLLA), revitalizes the skin&apos;s natural
              composition by replenishing collagen, enhancing elasticity, and promoting a more youthful appearance.
            </p>
            <p className="mt-4 max-w-[560px] text-[13px] leading-[1.6] text-zinc-500">
              Serving Oswego, Aurora, Naperville &amp; Yorkville — medical-grade screening, licensed providers, VIP
              aftercare.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={tel}
                className="inline-flex items-center gap-2 bg-black px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-zinc-800"
              >
                <PhoneIcon />
                Book Your Sculptra Consult — {SITE.phone}
              </a>
              <Link
                href="#process"
                className="inline-flex items-center gap-2 border border-black/15 px-5 py-3.5 text-[12px] uppercase tracking-[0.16em] text-zinc-700 transition hover:border-[#D4A373] hover:text-[#D4A373]"
              >
                Our Medical Process →
              </Link>
            </div>
            <p className="mt-4 text-[12px] text-zinc-500">
              Client education:{" "}
              <a
                href={RADIESSE_LEARN_MORE.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-700 underline decoration-[#D4A373]/40 underline-offset-4 hover:text-[#FF6B9D]"
              >
                {RADIESSE_LEARN_MORE.label}
              </a>
            </p>
            <div className="mt-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black">Medical Practice Standards</p>
              <p className="mt-1 text-[12px] text-zinc-600">Licensed providers · Full medical history · Personalized plan</p>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/4.6] overflow-hidden border border-[#D4A373]/20 bg-[#FFF5F7]">
              {BIOSTIMULATORS_IMAGES.hero ? (
                <Image src={BIOSTIMULATORS_IMAGES.hero} alt="Sculptra collagen renewal" fill className="object-cover" sizes="50vw" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F7] via-[#ffe2e8] to-[#D4A373]/30" />
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #FF6B9D 0.5px, transparent 0.5px)", backgroundSize: "18px 18px" }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A373] to-[#FF6B9D] text-white">
                      <SparkleIcon className="h-8 w-8" />
                    </div>
                    <p className={`${serif} text-[22px] leading-[1.1] text-black`}>
                      Natural Lift.
                      <br />
                      No Overfilled Look.
                    </p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Woman 40s · Restored Cheek Volume · Collagen Renewal
                    </p>
                    <div className="mt-3 flex gap-1.5">
                      <span className="rounded-full bg-black px-2.5 py-1 text-[10px] tracking-wide text-white">SCULPTRA®</span>
                      <span className="rounded-full border border-black px-2.5 py-1 text-[10px] tracking-wide text-black">RADIESSE®</span>
                    </div>
                    <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-zinc-400">Photo coming — send yours and we place it here</p>
                  </div>
                </>
              )}
              <p className="absolute right-4 top-4 text-[10px] uppercase tracking-[0.16em] text-zinc-500">Medical Screening Required</p>
            </div>
            <div className="mt-4 border border-[#D4A373]/15 bg-white p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black">Why Clients Choose Us</p>
              <p className="mt-1 text-[12px] leading-[1.4] text-zinc-600">
                Medical-grade consultation. No rushed injects. VIP arnica + aftercare included.
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className="border-y border-[#D4A373]/10 bg-[#FFF5F7]" aria-label="On this page">
        <div className="mx-auto flex max-w-[1180px] flex-wrap gap-x-8 gap-y-2 px-5 py-4 md:px-8">
          {BIOSTIMULATORS_PAGE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 transition hover:text-[#FF6B9D]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section id="benefits" className="scroll-mt-28 bg-[#FFF5F7] py-16 md:py-24">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#D4A373]">Collagen Biostimulator · Longevity</p>
          <h2 className={`${serif} text-[34px] leading-[0.95] text-black md:text-[44px]`}>
            Benefits of Sculptra® and Radiesse® at Hello Gorgeous
          </h2>
          <p className="mt-5 max-w-[640px] text-[15px] leading-[1.7] text-zinc-600">
            One of Sculptra&apos;s standout features is its efficacy in addressing deep lines, creases, and folds that
            can mar your facial profile. By stimulating collagen production, it offers a gradual and natural-looking
            transformation, smoothing out these concerns and allowing you to rediscover your youthful allure.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
            {BIOSTIMULATORS_BENEFITS.map((item) => (
              <div key={item.title} className="border border-[#D4A373]/15 bg-white p-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#D4A373]">{item.sub}</p>
                <h3 className={`${serif} mt-2 text-[22px] leading-[1.15] text-black`}>{item.title}</h3>
                <p className="mt-3 text-[13.5px] leading-[1.7] text-zinc-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="scroll-mt-28 border-y border-black/5 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#D4A373]">Glow Journal · Collagen Education</p>
          <h2 className={`${serif} text-[34px] leading-[0.95] text-black md:text-[44px]`}>
            Sculptra vs. Radiesse: Which Collagen Stimulator?
          </h2>
          <p className="mt-5 max-w-[640px] text-[15px] leading-[1.7] text-zinc-600">
            Both build collagen, but their personality, timeline, and artistry are completely different. Think structure
            vs. restoration. We never believe in one-size-fits-all beauty.
          </p>
          <div className="mt-10 overflow-x-auto border border-[#D4A373]/15">
            <table className="w-full min-w-[560px] text-left text-[13.5px]">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em]">At consult</th>
                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#D4A373]">Radiesse® · CaHA</th>
                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#FF6B9D]">Sculptra® · PLLA</th>
                </tr>
              </thead>
              <tbody>
                {BIOSTIMULATORS_COMPARE_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 ? "bg-[#FFF5F7]" : "bg-white"}>
                    <th className="px-4 py-3 align-top font-medium text-black">{row.feature}</th>
                    <td className="px-4 py-3 text-zinc-600">{row.radiesse}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.sculptra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-[13px] text-zinc-500">
            Official product education:{" "}
            <a href={RADIESSE_LEARN_MORE.href} target="_blank" rel="noopener noreferrer" className="underline decoration-[#D4A373]/40 underline-offset-4 hover:text-[#FF6B9D]">
              Radiesse.com
            </a>{" "}
            ·{" "}
            <a href={SCULPTRA_LEARN_MORE.href} target="_blank" rel="noopener noreferrer" className="underline decoration-[#D4A373]/40 underline-offset-4 hover:text-[#FF6B9D]">
              SculptraUSA.com
            </a>
            . Prescription only. Individual results vary.
          </p>
        </div>
      </section>

      <section id="mapping" className="scroll-mt-28 bg-[#FFF5F7] py-16 md:py-24">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#D4A373]">Facial Mapping · Oswego, IL</p>
          <h2 className={`${serif} text-[34px] leading-[0.95] text-black md:text-[44px]`}>
            Where we map Sculptra® and Radiesse®
          </h2>
          <p className="mt-5 max-w-[640px] text-[15px] leading-[1.7] text-zinc-600">
            These diagrams are education — not a promise that every zone is treated, or that every face needs both
            products. Your map is set after medical screening.
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {BIOSTIMULATORS_MAPS.map((map) => (
              <figure key={map.id} className="border border-[#D4A373]/15 bg-white">
                <div className="bg-[#FFF8F4] px-4 pt-6 md:px-8">
                  <Image
                    src={map.src}
                    alt={map.alt}
                    width={map.width}
                    height={map.height}
                    className="mx-auto h-auto w-full max-w-[520px] object-contain"
                    sizes="(max-width: 1024px) 100vw, 520px"
                  />
                </div>
                <figcaption className="border-t border-[#D4A373]/15 p-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#D4A373]">{map.sub}</p>
                  <h3 className={`${serif} mt-1 text-[24px] text-black`}>{map.name}</h3>
                  <p className="mt-3 text-[13.5px] leading-[1.7] text-zinc-600">{map.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {map.zones.map((zone) => (
                      <li
                        key={zone}
                        className="border border-black/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-zinc-600"
                      >
                        {zone}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-28 bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 md:grid-cols-2 md:px-8">
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#D4A373]">Our Medical Process</p>
            <h2 className={`${serif} text-[32px] leading-[0.95] text-black md:text-[42px]`}>
              Our Sculptra® and Radiesse Process at Hello Gorgeous Medical Spa
            </h2>
            <p className="mt-5 text-[15px] leading-[1.7] text-zinc-600">
              We start with a thorough medical consultation to evaluate your needs and goals. Because we screen you like
              a medical practice, because we are one. While same-day Sculptra treatments may be an option, your provider
              will decide based on your unique circumstances, ensuring a personalized plan for optimal results.
            </p>
            <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-zinc-400">
              Same-day treatment only if medically appropriate. We never rush injections.
            </p>
          </div>
          <div className="space-y-6">
            {BIOSTIMULATORS_STEPS.map((step) => (
              <div key={step.n} className="border-l-2 border-[#D4A373] pl-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4A373]">{step.n}</p>
                <h3 className={`${serif} mt-1 text-[22px] text-black`}>{step.title}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.7] text-zinc-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="treats" className="scroll-mt-28 bg-[#FFF5F7] py-16 md:py-24">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <h2 className={`${serif} text-[32px] leading-[0.95] text-black md:text-[42px]`}>What Sculptra Treats</h2>
          <p className="mt-4 max-w-[420px] text-[13.5px] leading-[1.6] text-zinc-600">
            Sculptra &amp; Radiesse address volume loss and laxity where filler alone can look overfilled. Natural
            collagen restoration for face &amp; body.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {BIOSTIMULATORS_TREATS.map((area) => (
              <div key={area.name} className="group border border-[#D4A373]/15 bg-white p-5">
                <h3 className={`${serif} text-[19px] leading-[1.15] text-black`}>{area.name}</h3>
                <p className="mt-2 text-[12.5px] leading-[1.6] text-zinc-600">{area.note}</p>
                <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-zinc-400 transition group-hover:text-[#D4A373]">
                  Sculptra® · Radiesse® at Hello Gorgeous
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-28 border-y border-black/5 bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 md:grid-cols-[0.9fr_1.1fr] md:px-8">
          <div className="md:sticky md:top-24 md:self-start">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#D4A373]">Real Questions · Medical Answers</p>
            <h2 className={`${serif} mt-3 text-[36px] leading-[0.9] text-black md:text-[48px]`}>
              Your Sculptra Questions, Answered.
            </h2>
            <p className="mt-5 max-w-[420px] text-[14px] leading-[1.7] text-zinc-600">
              Medical-grade education from Oswego&apos;s collagen biostimulator specialists. We screen you like a
              medical practice because we are one.
            </p>
            <div className="mt-8 flex max-w-[400px] gap-4 bg-black p-5 text-white">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#D4A373]">
                <PhoneIcon className="h-4 w-4 text-black" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Still Have Questions?</p>
                <a href={tel} className={`${serif} text-[18px] transition hover:text-[#D4A373]`}>
                  {SITE.phone}
                </a>
                <p className="mt-1 text-[11px] text-white/60">Oswego, Aurora, Naperville, Yorkville</p>
              </div>
            </div>
          </div>
          <div>
            {BIOSTIMULATORS_FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.question} className={`border-b ${open ? "border-black/10 bg-[#FFF5F7]" : "border-zinc-200 bg-white"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 p-5 text-left md:p-6"
                    aria-expanded={open}
                  >
                    <span className={`${serif} text-[18px] text-black md:text-[20px]`}>{item.question}</span>
                    <span className="text-zinc-400">{open ? "–" : "+"}</span>
                  </button>
                  {open ? <p className="px-5 pb-5 text-[13.5px] leading-[1.75] text-zinc-600 md:px-6">{item.answer}</p> : null}
                </div>
              );
            })}
            <p className="pt-6 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              All treatments require medical consultation · Results vary · Licensed providers only
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-20 md:py-28">
        <div className="relative mx-auto max-w-[900px] px-5 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#D4A373]">VIP Gift Bag Includes Arnica + Aftercare</p>
          <h2 className={`${serif} mt-6 text-[36px] leading-[0.9] text-white md:text-[56px]`}>
            Schedule a Sculptra® and Radiesse Appointment at Hello Gorgeous Today
          </h2>
          <p className="mx-auto mt-6 max-w-[720px] text-[15px] leading-[1.7] text-white/70 md:text-[16px]">
            Contact Hello Gorgeous Medical Spa in Oswego, IL to schedule your Sculptra consultation. We understand the
            desire to recapture your youth and regain confidence. Sculptra can restore volume and revitalize your skin,
            revealing your inner beauty. Say hello to a more youthful you with Sculptra.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={tel}
              className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-black transition hover:bg-[#D4A373]"
            >
              Call {SITE.phone}
            </a>
            <Link
              href={PRIMARY_BOOKING_CTA.href}
              className="inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-[12px] uppercase tracking-[0.16em] text-white transition hover:border-[#D4A373] hover:text-[#D4A373]"
            >
              Book Online — Book Your Glow
            </Link>
          </div>
          <div className="mx-auto mt-10 grid max-w-[720px] grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <div className="border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4A373]">Visit</p>
              <p className="mt-1 text-[12px] leading-[1.5] text-white/70">Oswego, IL 60543 · Serving Aurora, Naperville, Yorkville</p>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4A373]">Medical Promise</p>
              <p className="mt-1 text-[12px] leading-[1.5] text-white/70">Licensed Providers · Medical Screening · VIP Aftercare</p>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4A373]">Learn</p>
              <a href={RADIESSE_LEARN_MORE.href} target="_blank" rel="noopener noreferrer" className="mt-1 block text-[12px] text-white/70 underline decoration-white/20 hover:text-[#D4A373]">
                Radiesse.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-black py-8 text-center">
        <p className={`${serif} text-[20px] tracking-[0.14em] text-[#D4A373]`}>HELLO GORGEOUS MEDICAL SPA</p>
        <p className="mt-2 text-[11px] uppercase leading-[1.6] tracking-[0.16em] text-white/60">
          Oswego, IL 60543 · Aurora · Naperville · Yorkville
        </p>
        <p className="mt-3 text-[10px] tracking-wide text-white/30">
          © {new Date().getFullYear()} Hello Gorgeous Medical Spa. Not affiliated with Galderma. Sculptra® is a
          registered trademark.
        </p>
      </div>
    </div>
  );
}
