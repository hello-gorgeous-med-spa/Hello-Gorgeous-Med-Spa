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
  /** Upper lip height (center to top of upper lip) */
  upperHeight: number;
  /** Lower lip height (center to bottom of lower lip) */
  lowerHeight: number;
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

  const upperHeight = centerY - minY;
  const lowerHeight = maxY - centerY;

  return {
    upperLip,
    lowerLip,
    centerY,
    upperHeight,
    lowerHeight,
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

const BLEND = 0.6; // Soft blend preserves texture, prevents harsh edges

/**
 * Apply lip projection warp with edge feathering, ratio preservation, and shadow compensation
 */
export function applyLipProjection(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  lipCenterY: number,
  intensity: number,
  lipBounds: { minX: number; minY: number; maxX: number; maxY: number },
  upperHeight: number,
  lowerHeight: number
): void {
  const totalHeight = upperHeight + lowerHeight;
  const ratio = totalHeight > 0 ? upperHeight / totalHeight : 0.5;
  // Upper lip cannot exceed 60% of total; lower must remain slightly dominant
  const maxUpperRatio = 0.6;
  const ratioScale = ratio <= maxUpperRatio ? 1 : maxUpperRatio / ratio;

  const lipRegionHeight = Math.max(1, lipBounds.maxY - lipBounds.minY);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const origData = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    const distanceFromCenter = Math.abs(y - lipCenterY);
    const falloff = Math.exp(-(distanceFromCenter / lipRegionHeight) * 3);
    let shift = intensity * falloff * ratioScale;

    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const newY = Math.min(height - 1, Math.max(0, Math.floor(y - shift)));
      const newIndex = (newY * width + x) * 4;

      // Soft blending instead of direct copy
      data[index] = Math.round(origData[index] * (1 - BLEND) + origData[newIndex] * BLEND);
      data[index + 1] = Math.round(origData[index + 1] * (1 - BLEND) + origData[newIndex + 1] * BLEND);
      data[index + 2] = Math.round(origData[index + 2] * (1 - BLEND) + origData[newIndex + 2] * BLEND);
      data[index + 3] = origData[newIndex + 3];
    }
  }

  // Micro shadow: darken lower lip bottom edge, brighten upper lip ridge (2-4%)
  const shadowAdj = 0.03;
  const lipMinY = Math.max(0, Math.floor(lipBounds.minY - 2));
  const lipMaxY = Math.min(height, Math.ceil(lipBounds.maxY + 2));
  const upperRidgeY = Math.floor(lipCenterY - lipRegionHeight * 0.3);
  const lowerEdgeY = Math.ceil(lipCenterY + lipRegionHeight * 0.3);

  const minX = Math.max(0, Math.floor(lipBounds.minX - 5));
  const maxX = Math.min(width, Math.ceil(lipBounds.maxX + 5));
  for (let x = minX; x < maxX; x++) {
    for (let y = lipMinY; y < lipMaxY; y++) {
      const idx = (y * width + x) * 4;
      if (y <= upperRidgeY && y >= lipMinY) {
        data[idx] = Math.min(255, data[idx] + data[idx] * shadowAdj);
        data[idx + 1] = Math.min(255, data[idx + 1] + data[idx + 1] * shadowAdj);
        data[idx + 2] = Math.min(255, data[idx + 2] + data[idx + 2] * shadowAdj);
      } else if (y >= lowerEdgeY && y <= lipMaxY) {
        data[idx] = Math.max(0, data[idx] - data[idx] * shadowAdj);
        data[idx + 1] = Math.max(0, data[idx + 1] - data[idx + 1] * shadowAdj);
        data[idx + 2] = Math.max(0, data[idx + 2] - data[idx + 2] * shadowAdj);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
