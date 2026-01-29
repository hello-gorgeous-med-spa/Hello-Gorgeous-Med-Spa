import fs from "node:fs";
import path from "node:path";

// Source of truth (LOCKED by ticket):
const SOURCE = "/danid/public/videos/mascots";

// Public path served by Next.js:
const DEST = path.join(process.cwd(), "public", "videos", "mascots");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else if (entry.isFile()) {
      // Copy only mp4 (web-optimized expected).
      if (!entry.name.toLowerCase().endsWith(".mp4")) continue;
      fs.copyFileSync(from, to);
    }
  }
}

// Non-failing: CI/Vercel may not have /danid mounted.
if (!fs.existsSync(SOURCE)) {
  ensureDir(DEST);
  process.exit(0);
}

copyDir(SOURCE, DEST);

