"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useBrowMappingCanvas } from "@/components/education/brow-mapping/useBrowMappingCanvas";
import { BrowShapeIcon } from "@/components/education/brow-mapping/BrowShapeIcon";
import {
  BROW_MAPPING_PATH,
  BROW_SHAPES,
  BROW_STYLE_PREVIEWS,
  FITZPATRICK_OPTIONS,
  GOAL_OPTIONS,
  HAIR_OPTIONS,
  PIGMENT_DIRECTION_LABELS,
  TINA_DAVIES_PIGMENTS,
  TINA_PIGMENT_BY_ID,
  UNDERTONE_OPTIONS,
  type BrowMappingIntake,
  type BrowMappingPlan,
  type BrowShapeId,
  type BrowStylePreviewId,
  type FitzpatrickType,
  type SkinUndertone,
  type TinaDaviesPigmentId,
} from "@/data/brow-mapping-intelligence";
import { MICROBLADING_STUDY_GUIDE_PATH } from "@/data/microblading-study-guide";
import { PMU_PRACTICE_PATH } from "@/data/pmu-practice";
import { buildBrowMappingPlan } from "@/lib/brow-mapping-intelligence/recommend";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function BrowMappingIntelligenceStudio() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [plan, setPlan] = useState<BrowMappingPlan | null>(null);

  const [fitzpatrick, setFitzpatrick] = useState<FitzpatrickType>("III");
  const [undertone, setUndertone] = useState<SkinUndertone>("neutral");
  const [naturalHair, setNaturalHair] = useState<BrowMappingIntake["naturalHair"]>("medium_brown");
  const [goalShape, setGoalShape] = useState<BrowMappingIntake["goalShape"]>("soft");
  const [stylePreview, setStylePreview] = useState<BrowStylePreviewId>("individual-strokes");
  const [browShape, setBrowShape] = useState<BrowShapeId>("arch");
  const [tinaPigmentId, setTinaPigmentId] = useState<TinaDaviesPigmentId>("medium-brown");
  const [oilySkin, setOilySkin] = useState(false);
  const [existingPmu, setExistingPmu] = useState(false);

  const selectedPigment = TINA_PIGMENT_BY_ID[tinaPigmentId];
  const pigmentHex = selectedPigment.hex;

  const canvas = useBrowMappingCanvas(imageSrc, { stylePreview, pigmentHex, browShape });

  const intake: BrowMappingIntake = useMemo(
    () => ({
      fitzpatrick,
      undertone,
      naturalHair,
      goalShape,
      oilySkin,
      existingPmu,
      stylePreview,
      browShape,
      tinaPigmentId,
    }),
    [browShape, existingPmu, fitzpatrick, goalShape, naturalHair, oilySkin, stylePreview, tinaPigmentId, undertone],
  );

  const refreshPlan = useCallback(() => {
    const g = canvas.getGeometry();
    if (!g) return;
    setPlan(buildBrowMappingPlan(g, intake));
  }, [canvas, intake]);

  useEffect(() => {
    if (canvas.geometry) refreshPlan();
  }, [canvas.geometry, intake, refreshPlan]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setPlan(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setUploadError("Use JPG, PNG, or WebP.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError("Image must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const activeStyle = BROW_STYLE_PREVIEWS.find((s) => s.id === stylePreview);
  const activeShape = BROW_SHAPES.find((s) => s.id === browShape);

  return (
    <div className="min-h-screen bg-[#120818] text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 15% 0%, rgba(230,0,126,0.2), transparent 55%), linear-gradient(180deg,#1a0f24,#0a0610)",
        }}
      />

      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4 px-4 py-5 md:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFB8DC]">Internal PMU · Chairside</p>
            <h1 className="font-serif text-3xl md:text-4xl">Brow Mapping Intelligence</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/65">
              Upload photo → map head/arch/tail → preview individual strokes, ombre, or hybrid on the client photo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={PMU_PRACTICE_PATH} className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-bold hover:border-[#FFB8DC]">
              Practice studio
            </Link>
            <Link href={MICROBLADING_STUDY_GUIDE_PATH} className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-bold hover:border-[#FFB8DC]">
              Study guide
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-5 px-4 py-6 lg:grid-cols-[1.15fr_1fr] md:px-6">
        <div className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#E6007E]/40 bg-[#E6007E]/10 px-4 py-6 hover:border-[#FF2D8E]">
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleFile} />
              <span className="text-sm font-bold text-[#FFB8DC]">
                {imageSrc ? "Replace photo" : "Upload client photo (front-facing)"}
              </span>
            </label>
            {uploadError ? <p className="mt-2 text-sm text-red-400">{uploadError}</p> : null}
          </section>

          {/* 7 brow shapes */}
          <section className="rounded-2xl border border-white/10 bg-[#3E2B5E]/35 p-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#FFB8DC]">7 brow shapes · on face</h2>
            <p className="mt-1 text-[11px] text-white/50">Tap a shape to preview strokes on the mapped brow zone.</p>
            <img
              src="/handouts/education/brow-shapes-7-reference.png"
              alt="7 brow shape reference chart"
              className="mt-3 max-w-[220px] rounded-xl border-2 border-black opacity-90"
            />
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {BROW_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => setBrowShape(shape.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2 transition ${
                    browShape === shape.id
                      ? "border-[#FF2D8E] bg-[#E6007E]/25 ring-2 ring-[#E6007E]/40"
                      : "border-white/15 bg-black/20 hover:border-white/35"
                  }`}
                >
                  <BrowShapeIcon shapeId={shape.id} active={browShape === shape.id} />
                  <span className="text-[11px] font-bold">{shape.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Tina Davies pigments */}
          <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#FFB8DC]">Tina Davies · I ❤️ INK</h2>
            <p className="mt-1 text-[11px] text-white/50">Preview color on strokes — verify shade names before ordering.</p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-3">
              {TINA_DAVIES_PIGMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTinaPigmentId(p.id)}
                  className={`overflow-hidden rounded-lg border text-left transition ${
                    tinaPigmentId === p.id ? "border-[#FF2D8E] ring-2 ring-[#E6007E]/50" : "border-white/10"
                  }`}
                >
                  <div className="h-7 w-full" style={{ background: p.hex }} />
                  <div className="bg-white/5 px-2 py-1.5">
                    <p className="text-[10px] font-bold leading-tight">{p.name}</p>
                    <p className="text-[9px] text-white/45">{p.line}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[#FFB8DC]">
              Active: {selectedPigment.name} — {selectedPigment.use}
            </p>
          </section>

          {/* Style preview selector — updates canvas live */}
          <section className="rounded-2xl border border-white/10 bg-[#3E2B5E]/35 p-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#FFB8DC]">Preview style on photo</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {BROW_STYLE_PREVIEWS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStylePreview(s.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    stylePreview === s.id
                      ? "border-[#FF2D8E] bg-[#E6007E]/25 ring-2 ring-[#E6007E]/40"
                      : "border-white/15 bg-black/20 hover:border-white/35"
                  }`}
                >
                  <p className="text-sm font-bold">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-white/55 leading-snug">{s.description}</p>
                </button>
              ))}
            </div>
            {activeStyle && stylePreview !== "mapping-only" ? (
              <p className="mt-3 rounded-lg bg-[#E6007E]/15 px-3 py-2 text-xs text-[#FFB8DC]">
                Live preview: {activeShape?.label} · {selectedPigment.name} · {activeStyle.label}
              </p>
            ) : null}
          </section>

          <div className="overflow-hidden rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <div ref={canvas.wrapRef} className="relative w-full bg-black">
              {!imageSrc ? (
                <div className="flex aspect-[3/4] items-center justify-center text-sm text-white/40">
                  Mapping + style preview appears after upload
                </div>
              ) : (
                <>
                  <canvas
                    ref={canvas.canvasRef}
                    className="block w-full touch-none"
                    onPointerDown={canvas.onPointerDown}
                    onPointerMove={canvas.onPointerMove}
                    onPointerUp={canvas.onPointerUp}
                    onPointerLeave={canvas.onPointerUp}
                    aria-label="Brow mapping canvas"
                  />
                  {!canvas.ready && !canvas.error ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm">Detecting face…</div>
                  ) : null}
                  {canvas.error ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center text-sm text-red-300">
                      {canvas.error}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => canvas.setShowOverlay((v) => !v)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold"
            >
              {canvas.showOverlay ? "Hide" : "Show"} mapping lines
            </button>
            <button type="button" onClick={canvas.resetMapping} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold">
              Reset auto-map
            </button>
            <button type="button" onClick={canvas.exportPng} className="rounded-full bg-[#E6007E] px-4 py-2 text-sm font-bold">
              Export PNG
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-[#3E2B5E]/35 p-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#FFB8DC]">Client profile</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-xs">
                Fitzpatrick
                <select
                  value={fitzpatrick}
                  onChange={(e) => setFitzpatrick(e.target.value as FitzpatrickType)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-white"
                >
                  {FITZPATRICK_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs">
                Undertone
                <select
                  value={undertone}
                  onChange={(e) => setUndertone(e.target.value as SkinUndertone)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-white"
                >
                  {UNDERTONE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs sm:col-span-2">
                Natural hair
                <select
                  value={naturalHair}
                  onChange={(e) => setNaturalHair(e.target.value as BrowMappingIntake["naturalHair"])}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-white"
                >
                  {HAIR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-3 text-xs font-bold uppercase text-white/45">Brow goal</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setGoalShape(o.value)}
                  className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
                    goalShape === o.value ? "border-[#FF2D8E] bg-[#E6007E]/30" : "border-white/15 hover:border-white/40"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={oilySkin} onChange={(e) => setOilySkin(e.target.checked)} />
                Oily skin
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={existingPmu} onChange={(e) => setExistingPmu(e.target.checked)} />
                Existing PMU / correction
              </label>
            </div>
          </section>

          {!plan ? (
            <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-white/45">
              Upload a photo — plan updates automatically when mapping is ready.
            </div>
          ) : (
            <>
              <section className="rounded-2xl border border-[#FF2D8E]/50 bg-[#E6007E]/10 p-4">
                <h3 className="font-black text-[#FFB8DC]">Selected preview</h3>
                <p className="mt-1 text-lg font-bold">
                  {activeShape?.label} · {selectedPigment.name}
                </p>
                <p className="text-sm text-white/70">
                  {activeStyle?.label} — {activeShape?.hint}
                </p>
              </section>

              <section className="rounded-2xl border border-[#E6007E]/40 bg-black/40 p-4">
                <h3 className="font-black text-[#FFB8DC]">Asymmetry findings</h3>
                <ul className="mt-3 space-y-3">
                  {plan.asymmetry.map((a) => (
                    <li key={a.id} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
                      <p className="font-bold">
                        {a.title}
                        <span className="ml-2 text-[10px] uppercase text-white/40">{a.severity}</span>
                      </p>
                      <p className="mt-1 text-white/70">{a.detail}</p>
                      <p className="mt-2 text-[#FFB8DC]">→ {a.adjust}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-black text-[#FFB8DC]">Pigment direction</h3>
                <p className="mt-2 text-2xl font-black">{PIGMENT_DIRECTION_LABELS[plan.pigment.direction]}</p>
                <p className="mt-2 text-sm text-white/80">
                  <strong>Start:</strong> {plan.pigment.startingFamily}
                </p>
                {plan.pigment.modifiers.map((m) => (
                  <p key={m} className="mt-1 text-sm text-white/65">• {m}</p>
                ))}
                <p className="mt-3 rounded-lg border-l-4 border-[#E6007E] bg-[#E6007E]/10 px-3 py-2 text-sm">{plan.pigment.healWatch}</p>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                <h3 className="font-black text-[#FFB8DC]">Technique & shape</h3>
                <p className="mt-2 font-bold capitalize">{plan.technique.replace("_", " ")}</p>
                <p className="text-white/75">{plan.technique_rationale}</p>
                <p className="mt-3 text-white/85">{plan.shape_guidance}</p>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-black text-[#FFB8DC]">What to offer</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {plan.offers.map((o) => (
                    <li key={o.title}>
                      <strong>{o.title}</strong> — {o.detail}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#0a1628] p-4 text-sm">
                <h3 className="font-black text-[#FFB8DC]">Say to client</h3>
                <p className="mt-2 leading-relaxed text-white/85">{plan.client_script}</p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
