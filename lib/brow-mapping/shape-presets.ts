import type { BrowMappingGeometry, BrowShapeId, BrowSideMap } from "@/data/brow-mapping-intelligence";

/** Adjust mapped arch/tail to match classic 7 brow shape presets. */
export function applyBrowShape(geometry: BrowMappingGeometry, shapeId: BrowShapeId): BrowMappingGeometry {
  return {
    ...geometry,
    left: morphSide(geometry.left, shapeId, geometry.baselineY, "left"),
    right: morphSide(geometry.right, shapeId, geometry.baselineY, "right"),
  };
}

function morphSide(side: BrowSideMap, shapeId: BrowShapeId, baselineY: number, sideName: "left" | "right"): BrowSideMap {
  const { head, tail } = side;
  const span = Math.abs(tail.x - head.x) || 1;
  const sign = tail.x >= head.x ? 1 : -1;
  const depth = Math.max(8, Math.abs(baselineY - head.y) * 0.95);
  const archX = head.x + sign * span * 0.55;
  const tailDrop = depth * 0.06;

  switch (shapeId) {
    case "arch":
      return {
        head,
        arch: { x: archX, y: side.arch.y - depth * 0.08 },
        tail: { x: tail.x, y: head.y - tailDrop },
      };
    case "soft-arch":
      return {
        head,
        arch: { x: archX, y: side.arch.y + depth * 0.06 },
        tail: { x: tail.x, y: head.y - tailDrop * 0.5 },
      };
    case "high-arch":
      return {
        head,
        arch: { x: archX - sign * span * 0.02, y: side.arch.y - depth * 0.28 },
        tail: { x: tail.x, y: head.y - tailDrop * 1.2 },
      };
    case "round":
      return {
        head,
        arch: { x: head.x + sign * span * 0.48, y: head.y - depth * 0.38 },
        tail: { x: tail.x, y: head.y - depth * 0.04 },
      };
    case "round-arch":
      return {
        head,
        arch: { x: archX, y: head.y - depth * 0.45 },
        tail: { x: tail.x, y: head.y - depth * 0.1 },
      };
    case "upward":
      return {
        head,
        arch: { x: head.x + sign * span * 0.42, y: head.y - depth * 0.22 },
        tail: { x: tail.x, y: head.y - depth * 0.34 },
      };
    case "straight":
      return {
        head,
        arch: { x: head.x + sign * span * 0.52, y: head.y - depth * 0.06 },
        tail: { x: tail.x, y: head.y - depth * 0.05 },
      };
    default:
      return side;
  }
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
