/** Shared Trifecta palette — homepage showcase, nav, client app. */

export type TrifectaAccent = {
  border: string;
  subtitle: string;
  bullet: string;
  badgeBg: string;
  buttonFrom: string;
  buttonTo: string;
};

export const TRIFECTA_ACCENTS: TrifectaAccent[] = [
  {
    border: "rgba(236, 72, 153, 0.35)",
    subtitle: "#f472b6",
    bullet: "#ec4899",
    badgeBg: "#ec4899",
    buttonFrom: "#ec4899",
    buttonTo: "#db2777",
  },
  {
    border: "rgba(59, 130, 246, 0.35)",
    subtitle: "#60a5fa",
    bullet: "#3b82f6",
    badgeBg: "#3b82f6",
    buttonFrom: "#3b82f6",
    buttonTo: "#6366f1",
  },
  {
    border: "rgba(245, 158, 11, 0.35)",
    subtitle: "#fbbf24",
    bullet: "#f59e0b",
    badgeBg: "linear-gradient(to right, #f59e0b, #f97316)",
    buttonFrom: "#f59e0b",
    buttonTo: "#f97316",
  },
];

export const TRIFECTA_GRADIENT_TITLE =
  "linear-gradient(to right, #ec4899, #60a5fa, #f59e0b)";

export const TRIFECTA_GLASS = {
  bg: "rgba(24, 24, 27, 0.85)",
  bgSoft: "rgba(24, 24, 27, 0.6)",
  panel: "#18181b",
} as const;

export function trifectaAccent(index: number): TrifectaAccent {
  return TRIFECTA_ACCENTS[index % TRIFECTA_ACCENTS.length];
}

export function trifectaButtonGradient(accent: TrifectaAccent): string {
  return `linear-gradient(to right, ${accent.buttonFrom}, ${accent.buttonTo})`;
}
