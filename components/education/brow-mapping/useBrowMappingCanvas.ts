"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NormalizedLandmark } from "@mediapipe/face_mesh";

import type { BrowMappingGeometry } from "@/data/brow-mapping-intelligence";
import type { BrowShapeId } from "@/data/brow-mapping-intelligence";
import {
  computeBrowMappingFromLandmarks,
  drawBrowMappingOverlay,
  draggablePointsToGeometry,
  geometryToDraggablePoints,
  hitTestDraggablePoint,
  type DraggablePointId,
} from "@/lib/brow-mapping/geometry";
import { detectFaceLandmarks } from "@/lib/brow-mapping/landmarks";
import { loadOrientedImageFromSrc } from "@/lib/brow-mapping/load-image";
import {
  drawBrowStylePreview,
  type BrowStylePreviewId,
} from "@/lib/brow-mapping/style-preview";

function cloneGeometry(g: BrowMappingGeometry): BrowMappingGeometry {
  return JSON.parse(JSON.stringify(g)) as BrowMappingGeometry;
}

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
  const geometryRef = useRef<BrowMappingGeometry | null>(null);
  const pointsRef = useRef<ReturnType<typeof geometryToDraggablePoints> | null>(null);
  const previewRef = useRef({ stylePreview, pigmentHex, browShape, showOverlay: true });

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geometry, setGeometry] = useState<BrowMappingGeometry | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [dragging, setDragging] = useState<DraggablePointId | null>(null);
  const [activePoint, setActivePoint] = useState<DraggablePointId | null>(null);

  previewRef.current = {
    stylePreview,
    pigmentHex,
    browShape,
    showOverlay,
  };

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const img = imageRef.current;
    const preview = previewRef.current;
    if (!canvas || !wrap || !img || wrap.clientWidth < 8) return;

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

    const g = geometryRef.current;
    if (!preview.showOverlay || !g || !pointsRef.current) return;

    const adjusted = draggablePointsToGeometry(pointsRef.current, g);
    drawBrowMappingOverlay(ctx, adjusted, { activePoint: dragging ?? activePoint });
    drawBrowStylePreview(ctx, adjusted, preview.stylePreview, preview.pigmentHex, preview.browShape);
    geometryRef.current = adjusted;
  }, [dragging, activePoint]);

  const initGeometryFromLandmarks = useCallback(
    (lm: NormalizedLandmark[], displayW: number, displayH: number) => {
      const g = computeBrowMappingFromLandmarks(lm, displayW, displayH);
      if (!g) return false;
      geometryRef.current = cloneGeometry(g);
      pointsRef.current = geometryToDraggablePoints(geometryRef.current);
      setGeometry(cloneGeometry(geometryRef.current));
      return true;
    },
    [],
  );

  useEffect(() => {
    if (!imageSrc) {
      imageRef.current = null;
      landmarksRef.current = null;
      geometryRef.current = null;
      pointsRef.current = null;
      setReady(false);
      setError(null);
      setGeometry(null);
      return;
    }

    let cancelled = false;
    setReady(false);
    setError(null);
    setGeometry(null);
    geometryRef.current = null;
    pointsRef.current = null;
    landmarksRef.current = null;

    (async () => {
      try {
        const img = await loadOrientedImageFromSrc(imageSrc);
        if (cancelled) return;
        imageRef.current = img;

        const lm = await detectFaceLandmarks(img);
        if (cancelled) return;

        if (!lm) {
          setError("No face detected — use a front-facing photo with even light.");
          setReady(true);
          paint();
          return;
        }

        landmarksRef.current = lm;

        const layoutAndPaint = () => {
          if (cancelled || !imageRef.current) return;
          const wrap = wrapRef.current;
          const loaded = imageRef.current;
          const maxW =
            wrap && wrap.clientWidth >= 8 ? wrap.clientWidth : loaded.naturalWidth;
          const scale = maxW / loaded.naturalWidth;
          const w = Math.round(loaded.naturalWidth * scale);
          const h = Math.round(loaded.naturalHeight * scale);

          if (!initGeometryFromLandmarks(lm, w, h)) {
            setError("Could not compute brow mapping from landmarks.");
          } else {
            setError(null);
          }
          setReady(true);
          paint();
        };

        requestAnimationFrame(layoutAndPaint);
      } catch {
        if (!cancelled) setError("Could not load image or run face detection.");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load only when image changes, not on paint/drag
  }, [imageSrc, initGeometryFromLandmarks]);

  useEffect(() => {
    if (ready) paint();
  }, [ready, paint, stylePreview, pigmentHex, browShape, showOverlay]);

  useEffect(() => {
    const onResize = () => {
      if (!ready || !landmarksRef.current || !imageRef.current) return;
      const wrap = wrapRef.current;
      const img = imageRef.current;
      if (!wrap || wrap.clientWidth < 8) return;
      const scale = wrap.clientWidth / img.naturalWidth;
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      initGeometryFromLandmarks(landmarksRef.current, w, h);
      paint();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ready, initGeometryFromLandmarks, paint]);

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
    if (!dragging || !pointsRef.current || !geometryRef.current) return;
    const pos = pointerPos(e);
    pointsRef.current[dragging] = pos;
    geometryRef.current = draggablePointsToGeometry(pointsRef.current, geometryRef.current);
    paint();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragging && geometryRef.current) {
      setGeometry(cloneGeometry(geometryRef.current));
    }
    setDragging(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const resetMapping = useCallback(() => {
    const lm = landmarksRef.current;
    const wrap = wrapRef.current;
    const img = imageRef.current;
    if (!lm || !wrap || !img) return;
    const scale = wrap.clientWidth / img.naturalWidth;
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    initGeometryFromLandmarks(lm, w, h);
    paint();
  }, [initGeometryFromLandmarks, paint]);

  const exportPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `hg-brow-mapping-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const getGeometry = useCallback((): BrowMappingGeometry | null => {
    return geometryRef.current ? cloneGeometry(geometryRef.current) : null;
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
