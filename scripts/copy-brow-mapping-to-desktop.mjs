#!/usr/bin/env node
/** Copy offline Brow Mapping Intelligence HTML to Desktop for iPad. */

import { copyFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HTML = join(ROOT, "public/handouts/education/brow-mapping-intelligence.html");
const REF = join(ROOT, "public/handouts/education/brow-shapes-7-reference.png");
const PACKET = join(ROOT, "public/handouts/education/brow-consultation-packet.pdf");
const OUT = join(process.env.HOME || "", "Desktop", "Hello-Gorgeous-Brow-Mapping-Intelligence.html");
const OUT_REF = join(process.env.HOME || "", "Desktop", "brow-shapes-7-reference.png");
const OUT_PACKET = join(process.env.HOME || "", "Desktop", "Hello-Gorgeous-Brow-Consultation-Packet.pdf");

if (!existsSync(HTML)) {
  console.error("Missing:", HTML);
  process.exit(1);
}

copyFileSync(HTML, OUT);
console.log("Copied →", OUT);
if (existsSync(REF)) {
  copyFileSync(REF, OUT_REF);
  console.log("Copied →", OUT_REF);
} else {
  console.warn("Missing reference chart:", REF);
}
if (existsSync(PACKET)) {
  copyFileSync(PACKET, OUT_PACKET);
  console.log("Copied →", OUT_PACKET);
}
console.log("iPad: AirDrop to Files → Open in Safari → Share → Add to Home Screen");
console.log("Mac dev: http://localhost:3000/admin/tools/brow-mapping (staff login required)");
