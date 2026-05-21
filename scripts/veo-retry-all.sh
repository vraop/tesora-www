#!/bin/bash
# Auto-retry wrapper around scripts/veo-generate.ts.
# Sleeps 30 min between sweeps and stops once every clip in REQUIRED has been
# regenerated since this wrapper started. Run with:
#   nohup bash scripts/veo-retry-all.sh > /dev/null 2>&1 &
# Progress lands in .state/veo-retry.log.

set -u
cd "$(dirname "$0")/.."
mkdir -p .state
LOG=.state/veo-retry.log
START_TS=$(date +%s)

REQUIRED=(
  hero-loop.mp4 agents-loop.mp4 customers-loop.mp4 research-loop.mp4
  security-loop.mp4 careers-loop.mp4 about-loop.mp4 workbench-loop.mp4
  writing-loop.mp4 numbers-loop.mp4
  walkthrough-ingest-vertical.mp4 walkthrough-rater-vertical.mp4
  walkthrough-analyze-vertical.mp4 walkthrough-audit-vertical.mp4
  walkthrough-writing-vertical.mp4
)

# shellcheck disable=SC1091
set -a
source /Users/vraop/tesora-harness/.env
set +a

stamp() { date "+%Y-%m-%d %H:%M:%S"; }

is_fresh() {
  local p=$1
  [ -f "$p" ] || return 1
  local mt
  mt=$(stat -f%m "$p")
  [ "$mt" -ge "$START_TS" ]
}

count_remaining() {
  local n=0
  for f in "${REQUIRED[@]}"; do
    is_fresh "public/video/$f" || n=$((n + 1))
  done
  echo $n
}

attempts=0
max_attempts=96
while [ $attempts -lt $max_attempts ]; do
  attempts=$((attempts + 1))
  remaining=$(count_remaining)
  echo "[$(stamp)] sweep $attempts — $remaining clip(s) remaining" | tee -a "$LOG"

  for f in "${REQUIRED[@]}"; do
    p=public/video/$f
    if is_fresh "$p"; then continue; fi
    echo "[$(stamp)] generating $f" | tee -a "$LOG"
    bun scripts/veo-generate.ts "$f" 2>&1 | tee -a "$LOG"
  done

  if [ "$(count_remaining)" -eq 0 ]; then
    echo "[$(stamp)] all clips fresh — done" | tee -a "$LOG"
    osascript -e 'display notification "All Veo clips generated (Harvey/Legora direction)" with title "Tesora Veo"' 2>/dev/null || true
    exit 0
  fi

  echo "[$(stamp)] sleeping 30 min before sweep $((attempts + 1))" | tee -a "$LOG"
  sleep 1800
done

echo "[$(stamp)] gave up after $attempts sweeps" | tee -a "$LOG"
exit 1
