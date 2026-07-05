#!/usr/bin/env node
/**
 * Wire FlowWave landing intake → /api/flowwave/intake + hg-intake.js
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.resolve(__dirname, "../public/flowwave-site/index.html");

const OLD_SUBMIT =
  "onSubmit: (e) => { e.preventDefault(); this.setState({ submitted: true }); }";

const NEW_SUBMIT = `onSubmit: async (e) => {
        e.preventDefault();
        if (this._fwBusy) return;
        this._fwBusy = true;
        try {
          const form = e.target;
          const payload = window.HG_flowwaveCollect(form);
          const res = await fetch("/api/flowwave/intake", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error || "Request failed");
          this.setState({ submitted: true });
        } catch (err) {
          alert("We could not submit right now. Please call (630) 636-6193.");
        } finally {
          this._fwBusy = false;
        }
      }`;

function main() {
  if (!fs.existsSync(INDEX)) {
    console.error("❌ Missing", INDEX);
    process.exit(1);
  }

  let html = fs.readFileSync(INDEX, "utf8");

  if (!html.includes("hg-intake.js")) {
    html = html.replace(
      "</body></html>",
      '<script src="/flowwave-site/hg-intake.js"></script>\n</body></html>',
    );
  }

  if (html.includes(OLD_SUBMIT)) {
    html = html.replace(OLD_SUBMIT, NEW_SUBMIT);
  } else if (!html.includes("_fwBusy")) {
    console.warn("⚠️  Could not patch onSubmit — check DC script manually");
  }

  if (!html.includes("window.HG_flowwaveCollect")) {
    console.warn("⚠️  hg-intake.js should define HG_flowwaveCollect");
  }

  fs.writeFileSync(INDEX, html, "utf8");
  console.log("✅ FlowWave intake wired to /api/flowwave/intake");
}

main();
