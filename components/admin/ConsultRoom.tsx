"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { getConsultPack } from "@/lib/consults/packs";
import {
  WEIGHT_LOSS_SCREEN_FIELDS,
  screeningAllowsPropose,
  weightLossBmiPreview,
} from "@/lib/consults/screening";
import {
  CONSULT_STEPS,
  CONSULT_VERTICAL_LABELS,
  type ConsultScreening,
  type ConsultStepId,
  type TreatmentConsultRecord,
} from "@/lib/consults/types";

const PINK = "#E6007E";
const HOT = "#FF2D8E";
const SERIF = "var(--font-playfair), Georgia, serif";

function StepCard({
  eyebrow,
  title,
  children,
  dark = false,
}: PropsWithChildren<{
  eyebrow: string;
  title: string;
  dark?: boolean;
}>) {
  if (dark) {
    return (
      <section className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-[#0a0a0a] text-white shadow-[10px_10px_0_0_rgba(230,0,126,0.4)]">
        <div
          className="border-b border-white/10 px-6 py-5 md:px-8"
          style={{
            background:
              "radial-gradient(ellipse 70% 120% at 100% 0%, rgba(230,0,126,0.35), transparent 55%)",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-medium md:text-3xl" style={{ fontFamily: SERIF }}>
            {title}
          </h2>
        </div>
        <div className="px-6 py-6 md:px-8 md:py-7">{children}</div>
      </section>
    );
  }
  return (
    <section className="rounded-[1.75rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: PINK }}>
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-medium text-black md:text-3xl" style={{ fontFamily: SERIF }}>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

type Props = {
  consultId: string;
};

export function ConsultRoom({ consultId }: Props) {
  const [consult, setConsult] = useState<TreatmentConsultRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [proposing, setProposing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [step, setStep] = useState<ConsultStepId>("intake");
  const [slideIndex, setSlideIndex] = useState(0);

  const pack = useMemo(
    () => (consult ? getConsultPack(consult.vertical) : null),
    [consult]
  );

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/consults/${consultId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load consult.");
      setConsult(data.consult);
      setError(null);

      const covered = data.consult.education_progress?.coveredSlideIds || [];
      const currentId = data.consult.education_progress?.currentSlideId;
      const packForVertical = getConsultPack(data.consult.vertical);
      if (currentId) {
        const idx = packForVertical.slides.findIndex((s) => s.id === currentId);
        if (idx >= 0) setSlideIndex(idx);
      }

      if (data.consult.proposal_id) setStep("propose");
      else if (data.consult.recommendation?.pathId) setStep("recommend");
      else if (covered.length > 0) setStep("educate");
      else if (data.consult.screening?.result) setStep("screen");
      else setStep("intake");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load consult.");
    } finally {
      setLoading(false);
    }
  }, [consultId]);

  useEffect(() => {
    void load();
  }, [load]);

  const patchConsult = async (body: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/consults/${consultId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save.");
      setConsult(data.consult);
      setNotice("Saved.");
      return data.consult as TreatmentConsultRecord;
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const createProposal = async (forceOverride = false) => {
    if (!consult) return;
    setProposing(true);
    setError(null);
    try {
      const response = await fetch(`/api/consults/${consultId}/create-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forceOverride,
          overrideNote: consult.screening?.staffOverrideNote,
          pathId: consult.recommendation?.pathId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create proposal.");
      if (data.consult) setConsult(data.consult);
      window.location.href = `/admin/proposals/${data.proposalId}/edit`;
    } catch (proposeError) {
      setError(proposeError instanceof Error ? proposeError.message : "Failed to create proposal.");
      setProposing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-black/60">Loading consult room…</div>;
  }
  if (!consult || !pack) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-600">{error || "Consult not found."}</p>
        <Link href="/admin/proposals/consults" className="mt-4 inline-block text-sm font-bold text-[#E6007E]">
          ← Back to consults
        </Link>
      </div>
    );
  }

  const answers = (consult.screening?.answers || {}) as Record<string, unknown>;
  const covered = new Set(consult.education_progress?.coveredSlideIds || []);
  const slide = pack.slides[slideIndex] || pack.slides[0];
  const canPropose = screeningAllowsPropose(consult.screening) || Boolean(consult.proposal_id);
  const bmi =
    consult.vertical === "weight_loss" ? weightLossBmiPreview(answers) : consult.screening?.result?.bmi;

  return (
    <div className="relative mx-auto max-w-5xl space-y-6 p-6 pb-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 55% 40% at 0% 0%, rgba(230,0,126,0.1), transparent 55%),
            linear-gradient(180deg, #FFF0F7 0%, #ffffff 40%, #f7f7f7 100%)
          `,
        }}
      />

      <header className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-[#0a0a0a] text-white shadow-[10px_10px_0_0_rgba(230,0,126,0.4)]">
        <div
          className="flex flex-wrap items-start justify-between gap-4 px-6 py-6 md:px-8 md:py-7"
          style={{
            background: `
              linear-gradient(125deg, #1a0a12 0%, #2d1020 45%, #0a0a0a 100%),
              radial-gradient(ellipse 70% 80% at 90% 10%, rgba(230,0,126,0.4), transparent 55%)
            `,
          }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
                Consult room · {CONSULT_VERTICAL_LABELS[consult.vertical]}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/75">
                  {canPropose ? "Ready to propose" : "NP judgment active"}
                </span>
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-medium md:text-4xl" style={{ fontFamily: SERIF }}>
              {consult.client_name}
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Status: {consult.status}
              {consult.proposal_id ? (
                <>
                  {" · "}
                  <Link
                    href={`/admin/proposals/${consult.proposal_id}/edit`}
                    className="font-semibold text-[#FFB8DC] underline"
                  >
                    Open proposal
                  </Link>
                </>
              ) : null}
            </p>
          </div>
          <Link
            href="/admin/proposals/consults"
            className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur hover:bg-white/20"
          >
            All consults
          </Link>
        </div>
      </header>

      {error ? (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="rounded-2xl border-2 border-black/10 bg-[#FFF0F7] px-4 py-2 text-sm text-black/70">
          {notice}
        </div>
      ) : null}

      <nav className="flex flex-wrap gap-2">
        {CONSULT_STEPS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStep(item.id)}
            className={`rounded-full border-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${
              step === item.id
                ? "border-black text-white shadow-[3px_3px_0_0_#000]"
                : "border-black/15 bg-white text-black/55"
            }`}
            style={
              step === item.id
                ? { background: `linear-gradient(125deg, ${HOT}, ${PINK})` }
                : undefined
            }
          >
            <span className="opacity-50">{String(index + 1).padStart(2, "0")}</span> {item.label}
          </button>
        ))}
      </nav>

      {step === "intake" ? (
        <StepCard eyebrow="01 · Capture" title="Intake snapshot">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold">
              Name
              <input
                className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
                value={consult.client_name}
                onChange={(e) => setConsult({ ...consult, client_name: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold">
              Email
              <input
                className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
                value={consult.client_email || ""}
                onChange={(e) => setConsult({ ...consult, client_email: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold">
              Phone
              <input
                className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
                value={consult.client_phone || ""}
                onChange={(e) => setConsult({ ...consult, client_phone: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold md:col-span-2">
              Concerns (comma-separated)
              <input
                className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
                value={(consult.concern_tags || []).join(", ")}
                onChange={(e) =>
                  setConsult({
                    ...consult,
                    concern_tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            <label className="text-sm font-semibold md:col-span-2">
              Internal notes
              <textarea
                className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
                rows={3}
                value={consult.internal_notes || ""}
                onChange={(e) => setConsult({ ...consult, internal_notes: e.target.value })}
              />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                const saved = await patchConsult({
                  clientName: consult.client_name,
                  clientEmail: consult.client_email,
                  clientPhone: consult.client_phone,
                  concernTags: consult.concern_tags,
                  internalNotes: consult.internal_notes || "",
                });
                if (saved) setStep("screen");
              }}
              className="rounded-full border-2 border-black px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-[3px_3px_0_0_#000]"
              style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
            >
              {saving ? "Saving…" : "Save & continue to screen"}
            </button>
          </div>
        </StepCard>
      ) : null}

      {step === "screen" ? (
        <StepCard eyebrow="02 · Safety" title="Screening">
          {consult.vertical === "weight_loss" ? (
            <>
              <p className="text-sm text-black/65">
                Mirrors GLP-1 intake hard stops. BMI preview updates as you type.
                {bmi != null ? (
                  <span className="ml-2 font-bold" style={{ color: PINK }}>
                    BMI ≈ {bmi.toFixed(1)}
                  </span>
                ) : null}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {WEIGHT_LOSS_SCREEN_FIELDS.map((field) => (
                  <label key={field.id} className="text-sm font-semibold">
                    {field.label}
                    {field.type === "radio" ? (
                      <div className="mt-2 flex gap-3">
                        {(field.options || []).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              setConsult({
                                ...consult,
                                screening: {
                                  ...consult.screening,
                                  answers: { ...answers, [field.id]: opt },
                                },
                              })
                            }
                            className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold ${
                              answers[field.id] === opt
                                ? "border-black text-white"
                                : "border-black/20 bg-white"
                            }`}
                            style={answers[field.id] === opt ? { background: PINK } : undefined}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
                        placeholder={field.placeholder}
                        value={String(answers[field.id] ?? "")}
                        onChange={(e) =>
                          setConsult({
                            ...consult,
                            screening: {
                              ...consult.screening,
                              answers: { ...answers, [field.id]: e.target.value },
                            },
                          })
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-black/65">
              No hard clinical gate for this vertical in v1. Confirm concerns above, then continue.
              You can still document notes and create a proposal.
            </p>
          )}

          {consult.screening?.result ? (
            <div className="mt-4 rounded-2xl border-2 border-black/10 bg-[#FFF0F7] p-4 text-sm">
              <p className="font-bold">
                {consult.screening.result.qualified ? "Cleared for education" : "Hard stop flags"}
              </p>
              {consult.screening.result.disqualificationReasons?.length ? (
                <ul className="mt-2 list-disc pl-5 text-red-700">
                  {consult.screening.result.disqualificationReasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              ) : null}
              {consult.screening.result.providerFlags?.length ? (
                <ul className="mt-2 list-disc pl-5 text-amber-800">
                  {consult.screening.result.providerFlags.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              ) : null}
              {consult.screening.result.bmi != null ? (
                <p className="mt-2">BMI on file: {consult.screening.result.bmi.toFixed(1)}</p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 space-y-3 rounded-2xl border-2 border-black/10 p-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={Boolean(consult.screening?.staffOverride)}
                onChange={(e) =>
                  setConsult({
                    ...consult,
                    screening: {
                      ...consult.screening,
                      answers,
                      staffOverride: e.target.checked,
                    },
                  })
                }
              />
              Staff clinical override (allow propose despite hard stop)
            </label>
            {consult.screening?.staffOverride ? (
              <textarea
                className="w-full rounded-xl border-2 border-black/15 px-3 py-2 text-sm"
                rows={2}
                placeholder="Required: clinical rationale for override"
                value={consult.screening?.staffOverrideNote || ""}
                onChange={(e) =>
                  setConsult({
                    ...consult,
                    screening: {
                      ...consult.screening,
                      answers,
                      staffOverride: true,
                      staffOverrideNote: e.target.value,
                    },
                  })
                }
              />
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                const screening: ConsultScreening = {
                  answers:
                    consult.vertical === "weight_loss"
                      ? answers
                      : { noted: "No hard gate — staff confirmed" },
                  staffOverride: Boolean(consult.screening?.staffOverride),
                  staffOverrideNote: consult.screening?.staffOverrideNote,
                };
                const saved = await patchConsult({ screening });
                if (saved) {
                  if (saved.status === "disqualified" && !saved.screening?.staffOverride) {
                    setNotice("Marked disqualified — use override with a note to continue.");
                  } else {
                    setStep("educate");
                  }
                }
              }}
              className="rounded-full border-2 border-black px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-[3px_3px_0_0_#000]"
              style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
            >
              {saving ? "Saving…" : "Run screen & continue"}
            </button>
          </div>
        </StepCard>
      ) : null}

      {step === "educate" && slide ? (
        <StepCard
          dark
          eyebrow={`${slide.eyebrow || "Education"} · ${slideIndex + 1}/${pack.slides.length}`}
          title={slide.title}
        >
          <div className="mb-4 flex justify-end">
            <label className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <input
                type="checkbox"
                checked={covered.has(slide.id)}
                onChange={async (e) => {
                  const next = new Set(covered);
                  if (e.target.checked) next.add(slide.id);
                  else next.delete(slide.id);
                  await patchConsult({
                    educationProgress: {
                      coveredSlideIds: [...next],
                      currentSlideId: slide.id,
                      completedAt:
                        next.size >= pack.slides.length ? new Date().toISOString() : undefined,
                    },
                  });
                }}
              />
              Covered with client
            </label>
          </div>
          <p className="text-base leading-relaxed text-white/80 md:text-lg">{slide.body}</p>
          {slide.bullets?.length ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/75 md:text-base">
              {slide.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
          {slide.chips?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {slide.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-[#FFB8DC]"
                >
                  {c}
                </span>
              ))}
            </div>
          ) : null}
          {slide.talkingPoints?.length ? (
            <div className="mt-6 rounded-2xl border border-[#FFB8DC]/30 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
                Staff talking points
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/85">
                {slide.talkingPoints.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={slideIndex <= 0}
              onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={slideIndex >= pack.slides.length - 1}
              onClick={async () => {
                const next = new Set(covered);
                next.add(slide.id);
                await patchConsult({
                  educationProgress: {
                    coveredSlideIds: [...next],
                    currentSlideId: pack.slides[slideIndex + 1]?.id || slide.id,
                  },
                });
                setSlideIndex((i) => Math.min(pack.slides.length - 1, i + 1));
              }}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              Next slide
            </button>
            <button
              type="button"
              onClick={() => setStep("recommend")}
              className="rounded-full border-2 border-black px-5 py-2 text-xs font-black uppercase tracking-widest text-white"
              style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
            >
              Go to recommend
            </button>
          </div>
        </StepCard>
      ) : null}

      {step === "recommend" ? (
        <StepCard eyebrow="04 · Clinical" title="Recommend a path">
          <p className="text-sm text-black/65">
            Choosing a path seeds the proposal line items. You can still edit in the proposal builder.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {pack.paths.map((path) => {
              const selected = consult.recommendation?.pathId === path.id;
              return (
                <button
                  key={path.id}
                  type="button"
                  onClick={() =>
                    setConsult({
                      ...consult,
                      recommendation: {
                        pathId: path.id,
                        pathLabel: path.label,
                        serviceIds: path.serviceIds,
                        notes: consult.recommendation?.notes,
                      },
                    })
                  }
                  className={`rounded-2xl border-4 p-4 text-left transition ${
                    selected
                      ? "border-black bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]"
                      : "border-black/15 bg-white hover:border-black/40"
                  }`}
                >
                  <p className="font-black">{path.label}</p>
                  <p className="mt-1 text-sm text-black/70">{path.summary}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-black/45">
                    {path.serviceIds.join(" · ")}
                  </p>
                </button>
              );
            })}
          </div>
          <label className="mt-4 block text-sm font-semibold">
            Recommendation notes
            <textarea
              className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
              rows={3}
              value={consult.recommendation?.notes || ""}
              onChange={(e) =>
                setConsult({
                  ...consult,
                  recommendation: { ...consult.recommendation, notes: e.target.value },
                })
              }
            />
          </label>
          <button
            type="button"
            disabled={saving || (!consult.recommendation?.pathId && pack.paths.length > 0)}
            onClick={async () => {
              const recommendation =
                consult.recommendation?.pathId || pack.paths.length === 0
                  ? consult.recommendation
                  : {
                      pathId: pack.paths[0].id,
                      pathLabel: pack.paths[0].label,
                      serviceIds: pack.paths[0].serviceIds,
                      notes: consult.recommendation?.notes,
                    };
              const saved = await patchConsult({
                recommendation,
                status: "educated",
              });
              if (saved) setStep("propose");
            }}
            className="mt-4 rounded-full border-2 border-black px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-[3px_3px_0_0_#000] disabled:opacity-40"
            style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
          >
            {saving ? "Saving…" : "Save recommendation"}
          </button>
        </StepCard>
      ) : null}

      {step === "propose" ? (
        <StepCard eyebrow="05 · Decision" title="Create proposal">
          <p className="text-sm text-black/70">
            Path: <strong>{consult.recommendation?.pathLabel || "Not selected"}</strong>
            {(consult.recommendation?.serviceIds || []).length
              ? ` · ${(consult.recommendation?.serviceIds || []).join(", ")}`
              : null}
          </p>
          {!canPropose ? (
            <p className="mt-3 rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Screening is not clear. Go back to Screen and clear flags, or add a staff override with a
              clinical note.
            </p>
          ) : null}
          {consult.proposal_id ? (
            <Link
              href={`/admin/proposals/${consult.proposal_id}/edit`}
              className="mt-4 inline-flex rounded-full border-2 border-black px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-[3px_3px_0_0_#000]"
              style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
            >
              Open linked proposal
            </Link>
          ) : (
            <button
              type="button"
              disabled={proposing || (!canPropose && !consult.screening?.staffOverride)}
              onClick={() => void createProposal(Boolean(consult.screening?.staffOverride))}
              className="mt-4 rounded-full border-2 border-black px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-[3px_3px_0_0_#000] disabled:opacity-40"
              style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
            >
              {proposing ? "Creating…" : "Create proposal from consult"}
            </button>
          )}
        </StepCard>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t-4 border-black bg-[#0a0a0a]/95 px-4 py-3 text-white backdrop-blur md:left-[var(--admin-sidebar-width,0px)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-white/55">
            Covered slides: {covered.size}/{pack.slides.length}
            {canPropose ? " · Ready to propose" : " · Screening locked"}
          </p>
          <button
            type="button"
            disabled={proposing || Boolean(consult.proposal_id) || !canPropose}
            onClick={() => void createProposal()}
            className="rounded-full border-2 border-black px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-[3px_3px_0_0_#FFB8DC] disabled:opacity-40"
            style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
          >
            {consult.proposal_id ? "Proposal linked" : proposing ? "Creating…" : "Create proposal"}
          </button>
        </div>
      </div>
    </div>
  );
}
