"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import type { NormalizedLandmark } from "@mediapipe/face_mesh";

import type { BrowMappingGeometry } from "@/data/brow-mapping-intelligence";
import {
  computeBrowMappingFromLandmarks,
  drawBrowMappingOverlay,
  draggablePointsToGeometry,
  geometryToDraggablePoints,
  hitTestDraggablePoint,
  type DraggablePointId,
} from "@/lib/brow-mapping/geometry";
import {
  drawBrowStylePreview,
  type BrowStylePreviewId,
} from "@/lib/brow-mapping/style-preview";
import type { BrowShapeId } from "@/data/brow-mapping-intelligence";

export function useBrowMappingCanvas(
  imageSrc: string | null,
  options?: { stylePreview?: BrowStylePreviewId; pigmentHex?: string; browShape?: BrowShapeId },
) {
  const stylePreview = options?.stylePreview ?? "mapping-only";
  const pigmentHex = options?.pigmentHex ?? "#4a3220";
  const browShape = options?.browShape ?? "arch";
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const landmarksRef = useRef<NormalizedLandmark[] | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const geometryRef = useRef<BrowMappingGeometry | null>(null);
  const pointsRef = useRef<ReturnType<typeof geometryToDraggablePoints> | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geometry, setGeometry] = useState<BrowMappingGeometry | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [dragging, setDragging] = useState<DraggablePointId | null>(null);
  const [activePoint, setActivePoint] = useState<DraggablePointId | null>(null);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const img = imageRef.current;
    const lm = landmarksRef.current;
    if (!canvas || !wrap || !img) return;

    const maxW = wrap.clientWidth;
    const scale = maxW / img.naturalWidth;
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    if (showOverlay && lm) {
      let g = geometryRef.current;
      if (!g) {
        g = computeBrowMappingFromLandmarks(lm, w, h);
        if (g) {
          geometryRef.current = g;
          pointsRef.current = geometryToDraggablePoints(g);
          setGeometry(g);
        }
      }
      if (g && pointsRef.current) {
        const adjusted = draggablePointsToGeometry(pointsRef.current, g);
        drawBrowMappingOverlay(ctx, adjusted, { activePoint: dragging ?? activePoint });
        drawBrowStylePreview(ctx, adjusted, stylePreview, pigmentHex, browShape);
        geometryRef.current = adjusted;
      }
    }
  }, [showOverlay, dragging, activePoint, stylePreview, pigmentHex, browShape]);

  useEffect(() => {
    if (!imageSrc) return;
    let cancelled = false;
    setReady(false);
    setError(null);
    setGeometry(null);
    geometryRef.current = null;
    pointsRef.current = null;
    landmarksRef.current = null;

    const img = new Image();
    img.onload = async () => {
      if (cancelled) return;
      imageRef.current = img;

      try {
        const         faceMesh = new FaceMesh({
          locateFile: (file) => `/mediapipe/face_mesh/${file}`,
        });
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.65,
        });
        faceMesh.onResults((results) => {
          if (cancelled) return;
          const lm = results.multiFaceLandmarks?.[0];
          if (!lm) {
            setError("No face detected — use a front-facing photo with even light.");
            return;
          }
          landmarksRef.current = lm;
          geometryRef.current = null;
          pointsRef.current = null;
          setError(null);
          paint();
        });
        await faceMesh.initialize();
        if (cancelled) return;
        faceMeshRef.current = faceMesh;
        await faceMesh.send({ image: img });
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setError("Face detection failed to load.");
      }
    };
    img.onerror = () => {
      if (!cancelled) setError("Could not load image.");
    };
    img.src = imageSrc;

    return () => {
      cancelled = true;
      faceMeshRef.current?.close();
      faceMeshRef.current = null;
    };
  }, [imageSrc, paint]);

  useEffect(() => {
    if (ready) paint();
  }, [ready, paint, showOverlay, stylePreview, pigmentHex, browShape]);

  useEffect(() => {
    const onResize = () => {
      geometryRef.current = null;
      pointsRef.current = null;
      paint();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = geometryRef.current;
    if (!g || !pointsRef.current) return;
    const pos = pointerPos(e);
    const hit = hitTestDraggablePoint(pos.x, pos.y, g);
    if (hit) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(hit);
      setActivePoint(hit);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging || !pointsRef.current) return;
    const pos = pointerPos(e);
    pointsRef.current[dragging] = pos;
    if (geometryRef.current) {
      geometryRef.current = draggablePointsToGeometry(pointsRef.current, geometryRef.current);
      setGeometry({ ...geometryRef.current });
    }
    paint();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragging && geometryRef.current) {
      setGeometry({ ...geometryRef.current });
    }
    setDragging(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const resetMapping = useCallback(() => {
    geometryRef.current = null;
    pointsRef.current = null;
    paint();
  }, [paint]);

  const exportPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `hg-brow-mapping-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const getGeometry = useCallback((): BrowMappingGeometry | null => {
    return geometryRef.current ? { ...geometryRef.current } : null;
  }, []);

  return {
    wrapRef,
    canvasRef,
    ready,
    error,
    geometry,
    showOverlay,
    setShowOverlay,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    resetMapping,
    exportPng,
    getGeometry,
  };
}
