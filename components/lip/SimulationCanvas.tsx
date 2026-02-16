"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import type { SimulationLevel } from "@/utils/lipMorph";
import {
  extractLipPoints,
  getIntensity,
  applyLipProjection,
} from "@/utils/lipMorph";

const ANIM_DURATION = 150;
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface SimulationCanvasProps {
  imageSrc: string;
  level: SimulationLevel;
  onLandmarksDetected?: (detected: boolean) => void;
}

export function SimulationCanvas({
  imageSrc,
  level,
  onLandmarksDetected,
}: SimulationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const simulatedCanvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const lipLandmarksRef = useRef<ReturnType<typeof extractLipPoints> | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const displayIntensityRef = useRef(0);

  const renderFrame = useCallback(
    (img: HTMLImageElement, landmarks: NonNullable<ReturnType<typeof extractLipPoints>>, intensity: number) => {
      const container = containerRef.current;
      const origCanvas = originalCanvasRef.current;
      const simCanvas = simulatedCanvasRef.current;
      if (!container || !origCanvas || !simCanvas) return;

      const maxWidth = Math.min(container.clientWidth, 480);
      const scale = maxWidth / img.naturalWidth;
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);

      [origCanvas, simCanvas].forEach((c) => {
        c.width = w;
        c.height = h;
      });

      const origCtx = origCanvas.getContext("2d");
      const simCtx = simCanvas.getContext("2d");
      if (!origCtx || !simCtx) return;

      origCtx.drawImage(img, 0, 0, w, h);

      if (intensity <= 0) {
        simCtx.drawImage(img, 0, 0, w, h);
        return;
      }

      const scaleY = h / img.naturalHeight;
      const scaleX = w / img.naturalWidth;
      const centerY = landmarks.centerY * scaleY;
      const bounds = {
        minX: landmarks.bounds.minX * scaleX,
        minY: landmarks.bounds.minY * scaleY,
        maxX: landmarks.bounds.maxX * scaleX,
        maxY: landmarks.bounds.maxY * scaleY,
      };
      const upperHeight = landmarks.upperHeight * scaleY;
      const lowerHeight = landmarks.lowerHeight * scaleY;

      // P5: Use offscreen canvas for morph, then draw to visible
      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;
      offCtx.drawImage(img, 0, 0, w, h);
      applyLipProjection(offCtx, w, h, centerY, intensity * scaleY, bounds, upperHeight, lowerHeight);
      simCtx.drawImage(offscreen, 0, 0);
    },
    []
  );

  const render = useCallback(
    (img: HTMLImageElement, landmarks: NonNullable<ReturnType<typeof extractLipPoints>>) => {
      const targetIntensity = getIntensity(level);
      if (animRef.current) cancelAnimationFrame(animRef.current);

      const startIntensity = displayIntensityRef.current;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / ANIM_DURATION);
        const eased = easeOut(t);
        const current = startIntensity + (targetIntensity - startIntensity) * eased;
        displayIntensityRef.current = current;
        renderFrame(img, landmarks, current);
        if (t < 1) animRef.current = requestAnimationFrame(tick);
        else animRef.current = null;
      };
      animRef.current = requestAnimationFrame(tick);
    },
    [level, renderFrame]
  );

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    const init = async () => {
      try {
        const faceMesh = new FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        faceMesh.onResults((results) => {
          if (cancelled) return;
          const landmarks = results.multiFaceLandmarks?.[0];
          if (!landmarks) {
            onLandmarksDetected?.(false);
            setError("No face detected. Please use a clear, front-facing photo.");
            return;
          }
          onLandmarksDetected?.(true);
          setError(null);
          const lips = extractLipPoints(landmarks, img.naturalWidth, img.naturalHeight);
          if (!lips) return;
          lipLandmarksRef.current = lips;
          render(img, lips);
        });

        await faceMesh.initialize();
        if (cancelled) return;
        faceMeshRef.current = faceMesh;
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load face detection. Please try again.");
        }
      }
    };

    img.onload = async () => {
      if (cancelled) return;
      imageRef.current = img;
      await init();
      if (cancelled || !faceMeshRef.current) return;
      try {
        await faceMeshRef.current.send({ image: img });
      } catch {
        if (!cancelled) {
          setError("Face detection failed.");
          onLandmarksDetected?.(false);
        }
      }
      if (!cancelled) setReady(true);
    };

    img.onerror = () => {
      if (!cancelled) setError("Failed to load image.");
    };

    img.src = imageSrc;

    return () => {
      cancelled = true;
      faceMeshRef.current?.close();
      faceMeshRef.current = null;
    };
  }, [imageSrc]);

  useEffect(() => {
    const img = imageRef.current;
    const lips = lipLandmarksRef.current;
    if (img && lips && ready) {
      render(img, lips);
    }
  }, [level, ready, render]);

  if (error) {
    return (
      <div className="rounded-xl bg-[#FFFFFF] border border-[#FF2D8E]/20 p-6 text-center">
        <p className="text-[#FF2D8E] text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full max-w-full overflow-hidden relative">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FFFFFF]/90 rounded-lg z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#FF2D8E]/40 border-t-[#FF2D8E] rounded-full animate-spin" />
            <p className="text-[#000000] text-sm">Detecting face...</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:gap-8">
        <div>
          <p className="text-xs font-medium text-[#000000] mb-2 uppercase tracking-wider">
            Original
          </p>
          <canvas
            ref={originalCanvasRef}
            className="w-full h-auto max-w-full rounded-lg border border-[#000000] bg-[#FFFFFF]"
            style={{ maxHeight: "400px" }}
          />
        </div>
        <div>
          <p className="text-xs font-medium text-[#000000] mb-2 uppercase tracking-wider">
            Simulated
          </p>
          <canvas
            ref={simulatedCanvasRef}
            className="w-full h-auto max-w-full rounded-lg border border-[#000000] bg-[#FFFFFF]"
            style={{ maxHeight: "400px" }}
          />
        </div>
      </div>
    </div>
  );
}
