#!/usr/bin/env node
/** Copy offline Brow Mapping Intelligence HTML to Desktop for iPad. */

import { copyFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HTML = join(ROOT, "public/handouts/education/brow-mapping-intelligence.html");
const OUT = join(process.env.HOME || "", "Desktop", "Hello-Gorgeous-Brow-Mapping-Intelligence.html");

if (!existsSync(HTML)) {
  console.error("Missing:", HTML);
  process.exit(1);
}

copyFileSync(HTML, OUT);
console.log("Copied →", OUT);
console.log("iPad: AirDrop to Files → Open in Safari → Share → Add to Home Screen");
console.log("Mac dev: http://localhost:3000/admin/tools/brow-mapping (staff login required)");
