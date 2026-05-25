import { useCallback, useEffect, useRef, useState } from "react";

import type { PmuBrushId, PmuTemplateId } from "@/data/pmu-practice";
import { PMU_BRUSH_BY_ID } from "@/data/pmu-practice";
import { loadTemplateImage, templateDimensions } from "@/lib/pmu-practice/face-template";

type Point = { x: number; y: number };

const MAX_UNDO = 25;

function dist(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function drawMappingSolid(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, width: number) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function drawMappingSketch(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, width: number) {
  const steps = Math.max(3, Math.floor(dist(from, to) / 6));
  ctx.strokeStyle = color;
  ctx.lineWidth = width * 0.8;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.45;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = from.x + (to.x - from.x) * t + (Math.random() - 0.5) * 2.5;
    const y = from.y + (to.y - from.y) * t + (Math.random() - 0.5) * 2.5;
    if (i === 0) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawMappingDotted(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, width: number) {
  const length = dist(from, to);
  const gap = 7;
  const count = Math.floor(length / gap);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.9;
  for (let i = 0; i <= count; i++) {
    const t = i / Math.max(count, 1);
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t;
    ctx.beginPath();
    ctx.arc(x, y, width * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHairStroke(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  width: number,
  opacity: number,
  strokeLen: number,
  curve: number,
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  if (dist(from, to) < 1.5) return;

  const count = Math.max(1, Math.floor(dist(from, to) / 5));
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.globalAlpha = opacity;

  for (let i = 0; i < count; i++) {
    const t = (i + 1) / count;
    const cx = from.x + (to.x - from.x) * t;
    const cy = from.y + (to.y - from.y) * t;
    const perp = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.35;
    const len = strokeLen * (0.85 + Math.random() * 0.3);
    const taper = width * (0.6 + Math.random() * 0.5);
    ctx.lineWidth = taper;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(
      cx + Math.cos(perp) * len * 0.45,
      cy + Math.sin(perp) * len * 0.45,
      cx + Math.cos(perp + curve) * len,
      cy + Math.sin(perp + curve) * len,
    );
    ctx.stroke();
  }
}

function drawShading(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  size: number,
  opacity: number,
  dense: boolean,
) {
  const length = dist(from, to);
  const spacing = dense ? 2.2 : 4.5;
  const count = Math.max(1, Math.floor(length / spacing));
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  for (let i = 0; i <= count; i++) {
    const t = i / Math.max(count, 1);
    const x = from.x + (to.x - from.x) * t + (Math.random() - 0.5) * (dense ? 2 : 5);
    const y = from.y + (to.y - from.y) * t + (Math.random() - 0.5) * (dense ? 2 : 5);
    const r = size * (0.35 + Math.random() * 0.65);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStrokeSegment(
  ctx: CanvasRenderingContext2D,
  brushId: PmuBrushId,
  from: Point,
  to: Point,
  color: string,
) {
  const brush = PMU_BRUSH_BY_ID[brushId];
  ctx.globalCompositeOperation = brushId === "eraser" ? "destination-out" : "source-over";

  switch (brushId) {
    case "mapping-solid":
      drawMappingSolid(ctx, from, to, color, brush.size);
      break;
    case "mapping-sketch":
      drawMappingSketch(ctx, from, to, color, brush.size);
      break;
    case "mapping-dotted":
      drawMappingDotted(ctx, from, to, color, brush.size);
      break;
    case "outline":
      drawMappingSolid(ctx, from, to, color, brush.size);
      break;
    case "microblading":
      drawHairStroke(ctx, from, to, color, brush.size, brush.opacity, 16, 0.55);
      break;
    case "nano":
      drawHairStroke(ctx, from, to, color, brush.size, brush.opacity, 11, 0.45);
      break;
    case "nano-fine":
      drawHairStroke(ctx, from, to, color, brush.size, brush.opacity, 7, 0.35);
      break;
    case "shading-whip":
      drawShading(ctx, from, to, color, brush.size, brush.opacity, true);
      break;
    case "shading-pendulum":
      drawShading(ctx, from, to, color, brush.size, brush.opacity, false);
      break;
    case "eraser": {
      ctx.lineCap = "round";
      ctx.lineWidth = brush.size;
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      break;
    }
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

export function usePmuCanvas(options: {
  templateId: PmuTemplateId;
  showGuides: boolean;
  brushId: PmuBrushId;
  pigmentHex: string;
  mappingColor: string;
}) {
  const { templateId, showGuides, brushId, pigmentHex, mappingColor } = options;
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const undoStack = useRef<ImageData[]>([]);
  const isDrawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  const [ready, setReady] = useState(false);

  const getColor = useCallback(() => {
    if (brushId.startsWith("mapping") || brushId === "outline") return mappingColor;
    return pigmentHex;
  }, [brushId, mappingColor, pigmentHex]);

  const snapshot = useCallback(() => {
    const canvas = drawRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.current.length > MAX_UNDO) undoStack.current.shift();
  }, []);

  const paintBackground = useCallback(async (opts?: { clearDrawing?: boolean }) => {
    const bg = bgRef.current;
    const draw = drawRef.current;
    const wrap = wrapRef.current;
    if (!bg || !draw || !wrap) return;

    const { width, height } = templateDimensions(templateId);
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = wrap.clientWidth;
    const displayHeight = (displayWidth * height) / width;

    for (const canvas of [bg, draw]) {
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const img = await loadTemplateImage(templateId, showGuides);
    const bgCtx = bg.getContext("2d");
    if (bgCtx) {
      bgCtx.clearRect(0, 0, displayWidth, displayHeight);
      bgCtx.drawImage(img, 0, 0, displayWidth, displayHeight);
    }

    if (opts?.clearDrawing !== false) {
      const drawCtx = draw.getContext("2d");
      if (drawCtx) {
        drawCtx.clearRect(0, 0, displayWidth, displayHeight);
      }
      undoStack.current = [];
    }

    setReady(true);
  }, [showGuides, templateId]);

  const refreshBackground = useCallback(async () => {
    const bg = bgRef.current;
    const wrap = wrapRef.current;
    if (!bg || !wrap) return;
    const { width, height } = templateDimensions(templateId);
    const displayWidth = wrap.clientWidth;
    const displayHeight = (displayWidth * height) / width;
    const img = await loadTemplateImage(templateId, showGuides);
    const bgCtx = bg.getContext("2d");
    if (bgCtx) {
      bgCtx.clearRect(0, 0, displayWidth, displayHeight);
      bgCtx.drawImage(img, 0, 0, displayWidth, displayHeight);
    }
  }, [showGuides, templateId]);

  useEffect(() => {
    setReady(false);
    void paintBackground();
  }, [templateId]); // eslint-disable-line react-hooks/exhaustive-deps -- template switch clears canvas

  useEffect(() => {
    if (!ready) return;
    void refreshBackground();
  }, [showGuides, refreshBackground, ready]);

  useEffect(() => {
    const onResize = () => {
      void paintBackground();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paintBackground]);

  const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = drawRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ready) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    snapshot();
    lastPoint.current = pointerPos(e);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPoint.current) return;
    const ctx = drawRef.current?.getContext("2d");
    if (!ctx) return;
    const next = pointerPos(e);
    drawStrokeSegment(ctx, brushId, lastPoint.current, next, getColor());
    lastPoint.current = next;
  };

  const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPoint.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const undo = useCallback(() => {
    const canvas = drawRef.current;
    const ctx = canvas?.getContext("2d");
    const prev = undoStack.current.pop();
    if (!canvas || !ctx || !prev) return;
    ctx.putImageData(prev, 0, 0);
  }, []);

  const clearDrawing = useCallback(() => {
    const canvas = drawRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    snapshot();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [snapshot]);

  const exportPng = useCallback(() => {
    const bg = bgRef.current;
    const draw = drawRef.current;
    if (!bg || !draw) return;
    const merged = document.createElement("canvas");
    merged.width = draw.width;
    merged.height = draw.height;
    const ctx = merged.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(draw, 0, 0);
    const link = document.createElement("a");
    link.download = `hg-pmu-practice-${Date.now()}.png`;
    link.href = merged.toDataURL("image/png");
    link.click();
  }, []);

  return {
    wrapRef,
    bgRef,
    drawRef,
    ready,
    onPointerDown,
    onPointerMove,
    onPointerUp: endStroke,
    onPointerLeave: endStroke,
    undo,
    clearDrawing,
    exportPng,
    repaintBackground: paintBackground,
  };
}
