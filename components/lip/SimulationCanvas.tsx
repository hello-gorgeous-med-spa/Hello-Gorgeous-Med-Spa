"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import type { SimulationLevel } from "@/utils/lipMorph";
import {
  extractLipPoints,
  getIntensity,
  applyLipProjection,
} from "@/utils/lipMorph";

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

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const render = useCallback(
    (img: HTMLImageElement, landmarks: NonNullable<ReturnType<typeof extractLipPoints>>) => {
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

      const intensity = getIntensity(level);
      if (intensity <= 0) {
        simCtx.drawImage(img, 0, 0, w, h);
        return;
      }

      const scaleY = h / img.naturalHeight;
      const centerY = landmarks.centerY * scaleY;
      const bounds = {
        minY: landmarks.bounds.minY * scaleY,
        maxY: landmarks.bounds.maxY * scaleY,
      };

      simCtx.drawImage(img, 0, 0, w, h);
      applyLipProjection(simCtx, w, h, centerY, intensity * scaleY, bounds);
    },
    [level]
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
      <div className="rounded-xl bg-[#FDF7FA] border border-[#E6007E]/20 p-6 text-center">
        <p className="text-[#E6007E] text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full max-w-full overflow-hidden relative">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FDF7FA]/90 rounded-lg z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#E6007E]/40 border-t-[#E6007E] rounded-full animate-spin" />
            <p className="text-[#5E5E66] text-sm">Detecting face...</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:gap-8">
        <div>
          <p className="text-xs font-medium text-[#5E5E66] mb-2 uppercase tracking-wider">
            Original
          </p>
          <canvas
            ref={originalCanvasRef}
            className="w-full h-auto max-w-full rounded-lg border border-[#EAE4E8] bg-[#FDF7FA]"
            style={{ maxHeight: "400px" }}
          />
        </div>
        <div>
          <p className="text-xs font-medium text-[#5E5E66] mb-2 uppercase tracking-wider">
            Simulated
          </p>
          <canvas
            ref={simulatedCanvasRef}
            className="w-full h-auto max-w-full rounded-lg border border-[#EAE4E8] bg-[#FDF7FA]"
            style={{ maxHeight: "400px" }}
          />
        </div>
      </div>
    </div>
  );
}
