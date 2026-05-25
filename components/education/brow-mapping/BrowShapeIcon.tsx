import { browShapeIconPath, browShapeStrokeColors } from "@/lib/brow-mapping/shape-presets";
import type { BrowShapeId } from "@/data/brow-mapping-intelligence";

export function BrowShapeIcon({ shapeId, active }: { shapeId: BrowShapeId; active?: boolean }) {
  const path = browShapeIconPath(shapeId);
  const colors = browShapeStrokeColors(shapeId);

  return (
    <svg viewBox="0 0 60 36" className="h-8 w-14" aria-hidden>
      <rect width="60" height="36" rx="6" fill={active ? "rgba(230,0,126,0.15)" : "rgba(255,255,255,0.06)"} />
      {colors.map((color, i) => (
        <path
          key={color + i}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={1.8 - i * 0.3}
          strokeLinecap="round"
          transform={`translate(0, ${i * 1.5 - 1})`}
          opacity={0.85 - i * 0.15}
        />
      ))}
    </svg>
  );
}
