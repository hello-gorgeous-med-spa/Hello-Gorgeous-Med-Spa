"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { BrowMappingGeometry, BrowShapeId, BrowStylePreviewId } from "@/data/brow-mapping-intelligence";
import { displayScale, displayToImageSpace, getDisplaySize, scaleGeometry } from "@/lib/brow-mapping/coordinates";
import {
  computeBrowMappingFromLandmarks,
  createDefaultManualGeometry,
  drawBrowMappingOverlay,
  draggablePointsToGeometry,
  geometryToDraggablePoints,
  hitTestDraggablePoint,
  type DraggablePointId,
} from "@/lib/brow-mapping/geometry";
import { detectFaceLandmarks } from "@/lib/brow-mapping/landmarks";
import { exportMappedPhotoPng, renderBrowCanvas } from "@/lib/brow-mapping/export";
import { drawBrowStylePreview } from "@/lib/brow-mapping/style-preview";

export type BrowCanvasOptions = {
  stylePreview?: BrowStylePreviewId;
  pigmentHex?: string;
  browShape?: BrowShapeId;
  shapeLabel?: string;
  pigmentName?: string;
  techniqueLabel?: string;
};

export type BrowCanvasViewOptions = {
  showMappingLines: boolean;
  showLabels: boolean;
  showPigmentPreview: boolean;
};

const MAX_UNDO = 30;

function cloneGeometry(g: BrowMappingGeometry): BrowMappingGeometry {
  return JSON.parse(JSON.stringify(g)) as BrowMappingGeometry;
}

export function useBrowCanvas(imageSrc: string | null, options?: BrowCanvasOptions) {
  const stylePreview = options?.stylePreview ?? "mapping-only";
  const pigmentHex = options?.pigmentHex ?? "#4a3220";
  const browShape = options?.browShape ?? "arch";

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const autoGeometryRef = useRef<BrowMappingGeometry | null>(null);
  const geometryRef = useRef<BrowMappingGeometry | null>(null);
  const pointsRef = useRef<ReturnType<typeof geometryToDraggablePoints> | null>(null);
  const undoStackRef = useRef<BrowMappingGeometry[]>([]);
  const dragStartRef = useRef<BrowMappingGeometry | null>(null);

  const [dragging, setDragging] = useState<DraggablePointId | null>(null);
  const [activePoint, setActivePoint] = useState<DraggablePointId | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [ready, setReady] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [geometry, setGeometry] = useState<BrowMappingGeometry | null>(null);
  const [view, setView] = useState<BrowCanvasViewOptions>({
    showMappingLines: true,
    showLabels: true,
    showPigmentPreview: true,
  });

  const pushUndo = useCallback(() => {
    if (!geometryRef.current) return;
    undoStackRef.current = [...undoStackRef.current.slice(-(MAX_UNDO - 1)), cloneGeometry(geometryRef.current)];
    setCanUndo(true);
  }, []);

  const applyGeometry = useCallback((g: BrowMappingGeometry, recordUndo = false) => {
    if (recordUndo) pushUndo();
    geometryRef.current = g;
    pointsRef.current = geometryToDraggablePoints(g);
    setGeometry({ ...g });
  }, [pushUndo]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const img = imageRef.current;
    const g = geometryRef.current;
    if (!canvas || !wrap || !img) return;

    const { scale, width: w, height: h } = getDisplaySize(
      { width: img.naturalWidth, height: img.naturalHeight },
      wrap.clientWidth,
    );
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

    if (!g || !pointsRef.current) return;

    const displayGeo = scaleGeometry(draggablePointsToGeometry(pointsRef.current, g), scale);

    if (view.showMappingLines) {
      drawBrowMappingOverlay(ctx, displayGeo, {
        showLabels: view.showLabels,
        activePoint: dragging ?? activePoint,
      });
    }
    if (view.showPigmentPreview) {
      drawBrowStylePreview(ctx, displayGeo, stylePreview, pigmentHex, browShape);
    }
  }, [activePoint, browShape, dragging, pigmentHex, stylePreview, view]);

  const initFromLandmarks = useCallback(
    (landmarks: import("@mediapipe/face_mesh").NormalizedLandmark[], img: HTMLImageElement) => {
      const g = computeBrowMappingFromLandmarks(landmarks, img.naturalWidth, img.naturalHeight);
      if (!g) return false;
      autoGeometryRef.current = cloneGeometry(g);
      applyGeometry(g);
      setError(null);
      setManualMode(false);
      return true;
    },
    [applyGeometry],
  );

  useEffect(() => {
    if (!imageSrc) return;
    let cancelled = false;
    setReady(false);
    setDetecting(true);
    setError(null);
    setGeometry(null);
    geometryRef.current = null;
    pointsRef.current = null;
    autoGeometryRef.current = null;
    undoStackRef.current = [];
    setCanUndo(false);

    const img = new Image();
    img.onload = async () => {
      if (cancelled) return;
      imageRef.current = img;
      try {
        const landmarks = await detectFaceLandmarks(img);
        if (cancelled) return;
        if (landmarks && initFromLandmarks(landmarks, img)) {
          setReady(true);
        } else {
          const fallback = createDefaultManualGeometry(img.naturalWidth, img.naturalHeight);
          autoGeometryRef.current = cloneGeometry(fallback);
          applyGeometry(fallback);
          setManualMode(true);
          setError("No face detected. Use manual mapping mode — drag the dots to match bone structure.");
          setReady(true);
        }
      } catch {
        if (cancelled) return;
        const fallback = createDefaultManualGeometry(img.naturalWidth, img.naturalHeight);
        autoGeometryRef.current = cloneGeometry(fallback);
        applyGeometry(fallback);
        setManualMode(true);
        setError("Face detection unavailable. Manual mapping mode is active — adjust dots on the photo.");
        setReady(true);
      } finally {
        if (!cancelled) setDetecting(false);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setError("Could not load image.");
        setDetecting(false);
      }
    };
    img.src = imageSrc;

    return () => {
      cancelled = true;
    };
  }, [applyGeometry, imageSrc, initFromLandmarks]);

  useEffect(() => {
    if (ready) paint();
  }, [ready, paint]);

  useEffect(() => {
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  const pointerPosImageSpace = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const img = imageRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scale = displayScale(img.naturalWidth, rect.width);
    return displayToImageSpace(e.clientX - rect.left, e.clientY - rect.top, scale);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = geometryRef.current;
    const img = imageRef.current;
    const wrap = wrapRef.current;
    if (!g || !pointsRef.current || !img || !wrap) return;
    const scale = displayScale(img.naturalWidth, wrap.clientWidth);
    const displayGeo = scaleGeometry(g, scale);
    const pos = pointerPosImageSpace(e);
    const displayPos = { x: pos.x * scale, y: pos.y * scale };
    const hit = hitTestDraggablePoint(displayPos.x, displayPos.y, displayGeo);
    if (hit) {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragStartRef.current = geometryRef.current ? cloneGeometry(geometryRef.current) : null;
      setDragging(hit);
      setActivePoint(hit);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging || !pointsRef.current || !geometryRef.current) return;
    const pos = pointerPosImageSpace(e);
    pointsRef.current[dragging] = pos;
    geometryRef.current = draggablePointsToGeometry(pointsRef.current, geometryRef.current);
    setGeometry({ ...geometryRef.current });
    paint();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragging && geometryRef.current && dragStartRef.current) {
      undoStackRef.current = [...undoStackRef.current.slice(-(MAX_UNDO - 1)), dragStartRef.current];
      setCanUndo(true);
      setGeometry({ ...geometryRef.current });
    }
    dragStartRef.current = null;
    setDragging(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const resetAll = useCallback(() => {
    if (autoGeometryRef.current) {
      applyGeometry(cloneGeometry(autoGeometryRef.current));
    } else if (imageRef.current) {
      applyGeometry(createDefaultManualGeometry(imageRef.current.naturalWidth, imageRef.current.naturalHeight));
    }
  }, [applyGeometry]);

  const resetSide = useCallback(
    (side: "left" | "right") => {
      const base = autoGeometryRef.current ?? geometryRef.current;
      const current = geometryRef.current;
      if (!base || !current) return;
      const next = cloneGeometry(current);
      if (side === "left") next.left = { ...base.left };
      else next.right = { ...base.right };
      applyGeometry(next, true);
    },
    [applyGeometry],
  );

  const undo = useCallback(() => {
    const prev = undoStackRef.current.pop();
    if (prev) {
      geometryRef.current = prev;
      pointsRef.current = geometryToDraggablePoints(prev);
      setGeometry({ ...prev });
      setCanUndo(undoStackRef.current.length > 0);
      paint();
    }
  }, [paint]);

  const enableManualMode = useCallback(() => {
    setManualMode(true);
    if (!geometryRef.current && imageRef.current) {
      const g = createDefaultManualGeometry(imageRef.current.naturalWidth, imageRef.current.naturalHeight);
      autoGeometryRef.current = cloneGeometry(g);
      applyGeometry(g);
      setReady(true);
    }
    setError(null);
  }, [applyGeometry]);

  const getGeometry = useCallback((): BrowMappingGeometry | null => {
    return geometryRef.current ? cloneGeometry(geometryRef.current) : null;
  }, []);

  const getImage = useCallback(() => imageRef.current, []);

  const renderExportCanvas = useCallback(() => {
    const img = imageRef.current;
    const g = geometryRef.current;
    if (!img || !g) return null;
    return renderBrowCanvas(img, g, {
      stylePreview,
      pigmentHex,
      browShape,
      showMappingLines: view.showMappingLines,
      showLabels: view.showLabels,
      showPigmentPreview: view.showPigmentPreview,
      shapeLabel: options?.shapeLabel,
      pigmentName: options?.pigmentName,
      techniqueLabel: options?.techniqueLabel,
      maxWidth: img.naturalWidth,
    });
  }, [browShape, options?.pigmentName, options?.shapeLabel, options?.techniqueLabel, pigmentHex, stylePreview, view]);

  const exportPng = useCallback(() => {
    const canvas = renderExportCanvas();
    if (!canvas) return;
    exportMappedPhotoPng(canvas);
  }, [renderExportCanvas]);

  return {
    wrapRef,
    canvasRef,
    ready,
    detecting,
    error,
    manualMode,
    geometry,
    view,
    setView,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    resetAll,
    resetSide,
    undo,
    canUndo,
    enableManualMode,
    getGeometry,
    getImage,
    exportPng,
    renderExportCanvas,
    setShowOverlay: (v: boolean | ((prev: boolean) => boolean)) =>
      setView((prev) => ({
        ...prev,
        showMappingLines: typeof v === "function" ? v(prev.showMappingLines) : v,
      })),
    showOverlay: view.showMappingLines,
    resetMapping: resetAll,
  };
}
