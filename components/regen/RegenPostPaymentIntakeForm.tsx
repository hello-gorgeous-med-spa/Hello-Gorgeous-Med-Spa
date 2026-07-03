"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { RegenMetabolicShiftVisual } from "@/components/regen/RegenMetabolicShiftVisual";

import { RxIntakeFormCard } from "@/components/rx/intake/RxIntakeFormCard";
import { SMSDisclosure } from "@/components/SMSDisclosure";
import { regenCheckoutCompleteUrl } from "@/lib/flows";
import type { IntakeFormField } from "@/lib/hgos/intake-forms";
import {
  buildRegenPostPaymentIntakeSteps,
  type RegenIntakeStep,
} from "@/lib/regen/post-payment-intake";
import type { RegenCategory } from "@/lib/regen/intake-router";
import { computeBmi, parseGlp1Numbers } from "@/lib/glp1-intake";

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

function validateStep(
  steps: RegenIntakeStep[],
  stepIndex: number,
  data: Record<string, unknown>,
): Record<string, string> {
  const step = steps[stepIndex];
  const errors: Record<string, string> = {};

  for (const field of step.fields) {
    if (!fieldVisible(field, data)) continue;
    if (!field.required || field.type === "section") continue;

    const value = data[field.id];
    if (field.type === "checkbox") {
      if (!Array.isArray(value) || value.length === 0) errors[field.id] = "Required";
    } else if (field.type === "signature") {
      if (!value) errors[field.id] = "Signature required";
    } else if (!String(value ?? "").trim()) {
      errors[field.id] = "Required";
    }
  }

  return errors;
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
  const inputClass = `mt-1.5 w-full rounded-xl border-2 px-4 py-3 outline-none focus:border-[#E6007E] ${
    error ? "border-red-400" : "border-black/15"
  }`;

  const label = (
    <label className="block text-sm font-semibold text-black">
      {field.label} {field.required && <span className="text-red-500">*</span>}
    </label>
  );

  switch (field.type) {
    case "text":
    case "date":
      return (
        <div>
          {label}
          <input
            type={field.type === "date" ? "date" : "text"}
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
          <div className="mt-2 flex flex-wrap gap-2">
            {field.options?.map((opt) => (
              <label
                key={opt}
                className={`cursor-pointer rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  value === opt
                    ? "border-[#E6007E] bg-[#FFF0F7] text-[#E6007E]"
                    : "border-black/15 text-black/70 hover:border-[#E6007E]/40"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={value === opt}
                  onChange={() => onChange(opt)}
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
              const selected = Array.isArray(value) && value.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-black/10 px-4 py-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                      const prev = Array.isArray(value) ? value : [];
                      onChange(
                        e.target.checked ? [...prev, opt] : prev.filter((v) => v !== opt),
                      );
                    }}
                    className="mt-0.5 accent-[#E6007E]"
                  />
                  <span className="text-black/80">{opt}</span>
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
          <SignaturePad onChange={onChange} />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    default:
      return null;
  }
}

type Props = {
  orderRef: string;
  category: RegenCategory;
  prefill: Record<string, string>;
  items?: Array<{ name?: string; quantity?: number }>;
};

export function RegenPostPaymentIntakeForm({ orderRef, category, prefill, items }: Props) {
  const router = useRouter();
  const steps = useMemo(() => buildRegenPostPaymentIntakeSteps(category), [category]);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(() => ({
    ...prefill,
    shipping_state: prefill.shipping_state || "IL",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setFormData((prev) => ({ ...prefill, shipping_state: "IL", ...prev }));
  }, [prefill]);

  const currentStep = steps[step];
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
    const nextErrors = validateStep(steps, step, formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setErr(null);
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const nextErrors = validateStep(steps, step, formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const signatureData = String(formData.signature || "");
    setBusy(true);
    try {
      const responses = { ...formData };
      delete responses.signature;

      const res = await fetch("/api/regen/order-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef,
          responses,
          signature_data: signatureData || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not submit intake. Please call 630-636-6193.");
        return;
      }
      router.push(regenCheckoutCompleteUrl(orderRef));
    } catch {
      setErr("Network error. Try again or call 630-636-6193.");
    } finally {
      setBusy(false);
    }
  }

  const isLastStep = step === steps.length - 1;
  const stepLabels = steps.map((s) => s.title.split(" ")[0]);

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
          Order {orderRef}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-white md:text-4xl">
          Complete your health intake
        </h1>
        <p className="mt-3 text-sm text-white/60 max-w-lg mx-auto">
          Payment received — now we need your medical history so Ryan Kent, FNP-BC can review your
          order before anything ships.
        </p>
        {items && items.length > 0 && (
          <p className="mt-2 text-xs text-[#FFB8DC]/80">
            {items.map((i) => i.name).filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      <RxIntakeFormCard
        stepIndex={step}
        stepCount={steps.length}
        stepTitle={currentStep.title}
        stepLabels={stepLabels}
      >
        <form
          onSubmit={isLastStep ? submit : (e) => { e.preventDefault(); goNext(); }}
          className="p-5 md:p-8"
        >
          {currentStep.description && (
            <p className="mb-5 text-sm text-black/65 leading-relaxed">{currentStep.description}</p>
          )}

          {category === "weight-loss" && currentStep.id === "weight-loss" && (
            <RegenMetabolicShiftVisual variant="intake" />
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

            {currentStep.id === "weight-loss" && bmiPreview != null && (
              <div className="rounded-xl border-2 border-[#E6007E]/30 bg-[#FFF0F7] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">
                  Calculated BMI
                </p>
                <p className="mt-1 text-2xl font-black text-black">{bmiPreview}</p>
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
              {busy ? "Submitting…" : isLastStep ? "Submit & continue →" : "Continue →"}
            </button>
          </div>
        </form>
      </RxIntakeFormCard>

      <p className="mt-6 text-center text-xs text-white/40">
        Protected health information · stored securely for your chart
      </p>
    </div>
  );
}
