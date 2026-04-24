import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  HG_OG_CONTENT_TYPE,
  HG_OG_SIZE,
  copyForVariant,
  type HgContourOgVariant,
} from "./hg-contour-og-constants";

export { HG_OG_SIZE, HG_OG_CONTENT_TYPE, altForVariant, type HgContourOgVariant } from "./hg-contour-og-constants";

const inter700Path = join(process.cwd(), "public", "fonts", "Inter-700-latin.ttf");

async function interFonts() {
  const data = await readFile(inter700Path);
  const name = "Inter";
  const w = [400, 500, 600, 700, 800] as const;
  return w.map((weight) => ({
    name,
    data,
    style: "normal" as const,
    weight,
  }));
}

const BRAND = "#E6007E";

function OgInner({ variant, font: fontName }: { variant: HgContourOgVariant; font: string }) {
  const c = copyForVariant(variant);
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

/** 1200×630 — uses Inter from `public/fonts` only (no network in prod). */
export async function hgContourSocialImageResponse(variant: HgContourOgVariant) {
  const font = "Inter";
  return new ImageResponse(<OgInner variant={variant} font={font} />, {
    width: HG_OG_SIZE.width,
    height: HG_OG_SIZE.height,
    fonts: await interFonts(),
  });
}
