import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { VideoFormat } from "../brand/theme";
import { Logo } from "../brand/Logo";

export type SceneOverlay = "none" | "gradient" | "bottomHeavy";

export type SceneContentPlacement = "bottom" | "top" | "center" | "fill";

export type SceneProps = {
  format: VideoFormat;
  /** Layer behind overlay (e.g. KenBurnsBackground or solid). */
  background: React.ReactNode;
  overlay?: SceneOverlay;
  /** Where the main content block is anchored. */
  placement?: SceneContentPlacement;
  /** Hello Gorgeous wordmark — top-left. */
  showWatermark?: boolean;
  children: React.ReactNode;
  /** Outer padding for the content region (px). */
  padding?: { x?: number; y?: number; bottom?: number; top?: number };
  /** e.g. `<DisclaimerBar />` — pinned under content (use absolute in child). */
  footer?: React.ReactNode;
};

const overlayStyle = (mode: SceneOverlay): React.CSSProperties | undefined => {
  if (mode === "none") return undefined;
  return {
    pointerEvents: "none" as const,
    background:
      mode === "bottomHeavy"
        ? "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.78) 50%, rgba(0,0,0,0.92) 100%)"
        : "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.8) 100%)",
  };
};

const placementStyle = (
  placement: SceneContentPlacement,
  pad: NonNullable<SceneProps["padding"]>
): React.CSSProperties => {
  const px = pad.x ?? 32;
  const pyTop = pad.top ?? pad.y ?? 32;
  const pyBottom = pad.bottom ?? pad.y ?? 44;
  const base: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    paddingLeft: px,
    paddingRight: px,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  };
  switch (placement) {
    case "top":
      return { ...base, top: pyTop, paddingTop: 0, paddingBottom: pyBottom, alignItems: "stretch" };
    case "center":
      return {
        ...base,
        inset: 0,
        padding: `${pyTop}px ${px}px ${pyBottom}px`,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      };
    case "fill":
      return { ...base, inset: 0, padding: `${pyTop}px ${px}px ${pyBottom}px` };
    case "bottom":
    default:
      return {
        ...base,
        bottom: 0,
        paddingTop: pyTop,
        paddingBottom: pyBottom,
        justifyContent: "flex-end",
      };
  }
};

/**
 * Full-frame scene: background layer, optional gradient overlay, optional logo, and content.
 * Default: vertical-safe padding; works with square/horizontal via `format` in children.
 */
export const Scene: React.FC<SceneProps> = ({
  format,
  background,
  overlay = "gradient",
  placement = "bottom",
  showWatermark = true,
  children,
  padding,
  footer,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {background}
      {overlay !== "none" ? <AbsoluteFill style={overlayStyle(overlay)} /> : null}
      {showWatermark ? <Logo format={format} variant="watermark" /> : null}
      <div style={placementStyle(placement, padding ?? {})}>{children}</div>
      {footer}
    </AbsoluteFill>
  );
};

const res = (p: string) => staticFile(p);

export type KenBurnsBackgroundProps = {
  src: string;
  alt: string;
  /** Pan bias: start more left vs right. */
  panTo?: 0 | 1;
  zoomEnd?: number;
  /** Must match parent `Sequence` duration in frames. */
  sequenceFrames: number;
};

/**
 * Full-bleed cover image with subtle zoom + horizontal pan (per-scene relative frames).
 */
export const KenBurnsBackground: React.FC<KenBurnsBackgroundProps> = ({
  src,
  alt,
  panTo = 0,
  zoomEnd = 1.09,
  sequenceFrames,
}) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / Math.max(1, sequenceFrames - 1));
  const ease = Easing.bezier(0.33, 0, 0.2, 1);
  const z = interpolate(t, [0, 1], [1, zoomEnd], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const posX = interpolate(t, [0, 1], [panTo === 0 ? 32 : 68, panTo === 0 ? 48 : 52], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img
        src={res(src)}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${posX}% 45%`,
          transform: `scale(${z})`,
        }}
      />
    </AbsoluteFill>
  );
};
