import type { BrowMappingGeometry, BrowShapeId } from "@/data/brow-mapping-intelligence";

/** Anchors stay fixed; shape templates are fitted at render time (see browShapeTemplates.ts). */
export function applyBrowShape(geometry: BrowMappingGeometry, _shapeId: BrowShapeId): BrowMappingGeometry {
  return geometry;
}

/** SVG path for shape picker icon (reference-style hair strokes). */
export function browShapeIconPath(shapeId: BrowShapeId): string {
  const shapes: Record<BrowShapeId, string> = {
    arch: "M8 28 Q28 8 52 24",
    "soft-arch": "M8 26 Q30 14 52 22",
    "high-arch": "M8 30 Q26 4 52 26",
    round: "M8 22 Q30 18 52 20",
    "round-arch": "M8 24 Q30 12 52 22",
    upward: "M8 28 Q28 16 52 12",
    straight: "M8 24 L52 20",
  };
  return shapes[shapeId];
}

export function browShapeStrokeColors(shapeId: BrowShapeId): string[] {
  const palettes: Record<BrowShapeId, string[]> = {
    arch: ["#9b59b6", "#3498db", "#8e44ad"],
    "soft-arch": ["#f1c40f", "#2ecc71", "#3498db"],
    "high-arch": ["#e91e8c", "#9b59b6", "#e67e22"],
    round: ["#9b59b6", "#3498db"],
    "round-arch": ["#f1c40f", "#2ecc71", "#3498db"],
    upward: ["#f1c40f", "#e67e22", "#e91e8c"],
    straight: ["#e91e8c", "#3498db"],
  };
  return palettes[shapeId];
}
