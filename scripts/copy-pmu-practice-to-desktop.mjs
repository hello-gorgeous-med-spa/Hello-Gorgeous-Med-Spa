#!/usr/bin/env node
/** Copy offline PMU Practice Studio HTML to Desktop for iPad study. */

import { copyFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HTML = join(ROOT, "public/handouts/education/pmu-practice-studio.html");
const OUT = join(process.env.HOME || "", "Desktop", "Hello-Gorgeous-PMU-Practice-Studio.html");

if (!existsSync(HTML)) {
  console.error("Missing:", HTML);
  process.exit(1);
}

copyFileSync(HTML, OUT);
console.log("Copied →", OUT);
console.log("Open on iPad in Safari, or Add to Home Screen for full-screen practice.");
