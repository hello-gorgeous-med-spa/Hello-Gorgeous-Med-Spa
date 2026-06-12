#!/usr/bin/env node
/**
 * Replace AI-generated (non-scannable) QR on the spa app flyer with a real QR code.
 *
 * Run: node scripts/fix-app-flyer-qr.mjs
 * Output: public/images/marketing/hello-gorgeous-app-scan-flyer.jpg (+ .png QR-only)
 */

import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/** Must match lib/app-install-url.ts + lib/seo.ts (www + /app + UTMs for print tracking). */
const QR_URL =
  "https://www.hellogorgeousmedspa.com/app?utm_source=qr&utm_medium=spa_flyer&utm_campaign=app_install";

const SOURCE = path.join(
  process.env.HOME ?? "",
  ".cursor/projects/Users-danid-Hello-Gorgeous-Med-Spa-hello-gorgeous-med-spa/assets/ChatGPT_Image_Jun_12__2026__09_41_02_AM-aec117b6-3c6e-4f1a-b758-92a5ea272b09.png"
);

const OUT_DIR = path.join(ROOT, "public/images/marketing");
const OUT_FLYER = path.join(OUT_DIR, "hello-gorgeous-app-scan-flyer.jpg");
const OUT_QR = path.join(OUT_DIR, "hello-gorgeous-app-qr-print.png");

/** Placement on 731×1024 source JPEG — centered on original QR panel, clear of left copy. */
const QR_BOX = { left: 262, top: 488, size: 248, pad: 10 };

async function resolveSource() {
  await sharp(SOURCE).metadata();
  return SOURCE;
}

async function main() {
  const source = await resolveSource();
  await mkdir(OUT_DIR, { recursive: true });

  const qrSize = QR_BOX.size - QR_BOX.pad * 2;
  const qrPng = await QRCode.toBuffer(QR_URL, {
    type: "png",
    width: qrSize,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  await sharp(qrPng).png().toFile(OUT_QR);

  const whitePlate = Buffer.from(
    `<svg width="${QR_BOX.size}" height="${QR_BOX.size}">
      <rect width="100%" height="100%" rx="12" ry="12" fill="#ffffff"/>
    </svg>`
  );

  const plateLeft = QR_BOX.left;
  const plateTop = QR_BOX.top;

  await sharp(source)
    .composite([
      { input: whitePlate, left: plateLeft, top: plateTop },
      { input: qrPng, left: plateLeft + QR_BOX.pad, top: plateTop + QR_BOX.pad },
    ])
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(OUT_FLYER);

  console.log("✓ Real QR encodes:", QR_URL);
  console.log("✓ Flyer saved:", OUT_FLYER);
  console.log("✓ Standalone QR PNG:", OUT_QR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
