#!/usr/bin/env node
/**
 * Inject FlowWave intro video overlay into public/flowwave-site/index.html
 * (survives re-exports when run from update-flowwave-site.sh)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.resolve(__dirname, "../public/flowwave-site/index.html");
const VIDEO = "/videos/flowwave/flowwave-intro.mp4";

const INTRO_CSS = `
    /* FlowWave intro video (first visit per session) */
    .fw-intro {
      position:fixed; inset:0; z-index:90; background:#000;
      display:flex; align-items:center; justify-content:center;
    }
    .fw-intro video {
      width:100%; height:100%; object-fit:contain; background:#000;
    }
    .fw-intro-skip {
      position:absolute; top:max(16px, env(safe-area-inset-top, 0px)); right:max(16px, env(safe-area-inset-right, 0px));
      background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.35); color:#fff;
      font-family:var(--font-body); font-size:13px; font-weight:600; padding:10px 18px; border-radius:999px;
      cursor:pointer; backdrop-filter:blur(8px); transition:background .2s, border-color .2s;
    }
    .fw-intro-skip:hover { background:rgba(255,45,142,0.35); border-color:var(--hg-pink); }
`;

const INTRO_HTML = `
  <!-- INTRO VIDEO -->
  <sc-if value="{{ showIntro }}">
    <div class="fw-intro" onClick="{{ stopProp }}">
      <video autoplay muted playsinline onEnded="{{ closeIntro }}" src="${VIDEO}"></video>
      <button type="button" class="fw-intro-skip" onClick="{{ closeIntro }}">Skip intro</button>
    </div>
  </sc-if>
`;

const OLD_STATE = "state = { submitted: false };";
const NEW_STATE = "state = { submitted: false, introOpen: true };";

const OLD_RENDER_START = `  renderVals() {
    return {
      submitted: this.state.submitted,
      notSubmitted: !this.state.submitted,
      onSubmit: (e) => { e.preventDefault(); this.setState({ submitted: true }); }
    };
  }`;

const NEW_RENDER = `  renderVals() {
    const introSeen = typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.getItem('flowwave-intro-seen') === '1';
    return {
      submitted: this.state.submitted,
      notSubmitted: !this.state.submitted,
      showIntro: this.state.introOpen && !introSeen,
      stopProp: (e) => e.stopPropagation(),
      closeIntro: () => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('flowwave-intro-seen', '1');
        }
        this.setState({ introOpen: false });
      },
      onSubmit: (e) => { e.preventDefault(); this.setState({ submitted: true }); }
    };
  }`;

function main() {
  if (!fs.existsSync(INDEX)) {
    console.error("❌ Missing", INDEX);
    process.exit(1);
  }

  let html = fs.readFileSync(INDEX, "utf8");

  if (!html.includes(".fw-intro {")) {
    html = html.replace(
      "  </style>\n</helmet>",
      `${INTRO_CSS}  </style>\n</helmet>`,
    );
  }

  if (!html.includes("<!-- INTRO VIDEO -->")) {
    html = html.replace(
      "\n  <!-- FOOTER -->",
      `${INTRO_HTML}\n  <!-- FOOTER -->`,
    );
  }

  if (html.includes(OLD_STATE)) {
    html = html.replace(OLD_STATE, NEW_STATE);
  } else if (!html.includes("introOpen: true")) {
    html = html.replace(
      /state = \{ submitted: false[^}]*\};/,
      NEW_STATE,
    );
  }

  if (html.includes(OLD_RENDER_START)) {
    html = html.replace(OLD_RENDER_START, NEW_RENDER);
  } else if (!html.includes("showIntro:")) {
    console.warn("⚠️  Could not patch renderVals — manual check needed");
  }

  fs.writeFileSync(INDEX, html, "utf8");
  console.log("✅ FlowWave intro video overlay patched");
}

main();
