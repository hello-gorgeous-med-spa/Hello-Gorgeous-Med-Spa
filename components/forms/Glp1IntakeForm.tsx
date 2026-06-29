"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

import { RxIntakeDisqualifiedCard, RxPostSubmitCard } from "@/components/rx/intake/RxPostSubmitHeader";
import { SMSDisclosure } from "@/components/SMSDisclosure";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import {
  GLP1_INTAKE_SUCCESS_HEADLINE,
  GLP1_INTAKE_SUCCESS_INTRO,
  glp1IntakeQualifiedSteps,
} from "@/lib/intake-what-happens-next";
import {
  GLP1_DISQUALIFIED_MESSAGE,
  GLP1_INTAKE_SLUG,
  GLP1_INTAKE_STEPS,
  computeBmi,
  evaluateGlp1Eligibility,
  glp1SignerName,
  parseGlp1Numbers,
} from "@/lib/glp1-intake";
import type { IntakeFormField } from "@/lib/hgos/intake-forms";

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
  | { kind: "qualified"; reference: string }
  | { kind: "disqualified"; reference: string };

function fieldVisible(field: IntakeFormField, data: Record<string, unknown>): boolean {
  if (!field.conditionalOn) return true;
  return data[field.conditionalOn.field] === field.conditionalOn.value;
}

function validateStep(stepIndex: number, data: Record<string, unknown>): Record<string, string> {
  const step = GLP1_INTAKE_STEPS[stepIndex];
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
    const zip = String(data.zip || "").trim();
    if (zip && !/^\d{5}$/.test(zip)) errors.zip = "Enter a 5-digit ZIP";
    const email = String(data.email || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
  }

  if (step.id === "screening") {
    const { heightFt, heightIn, weightLbs } = parseGlp1Numbers(data);
    if (Number.isNaN(heightFt) || heightFt < 3 || heightFt > 8) errors.height_ft = "Enter feet (3–8)";
    if (Number.isNaN(heightIn) || heightIn < 0 || heightIn > 11) errors.height_in = "Enter inches (0–11)";
    if (Number.isNaN(weightLbs) || weightLbs < 50 || weightLbs > 700) errors.weight_lbs = "Enter weight in lbs";
  }

  if (step.id === "history") {
    if (data.tried_before === "Yes") {
      const methods = data.tried_methods;
      if (!Array.isArray(methods) || methods.length === 0) errors.tried_methods = "Select at least one";
    }
    if (data.rx_medications === "Yes" && !String(data.rx_medications_list || "").trim()) {
      errors.rx_medications_list = "Required";
    }
    if (data.med_allergies === "Yes" && !String(data.med_allergies_list || "").trim()) {
      errors.med_allergies_list = "Required";
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

export function Glp1IntakeForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const currentStep = GLP1_INTAKE_STEPS[step];
  const bmiPreview = useMemo(() => {
    const { heightFt, heightIn, weightLbs } = parseGlp1Numbers(formData);
    return computeBmi(heightFt, heightIn, weightLbs);
  }, [formData]);

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
    const nextErrors = validateStep(step, formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStep((s) => Math.min(s + 1, GLP1_INTAKE_STEPS.length - 1));
  }

  function goBack() {
    setErr(null);
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const nextErrors = validateStep(step, formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const eligibility = evaluateGlp1Eligibility(formData);
    const signerName = glp1SignerName(formData);
    const clientPhone = String(formData.phone || "").trim();
    const signatureData = String(formData.signature || "");

    setBusy(true);
    try {
      const responses: Record<string, unknown> = {
        ...formData,
        bmi: eligibility.bmi,
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
          slug: GLP1_INTAKE_SLUG,
          signer_name: signerName,
          client_phone: clientPhone,
          signature_data: signatureData || undefined,
          responses,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not submit intake. Please call us at 630-636-6193.");
        return;
      }
      const reference = String(data.reference || "");
      setResult(
        eligibility.qualified
          ? { kind: "qualified", reference }
          : { kind: "disqualified", reference },
      );
    } catch {
      setErr("Network error. Try again or call 630-636-6193.");
    } finally {
      setBusy(false);
    }
  }

  if (result?.kind === "qualified") {
    return (
      <RxPostSubmitCard
        emoji="✓"
        headline={GLP1_INTAKE_SUCCESS_HEADLINE}
        reference={result.reference}
        intro={GLP1_INTAKE_SUCCESS_INTRO}
        steps={glp1IntakeQualifiedSteps()}
      >
        <a
          href={PRIMARY_BOOKING_CTA.href}
          className="inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-[#E6007E] px-8 py-4 font-bold text-white hover:bg-black transition-colors"
        >
          {PRIMARY_BOOKING_CTA.label} →
        </a>
        <div className="mt-4 flex flex-col items-center gap-2 text-center">
          <Link href="/portal/rx" className="text-xs font-semibold text-[#E6007E] underline">
            Open my RX portal
          </Link>
          <Link href="/rx/status" className="text-xs font-semibold text-[#E6007E] underline">
            Track order status
          </Link>
        </div>
        <p className="mt-4 text-xs text-black/55 text-center">
          Questions?{" "}
          <a href="tel:+16306366193" className="font-semibold text-[#E6007E] underline">
            630-636-6193
          </a>
        </p>
      </RxPostSubmitCard>
    );
  }

  if (result?.kind === "disqualified") {
    return (
      <RxIntakeDisqualifiedCard
        headline="Thank you for your intake"
        body={GLP1_DISQUALIFIED_MESSAGE}
        reference={result.reference}
        ctaHref="/glp1-weight-loss"
        ctaLabel="← Back to program overview"
      />
    );
  }

  const isLastStep = step === GLP1_INTAKE_STEPS.length - 1;

  return (
    <div className="rounded-2xl border-2 border-black bg-white shadow-lg overflow-hidden">
      <div className="border-b border-black/10 bg-[#FFF0F7] px-5 py-4">
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-[#E6007E]">
          <span>
            Step {step + 1} of {GLP1_INTAKE_STEPS.length}
          </span>
          <span>{currentStep.title}</span>
        </div>
        <div className="mt-3 flex gap-1">
          {GLP1_INTAKE_STEPS.map((s, i) => (
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

          {currentStep.id === "screening" && bmiPreview != null && (
            <div className="rounded-xl border-2 border-[#E6007E]/30 bg-[#FFF0F7] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">Calculated BMI</p>
              <p className="mt-1 text-2xl font-black text-black">{bmiPreview}</p>
              <p className="mt-1 text-xs text-black/50">For screening only — your provider will confirm at consult.</p>
            </div>
          )}
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
            {busy ? "Submitting…" : isLastStep ? "Submit intake" : "Continue →"}
          </button>
        </div>
      </form>

      <p className="border-t border-black/10 px-5 py-4 text-center text-[11px] text-black/45">
        Protected health information · stored securely for your chart
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
              field.id === "height_ft" ||
              field.id === "height_in" ||
              field.id === "weight_lbs" ||
              field.id === "zip"
                ? "numeric"
                : undefined
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
