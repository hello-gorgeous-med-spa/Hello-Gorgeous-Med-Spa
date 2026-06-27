/**
 * Generate 480×480 square JPEG thumbs for /rx/care card rows (cover crop).
 * Run: npx tsx scripts/generate-rx-care-square-thumbs.ts
 */

import fs from "fs";
import path from "path";

import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public/images");
const OUT = path.join(ROOT, "rx-care/square");
const SIZE = 480;

type CropJob = {
  out: string;
  src: string;
  /** sharp resize position — top keeps flyer headlines visible */
  position?: sharp.Position;
};

const JOBS: CropJob[] = [
  { out: "glp1-refill.jpg", src: "rx-care/tirzepatide.png", position: "top" },
  { out: "glp1-intake.jpg", src: "rx-care/tirzepatide.png", position: "top" },
  { out: "peptide.jpg", src: "rx-care/peptide-molecule-hero.png", position: "centre" },
  { out: "telehealth.jpg", src: "providers/ryan-kent-clinic.jpg", position: "top" },
  { out: "team.jpg", src: "team/dani-ryan-founders-portrait.png", position: "top" },
  {
    out: "glp1-hero.jpg",
    src: "homepage-services/compounded-tirzepatide-weight-loss.png",
    position: "centre",
  },
  { out: "nad-plus.jpg", src: "rx-care/nad-plus.png", position: "top" },
  { out: "sermorelin.jpg", src: "rx-care/sermorelin.png", position: "top" },
  { out: "bpc-157.jpg", src: "rx-care/bpc-157.png", position: "top" },
  { out: "nad-sermorelin-duo.jpg", src: "rx-care/nad-sermorelin-duo.png", position: "centre" },
  {
    out: "nad-sermorelin-bundle.jpg",
    src: "rx-care/nad-sermorelin-bundle-1.png",
    position: "top",
  },
  { out: "rx-overview.jpg", src: "rx-care/peptide-grid.png", position: "centre" },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const job of JOBS) {
    const input = path.join(ROOT, job.src);
    const output = path.join(OUT, job.out);

    if (!fs.existsSync(input)) {
      console.warn(`skip (missing): ${job.src}`);
      continue;
    }

    await sharp(input)
      .resize(SIZE, SIZE, {
        fit: "cover",
        position: job.position ?? "centre",
      })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(output);

    const stat = fs.statSync(output);
    console.log(`✓ ${job.out} (${Math.round(stat.size / 1024)} KB)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
