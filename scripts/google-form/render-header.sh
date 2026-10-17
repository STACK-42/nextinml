#!/usr/bin/env bash
# Renders header.html to header.png (1600x400) with headless Chrome.
# Needs Google Chrome installed and a network connection for the font.
set -euo pipefail

dir="$(cd "$(dirname "$0")" && pwd)"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

"$chrome" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1600,400 \
  --virtual-time-budget=5000 \
  --screenshot="$dir/header.png" "file://$dir/header.html"

echo "Wrote $dir/header.png"
