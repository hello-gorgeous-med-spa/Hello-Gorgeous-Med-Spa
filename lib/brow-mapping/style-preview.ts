import type { BrowMappingGeometry, BrowShapeId, BrowStylePreviewId } from "@/data/brow-mapping-intelligence";

export type { BrowStylePreviewId };
export { BROW_STYLE_PREVIEWS } from "@/data/brow-mapping-intelligence";

import { renderBrowStampLayer } from "@/lib/brow-mapping/browRenderer";

/** @deprecated Use renderBrowStampLayer / renderBrowPreviewFrame */
export function drawBrowStylePreview(
  ctx: CanvasRenderingContext2D,
  geometry: BrowMappingGeometry,
  styleId: BrowStylePreviewId,
  pigmentHex = "#4a3220",
  browShape: BrowShapeId = "arch",
  showPigmentPreview = true,
) {
  renderBrowStampLayer(ctx, geometry, browShape, styleId, pigmentHex, showPigmentPreview);
}

export function pigmentHexForUndertone(undertone: string): string {
  switch (undertone) {
    case "cool":
      return "#5c4033";
    case "warm":
      return "#6b4423";
    case "olive":
      return "#4a5d3a";
    default:
      return "#4a3220";
  }
}
