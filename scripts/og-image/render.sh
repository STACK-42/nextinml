#!/usr/bin/env bash
# Renders og.html to public/og.png (1200x630) with headless Chrome.
# Needs Google Chrome and a network connection for the font.
set -euo pipefail

dir="$(cd "$(dirname "$0")" && pwd)"
out="$dir/../../public/og.png"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

"$chrome" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=5000 \
  --screenshot="$out" "file://$dir/og.html"

echo "Wrote $out"
