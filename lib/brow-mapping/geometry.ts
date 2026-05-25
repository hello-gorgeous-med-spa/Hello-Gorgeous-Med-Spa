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

function pointOnLineAtY(a: BrowMappingPoint, b: BrowMappingPoint, y: number): BrowMappingPoint {
  const dy = b.y - a.y;
  if (Math.abs(dy) < 0.001) return { x: a.x, y };
  const t = (y - a.y) / dy;
  return { x: a.x + t * (b.x - a.x), y };
}

function mapSide(
  nostril: BrowMappingPoint,
  iris: BrowMappingPoint,
  outerEye: BrowMappingPoint,
  browTopY: number,
  headBaselineY: number,
): BrowSideMap {
  const head: BrowMappingPoint = { x: nostril.x, y: headBaselineY };
  const arch = pointOnLineAtY(nostril, iris, browTopY);
  const tail = pointOnLineAtY(nostril, outerEye, headBaselineY);
  return { head, arch, tail };
}

export function computeBrowMappingFromLandmarks(
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
): BrowMappingGeometry | null {
  if (!landmarks || landmarks.length < 478) return null;

  const leftNostril = toPx(landmarks[LM.leftNostril], width, height);
  const rightNostril = toPx(landmarks[LM.rightNostril], width, height);
  const leftIris = toPx(landmarks[LM.leftIris], width, height);
  const rightIris = toPx(landmarks[LM.rightIris], width, height);
  const leftOuter = toPx(landmarks[LM.leftEyeOuter], width, height);
  const rightOuter = toPx(landmarks[LM.rightEyeOuter], width, height);
  const mid = toPx(landmarks[LM.midline], width, height);

  const leftBrowTop = avgY(landmarks, LM.leftBrowUpper, height);
  const rightBrowTop = avgY(landmarks, LM.rightBrowUpper, height);
  const archY = (leftBrowTop + rightBrowTop) / 2;

  const innerY =
    (landmarks[LM.leftBrowInner].y * height + landmarks[LM.rightBrowInner].y * height) / 2;
  const headBaselineY = innerY + (archY - innerY) * 0.55;

  const left = mapSide(leftNostril, leftIris, leftOuter, archY, headBaselineY);
  const right = mapSide(rightNostril, rightIris, rightOuter, archY, headBaselineY);

  const midlineTop = { x: mid.x, y: archY - height * 0.08 };
  const midlineBottom = { x: mid.x, y: headBaselineY + height * 0.12 };

  return {
    midlineTop,
    midlineBottom,
    baselineY: headBaselineY,
    left,
    right,
  };
}

/** Fallback geometry when face detection fails — proportional manual placement. */
export function createDefaultManualGeometry(width: number, height: number): BrowMappingGeometry {
  const cx = width / 2;
  const baselineY = height * 0.42;
  const archY = height * 0.36;
  const browSpan = width * 0.14;

  const left: BrowSideMap = {
    head: { x: cx - browSpan * 1.35, y: baselineY },
    arch: { x: cx - browSpan * 0.55, y: archY },
    tail: { x: cx - browSpan * 0.05, y: baselineY - height * 0.008 },
  };
  const right: BrowSideMap = {
    head: { x: cx + browSpan * 1.35, y: baselineY },
    arch: { x: cx + browSpan * 0.55, y: archY },
    tail: { x: cx + browSpan * 0.05, y: baselineY - height * 0.008 },
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
