"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { SMSDisclosure } from "@/components/SMSDisclosure";
import { RxSecureMessages } from "@/components/rx/RxSecureMessages";
import { RxPatientStatusCard } from "@/components/rx/RxPatientStatusCard";
import {
  HG_RX_TELEHEALTH_BOOKING_LABEL,
  HG_RX_TELEHEALTH_BOOKING_URL,
} from "@/lib/flows";
import {
  GLP1_SUBCUTANEOUS_INJECTION_GUIDE_URL,
  glp1PatientGuideLabel,
  glp1PatientGuideUrl,
} from "@/lib/glp1-refill-patient-docs";
import {
  cleanGlp1RefillReturnUrl,
  isGlp1RefillPaid,
  markGlp1RefillPaid,
  readPendingGlp1RefillSuccess,
  savePendingGlp1RefillSuccess,
  startGlp1RefillAutopay,
  startGlp1RefillCheckout,
} from "@/lib/glp1-refill-pay";
import {
  GLP1_REFILL_DISQUALIFIED_MESSAGE,
  GLP1_REFILL_INTAKE_SLUG,
  GLP1_REFILL_STEPS,
  evaluateGlp1RefillEligibility,
  glp1SignerName,
} from "@/lib/glp1-refill-intake";
import {
  computeGlp1RefillQuote,
  GLP1_INSURANCE_OVERSIGHT,
  glp1RefillPricingRequiresTier,
  glp1RefillTierOptions,
  type Glp1RefillQuote,
  type Glp1RefillTierOption,
} from "@/lib/glp1-refill-pricing";
import {
  formatAddonPriceLabel,
  GLP1_REFILL_ADDON_NONE,
  parseGlp1RefillAddonSelection,
  peptideMonthlyAddonsByGroup,
  peptidePatientPdfHref,
  peptidePatientPdfsForAddon,
  type PeptideMonthlyAddonId,
} from "@/lib/peptide-monthly-addons";
import {
  RX_SUPPLY_CYCLES,
  RX_TELEHEALTH_CADENCE_DAYS,
} from "@/lib/rx-supply-cycle";
import { rxMessagesHref } from "@/lib/rx-secure-messages";
import { rxStatusHref } from "@/lib/rx-patient-status";

type SubmitResult =
  | {
      kind: "qualified";
      reference: string;
      submissionId?: string;
      priceLabel?: string;
      lineLabel?: string;
      priceUsd?: number;
      invoiceTemplateId?: string;
      medication?: string;
      supplyCycle?: string;
      addon?: {
        id: PeptideMonthlyAddonId;
        shortLabel: string;
        monthlyUsd: number;
        invoiceTemplateId: string;
        lineLabel: string;
      } | null;
    }
  | { kind: "disqualified"; reference: string };

function SignaturePad({ onChange }: { onChange: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  function pointFromEvent(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDrawing(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    setIsDrawing(true);
    const { x, y } = pointFromEvent(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const { x, y } = pointFromEvent(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL());
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  }

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl border-2 border-dashed border-black/25 bg-white">
        <canvas
          ref={canvasRef}
          width={400}
          height={140}
          className="w-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <button type="button" onClick={clear} className="text-xs font-medium text-black/55 underline">
        Clear signature
      </button>
    </div>
  );
}

function fieldVisible(field: IntakeFormField, data: Record<string, unknown>): boolean {
  if (!field.conditionalOn) return true;
  return data[field.conditionalOn.field] === field.conditionalOn.value;
}

function validateStep(stepIndex: number, data: Record<string, unknown>): Record<string, string> {
  const step = GLP1_REFILL_STEPS[stepIndex];
  const errors: Record<string, string> = {};

  for (const field of step.fields) {
    if (!fieldVisible(field, data)) continue;
    if (!field.required || field.type === "section") continue;

    const value = data[field.id];
    if (field.type === "checkbox") {
      if (!Array.isArray(value) || value.length === 0) errors[field.id] = "Required";
    } else if (!value) {
      errors[field.id] = "Required";
    }
  }

  if (step.id === "contact") {
    const email = String(data.email || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
  }

  if (step.id === "shipping") {
    const zip = String(data.zip || "").trim();
    if (zip && !/^\d{5}$/.test(zip)) errors.zip = "Enter a 5-digit ZIP";
    const state = String(data.state || "").trim();
    if (state && state.length !== 2) errors.state = "Use 2-letter state (e.g. IL)";
  }

  if (step.id === "refill") {
    const med = String(data.current_medication || "");
    if (glp1RefillPricingRequiresTier(med) && !String(data.refill_dose_tier || "").trim()) {
      errors.refill_dose_tier = "Select your dose tier";
    }
    if (glp1RefillPricingRequiresTier(med) && !computeGlp1RefillQuote(med, String(data.refill_dose_tier || ""), data.supply_cycle)) {
      errors.refill_dose_tier = "Select a valid dose tier";
    }
    const weight = Number.parseFloat(String(data.weight_lbs || ""));
    if (Number.isNaN(weight) || weight < 50 || weight > 700) errors.weight_lbs = "Enter weight in lbs";
    if (data.dose_changes === "Yes" && !String(data.dose_changes_detail || "").trim()) {
      errors.dose_changes_detail = "Required";
    }
    if (data.side_effects === "Yes" && !String(data.side_effects_detail || "").trim()) {
      errors.side_effects_detail = "Required";
    }
  }

  if (step.id === "medical") {
    if (data.med_allergies === "Yes" && !String(data.med_allergies_list || "").trim()) {
      errors.med_allergies_list = "Required";
    }
    if (data.rx_medications === "Yes" && !String(data.rx_medications_list || "").trim()) {
      errors.rx_medications_list = "Required";
    }
  }

  if (step.id === "consent") {
    const legal = String(data.legal_name || "").trim().toLowerCase();
    const expected = glp1SignerName(data).trim().toLowerCase();
    if (legal && expected && legal !== expected) {
      errors.legal_name = "Must match your first and last name";
    }
    if (!data.signature) errors.signature = "Signature required";
  }

  return errors;
}

export function Glp1RefillForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({
    state: "IL",
    monthly_peptide_addon: GLP1_REFILL_ADDON_NONE,
    supply_cycle: RX_SUPPLY_CYCLES["90-day"].label,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [payBusy, setPayBusy] = useState(false);
  const [autopayBusy, setAutopayBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paid = params.get("paid") === "1";
    const autopay = params.get("autopay") === "1";
    if (!paid && !autopay) return;

    const ref = params.get("ref")?.trim();
    if (ref && paid) markGlp1RefillPaid(ref);

    const pending = readPendingGlp1RefillSuccess();
    if (pending) setResult(pending);

    cleanGlp1RefillReturnUrl();
  }, []);

  const currentStep = GLP1_REFILL_STEPS[step];
  const medication = String(formData.current_medication || "");
  const tierOptions = useMemo(() => glp1RefillTierOptions(medication), [medication]);
  const refillQuote = useMemo(
    () =>
      computeGlp1RefillQuote(
        medication,
        String(formData.refill_dose_tier || ""),
        formData.supply_cycle,
      ),
    [medication, formData.refill_dose_tier, formData.supply_cycle],
  );
  const selectedAddon = useMemo(
    () => parseGlp1RefillAddonSelection(formData.monthly_peptide_addon),
    [formData.monthly_peptide_addon],
  );
  const combinedMonthlyUsd =
    (refillQuote?.priceUsd ?? 0) + (selectedAddon?.monthlyUsd ?? 0) || undefined;

  function handleChange(fieldId: string, value: unknown) {
    setFormData((prev) => {
      const next: Record<string, unknown> = { ...prev, [fieldId]: value };
      if (fieldId === "current_medication") {
        delete next.refill_dose_tier;
        delete next.refill_price_usd;
        delete next.refill_price_label;
        delete next.rx_invoice_template_id;
        delete next.refill_line_label;
        if (value === GLP1_INSURANCE_OVERSIGHT.label) {
          next.refill_dose_tier = GLP1_INSURANCE_OVERSIGHT.id;
          const quote = computeGlp1RefillQuote(
            String(value),
            GLP1_INSURANCE_OVERSIGHT.id,
            next.supply_cycle,
          );
          if (quote) {
            next.refill_price_usd = quote.priceUsd;
            next.refill_price_label = quote.priceLabel;
            next.rx_invoice_template_id = quote.invoiceTemplateId;
            next.refill_line_label = quote.lineLabel;
          }
        }
      }
      if (fieldId === "refill_dose_tier" || fieldId === "supply_cycle") {
        const quote = computeGlp1RefillQuote(
          String(next.current_medication || ""),
          String(next.refill_dose_tier || ""),
          next.supply_cycle,
        );
        if (quote) {
          next.refill_price_usd = quote.priceUsd;
          next.refill_price_label = quote.priceLabel;
          next.rx_invoice_template_id = quote.invoiceTemplateId;
          next.refill_line_label = quote.lineLabel;
        } else {
          delete next.refill_price_usd;
          delete next.refill_price_label;
          delete next.rx_invoice_template_id;
          delete next.refill_line_label;
        }
      }
      return next;
    });
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  }

  function goNext() {
    const nextErrors = validateStep(step, formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStep((s) => Math.min(s + 1, GLP1_REFILL_STEPS.length - 1));
  }

  function goBack() {
    setErr(null);
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function payRefill(
    reference: string,
    templateId: string,
    priceUsd?: number,
    submissionId?: string,
    supplyCycle?: string,
  ) {
    setPayBusy(true);
    setErr(null);
    const outcome = await startGlp1RefillCheckout({
      reference,
      submissionId,
      templateId,
      amountUsd: priceUsd,
      supplyCycle,
    });
    if (outcome.error) setErr(outcome.error);
    setPayBusy(false);
  }

  async function setupAutopay(
    reference: string,
    templateId: string,
    priceUsd?: number,
    lineLabel?: string,
    submissionId?: string,
    supplyCycle?: string,
  ) {
    setAutopayBusy(true);
    setErr(null);
    const outcome = await startGlp1RefillAutopay({
      reference,
      submissionId,
      templateId,
      amountUsd: priceUsd,
      lineLabel,
      supplyCycle,
    });
    if (outcome.error) setErr(outcome.error);
    setAutopayBusy(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const nextErrors = validateStep(step, formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const eligibility = evaluateGlp1RefillEligibility(formData);
    const signerName = glp1SignerName(formData);
    const clientPhone = String(formData.phone || "").trim();
    const signatureData = String(formData.signature || "");
    const quote = computeGlp1RefillQuote(
      String(formData.current_medication || ""),
      String(formData.refill_dose_tier || ""),
      formData.supply_cycle,
    );
    const addon = parseGlp1RefillAddonSelection(formData.monthly_peptide_addon);

    setBusy(true);
    try {
      const responses: Record<string, unknown> = {
        ...formData,
        qualified: eligibility.qualified,
        disqualification_reasons: eligibility.disqualificationReasons,
        provider_flags: eligibility.providerFlags,
        submitted_at: new Date().toISOString(),
        ...(quote
          ? {
              refill_price_usd: quote.priceUsd,
              refill_price_label: quote.priceLabel,
              rx_invoice_template_id: quote.invoiceTemplateId,
              refill_line_label: quote.lineLabel,
              supply_cycle: quote.supplyCycle,
              supply_shipping_usd: quote.shippingUsd,
              supply_savings_note: quote.savingsNote,
            }
          : {}),
        ...(addon
          ? {
              peptide_addon_id: addon.id,
              peptide_addon_label: addon.shortLabel,
              peptide_addon_monthly_usd: addon.monthlyUsd,
              peptide_addon_invoice_template_id: addon.invoiceTemplateId,
              peptide_addon_line_label: addon.lineLabel,
            }
          : {}),
        ...(quote && addon
          ? {
              combined_monthly_usd: quote.priceUsd + addon.monthlyUsd,
            }
          : {}),
      };
      delete responses.signature;

      const res = await fetch("/api/public/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: GLP1_REFILL_INTAKE_SLUG,
          signer_name: signerName,
          client_phone: clientPhone,
          signature_data: signatureData || undefined,
          responses,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not submit refill request. Please call us at 630-636-6193.");
        return;
      }
      const reference = String(data.reference || "");
      const submissionId = String(data.submission_id || data.id || "");
      const qualifiedResult: SubmitResult = eligibility.qualified
        ? {
            kind: "qualified",
            reference,
            submissionId: submissionId || undefined,
            priceLabel: quote?.priceLabel,
            lineLabel: quote?.lineLabel,
            priceUsd: quote?.priceUsd,
            invoiceTemplateId: quote?.invoiceTemplateId,
            medication: String(formData.current_medication || "").trim(),
            supplyCycle: quote?.supplyCycle,
            savingsNote: quote?.savingsNote,
            addon: addon
              ? {
                  id: addon.id,
                  shortLabel: addon.shortLabel,
                  monthlyUsd: addon.monthlyUsd,
                  invoiceTemplateId: addon.invoiceTemplateId,
                  lineLabel: addon.lineLabel,
                }
              : null,
          }
        : { kind: "disqualified", reference };
      setResult(qualifiedResult);
      if (eligibility.qualified && qualifiedResult.kind === "qualified") {
        savePendingGlp1RefillSuccess(qualifiedResult);
      }
    } catch {
      setErr("Network error. Try again or call 630-636-6193.");
    } finally {
      setBusy(false);
    }
  }

  if (result?.kind === "qualified") {
    const refillPaid = isGlp1RefillPaid(result.reference);
    const canPay = Boolean(result.invoiceTemplateId && result.priceUsd);
    const medication = result.medication || String(formData.current_medication || "").trim();
    const patientGuideUrl = glp1PatientGuideUrl(medication);
    const payAmountLabel = result.priceLabel ?? `$${result.priceUsd ?? ""}`;
    const is90Day =
      result.supplyCycle === "90-day" || String(formData.supply_cycle || "").includes("90");
    const patientEmail = String(formData.email || "").trim();

    return (
      <div className="rounded-2xl border-2 border-black bg-green-50 p-8 text-center shadow-lg">
        <span className="text-4xl">{refillPaid ? "✓" : "📋"}</span>
        <h2 className="mt-4 font-serif text-2xl font-semibold text-green-900">Refill request received</h2>
        <p className="mt-3 text-sm text-green-800 leading-relaxed max-w-md mx-auto">
          Our clinical team will review your request within one business day. Reference{" "}
          <span className="font-mono font-bold">{result.reference}</span>.
          {String(formData.ship_to_home || "").startsWith("Yes")
            ? " Once approved, medication ships directly to your home address."
            : " We'll contact you about spa pick-up when your refill is ready."}
        </p>
        {result.priceLabel && (
          <div className="mt-4 mx-auto max-w-sm rounded-xl border-2 border-green-700/30 bg-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
              Your refill total
            </p>
            <p className="mt-1 text-3xl font-black text-green-900">{result.priceLabel}</p>
            {result.lineLabel && (
              <p className="mt-1 text-xs text-green-800">
                {result.lineLabel} · medication + supplies
                {result.savingsNote || refillQuote?.savingsNote ? ` · ${result.savingsNote || refillQuote?.savingsNote}` : ""}
              </p>
            )}
            {result.addon && (
              <div className="mt-3 border-t border-green-700/20 pt-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
                  Monthly add-on
                </p>
                <p className="mt-1 text-lg font-black text-green-900">
                  + {formatAddonPriceLabel(result.addon.monthlyUsd)}
                </p>
                <p className="mt-1 text-xs text-green-800">{result.addon.shortLabel}</p>
              </div>
            )}
            {result.addon && result.priceUsd != null && (
              <p className="mt-3 text-sm font-bold text-green-900 border-t border-green-700/20 pt-3">
                Combined estimate: ${result.priceUsd + result.addon.monthlyUsd}/mo
              </p>
            )}
          </div>
        )}
        {refillPaid && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white border border-green-600 px-4 py-1.5 text-xs font-bold text-green-800">
            ✓ {payAmountLabel} paid — thank you
          </p>
        )}
        <p className="mt-4 text-xs text-green-800 max-w-md mx-auto leading-relaxed">
          Download your guides below, pay when ready, book telehealth on Fresha every{" "}
          {RX_TELEHEALTH_CADENCE_DAYS} days (sooner if your dose changes), and message us securely anytime.
        </p>

        <div className="mt-6 mx-auto max-w-sm space-y-3 text-left">
          <a
            href={GLP1_SUBCUTANEOUS_INJECTION_GUIDE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-white px-4 py-3.5 text-sm font-bold text-green-900 hover:border-[#E6007E] transition-colors"
          >
            <span>Download injection guide</span>
            <span aria-hidden="true">↓</span>
          </a>
          <a
            href={patientGuideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-white px-4 py-3.5 text-sm font-bold text-green-900 hover:border-[#E6007E] transition-colors"
          >
            <span>{glp1PatientGuideLabel(medication)}</span>
            <span aria-hidden="true">↓</span>
          </a>
          {canPay && !refillPaid && (
            <button
              type="button"
              disabled={payBusy || autopayBusy}
              onClick={() =>
                payRefill(
                  result.reference,
                  result.invoiceTemplateId!,
                  result.priceUsd,
                  result.submissionId,
                  result.supplyCycle,
                )
              }
              className="flex w-full items-center justify-between rounded-xl bg-[#E6007E] px-4 py-3.5 text-sm font-bold text-white hover:bg-black transition-colors disabled:opacity-60"
            >
              <span>{payBusy ? "Starting checkout…" : `Pay invoice — ${payAmountLabel}`}</span>
              <span aria-hidden="true">→</span>
            </button>
          )}
          {canPay && !is90Day && (
            <button
              type="button"
              disabled={payBusy || autopayBusy}
              onClick={() =>
                setupAutopay(
                  result.reference,
                  result.invoiceTemplateId!,
                  result.priceUsd,
                  result.lineLabel,
                  result.submissionId,
                  result.supplyCycle,
                )
              }
              className="flex w-full items-center justify-between rounded-xl border-2 border-[#E6007E] bg-white px-4 py-3.5 text-sm font-bold text-[#E6007E] hover:bg-[#FFF0F7] transition-colors disabled:opacity-60"
            >
              <span>
                {autopayBusy
                  ? "Starting auto-pay…"
                  : `Set up monthly auto-pay — ${result.priceLabel}`}
              </span>
              <span aria-hidden="true">↻</span>
            </button>
          )}
          {result.addon && (
            <button
              type="button"
              disabled={payBusy || autopayBusy}
              onClick={() =>
                payRefill(
                  result.reference,
                  result.addon!.invoiceTemplateId,
                  result.addon!.monthlyUsd,
                )
              }
              className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-white px-4 py-3.5 text-sm font-bold text-green-900 hover:border-[#E6007E] transition-colors disabled:opacity-60"
            >
              <span>
                {payBusy
                  ? "Starting checkout…"
                  : `Pay add-on — ${formatAddonPriceLabel(result.addon.monthlyUsd)} (${result.addon.shortLabel})`}
              </span>
              <span aria-hidden="true">→</span>
            </button>
          )}
          {result.addon &&
            peptidePatientPdfsForAddon(result.addon.id).map((pdf) => (
              <a
                key={pdf.id}
                href={peptidePatientPdfHref(pdf.filename)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between rounded-xl border-2 border-black/60 bg-white px-4 py-3.5 text-sm font-bold text-green-900 hover:border-[#E6007E] transition-colors"
              >
                <span className="text-left pr-2">{pdf.title}</span>
                <span aria-hidden="true">↓</span>
              </a>
            ))}
          <a
            href={HG_RX_TELEHEALTH_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between rounded-xl border-2 border-green-800 bg-green-800 px-4 py-3.5 text-sm font-bold text-white hover:bg-black transition-colors"
          >
            <span>{HG_RX_TELEHEALTH_BOOKING_LABEL}</span>
            <span aria-hidden="true">→</span>
          </a>
          <Link
            href={rxStatusHref(result.reference, patientEmail)}
            className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-white px-4 py-3.5 text-sm font-bold text-green-900 hover:border-[#E6007E] transition-colors"
          >
            <span>Track refill status</span>
            <span aria-hidden="true">📍</span>
          </Link>
          <Link
            href={rxMessagesHref(result.reference, patientEmail)}
            className="flex w-full items-center justify-between rounded-xl border-2 border-black bg-white px-4 py-3.5 text-sm font-bold text-green-900 hover:border-[#E6007E] transition-colors"
          >
            <span>Message us securely</span>
            <span aria-hidden="true">💬</span>
          </Link>
        </div>

        <div className="mt-6 mx-auto max-w-sm">
          <RxPatientStatusCard
            compact
            initialRef={result.reference}
            initialEmail={patientEmail}
          />
        </div>
        <div className="mt-4 mx-auto max-w-sm">
          <RxSecureMessages
            compact
            initialRef={result.reference}
            initialEmail={patientEmail}
          />
        </div>

        <p className="mt-4 text-[11px] text-green-700/80 max-w-sm mx-auto">
          Guides open in a new tab — use Print or Save as PDF to download. Secure Square checkout for payment
          and auto-pay.
        </p>
        {err && <p className="mt-4 text-sm text-red-700">{err}</p>}
        <p className="mt-4 text-xs text-green-700">
          Questions?{" "}
          <a href="tel:+16306366193" className="font-semibold underline">
            630-636-6193
          </a>
        </p>
      </div>
    );
  }

  if (result?.kind === "disqualified") {
    return (
      <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
        <h2 className="font-serif text-2xl font-semibold text-black">Thank you for your submission</h2>
        <p className="mt-4 text-sm text-black/75 leading-relaxed">{GLP1_REFILL_DISQUALIFIED_MESSAGE}</p>
        <p className="mt-4 text-xs text-black/50">
          Reference <span className="font-mono">{result.reference}</span> — our team has been notified.
        </p>
        <Link
          href="/glp1-intake"
          className="mt-6 inline-block text-sm font-semibold text-[#E6007E] underline"
        >
          New patient? Start full GLP-1 screening →
        </Link>
      </div>
    );
  }

  const isLastStep = step === GLP1_REFILL_STEPS.length - 1;

  return (
    <div className="rounded-2xl border-2 border-black bg-white shadow-lg overflow-hidden">
      <div className="border-b border-black/10 bg-[#FFF0F7] px-5 py-4">
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-[#E6007E]">
          <span>
            Step {step + 1} of {GLP1_REFILL_STEPS.length}
          </span>
          <span>{currentStep.title}</span>
        </div>
        <div className="mt-3 flex gap-1">
          {GLP1_REFILL_STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#E6007E]" : "bg-black/10"}`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={isLastStep ? submit : (e) => { e.preventDefault(); goNext(); }} className="p-5 md:p-8">
        {currentStep.description && (
          <p className="mb-5 text-sm text-black/65 leading-relaxed">{currentStep.description}</p>
        )}

        <div className="space-y-5">
          {currentStep.fields.map((field) => {
            if (!fieldVisible(field, formData)) return null;
            if (field.id === "current_medication") {
              return (
                <div key={field.id} className="space-y-5">
                  <FieldRenderer
                    field={field}
                    value={formData[field.id]}
                    error={errors[field.id]}
                    onChange={(v) => handleChange(field.id, v)}
                  />
                  {glp1RefillPricingRequiresTier(medication) ? (
                    <RefillTierSelector
                      medication={medication}
                      options={tierOptions}
                      value={String(formData.refill_dose_tier || "")}
                      quote={refillQuote}
                      error={errors.refill_dose_tier}
                      onChange={(tier) => handleChange("refill_dose_tier", tier)}
                    />
                  ) : medication === "Other / switching — discuss with NP" ? (
                    <p className="rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      Pricing will be confirmed by Ryan at your check-in — no charge calculated online yet.
                    </p>
                  ) : null}
                </div>
              );
            }
            if (field.id === "monthly_peptide_addon") {
              const selected = String(formData.monthly_peptide_addon || GLP1_REFILL_ADDON_NONE);
              return (
                <div key={field.id} id="monthly-add-ons" className="scroll-mt-24 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-black">
                      Optional monthly add-on <span className="text-red-500">*</span>
                    </p>
                    <p className="mt-1 text-xs text-black/55 leading-relaxed">
                      Stack with your GLP-1 refill after Ryan approves. Choose individual protocols or
                      pick a NAD+ &amp; Sermorelin bundle format below.
                    </p>
                  </div>

                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 text-sm transition ${
                      selected === GLP1_REFILL_ADDON_NONE
                        ? "border-[#E6007E] bg-[#FFF0F7]"
                        : "border-black/15 hover:border-[#E6007E]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="monthly_peptide_addon"
                      checked={selected === GLP1_REFILL_ADDON_NONE}
                      onChange={() => handleChange("monthly_peptide_addon", GLP1_REFILL_ADDON_NONE)}
                      className="mt-1 accent-[#E6007E]"
                    />
                    <span>
                      <span className="font-bold text-black">No monthly add-ons</span>
                      <span className="mt-0.5 block text-xs text-black/55">GLP-1 refill only</span>
                    </span>
                  </label>

                  {peptideMonthlyAddonsByGroup().map((section) => (
                    <div key={section.group}>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
                        {section.title}
                      </p>
                      <div className="space-y-2">
                        {section.addons.map((addon) => (
                          <label
                            key={addon.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 text-sm transition ${
                              selected === addon.label
                                ? "border-[#E6007E] bg-[#FFF0F7]"
                                : "border-black/15 hover:border-[#E6007E]/40"
                            }`}
                          >
                            <input
                              type="radio"
                              name="monthly_peptide_addon"
                              checked={selected === addon.label}
                              onChange={() => handleChange("monthly_peptide_addon", addon.label)}
                              className="mt-1 accent-[#E6007E]"
                            />
                            <span className="min-w-0">
                              <span className="font-bold text-black">{addon.shortLabel}</span>
                              <span className="ml-2 font-black text-[#E6007E]">
                                {formatAddonPriceLabel(addon.monthlyUsd)}
                              </span>
                              {addon.description && (
                                <span className="mt-1 block text-xs text-black/60 leading-relaxed">
                                  {addon.description}
                                </span>
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {errors.monthly_peptide_addon && (
                    <p className="text-xs text-red-600">{errors.monthly_peptide_addon}</p>
                  )}

                  {selectedAddon && refillQuote && combinedMonthlyUsd != null && (
                    <div className="rounded-xl border-2 border-[#E6007E]/30 bg-[#FFF0F7] px-4 py-3 text-sm">
                      <p className="font-bold text-[#E6007E]">Estimated combined total</p>
                      <p className="mt-1 text-lg font-black text-black">${combinedMonthlyUsd}/mo</p>
                      <p className="mt-1 text-xs text-black/60">
                        {refillQuote.priceLabel} GLP-1 + {formatAddonPriceLabel(selectedAddon.monthlyUsd)}{" "}
                        {selectedAddon.shortLabel}
                      </p>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <FieldRenderer
                key={field.id}
                field={field}
                value={formData[field.id]}
                error={errors[field.id]}
                onChange={(v) => handleChange(field.id, v)}
              />
            );
          })}
        </div>

        {err && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-black/10 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || busy}
            className="text-sm font-semibold text-black/55 disabled:opacity-40"
          >
            {step === 0 ? "" : "← Back"}
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#E6007E] px-8 py-3.5 font-bold text-white hover:bg-black transition-colors disabled:opacity-60"
          >
            {busy ? "Submitting…" : isLastStep ? "Submit refill request" : "Continue →"}
          </button>
        </div>
      </form>

      <p className="border-t border-black/10 px-5 py-4 text-center text-[11px] text-black/45">
        Protected health information · stored securely for your chart
      </p>
    </div>
  );
}

function RefillTierSelector({
  medication,
  options,
  value,
  quote,
  error,
  onChange,
}: {
  medication: string;
  options: Glp1RefillTierOption[];
  value: string;
  quote: Glp1RefillQuote | null;
  error?: string;
  onChange: (tier: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-black">
        Weekly dose for this refill <span className="text-red-500">*</span>
      </label>
      <p className="mt-1 text-xs text-black/50">
        Select your dose — your monthly total updates automatically. Medication included.
      </p>
      <div className="mt-3 space-y-2">
        {options.map((opt) => (
          <label
            key={opt.tier}
            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-sm transition ${
              value === opt.tier
                ? "border-[#E6007E] bg-[#FFF0F7]"
                : "border-black/15 hover:border-[#E6007E]/40"
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <input
                type="radio"
                name="refill_dose_tier"
                value={opt.tier}
                checked={value === opt.tier}
                onChange={() => onChange(opt.tier)}
                className="accent-[#E6007E] shrink-0"
              />
              <span className="font-medium">{opt.doseLabel}</span>
            </span>
            <span className="shrink-0 font-black text-[#E6007E]">${opt.priceUsd}/mo</span>
          </label>
        ))}
      </div>
      {quote && (
        <div className="mt-4 rounded-xl border-2 border-[#E6007E]/30 bg-[#FFF0F7] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
            {quote.supplyCycle === "90-day" ? "90-day refill total" : "Refill total this month"}
          </p>
          <p className="mt-1 text-3xl font-black text-black">{quote.priceLabel}</p>
          <p className="mt-1 text-xs text-black/55">{quote.lineLabel} · includes medication & supplies</p>
          {quote.shippingUsd > 0 && (
            <p className="mt-1 text-xs text-black/50">Includes ${quote.shippingUsd} cold-chain shipping</p>
          )}
          {quote.savingsNote && (
            <p className="mt-2 text-xs font-semibold text-[#E6007E]">{quote.savingsNote}</p>
          )}
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  error,
  onChange,
}: {
  field: IntakeFormField;
  value: unknown;
  error?: string;
  onChange: (v: unknown) => void;
}) {
  const label = (
    <label className="block text-sm font-semibold text-black">
      {field.label} {field.required && <span className="text-red-500">*</span>}
    </label>
  );

  const inputClass = `mt-1.5 w-full rounded-xl border-2 px-4 py-3 outline-none focus:border-[#E6007E] ${
    error ? "border-red-400" : "border-black/15"
  }`;

  switch (field.type) {
    case "text":
    case "date":
      return (
        <div>
          {label}
          <input
            type={field.type === "date" ? "date" : "text"}
            inputMode={
              field.id === "weight_lbs" || field.id === "zip" ? "numeric" : undefined
            }
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
          {field.helpText && <p className="mt-1 text-xs text-black/50">{field.helpText}</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );

    case "phone":
      return (
        <div>
          {label}
          <input
            type="tel"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
          <div className="mt-2">
            <SMSDisclosure variant="light" />
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );

    case "textarea":
      return (
        <div>
          {label}
          <textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={inputClass}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );

    case "select":
      return (
        <div>
          {label}
          <select
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          >
            <option value="">Select…</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );

    case "radio":
      return (
        <div>
          {label}
          <div className="mt-2 space-y-2">
            {field.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-2.5 text-sm">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                  className="accent-[#E6007E]"
                />
                {opt}
              </label>
            ))}
          </div>
          {field.helpText && <p className="mt-2 text-xs text-black/50">{field.helpText}</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );

    case "checkbox":
      return (
        <div>
          {label}
          <div className="mt-2 space-y-2">
            {field.options?.map((opt) => {
              const selected = Array.isArray(value) ? (value as string[]) : [];
              return (
                <label key={opt} className="flex items-start gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...selected, opt]
                        : selected.filter((v) => v !== opt);
                      onChange(next);
                    }}
                    className="mt-0.5 accent-[#E6007E]"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );

    case "signature":
      return (
        <div>
          {label}
          <p className="mt-1 text-xs text-black/50">Sign with your finger or mouse</p>
          <div className="mt-2">
            <SignaturePad onChange={(dataUrl) => onChange(dataUrl)} />
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );

    default:
      return null;
  }
}
