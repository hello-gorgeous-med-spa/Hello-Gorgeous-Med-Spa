"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PeptidePickerThumbnail } from "@/components/peptides/PeptidePickerThumbnail";
import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { HELLO_GORGEOUS_RX_START_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import {
  HELLO_GORGEOUS_RX,
  RX_RECURRING_JOURNEY,
  RX_START_HERE_STEPS,
} from "@/lib/hello-gorgeous-rx";
import { saveRxStartPrefill } from "@/lib/peptide-rx-prefill";
import { formatFromMonthly, getPeptideRetailMonthlyUsd } from "@/lib/peptide-retail-pricing";
import {
  PEPTIDE_CATEGORY_FILTER_LABEL,
  PEPTIDE_CONSULT_FEE_USD,
  PEPTIDE_REQUEST_DISCLAIMER,
  PEPTIDE_REQUEST_ITEMS,
  peptideRequestItemsByCategory,
  type PeptideRequestCategory,
} from "@/lib/peptide-request-menu";
import { getPeptidePickerThumbnail } from "@/lib/peptide-thumbnails";
import { SITE } from "@/lib/seo";

type WizardStep = (typeof RX_START_HERE_STEPS)[number]["id"];

export function StartHereFlow({ initialPeptideId }: { initialPeptideId?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("pick");
  const [selectedId, setSelectedId] = useState<string | null>(initialPeptideId ?? null);
  const [categoryFilter, setCategoryFilter] = useState<PeptideRequestCategory | "all">("all");
  const [requestType, setRequestType] = useState<"new" | "refill">("new");
  const [pregnant, setPregnant] = useState<string>("");
  const [existingPatient, setExistingPatient] = useState<string>("");
  const [lastVisit, setLastVisit] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedItem = useMemo(
    () => PEPTIDE_REQUEST_ITEMS.find((p) => p.id === selectedId),
    [selectedId],
  );

  const grouped = peptideRequestItemsByCategory();
  const visibleGroups =
    categoryFilter === "all"
      ? grouped
      : grouped.filter((g) => g.category === categoryFilter);

  const stepIndex = RX_START_HERE_STEPS.findIndex((s) => s.id === step);

  function validateVerify(): boolean {
    const next: Record<string, string> = {};
    if (!pregnant) next.pregnant = "Required";
    if (requestType === "refill") {
      if (!existingPatient) next.existing_patient = "Required";
      if (!lastVisit) next.last_visit = "Required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function blockedOnVerify(): string | null {
    if (pregnant === "Yes") {
      return "Peptide therapy is not appropriate during pregnancy, while trying to conceive, or while breastfeeding. Please call us to discuss alternatives.";
    }
    if (requestType === "refill" && existingPatient === "No") {
      return "Refills are for established Hello Gorgeous RX™ patients. Choose "New peptide protocol" to get started, or call us if you need help matching your chart.";
    }
    return null;
  }

  function continueToIntake() {
    if (!selectedItem) return;
    saveRxStartPrefill({
      peptideId: selectedItem.id,
      peptideName: selectedItem.name,
      requestType,
      pregnant: pregnant || undefined,
      existingPatient: existingPatient || undefined,
      lastVisitWithin12mo: lastVisit || undefined,
    });
    router.push(`${PEPTIDE_REQUEST_PATH}?from=start-here`);
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      {/* Top utility bar */}
      <div className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
          <span className="hidden items-center gap-2 sm:inline-flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
            US-based licensed pharmacies
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
            NP-supervised protocols
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <Link href="/rx" className="flex items-center gap-3">
            <Image
              src="/regen-site/assets/regen-logo-white.png"
              alt="RE GEN by Hello Gorgeous Med Spa"
              width={140}
              height={46}
              className="h-11 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/peptides" className="hidden text-sm font-medium text-white/70 hover:text-[#FF2D8E] md:inline">
              Peptide hub
            </Link>
            <Link href="/app?rx=1" className="hidden text-sm font-semibold text-[#FF2D8E] hover:underline md:inline">
              Open in app
            </Link>
            <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="text-sm font-semibold text-white/70 hover:text-[#FF2D8E]">
              {SITE.phone}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a12] to-[#2d1020]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_#E6007E33_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,_#FF2D8E22_0%,transparent_50%)]" />

        <div className="relative mx-auto max-w-4xl px-6 py-12 text-center md:py-16">
          <FadeUp>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FF2D8E] backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF2D8E]" />
              {HELLO_GORGEOUS_RX.name}
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">
              Start{" "}
              <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                Here
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
              Pick the peptide you&apos;re curious about, answer a few quick questions, and we&apos;ll walk you
              through the path to your protocol — including easy refills for ongoing care.
            </p>
            <p className="mt-3 text-sm text-[#FF2D8E]">{HELLO_GORGEOUS_RX.tagline}</p>
          </FadeUp>
        </div>
      </section>

      {/* Progress */}
      <div className="sticky top-[60px] z-30 border-b border-white/10 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl gap-2 px-6 py-4">
          {RX_START_HERE_STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 text-center">
              <div
                className={`mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black transition ${
                  i <= stepIndex
                    ? "bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white shadow-[0_0_20px_rgba(255,45,142,0.4)]"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {i + 1}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-wide ${i <= stepIndex ? "text-[#FF2D8E]" : "text-white/30"}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          {step === "pick" && (
            <FadeUp>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
                <h2 className="text-2xl font-black">Which peptide interests you?</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Tap one to continue. You can add more detail in the secure request form. Not sure?{" "}
                  <Link href="/skin-101/find-your-peptide" className="font-semibold text-[#FF2D8E] underline">
                    Find your peptide guide
                  </Link>
                  .
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <FilterChip active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")} label="All" />
                  {grouped.map((g) => (
                    <FilterChip
                      key={g.category}
                      active={categoryFilter === g.category}
                      onClick={() => setCategoryFilter(g.category)}
                      label={PEPTIDE_CATEGORY_FILTER_LABEL[g.category]}
                    />
                  ))}
                </div>

                <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleGroups.flatMap((g) =>
                    g.items.map((item) => {
                      const thumb = getPeptidePickerThumbnail(item.thumbnailSlug);
                      const active = selectedId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={`flex h-full flex-col overflow-hidden rounded-2xl border-2 text-left transition ${
                            active
                              ? "border-[#FF2D8E] bg-white/10 shadow-[0_0_30px_rgba(255,45,142,0.2)]"
                              : "border-white/10 bg-white/5 hover:border-[#FF2D8E]/50 hover:bg-white/10"
                          }`}
                        >
                          {thumb ? (
                            <PeptidePickerThumbnail src={thumb.src} alt={thumb.alt} />
                          ) : (
                            <div className="flex aspect-video shrink-0 items-center justify-center bg-gradient-to-br from-[#1a0a12] to-[#2d1020] text-3xl">
                              🧬
                            </div>
                          )}
                          <div className="flex min-h-[5rem] flex-1 flex-col p-4">
                            <p className="font-bold leading-tight">{item.name}</p>
                            <p className="mt-1 text-xs leading-snug text-white/50">{item.benefit}</p>
                            {(() => {
                              const usd = getPeptideRetailMonthlyUsd(item.id);
                              return usd ? (
                                <div className="mt-2 space-y-0.5">
                                  <p className="text-sm font-bold text-[#FF2D8E]">
                                    {formatFromMonthly(usd)}
                                  </p>
                                  <p className="text-[10px] text-white/40">
                                    ${PEPTIDE_CONSULT_FEE_USD} consult to start · med after NP approval
                                  </p>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        </button>
                      );
                    }),
                  )}
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    type="button"
                    disabled={!selectedId}
                    onClick={() => setStep("verify")}
                    className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-4 font-bold text-white shadow-[0_8px_30px_rgba(255,45,142,0.4)] transition hover:shadow-[0_12px_40px_rgba(255,45,142,0.5)] disabled:opacity-40 disabled:shadow-none"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </FadeUp>
          )}

          {step === "verify" && selectedItem && (
            <FadeUp>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
                <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-white/10 pb-6">
                  <span className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-4 py-1.5 text-sm font-bold">
                    {selectedItem.name}
                  </span>
                  <span className="text-sm text-white/50">Quick verification — under 1 minute</span>
                </div>

                <div className="space-y-8">
                  <RadioGroup
                    label="What are you looking for?"
                    value={requestType}
                    onChange={(v) => setRequestType(v as "new" | "refill")}
                    options={[
                      { value: "new", label: "New peptide protocol — I want to get started" },
                      { value: "refill", label: "Refill — I'm already on Hello Gorgeous RX™ peptides" },
                    ]}
                  />

                  {requestType === "refill" && (
                    <>
                      <RadioGroup
                        label="Are you an existing Hello Gorgeous RX™ peptide patient?"
                        value={existingPatient}
                        onChange={setExistingPatient}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        error={errors.existing_patient}
                      />
                      <RadioGroup
                        label="Visit with us in the last 12 months?"
                        value={lastVisit}
                        onChange={setLastVisit}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No — need a telehealth check-in" },
                        ]}
                        error={errors.last_visit}
                      />
                    </>
                  )}

                  <RadioGroup
                    label="Are you pregnant, trying to conceive, or breastfeeding?"
                    value={pregnant}
                    onChange={setPregnant}
                    options={[
                      { value: "No", label: "No" },
                      { value: "N/A", label: "N/A" },
                      { value: "Yes", label: "Yes" },
                    ]}
                    error={errors.pregnant}
                  />
                </div>

                {(() => {
                  const block = blockedOnVerify();
                  if (block) {
                    return (
                      <div className="mt-8 rounded-xl border border-amber-500/50 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
                        {block}{" "}
                        <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="font-bold underline">
                          {SITE.phone}
                        </a>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="mt-10 flex items-center justify-between gap-3">
                  <button type="button" onClick={() => setStep("pick")} className="text-sm font-semibold text-white/50 hover:text-white">
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!validateVerify()) return;
                      if (blockedOnVerify()) return;
                      setStep("path");
                    }}
                    className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-4 font-bold text-white shadow-[0_8px_30px_rgba(255,45,142,0.4)] transition hover:shadow-[0_12px_40px_rgba(255,45,142,0.5)]"
                  >
                    See my RX path →
                  </button>
                </div>
              </div>
            </FadeUp>
          )}

          {step === "path" && selectedItem && (
            <FadeUp>
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
                  <h2 className="text-2xl font-black">
                    Your path with{" "}
                    <span className="text-[#FF2D8E]">{selectedItem.name}</span>
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    {requestType === "refill"
                      ? "Refill requests still require a telehealth visit with our NP — most patients complete this virtually."
                      : `New protocols: complete your screening form, pre-pay the $${PEPTIDE_CONSULT_FEE_USD} consult via Square (like our Vitamin Bar), then book telehealth on Fresha.`}
                  </p>

                  <ol className="mt-10 space-y-6">
                    {RX_RECURRING_JOURNEY.filter((j) => requestType === "refill" ? j.id !== "consult" : true).map(
                      (j, i) => (
                        <li key={j.id} className="flex gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF2D8E]/20 to-[#E6007E]/20 text-xl">
                            {j.icon}
                          </span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#FF2D8E]">
                              Step {i + 1}
                            </p>
                            <p className="mt-1 font-bold">{j.title}</p>
                            <p className="mt-1 text-sm text-white/60">{j.detail}</p>
                          </div>
                        </li>
                      ),
                    )}
                  </ol>

                  <p className="mt-8 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-xs leading-relaxed text-white/40">
                    {PEPTIDE_REQUEST_DISCLAIMER}
                  </p>

                  <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={continueToIntake}
                      className="flex-1 rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-4 text-center font-bold text-white shadow-[0_8px_30px_rgba(255,45,142,0.4)] transition hover:shadow-[0_12px_40px_rgba(255,45,142,0.5)]"
                    >
                      Continue to secure request →
                    </button>
                    <Link
                      href={`${HELLO_GORGEOUS_RX_START_PATH}?peptide=${selectedItem.id}`}
                      className="hidden"
                      aria-hidden
                    >
                      refresh
                    </Link>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] p-8 text-center shadow-[0_20px_60px_rgba(255,45,142,0.2)]">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">Save your progress</p>
                  <p className="mt-2 text-xl font-bold">
                    Add the Hello Gorgeous app to track requests &amp; refills
                  </p>
                  <CTA href="/app?rx=1" variant="outline" className="mt-6 !border-white !text-white hover:!bg-white hover:!text-black">
                    Open Hello Gorgeous RX in the app
                  </CTA>
                </div>

                <div className="flex justify-start">
                  <button type="button" onClick={() => setStep("verify")} className="text-sm font-semibold text-white/50 hover:text-white">
                    ← Back to quick check
                  </button>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-6 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <Image
            src="/regen-site/assets/regen-logo-white.png"
            alt="RE GEN"
            width={120}
            height={40}
            className="mx-auto h-10 w-auto opacity-60"
          />
          <p className="mt-4 text-xs text-white/40">
            Hello Gorgeous RX™ · NP-supervised telehealth · {SITE.address.streetAddress},{" "}
            {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}
          </p>
        </div>
      </footer>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold transition ${
        active
          ? "border-[#FF2D8E] bg-[#FF2D8E] text-white"
          : "border-white/20 bg-transparent text-white/60 hover:border-[#FF2D8E] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">
        {label} <span className="text-[#FF2D8E]">*</span>
      </p>
      <div className="mt-3 space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm transition ${
              value === opt.value
                ? "border-[#FF2D8E] bg-[#FF2D8E]/10"
                : "border-white/10 bg-white/5 hover:border-white/30"
            }`}
          >
            <input
              type="radio"
              name={label}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                value === opt.value ? "border-[#FF2D8E] bg-[#FF2D8E]" : "border-white/30"
              }`}
            >
              {value === opt.value && (
                <span className="h-2 w-2 rounded-full bg-white" />
              )}
            </span>
            {opt.label}
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
