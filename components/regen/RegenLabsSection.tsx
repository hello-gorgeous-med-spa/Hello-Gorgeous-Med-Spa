"use client";

import Link from "next/link";

import {
  REGEN_LAB_CATEGORIES,
  REGEN_LAB_PANELS,
  REGEN_LAB_STATS,
  REGEN_SITE,
} from "@/lib/regen-site";

/* ─────────────────────────────────────────────────────────────
   LAB PANEL CARD
───────────────────────────────────────────────────────────── */

function LabPanelCard({
  panel,
}: {
  panel: (typeof REGEN_LAB_PANELS)[number];
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-6 transition ${
        panel.popular
          ? "border-[#E6007E] shadow-lg ring-2 ring-[#E6007E]/20"
          : "border-neutral-200 hover:shadow-md"
      }`}
    >
      {panel.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E6007E] px-4 py-1 text-xs font-semibold text-white shadow-md">
          ★ Most popular
        </span>
      )}

      <h3 className="text-lg font-semibold text-neutral-900">{panel.name}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold text-neutral-900">{panel.price}</span>
        <span className="ml-1 text-sm text-neutral-500">{panel.unit}</span>
      </div>
      <p className="mt-3 text-sm text-neutral-600">{panel.description}</p>

      <ul className="mt-5 flex-1 space-y-2">
        {panel.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
            <span className="mt-0.5 text-[#E6007E]">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/rx/start?goal=labs"
        className={`mt-6 block rounded-lg py-3 text-center text-sm font-semibold transition ${
          panel.popular
            ? "bg-[#E6007E] text-white hover:bg-[#FF2D8E]"
            : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
        }`}
      >
        Get started
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LABS BANNER
───────────────────────────────────────────────────────────── */

export function LabsBanner() {
  return (
    <section className="bg-gradient-to-br from-neutral-900 to-neutral-800 py-10 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h2 className="text-xl font-semibold">
              RE GEN Labs — test for signals of 1,000+ health conditions
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Comprehensive blood panels drawn through{" "}
              <strong className="text-white">Access Medical Labs</strong>, with results and a
              personalized plan delivered through{" "}
              <strong className="text-white">Fullscript</strong>.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/rx/start?goal=labs"
              className="rounded-lg bg-[#E6007E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#FF2D8E]"
            >
              Get started
            </Link>
            <Link
              href="/labs"
              className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              See panels
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAB PANELS SECTION
───────────────────────────────────────────────────────────── */

export function LabPanelsSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Lab panels
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Choose your panel
        </h2>
        <p className="mt-3 text-neutral-600">
          One simple draw. Provider-reviewed results. A plan built around your numbers.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REGEN_LAB_PANELS.map((panel) => (
            <LabPanelCard key={panel.id} panel={panel} />
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Representative pricing — your exact panel and price are confirmed at your consult. Draw
          fee may apply at out-of-clinic Access Medical Labs locations.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   WHAT WE TEST SECTION
───────────────────────────────────────────────────────────── */

export function WhatWeTestSection() {
  return (
    <section className="border-y border-neutral-100 bg-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          What we test
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Insight across every major system
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REGEN_LAB_CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <h4 className="font-semibold text-neutral-900">{cat.title}</h4>
              <p className="mt-2 text-sm text-neutral-600">{cat.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {REGEN_LAB_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-[#E6007E]">{stat.value}</div>
              <div className="mt-1 text-sm text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAB PARTNERS
───────────────────────────────────────────────────────────── */

export function LabPartnersSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Our lab partners
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Trusted infrastructure, end to end
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Access Medical Labs */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="text-lg font-semibold text-neutral-900">Access Medical Labs</h3>
            <p className="text-sm text-neutral-500">Blood draws & analysis</p>
            <p className="mt-4 text-sm text-neutral-600">
              A CLIA-certified national laboratory with fully automated Siemens Aptio® technology.
              Get drawn at our Oswego clinic or a nearby patient service center.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                Next-day results
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                50% less blood per draw
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                CLIA-certified
              </span>
            </div>
          </div>

          {/* Fullscript */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="text-lg font-semibold text-neutral-900">Fullscript</h3>
            <p className="text-sm text-neutral-500">Results, plans & fulfillment</p>
            <p className="mt-4 text-sm text-neutral-600">
              Your secure portal for results, your provider's recommendations, and any
              professional-grade supplements or prescriptions — delivered to your door.
            </p>
            <Link
              href="https://us.fullscript.com/welcome/hellogorgeousmedspa"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#E6007E] hover:underline"
            >
              Visit your Fullscript portal
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOW LABS WORK
───────────────────────────────────────────────────────────── */

export function LabsHowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Choose a panel or consult",
      description:
        "Pick a panel above or let a provider recommend the right testing for your goals.",
    },
    {
      number: 2,
      title: "Get your draw",
      description:
        "Visit our Oswego clinic or a nearby Access Medical Labs location — the order is sent ahead.",
    },
    {
      number: 3,
      title: "Review results & plan",
      description:
        "Your provider interprets your results and builds a personalized plan, delivered through Fullscript.",
    },
  ];

  return (
    <section className="border-y border-neutral-100 bg-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          How it works
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          From draw to plan
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6007E] text-lg font-bold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   LABS CTA
───────────────────────────────────────────────────────────── */

export function LabsCtaSection() {
  return (
    <section className="bg-gradient-to-br from-[#E6007E] to-[#9b0a4d] py-16 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">Get ahead of your health</h2>
        <p className="mt-4 text-white/80">
          Start the free intake and a provider will set up the right panel for you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/rx/start?goal=labs"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#E6007E] shadow-lg transition hover:bg-neutral-100"
          >
            Get started
          </Link>
          <Link
            href={`tel:+16306366193`}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Call {REGEN_SITE.phone}
          </Link>
        </div>
      </div>
    </section>
  );
}
