"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { SMSDisclosure } from "@/components/SMSDisclosure";
import { RxIntakeFormCard } from "@/components/rx/intake/RxIntakeFormCard";
import {
  RxIntakeDisqualifiedCard,
  RxPostSubmitCard,
  type RxPostSubmitStep,
} from "@/components/rx/intake/RxPostSubmitHeader";
import { RxTelehealthHandoff } from "@/components/rx/intake/RxTelehealthHandoff";
import { RxInPersonPayPanel } from "@/components/rx/RxInPersonPayPanel";
import {
  HG_RX_PEPTIDE_CONSULT_BOOKING_URL,
  HG_RX_TELEHEALTH_BOOKING_LABEL,
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
  clearPendingScreener,
  isConsultPaid,
  markConsultPaid,
  newConsultReference,
  readPendingRxSuccess,
  readPendingScreener,
  savePendingRxSuccess,
} from "@/lib/peptide-rx-consult-pay";
import {
  cleanPeptideRefillReturnUrl,
  isPeptideRefillPaid,
  markPeptideRefillPaid,
  readPendingPeptideRefillSuccess,
  savePendingPeptideRefillSuccess,
} from "@/lib/peptide-refill-pay";
import {
  computePeptideCombinedQuote,
  type PeptideCombinedSupplyQuote,
} from "@/lib/peptide-supply-pricing";
import {
  GLP1_PAYMENT_FIRST_FINE_PRINT,
  GLP1_REORDER_TELEHEALTH_COPY,
  GLP1_REORDER_TELEHEALTH_FEE_USD,
  glp1TelehealthRequiredBeforeShip,
  glp1TelehealthWaivedForOrder,
} from "@/lib/glp1-telehealth-policy";
import { RX_SUPPLY_CYCLES } from "@/lib/rx-supply-cycle";
import { CLIENT_PEPTIDE_REQUEST_ITEMS } from "@/lib/peptide-request-availability";
import {
  PEPTIDE_CONSULT_FEE_USD,
  PEPTIDE_CONSULT_PAY_NOTE,
  PEPTIDE_REQUEST_DISCLAIMER,
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
  | {
      kind: "qualified";
      reference: string;
      requestType: PeptideRequestType;
      submissionId?: string;
      recordToken?: string;
      priceLabel?: string;
      lineLabel?: string;
      priceUsd?: number;
      invoiceTemplateId?: string;
      supplyCycle?: string;
      savingsNote?: string;
    }
  | { kind: "disqualified"; reference: string };

function rxStatusHref(recordToken?: string): string | undefined {
  if (!recordToken) return undefined;
  return `/rx/status?token=${encodeURIComponent(recordToken)}`;
}

/** Last free step of a new-protocol request — the $49 consult is collected after it. */
const SCREENER_LAST_STEP_ID = "medical";
const NEW_PROTOCOL_STEPS = stepsForRequestType("new");
const STEP_AFTER_SCREENER =
  NEW_PROTOCOL_STEPS.findIndex((s) => s.id === SCREENER_LAST_STEP_ID) + 1;

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
      // Only what the shop still carries — see lib/peptide-request-availability.
      return {
        ...field,
        options: CLIENT_PEPTIDE_REQUEST_ITEMS.map((p) => p.name),
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

  if (step.id === "refill-details" && peptideRequestType(data) === "refill") {
    const names = Array.isArray(data.selected_peptides) ? (data.selected_peptides as string[]) : [];
    if (!computePeptideCombinedQuote(names, data.supply_cycle)) {
      errors.supply_cycle = "Select peptides and a valid supply cycle for pricing";
    }
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
    return CLIENT_PEPTIDE_REQUEST_ITEMS.find((p) => p.id === preselectedPeptideId)?.name;
  }, [preselectedPeptideId]);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {
      supply_cycle: RX_SUPPLY_CYCLES["90-day"].label,
    };
    if (preselectedName) initial.selected_peptides = [preselectedName];
    if (initialRequestType) {
      initial.request_type = requestTypeLabel(initialRequestType);
    }
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  /** Screener outcome for new protocols: pay the consult fee or stop here. */
  const [gate, setGate] = useState<"none" | "pay" | "blocked">("none");
  const [blockReasons, setBlockReasons] = useState<string[]>([]);
  const [prepaidRef, setPrepaidRef] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const requestType = peptideRequestType(formData);
  const activeSteps = useMemo(() => stepsForRequestType(requestType), [requestType]);
  const currentStep = activeSteps[step] ?? activeSteps[0];
  const currentFields = useMemo(
    () => fieldsForStep(currentStep.id, formData),
    [currentStep.id, formData],
  );

  const selectedPeptideNames = useMemo(() => {
    return Array.isArray(formData.selected_peptides) ? (formData.selected_peptides as string[]) : [];
  }, [formData.selected_peptides]);

  const refillQuote = useMemo((): PeptideCombinedSupplyQuote | null => {
    if (requestType !== "refill" || selectedPeptideNames.length === 0) return null;
    return computePeptideCombinedQuote(selectedPeptideNames, formData.supply_cycle);
  }, [requestType, selectedPeptideNames, formData.supply_cycle]);

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
    const consultPaid = params.get("paid") === "1";
    const refillPaid = params.get("refill_paid") === "1";
    const autopay = params.get("autopay") === "1";

    if (consultPaid) {
      const ref = params.get("ref")?.trim();
      if (ref) markConsultPaid(ref);
      const pending = readPendingRxSuccess();
      if (pending) {
        setResult(pending as SubmitResult);
      } else {
        // Paid the consult from the screener — resume the rest of the intake.
        const screener = readPendingScreener();
        if (screener && (!ref || screener.reference === ref)) {
          setFormData((prev) => ({
            ...prev,
            ...screener.data,
            consult_payment_ref: screener.reference,
            consult_fee_paid_usd: PEPTIDE_CONSULT_FEE_USD,
          }));
          setPrepaidRef(screener.reference);
          setGate("none");
          setStep(STEP_AFTER_SCREENER);
          clearPendingScreener();
        }
      }
      const url = new URL(window.location.href);
      url.searchParams.delete("paid");
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
      return;
    }

    if (refillPaid || autopay) {
      const ref = params.get("ref")?.trim();
      if (ref && refillPaid) markPeptideRefillPaid(ref);
      const pending = readPendingPeptideRefillSuccess();
      if (pending) setResult(pending as SubmitResult);
      cleanPeptideRefillReturnUrl();
    }
  }, []);

  function handleChange(fieldId: string, value: unknown) {
    setFormData((prev) => {
      const next = { ...prev, [fieldId]: value };
      if (
        requestType === "refill" &&
        (fieldId === "selected_peptides" || fieldId === "supply_cycle")
      ) {
        const names = Array.isArray(next.selected_peptides)
          ? (next.selected_peptides as string[])
          : [];
        const quote = computePeptideCombinedQuote(names, next.supply_cycle);
        if (quote && quote.lines[0]) {
          next.refill_price_usd = quote.totalUsd;
          next.refill_price_label = quote.priceLabel;
          next.refill_line_label = quote.lineLabel;
          next.refill_invoice_template_id = quote.lines[0].invoiceTemplateId;
          next.refill_supply_cycle = quote.supplyCycle;
        } else {
          delete next.refill_price_usd;
          delete next.refill_price_label;
          delete next.refill_line_label;
          delete next.refill_invoice_template_id;
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
    const nextErrors = validateStep(step, formData, activeSteps);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // New protocols: screen for free, then collect the consult fee before the
    // rest of the intake. Refills stay on the existing pay-after-submit flow.
    if (requestType === "new" && currentStep.id === SCREENER_LAST_STEP_ID && !prepaidRef) {
      const eligibility = evaluatePeptideEligibility(formData);
      if (!eligibility.qualified) {
        setBlockReasons(eligibility.disqualificationReasons);
        setGate("blocked");
        return;
      }
      setGate("pay");
      return;
    }

    setStep((s) => Math.min(s + 1, activeSteps.length - 1));
  }

  function goBack() {
    setErr(null);
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function continueIntakePayInPerson() {
    const ref = prepaidRef ?? newConsultReference();
    setPrepaidRef(ref);
    setFormData((prev) => ({
      ...prev,
      consult_payment_ref: ref,
      consult_fee_pay_in_person: true,
    }));
    setGate("none");
    setErr(null);
    setStep(STEP_AFTER_SCREENER);
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
      const quote =
        type === "refill"
          ? computePeptideCombinedQuote(
              Array.isArray(formData.selected_peptides)
                ? (formData.selected_peptides as string[])
                : [],
              formData.supply_cycle,
            )
          : null;

      const responses: Record<string, unknown> = {
        ...formData,
        request_type_label: type === "refill" ? "Refill request" : "New protocol request",
        qualified: eligibility.qualified,
        disqualification_reasons: eligibility.disqualificationReasons,
        provider_flags: eligibility.providerFlags,
        submitted_at: new Date().toISOString(),
      };
      if (prepaidRef) {
        responses.consult_payment_ref = prepaidRef;
        responses.consult_fee_paid_usd = PEPTIDE_CONSULT_FEE_USD;
      }
      if (quote) {
        responses.refill_price_usd = quote.totalUsd;
        responses.refill_price_label = quote.priceLabel;
        responses.refill_line_label = quote.lineLabel;
        responses.refill_invoice_template_id = quote.lines[0]?.invoiceTemplateId;
        responses.refill_supply_cycle = quote.supplyCycle;
      }
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
      const submissionId = data.submission_id ? String(data.submission_id) : "";
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
          ? {
              kind: "qualified",
              reference,
              submissionId: submissionId || undefined,
              recordToken: recordToken || undefined,
              requestType: type,
              priceLabel: quote?.priceLabel,
              lineLabel: quote?.lineLabel,
              priceUsd: quote?.totalUsd,
              invoiceTemplateId: quote?.lines[0]?.invoiceTemplateId,
              supplyCycle: quote?.supplyCycle,
              savingsNote: quote?.savingsNote,
            }
          : { kind: "disqualified", reference },
      );
      if (eligibility.qualified) {
        if (type === "refill" && quote) {
          savePendingPeptideRefillSuccess({
            kind: "qualified",
            reference,
            submissionId: submissionId || undefined,
            recordToken: recordToken || undefined,
            requestType: "refill",
            priceLabel: quote.priceLabel,
            lineLabel: quote.lineLabel,
            priceUsd: quote.totalUsd,
            invoiceTemplateId: quote.lines[0]?.invoiceTemplateId,
            supplyCycle: quote.supplyCycle,
            savingsNote: quote.savingsNote,
          });
        } else {
          savePendingRxSuccess({
            kind: "qualified",
            reference,
            requestType: type,
            recordToken: recordToken || undefined,
          });
        }
      }
    } catch {
      setErr("Network error. Try again or call 630-636-6193.");
    } finally {
      setBusy(false);
    }
  }

  if (result?.kind === "qualified") {
    const isNew = result.requestType === "new";
    const consultPaid =
      isConsultPaid(result.reference) || Boolean(prepaidRef && isConsultPaid(prepaidRef));
    const refillPaid = !isNew && isPeptideRefillPaid(result.reference);
    const needsPrepay = isNew && !consultPaid;
    const canPayRefill =
      !isNew && Boolean(result.invoiceTemplateId && result.priceUsd) && !refillPaid;
    const is90Day = String(result.supplyCycle || "").includes("90");
    const telehealthWaived = glp1TelehealthWaivedForOrder({ supplyCycleRaw: result.supplyCycle });
    const telehealthBeforeShip = glp1TelehealthRequiredBeforeShip({
      supplyCycleRaw: result.supplyCycle ?? formData.supply_cycle,
      lastVisitWithin90Days: formData.last_visit_within_12mo,
      doseChanges: formData.dose_changes,
      sideEffects: formData.side_effects,
    });

    if (!isNew) {
      const postSubmitSteps: RxPostSubmitStep[] = refillPaid
        ? [
            { label: "Refill request submitted", status: "complete" },
            { label: "Payment received", status: "complete" },
            { label: "Clinical review by Ryan Kent, FNP-BC", status: "current" },
            { label: "Home delivery", status: "upcoming" },
          ]
        : [
            { label: "Refill request submitted", status: "complete" },
            { label: "Pay at the spa Terminal", status: "current" },
            { label: "Clinical review by Ryan Kent, FNP-BC", status: "upcoming" },
            { label: "Home delivery", status: "upcoming" },
          ];

      return (
        <RxPostSubmitCard
          emoji={refillPaid ? "✓" : "🎉"}
          headline={refillPaid ? "Payment received — thank you" : "Refill received — complete payment"}
          reference={result.reference}
          intro={
            !refillPaid
              ? "Pay at Hello Gorgeous in Oswego on the Terminal. Ryan reviews after payment. Medication ships only after clinical approval."
              : "Our team will review and ship after approval."
          }
          steps={postSubmitSteps}
        >
          <p className="text-[11px] text-black/60 max-w-md mx-auto text-center leading-relaxed mb-4">
            {GLP1_PAYMENT_FIRST_FINE_PRINT}
          </p>
          {telehealthWaived && !telehealthBeforeShip && (
            <p className="mt-2 text-xs font-semibold text-green-900 max-w-md mx-auto">
              No telehealth required for this 90-day order. {GLP1_REORDER_TELEHEALTH_COPY}
            </p>
          )}
          {result.priceLabel && (
            <div className="mt-4 mx-auto max-w-sm rounded-xl border-2 border-green-700/30 bg-white px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
                Refill total due now
              </p>
              <p className="mt-1 text-3xl font-black text-green-900">{result.priceLabel}</p>
              {result.lineLabel && (
                <p className="mt-1 text-xs text-green-800">
                  {result.lineLabel}
                  {result.savingsNote ? ` · ${result.savingsNote}` : ""}
                </p>
              )}
            </div>
          )}
          <div className="mt-6 flex flex-col items-center gap-3 max-w-sm mx-auto">
            {canPayRefill && (
              <RxInPersonPayPanel amountLabel={result.priceLabel} kind="medication" />
            )}
            {telehealthBeforeShip && (
              <a
                href={HG_RX_PEPTIDE_CONSULT_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-green-800 bg-green-800 px-8 py-3.5 text-sm font-bold text-white hover:bg-black transition-colors"
              >
                {HG_RX_TELEHEALTH_BOOKING_LABEL} — ${GLP1_REORDER_TELEHEALTH_FEE_USD}
              </a>
            )}
          </div>
          {err && <p className="mt-4 text-sm text-red-700 text-center">{err}</p>}
          {result.recordToken ? (
            <Link
              href={rxStatusHref(result.recordToken)!}
              className="mt-4 block text-center text-xs font-semibold text-[#E6007E] underline"
            >
              Track full order status →
            </Link>
          ) : null}
          <Link href="/app?rx=1" className="mt-4 block text-center text-xs font-semibold text-[#E6007E] underline">
            View in Hello Gorgeous app →
          </Link>
        </RxPostSubmitCard>
      );
    }

    const newSteps: RxPostSubmitStep[] = needsPrepay
      ? [
          { label: "Protocol request submitted", status: "complete" },
          { label: `Pay $${PEPTIDE_CONSULT_FEE_USD} consult at the spa Terminal`, status: "current" },
          { label: "Book telehealth with Ryan Kent, FNP-BC", status: "upcoming" },
          { label: "Protocol approval & medication pricing", status: "upcoming" },
        ]
      : [
          { label: "Protocol request submitted", status: "complete" },
          { label: "Book telehealth with Ryan Kent, FNP-BC", status: "current" },
          { label: "Protocol approval & medication pricing", status: "upcoming" },
        ];

    return (
      <RxPostSubmitCard
        emoji={needsPrepay ? "🎉" : "✓"}
        headline={
          needsPrepay
            ? "Request received — pay your consult in Oswego, then book telehealth"
            : "Consult paid — book your telehealth visit"
        }
        reference={result.reference}
        intro={`Ryan Kent, FNP-BC will review your protocol request at a required telehealth visit before any approval.`}
        steps={newSteps}
      >
        {needsPrepay ? (
          <p className="text-xs text-black/65 max-w-md mx-auto text-center leading-relaxed mb-4">{PEPTIDE_CONSULT_PAY_NOTE}</p>
        ) : (
          <p className="text-xs text-black/55 max-w-md mx-auto text-center mb-4">{PEPTIDE_TELEHEALTH_NOTE}</p>
        )}
        {isNew && consultPaid && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white border border-green-600 px-4 py-1.5 text-xs font-bold text-green-800">
            ✓ ${PEPTIDE_CONSULT_FEE_USD} consult paid
          </p>
        )}
        <div className="mt-6 flex flex-col items-center gap-3">
          {needsPrepay ? (
            <>
              <RxInPersonPayPanel amountLabel={`$${PEPTIDE_CONSULT_FEE_USD}`} kind="consult" />
              <RxTelehealthHandoff
                showBooking
                statusHref={rxStatusHref(result.recordToken)}
                bookingHref={HG_RX_PEPTIDE_CONSULT_BOOKING_URL}
              />
            </>
          ) : (
            <RxTelehealthHandoff
              showBooking
              statusHref={rxStatusHref(result.recordToken)}
              bookingHref={HG_RX_PEPTIDE_CONSULT_BOOKING_URL}
            />
          )}
        </div>
        {err && <p className="mt-4 text-sm text-red-700 text-center">{err}</p>}
        <Link href="/app?rx=1" className="mt-4 block text-center text-xs font-semibold text-[#E6007E] underline">
          View in Hello Gorgeous app →
        </Link>
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
        headline="Thank you for your submission"
        body={PEPTIDE_DISQUALIFIED_MESSAGE}
        reference={result.reference}
        ctaHref="/peptides"
        ctaLabel="← Back to peptide therapy"
      />
    );
  }

  if (gate === "blocked") {
    return (
      <div className="rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.25)] md:p-10">
        <h2 className="font-serif text-2xl font-black text-black">Let&apos;s talk before you pay</h2>
        <p className="mt-4 text-sm leading-relaxed text-black/75">
          Based on your answers, we can&apos;t take this request online. <strong>You have not been
          charged and nothing was submitted.</strong> Ryan may still be able to help you — it just
          needs a conversation first.
        </p>
        {blockReasons.length > 0 && (
          <ul className="mt-4 space-y-1 rounded-xl border border-[#E6007E]/25 bg-[#FFF0F7] px-4 py-3 text-sm text-black/75">
            {blockReasons.map((reason) => (
              <li key={reason}>· {reason}</li>
            ))}
          </ul>
        )}
        <a
          href="tel:+16306366193"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#E6007E] px-8 py-4 font-bold text-white hover:bg-black transition-colors"
        >
          Call 630-636-6193
        </a>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setGate("none");
              setBlockReasons([]);
            }}
            className="text-left text-sm font-semibold text-black/55"
          >
            ← Change my answers
          </button>
          <Link href="/peptides" className="text-sm font-bold text-[#E6007E] underline">
            Back to peptide therapy
          </Link>
        </div>
      </div>
    );
  }

  if (gate === "pay") {
    return (
      <RxIntakeFormCard
        stepIndex={STEP_AFTER_SCREENER}
        stepCount={activeSteps.length}
        stepTitle="Reserve your consult"
        stepLabels={activeSteps.map((s) => s.title.split(" ")[0])}
      >
        <div className="p-5 md:p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-green-600 bg-green-50 px-4 py-1.5 text-xs font-bold text-green-800">
            ✓ Screening complete — no red flags
          </p>
          <h3 className="mt-4 text-2xl font-black text-black">
            Reserve your consult with Ryan Kent, FNP-BC
          </h3>
          <p className="mt-2 text-sm text-black/70 leading-relaxed">
            Your ${PEPTIDE_CONSULT_FEE_USD} consult fee is collected in person on the Terminal at the
            spa. Continue your intake now, then pay tap / dip / swipe in Oswego and book telehealth.
            Medication is quoted and invoiced separately, only after Ryan approves your protocol.
          </p>

          <div className="mt-5 rounded-2xl border-2 border-[#E6007E]/30 bg-[#FFF0F7] px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
              Due now
            </p>
            <p className="mt-1 text-4xl font-black text-black">${PEPTIDE_CONSULT_FEE_USD}</p>
            <p className="mt-1 text-xs text-black/60">
              Consult fee only — not medication. {selectedPeptideNames.length > 0 && (
                <>Requested: {selectedPeptideNames.join(", ")}.</>
              )}
            </p>
          </div>

          {err && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

          <div className="mt-6 flex flex-col gap-3">
            <RxInPersonPayPanel amountLabel={`$${PEPTIDE_CONSULT_FEE_USD}`} kind="consult" />
            <button
              type="button"
              onClick={continueIntakePayInPerson}
              className="inline-flex items-center justify-center rounded-xl bg-[#E6007E] px-8 py-4 font-bold text-white hover:bg-black transition-colors"
            >
              Continue intake — I&apos;ll pay at the spa →
            </button>
            <button
              type="button"
              onClick={() => {
                setGate("none");
                setErr(null);
              }}
              className="text-sm font-semibold text-black/55"
            >
              ← Back to my answers
            </button>
          </div>

          <p className="mt-5 text-[11px] text-black/50 leading-relaxed">
            Square cannot take this consult fee by text, email, or saved card. Questions? Call{" "}
            <a href="tel:+16306366193" className="font-semibold text-[#E6007E] underline">
              630-636-6193
            </a>
            .
          </p>
        </div>
      </RxIntakeFormCard>
    );
  }

  const isLastStep = step === activeSteps.length - 1;
  const stepLabels = activeSteps.map((s) => s.title.split(" ")[0]);

  return (
    <RxIntakeFormCard
      stepIndex={step}
      stepCount={activeSteps.length}
      stepTitle={currentStep.title}
      stepLabels={stepLabels}
    >
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
            if (field.id === "supply_cycle" && requestType === "refill") {
              return (
                <PeptideSupplyCycleSelector
                  key={field.id}
                  peptideNames={selectedPeptideNames}
                  value={String(formData.supply_cycle || RX_SUPPLY_CYCLES["90-day"].label)}
                  error={errors.supply_cycle}
                  onChange={(label) => handleChange("supply_cycle", label)}
                />
              );
            }
            if (field.id === "selected_peptides" && requestType === "refill") {
              return (
                <div key={field.id} className="space-y-4">
                  <FieldRenderer
                    field={field}
                    value={formData[field.id]}
                    error={errors[field.id]}
                    onChange={(v) => handleChange(field.id, v)}
                  />
                  {refillQuote && (
                    <div className="rounded-xl border-2 border-[#E6007E]/30 bg-[#FFF0F7] px-4 py-3 text-sm">
                      <p className="font-bold text-[#E6007E]">Estimated refill total</p>
                      <ul className="mt-2 space-y-1 text-xs text-black/70">
                        {refillQuote.lines.map((l) => (
                          <li key={l.peptideMenuId}>
                            {l.peptideName}: ${l.productUsd} product
                          </li>
                        ))}
                        <li className="font-semibold text-black/80">
                          + ${refillQuote.shippingUsd} shipping · ${refillQuote.totalUsd} total
                        </li>
                      </ul>
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
            {busy
              ? "Submitting…"
              : isLastStep
                ? requestType === "refill"
                  ? "Submit & continue to payment →"
                  : "Submit request"
                : "Continue →"}
          </button>
        </div>
      </form>

      <p className="border-t border-black/10 px-5 py-4 text-center text-[11px] text-black/45 leading-relaxed md:px-8">
        Hello Gorgeous RX™ · not a prescription until approved
        {requestType === "refill" && (
          <>
            <br />
            {GLP1_PAYMENT_FIRST_FINE_PRINT}
          </>
        )}
      </p>
    </RxIntakeFormCard>
  );
}

function PeptideSupplyCycleSelector({
  peptideNames,
  value,
  error,
  onChange,
}: {
  peptideNames: string[];
  value: string;
  error?: string;
  onChange: (label: string) => void;
}) {
  const quote30 = useMemo(
    () => computePeptideCombinedQuote(peptideNames, "30-day"),
    [peptideNames],
  );
  const quote90 = useMemo(
    () => computePeptideCombinedQuote(peptideNames, "90-day"),
    [peptideNames],
  );

  const options = [
    {
      label: RX_SUPPLY_CYCLES["90-day"].label,
      badge: "Recommended · No telehealth for this order",
      quote: quote90,
    },
    {
      label: RX_SUPPLY_CYCLES["30-day"].label,
      badge: "Pay monthly",
      quote: quote30,
    },
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-black">
        Prescription supply cycle <span className="text-red-500">*</span>
      </label>
      <p className="mt-1 text-xs text-black/50">
        30-day or 90-day — same pricing model as GLP-1. One shipping fee per checkout when ordering
        multiple peptides together.
      </p>
      <div className="mt-3 space-y-3">
        {options.map((opt) => (
          <label
            key={opt.label}
            className={`flex cursor-pointer items-start gap-2.5 rounded-xl border-2 px-4 py-4 transition ${
              value === opt.label ? "border-[#E6007E] bg-[#FFF0F7]" : "border-black/15 hover:border-[#E6007E]/40"
            }`}
          >
            <input
              type="radio"
              name="supply_cycle"
              value={opt.label}
              checked={value === opt.label}
              onChange={() => onChange(opt.label)}
              className="mt-1 accent-[#E6007E]"
            />
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-bold">{opt.label}</span>
              <span className="block text-xs font-semibold text-[#E6007E]">{opt.badge}</span>
            </span>
            {opt.quote && (
              <span className="text-right">
                <span className="block text-xl font-black text-[#E6007E]">{opt.quote.priceLabel}</span>
                <span className="block text-[10px] text-black/50 uppercase">due at checkout</span>
                {opt.quote.shippingUsd > 0 && (
                  <span className="block text-[10px] text-black/45">
                    ${opt.quote.productSubtotalUsd} product + ${opt.quote.shippingUsd} ship
                  </span>
                )}
              </span>
            )}
          </label>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-black/45">{GLP1_REORDER_TELEHEALTH_COPY}</p>
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
