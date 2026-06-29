"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL, labRequestUrl } from "@/lib/flows";
import {
  ACCESS_MEDICAL_PANELS,
  LAB_ACCESS_MEDICAL_PARTNER,
  LAB_DRAW_OPTIONS,
  LAB_HUB_HERO,
  LAB_HUB_STEPS,
  LAB_HUB_TRUST,
  LAB_IN_HOUSE_HIGHLIGHT,
  LAB_PANELS,
} from "@/lib/lab-panel-catalog";
import { BLOOD_WORK_PATH } from "@/lib/blood-work";
import { SITE } from "@/lib/seo";

const PINK = "#E6007E";

function PanelCard({
  panel,
}: {
  panel: (typeof LAB_PANELS)[number];
}) {
  const imageSrc =
    panel.id === "peak-performance"
      ? "/images/promo/peak-performance-profile-flyer.png"
      : "/images/homepage-buyer-paths/weight-loss-hormones.png";

  return (
    <Link
      id={`lab-panel-${panel.id}`}
      href={labRequestUrl({ panel: panel.id, draw: "in-office" })}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:border-[#E6007E]/30 hover:shadow-[0_16px_40px_rgba(230,0,126,0.12)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#f8f4f0] to-[#ece6df]">
        <Image
          src={imageSrc}
          alt={`${panel.name} — Hello Gorgeous Labs`}
          fill
          className="object-contain object-center p-4 transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width:768px) 100vw, 360px"
        />
        {panel.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-black/70 shadow-sm">
            {panel.badge === "POPULAR" ? "Popular" : "Best value"}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-serif text-xl text-black group-hover:text-[#E6007E]">{panel.name}</p>
        <p className="mt-1 text-sm text-black/55">{panel.tagline}</p>
        <p className="mt-4 text-2xl font-black text-[#E6007E]">
          ${panel.retailUsd}
          <span className="ml-1 text-sm font-semibold text-black/45">cash pay</span>
        </p>
        <p className="mt-2 text-xs text-black/45">
          {panel.markerCount} markers · {panel.turnaround}
          {panel.accessMedicalBlood
            ? ` · AML ${panel.accessMedicalBlood.male}/${panel.accessMedicalBlood.female}`
            : ""}
        </p>
        <ul className="mt-3 flex-1 space-y-1 text-xs text-black/50">
          {panel.markers.slice(0, 4).map((m) => (
            <li key={m}>▸ {m}</li>
          ))}
        </ul>
        <span className="mt-4 text-sm font-semibold text-[#E6007E] group-hover:underline">
          Get started →
        </span>
      </div>
    </Link>
  );
}

export function LabsHubPageContent({ highlightPanelId }: { highlightPanelId?: string }) {
  useEffect(() => {
    if (!highlightPanelId) return;
    const el = document.getElementById(`lab-panel-${highlightPanelId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      document.getElementById("panels")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [highlightPanelId]);

  return (
    <div className="min-h-[100dvh] bg-[#FAFAF8]">
      {/* Hero — Hims-style clean */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <FadeUp className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#E6007E]">
              {LAB_HUB_HERO.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-4xl text-black sm:text-5xl md:text-[3.25rem] leading-tight">
              {LAB_HUB_HERO.title}{" "}
              <span className="text-[#E6007E]">{LAB_HUB_HERO.titleAccent}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-black/60 sm:text-lg">
              {LAB_HUB_HERO.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {LAB_HUB_TRUST.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/10 bg-[#FFF0F7]/80 px-3 py-1.5 text-[11px] font-semibold text-black/70"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTA href="#panels" variant="gradient" className="px-8 py-3.5">
                Shop lab panels
              </CTA>
              <CTA href={BOOKING_URL} variant="outline" className="px-8 py-3.5">
                Book in-house draw
              </CTA>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* How it works */}
      <Section className="border-b border-black/10 bg-[#FAFAF8] py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-center text-2xl font-black text-black sm:text-3xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-black/55">
              Similar to leading online clinics — but with a real med spa and in-house draws in Oswego.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LAB_HUB_STEPS.map((step, i) => (
              <FadeUp key={step.step} delayMs={i * 60}>
                <div className="h-full rounded-2xl border-2 border-black/10 bg-white p-5 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
                    Step {step.step}
                  </span>
                  <h3 className="mt-2 font-bold text-black">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/55">{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* In-house draw — key differentiator */}
      <Section className="border-b border-black/10 bg-white py-14">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#1a0a12] to-[#2d1020] shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] lg:grid lg:grid-cols-2">
            <div className="relative min-h-[220px] lg:min-h-0">
              <Image
                src="/images/promo/peak-performance-profile-flyer.png"
                alt="In-house lab draw at Hello Gorgeous Med Spa Oswego"
                fill
                className="object-contain object-center p-6 opacity-95"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFB8DC]">
                Only at Hello Gorgeous
              </p>
              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                {LAB_IN_HOUSE_HIGHLIGHT.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/75">{LAB_IN_HOUSE_HIGHLIGHT.body}</p>
              <ul className="mt-5 space-y-2 text-sm text-white/65">
                {LAB_IN_HOUSE_HIGHLIGHT.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-[#E6007E]" aria-hidden>
                      ▸
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={BOOKING_URL}
                  className="inline-flex rounded-full border-2 border-black bg-[#E6007E] px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] transition hover:bg-[#FF2D8E]"
                >
                  Book in-house draw →
                </Link>
                <Link
                  href={labRequestUrl({ panel: "peak-performance", draw: "in-office" })}
                  className="inline-flex rounded-full border-2 border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Order Peak Performance $199
                </Link>
              </div>
              <p className="mt-4 text-xs text-white/45">
                {SITE.address.streetAddress} · {SITE.address.addressLocality},{" "}
                {SITE.address.addressRegion}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Draw options */}
      <Section className="border-b border-black/10 py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center">
            <h2 className="text-2xl font-black text-black sm:text-3xl">Where you get drawn</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-black/55">
              Your choice — we default to in-house at Hello Gorgeous when you are local.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {LAB_DRAW_OPTIONS.map((opt, i) => (
              <FadeUp key={opt.id} delayMs={i * 50}>
                <div
                  className={`relative h-full rounded-2xl border-2 p-6 ${
                    opt.badge === "RECOMMENDED"
                      ? "border-[#E6007E] bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  {opt.badge ? (
                    <span
                      className={`absolute -top-2.5 right-4 rounded-full border-2 border-black px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                        opt.badge === "RECOMMENDED"
                          ? "bg-[#E6007E] text-white"
                          : "bg-white text-black/70"
                      }`}
                    >
                      {opt.badge === "RECOMMENDED" ? "Recommended" : "Nationwide"}
                    </span>
                  ) : null}
                  <h3 className="font-bold text-black">{opt.shortLabel}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/60">{opt.description}</p>
                  <p className="mt-3 text-xs font-medium text-black/45">{opt.stepDetail}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Access Medical Labs partner */}
      <Section className="border-b border-black/10 bg-[#FFF0F7]/40 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <FadeUp className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#E6007E]">
              Processing laboratory
            </p>
            <h2 className="mt-3 text-2xl font-black text-black sm:text-3xl">
              {LAB_ACCESS_MEDICAL_PARTNER.name}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-black/60">
              {LAB_ACCESS_MEDICAL_PARTNER.description}{" "}
              <a
                href={LAB_ACCESS_MEDICAL_PARTNER.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#E6007E] underline"
              >
                View hormone panels →
              </a>
            </p>
          </FadeUp>
          <ul className="mx-auto mt-8 grid max-w-3xl gap-2 sm:grid-cols-2">
            {LAB_ACCESS_MEDICAL_PARTNER.bullets.map((b) => (
              <li key={b} className="text-sm text-black/65">
                ▸ {b}
              </li>
            ))}
          </ul>
          <FadeUp delayMs={80} className="mt-10">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
              Saliva NextGen panels (kit shipped after NP approval)
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ACCESS_MEDICAL_PANELS.filter((p) => p.specimen === "saliva").map((panel) => (
                <div
                  key={panel.code}
                  className="rounded-2xl border border-black/10 bg-white p-4 text-left"
                >
                  <p className="text-[10px] font-bold text-[#E6007E]">AML {panel.code}</p>
                  <p className="mt-1 font-semibold text-black text-sm">{panel.shortName}</p>
                  <p className="mt-2 text-xs text-black/50">{panel.markers.slice(0, 3).join(" · ")}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-black/45">
              Ask at your consult for menopause, andropause, adrenal, or cycle-mapping saliva panels.
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Panel grid */}
      <Section id="panels" className="scroll-mt-24 border-b border-black/10 bg-white py-14">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="mb-10 text-center">
            <h2 className="text-2xl font-black text-black sm:text-3xl">Shop panels</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-black/55">
              Fixed cash-pay pricing · NP review included · In-house or Quest/LabCorp draw
            </p>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LAB_PANELS.map((panel, i) => (
              <FadeUp key={panel.id} delayMs={i * 40}>
                <PanelCard panel={panel} />
              </FadeUp>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-black/50">
            Want the full biomarker breakdown?{" "}
            <Link href={BLOOD_WORK_PATH} className="font-semibold text-[#E6007E] underline">
              Read our lab guide →
            </Link>
          </p>
        </div>
      </Section>

      {/* Closing CTA */}
      <Section className="py-16" style={{ background: `linear-gradient(125deg, ${PINK} 0%, #9b0a4d 100%)` }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <FadeUp>
            <h2 className="text-2xl font-black text-white sm:text-3xl">Ready for real numbers?</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
              Order your panel online, then draw in-house at Hello Gorgeous or at Quest/LabCorp — your call.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={labRequestUrl({ panel: "peak-performance", draw: "in-office" })}
                className="inline-flex justify-center rounded-full border-2 border-black bg-white px-8 py-3.5 text-sm font-bold text-black transition hover:bg-[#FFF0F7]"
              >
                Start with Peak Performance · $199
              </Link>
              <Link
                href={BOOKING_URL}
                className="inline-flex justify-center rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Book in-house draw on Fresha
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>
    </div>
  );
}
