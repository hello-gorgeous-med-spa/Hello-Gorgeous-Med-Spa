// ============================================================
// HELLO GORGEOUS — BRAND DESIGN SYSTEM (HG-VID-002)
// Visual DNA for all Remotion video compositions
// ============================================================

// --- COLOR PALETTE ---
export const COLORS = {
  gold: "#C9A84C",
  goldLight: "#E2D5A0",
  goldDark: "#A08630",
  dark: "#1A1A1A",
  darkDeep: "#0D0D0D",
  cream: "#F8F6F1",
  warmWhite: "#FDFBF7",
  accentTeal: "#1D9E75",
  softCoral: "#D85A30",
  hotPink: "#E91E8C",
  pink: "#FF69B4",
  white: "#FFFFFF",
  black: "#000000",

  // Functional
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.45)",
  overlayDark: "rgba(0,0,0,0.75)",
  overlayLight: "rgba(255,255,255,0.08)",
} as const;

// --- GRADIENTS ---
export const GRADIENTS = {
  goldShimmer: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})`,
  pinkHot: `linear-gradient(90deg, ${COLORS.hotPink}, ${COLORS.pink})`,
  pinkGold: `linear-gradient(90deg, ${COLORS.hotPink}, ${COLORS.pink}, ${COLORS.gold})`,
  darkRadial: `radial-gradient(ellipse at center, #1a0a14 0%, ${COLORS.black} 70%)`,
  darkVertical: `linear-gradient(180deg, ${COLORS.black} 0%, #1a0a14 50%, ${COLORS.black} 100%)`,
  warmDark: `linear-gradient(180deg, ${COLORS.dark} 0%, #2a1a10 50%, ${COLORS.dark} 100%)`,
  goldBorder: `linear-gradient(90deg, ${COLORS.gold}20, ${COLORS.gold}60, ${COLORS.gold}20)`,
} as const;

// --- TYPOGRAPHY ---
export const FONTS = {
  display: "Playfair Display, Georgia, serif",
  heading: "system-ui, -apple-system, Helvetica Neue, sans-serif",
  body: "system-ui, -apple-system, Helvetica Neue, sans-serif",
  mono: "SF Mono, Menlo, monospace",
} as const;

export const FONT_SIZES = {
  // Vertical (9:16) base sizes — scale down for square/horizontal
  heroTitle: 72,
  sectionTitle: 56,
  heading: 44,
  subheading: 32,
  body: 24,
  caption: 18,
  small: 14,
  badge: 20,
} as const;

export function scaledSize(base: number, format: "vertical" | "square" | "horizontal"): number {
  const multiplier = format === "horizontal" ? 0.75 : format === "square" ? 0.88 : 1;
  return Math.round(base * multiplier);
}

// --- SPACING ---
export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 60,
  xxl: 80,
  pagePadding: 50,
} as const;

// --- MOTION PRESETS (frame-based, 30fps) ---
export const MOTION = {
  fadeIn: { duration: 12, delay: 0 },
  slideUp: { from: 40, to: 0, damping: 12 },
  slideDown: { from: -40, to: 0, damping: 12 },
  slideLeft: { from: 60, to: 0, damping: 14 },
  scaleReveal: { from: 0.5, to: 1, damping: 10, stiffness: 80 },
  scalePop: { from: 0, to: 1, damping: 8, stiffness: 100 },
  gentlePulse: { speed: 0.12, amplitude: 0.06 },
  goldShimmer: { speed: 0.08, amplitude: 0.15 },
  breathe: { speed: 0.05, amplitude: 0.3 },
} as const;

// --- SHADOW PRESETS ---
export const SHADOWS = {
  glow: (color: string, size = 30) => `0 0 ${size}px ${color}`,
  glowStrong: (color: string) => `0 0 20px ${color}, 0 0 60px ${color}`,
  textGlow: (color: string) => `0 0 40px ${color}`,
  cardSoft: "0 8px 32px rgba(0,0,0,0.4)",
  cardElevated: "0 16px 48px rgba(0,0,0,0.6)",
  buttonGlow: (color: string) => `0 10px 50px ${color}90, 0 0 80px ${color}40`,
} as const;

// --- BORDER PRESETS ---
export const BORDERS = {
  goldThin: `1px solid ${COLORS.gold}60`,
  goldMedium: `2px solid ${COLORS.gold}80`,
  pinkThin: `1px solid ${COLORS.hotPink}60`,
  pinkMedium: `2px solid ${COLORS.hotPink}80`,
  subtle: `1px solid rgba(255,255,255,0.1)`,
  card: `1px solid rgba(255,255,255,0.15)`,
} as const;

// --- LAYOUT HELPERS ---
export type VideoFormat = "vertical" | "square" | "horizontal";

export function formatDimensions(format: VideoFormat) {
  switch (format) {
    case "vertical": return { width: 1080, height: 1920 };
    case "square": return { width: 1080, height: 1080 };
    case "horizontal": return { width: 1920, height: 1080 };
  }
}
