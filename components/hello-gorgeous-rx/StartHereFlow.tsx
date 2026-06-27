"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PeptidePickerThumbnail } from "@/components/peptides/PeptidePickerThumbnail";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
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

const BRAND = {
  pink: "#E6007E",
  hot: "#FF2D8E",
  rose: "#FFF0F7",
  tint: "#FFB8DC",
  dark: "#0a0a0a",
};

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
      return "Refills are for established Hello Gorgeous RX™ patients. Choose “New peptide protocol” to get started, or call us if you need help matching your chart.";
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
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.hot}22 0%, transparent 50%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      {/* Hero */}
      <Section className="relative border-b-4 border-black !py-12 md:!py-16">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_#E6007E44_0%,transparent_50%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

        <FadeUp className="relative z-10 max-w-3xl mx-auto text-center px-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FFB8DC] mb-5">
            <span className="h-2 w-2 rounded-full bg-[#E6007E] animate-pulse" />
            {HELLO_GORGEOUS_RX.name}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Start{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              Here
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/85 font-medium max-w-2xl mx-auto leading-relaxed">
            Pick the peptide you&apos;re curious about, answer a few quick questions, and we&apos;ll walk you
            through the path to your protocol — including easy refills for ongoing care.
          </p>
          <p className="mt-3 text-sm text-[#FFB8DC]/90">{HELLO_GORGEOUS_RX.tagline}</p>
        </FadeUp>
      </Section>

      {/* Progress */}
      <div className="sticky top-0 z-20 border-b-2 border-black bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3 flex gap-2">
          {RX_START_HERE_STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 text-center">
              <div
                className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black text-xs font-black ${
                  i <= stepIndex ? "bg-[#E6007E] text-white" : "bg-white text-black/40"
                }`}
              >
                {i + 1}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-wide ${i <= stepIndex ? "text-[#E6007E]" : "text-black/35"}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Section className="!py-10 md:!py-14">
        <div className="max-w-4xl mx-auto">
          {step === "pick" && (
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <h2 className="text-2xl font-black text-black">Which peptide interests you?</h2>
                <p className="mt-2 text-sm text-black/65 leading-relaxed">
                  Tap one to continue. You can add more detail in the secure request form. Not sure?{" "}
                  <Link href="/skin-101/find-your-peptide" className="font-semibold text-[#E6007E] underline">
                    Find your peptide guide
                  </Link>
                  .
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
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

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch pb-2">
                  {visibleGroups.flatMap((g) =>
                    g.items.map((item) => {
                      const thumb = getPeptidePickerThumbnail(item.thumbnailSlug);
                      const active = selectedId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={`flex flex-col h-full text-left rounded-2xl border-4 overflow-hidden transition ${
                            active
                              ? "border-[#E6007E] shadow-[6px_6px_0_0_rgba(230,0,126,0.35)]"
                              : "border-black hover:border-[#E6007E]/60"
                          }`}
                        >
                          {thumb ? (
                            <PeptidePickerThumbnail src={thumb.src} alt={thumb.alt} />
                          ) : (
                            <div className="aspect-video border-b-4 border-black bg-[#FFF0F7] flex items-center justify-center text-3xl shrink-0">
                              🧬
                            </div>
                          )}
                          <div className="p-3 bg-white flex-1 min-h-[4.25rem]">
                            <p className="font-black text-black leading-tight">{item.name}</p>
                            <p className="text-xs text-black/60 mt-1 leading-snug">{item.benefit}</p>
                            {(() => {
                              const usd = getPeptideRetailMonthlyUsd(item.id);
                              return usd ? (
                                <p className="text-[10px] font-bold text-[#E6007E] mt-1">
                                  {formatFromMonthly(usd)}
                                </p>
                              ) : null;
                            })()}
                          </div>
                        </button>
                      );
                    }),
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    disabled={!selectedId}
                    onClick={() => setStep("verify")}
                    className="rounded-xl bg-[#E6007E] px-8 py-3.5 font-bold text-white hover:bg-black transition disabled:opacity-40"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </FadeUp>
          )}

          {step === "verify" && selectedItem && (
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-black/10">
                  <span className="rounded-xl bg-[#FFF0F7] border-2 border-[#E6007E] px-3 py-1 text-sm font-bold text-[#E6007E]">
                    {selectedItem.name}
                  </span>
                  <span className="text-sm text-black/55">Quick verification — under 1 minute</span>
                </div>

                <div className="space-y-6">
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
                      <div className="mt-6 rounded-xl border-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        {block}{" "}
                        <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="font-bold underline">
                          {SITE.phone}
                        </a>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="mt-8 flex items-center justify-between gap-3">
                  <button type="button" onClick={() => setStep("pick")} className="text-sm font-semibold text-black/55">
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!validateVerify()) return;
                      if (blockedOnVerify()) return;
                      setStep("path");
                    }}
                    className="rounded-xl bg-[#E6007E] px-8 py-3.5 font-bold text-white hover:bg-black transition"
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
                <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  <h2 className="text-2xl font-black text-black">
                    Your path with{" "}
                    <span className="text-[#E6007E]">{selectedItem.name}</span>
                  </h2>
                  <p className="mt-2 text-sm text-black/65">
                    {requestType === "refill"
                      ? "Refill requests still require a telehealth visit with our NP — most patients complete this virtually."
                      : `New protocols: complete your screening form, pre-pay the $${PEPTIDE_CONSULT_FEE_USD} consult via Square (like our Vitamin Bar), then book telehealth on Fresha.`}
                  </p>

                  <ol className="mt-8 space-y-4">
                    {RX_RECURRING_JOURNEY.filter((j) => requestType === "refill" ? j.id !== "consult" : true).map(
                      (j, i) => (
                        <li key={j.id} className="flex gap-4">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#FFF0F7] text-lg">
                            {j.icon}
                          </span>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">
                              Step {i + 1}
                            </p>
                            <p className="font-bold text-black">{j.title}</p>
                            <p className="text-sm text-black/65 mt-0.5">{j.detail}</p>
                          </div>
                        </li>
                      ),
                    )}
                  </ol>

                  <p className="mt-6 text-xs text-black/50 leading-relaxed rounded-xl bg-[#FFF0F7] px-4 py-3 border border-[#E6007E]/20">
                    {PEPTIDE_REQUEST_DISCLAIMER}
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={continueToIntake}
                      className="flex-1 rounded-xl bg-[#E6007E] px-8 py-4 font-bold text-white hover:bg-black transition text-center"
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

                <div className="rounded-3xl border-4 border-black bg-gradient-to-r from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] p-6 text-white text-center shadow-[8px_8px_0_0_rgba(0,0,0,0.15)]">
                  <p className="text-sm font-bold uppercase tracking-widest text-[#FFB8DC]">Save your progress</p>
                  <p className="mt-2 text-lg font-semibold">
                    Add the Hello Gorgeous app to track requests &amp; refills
                  </p>
                  <CTA href="/app?rx=1" variant="outline" className="mt-4 border-2 border-white text-white hover:bg-white hover:text-[#E6007E]">
                    Open Hello Gorgeous RX in the app
                  </CTA>
                </div>

                <div className="flex justify-start">
                  <button type="button" onClick={() => setStep("verify")} className="text-sm font-semibold text-black/55">
                    ← Back to quick check
                  </button>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </Section>
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
      className={`rounded-full border-2 px-3 py-1 text-xs font-bold transition ${
        active ? "border-[#E6007E] bg-[#E6007E] text-white" : "border-black/15 bg-white text-black/60 hover:border-[#E6007E]"
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
      <p className="text-sm font-semibold text-black">
        {label} <span className="text-red-500">*</span>
      </p>
      <div className="mt-2 space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-start gap-2.5 text-sm cursor-pointer">
            <input
              type="radio"
              name={label}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="mt-0.5 accent-[#E6007E]"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}