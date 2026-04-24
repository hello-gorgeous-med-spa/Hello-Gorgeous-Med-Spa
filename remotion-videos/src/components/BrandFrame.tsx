import React from "react";
import type { VideoFormat } from "../brand/theme";
import { scaledSize } from "../brand/theme";
import { HG_BRAND_PINK } from "../brand/hg";

export type BrandFrameProps = {
  format: VideoFormat;
  children: React.ReactNode;
  /** Constrain read width on wide compositions (e.g. 9:16 safe column). */
  maxWidth?: number;
  /**
   * Optional “premium” top rule — not the same as `TextBlock`’s motion accent bar
   * (this is a static layout guide for empty sections or hero shells).
   */
  topRule?: boolean;
  /** Default horizontal padding; vertical 9:16 default 32. */
  paddingX?: number;
  /** Optional micro-label above children (e.g. service name). */
  kicker?: string;
};

/**
 * Consistent content width + padding for Hello Gorgeous Reels; keeps type readable on 1080×1920.
 * Does not replace `Scene` (background) or `TextBlock` (copy).
 */
export const BrandFrame: React.FC<BrandFrameProps> = ({
  format,
  children,
  maxWidth = 920,
  topRule = false,
  paddingX = 32,
  kicker,
}) => {
  const kick = scaledSize(11, format);
  return (
    <div
      style={{
        width: "100%",
        maxWidth,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: paddingX,
        paddingRight: paddingX,
        boxSizing: "border-box",
      }}
    >
      {topRule ? (
        <div
          style={{
            height: 1,
            width: 48,
            background: `linear-gradient(90deg, ${HG_BRAND_PINK}, transparent)`,
            marginBottom: 12,
            opacity: 0.85,
          }}
        />
      ) : null}
      {kicker ? (
        <p
          style={{
            fontSize: kick,
            fontWeight: 700,
            letterSpacing: 2,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            margin: "0 0 8px",
          }}
        >
          {kicker}
        </p>
      ) : null}
      {children}
    </div>
  );
};
