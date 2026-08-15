#!/usr/bin/env bash
# Optimize a source clip for the CID "Two Ways of Seeing" lens previews.
#
# Usage: bash scripts/add-lens-clip.sh <source> <ethel|icarus> <name> [seconds]
#   e.g. bash scripts/add-lens-clip.sh public/assets/lens-src/fire2.mov icarus fire2
#        -> writes public/assets/video/greg-icarus-fire2.mp4  (+ a poster still)
#
# Handles MOV/HEVC input (re-encodes to browser-friendly H.264). Needs ffmpeg on
# PATH. If you don't have ffmpeg, upload the raw clip to the repo and ask Claude
# to run this step.
set -euo pipefail

SRC="${1:?source clip path}"
LENS="${2:?lens: ethel or icarus}"
NAME="${3:?short name, e.g. fire2}"
SECS="${4:-4}"

OUT="public/assets/video/greg-${LENS}-${NAME}.mp4"
STILL="public/assets/video/greg-${LENS}-${NAME}.webp"

ffmpeg -y -i "$SRC" -t "$SECS" -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 24 -preset veryfast \
  -movflags +faststart "$OUT"

# poster still ~1.2s in (optional; used when this clip's lens is paused)
ffmpeg -y -ss 1.2 -i "$OUT" -frames:v 1 "${STILL%.webp}.png" >/dev/null 2>&1 || true

echo "wrote $OUT"
echo "Next: add  \`\${V}greg-${LENS}-${NAME}.mp4\`  to the ${LENS} clips[] array"
echo "in src/app/components/CID.tsx (GregLensSlider), then build + deploy."
