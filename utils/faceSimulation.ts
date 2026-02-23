/**
 * HG Face Blueprint™ – client-side simulation engine.
 * Landmark-based transforms only. No AI, no pricing. Intensity: 0.3 / 0.6 / 0.9.
 */
import type { NormalizedLandmark } from "@mediapipe/face_mesh";
import {
  extractLipPoints,
  applyLipProjection,
} from "@/utils/lipMorph";
import type { FaceServiceId } from "@/lib/face-types";

export type FaceIntensityLevel = "subtle" | "balanced" | "dramatic";

const INTENSITY_MULT: Record<FaceIntensityLevel, number> = {
  subtle: 0.3,
  balanced: 0.6,
  dramatic: 0.9,
};

/** Lip filler: map 0–1 to pixel shift scale (matches lipMorph range when ~7 is "one syringe") */
function lipIntensityFromLevel(level: number): number {
  return level * 7;
}

/**
 * Apply all selected simulations to the canvas in a single pass.
 * Order: lip filler (if selected), then forehead/botox-style smooth.
 */
export function applyFaceSimulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  landmarks: NormalizedLandmark[],
  selectedServices: FaceServiceId[],
  intensityLevel: FaceIntensityLevel
): void {
  const level = INTENSITY_MULT[intensityLevel];
  const set = new Set(selectedServices);

  if (set.has("lip_filler_volume")) {
    const lips = extractLipPoints(landmarks, width, height);
    if (lips) {
      const intensity = lipIntensityFromLevel(level);
      applyLipProjection(
        ctx,
        width,
        height,
        lips.centerY,
        intensity,
        lips.bounds,
        lips.upperHeight,
        lips.lowerHeight
      );
    }
  }

  if (set.has("botox_smoothing")) {
    applyForeheadSmooth(ctx, width, height, landmarks, level);
  }
}

/**
 * Simple vertical smoothing in forehead/brow region (Botox-style).
 * Uses landmark region to define zone; gentle pixel blend.
 */
function applyForeheadSmooth(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  landmarks: NormalizedLandmark[],
  level: number
): void {
  if (!landmarks || landmarks.length < 300) return;
  // Forehead/brow region: approximate from landmarks 10, 151, 9, 8, 336, 334
  const foreheadIndices = [10, 151, 9, 8, 336, 334, 297, 332];
  let minY = 1,
    maxY = 0;
  for (const i of foreheadIndices) {
    if (landmarks[i]) {
      const y = landmarks[i].y * height;
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  const regionHeight = Math.max(1, maxY - minY);
  const centerY = (minY + maxY) / 2;
  const strength = level * 2;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const orig = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    const dist = Math.abs(y - centerY);
    const falloff = Math.exp(-(dist / regionHeight) * 2);
    const shift = strength * falloff;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const srcY = Math.min(height - 1, Math.max(0, Math.floor(y - shift)));
      const srcIdx = (srcY * width + x) * 4;
      const blend = 0.5;
      data[idx] = Math.round(orig[idx] * (1 - blend) + orig[srcIdx] * blend);
      data[idx + 1] = Math.round(orig[idx + 1] * (1 - blend) + orig[srcIdx + 1] * blend);
      data[idx + 2] = Math.round(orig[idx + 2] * (1 - blend) + orig[srcIdx + 2] * blend);
      data[idx + 3] = orig[srcIdx + 3];
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

export function getNumericIntensity(level: FaceIntensityLevel): number {
  return INTENSITY_MULT[level];
}
