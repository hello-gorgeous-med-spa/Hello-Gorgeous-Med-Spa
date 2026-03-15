import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, GRADIENTS } from "./theme";

// Animated glow orb for ambient lighting
export const GlowOrb: React.FC<{
  color: string;
  size: number;
  x: number;
  y: number;
  speed?: number;
}> = ({ color, size, x, y, speed = 0.05 }) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * speed) * 0.3 + 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size * pulse,
        height: size * pulse,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}50 0%, transparent 70%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
      }}
    />
  );
};

// Solid dark background
export const SolidDark: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: COLORS.black }}>{children}</AbsoluteFill>
);

// Warm gradient background (gold-tinged dark)
export const GradientWarm: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: GRADIENTS.warmDark }}>{children}</AbsoluteFill>
);

// Dark with pink radial glow
export const GradientDarkPink: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: GRADIENTS.darkVertical }}>{children}</AbsoluteFill>
);

// Dark with radial center glow
export const GradientRadial: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: GRADIENTS.darkRadial }}>{children}</AbsoluteFill>
);

// Subtle grain texture overlay
export const GrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 3;
  return (
    <AbsoluteFill
      style={{
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.${65 + seed}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
};

// Full scene background with orbs and grain
export const SceneBackground: React.FC<{
  variant?: "dark" | "warm" | "pink" | "radial";
  orbs?: Array<{ color: string; size: number; x: number; y: number }>;
  grain?: boolean;
  children?: React.ReactNode;
}> = ({ variant = "dark", orbs = [], grain = true, children }) => {
  const BG = {
    dark: SolidDark,
    warm: GradientWarm,
    pink: GradientDarkPink,
    radial: GradientRadial,
  }[variant];

  return (
    <BG>
      {orbs.map((orb, i) => (
        <GlowOrb key={i} {...orb} />
      ))}
      {grain && <GrainOverlay />}
      {children}
    </BG>
  );
};
