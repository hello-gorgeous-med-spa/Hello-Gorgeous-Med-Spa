"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { RxIntakeFormCard } from "@/components/rx/intake/RxIntakeFormCard";
import { RxPostSubmitCard } from "@/components/rx/intake/RxPostSubmitHeader";
import { RxTelehealthHandoff } from "@/components/rx/intake/RxTelehealthHandoff";
import { SMSDisclosure } from "@/components/SMSDisclosure";
import { HRT_BOOKING_CTA } from "@/lib/hrt-formulation-catalog";
import {
  computeHrtFormSupplyQuote,
  HRT_REQUEST_DISCLAIMER,
  HRT_REQUEST_FIELDS,
  HRT_REQUEST_INTAKE_SLUG,
  parseHrtRequestSelection,
  type HrtRequestSelection,
} from "@/lib/hrt-intake";
import { hrtBannerAltForIngredient, hrtBannerImageForIngredient, hrtBannerImageObjectClass } from "@/lib/hrt-banner-images";
import { HRT_PAYMENT_FIRST_COPY } from "@/lib/hrt-supply-pricing";
import {
  cleanHrtRequestReturnUrl,
  isHrtRequestPaid,
  markHrtRequestPaid,
  readPendingHrtRequestSuccess,
  savePendingHrtRequestSuccess,
  startHrtRequestCheckout,
} from "@/lib/hrt-request-pay";
import { RX_SUPPLY_CYCLES, type RxSupplyCycleId } from "@/lib/rx-supply-cycle";

const PINK = "#E6007E";

type HrtRequestFormProps = {
  ingredientId?: string;
  formId?: string;
  supplyCycle?: RxSupplyCycleId;
  paid?: boolean;
  paidRef?: string;
};

function newReference(): string {
  return `HRT-${Date.now().toString(36).toUpperCase()}`;
}

export function HrtRequestForm({
  ingredientId,
  formId,
  supplyCycle: initialSupply = "90-day",
  paid = false,
  paidRef,
}: HrtRequestFormProps) {
  const selection = useMemo<HrtRequestSelection | null>(() => {
    if (!ingredientId || !formId) return null;
    return parseHrtRequestSelection({ ingredient: ingredientId, form: formId, supply: initialSupply });
  }, [ingredientId, formId, initialSupply]);

  const [supplyCycle, setSupplyCycle] = useState<RxSupplyCycleId>(initialSupply);
  const [formData, setFormData] = useState<Record<string, unknown>>({
    supply_cycle: RX_SUPPLY_CYCLES[initialSupply].label,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [reference, setReference] = useState<string | null>(paidRef || null);
  const [submitted, setSubmitted] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(paid);

  const quote = useMemo(() => {
    if (!selection) return null;
    return computeHrtFormSupplyQuote(selection.ingredientId, selection.formId, supplyCycle);
  }, [selection, supplyCycle]);

  const banner = selection ? hrtBannerImageForIngredient(selection.ingredientId) : null;

  useEffect(() => {
    if (paid && paidRef) {
      markHrtRequestPaid(paidRef);
      setPaymentComplete(true);
      setReference(paidRef);
      const pending = readPendingHrtRequestSuccess();
      if (pending?.reference === paidRef) setSubmitted(true);
      window.history.replaceState(null, "", cleanHrtRequestReturnUrl());
    }
  }, [paid, paidRef]);

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    for (const field of HRT_REQUEST_FIELDS) {
      if (!field.required) continue;
      const value = formData[field.id];
      if (field.type === "checkbox") {
        if (!value) next[field.id] = "Required";
      } else if (!String(value || "").trim()) {
        next[field.id] = "Required";
      }
    }
    if (!selection || !quote) next._selection = "Pick a hormone and form from the hormones page first.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0 || !selection || !quote) return;

    setSubmitting(true);
    const ref = reference ?? newReference();
    setReference(ref);

    const responses = {
      ...formData,
      reference: ref,
      ingredient_id: selection.ingredientId,
      ingredient_name: quote.ingredient.name,
      form_id: selection.formId,
      form_label: quote.form.label,
      formulation_sku: quote.form.formulationSku,
      supply_cycle: RX_SUPPLY_CYCLES[supplyCycle].label,
      price_usd: quote.totalUsd,
      price_label: quote.priceLabel,
      order_line: quote.orderLine,
      invoice_template_id: quote.invoiceTemplateId,
    };

    try {
      const res = await fetch("/api/public/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: HRT_REQUEST_INTAKE_SLUG,
          responses,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
      if (!res.ok) {
        setErrors({ _form: data.error || "Could not submit. Please call 630-636-6193." });
        return;
      }

      savePendingHrtRequestSuccess({
        kind: "qualified",
        reference: ref,
        submissionId: data.id,
        priceLabel: quote.priceLabel,
        lineLabel: quote.orderLine,
        priceUsd: quote.totalUsd,
        invoiceTemplateId: quote.invoiceTemplateId,
        supplyCycle,
        savingsNote: quote.savingsNote,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePay() {
    if (!reference || !quote) return;
    const pending = readPendingHrtRequestSuccess();
    setPaying(true);
    const result = await startHrtRequestCheckout({
      reference,
      submissionId: pending?.submissionId,
      templateId: quote.invoiceTemplateId,
      amountUsd: quote.totalUsd,
      supplyCycle,
      lineLabel: `${quote.ingredient.name} · ${quote.form.label}`,
    });
    if (result.error) setErrors({ _form: result.error });
    setPaying(false);
  }

  if (!selection || !quote) {
    return (
      <RxIntakeFormCard title="Select a hormone first">
        <p className="text-sm text-black/65">
          Choose an ingredient and delivery form on the{" "}
          <Link href="/rx/hormones" className="font-semibold text-[#E6007E] underline">
            hormone therapy page
          </Link>
          , then tap <strong>Pay &amp; start request</strong>.
        </p>
        <Link
          href="/rx/hormones"
          className="mt-4 inline-flex rounded-lg bg-[#E6007E] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Browse hormones →
        </Link>
      </RxIntakeFormCard>
    );
  }

  if (quote.ingredient.id === "testosterone-trt" || quote.ingredient.id === "enclomiphene") {
    return (
      <RxIntakeFormCard title="Men's TRT program">
        <p className="text-sm text-black/65">
          {quote.ingredient.name} uses Gentlemen&apos;s Club all-inclusive program pricing — book your consult to
          get started.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={quote.ingredient.learnHref ?? "/gentlemens-club/testosterone"}
            className="inline-flex rounded-lg bg-[#E6007E] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Explore TRT program →
          </Link>
          <a
            href={HRT_BOOKING_CTA.href}
            className="inline-flex rounded-lg border border-black/15 px-5 py-2.5 text-sm font-semibold text-black/75"
          >
            {HRT_BOOKING_CTA.label}
          </a>
        </div>
      </RxIntakeFormCard>
    );
  }

  if (paymentComplete && reference && isHrtRequestPaid(reference)) {
    return (
      <RxPostSubmitCard
        headline="Payment received — book telehealth next"
        intro="Thank you! Schedule your NP video visit on Fresha. Medication ships after Ryan Kent, FNP-BC approves your protocol."
      >
        <RxTelehealthHandoff showBooking />
        <p className="mt-4 text-center text-xs text-black/50">{HRT_REQUEST_DISCLAIMER}</p>
      </RxPostSubmitCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RxIntakeFormCard title="Your hormone selection">
        {banner ? (
          <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl border border-black/10 bg-[#0A0C10] sm:aspect-[2/1]">
            <Image
              src={banner}
              alt={hrtBannerAltForIngredient(selection.ingredientId, quote.ingredient.name)}
              fill
              className={hrtBannerImageObjectClass(selection.ingredientId)}
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
        ) : null}
        <p className="font-serif text-xl text-black">
          {quote.ingredient.name} · {quote.form.label}
        </p>
        <p className="mt-1 text-sm text-black/55">{quote.ingredient.tagline}</p>
        <p className="mt-3 text-xs text-black/50">{HRT_PAYMENT_FIRST_COPY}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(["90-day", "30-day"] as const).map((cycle) => {
            const active = supplyCycle === cycle;
            const cycleQuote = computeHrtFormSupplyQuote(
              selection.ingredientId,
              selection.formId,
              cycle,
            );
            if (!cycleQuote) return null;
            return (
              <button
                key={cycle}
                type="button"
                onClick={() => {
                  setSupplyCycle(cycle);
                  setFormData((prev) => ({
                    ...prev,
                    supply_cycle: RX_SUPPLY_CYCLES[cycle].label,
                  }));
                }}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  active
                    ? "border-[#E6007E] bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                    : "border-black/10 bg-white hover:border-[#E6007E]/30"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-black/45">
                  {RX_SUPPLY_CYCLES[cycle].shortLabel}
                </p>
                <p className="mt-1 text-lg font-serif text-[#E6007E]">${cycleQuote.totalUsd}</p>
                <p className="mt-1 text-xs text-black/55">
                  {cycleQuote.priceLabel} + ${cycleQuote.shippingUsd} ship
                </p>
                {cycleQuote.savingsNote ? (
                  <p className="mt-2 text-[10px] font-semibold text-[#E6007E]">{cycleQuote.savingsNote}</p>
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="mt-4 font-mono text-[11px] text-black/45">{quote.orderLine}</p>
      </RxIntakeFormCard>

      {!submitted ? (
        <RxIntakeFormCard title="About you">
          <div className="grid gap-4 sm:grid-cols-2">
            {HRT_REQUEST_FIELDS.filter((f) => f.id !== "supply_cycle" && f.id !== "consent_payment_telehealth").map(
              (field) => (
                <div
                  key={field.id}
                  className={field.type === "textarea" ? "sm:col-span-2" : undefined}
                >
                  <label htmlFor={field.id} className="block text-sm font-semibold text-black">
                    {field.label}
                    {field.required ? <span className="text-[#E6007E]"> *</span> : null}
                  </label>
                  {field.helpText ? (
                    <p className="mt-0.5 text-xs text-black/45">{field.helpText}</p>
                  ) : null}
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.id}
                      rows={3}
                      className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
                      value={String(formData[field.id] ?? "")}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      placeholder={field.placeholder}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.id}
                      className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
                      value={String(formData[field.id] ?? "")}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                    >
                      <option value="">Select…</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type === "date" ? "date" : field.type === "phone" ? "tel" : "text"}
                      className="mt-1.5 w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
                      value={String(formData[field.id] ?? "")}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
                      }
                      placeholder={field.placeholder}
                    />
                  )}
                  {errors[field.id] ? (
                    <p className="mt-1 text-xs text-red-600">{errors[field.id]}</p>
                  ) : null}
                </div>
              ),
            )}
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm text-black/70">
            <input
              type="checkbox"
              className="mt-1"
              checked={Boolean(formData.consent_payment_telehealth)}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, consent_payment_telehealth: e.target.checked }))
              }
            />
            <span>
              I understand payment is collected now, telehealth with Ryan Kent, FNP-BC is required before
              medication ships, and my order is not a prescription until clinically approved.
            </span>
          </label>
          {errors.consent_payment_telehealth ? (
            <p className="mt-1 text-xs text-red-600">{errors.consent_payment_telehealth}</p>
          ) : null}

          <SMSDisclosure className="mt-4" />

          {errors._form ? <p className="mt-3 text-sm text-red-600">{errors._form}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-xl py-3.5 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
            style={{ backgroundColor: PINK }}
          >
            {submitting ? "Submitting…" : "Continue to payment"}
          </button>
        </RxIntakeFormCard>
      ) : (
        <RxIntakeFormCard title="Pay for your supply">
          <p className="text-sm text-black/65">
            Total due now:{" "}
            <strong className="text-black text-lg">${quote.totalUsd}</strong>{" "}
            <span className="text-black/50">({quote.priceLabel} + ${quote.shippingUsd} shipping)</span>
          </p>
          {quote.savingsNote ? (
            <p className="mt-2 text-xs font-semibold text-[#E6007E]">{quote.savingsNote}</p>
          ) : null}
          <p className="mt-3 text-xs text-black/50">Ref {reference}</p>
          {errors._form ? <p className="mt-3 text-sm text-red-600">{errors._form}</p> : null}
          <button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="mt-5 w-full rounded-xl py-3.5 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
            style={{ backgroundColor: PINK }}
          >
            {paying ? "Starting checkout…" : `Pay $${quote.totalUsd} securely`}
          </button>
          <RxTelehealthHandoff showBooking={false} />
        </RxIntakeFormCard>
      )}

      <p className="text-center text-xs text-black/45">{HRT_REQUEST_DISCLAIMER}</p>
    </form>
  );
}
