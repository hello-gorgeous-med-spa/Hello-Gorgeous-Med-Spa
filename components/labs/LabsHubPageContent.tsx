"use client";

import Link from "next/link";
import { useEffect } from "react";

import { LabsHubSubnav } from "@/components/medical/MedicalHubNav";
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

function PanelCard({
  panel,
}: {
  panel: (typeof LAB_PANELS)[number];
}) {
  return (
    <Link
      id={`lab-panel-${panel.id}`}
      href={labRequestUrl({ panel: panel.id, draw: "in-office" })}
      className="group flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {panel.badge ? (
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              {panel.badge === "POPULAR" ? "Popular" : "Best value"}
            </p>
          ) : null}
          <h3 className="mt-1 text-lg font-semibold text-neutral-900 group-hover:text-neutral-700">
            {panel.name}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">{panel.tagline}</p>
        </div>
        <p className="shrink-0 text-lg font-semibold text-neutral-900">${panel.retailUsd}</p>
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        {panel.markerCount} markers · {panel.turnaround}
        {panel.fasting ? ` · ${panel.fasting}` : ""}
      </p>

      <ul className="mt-4 flex-1 space-y-1.5 text-sm text-neutral-600">
        {panel.markers.slice(0, 5).map((m) => (
          <li key={m} className="flex gap-2">
            <span className="text-neutral-300" aria-hidden>
              —
            </span>
            {m}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm font-medium text-neutral-900">
        Get started <span className="text-neutral-400 transition group-hover:translate-x-0.5 inline-block">→</span>
      </p>
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
    <div className="min-h-[100dvh] bg-white">
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              {LAB_HUB_HERO.eyebrow}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              {LAB_HUB_HERO.title}{" "}
              <span className="text-neutral-700">{LAB_HUB_HERO.titleAccent}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-neutral-600">
              {LAB_HUB_HERO.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {LAB_HUB_TRUST.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-600"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#panels"
                className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Shop lab panels
              </Link>
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
              >
                Book in-house draw
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <LabsHubSubnav />

      <Section id="how-it-works" className="scroll-mt-28 border-b border-neutral-200 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <FadeUp>
            <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">How it works</h2>
            <p className="mt-2 max-w-lg text-sm text-neutral-500">
              Order online, draw in-house at Oswego or at Quest/LabCorp — NP review on every panel.
            </p>
          </FadeUp>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LAB_HUB_STEPS.map((step, i) => (
              <FadeUp key={step.step} delayMs={i * 40}>
                <li className="h-full">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Step {step.step}
                  </p>
                  <h3 className="mt-2 font-semibold text-neutral-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{step.body}</p>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="border-b border-neutral-200 bg-neutral-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-8 sm:p-10 lg:grid lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                In-house draws
              </p>
              <h2 className="mt-2 text-xl font-semibold text-neutral-900 sm:text-2xl">
                {LAB_IN_HOUSE_HIGHLIGHT.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">{LAB_IN_HOUSE_HIGHLIGHT.body}</p>
              <p className="mt-4 text-xs text-neutral-400">
                {SITE.address.streetAddress} · {SITE.address.addressLocality},{" "}
                {SITE.address.addressRegion}
              </p>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-neutral-600 lg:mt-0">
              {LAB_IN_HOUSE_HIGHLIGHT.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3 lg:col-span-2">
              <Link
                href={BOOKING_URL}
                className="inline-flex rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Book in-house draw
              </Link>
              <Link
                href={labRequestUrl({ panel: "peak-performance", draw: "in-office" })}
                className="inline-flex rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Peak Performance · $199
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section id="draw-locations" className="scroll-mt-28 border-b border-neutral-200 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <FadeUp>
            <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">Draw locations</h2>
            <p className="mt-2 max-w-lg text-sm text-neutral-500">
              We default to in-house at Hello Gorgeous when you are local.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {LAB_DRAW_OPTIONS.map((opt, i) => (
              <FadeUp key={opt.id} delayMs={i * 40}>
                <div
                  className={`h-full rounded-xl border p-6 ${
                    opt.badge === "RECOMMENDED"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  {opt.badge ? (
                    <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                      {opt.badge === "RECOMMENDED" ? "Recommended" : "Nationwide"}
                    </p>
                  ) : null}
                  <h3 className="mt-1 font-semibold text-neutral-900">{opt.shortLabel}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">{opt.description}</p>
                  <p className="mt-3 text-xs text-neutral-400">{opt.stepDetail}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section id="laboratory" className="scroll-mt-28 border-b border-neutral-200 bg-neutral-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <FadeUp className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Processing laboratory
            </p>
            <h2 className="mt-2 text-xl font-semibold text-neutral-900 sm:text-2xl">
              {LAB_ACCESS_MEDICAL_PARTNER.name}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              {LAB_ACCESS_MEDICAL_PARTNER.description}{" "}
              <a
                href={LAB_ACCESS_MEDICAL_PARTNER.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neutral-900 underline underline-offset-2"
              >
                View hormone panels
              </a>
            </p>
          </FadeUp>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {LAB_ACCESS_MEDICAL_PARTNER.bullets.map((b) => (
              <li key={b} className="text-sm text-neutral-600">
                {b}
              </li>
            ))}
          </ul>
          <FadeUp delayMs={60} className="mt-10">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Saliva panels (after NP approval)
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ACCESS_MEDICAL_PANELS.filter((p) => p.specimen === "saliva").map((panel) => (
                <div
                  key={panel.code}
                  className="rounded-xl border border-neutral-200 bg-white p-4"
                >
                  <p className="text-[11px] font-medium text-neutral-400">AML {panel.code}</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">{panel.shortName}</p>
                  <p className="mt-2 text-xs text-neutral-500">{panel.markers.slice(0, 3).join(" · ")}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section id="panels" className="scroll-mt-28 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <FadeUp className="mb-10">
            <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">Lab panels</h2>
            <p className="mt-2 max-w-lg text-sm text-neutral-500">
              Fixed cash-pay pricing · NP review included · In-house or Quest/LabCorp draw
            </p>
          </FadeUp>
          <div className="grid gap-4 sm:grid-cols-2">
            {LAB_PANELS.map((panel, i) => (
              <FadeUp key={panel.id} delayMs={i * 30}>
                <PanelCard panel={panel} />
              </FadeUp>
            ))}
          </div>
          <p className="mt-10 text-sm text-neutral-500">
            Full biomarker breakdown —{" "}
            <Link href={BLOOD_WORK_PATH} className="font-medium text-neutral-900 underline underline-offset-2">
              read our lab guide
            </Link>
            .
          </p>
        </div>
      </Section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-14">
        <div className="mx-auto max-w-xl px-4 text-center">
          <FadeUp>
            <h2 className="text-xl font-semibold text-neutral-900">Ready to order?</h2>
            <p className="mt-3 text-sm text-neutral-500">
              Checkout online, then draw in-house or at a Quest/LabCorp near you.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={labRequestUrl({ panel: "peak-performance", draw: "in-office" })}
                className="inline-flex justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Start with Peak Performance · $199
              </Link>
              <Link
                href={BOOKING_URL}
                className="inline-flex justify-center rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:bg-white"
              >
                Book in-house draw
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
