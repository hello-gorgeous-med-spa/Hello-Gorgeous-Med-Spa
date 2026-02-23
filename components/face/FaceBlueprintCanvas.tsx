"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import {
  applyFaceSimulation,
  getNumericIntensity,
} from "@/utils/faceSimulation";
import type { FaceServiceId, FaceIntensityLevel } from "@/lib/face-types";
import { trackFaceEvent } from "@/lib/face-analytics";

const PINK = "#FF2D8D";

interface FaceBlueprintCanvasProps {
  imageSrc: string;
  selectedServices: FaceServiceId[];
  intensityLevel: FaceIntensityLevel;
  showLandmarks: boolean;
  comparePosition: number;
  onLandmarksDetected?: (detected: boolean) => void;
}

export function FaceBlueprintCanvas({
  imageSrc,
  selectedServices,
  intensityLevel,
  showLandmarks,
  comparePosition,
  onLandmarksDetected,
}: FaceBlueprintCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const origCanvasRef = useRef<HTMLCanvasElement>(null);
  const simCanvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const landmarksRef = useRef<import("@mediapipe/face_mesh").NormalizedLandmark[] | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draw = useCallback(
    (img: HTMLImageElement, landmarks: import("@mediapipe/face_mesh").NormalizedLandmark[]) => {
      const container = containerRef.current;
      const origCanvas = origCanvasRef.current;
      const simCanvas = simCanvasRef.current;
      if (!container || !origCanvas || !simCanvas) return;

      const maxW = Math.min(container.clientWidth, 520);
      const scale = maxW / img.naturalWidth;
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);

      origCanvas.width = w;
      origCanvas.height = h;
      simCanvas.width = w;
      simCanvas.height = h;

      const origCtx = origCanvas.getContext("2d");
      const simCtx = simCanvas.getContext("2d");
      if (!origCtx || !simCtx) return;

      const scaleX = w / img.naturalWidth;
      const scaleY = h / img.naturalHeight;

      origCtx.drawImage(img, 0, 0, w, h);
      simCtx.drawImage(img, 0, 0, w, h);

      if (selectedServices.length > 0) {
        const scaledLandmarks = landmarks.map((l) => ({
          ...l,
          x: l.x,
          y: l.y,
          z: l.z,
        }));
        applyFaceSimulation(simCtx, w, h, scaledLandmarks, selectedServices, intensityLevel);
      }

      if (showLandmarks) {
        origCtx.strokeStyle = PINK;
        origCtx.lineWidth = 1;
        origCtx.fillStyle = PINK;
        for (const l of landmarks) {
          const px = l.x * w;
          const py = l.y * h;
          origCtx.beginPath();
          origCtx.arc(px, py, 2, 0, Math.PI * 2);
          origCtx.fill();
        }
      }
    },
    [selectedServices, intensityLevel, showLandmarks]
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
          landmarksRef.current = landmarks;
          if (imageRef.current) {
            draw(imageRef.current, landmarks);
            trackFaceEvent("face_landmarks_detected", {});
          }
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
    const landmarks = landmarksRef.current;
    if (img && landmarks && ready) {
      draw(img, landmarks);
    }
  }, [ready, selectedServices, intensityLevel, showLandmarks, draw]);

  if (error) {
    return (
      <div className="rounded-xl bg-white border border-[#FF2D8D]/20 p-6 text-center">
        <p className="text-[#FF2D8D] text-sm font-medium">{error}</p>
        <p className="text-black/60 text-xs mt-2">Try good lighting and a front-facing selfie.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full overflow-hidden relative">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#FF2D8D]/40 border-t-[#FF2D8D] rounded-full animate-spin" />
            <p className="text-black text-sm">Detecting face...</p>
          </div>
        </div>
      )}
      <div className="relative rounded-xl overflow-hidden border border-black/10 bg-white aspect-[3/4] max-h-[480px]">
        <canvas
          ref={origCanvasRef}
          className="absolute inset-0 w-full h-full object-contain bg-white"
          style={{
            clipPath: comparePosition >= 100 ? "none" : `inset(0 ${100 - comparePosition}% 0 0)`,
          }}
        />
        <canvas
          ref={simCanvasRef}
          className="absolute inset-0 w-full h-full object-contain bg-white"
          style={{
            clipPath: comparePosition <= 0 ? "none" : `inset(0 0 0 ${comparePosition}%)`,
            borderLeft: comparePosition > 0 && comparePosition < 100 ? `2px solid ${PINK}` : undefined,
          }}
        />
      </div>
    </div>
  );
}
