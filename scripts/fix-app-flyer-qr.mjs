#!/usr/bin/env node
/**
 * Generate a clean Hello Gorgeous app scan flyer (no AI QR artifacts).
 * Run: node scripts/fix-app-flyer-qr.mjs
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const W = 731;
const H = 1024;
const QR_URL = "https://www.hellogorgeousmedspa.com/app";

const HERO = path.join(
  process.env.HOME ?? "",
  ".cursor/projects/Users-danid-Hello-Gorgeous-Med-Spa-hello-gorgeous-med-spa/assets/ChatGPT_Image_Jun_12__2026__09_41_02_AM-aec117b6-3c6e-4f1a-b758-92a5ea272b09.png"
);

const OUT_DIR = path.join(ROOT, "public/images/marketing");
const OUT_FLYER = path.join(OUT_DIR, "hello-gorgeous-app-scan-flyer.jpg");
const OUT_QR = path.join(OUT_DIR, "hello-gorgeous-app-qr-print.png");

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const HERO_H = 448;
  const MID_H = 778 - HERO_H;

  const hero = await sharp(HERO).extract({ left: 0, top: 0, width: W, height: HERO_H }).toBuffer();

  const footer = await sharp(HERO)
    .extract({ left: 0, top: 778, width: W, height: H - 778 })
    .toBuffer();

  const qrSize = 210;
  const qrPng = await QRCode.toBuffer(QR_URL, {
    type: "png",
    width: qrSize,
    margin: 0,
    errorCorrectionLevel: "Q",
    color: { dark: "#000000", light: "#FFFFFF" },
  });
  await sharp(qrPng).png().toFile(OUT_QR);

  const qrTileLeft = Math.round((W - qrSize - 24) / 2) + 4;
  const qrTileTop = 72;

  const midPanel = Buffer.from(`<svg width="${W}" height="${MID_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#000000"/>
  <text x="36" y="52" fill="#FF2D8E" font-family="Helvetica,Arial,sans-serif" font-size="11" font-weight="700">BOOK</text>
  <text x="36" y="68" fill="#ffffff" font-family="Helvetica,Arial,sans-serif" font-size="10" opacity="0.9">Botox, facials, Morpheus8 &amp; more</text>
  <text x="36" y="108" fill="#FF2D8E" font-family="Helvetica,Arial,sans-serif" font-size="11" font-weight="700">SHOP</text>
  <text x="36" y="124" fill="#ffffff" font-family="Helvetica,Arial,sans-serif" font-size="10" opacity="0.9">Build Your IV Bag from $89</text>
  <text x="36" y="164" fill="#FF2D8E" font-family="Helvetica,Arial,sans-serif" font-size="11" font-weight="700">ENJOY</text>
  <text x="36" y="180" fill="#ffffff" font-family="Helvetica,Arial,sans-serif" font-size="10" opacity="0.9">Vitamin Bar · deals · gift cards</text>
  <text x="36" y="220" fill="#FF2D8E" font-family="Helvetica,Arial,sans-serif" font-size="11" font-weight="700">EASY ACCESS</text>
  <text x="36" y="236" fill="#ffffff" font-family="Helvetica,Arial,sans-serif" font-size="10" opacity="0.9">Add to home screen — no App Store</text>
  <rect x="${qrTileLeft}" y="${qrTileTop}" width="${qrSize + 24}" height="${qrSize + 24}" rx="10" fill="#ffffff"/>
  <text x="${qrTileLeft + qrSize + 36}" y="${qrTileTop + 100}" fill="#FF2D8E" font-family="Georgia,serif" font-size="22" font-style="italic">Scan me!</text>
</svg>`);

  const canvas = sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
  });

  await canvas
    .composite([
      { input: hero, top: 0, left: 0 },
      { input: midPanel, top: HERO_H, left: 0 },
      { input: qrPng, top: HERO_H + qrTileTop + 12, left: qrTileLeft + 12 },
      { input: footer, top: 778, left: 0 },
    ])
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(OUT_FLYER);

  console.log("✓ Clean flyer:", OUT_FLYER);
  console.log("✓ QR:", QR_URL);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
