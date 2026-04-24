import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { scaledSize, type VideoFormat, SHADOWS } from "../brand/theme";
import { HG_BRAND_PINK, HG_DISCLAIMER_SHORT } from "../brand/hg";
import { TextBlock, type TextLine } from "./TextBlock";

export type CTAProps = {
  format: VideoFormat;
  /** Main conversion line(s). */
  lines: TextLine[];
  /** Optional e.g. URL or phone. */
  urlOrDetail?: { text: string; delay?: number };
  cityLine?: string;
  /** Pill chip below URL. */
  pill?: { text: string; delayFrames?: number };
  baseSize?: number;
};

const Reveal: React.FC<{
  children: React.ReactNode;
  delay: number;
  y?: number;
}> = ({ children, delay, y = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const slide = spring({ frame: frame - delay, fps, from: y, to: 0, config: { damping: 16 } });
  return <div style={{ opacity: o, transform: `translateY(${slide}px)` }}>{children}</div>;
};

/**
 * End-card style CTA: stacked lines + optional URL + optional pill, plus a fixed bottom disclaimer region.
 * Pair with `Scene` (same frame) and place this block in a top/center `BrandFrame` or absolute layer;
 * `DisclaimerBar` is exported for pinning to the real bottom of the frame.
 */
export const CTA: React.FC<CTAProps> = ({ format, lines, urlOrDetail, cityLine, pill, baseSize = 46 }) => {
  const frame = useCurrentFrame();
  const t = scaledSize(baseSize, format);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      <TextBlock format={format} lines={lines} showAccentBar baseSize={baseSize} align="center" />
      {urlOrDetail ? (
        <Reveal delay={urlOrDetail.delay ?? 50}>
          <p
            style={{
              fontSize: t * 0.4,
              fontWeight: 800,
              color: "#fff",
              margin: "8px 0 0",
              wordBreak: "break-word",
            }}
          >
            {urlOrDetail.text}
          </p>
        </Reveal>
      ) : null}
      {cityLine ? (
        <p style={{ fontSize: scaledSize(13, format), color: "rgba(255,255,255,0.55)", margin: "6px 0 0" }}>{cityLine}</p>
      ) : null}
      {pill ? (
        <div
          style={{
            marginTop: 20,
            padding: "10px 22px",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${HG_BRAND_PINK}dd, #ff4da6)`,
            color: "#fff",
            fontSize: t * 0.32,
            fontWeight: 800,
            boxShadow: SHADOWS.buttonGlow(HG_BRAND_PINK),
            opacity: interpolate(frame, [pill.delayFrames ?? 60, 75], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {pill.text}
        </div>
      ) : null}
    </div>
  );
};

/** Bottom-fixed disclaimer for end scenes (separate from CTA main block for layout control). */
export const DisclaimerBar: React.FC<{
  format: VideoFormat;
  /** Default: “Consultation required. Individual results may vary.” */
  primary?: string;
  secondary?: string;
}> = ({ format, primary = HG_DISCLAIMER_SHORT, secondary }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "20px 28px 28px",
      textAlign: "center",
    }}
  >
    <p
      style={{
        fontSize: scaledSize(12, format),
        lineHeight: 1.4,
        color: "rgba(255,255,255,0.5)",
        margin: 0,
      }}
    >
      {primary} {secondary ? ` ${secondary}` : ""}
    </p>
  </div>
);

/** Re-export for common CTA + MODEL pattern */
export { BrandSpan, HG_BRAND_PINK };
