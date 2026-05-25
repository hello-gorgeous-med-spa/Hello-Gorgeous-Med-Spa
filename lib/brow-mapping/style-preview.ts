import type { BrowMappingGeometry, BrowMappingPoint, BrowShapeId, BrowStylePreviewId } from "@/data/brow-mapping-intelligence";

export type { BrowStylePreviewId };

export { BROW_STYLE_PREVIEWS } from "@/data/brow-mapping-intelligence";
import { applyBrowShape } from "@/lib/brow-mapping/shape-presets";

function quadPoint(head: BrowMappingPoint, arch: BrowMappingPoint, tail: BrowMappingPoint, t: number): BrowMappingPoint {
  const u = 1 - t;
  return {
    x: u * u * head.x + 2 * u * t * arch.x + t * t * tail.x,
    y: u * u * head.y + 2 * u * t * arch.y + t * t * tail.y,
  };
}

function browTangent(head: BrowMappingPoint, arch: BrowMappingPoint, tail: BrowMappingPoint, t: number): number {
  const u = 1 - t;
  const dx = 2 * u * (arch.x - head.x) + 2 * t * (tail.x - arch.x);
  const dy = 2 * u * (arch.y - head.y) + 2 * t * (tail.y - arch.y);
  return Math.atan2(dy, dx);
}

function seeded(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
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
  seed: number,
) {
  const perp = angle + Math.PI / 2 + (seeded(seed) - 0.5) * 0.25;
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.quadraticCurveTo(
    cx + Math.cos(perp) * len * 0.45,
    cy + Math.sin(perp) * len * 0.45,
    cx + Math.cos(perp + 0.45) * len,
    cy + Math.sin(perp + 0.45) * len,
  );
  ctx.stroke();
}

function drawSideStrokes(
  ctx: CanvasRenderingContext2D,
  head: BrowMappingPoint,
  arch: BrowMappingPoint,
  tail: BrowMappingPoint,
  color: string,
  density: number,
  tStart: number,
  tEnd: number,
  seedBase: number,
) {
  const count = Math.floor(density * 18);
  for (let i = 0; i < count; i++) {
    const seed = seedBase + i * 1.7;
    const t = tStart + (tEnd - tStart) * (i / Math.max(count - 1, 1));
    const p = quadPoint(head, arch, tail, t);
    const tang = browTangent(head, arch, tail, t);
    const spine = tang + Math.PI / 2;
    const offset = (seeded(seed + 1) - 0.5) * 14;
    const cx = p.x + Math.cos(spine) * offset;
    const cy = p.y + Math.sin(spine) * offset - 4;
    drawHairStroke(
      ctx,
      cx,
      cy,
      spine,
      8 + seeded(seed + 2) * 10,
      color,
      0.7 + seeded(seed + 3) * 0.6,
      0.55 + seeded(seed + 4) * 0.35,
      seed,
    );
  }
}

function drawSideOmbre(
  ctx: CanvasRenderingContext2D,
  head: BrowMappingPoint,
  arch: BrowMappingPoint,
  tail: BrowMappingPoint,
  baseColor: string,
  seedBase: number,
) {
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = quadPoint(head, arch, tail, t);
    const tang = browTangent(head, arch, tail, t);
    const spine = tang + Math.PI / 2;
    const band = 6 + t * 10;
    const alpha = 0.12 + t * 0.45;

    for (let j = -3; j <= 3; j++) {
      const seed = seedBase + i * 0.3 + j;
      const ox = Math.cos(spine) * j * 3;
      const oy = Math.sin(spine) * j * 3 - 5;
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = alpha * (0.6 + seeded(seed) * 0.4);
      ctx.beginPath();
      ctx.arc(
        p.x + ox + (seeded(seed + 0.5) - 0.5) * 2,
        p.y + oy + (seeded(seed + 0.7) - 0.5) * 2,
        band * 0.15,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = baseColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(head.x, head.y - 6);
  ctx.quadraticCurveTo(arch.x, arch.y - 14, tail.x, tail.y - 4);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawSideHybrid(
  ctx: CanvasRenderingContext2D,
  head: BrowMappingPoint,
  arch: BrowMappingPoint,
  tail: BrowMappingPoint,
  color: string,
  seedBase: number,
) {
  drawSideStrokes(ctx, head, arch, tail, color, 1, 0, 0.62, seedBase);
  drawSideOmbre(ctx, head, arch, tail, color, seedBase + 100);
}

export function drawBrowStylePreview(
  ctx: CanvasRenderingContext2D,
  geometry: BrowMappingGeometry,
  styleId: BrowStylePreviewId,
  pigmentHex = "#4a3220",
  browShape: BrowShapeId = "arch",
) {
  if (styleId === "mapping-only") return;

  const shaped = applyBrowShape(geometry, browShape);

  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  const sides = [shaped.left, shaped.right] as const;
  sides.forEach((side, idx) => {
    const seedBase = side.head.x * 0.1 + side.head.y * 0.07 + idx * 500;
    switch (styleId) {
      case "individual-strokes":
        drawSideStrokes(ctx, side.head, side.arch, side.tail, pigmentHex, 1, 0.05, 0.95, seedBase);
        break;
      case "ombre":
        drawSideOmbre(ctx, side.head, side.arch, side.tail, pigmentHex, seedBase);
        break;
      case "hybrid":
        drawSideHybrid(ctx, side.head, side.arch, side.tail, pigmentHex, seedBase);
        break;
    }
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}

export function pigmentHexForUndertone(undertone: string): string {
  switch (undertone) {
    case "cool":
      return "#5c4033";
    case "warm":
      return "#6b4423";
    case "olive":
      return "#4a5d3a";
    default:
      return "#4a3220";
  }
}
