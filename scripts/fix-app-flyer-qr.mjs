#!/usr/bin/env node
/**
 * Replace AI fake QR with ONE scannable code in the original slot.
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

/**
 * Single slot on 731×1024 source — covers fake QR + pink glow, clears left copy.
 * Black + white use identical bounds so there is no ghost/double frame.
 */
const SLOT = { left: 244, top: 480, size: 276, radius: 10, pad: 11 };

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const qrSize = SLOT.size - SLOT.pad * 2;
  const qrPng = await QRCode.toBuffer(QR_URL, {
    type: "png",
    width: qrSize,
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  await sharp(qrPng).png().toFile(OUT_QR);

  const blackFill = Buffer.from(
    `<svg width="${SLOT.size}" height="${SLOT.size}">
      <rect width="100%" height="100%" rx="${SLOT.radius}" ry="${SLOT.radius}" fill="#000000"/>
    </svg>`
  );

  const whiteTile = Buffer.from(
    `<svg width="${SLOT.size}" height="${SLOT.size}">
      <rect width="100%" height="100%" rx="${SLOT.radius}" ry="${SLOT.radius}" fill="#ffffff"/>
    </svg>`
  );

  await sharp(SOURCE)
    .composite([
      { input: blackFill, left: SLOT.left, top: SLOT.top },
      { input: whiteTile, left: SLOT.left, top: SLOT.top },
      {
        input: qrPng,
        left: SLOT.left + SLOT.pad,
        top: SLOT.top + SLOT.pad,
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
