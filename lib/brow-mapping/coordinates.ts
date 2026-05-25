import type { BrowMappingGeometry, BrowMappingPoint } from "@/data/brow-mapping-intelligence";

export type ImageDimensions = { width: number; height: number };

export function scalePoint(p: BrowMappingPoint, scale: number): BrowMappingPoint {
  return { x: p.x * scale, y: p.y * scale };
}

export function scaleGeometry(g: BrowMappingGeometry, scale: number): BrowMappingGeometry {
  return {
    midlineTop: scalePoint(g.midlineTop, scale),
    midlineBottom: scalePoint(g.midlineBottom, scale),
    baselineY: g.baselineY * scale,
    left: {
      head: scalePoint(g.left.head, scale),
      arch: scalePoint(g.left.arch, scale),
      tail: scalePoint(g.left.tail, scale),
    },
    right: {
      head: scalePoint(g.right.head, scale),
      arch: scalePoint(g.right.arch, scale),
      tail: scalePoint(g.right.tail, scale),
    },
  };
}

export function displayScale(naturalWidth: number, displayWidth: number): number {
  return displayWidth / Math.max(naturalWidth, 1);
}

export function displayToImageSpace(x: number, y: number, scale: number): BrowMappingPoint {
  return { x: x / scale, y: y / scale };
}

export function getDisplaySize(natural: ImageDimensions, maxDisplayWidth: number) {
  const scale = displayScale(natural.width, maxDisplayWidth);
  return {
    scale,
    width: Math.round(natural.width * scale),
    height: Math.round(natural.height * scale),
  };
}
