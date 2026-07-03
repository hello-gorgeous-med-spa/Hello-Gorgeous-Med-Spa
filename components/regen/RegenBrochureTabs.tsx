"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  REGEN_BROCHURE_DOWNLOAD_NAME,
  REGEN_BROCHURE_PRINT_PATH,
  REGEN_BROCHURE_PRINT_PDF_PATH,
  REGEN_BROCHURE_THUMBNAIL,
} from "@/lib/regen-brochure";
import {
  REGEN_BROCHURE_PRICE_TIERS,
  REGEN_BROCHURE_PRICING_DISCLAIMER,
  REGEN_BROCHURE_PRICING_SECTIONS,
} from "@/lib/regen-brochure-pricing";
import { REGEN_BRAND } from "@/lib/regen-brand";

type TabId = "brochure" | "pricing";

const TABS: { id: TabId; label: string }[] = [
  { id: "brochure", label: "Brochure" },
  { id: "pricing", label: "Pricing" },
];

export function RegenBrochureTabs() {
  const [tab, setTab] = useState<TabId>("brochure");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "pricing") setTab("pricing");
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(230,0,126,0.12), transparent), linear-gradient(180deg, #FFF0F7 0%, #fff 45%, #f9fafb 100%)",
        }}
      />

      <Section className="border-b-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#2d1020] to-black py-14 md:py-16">
        <FadeUp className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">
            {REGEN_BRAND.fullName}
          </p>
          <h1 className="font-black text-3xl text-white md:text-4xl">
            Patient{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              brochure &amp; pricing
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
            Download the RE GEN handout or browse transparent pricing — NP-directed care from Hello
            Gorgeous Med Spa, Oswego IL.
          </p>
        </FadeUp>
      </Section>

      <Section className="border-b-2 border-black/10 bg-white/80 py-4 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-2xl justify-center gap-2 px-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[3px_3px_0_0_rgba(230,0,126,0.35)]"
                  : "rounded-full border-2 border-black/15 bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-black/70 hover:border-[#E6007E] hover:text-[#E6007E]"
              }
              aria-selected={tab === t.id}
              role="tab"
            >
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      {tab === "brochure" ? (
        <Section className="py-12 md:py-16" role="tabpanel">
          <FadeUp className="mx-auto max-w-lg px-4">
            <Link
              href={REGEN_BROCHURE_PRINT_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition-transform hover:-translate-y-0.5"
            >
              <div className="relative aspect-[3/4] w-full bg-black">
                <Image
                  src={REGEN_BROCHURE_THUMBNAIL}
                  alt="RE GEN brochure preview"
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
              </div>
              <div className="border-t-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-4 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-white">
                  Tap to view full brochure →
                </p>
              </div>
            </Link>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={REGEN_BROCHURE_PRINT_PATH}
                download={REGEN_BROCHURE_DOWNLOAD_NAME}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md border-2 border-black bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-[#FFF0F7]"
              >
                ↓ Download brochure
              </a>
              <a
                href={REGEN_BROCHURE_PRINT_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md border-2 border-[#E6007E] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#E6007E] transition hover:bg-[#FFF0F7]"
              >
                Save as PDF (print)
              </a>
              <CTA href={REGEN_BROCHURE_PRINT_PATH} variant="gradient">
                Open in browser
              </CTA>
              <CTA href="/rx" variant="outline">
                Start intake
              </CTA>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-black/50">
              <strong>Download:</strong> saves the brochure file to your device.
              <br />
              <strong>Save as PDF:</strong> opens print view — choose &quot;Save as PDF&quot; on
              iPhone, Android, or desktop.
              <br />
              Print double-sided 8.5×11, flip on long edge.
            </p>
          </FadeUp>
        </Section>
      ) : (
        <Section className="py-10 md:py-14" role="tabpanel">
          <FadeUp className="mx-auto max-w-3xl px-4">
            <p className="mb-8 text-center text-sm text-black/65">
              Peptide prices = typical monthly protocol (5 mL vial, ~4 weeks). NAD+ $150 = 10-week
              supply. Final plan confirmed at consult.
            </p>

            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              {REGEN_BROCHURE_PRICE_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className="rounded-2xl border-4 border-black bg-white p-5 text-center shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                >
                  <p className="font-black text-3xl text-[#E6007E]">
                    {tier.amount}
                    {"suffix" in tier && tier.suffix ? (
                      <span className="text-base font-bold">{tier.suffix}</span>
                    ) : null}
                  </p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-wide text-black">
                    {tier.label}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-black/60">{tier.sub}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {REGEN_BROCHURE_PRICING_SECTIONS.map((section) => (
                <div
                  key={section.id}
                  className="overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                >
                  <div className="border-b-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-4 py-3">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-white">
                      {section.title}
                    </h2>
                    {section.hook ? (
                      <p className="mt-1 text-xs text-white/85">{section.hook}</p>
                    ) : null}
                  </div>
                  <ul className="divide-y divide-black/5">
                    {section.rows.map((row) => (
                      <li
                        key={`${section.id}-${row.name}`}
                        className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-semibold text-black">{row.name}</p>
                          {row.detail ? (
                            <p className="text-xs text-black/55">{row.detail}</p>
                          ) : null}
                        </div>
                        <p className="shrink-0 font-bold text-[#E6007E]">{row.price}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-xs leading-relaxed text-black/50">
              {REGEN_BROCHURE_PRICING_DISCLAIMER}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <CTA href="/rx" variant="gradient">
                Start intake
              </CTA>
              <button
                type="button"
                onClick={() => setTab("brochure")}
                className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-[#E6007E] px-10 py-4 text-sm font-semibold uppercase tracking-widest text-[#E6007E] transition hover:bg-[#FFF0F7]"
              >
                Download brochure
              </button>
            </div>
          </FadeUp>
        </Section>
      )}
    </>
  );
}
