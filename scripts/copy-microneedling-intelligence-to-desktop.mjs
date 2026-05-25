#!/usr/bin/env node
/** Copy microneedling intelligence assets to Desktop. */

import { copyFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DESKTOP = join(process.env.HOME || "", "Desktop");

const files = [
  {
    src: join(ROOT, "public/handouts/education/microneedling-selection-cheatsheet.html"),
    dest: join(DESKTOP, "Hello-Gorgeous-Microneedling-Selection-CheatSheet.html"),
  },
];

for (const { src, dest } of files) {
  if (!existsSync(src)) {
    console.error("Missing:", src);
    process.exit(1);
  }
  copyFileSync(src, dest);
  console.log("Copied →", dest);
}

console.log("\nInteractive tool (when dev server running): http://localhost:3000/education/microneedling-intelligence");
