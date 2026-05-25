"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BrowCanvas } from "@/components/admin/brow-mapping/BrowCanvas";
import { BrowPlanSummary } from "@/components/admin/brow-mapping/BrowPlanSummary";
import { BrowShapePicker } from "@/components/admin/brow-mapping/BrowShapePicker";
import { ClientProfilePanel } from "@/components/admin/brow-mapping/ClientProfilePanel";
import { PigmentPicker } from "@/components/admin/brow-mapping/PigmentPicker";
import { useBrowCanvas } from "@/components/admin/brow-mapping/useBrowCanvas";
import {
  BROW_SHAPES,
  BROW_STYLE_PREVIEWS,
  type BrowMappingIntake,
  type BrowMappingPlan,
  type BrowShapeId,
  type BrowStylePreviewId,
  type FitzpatrickType,
  type SkinUndertone,
  type TinaDaviesPigmentId,
} from "@/data/brow-mapping-intelligence";
import { BROW_INTAKE_PATH } from "@/data/brow-mapping-intelligence";
import { buildBrowMappingPlan } from "@/lib/brow-mapping-intelligence/recommend";
import {
  exportCombinedBrandedPreview,
  exportConsultationSummaryPdf,
  metaFromPlan,
} from "@/lib/brow-mapping/export";
import { CLINICAL_DISCLAIMER, PRIVACY_NOTICE, TINA_PIGMENT_BY_ID } from "@/lib/brow-mapping/pigments";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

export function BrowMappingTool() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [plan, setPlan] = useState<BrowMappingPlan | null>(null);
  const [planGenerated, setPlanGenerated] = useState(false);

  const [fitzpatrick, setFitzpatrick] = useState<FitzpatrickType>("III");
  const [undertone, setUndertone] = useState<SkinUndertone>("neutral");
  const [naturalHair, setNaturalHair] = useState<BrowMappingIntake["naturalHair"]>("medium_brown");
  const [goalShape, setGoalShape] = useState<BrowMappingIntake["goalShape"]>("soft");
  const [stylePreview, setStylePreview] = useState<BrowStylePreviewId>("individual-strokes");
  const [browShape, setBrowShape] = useState<BrowShapeId>("arch");
  const [tinaPigmentId, setTinaPigmentId] = useState<TinaDaviesPigmentId>("medium-brown");
  const [oilySkin, setOilySkin] = useState(false);
  const [existingPmu, setExistingPmu] = useState(false);

  const selectedPigment = TINA_PIGMENT_BY_ID[tinaPigmentId] ?? TINA_PIGMENT_BY_ID["medium-brown"];
  const activeShape = BROW_SHAPES.find((s) => s.id === browShape);
  const activeStyle = BROW_STYLE_PREVIEWS.find((s) => s.id === stylePreview);

  const canvas = useBrowCanvas(imageSrc, {
    stylePreview,
    pigmentHex: selectedPigment.hex,
    browShape,
    shapeLabel: activeShape?.label,
    pigmentName: selectedPigment.name,
    techniqueLabel: activeStyle?.label,
  });

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

  const generatePlan = useCallback(() => {
    const g = canvas.getGeometry();
    if (!g) return;
    setPlan(buildBrowMappingPlan(g, intake));
    setPlanGenerated(true);
  }, [canvas, intake]);

  useEffect(() => {
    if (canvas.geometry && planGenerated) generatePlan();
  }, [canvas.geometry, generatePlan, intake, planGenerated]);

  const loadFile = useCallback((file: File | undefined) => {
    setUploadError(null);
    setPlan(null);
    setPlanGenerated(false);
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setUploadError("Use JPG, PNG, or WebP.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError("Image must be under 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const exportMeta = plan ? metaFromPlan(plan, intake) : null;

  return (
    <div className="mx-auto max-w-[1500px] space-y-4 p-4 md:p-6">
      <header className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">Internal consultation tool</p>
        <h1 className="text-2xl font-black text-black md:text-3xl">Brow Mapping Intelligence</h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-600">
          Upload or capture a client photo, map head/arch/tail, preview shape, pigment, and technique — then export a branded consultation summary.
        </p>
        <p className="mt-3 rounded-lg border border-[#FFB8DC] bg-[#FFF0F7] px-3 py-2 text-xs text-black">{PRIVACY_NOTICE}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={BROW_INTAKE_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#E6007E] bg-white px-4 py-1.5 text-xs font-bold text-[#E6007E] hover:bg-[#FFF0F7]"
          >
            Open client brow intake (iPad)
          </a>
        </div>
        <p className="mt-2 text-[11px] text-gray-500">{CLINICAL_DISCLAIMER}</p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[280px_1fr_360px]">
        <aside className="space-y-4">
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#E6007E]">Photo</h2>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg border-2 border-dashed border-[#E6007E]/40 bg-[#FFF0F7] px-3 py-3 text-sm font-bold text-[#E6007E]"
              >
                {imageSrc ? "Replace photo" : "Upload client photo"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => loadFile(e.target.files?.[0])} />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold"
              >
                Take photo (camera)
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => loadFile(e.target.files?.[0])}
              />
              <button type="button" onClick={canvas.enableManualMode} className="w-full rounded-lg bg-black px-3 py-2 text-sm font-bold text-white">
                Manual mapping mode
              </button>
            </div>
            {uploadError ? <p className="mt-2 text-xs text-red-600">{uploadError}</p> : null}
          </section>

          <BrowShapePicker value={browShape} onChange={setBrowShape} />
          <PigmentPicker value={tinaPigmentId} onChange={setTinaPigmentId} />
        </aside>

        <main className="space-y-4">
          <BrowCanvas canvas={canvas} imageSrc={imageSrc} />
          {activeStyle && stylePreview !== "mapping-only" ? (
            <p className="rounded-lg bg-[#FFF0F7] px-3 py-2 text-xs text-[#E6007E]">
              Live preview: {activeShape?.label} · {selectedPigment.name} · {activeStyle.label}
            </p>
          ) : null}
        </main>

        <aside className="space-y-4">
          <ClientProfilePanel
            fitzpatrick={fitzpatrick}
            undertone={undertone}
            naturalHair={naturalHair}
            goalShape={goalShape}
            stylePreview={stylePreview}
            oilySkin={oilySkin}
            existingPmu={existingPmu}
            onFitzpatrick={setFitzpatrick}
            onUndertone={setUndertone}
            onHair={setNaturalHair}
            onGoal={setGoalShape}
            onStyle={setStylePreview}
            onOilySkin={setOilySkin}
            onExistingPmu={setExistingPmu}
          />

          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <button
              type="button"
              onClick={generatePlan}
              disabled={!canvas.geometry}
              className="w-full rounded-lg bg-[#E6007E] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
            >
              Generate mapping plan
            </button>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={canvas.exportPng}
                disabled={!canvas.geometry}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Export mapped photo PNG
              </button>
              <button
                type="button"
                disabled={!plan || !exportMeta}
                onClick={() => plan && exportMeta && exportConsultationSummaryPdf(plan, exportMeta)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Export consultation summary PDF
              </button>
              <button
                type="button"
                disabled={!plan || !exportMeta || !canvas.renderExportCanvas()}
                onClick={() => {
                  const photo = canvas.renderExportCanvas();
                  if (plan && exportMeta && photo) exportCombinedBrandedPreview(photo, plan, exportMeta);
                }}
                className="rounded-lg border border-black bg-black px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                Export combined branded preview
              </button>
            </div>
          </section>

          {plan ? <BrowPlanSummary plan={plan} intake={intake} /> : null}
        </aside>
      </div>
    </div>
  );
}
