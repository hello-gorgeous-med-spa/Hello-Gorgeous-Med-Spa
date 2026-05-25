import type { BrowMappingPoint, BrowShapeId } from "@/data/brow-mapping-intelligence";

/** Normalized offset along brow spine (u: 0=head → 1=tail, o: fraction of local thickness). */
export type BrowProfileSample = { u: number; o: number };

/**
 * Brow shape template — derived from the Hello Gorgeous 7-shape reference chart.
 * Profiles define top/bottom body relative to the head→arch→tail spine.
 */
export type BrowShapeTemplate = {
  id: BrowShapeId;
  label: string;
  /** Overall body thickness multiplier vs detected brow zone. */
  bodyThickness: number;
  topProfile: BrowProfileSample[];
  bottomProfile: BrowProfileSample[];
  /** Stroke flow bias (radians added to spine tangent). */
  strokeAngleBias: (u: number) => number;
  /** Extra vertical fan density at the head (0–1). */
  headFanStrength: number;
};

function profile(
  samples: [number, number][],
): BrowProfileSample[] {
  return samples.map(([u, o]) => ({ u, o }));
}

/** Classic arch — moderate peak ~⅔ along brow, tail tapers down. */
const archTemplate: BrowShapeTemplate = {
  id: "arch",
  label: "Arch",
  bodyThickness: 1,
  headFanStrength: 0.85,
  topProfile: profile([
    [0, 0.12],
    [0.12, 0.35],
    [0.28, 0.62],
    [0.42, 0.88],
    [0.55, 1.05],
    [0.68, 0.82],
    [0.82, 0.48],
    [0.92, 0.28],
    [1, 0.1],
  ]),
  bottomProfile: profile([
    [0, 0.55],
    [0.15, 0.72],
    [0.32, 0.78],
    [0.5, 0.7],
    [0.68, 0.55],
    [0.85, 0.35],
    [1, 0.15],
  ]),
  strokeAngleBias: (u) => (u < 0.18 ? 0.55 : 0) + (u > 0.75 ? -0.2 : 0),
};

/** Soft arch — gentle curve, lower peak. */
const softArchTemplate: BrowShapeTemplate = {
  id: "soft-arch",
  label: "Soft Arch",
  bodyThickness: 0.95,
  headFanStrength: 0.75,
  topProfile: profile([
    [0, 0.1],
    [0.15, 0.28],
    [0.32, 0.52],
    [0.48, 0.72],
    [0.58, 0.78],
    [0.72, 0.58],
    [0.88, 0.32],
    [1, 0.12],
  ]),
  bottomProfile: profile([
    [0, 0.5],
    [0.2, 0.65],
    [0.4, 0.68],
    [0.58, 0.62],
    [0.75, 0.48],
    [0.9, 0.28],
    [1, 0.12],
  ]),
  strokeAngleBias: (u) => (u < 0.2 ? 0.4 : 0),
};

/** High arch — sharp peak, steep body, long descending tail. */
const highArchTemplate: BrowShapeTemplate = {
  id: "high-arch",
  label: "High Arch",
  bodyThickness: 1.05,
  headFanStrength: 0.95,
  topProfile: profile([
    [0, 0.08],
    [0.1, 0.42],
    [0.22, 0.78],
    [0.35, 1.12],
    [0.45, 1.35],
    [0.55, 1.28],
    [0.68, 0.85],
    [0.82, 0.45],
    [0.92, 0.22],
    [1, 0.08],
  ]),
  bottomProfile: profile([
    [0, 0.48],
    [0.12, 0.62],
    [0.28, 0.68],
    [0.45, 0.62],
    [0.62, 0.48],
    [0.78, 0.32],
    [0.92, 0.18],
    [1, 0.08],
  ]),
  strokeAngleBias: (u) => (u < 0.25 ? 0.7 : 0.15) + (u > 0.6 ? -0.35 : 0),
};

/** Round — continuous dome, no sharp peak. */
const roundTemplate: BrowShapeTemplate = {
  id: "round",
  label: "Round",
  bodyThickness: 1.08,
  headFanStrength: 0.65,
  topProfile: profile([
    [0, 0.15],
    [0.1, 0.38],
    [0.22, 0.62],
    [0.35, 0.82],
    [0.5, 0.92],
    [0.65, 0.82],
    [0.78, 0.62],
    [0.9, 0.38],
    [1, 0.15],
  ]),
  bottomProfile: profile([
    [0, 0.52],
    [0.12, 0.68],
    [0.25, 0.75],
    [0.4, 0.78],
    [0.55, 0.75],
    [0.7, 0.68],
    [0.85, 0.52],
    [1, 0.2],
  ]),
  strokeAngleBias: () => 0.1,
};

/** Round arch — rounded transitions with visible arch peak. */
const roundArchTemplate: BrowShapeTemplate = {
  id: "round-arch",
  label: "Round Arch",
  bodyThickness: 1.02,
  headFanStrength: 0.7,
  topProfile: profile([
    [0, 0.12],
    [0.12, 0.35],
    [0.28, 0.58],
    [0.42, 0.82],
    [0.52, 0.95],
    [0.62, 0.88],
    [0.75, 0.65],
    [0.88, 0.38],
    [1, 0.14],
  ]),
  bottomProfile: profile([
    [0, 0.52],
    [0.15, 0.68],
    [0.32, 0.74],
    [0.5, 0.7],
    [0.68, 0.58],
    [0.85, 0.38],
    [1, 0.16],
  ]),
  strokeAngleBias: (u) => (u < 0.2 ? 0.35 : 0.05),
};

/** Upward — tail lifted, brow angles up toward temple. */
const upwardTemplate: BrowShapeTemplate = {
  id: "upward",
  label: "Upward",
  bodyThickness: 0.92,
  headFanStrength: 0.8,
  topProfile: profile([
    [0, 0.1],
    [0.15, 0.22],
    [0.32, 0.38],
    [0.5, 0.48],
    [0.68, 0.42],
    [0.85, 0.28],
    [1, 0.05],
  ]),
  bottomProfile: profile([
    [0, 0.45],
    [0.2, 0.42],
    [0.4, 0.35],
    [0.58, 0.28],
    [0.75, 0.18],
    [0.9, 0.08],
    [1, -0.05],
  ]),
  strokeAngleBias: (u) => -0.35 + u * 0.25,
};

/** Straight — flat body, minimal arch height. */
const straightTemplate: BrowShapeTemplate = {
  id: "straight",
  label: "Straight",
  bodyThickness: 0.88,
  headFanStrength: 0.9,
  topProfile: profile([
    [0, 0.1],
    [0.15, 0.22],
    [0.35, 0.28],
    [0.55, 0.3],
    [0.75, 0.28],
    [0.9, 0.22],
    [1, 0.12],
  ]),
  bottomProfile: profile([
    [0, 0.48],
    [0.2, 0.5],
    [0.4, 0.5],
    [0.6, 0.48],
    [0.8, 0.42],
    [1, 0.2],
  ]),
  strokeAngleBias: (u) => (u < 0.22 ? 0.65 : 0) + (u > 0.85 ? -0.15 : 0),
};

export const browShapeTemplates: Record<BrowShapeId, BrowShapeTemplate> = {
  arch: archTemplate,
  "soft-arch": softArchTemplate,
  "high-arch": highArchTemplate,
  round: roundTemplate,
  "round-arch": roundArchTemplate,
  upward: upwardTemplate,
  straight: straightTemplate,
};

export function getBrowShapeTemplate(shapeId: BrowShapeId): BrowShapeTemplate {
  return browShapeTemplates[shapeId];
}

export type FittedBrowSide = {
  head: BrowMappingPoint;
  arch: BrowMappingPoint;
  tail: BrowMappingPoint;
  top: BrowMappingPoint[];
  bottom: BrowMappingPoint[];
};

function lerpProfile(samples: BrowProfileSample[], u: number): number {
  if (u <= samples[0].u) return samples[0].o;
  if (u >= samples[samples.length - 1].u) return samples[samples.length - 1].o;
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i];
    const b = samples[i + 1];
    if (u >= a.u && u <= b.u) {
      const t = (u - a.u) / (b.u - a.u);
      return a.o + t * (b.o - a.o);
    }
  }
  return samples[samples.length - 1].o;
}

export function spinePoint(
  head: BrowMappingPoint,
  arch: BrowMappingPoint,
  tail: BrowMappingPoint,
  t: number,
): { p: BrowMappingPoint; tangent: number } {
  const u = 1 - t;
  const p = {
    x: u * u * head.x + 2 * u * t * arch.x + t * t * tail.x,
    y: u * u * head.y + 2 * u * t * arch.y + t * t * tail.y,
  };
  const dx = 2 * u * (arch.x - head.x) + 2 * t * (tail.x - arch.x);
  const dy = 2 * u * (arch.y - head.y) + 2 * t * (tail.y - arch.y);
  return { p, tangent: Math.atan2(dy, dx) };
}

/** Forehead-facing normal (screen Y-up). */
function foreheadNormal(tangent: number): { nx: number; ny: number } {
  return { nx: -Math.sin(tangent), ny: -Math.cos(tangent) };
}

/**
 * Fit a shape template to client head / arch / tail anchors.
 * Anchors stay fixed; top/bottom profiles define the visible brow body.
 */
export function fitBrowTemplateToAnchors(
  template: BrowShapeTemplate,
  head: BrowMappingPoint,
  arch: BrowMappingPoint,
  tail: BrowMappingPoint,
  sampleCount = 36,
): FittedBrowSide {
  const span = Math.hypot(tail.x - head.x, tail.y - head.y) || 1;
  const archLift = head.y - arch.y;
  const thickness = Math.max(span * 0.13, Math.abs(archLift) * 0.85 + span * 0.05) * template.bodyThickness;

  const top: BrowMappingPoint[] = [];
  const bottom: BrowMappingPoint[] = [];

  for (let i = 0; i <= sampleCount; i++) {
    const u = i / sampleCount;
    const { p, tangent } = spinePoint(head, arch, tail, u);
    const { nx, ny } = foreheadNormal(tangent);
    const topO = lerpProfile(template.topProfile, u) * thickness;
    const botO = lerpProfile(template.bottomProfile, u) * thickness;
    top.push({ x: p.x + nx * topO, y: p.y + ny * topO });
    bottom.push({ x: p.x - nx * botO, y: p.y - ny * botO });
  }

  return { head, arch, tail, top, bottom };
}

export function fitBrowShapeToGeometry(
  geometry: { left: { head: BrowMappingPoint; arch: BrowMappingPoint; tail: BrowMappingPoint }; right: { head: BrowMappingPoint; arch: BrowMappingPoint; tail: BrowMappingPoint } },
  shapeId: BrowShapeId,
): { left: FittedBrowSide; right: FittedBrowSide } {
  const template = getBrowShapeTemplate(shapeId);
  return {
    left: fitBrowTemplateToAnchors(template, geometry.left.head, geometry.left.arch, geometry.left.tail),
    right: fitBrowTemplateToAnchors(template, geometry.right.head, geometry.right.arch, geometry.right.tail),
  };
}
