import type { BrowMappingGeometry, BrowShapeId, BrowStylePreviewId } from "@/data/brow-mapping-intelligence";
import type { DraggablePointId } from "@/lib/brow-mapping/geometry";

/** Single source of truth for canvas preview — all UI drives this. */
export type BrowPreviewState = {
  geometry: BrowMappingGeometry | null;
  selectedShape: BrowShapeId;
  selectedTechnique: BrowStylePreviewId;
  pigmentHex: string;
  showMappingGuides: boolean;
  showPigmentPreview: boolean;
  showLabels: boolean;
  manualMode: boolean;
  activePoint: DraggablePointId | null;
  dragging: DraggablePointId | null;
};

export const DEFAULT_BROW_PREVIEW_STATE: Omit<BrowPreviewState, "geometry"> = {
  selectedShape: "arch",
  selectedTechnique: "individual-strokes",
  pigmentHex: "#6b4f3a",
  showMappingGuides: true,
  showPigmentPreview: true,
  showLabels: true,
  manualMode: false,
  activePoint: null,
  dragging: null,
};
