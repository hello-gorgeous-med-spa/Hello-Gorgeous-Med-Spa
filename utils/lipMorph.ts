/**
 * Lip Enhancement Studio — Morph Utilities
 * Client-side only. No server processing.
 */

import type { NormalizedLandmark } from "@mediapipe/face_mesh";

export type SimulationLevel =
  | "original"
  | "lipFlip"
  | "half"
  | "one"
  | "oneHalf"
  | "two";

// MediaPipe refined lip landmark indices
export const UPPER_LIP_INDICES = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409];
export const LOWER_LIP_INDICES = [146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

export interface LipPoint {
  x: number;
  y: number;
}

export interface LipLandmarks {
  upperLip: LipPoint[];
  lowerLip: LipPoint[];
  centerY: number;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
}

/**
 * Extract lip points from MediaPipe landmarks and convert to pixel coordinates
 */
export function extractLipPoints(
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
): LipLandmarks | null {
  if (!landmarks || landmarks.length < 410) return null;

  const toPixel = (l: NormalizedLandmark): LipPoint => ({
    x: l.x * width,
    y: l.y * height,
  });

  const upperLip = UPPER_LIP_INDICES.map((i) => toPixel(landmarks[i]));
  const lowerLip = LOWER_LIP_INDICES.map((i) => toPixel(landmarks[i]));

  const allPoints = [...upperLip, ...lowerLip];
  const minX = Math.min(...allPoints.map((p) => p.x));
  const maxX = Math.max(...allPoints.map((p) => p.x));
  const minY = Math.min(...allPoints.map((p) => p.y));
  const maxY = Math.max(...allPoints.map((p) => p.y));
  const centerY = (minY + maxY) / 2;

  return {
    upperLip,
    lowerLip,
    centerY,
    bounds: { minX, minY, maxX, maxY },
  };
}

/**
 * Build lip polygon path on canvas
 */
export function buildLipPath(
  ctx: CanvasRenderingContext2D,
  points: LipPoint[]
): void {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
}

/**
 * Get morph intensity for preset level (tuned for visual realism)
 */
export function getIntensity(level: SimulationLevel): number {
  switch (level) {
    case "lipFlip":
      return 2;
    case "half":
      return 4;
    case "one":
      return 7;
    case "oneHalf":
      return 9;
    case "two":
      return 12;
    default:
      return 0;
  }
}

/**
 * Apply lip projection warp to image data
 * Vertical expansion centered on lip region for fuller look
 * @param width - canvas width
 * @param height - canvas height
 */
export function applyLipProjection(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lipCenterY: number,
  intensity: number,
  lipBounds: { minY: number; maxY: number }
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const lipRegionHeight = Math.max(1, lipBounds.maxY - lipBounds.minY);

  for (let y = 0; y < height; y++) {
    const distanceFromCenter = Math.abs(y - lipCenterY);
    const falloff = Math.exp(-(distanceFromCenter / lipRegionHeight) * 3);
    const shift = intensity * falloff;

    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const newY = Math.min(height - 1, Math.max(0, Math.floor(y - shift)));
      const newIndex = (newY * width + x) * 4;

      data[index] = data[newIndex];
      data[index + 1] = data[newIndex + 1];
      data[index + 2] = data[newIndex + 2];
      data[index + 3] = data[newIndex + 3];
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
