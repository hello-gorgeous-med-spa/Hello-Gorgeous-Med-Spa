import type { NormalizedLandmark } from "@mediapipe/face_mesh";

import type { BrowMappingGeometry, BrowMappingPoint, BrowSideMap } from "@/data/brow-mapping-intelligence";
import { FACE_LM } from "@/lib/brow-mapping/landmarks";

const LM = FACE_LM;

function toPx(l: NormalizedLandmark, w: number, h: number): BrowMappingPoint {
  return { x: l.x * w, y: l.y * h };
}

function avgY(landmarks: NormalizedLandmark[], indices: number[], h: number): number {
  const ys = indices.map((i) => landmarks[i]?.y * h).filter(Boolean);
  return ys.reduce((a, b) => a + b, 0) / Math.max(ys.length, 1);
}

function avgPoint(landmarks: NormalizedLandmark[], indices: number[], w: number, h: number): BrowMappingPoint {
  const pts = indices.map((i) => toPx(landmarks[i], w, h));
  return {
    x: pts.reduce((a, p) => a + p.x, 0) / pts.length,
    y: pts.reduce((a, p) => a + p.y, 0) / pts.length,
  };
}

/** Head = inner brow, arch = brow peak, tail = outer eye — all on the same side of the face. */
function mapBrowSide(inner: BrowMappingPoint, arch: BrowMappingPoint, outer: BrowMappingPoint): BrowSideMap {
  return { head: inner, arch, tail: outer };
}

export function computeBrowMappingFromLandmarks(
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
): BrowMappingGeometry | null {
  if (!landmarks || landmarks.length < 478) return null;

  const mid = toPx(landmarks[LM.midline], width, height);

  const leftInner = toPx(landmarks[LM.leftBrowInner], width, height);
  const rightInner = toPx(landmarks[LM.rightBrowInner], width, height);
  const leftArch = avgPoint(landmarks, [...LM.leftBrowUpper], width, height);
  const rightArch = avgPoint(landmarks, [...LM.rightBrowUpper], width, height);
  const leftTail = toPx(landmarks[LM.leftEyeOuter], width, height);
  const rightTail = toPx(landmarks[LM.rightEyeOuter], width, height);

  const left = mapBrowSide(leftInner, leftArch, leftTail);
  const right = mapBrowSide(rightInner, rightArch, rightTail);

  const baselineY = (leftInner.y + rightInner.y) / 2 + height * 0.02;
  const archY = (leftArch.y + rightArch.y) / 2;

  const midlineTop = { x: mid.x, y: archY - height * 0.06 };
  const midlineBottom = { x: mid.x, y: baselineY + height * 0.1 };

  return {
    midlineTop,
    midlineBottom,
    baselineY,
    left,
    right,
  };
}

/** Fallback geometry when face detection fails — proportional manual placement. */
export function createDefaultManualGeometry(width: number, height: number): BrowMappingGeometry {
  const cx = width / 2;
  const baselineY = height * 0.38;
  const archY = height * 0.32;
  const browSpan = width * 0.11;

  /** Patient left brow — right side of photo (higher x). */
  const left: BrowSideMap = {
    head: { x: cx + browSpan * 0.45, y: baselineY },
    arch: { x: cx + browSpan * 1.05, y: archY },
    tail: { x: cx + browSpan * 1.55, y: baselineY - height * 0.01 },
  };
  /** Patient right brow — left side of photo (lower x). */
  const right: BrowSideMap = {
    head: { x: cx - browSpan * 0.45, y: baselineY },
    arch: { x: cx - browSpan * 1.05, y: archY },
    tail: { x: cx - browSpan * 1.55, y: baselineY - height * 0.01 },
  };

  return {
    midlineTop: { x: cx, y: archY - height * 0.04 },
    midlineBottom: { x: cx, y: baselineY + height * 0.06 },
    baselineY,
    left,
    right,
  };
}

export type DraggablePointId =
  | "leftHead"
  | "leftArch"
  | "leftTail"
  | "rightHead"
  | "rightArch"
  | "rightTail";

export function geometryToDraggablePoints(g: BrowMappingGeometry): Record<DraggablePointId, BrowMappingPoint> {
  return {
    leftHead: g.left.head,
    leftArch: g.left.arch,
    leftTail: g.left.tail,
    rightHead: g.right.head,
    rightArch: g.right.arch,
    rightTail: g.right.tail,
  };
}

export function draggablePointsToGeometry(
  points: Record<DraggablePointId, BrowMappingPoint>,
  base: BrowMappingGeometry,
): BrowMappingGeometry {
  return {
    ...base,
    left: { head: points.leftHead, arch: points.leftArch, tail: points.leftTail },
    right: { head: points.rightHead, arch: points.rightArch, tail: points.rightTail },
  };
}

export function drawBrowMappingOverlay(
  ctx: CanvasRenderingContext2D,
  g: BrowMappingGeometry,
  opts?: { showLabels?: boolean; activePoint?: DraggablePointId | null },
) {
  const pink = "#E6007E";
  const hot = "#FF2D8E";
  const soft = "rgba(255, 184, 220, 0.6)";

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = pink;
  ctx.fillStyle = hot;

  // Midline
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(g.midlineTop.x, g.midlineTop.y);
  ctx.lineTo(g.midlineBottom.x, g.midlineBottom.y);
  ctx.stroke();

  // Baseline through heads
  ctx.beginPath();
  ctx.moveTo(g.left.head.x, g.baselineY);
  ctx.lineTo(g.right.head.x, g.baselineY);
  ctx.stroke();
  ctx.setLineDash([]);

  const drawSide = (side: BrowSideMap, prefix: string) => {
    // Vertical head
    ctx.strokeStyle = pink;
    ctx.beginPath();
    ctx.moveTo(side.head.x, side.head.y - 40);
    ctx.lineTo(side.head.x, side.head.y + 30);
    ctx.stroke();

    // Arch diagonal (nostril zone → arch)
    ctx.beginPath();
    ctx.moveTo(side.head.x, side.head.y + 25);
    ctx.lineTo(side.arch.x, side.arch.y);
    ctx.stroke();

    // Tail diagonal
    ctx.beginPath();
    ctx.moveTo(side.head.x, side.head.y + 25);
    ctx.lineTo(side.tail.x, side.tail.y);
    ctx.stroke();

    if (opts?.showLabels !== false) {
      ctx.font = "bold 11px system-ui,sans-serif";
      ctx.fillStyle = pink;
      ctx.fillText(`${prefix} HEAD`, side.head.x + 4, side.head.y - 6);
      ctx.fillText(`${prefix} ARCH`, side.arch.x + 4, side.arch.y - 6);
      ctx.fillText(`${prefix} TAIL`, side.tail.x + 4, side.tail.y + 14);
    }
  };

  drawSide(g.left, "L");
  drawSide(g.right, "R");

  // Draggable handles
  const handles = geometryToDraggablePoints(g);
  for (const [id, p] of Object.entries(handles) as [DraggablePointId, BrowMappingPoint][]) {
    const active = opts?.activePoint === id;
    ctx.beginPath();
    ctx.arc(p.x, p.y, active ? 9 : 7, 0, Math.PI * 2);
    ctx.fillStyle = active ? "#fff" : hot;
    ctx.fill();
    ctx.strokeStyle = pink;
    ctx.lineWidth = active ? 3 : 2;
    ctx.stroke();
  }

  ctx.restore();
}

export function hitTestDraggablePoint(
  x: number,
  y: number,
  g: BrowMappingGeometry,
  radius = 14,
): DraggablePointId | null {
  const handles = geometryToDraggablePoints(g);
  for (const [id, p] of Object.entries(handles) as [DraggablePointId, BrowMappingPoint][]) {
    if (Math.hypot(x - p.x, y - p.y) <= radius) return id;
  }
  return null;
}
