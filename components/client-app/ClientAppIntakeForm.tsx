"use client";

import { useRef, useState, useEffect } from "react";

import { SMSDisclosure } from "@/components/SMSDisclosure";
import {
  CLIENT_APP_INTAKE_SLUG,
  VITAMIN_BAR_INTAKE_FORM,
  getClientIntakeCompletion,
  markClientIntakeCompleted,
} from "@/lib/client-app-intake";
import type { IntakeFormField } from "@/lib/hgos/intake-forms";

const PINK = "#E6007E";

function SignaturePad({ onChange }: { onChange: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, []);

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

type Props = {
  onBack: () => void;
};

export function ClientAppIntakeForm({ onBack }: Props) {
  const form = VITAMIN_BAR_INTAKE_FORM;
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ reference: string } | null>(null);

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

  function validate(): boolean {
    const next: Record<string, string> = {};
    for (const field of form.fields) {
      if (!field.required || field.type === "section") continue;
      const value = formData[field.id];
      if (field.type === "checkbox") {
        if (!Array.isArray(value) || value.length === 0) next[field.id] = "Required";
      } else if (!value) {
        next[field.id] = "Required";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!validate()) return;

    const signerName = String(formData.full_name || "").trim();
    const clientPhone = String(formData.phone || "").trim();
    const signatureData = String(formData.signature || "");

    setBusy(true);
    try {
      const responses: Record<string, unknown> = { ...formData };
      delete responses.signature;

      const res = await fetch("/api/public/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: CLIENT_APP_INTAKE_SLUG,
          signer_name: signerName,
          client_phone: clientPhone,
          signature_data: signatureData || undefined,
          responses,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not submit intake. Call us and we’ll help.");
        return;
      }
      const reference = String(data.reference || "");
      markClientIntakeCompleted(reference);
      setDone({ reference });
    } catch {
      setErr("Network error. Try again or call us.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="py-5">
        <div className="rounded-2xl border-2 border-black bg-green-50 p-6 text-center shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
          <span className="text-4xl">✓</span>
          <h2 className="mt-3 text-xl font-bold text-green-900">Intake complete</h2>
          <p className="mt-2 text-sm text-green-800">
            You&apos;re set for Vitamin Bar visits. Reference{" "}
            <span className="font-mono font-bold">{done.reference}</span>
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-5 w-full rounded-xl py-3.5 font-bold text-white"
            style={{ backgroundColor: PINK }}
          >
            Back to app
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <button type="button" onClick={onBack} className="mb-4 text-sm font-medium text-black/55">
        ← Back
      </button>
      <h2 className="text-xl font-bold">{form.name}</h2>
      <p className="mt-1 text-sm text-black/60">{form.description}</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        {form.fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={formData[field.id]}
            error={errors[field.id]}
            onChange={(v) => handleChange(field.id, v)}
          />
        ))}

        {err && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl py-4 font-bold text-white disabled:opacity-60"
          style={{ backgroundColor: PINK }}
        >
          {busy ? "Submitting…" : "Submit intake"}
        </button>
      </form>

      <p className="mt-4 text-center text-[11px] text-black/45">
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
  if (field.type === "section") {
    return (
      <div className="border-b border-black/10 pb-1 pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#E6007E]">{field.label}</h3>
      </div>
    );
  }

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
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
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
          {field.helpText && <p className="mt-1 text-xs text-black/50">{field.helpText}</p>}
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

/** Compact card for Me / Visit tabs — opens full intake form. */
export function ClientAppIntakeCard({
  onOpen,
  refreshKey = 0,
}: {
  onOpen: () => void;
  refreshKey?: number;
}) {
  const [completed, setCompleted] = useState<ReturnType<typeof getClientIntakeCompletion>>(null);

  useEffect(() => {
    setCompleted(getClientIntakeCompletion());
  }, [refreshKey]);

  if (completed) {
    const date = new Date(completed.at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return (
      <div className="rounded-2xl border-2 border-green-600/30 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">✓</span>
          <div>
            <p className="font-bold text-green-900">Intake on file</p>
            <p className="mt-0.5 text-sm text-green-800">Completed {date}</p>
            {completed.reference && (
              <p className="mt-1 text-xs text-green-700">Ref {completed.reference}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="mt-3 text-sm font-semibold text-[#E6007E] underline"
        >
          Update intake
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]">
      <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">Before your visit</p>
      <p className="mt-1 font-bold">Complete wellness intake</p>
      <p className="mt-1 text-sm text-black/60">
        Required once a year for Vitamin Bar shots and drive-thru wellness.
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="mt-4 w-full rounded-xl py-3.5 font-bold text-white"
        style={{ backgroundColor: PINK }}
      >
        Start intake form
      </button>
    </div>
  );
}
