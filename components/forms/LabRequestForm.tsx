"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { RxIntakeFormCard } from "@/components/rx/intake/RxIntakeFormCard";
import { RxPostSubmitCard } from "@/components/rx/intake/RxPostSubmitHeader";
import { RxTelehealthHandoff } from "@/components/rx/intake/RxTelehealthHandoff";
import { SMSDisclosure } from "@/components/SMSDisclosure";
import { BOOKING_URL, labRequestUrl } from "@/lib/flows";
import {
  LAB_DRAW_OPTIONS,
  LAB_PANELS,
  LAB_PAYMENT_FIRST_COPY,
  LAB_PRICING_DISCLAIMER,
  type LabDrawOptionId,
} from "@/lib/lab-panel-catalog";
import {
  computeLabPanelQuote,
  LAB_REQUEST_DISCLAIMER,
  LAB_REQUEST_FIELDS,
  LAB_REQUEST_INTAKE_SLUG,
  type LabRequestSelection,
} from "@/lib/lab-request-intake";
import { labPanelAccessMedicalCode, labPanelAccessMedicalLabel } from "@/lib/lab-panel-catalog";
import {
  cleanLabRequestReturnUrl,
  isLabRequestPaid,
  markLabRequestPaid,
  readPendingLabRequestSuccess,
  savePendingLabRequestSuccess,
  startLabRequestCheckout,
} from "@/lib/lab-request-pay";

const PINK = "#E6007E";

type LabRequestFormProps = {
  panelId?: string;
  drawOptionId?: LabDrawOptionId;
  paid?: boolean;
  paidRef?: string;
};

function newReference(): string {
  return `LAB-${Date.now().toString(36).toUpperCase()}`;
}

export function LabRequestForm({
  panelId,
  drawOptionId: initialDraw = "in-office",
  paid = false,
  paidRef,
}: LabRequestFormProps) {
  const [selectedPanelId, setSelectedPanelId] = useState(panelId ?? LAB_PANELS[0]!.id);
  const [drawOptionId, setDrawOptionId] = useState<LabDrawOptionId>(initialDraw);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [reference, setReference] = useState<string | null>(paidRef || null);
  const [submitted, setSubmitted] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(paid);

  useEffect(() => {
    if (panelId) setSelectedPanelId(panelId);
  }, [panelId]);

  useEffect(() => {
    if (initialDraw) setDrawOptionId(initialDraw);
  }, [initialDraw]);

  const selection = useMemo<LabRequestSelection>(
    () => ({ panelId: selectedPanelId, drawOptionId }),
    [selectedPanelId, drawOptionId],
  );

  const quote = useMemo(
    () => computeLabPanelQuote(selection.panelId, selection.drawOptionId),
    [selection],
  );

  useEffect(() => {
    if (paid && paidRef) {
      markLabRequestPaid(paidRef);
      setPaymentComplete(true);
      setReference(paidRef);
      const pending = readPendingLabRequestSuccess();
      if (pending?.reference === paidRef) setSubmitted(true);
      window.history.replaceState(null, "", cleanLabRequestReturnUrl());
    }
  }, [paid, paidRef]);

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    for (const field of LAB_REQUEST_FIELDS) {
      if (!field.required) continue;
      const value = formData[field.id];
      if (field.type === "checkbox") {
        if (!value) next[field.id] = "Required";
      } else if (!String(value || "").trim()) {
        next[field.id] = "Required";
      }
    }
    if (!quote) next._selection = "Select a valid lab panel.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0 || !quote) return;

    setSubmitting(true);
    const ref = reference ?? newReference();
    setReference(ref);

    const sex = String(formData.sex_at_birth || "");
    const amlLine = labPanelAccessMedicalLabel(quote.panel.id, sex);
    const amlCode = labPanelAccessMedicalCode(quote.panel.id, sex);

    const responses = {
      ...formData,
      reference: ref,
      panel_id: quote.panel.id,
      panel_name: quote.panel.name,
      draw_option: drawOptionId,
      access_medical_code: amlCode,
      access_medical_line: amlLine,
      price_usd: quote.totalUsd,
      order_line: amlLine ? `${quote.lineLabel} · ${amlLine}` : quote.lineLabel,
      invoice_template_id: quote.invoiceTemplateId,
    };

    try {
      const res = await fetch("/api/public/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: LAB_REQUEST_INTAKE_SLUG,
          responses,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
      if (!res.ok) {
        setErrors({ _form: data.error || "Could not submit. Please call 630-636-6193." });
        return;
      }

      savePendingLabRequestSuccess({
        kind: "qualified",
        reference: ref,
        submissionId: data.id,
        priceLabel: `$${quote.totalUsd}`,
        lineLabel: quote.lineLabel,
        priceUsd: quote.totalUsd,
        invoiceTemplateId: quote.invoiceTemplateId,
        panelId: quote.panel.id,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePay() {
    if (!reference || !quote) return;
    const pending = readPendingLabRequestSuccess();
    setPaying(true);
    const result = await startLabRequestCheckout({
      reference,
      submissionId: pending?.submissionId,
      templateId: quote.invoiceTemplateId,
      amountUsd: quote.totalUsd,
      lineLabel: quote.lineLabel,
      panelId: quote.panel.id,
    });
    if (result.error) setErrors({ _form: result.error });
    setPaying(false);
  }

  if (paymentComplete && reference && isLabRequestPaid(reference)) {
    return (
      <RxPostSubmitCard
        headline="Lab panel paid — what's next"
        intro="Your NP reviews this order, then we send your requisition. Book a quick visit if you want results walkthrough in person."
      >
        <div className="mt-4 space-y-3 text-sm text-black/70">
          <p>
            <strong className="text-black">1.</strong> Requisition prepared within 1 business day (often same
            day).
          </p>
          {drawOptionId === "in-office" ? (
            <p>
              <strong className="text-black">2.</strong>{" "}
              <a href={BOOKING_URL} className="font-semibold text-[#E6007E] underline">
                Book your in-house draw on Fresha
              </a>{" "}
              — fasting 8–12 hrs, morning preferred.
            </p>
          ) : (
            <p>
              <strong className="text-black">2.</strong> Take your requisition to Quest or LabCorp — fasting
              8–12 hrs.
            </p>
          )}
          <p>
            <strong className="text-black">3.</strong> Results reviewed with Ryan — not released without NP
            context.
          </p>
        </div>
        <RxTelehealthHandoff showBooking />
        <a
          href={BOOKING_URL}
          className="mt-3 block text-center text-sm font-semibold text-[#E6007E] underline"
        >
          Or book in-office on Fresha →
        </a>
        <p className="mt-4 text-center text-xs text-black/50">{LAB_REQUEST_DISCLAIMER}</p>
      </RxPostSubmitCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RxIntakeFormCard title="Choose your panel">
        <p className="text-sm text-black/60">{LAB_PAYMENT_FIRST_COPY}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {LAB_PANELS.map((panel) => {
            const active = panel.id === selectedPanelId;
            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => setSelectedPanelId(panel.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  active
                    ? "border-[#E6007E] bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                    : "border-black/10 bg-white hover:border-[#E6007E]/30"
                }`}
              >
                {panel.badge ? (
                  <span className="text-[9px] font-bold uppercase tracking-wide text-[#E6007E]">
                    {panel.badge.replace("_", " ")}
                  </span>
                ) : null}
                <p className="mt-1 font-semibold text-black">{panel.name}</p>
                <p className="mt-1 text-lg font-serif text-[#E6007E]">${panel.retailUsd}</p>
                <p className="mt-1 text-xs text-black/55">{panel.tagline}</p>
                <p className="mt-2 text-[10px] text-black/45">
                  {panel.markerCount} markers · {panel.turnaround}
                </p>
              </button>
            );
          })}
        </div>

        {quote ? (
          <div className="mt-4 rounded-2xl border border-black/10 bg-[#FAF7F4] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">Includes</p>
            <p className="mt-2 text-sm text-black/70">{quote.panel.markers.slice(0, 6).join(" · ")}…</p>
            {formData.sex_at_birth ? (
              <p className="mt-3 font-mono text-[11px] text-[#E6007E]">
                {labPanelAccessMedicalLabel(quote.panel.id, String(formData.sex_at_birth))}
              </p>
            ) : (
              <p className="mt-3 text-xs text-black/45">
                Access Medical code assigned by sex (778 male · 779 female · 3778/3779 Plus).
              </p>
            )}
            <ul className="mt-3 space-y-1 text-xs text-black/55">
              {quote.panel.bestFor.map((item) => (
                <li key={item}>▸ {item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </RxIntakeFormCard>

      <RxIntakeFormCard title="Where to draw — in-house available">
        <p className="mb-4 text-sm text-black/60">
          <strong className="text-black">In-house at Hello Gorgeous Oswego</strong> is our recommended
          option — real phlebotomy on site, no extra Quest stop.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {LAB_DRAW_OPTIONS.map((opt) => {
            const active = opt.id === drawOptionId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDrawOptionId(opt.id)}
                className={`relative rounded-2xl border-2 p-4 text-left transition ${
                  active
                    ? "border-[#E6007E] bg-[#FFF0F7]"
                    : "border-black/10 bg-white hover:border-[#E6007E]/30"
                }`}
              >
                {opt.badge ? (
                  <span
                    className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      opt.badge === "RECOMMENDED"
                        ? "bg-[#E6007E] text-white"
                        : "bg-black/10 text-black/60"
                    }`}
                  >
                    {opt.badge === "RECOMMENDED" ? "Recommended" : "Nationwide"}
                  </span>
                ) : null}
                <p className="font-semibold text-black">{opt.shortLabel}</p>
                <p className="mt-2 text-xs leading-relaxed text-black/55">{opt.description}</p>
              </button>
            );
          })}
        </div>
        {drawOptionId === "in-office" ? (
          <p className="mt-4 text-center text-sm text-black/55">
            After payment,{" "}
            <a href={BOOKING_URL} className="font-semibold text-[#E6007E] underline">
              book your in-house draw on Fresha
            </a>{" "}
            (fasting morning slots recommended).
          </p>
        ) : null}
      </RxIntakeFormCard>

      {!submitted ? (
        <RxIntakeFormCard title="About you">
          <div className="grid gap-4 sm:grid-cols-2">
            {LAB_REQUEST_FIELDS.map((field) => (
              <div
                key={field.id}
                className={
                  field.type === "textarea" || field.type === "checkbox" ? "sm:col-span-2" : undefined
                }
              >
                {field.type === "checkbox" ? (
                  <label className="flex items-start gap-3 text-sm text-black/70">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={Boolean(formData[field.id])}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.id]: e.target.checked }))
                      }
                    />
                    <span>{field.label}</span>
                  </label>
                ) : (
                  <>
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
                  </>
                )}
                {errors[field.id] ? (
                  <p className="mt-1 text-xs text-red-600">{errors[field.id]}</p>
                ) : null}
              </div>
            ))}
          </div>

          <SMSDisclosure className="mt-4" />
          {errors._form ? <p className="mt-3 text-sm text-red-600">{errors._form}</p> : null}

          {quote ? (
            <p className="mt-4 text-center text-sm text-black/60">
              Total: <strong className="text-black">${quote.totalUsd}</strong> · {quote.lineLabel}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-xl py-3.5 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
            style={{ backgroundColor: PINK }}
          >
            {submitting ? "Submitting…" : "Continue to payment"}
          </button>
        </RxIntakeFormCard>
      ) : (
        <RxIntakeFormCard title="Pay for your lab panel">
          <p className="text-sm text-black/65">
            Total due: <strong className="text-lg text-black">${quote?.totalUsd}</strong>
          </p>
          <p className="mt-1 text-xs text-black/50">Ref {reference}</p>
          {errors._form ? <p className="mt-3 text-sm text-red-600">{errors._form}</p> : null}
          <button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="mt-5 w-full rounded-xl py-3.5 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
            style={{ backgroundColor: PINK }}
          >
            {paying ? "Starting checkout…" : `Pay $${quote?.totalUsd} securely`}
          </button>
        </RxIntakeFormCard>
      )}

      <p className="text-center text-xs text-black/45">
        {LAB_PRICING_DISCLAIMER} ·{" "}
        <Link href="/blood-work" className="underline text-[#E6007E]">
          Full lab guide
        </Link>
      </p>
    </form>
  );
}

/** Compact panel links for blood-work and hubs */
export function LabPanelQuickLinks({ panelId }: { panelId?: string }) {
  const panels = panelId ? LAB_PANELS.filter((p) => p.id === panelId) : LAB_PANELS.slice(0, 3);
  return (
    <div className="flex flex-wrap gap-2">
      {panels.map((panel) => (
        <Link
          key={panel.id}
          href={labRequestUrl({ panel: panel.id })}
          className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
        >
          {panel.name} · ${panel.retailUsd}
        </Link>
      ))}
    </div>
  );
}
