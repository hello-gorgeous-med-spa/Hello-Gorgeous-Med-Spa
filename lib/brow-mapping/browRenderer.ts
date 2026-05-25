import type { BrowMappingGeometry, BrowShapeId, BrowStylePreviewId } from "@/data/brow-mapping-intelligence";

import type { BrowPreviewState } from "@/lib/brow-mapping/browState";
import {
  fitBrowShapeToGeometry,
  getBrowShapeTemplate,
  spinePoint,
  type FittedBrowSide,
} from "@/lib/brow-mapping/browShapeTemplates";
import { drawBrowMappingOverlay, type DraggablePointId } from "@/lib/brow-mapping/geometry";

const HG_PINK = "#E6007E";
const HG_HOT = "#FF2D8E";

function seeded(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function browScale(side: FittedBrowSide): number {
  const { head, tail } = side;
  return Math.max(0.65, Math.min(2.2, Math.hypot(tail.x - head.x, tail.y - head.y) / 100));
}

function traceBrowPolygon(ctx: CanvasRenderingContext2D, side: FittedBrowSide) {
  ctx.beginPath();
  ctx.moveTo(side.top[0].x, side.top[0].y);
  for (let i = 1; i < side.top.length; i++) ctx.lineTo(side.top[i].x, side.top[i].y);
  for (let i = side.bottom.length - 1; i >= 0; i--) ctx.lineTo(side.bottom[i].x, side.bottom[i].y);
  ctx.closePath();
}

function drawHairStroke(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number,
  len: number,
  color: string,
  width: number,
  alpha: number,
) {
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.quadraticCurveTo(
    cx + Math.cos(angle) * len * 0.45,
    cy + Math.sin(angle) * len * 0.45,
    cx + Math.cos(angle + 0.4) * len,
    cy + Math.sin(angle + 0.4) * len,
  );
  ctx.stroke();
}

function drawSideStrokes(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  shapeId: BrowShapeId,
  color: string,
  seedBase: number,
  intensity: number,
) {
  const template = getBrowShapeTemplate(shapeId);
  const sc = browScale(side);
  const count = Math.floor(28 * sc * intensity);
  const { head, arch, tail } = side;

  for (let i = 0; i < count; i++) {
    const seed = seedBase + i * 1.7;
    const u = 0.03 + (0.94 * i) / Math.max(count - 1, 1);
    const { p, tangent } = spinePoint(head, arch, tail, u);
    const bias = template.strokeAngleBias(u);
    const angle = tangent + Math.PI / 2 + bias + (seeded(seed) - 0.5) * 0.28;
    const fan = u < 0.22 ? template.headFanStrength : 1;
    const nx = -Math.sin(tangent);
    const ny = -Math.cos(tangent);
    const off = (seeded(seed + 1) - 0.5) * 14 * sc * fan;
    const cx = p.x + nx * off;
    const cy = p.y + ny * off;
    const len = (9 + seeded(seed + 2) * 14) * sc * (0.9 + fan * 0.1);
    drawHairStroke(
      ctx,
      cx,
      cy,
      angle,
      len,
      color,
      (0.85 + seeded(seed + 3) * 0.7) * sc,
      0.62 + seeded(seed + 4) * 0.35,
    );
  }
  ctx.globalAlpha = 1;
}

function drawSideOmbre(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  shapeId: BrowShapeId,
  color: string,
  seedBase: number,
  intensity: number,
) {
  const template = getBrowShapeTemplate(shapeId);
  const sc = browScale(side);
  const { head, arch, tail } = side;
  const steps = 32;

  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const { p, tangent } = spinePoint(head, arch, tail, u);
    const nx = -Math.sin(tangent);
    const ny = -Math.cos(tangent);
    const alpha = (0.22 + u * 0.55) * intensity;
    const band = (6 + u * 12) * sc;

    for (let j = -5; j <= 5; j++) {
      const seed = seedBase + i * 0.35 + j;
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha * (0.65 + seeded(seed) * 0.35) * (u < 0.18 ? template.headFanStrength * 0.45 + 0.55 : 1);
      ctx.beginPath();
      ctx.arc(
        p.x + nx * j * 3.2 * sc + (seeded(seed + 0.5) - 0.5) * 2,
        p.y + ny * j * 3.2 * sc + (seeded(seed + 0.7) - 0.5) * 2,
        band * 0.16,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  ctx.fillStyle = withAlpha(color, 0.22 * intensity);
  traceBrowPolygon(ctx, side);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawMappingStamp(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  strokeColor: string,
) {
  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  traceBrowPolygon(ctx, side);
  ctx.stroke();
  const { head, arch, tail } = side;
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(head.x, head.y);
  ctx.quadraticCurveTo(arch.x, arch.y, tail.x, tail.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawGhostStamp(ctx: CanvasRenderingContext2D, side: FittedBrowSide) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.72)";
  ctx.lineWidth = 2;
  traceBrowPolygon(ctx, side);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fill();
  ctx.restore();
}

function drawStampSide(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  shapeId: BrowShapeId,
  technique: BrowStylePreviewId,
  pigmentHex: string,
  showPigment: boolean,
  seedBase: number,
) {
  ctx.save();
  traceBrowPolygon(ctx, side);
  ctx.clip();

  if (!showPigment) {
    ctx.restore();
    return;
  }

  switch (technique) {
    case "mapping-only":
      drawMappingStamp(ctx, side, HG_HOT);
      break;
    case "individual-strokes":
      ctx.fillStyle = withAlpha(pigmentHex, 0.12);
      ctx.fill();
      drawSideStrokes(ctx, side, shapeId, pigmentHex, seedBase, 1);
      ctx.strokeStyle = withAlpha(pigmentHex, 0.45);
      ctx.lineWidth = 1.2;
      traceBrowPolygon(ctx, side);
      ctx.stroke();
      break;
    case "ombre":
      drawSideOmbre(ctx, side, shapeId, pigmentHex, seedBase, 1);
      ctx.strokeStyle = withAlpha(pigmentHex, 0.4);
      ctx.lineWidth = 1;
      traceBrowPolygon(ctx, side);
      ctx.stroke();
      break;
    case "hybrid":
      drawSideOmbre(ctx, side, shapeId, pigmentHex, seedBase + 90, 0.85);
      drawSideStrokes(ctx, side, shapeId, pigmentHex, seedBase, 0.9);
      ctx.strokeStyle = withAlpha(pigmentHex, 0.38);
      ctx.lineWidth = 1;
      traceBrowPolygon(ctx, side);
      ctx.stroke();
      break;
  }

  ctx.restore();
}

/** Draw brow stamp layer (always when geometry exists). */
export function renderBrowStampLayer(
  ctx: CanvasRenderingContext2D,
  geometry: BrowMappingGeometry,
  shapeId: BrowShapeId,
  technique: BrowStylePreviewId,
  pigmentHex: string,
  showPigmentPreview: boolean,
) {
  const fitted = fitBrowShapeToGeometry(geometry, shapeId);

  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  [fitted.left, fitted.right].forEach((side, idx) => {
    const seedBase = side.head.x * 0.13 + side.head.y * 0.11 + idx * 700 + shapeId.length * 17;
    if (showPigmentPreview) {
      drawStampSide(ctx, side, shapeId, technique, pigmentHex, true, seedBase);
    } else {
      drawGhostStamp(ctx, side);
    }
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}

/** Full photo frame: stamp + optional mapping guides. */
export function renderBrowPreviewFrame(
  ctx: CanvasRenderingContext2D,
  geometry: BrowMappingGeometry,
  state: Pick<
    BrowPreviewState,
    | "selectedShape"
    | "selectedTechnique"
    | "pigmentHex"
    | "showMappingGuides"
    | "showPigmentPreview"
    | "showLabels"
    | "activePoint"
    | "dragging"
  >,
) {
  renderBrowStampLayer(
    ctx,
    geometry,
    state.selectedShape,
    state.selectedTechnique,
    state.pigmentHex,
    state.showPigmentPreview,
  );

  if (state.showMappingGuides) {
    drawBrowMappingOverlay(ctx, geometry, {
      showLabels: state.showLabels,
      activePoint: state.dragging ?? state.activePoint,
    });
  }
}

export type { DraggablePointId };
