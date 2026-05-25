#!/usr/bin/env node
/** Copy runtime assets to public/ for bundled (non-CDN) loading. */
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mediapipeSrc = join(root, "node_modules/@mediapipe/face_mesh");
const mediapipeDest = join(root, "public/mediapipe/face_mesh");
const jspdfSrc = join(root, "node_modules/jspdf/dist/jspdf.umd.min.js");
const jspdfDest = join(root, "public/vendor/jspdf.umd.min.js");

if (existsSync(mediapipeSrc)) {
  mkdirSync(mediapipeDest, { recursive: true });
  for (const file of readdirSync(mediapipeSrc)) {
    if (file.endsWith(".js") || file.endsWith(".wasm") || file.endsWith(".data") || file.endsWith(".binarypb")) {
      cpSync(join(mediapipeSrc, file), join(mediapipeDest, file), { force: true });
    }
  }
  console.log("[sync-public-assets] mediapipe → public/mediapipe/face_mesh");
} else {
  console.warn("[sync-public-assets] @mediapipe/face_mesh not installed — skipping");
}

if (existsSync(jspdfSrc)) {
  mkdirSync(join(root, "public/vendor"), { recursive: true });
  cpSync(jspdfSrc, jspdfDest, { force: true });
  console.log("[sync-public-assets] jspdf → public/vendor/jspdf.umd.min.js");
}
