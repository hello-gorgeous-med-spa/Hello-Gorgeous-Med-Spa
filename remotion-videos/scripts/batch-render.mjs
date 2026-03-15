#!/usr/bin/env node
/**
 * Hello Gorgeous — Batch Video Render CLI
 *
 * Usage:
 *   npm run batch                         # Render all videos in batch.json
 *   npm run batch -- --config=custom.json # Use a custom config
 *   npm run render:single -- TrifectaRevealVertical  # Render one composition
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Parse args
const args = process.argv.slice(2);
const configArg = args.find((a) => a.startsWith("--config="));
const configFile = configArg
  ? configArg.split("=")[1]
  : path.join(projectRoot, "batch.json");

// Date-stamped output folder
const dateStr = new Date().toISOString().slice(0, 10);
const outputDir = path.join(projectRoot, "renders", dateStr);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("\n╔══════════════════════════════════════════════╗");
console.log("║   HELLO GORGEOUS — BATCH VIDEO RENDER       ║");
console.log("╚══════════════════════════════════════════════╝\n");

// Load config
let config;
try {
  const raw = fs.readFileSync(configFile, "utf-8");
  config = JSON.parse(raw);
} catch (err) {
  console.error(`Failed to load config: ${configFile}`);
  console.error(err.message);
  process.exit(1);
}

const renders = config.renders || [];
console.log(`📋 ${renders.length} videos to render`);
console.log(`📂 Output: ${outputDir}\n`);

let completed = 0;
let failed = 0;
const startTime = Date.now();

for (const [index, render] of renders.entries()) {
  const { template, outputFilename } = render;
  const outPath = path.join(outputDir, `${outputFilename}-${dateStr}.mp4`);
  const num = `[${index + 1}/${renders.length}]`;

  console.log(`${num} 🎬 Rendering: ${template}`);
  console.log(`     → ${outPath}`);

  try {
    const renderStart = Date.now();
    execSync(
      `npx remotion render src/index.tsx ${template} "${outPath}" --crf=18`,
      {
        cwd: projectRoot,
        stdio: "pipe",
        timeout: 300000, // 5 min timeout
      }
    );
    const elapsed = ((Date.now() - renderStart) / 1000).toFixed(1);
    const fileSize = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
    console.log(`     ✓ Done in ${elapsed}s (${fileSize} MB)\n`);
    completed++;
  } catch (err) {
    console.error(`     ✕ FAILED: ${err.message}\n`);
    failed++;
  }
}

const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(0);
console.log("═══════════════════════════════════════════════");
console.log(`✅ Completed: ${completed}/${renders.length}`);
if (failed > 0) console.log(`❌ Failed: ${failed}`);
console.log(`⏱  Total time: ${totalElapsed}s`);
console.log(`📂 Files saved to: ${outputDir}`);
console.log("═══════════════════════════════════════════════\n");
