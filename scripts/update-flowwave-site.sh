#!/usr/bin/env bash
#
# update-flowwave-site.sh — install a fresh FlowWave bundled export into the live site.
#
# The FlowWave page at /services/flowwave is a design export served from
# public/flowwave-site/ (same pattern as RE GEN at /rx).
#
# Usage:
#   npm run update-flowwave -- "/path/to/FlowWave Shockwave Therapy.html"
#
# After it runs: review locally (npm run dev → /services/flowwave), then commit & push.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ARCHIVE="$APP_DIR/data/source/flowwave-shockwave-therapy.html"

SRC="${1:-}"

if [[ -z "$SRC" ]]; then
  echo "❌ Missing source HTML file."
  echo "   Usage: npm run update-flowwave -- \"/path/to/FlowWave Shockwave Therapy.html\""
  exit 1
fi
if [[ ! -f "$SRC" ]]; then
  echo "❌ Source file not found: $SRC"
  exit 1
fi

echo "📦 Archiving source → data/source/flowwave-shockwave-therapy.html"
mkdir -p "$(dirname "$ARCHIVE")"
cp "$SRC" "$ARCHIVE"

node "$SCRIPT_DIR/unpack-flowwave-bundle.mjs" "$ARCHIVE"

# --- CSP-safe vendor copies (React/ReactDOM/Babel — no unpkg) ----------------
DEST="$APP_DIR/public/flowwave-site"
VENDOR="$DEST/vendor"
mkdir -p "$VENDOR"
cp "$APP_DIR/node_modules/react/umd/react.production.min.js"         "$VENDOR/react.production.min.js"
cp "$APP_DIR/node_modules/react-dom/umd/react-dom.production.min.js" "$VENDOR/react-dom.production.min.js"
if [[ ! -s "$VENDOR/babel.min.js" ]]; then
  if [[ -s "$APP_DIR/public/regen-site/vendor/babel.min.js" ]]; then
    cp "$APP_DIR/public/regen-site/vendor/babel.min.js" "$VENDOR/babel.min.js"
  else
    echo "⬇️  Fetching Babel standalone (one-time)…"
    curl -sL -o "$VENDOR/babel.min.js" "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
  fi
fi

# Preload React before dc-runtime boots (avoids unpkg fetch blocked by CSP)
INDEX="$DEST/index.html"
if ! grep -q 'flowwave-site/vendor/react.production.min.js' "$INDEX"; then
  perl -pi -e '
    s|<script src="/flowwave-site/assets/([0-9a-f-]+\.js)"></script>|<script src="/flowwave-site/vendor/react.production.min.js"></script>\n<script src="/flowwave-site/vendor/react-dom.production.min.js"></script>\n<script src="/flowwave-site/assets/$1"></script>|;
  ' "$INDEX"
fi

# Repoint dc-runtime JS from unpkg → local vendor (Babel jsx imports)
DC_JS="$(ls "$DEST/assets"/*.js 2>/dev/null | head -1 || true)"
if [[ -n "$DC_JS" ]]; then
  perl -pi -e '
    s|https://unpkg.com/\@babel/standalone\@7.29.0/babel.min.js|/flowwave-site/vendor/babel.min.js|g;
    s|https://unpkg.com/react\@18.3.1/umd/react.production.min.js|/flowwave-site/vendor/react.production.min.js|g;
    s|https://unpkg.com/react-dom\@18.3.1/umd/react-dom.production.min.js|/flowwave-site/vendor/react-dom.production.min.js|g;
    s|s\.integrity = BABEL_SRI;\n||g;
    s|s\.integrity = integrity;\n|s.crossOrigin = "anonymous";\n|g if 0;
  ' "$DC_JS"
  # loadScript uses integrity — strip it for local vendor paths
  perl -pi -e '
    s|function loadScript\(src, integrity\) \{|function loadScript(src, _integrity) {|;
    s|s\.integrity = integrity;|/* local vendor — no SRI */|;
  ' "$DC_JS"
  echo "✅ Patched dc-runtime JS for local vendor (0 unpkg references)"
  REMAINING="$(grep -c 'unpkg.com' "$DC_JS" || true)"
  if [[ "$REMAINING" != "0" ]]; then
    echo "⚠️  Warning: $REMAINING unpkg.com reference(s) still in dc-runtime JS"
    grep -oE 'https://unpkg.com/[^"'"'"' ]+' "$DC_JS" | sort -u | sed 's/^/     /'
    exit 1
  fi
fi
echo "✅ Vendored react, react-dom, babel in flowwave-site/vendor/"

echo
echo "🎉 FlowWave site updated."
echo "   Next:  npm run dev   →   open http://localhost:3000/services/flowwave"
echo "   Then:  git add public/flowwave-site data/source/flowwave-shockwave-therapy.html && git commit && git push"
