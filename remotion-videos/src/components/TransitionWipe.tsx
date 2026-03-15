import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../brand/theme";

type WipeStyle = "goldSweep" | "blurDissolve" | "fadeBlack" | "pinkSweep";

interface TransitionWipeProps {
  style?: WipeStyle;
  duration?: number;
  color?: string;
}

export const TransitionWipe: React.FC<TransitionWipeProps> = ({
  style = "goldSweep",
  duration = 15,
  color,
}) => {
  const frame = useCurrentFrame();

  if (style === "fadeBlack") {
    const opacity = interpolate(frame, [0, duration / 2, duration], [0, 1, 0], {
      extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill style={{ background: COLORS.black, opacity, zIndex: 9999 }} />
    );
  }

  if (style === "blurDissolve") {
    const blur = interpolate(frame, [0, duration / 2, duration], [0, 20, 0], {
      extrapolateRight: "clamp",
    });
    const opacity = interpolate(frame, [0, duration / 2, duration], [0, 0.8, 0], {
      extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill
        style={{
          background: COLORS.black,
          opacity,
          backdropFilter: `blur(${blur}px)`,
          zIndex: 9999,
        }}
      />
    );
  }

  // goldSweep or pinkSweep
  const sweepColor = style === "pinkSweep"
    ? (color || COLORS.hotPink)
    : (color || COLORS.gold);

  const sweepX = interpolate(frame, [0, duration], [-110, 110], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 3, duration - 3, duration], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, zIndex: 9999, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: `${sweepX}%`,
          top: 0,
          width: "30%",
          height: "100%",
          background: `linear-gradient(90deg, transparent, ${sweepColor}90, ${sweepColor}, ${sweepColor}90, transparent)`,
          filter: "blur(10px)",
        }}
      />
    </AbsoluteFill>
  );
};
