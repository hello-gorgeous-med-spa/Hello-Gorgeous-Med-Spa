import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { scaledSize, type VideoFormat } from "../brand/theme";
import { SHADOWS } from "../brand/theme";
import { HG_BRAND_PINK } from "../brand/hg";

export type TextLineRole = "hero" | "title" | "body" | "support" | "accent" | "muted";

export type TextLine = {
  /** Frame offset within the scene when this line starts animating. */
  delay: number;
  /** Main copy (string or JSX for brand spans). */
  content: React.ReactNode;
  role?: TextLineRole;
  /** Extra text shadow / emphasis (e.g. hook line). */
  emphasize?: boolean;
};

export type TextBlockProps = {
  format: VideoFormat;
  /** Lines revealed in order; each uses scene-relative `delay` (frames). */
  lines: TextLine[];
  /** Animated pink accent bar above the first line. */
  showAccentBar?: boolean;
  /** Optional small footnote below all lines. */
  footnote?: React.ReactNode;
  /** Base scale for hero/title (multiplied by role). Default matches Contour Lift legibility. */
  baseSize?: number;
  align?: "left" | "center";
};

const roleToMultiplier: Record<TextLineRole, number> = {
  hero: 0.86,
  title: 0.68,
  body: 0.58,
  support: 0.38,
  accent: 0.62,
  muted: 0.32,
};

const TextReveal: React.FC<{
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

const AccentBar: React.FC<{ frame: number }> = ({ frame }) => {
  const w = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        width: `${Math.round(220 * w)}px`,
        maxWidth: "72%",
        height: 3,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${HG_BRAND_PINK} 0%, rgba(255,255,255,0.2) 100%)`,
        marginBottom: 12,
        boxShadow: `0 0 16px ${HG_BRAND_PINK}40`,
      }}
    />
  );
};

/**
 * Stacked, animated text lines with optional accent bar and footnote.
 * Tuned for mobile readability on 1080×1920.
 */
export const TextBlock: React.FC<TextBlockProps> = ({
  format,
  lines,
  showAccentBar,
  footnote,
  baseSize = 52,
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const t = scaledSize(baseSize, format);
  const alignItems = align === "center" ? "center" : "stretch";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems,
        maxWidth: "100%",
        textAlign: align,
        width: "100%",
      }}
    >
      {showAccentBar ? <AccentBar frame={frame} /> : null}
      {lines.map((line, i) => {
        const role = line.role ?? (i === 0 ? "hero" : "body");
        const mult = roleToMultiplier[role];
        const fontSize = t * mult;
        const color =
          role === "accent"
            ? HG_BRAND_PINK
            : role === "muted"
              ? "rgba(255,255,255,0.45)"
              : "#fff";
        const fontWeight =
          role === "hero" || role === "title" ? 900 : role === "muted" || role === "support" ? 500 : 800;
        const marginTop = i === 0 && !showAccentBar ? 0 : i === 0 ? 0 : 10;
        const isHeading = role === "hero" || role === "title";
        const useSemibold = role === "support";
        return (
          <TextReveal key={i} delay={line.delay}>
            {isHeading ? (
              <h2
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize,
                  fontWeight,
                  lineHeight: role === "title" ? 1.2 : 1.1,
                  color: "#fff",
                  margin: `${marginTop}px 0 0`,
                  textShadow: line.emphasize
                    ? "0 4px 32px rgba(0,0,0,0.6)"
                    : "0 2px 20px rgba(0,0,0,0.5)",
                }}
              >
                {line.content}
              </h2>
            ) : (
              <p
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize,
                  fontWeight: useSemibold ? 600 : fontWeight,
                  lineHeight: role === "muted" || role === "support" ? 1.35 : 1.2,
                  color: role === "support" ? "rgba(255,255,255,0.9)" : color,
                  margin: `${marginTop}px 0 0`,
                  textShadow:
                    line.emphasize && role !== "muted"
                      ? `0 0 32px ${HG_BRAND_PINK}60`
                      : "0 2px 16px rgba(0,0,0,0.5)",
                }}
              >
                {line.content}
              </p>
            )}
          </TextReveal>
        );
      })}
      {footnote ? (
        <p
          style={{
            fontSize: scaledSize(12, format),
            color: "rgba(255,255,255,0.45)",
            marginTop: 14,
            lineHeight: 1.35,
          }}
        >
          {footnote}
        </p>
      ) : null}
    </div>
  );
};

/** Use inside a line’s `content` for pink brand contrast. */
export const BrandSpan: React.FC<{ children: React.ReactNode; glow?: boolean }> = ({ children, glow }) => (
  <span style={{ color: HG_BRAND_PINK, textShadow: glow ? SHADOWS.textGlow(HG_BRAND_PINK) : undefined }}>{children}</span>
);
