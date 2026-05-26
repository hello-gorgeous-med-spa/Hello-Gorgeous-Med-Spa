"use client";

import type { useBrowCanvas } from "@/components/admin/brow-mapping/useBrowCanvas";

type CanvasApi = ReturnType<typeof useBrowCanvas>;

export function BrowCanvas({
  canvas,
  hasImage,
}: {
  canvas: CanvasApi;
  hasImage: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
        <div ref={canvas.wrapRef} className="relative w-full bg-black">
          {!hasImage ? (
            <div className="flex aspect-[3/4] items-center justify-center text-sm text-gray-400">
              Upload a client photo to begin mapping
            </div>
          ) : (
            <>
              <canvas
                ref={canvas.canvasRef}
                className="block w-full touch-none"
                onPointerDown={canvas.onPointerDown}
                onPointerMove={canvas.onPointerMove}
                onPointerUp={canvas.onPointerUp}
                onPointerLeave={canvas.onPointerUp}
                aria-label="Brow mapping canvas"
              />
              {canvas.detecting ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white">
                  Detecting face landmarks…
                </div>
              ) : null}
              {canvas.error ? (
                <div className="absolute bottom-0 left-0 right-0 bg-amber-500/90 px-4 py-2 text-center text-xs font-semibold text-black">
                  {canvas.error}
                </div>
              ) : null}
              {canvas.manualMode ? (
                <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#FFB8DC]">
                  Manual mapping
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => canvas.setView((v) => ({ ...v, showMappingLines: !v.showMappingLines }))}
          className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold"
        >
          {canvas.view.showMappingLines ? "Hide" : "Show"} mapping lines
        </button>
        <button
          type="button"
          onClick={() => canvas.setView((v) => ({ ...v, showPigmentPreview: !v.showPigmentPreview }))}
          className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold"
        >
          {canvas.view.showPigmentPreview ? "Hide" : "Show"} pigment preview
        </button>
        <button
          type="button"
          onClick={() => canvas.setView((v) => ({ ...v, showLabels: !v.showLabels }))}
          className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold"
        >
          {canvas.view.showLabels ? "Hide" : "Show"} labels
        </button>
        <button type="button" onClick={canvas.resetAll} className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold">
          Reset all
        </button>
        <button type="button" onClick={() => canvas.resetSide("left")} className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold">
          Reset left
        </button>
        <button type="button" onClick={() => canvas.resetSide("right")} className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold">
          Reset right
        </button>
        <button
          type="button"
          onClick={canvas.undo}
          disabled={!canvas.canUndo}
          className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
        >
          Undo
        </button>
      </div>
    </div>
  );
}
