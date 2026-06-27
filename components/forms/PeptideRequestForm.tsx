"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { SMSDisclosure } from "@/components/SMSDisclosure";
import {
  HG_RX_TELEHEALTH_BOOKING_LABEL,
  HG_RX_TELEHEALTH_BOOKING_URL,
} from "@/lib/flows";
import type { IntakeFormField } from "@/lib/hgos/intake-forms";
import {
  PEPTIDE_DISQUALIFIED_MESSAGE,
  evaluatePeptideEligibility,
  intakeSlugForRequest,
  peptideRequestType,
  peptideSignerName,
  stepsForRequestType,
  type PeptideRequestType,
} from "@/lib/peptide-intake";
import {
  clearRxStartPrefill,
  readRxStartPrefill,
  requestTypeLabel,
} from "@/lib/peptide-rx-prefill";
import { savePeptideRxRecord } from "@/lib/peptide-rx-records";
import {
  isConsultPaid,
  markConsultPaid,
  readPendingRxSuccess,
  savePendingRxSuccess,
  startConsultCheckout,
} from "@/lib/peptide-rx-consult-pay";
import {
  PEPTIDE_CONSULT_FEE_USD,
  PEPTIDE_CONSULT_PAY_NOTE,
  PEPTIDE_REQUEST_DISCLAIMER,
  PEPTIDE_REQUEST_ITEMS,
  PEPTIDE_TELEHEALTH_NOTE,
} from "@/lib/peptide-request-menu";

const PINK = "#E6007E";

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

type SubmitResult =
  | { kind: "qualified"; reference: string; requestType: PeptideRequestType }
  | { kind: "disqualified"; reference: string };

function fieldVisible(field: IntakeFormField, data: Record<string, unknown>): boolean {
  if (!field.conditionalOn) return true;
  return data[field.conditionalOn.field] === field.conditionalOn.value;
}

function fieldsForStep(stepId: string, data: Record<string, unknown>): IntakeFormField[] {
  const steps = stepsForRequestType(peptideRequestType(data));
  const step = steps.find((s) => s.id === stepId);
  if (!step) return [];

  return step.fields.map((field) => {
    if (field.id === "selected_peptides") {
      return {
        ...field,
        options: PEPTIDE_REQUEST_ITEMS.map((p) => p.name),
      };
    }
    return field;
  });
}

function validateStep(
  stepIndex: number,
  data: Record<string, unknown>,
  activeSteps: ReturnType<typeof stepsForRequestType>,
): Record<string, string> {
  const step = activeSteps[stepIndex];
  const errors: Record<string, string> = {};
  const fields = fieldsForStep(step.id, data);

  for (const field of fields) {
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
    const zip = String(data.zip || "").trim();
    if (zip && !/^\d{5}$/.test(zip)) errors.zip = "Enter a 5-digit ZIP";
    const email = String(data.email || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
  }

  if (step.id === "consent") {
    const legal = String(data.legal_name || "").trim().toLowerCase();
    const expected = peptideSignerName(data).trim().toLowerCase();
    if (legal && expected && legal !== expected) {
      errors.legal_name = "Must match your first and last name";
    }
    if (!data.signature) errors.signature = "Signature required";
  }

  return errors;
}

export function PeptideRequestForm({
  preselectedPeptideId,
  initialRequestType,
}: {
  preselectedPeptideId?: string;
  initialRequestType?: "new" | "refill";
}) {
  const preselectedName = useMemo(() => {
    if (!preselectedPeptideId) return undefined;
    return PEPTIDE_REQUEST_ITEMS.find((p) => p.id === preselectedPeptideId)?.name;
  }, [preselectedPeptideId]);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    if (preselectedName) initial.selected_peptides = [preselectedName];
    if (initialRequestType === "refill") {
      initial.request_type = requestTypeLabel("refill");
    }
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [payBusy, setPayBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const requestType = peptideRequestType(formData);
  const activeSteps = useMemo(() => stepsForRequestType(requestType), [requestType]);
  const currentStep = activeSteps[step] ?? activeSteps[0];
  const currentFields = useMemo(
    () => fieldsForStep(currentStep.id, formData),
    [currentStep.id, formData],
  );

  useEffect(() => {
    const prefill = readRxStartPrefill();
    if (!prefill) return;
    setFormData((prev) => ({
      ...prev,
      request_type: requestTypeLabel(prefill.requestType),
      selected_peptides: [prefill.peptideName],
      ...(prefill.pregnant ? { pregnant: prefill.pregnant } : {}),
      ...(prefill.existingPatient ? { existing_patient: prefill.existingPatient } : {}),
      ...(prefill.lastVisitWithin12mo ? { last_visit_within_12mo: prefill.lastVisitWithin12mo } : {}),
    }));
    setStep(2);
    clearRxStartPrefill();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") !== "1") return;

    const ref = params.get("ref")?.trim();
    if (ref) markConsultPaid(ref);

    const pending = readPendingRxSuccess();
    if (pending) setResult(pending);

    const url = new URL(window.location.href);
    url.searchParams.delete("paid");
    url.searchParams.delete("ref");
    const clean = url.pathname + (url.search || "");
    window.history.replaceState({}, "", clean);
  }, []);

  function handleChange(fieldId: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  }

  function goNext() {
    const nextErrors = validateStep(step, formData, activeSteps);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStep((s) => Math.min(s + 1, activeSteps.length - 1));
  }

  function goBack() {
    setErr(null);
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function payConsult(reference: string) {
    setPayBusy(true);
    setErr(null);
    const outcome = await startConsultCheckout(reference);
    if (outcome.error) setErr(outcome.error);
    setPayBusy(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const nextErrors = validateStep(step, formData, activeSteps);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const eligibility = evaluatePeptideEligibility(formData);
    const signerName = peptideSignerName(formData);
    const clientPhone = String(formData.phone || "").trim();
    const signatureData = String(formData.signature || "");
    const type = peptideRequestType(formData);

    setBusy(true);
    try {
      const responses: Record<string, unknown> = {
        ...formData,
        request_type_label: type === "refill" ? "Refill request" : "New protocol request",
        qualified: eligibility.qualified,
        disqualification_reasons: eligibility.disqualificationReasons,
        provider_flags: eligibility.providerFlags,
        submitted_at: new Date().toISOString(),
      };
      delete responses.signature;

      const res = await fetch("/api/public/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: intakeSlugForRequest(formData),
          signer_name: signerName,
          client_phone: clientPhone,
          signature_data: signatureData || undefined,
          responses,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not submit request. Please call us at 630-636-6193.");
        return;
      }
      const reference = String(data.reference || "");
      const recordToken = data.record_token ? String(data.record_token) : "";
      const peptides = Array.isArray(formData.selected_peptides)
        ? (formData.selected_peptides as string[])
        : [];

      if (recordToken) {
        savePeptideRxRecord({
          recordToken,
          reference,
          peptideNames: peptides,
          requestType: type,
          submittedAt: new Date().toISOString(),
          qualified: eligibility.qualified,
        });
      }

      setResult(
        eligibility.qualified
          ? { kind: "qualified", reference, requestType: type }
          : { kind: "disqualified", reference },
      );
      if (eligibility.qualified) {
        savePendingRxSuccess({ kind: "qualified", reference, requestType: type });
      }
    } catch {
      setErr("Network error. Try again or call 630-636-6193.");
    } finally {
      setBusy(false);
    }
  }

  if (result?.kind === "qualified") {
    const isNew = result.requestType === "new";
    const consultPaid = isConsultPaid(result.reference);
    const needsPrepay = isNew && !consultPaid;

    return (
      <div className="rounded-2xl border-2 border-black bg-green-50 p-8 text-center shadow-lg">
        <span className="text-4xl">{needsPrepay ? "💳" : "✓"}</span>
        <h2 className="mt-4 font-serif text-2xl font-semibold text-green-900">
          {needsPrepay ? "Request received — pre-pay to book telehealth" : "Request received — book telehealth"}
        </h2>
        <p className="mt-3 text-sm text-green-800 leading-relaxed max-w-md mx-auto">
          Reference <span className="font-mono font-bold">{result.reference}</span>. Ryan Kent, FNP-BC will
          review your {isNew ? "protocol request" : "refill request"} at a required telehealth visit before
          any approval.
        </p>
        {needsPrepay ? (
          <p className="mt-3 text-xs text-green-800 max-w-md mx-auto leading-relaxed">{PEPTIDE_CONSULT_PAY_NOTE}</p>
        ) : (
          <p className="mt-3 text-xs text-green-700 max-w-md mx-auto">{PEPTIDE_TELEHEALTH_NOTE}</p>
        )}
        {isNew && consultPaid && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white border border-green-600 px-4 py-1.5 text-xs font-bold text-green-800">
            ✓ ${PEPTIDE_CONSULT_FEE_USD} consult paid
          </p>
        )}
        <div className="mt-6 flex flex-col items-center gap-3">
          {needsPrepay ? (
            <>
              <button
                type="button"
                disabled={payBusy}
                onClick={() => payConsult(result.reference)}
                className="inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-[#E6007E] px-8 py-4 font-bold text-white hover:bg-black transition-colors disabled:opacity-60"
              >
                {payBusy
                  ? "Starting Square checkout…"
                  : `Pay $${PEPTIDE_CONSULT_FEE_USD} & book telehealth`}
              </button>
              <p className="text-[11px] text-green-700/80 max-w-sm">
                Secure Square checkout — same pre-pay flow as our Vitamin Bar. Telehealth booking unlocks after
                payment.
              </p>
            </>
          ) : (
            <a
              href={HG_RX_TELEHEALTH_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-[#E6007E] px-8 py-4 font-bold text-white hover:bg-black transition-colors"
            >
              {HG_RX_TELEHEALTH_BOOKING_LABEL} →
            </a>
          )}
        </div>
        {err && <p className="mt-4 text-sm text-red-700">{err}</p>}
        <Link href="/app?rx=1" className="mt-4 inline-block text-xs font-semibold text-green-700 underline">
          View in Hello Gorgeous app →
        </Link>
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
        <p className="mt-4 text-sm text-black/75 leading-relaxed">{PEPTIDE_DISQUALIFIED_MESSAGE}</p>
        <p className="mt-4 text-xs text-black/50">
          Reference <span className="font-mono">{result.reference}</span> — our clinical team has been notified.
        </p>
        <Link href="/peptides" className="mt-6 inline-block text-sm font-semibold text-[#E6007E] underline">
          ← Back to peptide therapy
        </Link>
      </div>
    );
  }

  const isLastStep = step === activeSteps.length - 1;

  return (
    <div className="rounded-2xl border-2 border-black bg-white shadow-lg overflow-hidden">
      <div className="border-b border-black/10 bg-[#FFF0F7] px-5 py-4">
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-[#E6007E]">
          <span>
            Step {step + 1} of {activeSteps.length}
          </span>
          <span>{currentStep.title}</span>
        </div>
        <div className="mt-3 flex gap-1">
          {activeSteps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#E6007E]" : "bg-black/10"}`}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={
          isLastStep
            ? submit
            : (e) => {
                e.preventDefault();
                goNext();
              }
        }
        className="p-5 md:p-8"
      >
        {currentStep.description && (
          <p className="mb-5 text-sm text-black/65 leading-relaxed">{currentStep.description}</p>
        )}

        {step === 0 && (
          <p className="mb-5 rounded-xl border border-[#E6007E]/25 bg-[#FFF0F7] px-4 py-3 text-xs text-black/70 leading-relaxed">
            {PEPTIDE_REQUEST_DISCLAIMER}
          </p>
        )}

        <div className="space-y-5">
          {currentFields.map((field) => {
            if (!fieldVisible(field, formData)) return null;
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
            {busy ? "Submitting…" : isLastStep ? "Submit request" : "Continue →"}
          </button>
        </div>
      </form>

      <p className="border-t border-black/10 px-5 py-4 text-center text-[11px] text-black/45">
        Hello Gorgeous RX™ · NP telehealth required · not a prescription until approved
      </p>
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

  const inputClass = `mt-1.5 w-full rounded-xl border-2 px-4 py-3 outline-none focus:border-[${PINK}] ${
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
            inputMode={field.id === "zip" ? "numeric" : undefined}
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
          <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
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
