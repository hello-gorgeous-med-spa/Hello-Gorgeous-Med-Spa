#!/usr/bin/env node
/**
 * Replace AI-generated (non-scannable) QR on the spa app flyer with ONE real QR.
 * Step 1: paint over the entire fake QR + pink glow with solid black.
 * Step 2: white plate + single scannable QR centered in that zone.
 *
 * Run: node scripts/fix-app-flyer-qr.mjs
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const QR_URL =
  "https://www.hellogorgeousmedspa.com/app?utm_source=qr&utm_medium=spa_flyer&utm_campaign=app_install";

const SOURCE = path.join(
  process.env.HOME ?? "",
  ".cursor/projects/Users-danid-Hello-Gorgeous-Med-Spa-hello-gorgeous-med-spa/assets/ChatGPT_Image_Jun_12__2026__09_41_02_AM-aec117b6-3c6e-4f1a-b758-92a5ea272b09.png"
);

const OUT_DIR = path.join(ROOT, "public/images/marketing");
const OUT_FLYER = path.join(OUT_DIR, "hello-gorgeous-app-scan-flyer.jpg");
const OUT_QR = path.join(OUT_DIR, "hello-gorgeous-app-qr-print.png");

/** One white panel fully covers fake QR + pink glow — no double image, no black ring. */
const PLATE = { left: 196, top: 452, size: 340, pad: 22, radius: 16 };

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const qrPixelSize = PLATE.size - PLATE.pad * 2;
  const qrPng = await QRCode.toBuffer(QR_URL, {
    type: "png",
    width: qrPixelSize,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  await sharp(qrPng).png().toFile(OUT_QR);

  const whitePlate = Buffer.from(
    `<svg width="${PLATE.size}" height="${PLATE.size}">
      <rect width="100%" height="100%" rx="${PLATE.radius}" ry="${PLATE.radius}" fill="#ffffff"/>
    </svg>`
  );

  await sharp(SOURCE)
    .composite([
      { input: whitePlate, left: PLATE.left, top: PLATE.top },
      {
        input: qrPng,
        left: PLATE.left + PLATE.pad,
        top: PLATE.top + PLATE.pad,
      },
    ])
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(OUT_FLYER);

  console.log("✓ Single QR encodes:", QR_URL);
  console.log("✓ Flyer saved:", OUT_FLYER);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
