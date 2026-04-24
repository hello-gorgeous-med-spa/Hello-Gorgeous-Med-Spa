import { ImageResponse } from "next/og";

export const HG_OG_SIZE = { width: 1200, height: 630 } as const;
export const HG_OG_CONTENT_TYPE = "image/png";

const BRAND = "#E6007E";

const interTtf: Record<400 | 500 | 600 | 700 | 800, string> = {
  400: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
  500: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf",
  600: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf",
  700: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf",
  800: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZg.ttf",
};

async function interFonts() {
  const [w4, w5, w6, w7, w8] = await Promise.all([
    fetch(interTtf[400]).then((r) => r.arrayBuffer()),
    fetch(interTtf[500]).then((r) => r.arrayBuffer()),
    fetch(interTtf[600]).then((r) => r.arrayBuffer()),
    fetch(interTtf[700]).then((r) => r.arrayBuffer()),
    fetch(interTtf[800]).then((r) => r.arrayBuffer()),
  ]);
  const name = "Inter";
  return [
    { name, data: w4, style: "normal" as const, weight: 400 as const },
    { name, data: w5, style: "normal" as const, weight: 500 as const },
    { name, data: w6, style: "normal" as const, weight: 600 as const },
    { name, data: w7, style: "normal" as const, weight: 700 as const },
    { name, data: w8, style: "normal" as const, weight: 800 as const },
  ];
}

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

function OgInner({ variant, font: fontName }: { variant: HgContourOgVariant; font: string }) {
  const c = copy[variant];
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0a0a0a",
        backgroundImage: "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 50%, #111 100%)",
        padding: 56,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            width: 100,
            height: 4,
            backgroundColor: BRAND,
            borderRadius: 2,
            marginBottom: 28,
            boxShadow: `0 0 24px ${BRAND}99`,
          }}
        />
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            color: "rgb(255, 255, 255)",
            marginBottom: 12,
            fontFamily: fontName,
            opacity: 0.75,
          }}
        >
          {c.kicker}
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#ffffff",
            maxWidth: 1050,
            fontFamily: fontName,
          }}
        >
          {c.headline}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.3,
            color: BRAND,
            marginTop: 24,
            maxWidth: 1000,
            fontFamily: fontName,
          }}
        >
          {c.highlight}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.4,
            color: "rgb(245, 245, 245)",
            marginTop: 28,
            maxWidth: 1000,
            fontFamily: fontName,
            opacity: 0.95,
          }}
        >
          {c.sub}
        </div>
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: "rgb(200, 200, 200)",
          fontFamily: fontName,
          opacity: 0.8,
        }}
      >
        {c.foot}
      </div>
    </div>
  );
}

/**
 * 1200×630 social share image: high-contrast (white on dark) so link previews are readable, not “black on black.”
 */
export async function hgContourSocialImageResponse(variant: HgContourOgVariant) {
  const font = "Inter";

  return new ImageResponse(<OgInner variant={variant} font={font} />, {
    width: HG_OG_SIZE.width,
    height: HG_OG_SIZE.height,
    fonts: await interFonts(),
  });
}

export function altForVariant(variant: HgContourOgVariant): string {
  return copy[variant].alt;
}
