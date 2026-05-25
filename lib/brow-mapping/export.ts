import { jsPDF } from "jspdf";

import type {
  BrowMappingGeometry,
  BrowMappingIntake,
  BrowMappingPlan,
  BrowShapeId,
  BrowStylePreviewId,
} from "@/data/brow-mapping-intelligence";
import { BROW_SHAPES, BROW_STYLE_PREVIEWS } from "@/data/brow-mapping-intelligence";
import { scaleGeometry } from "@/lib/brow-mapping/coordinates";
import { drawBrowMappingOverlay } from "@/lib/brow-mapping/geometry";
import { CLINICAL_DISCLAIMER, PIGMENT_PREVIEW_DISCLAIMER, TINA_PIGMENT_BY_ID } from "@/lib/brow-mapping/pigments";
import { drawBrowStylePreview } from "@/lib/brow-mapping/style-preview";

export const HG_BRAND = {
  name: "Hello Gorgeous Med Spa",
  website: "hellogorgeousmedspa.com",
  phone: "630-636-6193",
  location: "Oswego, IL",
  pink: "#E6007E",
  softPink: "#FFB8DC",
  black: "#000000",
};

export type BrowExportMeta = {
  shapeId: string;
  shapeLabel: string;
  pigmentId: string;
  pigmentName: string;
  pigmentHex: string;
  techniqueLabel: string;
  fitzpatrick: string;
  undertone: string;
  hair: string;
  oilySkin: boolean;
  existingPmu: boolean;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export type RenderBrowCanvasOptions = {
  stylePreview: BrowStylePreviewId;
  pigmentHex: string;
  browShape: BrowShapeId;
  showMappingLines: boolean;
  showLabels: boolean;
  showPigmentPreview: boolean;
  shapeLabel?: string;
  pigmentName?: string;
  techniqueLabel?: string;
  maxWidth?: number;
};

/** High-resolution render pass using image-space geometry. */
export function renderBrowCanvas(
  image: HTMLImageElement,
  geometry: BrowMappingGeometry,
  options: RenderBrowCanvasOptions,
): HTMLCanvasElement {
  const maxW = options.maxWidth ?? image.naturalWidth;
  const scale = maxW / image.naturalWidth;
  const w = Math.round(image.naturalWidth * scale);
  const h = Math.round(image.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.drawImage(image, 0, 0, w, h);
  const displayGeo = scaleGeometry(geometry, scale);

  if (options.showMappingLines) {
    drawBrowMappingOverlay(ctx, displayGeo, { showLabels: options.showLabels });
  }
  if (options.showPigmentPreview && options.stylePreview !== "mapping-only") {
    drawBrowStylePreview(ctx, displayGeo, options.stylePreview, options.pigmentHex, options.browShape);
  }

  if (options.shapeLabel) {
    const caption = [options.shapeLabel, options.pigmentName, options.techniqueLabel].filter(Boolean).join(" · ");
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(12, h - 52, Math.min(w - 24, 460), 40);
    ctx.fillStyle = HG_BRAND.softPink;
    ctx.font = "bold 14px system-ui,sans-serif";
    ctx.fillText(caption, 20, h - 28);
    ctx.restore();
  }

  return canvas;
}

export function exportMappedPhotoPng(canvas: HTMLCanvasElement, prefix = "hg-brow-map") {
  downloadDataUrl(canvas.toDataURL("image/png"), `${prefix}-${Date.now()}.png`);
}

export function buildConsultationSummaryPdf(plan: BrowMappingPlan, meta: BrowExportMeta): Uint8Array {
  const doc = new jsPDF({ format: "letter", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 48;
  const maxWidth = pageWidth - marginX * 2;
  let y = 56;

  const write = (text: string, size = 11, color = "#000000", lineHeight = 15) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, marginX, y);
    y += lines.length * lineHeight;
  };

  const heading = (text: string) => {
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(HG_BRAND.pink);
    doc.text(text, marginX, y);
    y += 18;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(HG_BRAND.pink);
  doc.text(HG_BRAND.name.toUpperCase(), marginX, y);
  y += 22;
  doc.setFontSize(14);
  doc.setTextColor("#000");
  doc.text("Brow Design Plan", marginX, y);
  y += 16;
  write(`${HG_BRAND.website} · ${HG_BRAND.phone} · ${HG_BRAND.location}`, 10, "#444444", 13);
  y += 8;

  heading("Design selections");
  write(`Shape: ${meta.shapeLabel}`);
  write(`Technique: ${meta.techniqueLabel}`);
  write(`Pigment preview: ${meta.pigmentName}`);
  write(`Skin profile: Fitzpatrick ${meta.fitzpatrick}, ${meta.undertone} undertone`);
  write(`Hair: ${meta.hair.replace("_", " ")}`);
  write(`Oily skin: ${meta.oilySkin ? "Yes" : "No"}`);
  write(`Existing PMU: ${meta.existingPmu ? "Yes" : "No"}`);

  heading("Asymmetry notes");
  plan.asymmetry.forEach((a) => write(`• ${a.title}: ${a.detail} → ${a.adjust}`));

  heading("Pigment direction");
  write(`${plan.pigment.directionLabel} — ${plan.pigment.startingFamily}`);
  plan.pigment.modifiers.forEach((m) => write(`• ${m}`));
  write(plan.pigment.healWatch);

  heading("Client script");
  write(plan.client_script);

  heading("Reminders");
  plan.offers.forEach((o) => write(`• ${o.title}: ${o.detail}`));
  write("Final healed results vary. Touch-up is recommended at 6–8 weeks.");

  y += 10;
  write(PIGMENT_PREVIEW_DISCLAIMER, 9, "#666666", 12);
  y += 4;
  write(CLINICAL_DISCLAIMER, 9, "#666666", 12);

  return new Uint8Array(doc.output("arraybuffer"));
}

export function exportConsultationSummaryPdf(plan: BrowMappingPlan, meta: BrowExportMeta) {
  const bytes = buildConsultationSummaryPdf(plan, meta);
  const blob = new Blob([bytes], { type: "application/pdf" });
  downloadBlob(blob, `hg-brow-plan-${Date.now()}.pdf`);
}

export function exportCombinedBrandedPreview(
  photoCanvas: HTMLCanvasElement,
  plan: BrowMappingPlan,
  meta: BrowExportMeta,
) {
  const doc = new jsPDF({ format: "letter", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let y = 44;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(HG_BRAND.pink);
  doc.text(HG_BRAND.name, marginX, y);
  y += 18;
  doc.setFontSize(10);
  doc.setTextColor("#444");
  doc.text(`${HG_BRAND.website} · ${HG_BRAND.phone} · ${HG_BRAND.location}`, marginX, y);
  y += 24;

  const imgData = photoCanvas.toDataURL("image/jpeg", 0.92);
  const imgW = pageWidth - marginX * 2;
  const imgH = (photoCanvas.height / photoCanvas.width) * imgW;
  const maxImgH = 340;
  const fitScale = imgH > maxImgH ? maxImgH / imgH : 1;
  doc.addImage(imgData, "JPEG", marginX, y, imgW * fitScale, imgH * fitScale);
  y += imgH * fitScale + 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor("#000");
  doc.text(`Shape: ${meta.shapeLabel}`, marginX, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.text(`Technique: ${meta.techniqueLabel}`, marginX, y);
  y += 14;
  doc.text(`Pigment preview: ${meta.pigmentName}`, marginX, y);
  y += 14;
  doc.text(`Skin: Fitzpatrick ${meta.fitzpatrick} · ${meta.undertone} · ${meta.hair.replace("_", " ")}`, marginX, y);
  y += 20;

  doc.setFontSize(9);
  doc.setTextColor("#666");
  const disclaimer = `${PIGMENT_PREVIEW_DISCLAIMER} ${CLINICAL_DISCLAIMER}`;
  doc.text(doc.splitTextToSize(disclaimer, pageWidth - marginX * 2), marginX, y);

  const blob = new Blob([doc.output("arraybuffer")], { type: "application/pdf" });
  downloadBlob(blob, `hg-brow-preview-${Date.now()}.pdf`);
}

export function metaFromPlan(plan: BrowMappingPlan, intake: BrowMappingIntake): BrowExportMeta {
  const shape = BROW_SHAPES.find((s) => s.id === intake.browShape);
  const style = BROW_STYLE_PREVIEWS.find((s) => s.id === intake.stylePreview);
  const pigment = TINA_PIGMENT_BY_ID[intake.tinaPigmentId];
  return {
    shapeId: intake.browShape,
    shapeLabel: shape?.label ?? "Arch",
    pigmentId: intake.tinaPigmentId,
    pigmentName: pigment?.name ?? "Medium Brown",
    pigmentHex: pigment?.hex ?? "#6b4f3a",
    techniqueLabel: style?.label ?? plan.technique,
    fitzpatrick: intake.fitzpatrick,
    undertone: intake.undertone,
    hair: intake.naturalHair,
    oilySkin: intake.oilySkin,
    existingPmu: intake.existingPmu,
  };
}
