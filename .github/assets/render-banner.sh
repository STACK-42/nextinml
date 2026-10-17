#!/usr/bin/env bash
# Renders banner.html to banner-light.png and banner-dark.png (1280x320)
# with headless Chrome. Needs Google Chrome and a network connection for the font.
set -euo pipefail

dir="$(cd "$(dirname "$0")" && pwd)"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

for theme in light dark; do
  "$chrome" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size=1280,320 \
    --virtual-time-budget=5000 \
    --screenshot="$dir/banner-$theme.png" "file://$dir/banner.html#$theme"
  echo "Wrote $dir/banner-$theme.png"
done
