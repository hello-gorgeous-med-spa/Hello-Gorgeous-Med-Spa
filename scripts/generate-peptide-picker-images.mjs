#!/usr/bin/env node
/**
 * Build card-friendly 16:9 picker images for education sheets that aren't hero banners.
 * Writes public/images/peptides/{slug}-picker.png + .webp
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public/images/peptides");

const PICKER_TITLES = {
  "cjc-1295": "CJC-1295",
  ipamorelin: "Ipamorelin",
  biotin: "Biotin",
  glutathione: "Glutathione",
  "pt-141": "PT-141",
};

/** Full-sheet thumbnails → vial-focused picker art for Start Here / gallery cards. */
const SHEET_PICKER_SPECS = {
  "cjc-1295": {
    extract: { left: 380, top: 0, width: 1220, height: 280 },
    layout: "vial-right",
  },
  ipamorelin: {
    extract: { left: 800, top: 0, width: 800, height: 900 },
    layout: "vial-right",
  },
  biotin: {
    extract: { left: 880, top: 0, width: 720, height: 580 },
    layout: "vial-right",
  },
  glutathione: {
    extract: { left: 760, top: 0, width: 840, height: 420 },
    layout: "vial-right",
  },
  "pt-141": {
    extract: { left: 680, top: 0, width: 920, height: 380 },
    layout: "vial-right",
  },
};

async function roseGradient(width, height) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF0F7"/>
          <stop offset="55%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#FFE8F3"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

function titleOverlay(title, width, height) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="72" y="280" font-family="Georgia, 'Times New Roman', serif" font-size="118" font-weight="700" fill="#1e4646">${title}</text>
      <line x1="72" y1="318" x2="520" y2="318" stroke="#E6007E" stroke-width="3"/>
      <text x="72" y="378" font-family="Georgia, 'Times New Roman', serif" font-size="42" fill="#E6007E">Patient Education Sheet</text>
    </svg>`;
  return Buffer.from(svg);
}

async function buildPicker(slug, spec) {
  const src = path.join(ROOT, `${slug}-thumbnail.png`);
  if (!fs.existsSync(src)) {
    console.warn(`  skip ${slug}: missing ${src}`);
    return false;
  }

  const W = 1600;
  const H = 900;
  const title = PICKER_TITLES[slug];
  const bg = await roseGradient(W, H);
  const crop = sharp(src).extract(spec.extract);

  const composites = [];

  if (spec.layout === "vial-right") {
    const overlay = await crop.resize(Math.round(W * 0.5), H, { fit: "cover", position: "right" }).toBuffer();
    composites.push({ input: overlay, left: W - Math.round(W * 0.5), top: 0 });
  } else {
    const overlay = await crop.resize(W, Math.round(H * 0.46), { fit: "fill" }).toBuffer();
    composites.push({ input: overlay, left: 0, top: 0 });
  }

  composites.push({ input: titleOverlay(title, W, H), left: 0, top: 0 });

  const out = path.join(ROOT, `${slug}-picker.png`);
  await sharp(bg).composite(composites).png().toFile(out);
  await sharp(out).webp({ quality: 82 }).toFile(path.join(ROOT, `${slug}-picker.webp`));

  console.log(`  ✓ ${slug}-picker`);
  return true;
}

async function main() {
  console.log("\n🧬 Peptide picker image crops\n");
  let ok = 0;
  for (const [slug, spec] of Object.entries(SHEET_PICKER_SPECS)) {
    if (await buildPicker(slug, spec)) ok += 1;
  }
  console.log(`\nDone: ${ok}/${Object.keys(SHEET_PICKER_SPECS).length}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
