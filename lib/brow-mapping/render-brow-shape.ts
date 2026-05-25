import type { BrowMappingGeometry, BrowMappingPoint, BrowShapeId, BrowStylePreviewId } from "@/data/brow-mapping-intelligence";

import {
  fitBrowShapeToGeometry,
  getBrowShapeTemplate,
  spinePoint,
  type FittedBrowSide,
} from "@/lib/brow-mapping/browShapeTemplates";

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

function traceBrowPolygon(ctx: CanvasRenderingContext2D, side: FittedBrowSide) {
  ctx.beginPath();
  ctx.moveTo(side.top[0].x, side.top[0].y);
  for (let i = 1; i < side.top.length; i++) ctx.lineTo(side.top[i].x, side.top[i].y);
  for (let i = side.bottom.length - 1; i >= 0; i--) ctx.lineTo(side.bottom[i].x, side.bottom[i].y);
  ctx.closePath();
}

function drawShapeOutline(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  color: string,
  lineWidth: number,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  traceBrowPolygon(ctx, side);
  ctx.stroke();
  ctx.restore();
}

function drawShapeFill(ctx: CanvasRenderingContext2D, side: FittedBrowSide, fill: string) {
  ctx.save();
  ctx.fillStyle = fill;
  traceBrowPolygon(ctx, side);
  ctx.fill();
  ctx.restore();
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
    cx + Math.cos(angle) * len * 0.4,
    cy + Math.sin(angle) * len * 0.4,
    cx + Math.cos(angle + 0.35) * len,
    cy + Math.sin(angle + 0.35) * len,
  );
  ctx.stroke();
}

function drawSideStrokes(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  shapeId: BrowShapeId,
  color: string,
  density: number,
  seedBase: number,
) {
  const template = getBrowShapeTemplate(shapeId);
  const count = Math.floor(density * 22);
  const { head, arch, tail } = side;

  for (let i = 0; i < count; i++) {
    const seed = seedBase + i * 1.9;
    const u = 0.04 + (0.92 * i) / Math.max(count - 1, 1);
    const { p, tangent } = spinePoint(head, arch, tail, u);
    const bias = template.strokeAngleBias(u);
    const angle = tangent + Math.PI / 2 + bias + (seeded(seed) - 0.5) * 0.22;
    const fan = u < 0.22 ? template.headFanStrength : 1;
    const spineOff = (seeded(seed + 1) - 0.5) * 12 * fan;
    const nx = -Math.sin(tangent);
    const ny = -Math.cos(tangent);
    const cx = p.x + nx * spineOff;
    const cy = p.y + ny * spineOff;
    const len = (7 + seeded(seed + 2) * 11) * (0.85 + fan * 0.15);
    drawHairStroke(ctx, cx, cy, angle, len, color, 0.65 + seeded(seed + 3) * 0.55, 0.5 + seeded(seed + 4) * 0.4);
  }
}

function drawSideOmbre(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  shapeId: BrowShapeId,
  color: string,
  seedBase: number,
) {
  const template = getBrowShapeTemplate(shapeId);
  const { head, arch, tail } = side;
  const steps = 28;

  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const { p, tangent } = spinePoint(head, arch, tail, u);
    const nx = -Math.sin(tangent);
    const ny = -Math.cos(tangent);
    const alpha = 0.14 + u * 0.42;
    const band = 5 + u * 9;

    for (let j = -4; j <= 4; j++) {
      const seed = seedBase + i * 0.4 + j;
      const ox = nx * j * 2.8 + (seeded(seed) - 0.5) * 2;
      const oy = ny * j * 2.8 + (seeded(seed + 0.5) - 0.5) * 2;
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha * (0.55 + seeded(seed + 1) * 0.45) * (u < 0.2 ? template.headFanStrength * 0.5 + 0.5 : 1);
      ctx.beginPath();
      ctx.arc(p.x + ox, p.y + oy, band * 0.14, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawShapeFill(ctx, side, withAlpha(color, 0.12));
  ctx.globalAlpha = 1;
}

function drawSideHybrid(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  shapeId: BrowShapeId,
  color: string,
  seedBase: number,
) {
  drawSideOmbre(ctx, side, shapeId, color, seedBase + 80);
  drawSideStrokes(ctx, side, shapeId, color, 0.75, seedBase);
}

function drawMappingShape(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  pigmentHex: string,
) {
  drawShapeFill(ctx, side, withAlpha(pigmentHex, 0.14));
  drawShapeOutline(ctx, side, withAlpha(pigmentHex, 0.85), 2);
  ctx.save();
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1;
  const { head, arch, tail } = side;
  ctx.beginPath();
  ctx.moveTo(head.x, head.y);
  ctx.quadraticCurveTo(arch.x, arch.y, tail.x, tail.y);
  ctx.stroke();
  ctx.restore();
}

function drawSideTechnique(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  shapeId: BrowShapeId,
  styleId: BrowStylePreviewId,
  pigmentHex: string,
  seedBase: number,
) {
  ctx.save();
  traceBrowPolygon(ctx, side);
  ctx.clip();

  switch (styleId) {
    case "mapping-only":
      drawMappingShape(ctx, side, pigmentHex);
      break;
    case "individual-strokes":
      drawShapeFill(ctx, side, withAlpha(pigmentHex, 0.08));
      drawSideStrokes(ctx, side, shapeId, pigmentHex, 1, seedBase);
      drawShapeOutline(ctx, side, withAlpha(pigmentHex, 0.35), 1);
      break;
    case "ombre":
      drawSideOmbre(ctx, side, shapeId, pigmentHex, seedBase);
      drawShapeOutline(ctx, side, withAlpha(pigmentHex, 0.3), 1);
      break;
    case "hybrid":
      drawSideHybrid(ctx, side, shapeId, pigmentHex, seedBase);
      drawShapeOutline(ctx, side, withAlpha(pigmentHex, 0.28), 1);
      break;
  }

  ctx.restore();
}

/** Draw both brows from shape templates fitted to client anchors. */
export function drawBrowShapeOnPhoto(
  ctx: CanvasRenderingContext2D,
  geometry: BrowMappingGeometry,
  shapeId: BrowShapeId,
  styleId: BrowStylePreviewId,
  pigmentHex = "#4a3220",
) {
  const fitted = fitBrowShapeToGeometry(geometry, shapeId);

  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  const sides: FittedBrowSide[] = [fitted.left, fitted.right];
  sides.forEach((side, idx) => {
    const seedBase = side.head.x * 0.11 + side.head.y * 0.09 + idx * 600;
    drawSideTechnique(ctx, side, shapeId, styleId, pigmentHex, seedBase);
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}

/** Mapping overlay: template outline on one side (replaces generic quadratic). */
export function drawFittedBrowOutline(
  ctx: CanvasRenderingContext2D,
  side: FittedBrowSide,
  strokeColor: string,
  lineWidth = 2.5,
) {
  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  traceBrowPolygon(ctx, side);
  ctx.stroke();
  ctx.restore();
}

export function drawFittedBrowOutlinesForGeometry(
  ctx: CanvasRenderingContext2D,
  geometry: BrowMappingGeometry,
  shapeId: BrowShapeId,
  strokeColor: string,
) {
  const fitted = fitBrowShapeToGeometry(geometry, shapeId);
  drawFittedBrowOutline(ctx, fitted.left, strokeColor);
  drawFittedBrowOutline(ctx, fitted.right, strokeColor);
}

/** Sample points along fitted top edge (for export / plan). */
export function fittedSideCenterline(side: FittedBrowSide, steps = 12): BrowMappingPoint[] {
  const pts: BrowMappingPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    pts.push(spinePoint(side.head, side.arch, side.tail, u).p);
  }
  return pts;
}
