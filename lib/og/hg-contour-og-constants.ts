export const HG_OG_SIZE = { width: 1200, height: 630 } as const;
export const HG_OG_CONTENT_TYPE = "image/png";

export type HgContourOgVariant = "quantumService" | "contourModel";

const copy: Record<
  HgContourOgVariant,
  { kicker: string; headline: string; highlight: string; sub: string; foot: string; alt: string }
> = {
  quantumService: {
    kicker: "Hello Gorgeous",
    headline: "Contour Lift™",
    highlight: "Powered by InMode Quantum RF",
    sub: "Minimally invasive · loose skin & contouring · Oswego, IL",
    foot: "hellogorgeousmedspa.com/services/quantum-rf",
    alt: "Hello Gorgeous Contour Lift powered by InMode Quantum RF, Oswego IL med spa",
  },
  contourModel: {
    kicker: "Hello Gorgeous",
    headline: "Contour Lift™ clinical model",
    highlight: "May 4 · 3 spots · Quantum RF",
    sub: "Reduced model investment · message MODEL to apply · Oswego, IL",
    foot: "hellogorgeousmedspa.com/contour-lift/model-experience",
    alt: "Hello Gorgeous Contour Lift clinical model experience May 4 Quantum RF Oswego",
  },
};

export function copyForVariant(
  variant: HgContourOgVariant
): (typeof copy)[HgContourOgVariant] {
  return copy[variant];
}

export function altForVariant(variant: HgContourOgVariant): string {
  return copy[variant].alt;
}
