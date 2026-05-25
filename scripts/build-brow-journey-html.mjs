#!/usr/bin/env node
/** Build Your Brow Journey handout — strip base64 images, fix booking + site URLs. */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source =
  process.argv[2] ||
  join(process.env.HOME || "", "Downloads", "files (27).zip");

const FRESHA_BOOKING =
  "https://www.fresha.com/a/hello-gorgeous-med-spa-oswego-74-west-washington-street-y6oakkwf/booking?menu=true&share=true&pId=95245&dppub=true";
const SITE = "https://www.hellogorgeousmedspa.com";
const ASSET_DIR = join(root, "public/handouts/education/brow-journey");
const outHtml = join(root, "public/handouts/education/your-brow-journey.html");
const outPdf = join(root, "public/handouts/education/your-brow-journey.pdf");
const tmpDir = join(root, ".tmp-brow-journey-build");

function resolveSourceHtml() {
  if (source.endsWith(".zip")) {
    mkdirSync(tmpDir, { recursive: true });
    execSync(`unzip -o "${source}" -d "${tmpDir}"`, { stdio: "pipe" });
    const html = join(tmpDir, "5-your-brow-journey.html");
    if (!existsSync(html)) throw new Error("Zip missing 5-your-brow-journey.html");
    return html;
  }
  if (existsSync(source)) return source;
  const fallback = join(root, "public/handouts/education/your-brow-journey.html");
  if (existsSync(fallback)) return fallback;
  throw new Error("Source not found: " + source);
}

const srcPath = resolveSourceHtml();
let html = readFileSync(srcPath, "utf8");
mkdirSync(ASSET_DIR, { recursive: true });

let imgIndex = 0;
html = html.replace(/src="(data:image\/[^;]+;base64,[^"]+)"/g, (_m, dataUrl) => {
  const mime = dataUrl.match(/data:image\/([^;]+)/)?.[1] || "jpeg";
  const ext = mime === "jpeg" ? "jpg" : mime;
  const names = ["founder-dani", "tina-davies-pigment-swatches"];
  const name = names[imgIndex] || `image-${imgIndex}`;
  imgIndex += 1;
  const buf = Buffer.from(dataUrl.split(",")[1], "base64");
  const rel = `/handouts/education/brow-journey/${name}.${ext}`;
  writeFileSync(join(ASSET_DIR, `${name}.${ext}`), buf);
  return `src="${rel}"`;
});

html = html.replace(
  /https:\/\/www\.fresha\.com\/book-now\/hello-gorgeous[^"']+/g,
  FRESHA_BOOKING,
);
html = html.replace(/https:\/\/hellogorgeousmedspa\.com/g, SITE);
html = html.replace(/href="sms:6308813398"/g, 'href="sms:6306366193"');
html = html.replace(/630-881-3398/g, "630-636-6193");

if (!html.includes("face-blueprint")) {
  html = html.replace(
    "</div>\n  </div>\n\n  <div class=\"divider\"></div>\n\n  <!-- AFTERCARE -->",
    `    <p style="margin-top:18px;position:relative;"><a class="btn" href="${SITE}/face-blueprint" style="font-size:14px;padding:12px 22px;">Try the Face Blueprint</a></p>
  </div>

  <div class="divider"></div>

  <!-- AFTERCARE -->`,
  );
}

writeFileSync(outHtml, html);
console.log("[build-brow-journey] →", outHtml, `(${html.length} chars, ${imgIndex} images)`);

const pdfCandidates = [
  join(dirname(srcPath), "5-Your-Brow-Journey.pdf"),
  join(tmpDir, "5-Your-Brow-Journey.pdf"),
];
for (const pdfSrc of pdfCandidates) {
  if (existsSync(pdfSrc)) {
    cpSync(pdfSrc, outPdf, { force: true });
    console.log("[build-brow-journey] →", outPdf);
    break;
  }
}
