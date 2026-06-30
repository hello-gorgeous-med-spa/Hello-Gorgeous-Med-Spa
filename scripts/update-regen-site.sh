#!/usr/bin/env bash
#
# update-regen-site.sh — install a fresh RE GEN prototype export into the live site.
#
# The RE GEN page at /rx is a Claude/designcombo export served from
# public/regen-site/. The export loads React/ReactDOM/Babel from unpkg.com, which
# the site's CSP blocks — so every fresh export must be re-pointed at locally
# vendored copies or the page renders blank. This script does that automatically.
#
# Usage:
#   npm run update-regen -- "/path/to/exported/folder"
#   npm run update-regen -- "/path/to/folder" "RE GEN RX.dc.html"   # custom main file
#
# After it runs: review locally (npm run dev → /rx), then commit & push.

set -euo pipefail

# --- resolve paths -----------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DEST="$APP_DIR/public/regen-site"
VENDOR="$DEST/vendor"

SRC="${1:-}"
MAIN_HTML="${2:-}"

if [[ -z "$SRC" ]]; then
  echo "❌ Missing source folder."
  echo "   Usage: npm run update-regen -- \"/path/to/exported/folder\""
  exit 1
fi
if [[ ! -d "$SRC" ]]; then
  echo "❌ Source folder not found: $SRC"
  exit 1
fi

# --- find the main HTML file (the storefront page) ---------------------------
if [[ -z "$MAIN_HTML" ]]; then
  if [[ -f "$SRC/RE GEN RX.dc.html" ]]; then
    MAIN_HTML="RE GEN RX.dc.html"
  else
    # first .dc.html that is not a -print- variant
    MAIN_HTML="$(cd "$SRC" && ls -1 *.dc.html 2>/dev/null | grep -v -- '-print-' | head -1 || true)"
  fi
fi
if [[ -z "$MAIN_HTML" || ! -f "$SRC/$MAIN_HTML" ]]; then
  echo "❌ Could not find the main HTML file in $SRC"
  echo "   Pass it explicitly: npm run update-regen -- \"$SRC\" \"YOUR FILE.dc.html\""
  echo "   Available .dc.html files:"
  (cd "$SRC" && ls -1 *.dc.html 2>/dev/null | sed 's/^/     /') || true
  exit 1
fi

echo "📦 Source : $SRC"
echo "📄 Main   : $MAIN_HTML  →  index.html"
echo "📂 Dest   : $DEST"
echo

# --- copy the export into public/regen-site ----------------------------------
mkdir -p "$DEST"
cp "$SRC/$MAIN_HTML" "$DEST/index.html"
[[ -f "$SRC/support.js" ]] && cp "$SRC/support.js" "$DEST/support.js" || { echo "❌ support.js missing in export"; exit 1; }
[[ -d "$SRC/assets" ]] && rm -rf "$DEST/assets" && cp -R "$SRC/assets" "$DEST/assets"
[[ -d "$SRC/_ds" ]]   && rm -rf "$DEST/_ds"   && cp -R "$SRC/_ds"   "$DEST/_ds"
echo "✅ Copied index.html, support.js, assets/, _ds/"

# --- ensure vendored React/ReactDOM/Babel exist (CSP-safe, no unpkg) ---------
mkdir -p "$VENDOR"
cp "$APP_DIR/node_modules/react/umd/react.production.min.js"          "$VENDOR/react.production.min.js"
cp "$APP_DIR/node_modules/react-dom/umd/react-dom.production.min.js"  "$VENDOR/react-dom.production.min.js"
if [[ ! -s "$VENDOR/babel.min.js" ]]; then
  echo "⬇️  Fetching Babel standalone (one-time)…"
  curl -sL -o "$VENDOR/babel.min.js" "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
fi
echo "✅ Vendored react, react-dom, babel in vendor/"

# --- repoint support.js from unpkg.com to the local vendor copies ------------
perl -pi -e '
  s{https://unpkg\.com/react\@[0-9.]+/umd/react\.production\.min\.js}{/regen-site/vendor/react.production.min.js}g;
  s{https://unpkg\.com/react-dom\@[0-9.]+/umd/react-dom\.production\.min\.js}{/regen-site/vendor/react-dom.production.min.js}g;
  s{https://unpkg\.com/\@babel/standalone\@[0-9.]+/babel\.min\.js}{/regen-site/vendor/babel.min.js}g;
' "$DEST/support.js"

# --- verify no CDN references remain -----------------------------------------
REMAINING="$(grep -c 'unpkg.com' "$DEST/support.js" || true)"
if [[ "$REMAINING" != "0" ]]; then
  echo "⚠️  Warning: $REMAINING unpkg.com reference(s) still in support.js — page may be blank."
  grep -oE 'https://unpkg.com/[^"'"'"' ]+' "$DEST/support.js" | sort -u | sed 's/^/     /'
  exit 1
fi

# --- restore custom overrides (images that live in /images/regen/ instead of assets/) ---
# These are referenced by absolute paths in the HTML so they persist across exports.
echo "✅ Custom images stay in /images/regen/ (not overwritten by export)"

# --- add Hello Gorgeous integration script (login + checkout wiring) ---
if [[ ! -f "$DEST/hg-integration.js" ]]; then
  echo "⚠️  hg-integration.js missing — copy it from a previous deploy or regenerate"
else
  # Ensure the script tag is in the HTML
  if ! grep -q 'hg-integration.js' "$DEST/index.html"; then
    sed -i '' 's|</body>|<script src="hg-integration.js"></script>\n</body>|' "$DEST/index.html"
    echo "✅ Added hg-integration.js to index.html"
  else
    echo "✅ hg-integration.js already in index.html"
  fi
fi

echo
echo "🎉 RE GEN site updated and CSP-safe (0 unpkg references)."
echo "   Next:  npm run dev   →   open http://localhost:3000/rx   to review"
echo "   Then:  git add public/regen-site && git commit && git push"
echo
echo "📝 Note: Custom images live in public/images/regen/ — edit there, not in regen-site/assets/"
