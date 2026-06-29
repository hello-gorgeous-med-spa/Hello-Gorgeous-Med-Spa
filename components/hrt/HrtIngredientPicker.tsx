"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FadeUp } from "@/components/Section";
import {
  HRT_BOOKING_CTA,
  HRT_FORMULATION_PRICING_FORMULA,
  HRT_INGREDIENTS,
  HRT_LEARN_LINKS,
  HRT_SYMPTOM_LINKS,
  hrtFormFlags,
  hrtFormProductLabel,
  hrtFormulationOrderLine,
  hrtIngredientById,
  hrtIngredientFromMonthlyUsd,
  hrtIngredientsForAudience,
  hrtStartRequestCta,
  type HrtAudience,
  type HrtFormId,
  type HrtIngredient,
  type HrtIngredientForm,
} from "@/lib/hrt-formulation-catalog";
import { hrtBannerAltForIngredient, hrtBannerImageForIngredient, hrtBannerImageObjectClass } from "@/lib/hrt-banner-images";
import {
  HRT_MENS_PROGRAM_DISCLAIMER,
  hrtIngredientUsesMensProgramPricing,
  hrtMensProgramFormPrice,
  hrtMensProgramSkuNote,
} from "@/lib/hrt-mens-program-pricing";
import { HRT_PAYMENT_FIRST_COPY, HRT_PRICING_DISCLAIMER, hrtShippingUsd } from "@/lib/hrt-supply-pricing";
import { computeHrtFormSupplyQuote } from "@/lib/hrt-intake";
import { RX_SUPPLY_CYCLES, type RxSupplyCycleId } from "@/lib/rx-supply-cycle";

function RxMark() {
  return (
    <sup className="ml-0.5 align-super text-[9px] font-bold text-[#E6007E]">Rx</sup>
  );
}

function FormCard({
  ingredient,
  form,
  selected,
  supplyCycle,
  onSelect,
}: {
  ingredient: HrtIngredient;
  form: HrtIngredientForm;
  selected: boolean;
  supplyCycle: RxSupplyCycleId;
  onSelect: () => void;
}) {
  const flags = hrtFormFlags(form);
  const programPrice = hrtMensProgramFormPrice(ingredient, form);
  const supplyQuote = programPrice ? null : computeHrtFormSupplyQuote(ingredient.id, form.id, supplyCycle);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-2xl border-2 p-4 text-left transition ${
        selected
          ? "border-[#E6007E] bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
          : "border-black/10 bg-white hover:border-[#E6007E]/30"
      }`}
    >
      <p className="font-semibold text-black">{form.label}</p>
      <p className="mt-1 text-lg font-serif text-[#E6007E]">
        {hrtFormProductLabel(form, ingredient, supplyCycle)}
      </p>
      {programPrice ? (
        <p className="mt-1 text-xs text-black/55">{programPrice.priceNote}</p>
      ) : supplyQuote ? (
        <p className="mt-1 text-xs text-black/55">
          Checkout ${supplyQuote.totalUsd} · + ${hrtShippingUsd()} ship
          {supplyQuote.savingsNote ? ` · ${supplyQuote.savingsNote}` : ""}
        </p>
      ) : null}
      <p className="mt-2 font-mono text-[10px] text-black/45">Formulation SKU {form.formulationSku}</p>
      {flags.length ? (
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-black/45">
          {flags.join(" · ")}
        </p>
      ) : null}
      {form.shipNote ? <p className="mt-1 text-[10px] text-black/45">{form.shipNote}</p> : null}
      <p className="sr-only">
        {programPrice
          ? hrtMensProgramSkuNote(ingredient, form)
          : hrtFormulationOrderLine(ingredient, form)}
      </p>
    </button>
  );
}

export function HrtIngredientPicker() {
  const [audience, setAudience] = useState<HrtAudience>("women");
  const [symptomFilter, setSymptomFilter] = useState<string | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>("progesterone");
  const [selectedFormId, setSelectedFormId] = useState<HrtFormId>("capsule");
  const [supplyCycle, setSupplyCycle] = useState<RxSupplyCycleId>("90-day");

  const ingredients = useMemo(() => hrtIngredientsForAudience(audience), [audience]);

  const filteredIngredients = useMemo(() => {
    if (!symptomFilter) return ingredients;
    const link = HRT_SYMPTOM_LINKS.find((s) => s.id === symptomFilter);
    if (!link) return ingredients;
    return ingredients.filter((item) => link.ingredientIds.includes(item.id));
  }, [ingredients, symptomFilter]);

  const selectedIngredient =
    hrtIngredientById(selectedIngredientId) ??
    filteredIngredients[0] ??
    ingredients[0] ??
    HRT_INGREDIENTS[0]!;

  const activeForm =
    selectedIngredient.forms.find((f) => f.id === selectedFormId) ??
    selectedIngredient.forms[0]!;

  const activeProgramPrice = hrtMensProgramFormPrice(selectedIngredient, activeForm);
  const usesMensProgram = hrtIngredientUsesMensProgramPricing(selectedIngredient);
  const activeSupplyQuote = usesMensProgram
    ? null
    : computeHrtFormSupplyQuote(selectedIngredient.id, activeForm.id, supplyCycle);
  const startCta = usesMensProgram
    ? HRT_BOOKING_CTA
    : hrtStartRequestCta(selectedIngredient.id, activeForm.id, supplyCycle);
  const featuredBanner = hrtBannerImageForIngredient(selectedIngredient.id);

  const pickIngredient = (item: HrtIngredient) => {
    setSelectedIngredientId(item.id);
    setSelectedFormId(item.forms[0]?.id ?? "capsule");
    setSymptomFilter(null);
    if (item.audience !== "both") {
      setAudience(item.audience);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const ingredient = hrtIngredientById(hash);
    if (ingredient) {
      pickIngredient(ingredient);
      return;
    }

    const symptom = HRT_SYMPTOM_LINKS.find((s) => s.id === hash);
    if (symptom) {
      setSymptomFilter(symptom.id);
      const first = HRT_INGREDIENTS.find((item) => symptom.ingredientIds.includes(item.id));
      if (first) pickIngredient(first);
    }
  }, []);

  return (
    <section id="hrt-ingredients" className="scroll-mt-24">
      <FadeUp className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#E6007E]">
          Hello Gorgeous RX™ · Formulation pharmacy
        </p>
        <h2 className="mt-3 font-serif text-3xl text-black sm:text-4xl">
          Pick your <span className="text-[#E6007E]">hormone</span> &amp; form
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-black/60">
          Choose the ingredient and delivery format that fits your plan — capsule, troche, injectable, or
          cream when available. Pick 30-day or 90-day supply (10% off product on 90-day). Strength and dosing are
          set by your provider after labs.
        </p>
      </FadeUp>

      <FadeUp delayMs={60}>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {(
            [
              ["women", "Women's HRT"],
              ["men", "Men's HRT"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setAudience(id);
                setSymptomFilter(null);
                const next = hrtIngredientsForAudience(id)[0];
                if (next) {
                  setSelectedIngredientId(next.id);
                  setSelectedFormId(next.forms[0]?.id ?? "capsule");
                }
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                audience === id
                  ? "bg-black text-white"
                  : "bg-white text-black/55 ring-1 ring-black/10 hover:text-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FadeUp>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <FadeUp delayMs={100}>
          <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.25)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
              Get support for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {HRT_SYMPTOM_LINKS.map((symptom) => (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() =>
                    setSymptomFilter((current) => (current === symptom.id ? null : symptom.id))
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    symptomFilter === symptom.id
                      ? "bg-[#E6007E] text-white"
                      : "bg-[#FFF0F7] text-black/70 ring-1 ring-black/10 hover:ring-[#E6007E]/30"
                  }`}
                >
                  {symptom.label}
                </button>
              ))}
            </div>

            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">Learn</p>
            <ul className="mt-3 space-y-2">
              {HRT_LEARN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-[#E6007E] underline underline-offset-4 hover:no-underline"
                  >
                    {link.label}
                  </Link>
                  <span className="block text-xs text-black/50">{link.blurb}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
              Ingredients
            </p>
            <ul className="mt-3 divide-y divide-black/10">
              {filteredIngredients.map((item) => {
                const active = item.id === selectedIngredient.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      id={item.id}
                      onClick={() => pickIngredient(item)}
                      className={`flex w-full items-start justify-between gap-3 py-3 text-left transition ${
                        active ? "text-[#E6007E]" : "text-black hover:text-[#E6007E]"
                      }`}
                    >
                      <span>
                        <span className="font-semibold">
                          {item.name}
                          <RxMark />
                        </span>
                        <span className="mt-0.5 block text-xs text-black/50">{item.tagline}</span>
                      </span>
                      <span className="shrink-0 text-right text-xs font-bold text-black/45">
                        from ${hrtIngredientFromMonthlyUsd(item)}/mo
                        {hrtIngredientUsesMensProgramPricing(item) ? (
                          <span className="block font-semibold normal-case text-black/35">program</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </FadeUp>

        <FadeUp delayMs={140}>
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-[#FAF7F4]">
            {featuredBanner ? (
              <div className="relative aspect-[16/9] w-full border-b border-black/10 bg-[#0A0C10] sm:aspect-[2/1]">
                <Image
                  src={featuredBanner}
                  alt={hrtBannerAltForIngredient(selectedIngredient.id, selectedIngredient.name)}
                  fill
                  className={`${hrtBannerImageObjectClass(selectedIngredient.id)} p-2 sm:p-3`}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              </div>
            ) : null}
            <div className="p-6 sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
              Featured · {audience === "women" ? "Women's HRT" : "Men's TRT"}
            </p>
            <h3 className="mt-3 font-serif text-2xl text-black sm:text-3xl">
              {selectedIngredient.name}
              <RxMark />
            </h3>
            <p className="mt-2 text-sm text-black/60">{selectedIngredient.tagline}</p>
            <p className="mt-4 text-xs font-medium text-black/50">
              {usesMensProgram
                ? "Gentlemen's Club all-inclusive program pricing — consult, monitoring & medication bundled."
                : `${HRT_FORMULATION_PRICING_FORMULA}. ${HRT_PAYMENT_FIRST_COPY}`}
            </p>

            {!usesMensProgram ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(["90-day", "30-day"] as const).map((cycle) => {
                  const active = supplyCycle === cycle;
                  const quote = computeHrtFormSupplyQuote(
                    selectedIngredient.id,
                    activeForm.id,
                    cycle,
                  );
                  if (!quote) return null;
                  return (
                    <button
                      key={cycle}
                      type="button"
                      onClick={() => setSupplyCycle(cycle)}
                      className={`rounded-2xl border-2 p-3 text-left transition ${
                        active
                          ? "border-[#E6007E] bg-[#FFF0F7]"
                          : "border-black/10 bg-white hover:border-[#E6007E]/30"
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wide text-black/45">
                        {RX_SUPPLY_CYCLES[cycle].shortLabel}
                      </p>
                      <p className="mt-1 font-serif text-lg text-[#E6007E]">${quote.totalUsd}</p>
                      {quote.savingsNote ? (
                        <p className="mt-1 text-[10px] font-semibold text-[#E6007E]">{quote.savingsNote}</p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {selectedIngredient.forms.map((form) => (
                <FormCard
                  key={form.id}
                  ingredient={selectedIngredient}
                  form={form}
                  selected={activeForm.id === form.id}
                  supplyCycle={supplyCycle}
                  onSelect={() => setSelectedFormId(form.id)}
                />
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
                Your selection
              </p>
              <p className="mt-2 font-semibold text-black">
                {selectedIngredient.name} · {activeForm.label}
              </p>
              <p className="mt-1 text-sm text-black/60">
                {activeProgramPrice ? (
                  <>
                    <span className="block text-lg font-serif text-[#E6007E]">
                      {activeProgramPrice.priceLabel}
                    </span>
                    {activeProgramPrice.priceNote}
                  </>
                ) : activeSupplyQuote ? (
                  <>
                    <span className="block text-lg font-serif text-[#E6007E]">
                      ${activeSupplyQuote.totalUsd} checkout
                    </span>
                    {activeSupplyQuote.priceLabel} + ${activeSupplyQuote.shippingUsd} shipping
                    {activeSupplyQuote.savingsNote ? ` · ${activeSupplyQuote.savingsNote}` : ""}
                  </>
                ) : (
                  `${hrtFormProductLabel(activeForm, selectedIngredient, supplyCycle)} + $${hrtShippingUsd()} shipping`
                )}
              </p>
              <p className="mt-2 font-mono text-[11px] text-black/50">
                {activeProgramPrice
                  ? hrtMensProgramSkuNote(selectedIngredient, activeForm)
                  : hrtFormulationOrderLine(selectedIngredient, activeForm, supplyCycle)}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={startCta.href}
                className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#FF2D8E]"
              >
                {startCta.label}
              </Link>
              {selectedIngredient.learnHref ? (
                <Link
                  href={selectedIngredient.learnHref}
                  className="inline-flex items-center justify-center rounded-lg border border-black/15 px-6 py-3 text-sm font-semibold text-black/75 transition hover:border-black/30"
                >
                  Learn more
                </Link>
              ) : null}
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-black/45">
              {usesMensProgram ? HRT_MENS_PROGRAM_DISCLAIMER : HRT_PRICING_DISCLAIMER}
            </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
