"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { usePmuCanvas } from "@/components/education/pmu-practice/usePmuCanvas";
import {
  PMU_BRUSHES,
  PMU_PIGMENTS,
  PMU_PRACTICE_PATH,
  PMU_TEMPLATES,
  PMU_WORKFLOW,
  type PmuBrushCategory,
  type PmuBrushId,
  type PmuTemplateId,
} from "@/data/pmu-practice";
import { MICROBLADING_STUDY_GUIDE_PATH } from "@/data/microblading-study-guide";
import { BROW_MAPPING_PATH } from "@/data/brow-mapping-intelligence";

const CATEGORY_LABELS: Record<PmuBrushCategory, string> = {
  mapping: "Mapping brushes",
  outline: "Outline",
  strokes: "Stroke brushes",
  shading: "Shading brushes",
  tools: "Tools",
};

const BRAND = {
  plum: "#3E2B5E",
  pink: "#E6007E",
  hot: "#FF2D8E",
  soft: "#FFB8DC",
  navy: "#0a1628",
};

export function PmuPracticeStudio() {
  const [brushId, setBrushId] = useState<PmuBrushId>("mapping-solid");
  const [templateId, setTemplateId] = useState<PmuTemplateId>("front-face");
  const [showGuides, setShowGuides] = useState(true);
  const [pigmentId, setPigmentId] = useState(PMU_PIGMENTS[1]?.id ?? "espresso");
  const [activeStep, setActiveStep] = useState(1);

  const pigment = PMU_PIGMENTS.find((p) => p.id === pigmentId) ?? PMU_PIGMENTS[0];
  const activeBrush = PMU_BRUSHES.find((b) => b.id === brushId)!;

  const canvas = usePmuCanvas({
    templateId,
    showGuides,
    brushId,
    pigmentHex: pigment.hex,
    mappingColor: BRAND.pink,
  });

  const brushesByCategory = useMemo(() => {
    const groups = new Map<PmuBrushCategory, typeof PMU_BRUSHES>();
    for (const brush of PMU_BRUSHES) {
      const list = groups.get(brush.category) ?? [];
      list.push(brush);
      groups.set(brush.category, list);
    }
    return groups;
  }, []);

  const selectWorkflowStep = (step: number, brushIds: PmuBrushId[]) => {
    setActiveStep(step);
    if (brushIds[0]) setBrushId(brushIds[0]);
  };

  return (
    <div className="min-h-screen bg-[#120818] text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(230,0,126,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(62,43,94,0.5), transparent 50%), linear-gradient(180deg, #1a0f24 0%, #0a0610 100%)",
        }}
      />

      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">Internal training only</p>
            <h1 className="font-serif text-3xl md:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              PMU Practice Studio
            </h1>
            <p className="mt-1 max-w-xl text-sm text-white/65">
              Digital mapping, microblading strokes, nano, and shading — browser-based practice (works on iPad + Apple Pencil).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={MICROBLADING_STUDY_GUIDE_PATH}
              className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:border-[#FFB8DC] hover:text-[#FFB8DC]"
            >
              Study guide
            </Link>
            <Link
              href={BROW_MAPPING_PATH}
              className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:border-[#FFB8DC] hover:text-[#FFB8DC]"
            >
              Brow mapping
            </Link>
            <button
              type="button"
              onClick={() => canvas.exportPng()}
              className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-4 py-2 text-sm font-bold text-white shadow-lg"
            >
              Export PNG
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 lg:grid-cols-[240px_1fr_260px] md:px-6">
        {/* Brush library */}
        <aside className="space-y-4 rounded-2xl border border-white/10 bg-[#3E2B5E]/40 p-4 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">PMU brushset</p>
          {[...brushesByCategory.entries()].map(([category, brushes]) => (
            <div key={category}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">{CATEGORY_LABELS[category]}</p>
              <ul className="space-y-1">
                {brushes.map((brush) => (
                  <li key={brush.id}>
                    <button
                      type="button"
                      onClick={() => setBrushId(brush.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                        brushId === brush.id
                          ? "border-[#FF2D8E] bg-[#E6007E]/25 font-semibold text-white"
                          : "border-white/10 bg-black/20 text-white/80 hover:border-white/30"
                      }`}
                    >
                      {brush.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-relaxed text-white/70">
            <span className="font-bold text-[#FFB8DC]">{activeBrush.label}</span>
            <br />
            {activeBrush.description}
          </p>
        </aside>

        {/* Canvas workspace */}
        <main className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PMU_WORKFLOW.map((wf) => (
              <button
                key={wf.step}
                type="button"
                onClick={() => selectWorkflowStep(wf.step, wf.brushIds)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                  activeStep === wf.step
                    ? "border-[#FF2D8E] bg-[#E6007E]/30 text-white"
                    : "border-white/15 bg-black/30 text-white/60 hover:text-white"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3E2B5E] text-[10px]">{wf.step}</span>
                {wf.title}
              </button>
            ))}
          </div>

          <p className="text-sm text-[#FFB8DC]/90">{PMU_WORKFLOW.find((w) => w.step === activeStep)?.hint}</p>

          <div className="relative overflow-hidden rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <div ref={canvas.wrapRef} className="relative w-full bg-[#f5f0eb]">
              <canvas ref={canvas.bgRef} className="absolute inset-0 h-full w-full" aria-hidden />
              <canvas
                ref={canvas.drawRef}
                className="relative z-10 h-full w-full touch-none cursor-crosshair"
                onPointerDown={canvas.onPointerDown}
                onPointerMove={canvas.onPointerMove}
                onPointerUp={canvas.onPointerUp}
                onPointerLeave={canvas.onPointerLeave}
                aria-label="PMU practice canvas — draw with pointer or stylus"
              />
              {!canvas.ready ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 text-sm font-semibold">
                  Loading template…
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => canvas.undo()}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-white/50"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => canvas.clearDrawing()}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-white/50"
            >
              Clear strokes
            </button>
            <button
              type="button"
              onClick={() => setShowGuides((v) => !v)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-white/50"
            >
              {showGuides ? "Hide" : "Show"} mapping guides
            </button>
          </div>

          <p className="text-xs text-white/45">
            Tip: On iPad, open{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">{PMU_PRACTICE_PATH}</code> in Safari, add to Home Screen, and
            practice with Apple Pencil. Or use the offline HTML on your Desktop.
          </p>
        </main>

        {/* Right panel — templates + pigments */}
        <aside className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">Templates</p>
            <ul className="space-y-2">
              {PMU_TEMPLATES.map((tpl) => (
                <li key={tpl.id}>
                  <button
                    type="button"
                    onClick={() => setTemplateId(tpl.id)}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                      templateId === tpl.id
                        ? "border-[#FF2D8E] bg-[#E6007E]/20"
                        : "border-white/10 bg-white/5 hover:border-white/25"
                    }`}
                  >
                    <p className="text-sm font-bold">{tpl.label}</p>
                    <p className="text-xs text-white/55">{tpl.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">Color swatches</p>
            <p className="mb-3 text-xs text-white/55">Permablend-style brow palette for digital pigment practice.</p>
            <div className="grid grid-cols-2 gap-2">
              {PMU_PIGMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPigmentId(p.id)}
                  className={`overflow-hidden rounded-lg border text-left transition ${
                    pigmentId === p.id ? "border-[#FF2D8E] ring-2 ring-[#E6007E]/50" : "border-white/10"
                  }`}
                >
                  <div className="h-8 w-full" style={{ background: p.hex }} />
                  <div className="bg-white/5 px-2 py-1.5">
                    <p className="text-[11px] font-bold leading-tight">{p.name}</p>
                    <p className="text-[9px] text-white/50 leading-tight">{p.use}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E6007E]/40 bg-gradient-to-br from-[#3E2B5E] to-[#1a0f24] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">Techniques covered</p>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li>• Microblading hair strokes</li>
              <li>• Nano + nano fine</li>
              <li>• Powder / combo shading</li>
              <li>• Brow mapping geometry</li>
            </ul>
            <p className="mt-4 border-t border-white/10 pt-3 text-[10px] text-white/45">
              INTERNAL — NOT FOR CLIENT DISTRIBUTION · Hello Gorgeous Med Spa
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
